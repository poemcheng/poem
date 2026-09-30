"""Deterministic, authored seamless material maps. These are NOT campus photographs.
No third-party images, executable downloads, or online runtime dependencies.
"""
from pathlib import Path
import numpy as np, base64, json, io
from PIL import Image, ImageDraw, ImageFilter
from scipy.ndimage import gaussian_filter
ROOT=Path(__file__).resolve().parents[1]; N=512
rng=np.random.default_rng(20260930)
y,x=np.mgrid[:N,:N]
def noise(scale=8):
 a=gaussian_filter(rng.normal(size=(N,N)),scale,mode='wrap');return a/(a.std()+1e-6)
def save(name,rgb,height,rough=.8,alpha=None):
 rgb=np.clip(rgb,0,255).astype('uint8');h=height.astype(float)
 dx=(np.roll(h,-1,1)-np.roll(h,1,1))*.07;dy=(np.roll(h,-1,0)-np.roll(h,1,0))*.07
 normal=np.stack([-dx,-dy,np.ones_like(dx)],2);normal/=np.linalg.norm(normal,axis=2,keepdims=True)
 norm=np.empty((N,N,4),'uint8');norm[:,:,:3]=np.uint8(np.clip(normal*.5+.5,0,1)*255);norm[:,:,3]=np.clip(rough*255+noise(2)*4,0,255).astype('uint8')
 rgba=np.dstack([rgb,alpha if alpha is not None else np.full((N,N),255,'uint8')]);files=[]
 for suffix,arr in [('albedo',rgba),('normal_roughness',norm)]:
  im=Image.fromarray(arr);p=ROOT/'assets'/'textures'/f'{name}_{suffix}.png';im.save(p,optimize=True);files.append('data:image/png;base64,'+base64.b64encode(p.read_bytes()).decode())
 return files
maps=[]
# plain material (usually uses vertex color)
b=np.ones((N,N));maps.append(save('plain',np.stack([b*245]*3,2),b,0.7))
# brick: varied fired-clay faces, irregular mortar and weathering
row=y//32;off=(row%2)*64;col=((x+off)//128)%4
brng=np.random.default_rng(42);variation=brng.uniform(-15,15,(16,4))[row,col]
mortar=(((x+off)%128)<4)|((y%32)<4)
bn=noise(1)*3+noise(6)*4+noise(26)*4
base=np.stack([143+variation+bn,88+variation*.6+bn*.8,64+variation*.35+bn*.6],2)
base[mortar]=np.stack([153+bn,145+bn,125+bn],2)[mortar]
h=np.where(mortar,3,20)+bn*.55
maps.append(save('red_brick',base,h,.86))
# fine weathered limestone / concrete
v=noise(.65)*2+noise(5)*2+noise(38)*4
rgb=np.stack([184+v,178+v,159+v],2);maps.append(save('limestone',rgb,v+noise(2)*4,.88))
# square pavement, subtle bevels + irregular stains
u=x%128;v=y%128;seam=(u<3)|(v<3);n=noise(1)*3+noise(28)*5;tile=rng.uniform(-8,8,(4,4))[y//128,x//128]
a=169+n+tile;a[seam]=85+n[seam];maps.append(save('paving_stone',np.stack([a,a*.986,a*.94],2),np.where(seam,1,13)+n*.45,.87))
# asphalt aggregate / no square pattern
v=noise(.4)*8+noise(1.5)*5+noise(20)*2;rgb=np.stack([71+v,74+v,72+v],2);maps.append(save('asphalt',rgb,v*.7,.94))
# mown grass ground
v=noise(.5)*5+noise(2)*3+noise(17)*3+noise(44)*1;rgb=np.stack([70+v*.8,78+v,52+v*.4],2);maps.append(save('grass',rgb,v,.97))
# wood grain long anisotropic lines
v=gaussian_filter(rng.normal(size=(N,N)),(1,24),mode='wrap');v/=v.std();v=v*6+3*np.sin(y*.1+noise(45));rgb=np.stack([119+v,83+v*.8,53+v*.5],2);maps.append(save('wood',rgb,v,.76))
# terracotta roof tiles with convex semicircular channels
u=(x%32)/32;h=np.sin(u*np.pi)*10+np.where(y%85<4,-4,0);v=noise(2)*4+noise(22)*4;rgb=np.stack([153+v+h*.7,88+v*.5+h*.3,60+v*.6],2);maps.append(save('roof_tile',rgb,h,.89))
# Fine aggregate terrazzo: anti-aliased irregular flecks, not pixel squares.
v=noise(.65)*1.8+noise(16)*1.2;a=192+v;rgb=np.stack([a,a-1,a-7],2)
im=Image.fromarray(np.uint8(np.clip(rgb,0,255))).resize((1024,1024));dr=ImageDraw.Draw(im)
for i in range(15000):
 xx,yy=rng.integers(1024,size=2);r=float(rng.uniform(.4,1.7));val=int(rng.choice([161,177,186,205,215]));dr.ellipse([xx-r,yy-r,xx+r,yy+r],fill=(val,val-1,val-4))
im=im.resize((N,N),Image.Resampling.LANCZOS);rgb=np.array(im).astype(float)
seam=(x%128<1)|(y%128<1);rgb[seam]=[165,164,159];maps.append(save('terrazzo',rgb,np.where(seam,-1,0)+v*.05,.42))
# brushed metal
v=gaussian_filter(rng.normal(size=(N,N)),(.2,11),mode='wrap');v=v/v.std()*4;rgb=np.stack([145+v,150+v,151+v],2);maps.append(save('brushed_metal',rgb,v*.2,.32))
# glass and foliage placeholders handled by shader
maps.append(save('glass',np.ones((N,N,3))*220,np.zeros((N,N)),.18))
# clustered broadleaf foliage; alpha-cutout, multiple sizes, no cloud-shaped spheres
im=Image.new('RGBA',(N,N));dr=ImageDraw.Draw(im)
for i in range(145):
 a=rng.uniform(0,np.pi*2);r=(rng.random()**.5)*220;cx=256+np.cos(a)*r;cy=256+np.sin(a)*r
 rot=rng.uniform(-np.pi,np.pi);L=rng.uniform(13,33);W=L*.43
 pts=[]
 for k in range(12):
  t=k*np.pi*2/12;px=np.cos(t)*L;py=np.sin(t)*W;pts.append((cx+px*np.cos(rot)-py*np.sin(rot),cy+px*np.sin(rot)+py*np.cos(rot)))
 shade=rng.integers(-15,24);dr.polygon(pts,fill=(52+int(shade),89+int(shade),34+int(shade)//2,255));dr.line([pts[0],pts[6]],fill=(84+int(shade),108+int(shade),49,255),width=1)
a=np.array(im);maps.append(save('broadleaf',a[:,:,:3],noise(2)*2,.91,a[:,:,3]))
maps.append(save('water',np.ones((N,N,3))*190,noise(5)*2,.12))
maps.append(save('light',np.ones((N,N,3))*255,np.zeros((N,N)),.7))
# brick paving larger, herringbone visual variation
cell=((x//48)+(y//48))%2;u=np.where(cell==0,x%48,y%48);v=np.where(cell==0,y%48,x%48);seam=(u<3)|(v<3)|(u%24<2);n=noise(1)*3+noise(10)*4;var=rng.uniform(-8,8,(11,11))[y//48,x//48];rgb=np.stack([141+n+var,91+n+var*.7,72+n+var*.5],2);rgb[seam]=[95,86,73];maps.append(save('brick_paving',rgb,np.where(seam,0,8)+n*.6,.88))
# granite
v=noise(.35)*10+noise(4)*5;rgb=np.stack([151+v,154+v,145+v],2);maps.append(save('granite',rgb,v*.2,.55))
(ROOT/'assets'/'materials.js').write_text('window.CQ=window.CQ||{};CQ.TEXTURE_DATA='+json.dumps(maps,separators=(',',':'))+';\n',encoding='utf8')
print('Generated',len(maps),'materials. Inline bytes:',(ROOT/'assets'/'materials.js').stat().st_size)
