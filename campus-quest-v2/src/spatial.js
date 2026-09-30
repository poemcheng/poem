'use strict';
/* All elevations, slab dimensions and stair geometry are authored metres,
 * not a cadastral survey, DEM, BIM, fire plan or accessibility certification.
 * Map-up follows the illustrated campus map (dormitory direction), NOT true north.
 */
(()=>{
const D=CQ.DATA,M=CQ.M;
D.version='2.0.0';D.title='朝陽校園探索｜建築空間版';D.spawn={x:8,z:202,yaw:0};
D.buildings.forEach(b=>{b.enterable=!['HALL','K','HANGAR'].includes(b.id);b.floorHeight=3.8;b.floors=b.id==='E'?6:b.floors;b.h=b.floors*b.floorHeight;b.base=baseTerrain(b.x,b.z)+.12;b.geometryQuality='photo-informed-authored';b.heightQuality='authored-not-surveyed';b.interiorQuality=b.enterable?'authored-walkable-floors':'exterior-only';b.stair={x:b.x+b.w/2-7,z:b.z+b.d/2-13};b.lift={x:b.x+b.w/2-4,z:b.z+b.d/2-3.8};});
function smooth(x){x=M.clamp(x,0,1);return x*x*(3-2*x);}
function baseTerrain(x,z){let s=(205-z)*.057;let ridge=8*Math.exp(-((x+130)**2/25000+(z+175)**2/42000));let hill=Math.max(0,-z-242)*.30+Math.max(0,Math.abs(x)-235)*.13;return s+ridge+hill;}
CQ.ground=(x,z)=>{let h=baseTerrain(x,z);for(const b of D.buildings){let dx=Math.max(Math.abs(x-b.x)-b.w/2-1.3,0),dz=Math.max(Math.abs(z-b.z)-b.d/2-1.3,0),d=Math.hypot(dx,dz);if(d<11){let t=smooth(d/11);h=(b.base-.12)*(1-t)+h*t;}}return h;};
CQ.terrainInfo={source:'Authored heightfield; no survey/DEM loaded',units:'virtual metres',reference:'entrance-area local datum, NOT sea level'};
class Spatial{
 constructor(){this.surfaces=[];this.solids=[];this.gridS=new Map();this.gridB=new Map();this.cell=8;}
 keys(x0,z0,x1,z1){let r=[];for(let x=Math.floor(x0/this.cell);x<=Math.floor(x1/this.cell);x++)for(let z=Math.floor(z0/this.cell);z<=Math.floor(z1/this.cell);z++)r.push(x+','+z);return r;}
 addSurface(s){s.id=this.surfaces.length;s.x0=s.x-s.w/2;s.x1=s.x+s.w/2;s.z0=s.z-s.d/2;s.z1=s.z+s.d/2;this.surfaces.push(s);for(let k of this.keys(s.x0,s.z0,s.x1,s.z1)){if(!this.gridS.has(k))this.gridS.set(k,[]);this.gridS.get(k).push(s);}return s;}
 addSolid(b){b.id=this.solids.length;b.x0=b.x-b.w/2;b.x1=b.x+b.w/2;b.z0=b.z-b.d/2;b.z1=b.z+b.d/2;this.solids.push(b);for(let k of this.keys(b.x0,b.z0,b.x1,b.z1)){if(!this.gridB.has(k))this.gridB.set(k,[]);this.gridB.get(k).push(b);}return b;}
 nearby(x,z,r=0,kind='s'){let grid=kind==='s'?this.gridS:this.gridB,set=new Set();for(let k of this.keys(x-r,z-r,x+r,z+r))for(let q of grid.get(k)||[])set.add(q);return [...set];}
 height(s,x,z){return s.y+(s.sx||0)*(x-s.x)+(s.sz||0)*(z-s.z);}
 contains(s,x,z,inset=0){return x>=s.x0+inset&&x<=s.x1-inset&&z>=s.z0+inset&&z<=s.z1-inset;}
 support(x,z,ceiling=Infinity){let best={y:CQ.ground(x,z)+.045,kind:'terrain',floor:0,building:null};if(best.y>ceiling+.001)best.y=-Infinity;for(let s of this.nearby(x,z)){if(!this.contains(s,x,z))continue;let y=this.height(s,x,z);if(y<=ceiling+.0001&&y>best.y)best={...s,y};}return best;}
 blocked(x,y,z,r=.30,body=1.65){for(let b of this.nearby(x,z,r,'b')){if(b.disabled||y+.26>=b.y1||y+body<=b.y0+.015)continue;let dx=Math.max(b.x0-x,0,x-b.x1),dz=Math.max(b.z0-z,0,z-b.z1);if(dx*dx+dz*dz<r*r)return true;}return false;}
 safe(x,y,z,r=.30){let b=D.boundary;return x>b.minX&&x<b.maxX&&z>b.minZ&&z<b.maxZ&&!this.blocked(x,y,z,r);}
 move(p,dx,dz,r=.3){let n=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.12)),old=[p.x,p.y,p.z];for(let i=0;i<n;i++)for(let axis of ['x','z']){let x=p.x+(axis==='x'?dx/n:0),z=p.z+(axis==='z'?dz/n:0),s=this.support(x,z,p.y+.24);if(!Number.isFinite(s.y)||s.y>p.y+.24)continue;if(this.safe(x,Math.max(s.y,p.y-.20),z,r)){p.x=x;p.z=z;if(s.y>=p.y-.32)p.y=s.y;}}return Math.hypot(p.x-old[0],p.y-old[1],p.z-old[2]);}
 gravity(p,dt){let s=this.support(p.x,p.z,p.y+.06);if(!Number.isFinite(s.y))return;if(p.y>s.y+.02){p.vy=(p.vy||0)-9.81*dt;p.y=Math.max(s.y,p.y+p.vy*dt);}else{p.y=s.y;p.vy=0;}return s;}
 segment(a,b){let d=M.sub(b,a),best=null;const hit=(t,type,obj,y)=>{if(t>=0&&t<=1&&(!best||t<best.t))best={t,type,obj,p:M.add(a,M.scale(d,t)),y};};
  let keys=this.keys(Math.min(a[0],b[0]),Math.min(a[2],b[2]),Math.max(a[0],b[0]),Math.max(a[2],b[2])),surfaces=new Set(),boxes=new Set();for(let k of keys){for(let s of this.gridS.get(k)||[])surfaces.add(s);for(let s of this.gridB.get(k)||[])boxes.add(s);}
  for(let s of surfaces){let da=a[1]-this.height(s,a[0],a[2]),db=b[1]-this.height(s,b[0],b[2]);if(da>=0&&db<=0&&da-db>1e-7){let t=da/(da-db),x=a[0]+d[0]*t,z=a[2]+d[2]*t;if(this.contains(s,x,z))hit(t,'floor',s,this.height(s,x,z));}}
  for(let s of boxes){if(s.disabled)continue;let lo=0,hi=1;for(let i=0;i<3;i++){let min=[s.x0,s.y0,s.z0][i],max=[s.x1,s.y1,s.z1][i];if(Math.abs(d[i])<1e-8){if(a[i]<min||a[i]>max){lo=2;break;}}else{let t0=(min-a[i])/d[i],t1=(max-a[i])/d[i];lo=Math.max(lo,Math.min(t0,t1));hi=Math.min(hi,Math.max(t0,t1));}}if(lo<=hi&&hi>=0&&lo<=1)hit(Math.max(0,lo),'wall',s);}
  let da=a[1]-CQ.ground(a[0],a[2])-.045,db=b[1]-CQ.ground(b[0],b[2])-.045;if(da>=0&&db<=0){let t=da/(da-db);hit(t,'terrain',null);}return best;
 }
 arc(o,dir,feet){let points=[o],hit=null;for(let i=1;i<=100;i++){let t=i*.024,p=M.add(o,M.add(M.scale(dir,t*7.8),[0,-4.9*t*t,0])),h=this.segment(points.at(-1),p);if(h){points.push(h.p);if(h.type!=='wall'){let [x,y,z]=h.p;if(Math.abs(y-feet.y)<2.15&&Math.hypot(x-feet.x,z-feet.z)<14&&this.safe(x,y+.02,z))hit={x,y:y+.008,z};}break;}points.push(p);}return{points,hit};}
 location(p){let candidates=D.buildings.filter(b=>b.enterable&&Math.abs(p.x-b.x)<b.w/2+1&&Math.abs(p.z-b.z)<b.d/2+1&&p.y>=b.base-.20&&p.y<b.base+b.h+.25);let b=candidates[0];if(!b)return{building:null,floor:0,title:'主校區 · 戶外'};let f=M.clamp(Math.floor((p.y-b.base+.14)/b.floorHeight)+1,1,b.floors);return{building:b.id,floor:f,title:b.name+' · '+f+'F'};}
}
CQ.Spatial=Spatial;
})();
