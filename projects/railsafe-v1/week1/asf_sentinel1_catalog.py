"""Read-only Sentinel-1 IW SLC catalogue query for RailSafe."""
import argparse,csv,json
from pathlib import Path

def main():
    p=argparse.ArgumentParser()
    p.add_argument('--west',type=float,default=121.50)
    p.add_argument('--south',type=float,default=24.05)
    p.add_argument('--east',type=float,default=121.85)
    p.add_argument('--north',type=float,default=24.35)
    p.add_argument('--start',default='2024-06-01')
    p.add_argument('--end',default='2024-07-31')
    p.add_argument('--out',default='asf_search_results')
    a=p.parse_args()
    if not (-180<=a.west<a.east<=180 and -90<=a.south<a.north<=90): raise ValueError("Invalid bbox")
    import asf_search as asf
    wkt=f'POLYGON(({a.west} {a.south},{a.east} {a.south},{a.east} {a.north},{a.west} {a.north},{a.west} {a.south}))'
    results=asf.search(platform=asf.PLATFORM.SENTINEL1,processingLevel=asf.PRODUCT_TYPE.SLC,beamMode='IW',intersectsWith=wkt,start=a.start+'T00:00:00Z',end=a.end+'T23:59:59Z',maxResults=100)
    out=Path(a.out);out.mkdir(parents=True,exist_ok=True)
    (out/'scenes.geojson').write_text(json.dumps(results.geojson(),ensure_ascii=False),encoding='utf-8')
    with (out/'scenes.csv').open('w',newline='',encoding='utf-8') as f:
        w=csv.writer(f);w.writerow(['scene_id','acquired_at','relative_orbit','flight_direction','polarization','status'])
        for scene in results:
            x=scene.properties
            w.writerow([x.get('sceneName'),x.get('startTime'),x.get('relativeOrbit'),x.get('flightDirection'),x.get('polarization'),'CATALOG_ONLY'])
    print(len(results),'scenes in catalog (unpaired)')
if __name__=='__main__': main()
