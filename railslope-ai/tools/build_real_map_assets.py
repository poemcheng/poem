#!/usr/bin/env python3
from pathlib import Path
import io, json, math
import numpy as np
import requests
from PIL import Image
import rasterio
from rasterio.warp import reproject, Resampling
from rasterio.transform import from_bounds

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets"
OUT.mkdir(parents=True, exist_ok=True)
TMP = ROOT / ".tmp_realmap"
TMP.mkdir(exist_ok=True)

Z = 8
X0, X1 = 213, 214
Y0, Y1 = 109, 112
TILE = 256
WIDTH = (X1-X0+1)*TILE
HEIGHT = (Y1-Y0+1)*TILE
WORLD = 20037508.342789244
UA = "RailSlope-HackRail/1.0 (+GitHub Actions; non-commercial prototype)"

def merc_x(tile_x):
    return -WORLD + (tile_x/(2**Z))*(2*WORLD)

def merc_y(tile_y):
    return WORLD - (tile_y/(2**Z))*(2*WORLD)

MINX = merc_x(X0)
MAXX = merc_x(X1+1)
MAXY = merc_y(Y0)
MINY = merc_y(Y1+1)

def lon_from_x(x):
    return x / WORLD * 180.0

def lat_from_y(y):
    return math.degrees(2 * math.atan(math.exp(y / 6378137.0)) - math.pi / 2)

BOUNDS_WGS84 = [lon_from_x(MINX), lat_from_y(MINY), lon_from_x(MAXX), lat_from_y(MAXY)]

def get(url, timeout=60):
    r = requests.get(url, headers={"User-Agent": UA}, timeout=timeout)
    r.raise_for_status()
    return r

def download(url, path):
    if path.exists() and path.stat().st_size > 1024:
        return
    with get(url, 120) as r:
        path.write_bytes(r.content)

def get_tile(z, x, y):
    candidates = [
        f"https://wmts.nlsc.gov.tw/wmts/EMAP5_OPENDATA/default/GoogleMapsCompatible/{z}/{y}/{x}",
        f"https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    ]
    for url in candidates:
        try:
            r = get(url, 30)
            im = Image.open(io.BytesIO(r.content)).convert("RGB")
            if im.size == (256,256):
                return im, url
        except Exception as e:
            print("tile failed", url, e)
    return Image.new("RGB",(256,256),(232,238,242)), "generated-fallback"

print("Building real Taiwan basemap mosaic...")
mosaic = Image.new("RGB",(WIDTH,HEIGHT),(232,238,242))
tile_sources = []
for ty in range(Y0,Y1+1):
    for tx in range(X0,X1+1):
        im, src = get_tile(Z,tx,ty)
        mosaic.paste(im,((tx-X0)*TILE,(ty-Y0)*TILE))
        tile_sources.append(src)

dem_path = TMP / "taiwan.tif"
print("Downloading SRTM DEM...")
download("https://raw.githubusercontent.com/TopoToolbox/DEMs/master/taiwan.tif", dem_path)

print("Reprojecting DEM to Web Mercator tile grid...")
target = np.zeros((HEIGHT,WIDTH), dtype=np.float32)
with rasterio.open(dem_path) as ds:
    dst_transform = from_bounds(MINX,MINY,MAXX,MAXY,WIDTH,HEIGHT)
    reproject(
        source=rasterio.band(ds,1),
        destination=target,
        src_transform=ds.transform,
        src_crs=ds.crs,
        dst_transform=dst_transform,
        dst_crs="EPSG:3857",
        dst_nodata=0,
        resampling=Resampling.bilinear,
    )

target = np.nan_to_num(target, nan=0.0, posinf=0.0, neginf=0.0)
target[target < 0] = 0
target[target > 4500] = 4500
max_elev = float(target.max())
print("DEM elevation max:", max_elev)

# Real hillshade
xres = (MAXX-MINX)/WIDTH
yres = (MAXY-MINY)/HEIGHT
gy, gx = np.gradient(target, yres, xres)
slope = np.arctan(np.sqrt(gx*gx + gy*gy))
aspect = np.arctan2(-gx, gy)
az = math.radians(315)
alt = math.radians(45)
shade = np.sin(alt)*np.cos(slope) + np.cos(alt)*np.sin(slope)*np.cos(az-aspect)
shade = np.clip((shade+1.0)/2.0,0,1)
shade[target<=0] = 0.68

base = np.asarray(mosaic).astype(np.float32)
factor = (0.67 + 0.48*shade)[...,None]
relief = np.clip(base*factor,0,255).astype(np.uint8)
Image.fromarray(relief).save(OUT/"taiwan_basemap_relief.png", optimize=True)

height8 = np.clip(target/4000.0*255.0,0,255).astype(np.uint8)
Image.fromarray(height8, mode="L").save(OUT/"taiwan_dem_height.png", optimize=True)

# stronger visual hillshade, useful as a debugging layer
hs = np.clip(shade*255,0,255).astype(np.uint8)
Image.fromarray(hs, mode="L").save(OUT/"taiwan_hillshade.png", optimize=True)

meta = {
    "projection":"EPSG:3857",
    "tile_zoom":Z,
    "tile_range":{"x":[X0,X1],"y":[Y0,Y1]},
    "pixel_size":[WIDTH,HEIGHT],
    "mercator_bounds":[MINX,MINY,MAXX,MAXY],
    "wgs84_bounds":BOUNDS_WGS84,
    "dem_source":"TopoToolbox/DEMs taiwan.tif (SRTM-3, ~90m)",
    "dem_max_m":max_elev,
    "height_encoding":"gray8 = clamp(elevation_m / 4000 * 255)",
    "basemap_source":"NLSC EMAP5_OPENDATA; OSM fallback per tile",
    "tile_sources":tile_sources,
}
(OUT/"realmap_meta.json").write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8")

print("Downloading real railway geometry...")
for name in ("track_lines.geojson","track_stations.geojson"):
    url=f"https://raw.githubusercontent.com/siriushsu/taiwan-rail-live/main/data/{name}"
    data=get(url,120).json()
    features=[]
    for f in data.get("features",[]):
        sys=str(f.get("properties",{}).get("sys",""))
        if sys.startswith("tra"):
            features.append(f)
    data["features"]=features
    data["source_repo"]="siriushsu/taiwan-rail-live"
    (OUT/("tra_"+name)).write_text(json.dumps(data,ensure_ascii=False,separators=(",",":")),encoding="utf-8")
    print(name, len(features),"TRA features")


print("Downloading local Three.js runtime...")
vendor = ROOT / "vendor"
vendor.mkdir(parents=True, exist_ok=True)
three_urls = {
    "three.module.js":"https://raw.githubusercontent.com/mrdoob/three.js/master/build/three.module.js",
    "OrbitControls.js":"https://raw.githubusercontent.com/mrdoob/three.js/master/examples/jsm/controls/OrbitControls.js",
}
for name,url in three_urls.items():
    r=get(url,120)
    (vendor/name).write_bytes(r.content)

sources={
    "basemap":{"name":"NLSC 臺灣通用電子地圖(套疊等高線)OpenData","url":"https://wmts.nlsc.gov.tw/wmts","layer":"EMAP5_OPENDATA"},
    "terrain":{"name":"SRTM-3 DEM of Taiwan","url":"https://github.com/TopoToolbox/DEMs/blob/main/taiwan.tif"},
    "railway":{"name":"taiwan-rail-live track_lines.geojson (derived from TRA/OSM project data)","url":"https://github.com/siriushsu/taiwan-rail-live"},
}
(OUT/"sources.json").write_text(json.dumps(sources,ensure_ascii=False,indent=2),encoding="utf-8")
print("Assets written to", OUT)
