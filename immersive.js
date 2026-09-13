import * as THREE from 'three';
import { SITE, FLOOR_TWIN, LABS } from './data/digital-twin-data.js';

const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const viewport = $('#viewport');
const labelsRoot = $('#labels');
const detail = $('#detail');
const quickbar = $('#quickbar');
const loader = $('#loader');

let campusGeoJSON = null;
try {
  campusGeoJSON = await fetch('./data/campus.geojson', {cache:'no-store'}).then(r => {
    if (!r.ok) throw new Error(`campus.geojson HTTP ${r.status}`);
    return r.json();
  });
} catch (err) {
  console.error(err);
  loader.innerHTML = `<b>campus.geojson 載入失敗</b><small>${String(err)}</small>`;
  throw err;
}

const state = {
  mode: 'campus',
  floor: 6,
  lab: 'E-609',
  equipment: null,
  cameraMode: 'overview',
  labels: [],
  moved: false,
  campusGeoJSON
};

const C = {
  bg: 0x07131f, cyan:0x4edfff, gold:0xf2c56a, green:0x68d99c,
  blue:0x315d7a, blue2:0x27485f, wall:0xf0ede6, floor:0xdecfac,
  metal:0xbcc7cf, dark:0x252b31, black:0x101419, glass:0xa8d8ee,
  urBlue:0x6ebde8, tmDark:0x4a4f55, fanuc:0xf2b515, white:0xf4f5f6
};

const renderer = new THREE.WebGLRenderer({antialias:true, alpha:false});
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
viewport.prepend(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(C.bg);
scene.fog = new THREE.Fog(C.bg, 45, 190);
const world = new THREE.Group();
scene.add(world);

const camera = new THREE.PerspectiveCamera(45, 1, 0.08, 500);
const cam = {
  yaw: .75, pitch: .48, dist: 95, target: new THREE.Vector3(),
  gyaw:.75, gpitch:.48, gdist:95, gtarget:new THREE.Vector3(),
  minDist: 5, maxDist: 160
};

scene.add(new THREE.HemisphereLight(0xe7f8ff, 0x1b2630, 1.25));
const sun = new THREE.DirectionalLight(0xffffff, 1.25);
sun.position.set(24, 34, 18); sun.castShadow = true; sun.shadow.mapSize.set(2048,2048);
sun.shadow.camera.left=-60;sun.shadow.camera.right=60;sun.shadow.camera.top=60;sun.shadow.camera.bottom=-60;
scene.add(sun);
scene.add(new THREE.AmbientLight(0x597b93,.3));

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let dragging = false, last = [0,0], down = [0,0];

function setCamera(yaw,pitch,dist,target,min=5,max=160){
  cam.gyaw=yaw;cam.gpitch=pitch;cam.gdist=dist;cam.gtarget.copy(target);cam.minDist=min;cam.maxDist=max;
}
function updateCamera(){
  cam.yaw+=(cam.gyaw-cam.yaw)*.10;cam.pitch+=(cam.gpitch-cam.pitch)*.10;cam.dist+=(cam.gdist-cam.dist)*.10;cam.target.lerp(cam.gtarget,.10);
  const cp=Math.cos(cam.pitch);
  camera.position.set(cam.target.x+cam.dist*cp*Math.sin(cam.yaw),cam.target.y+cam.dist*Math.sin(cam.pitch),cam.target.z+cam.dist*cp*Math.cos(cam.yaw));
  camera.lookAt(cam.target);
}

renderer.domElement.addEventListener('pointerdown',e=>{dragging=true;state.moved=false;last=[e.clientX,e.clientY];down=[e.clientX,e.clientY];renderer.domElement.setPointerCapture(e.pointerId)});
renderer.domElement.addEventListener('pointermove',e=>{if(!dragging)return;const dx=e.clientX-last[0],dy=e.clientY-last[1];if(Math.hypot(e.clientX-down[0],e.clientY-down[1])>4)state.moved=true;cam.gyaw+=dx*.006;cam.gpitch=Math.max(.05,Math.min(1.25,cam.gpitch+dy*.005));last=[e.clientX,e.clientY]});
renderer.domElement.addEventListener('pointerup',e=>{dragging=false;if(!state.moved)pick(e)});
renderer.domElement.addEventListener('wheel',e=>{e.preventDefault();cam.gdist=Math.max(cam.minDist,Math.min(cam.maxDist,cam.gdist*Math.exp(e.deltaY*.0011)))},{passive:false});

function pick(e){
  const r=renderer.domElement.getBoundingClientRect();
  pointer.x=((e.clientX-r.left)/r.width)*2-1;pointer.y=-((e.clientY-r.top)/r.height)*2+1;
  raycaster.setFromCamera(pointer,camera);
  const hits=raycaster.intersectObjects(world.children,true);
  for(const hit of hits){
    let o=hit.object;
    while(o&&o!==world&&!o.userData.action)o=o.parent;
    if(o?.userData?.action){o.userData.action();break;}
  }
}

function dispose(obj){obj.traverse(o=>{o.geometry?.dispose?.();if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{m.map?.dispose?.();m.dispose?.()})}})}
function clearWorld(){state.labels.forEach(x=>x.el.remove());state.labels=[];while(world.children.length){const o=world.children.pop();dispose(o)}}

function mat(color,opts={}){return new THREE.MeshStandardMaterial({color,roughness:.7,metalness:.05,...opts})}
function metal(color=C.metal){return mat(color,{roughness:.38,metalness:.65})}
function box(w,h,d,color=C.white){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(color));m.castShadow=true;m.receiveShadow=true;return m}
function cyl(r,h,color=C.metal,segments=14){const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,segments),metal(color));m.castShadow=true;m.receiveShadow=true;return m}
function sphere(r,color=C.metal){const m=new THREE.Mesh(new THREE.SphereGeometry(r,14,10),metal(color));m.castShadow=true;return m}
function flatPlane(w,d,color=C.floor){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,d),mat(color,{roughness:.95}));m.rotation.x=-Math.PI/2;m.receiveShadow=true;return m}
function addPick(group,action){group.userData.action=action;return group}

function addLabel(obj,text,cls=''){
  const el=document.createElement('button');el.className=`label ${cls}`.trim();el.textContent=text;el.onclick=()=>obj.userData.action?.();labelsRoot.appendChild(el);state.labels.push({obj,el});
}
function updateLabels(){
  const rect=renderer.domElement.getBoundingClientRect();
  for(const {obj,el} of state.labels){const p=obj.getWorldPosition(new THREE.Vector3()).project(camera);const vis=p.z>-1&&p.z<1;el.style.display=vis?'block':'none';if(!vis)continue;el.style.left=`${(p.x*.5+.5)*rect.width}px`;el.style.top=`${(-p.y*.5+.5)*rect.height}px`}
}
function labelAnchor(x,y,z,action){const o=new THREE.Object3D();o.position.set(x,y,z);o.userData.action=action;world.add(o);return o}

function canvasTexture(draw,w=1024,h=512){const c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d');draw(ctx,w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t}
function textPlane(text,sub,w=5.7,h=1.3){const tex=canvasTexture((ctx,W,H)=>{ctx.fillStyle='#f4f2ec';ctx.fillRect(0,0,W,H);ctx.fillStyle='#14345a';ctx.font='bold 68px sans-serif';ctx.fillText(text,34,105);ctx.fillStyle='#355b7d';ctx.font='30px sans-serif';ctx.fillText(sub,34,160);ctx.strokeStyle='#477da5';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(34,200);ctx.lineTo(W-34,200);ctx.stroke()});return new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tex}))}

const buildingColors={E:C.cyan,T:0x466d83,M:0x3b6278,D:0x496c84,I:0x355a70,H:0x4b6878,L:0x355f77,A:0x395666,G:0x45606d};
function geoToLocal([lon,lat]){const [clon,clat]=SITE.campusCenter;return[(lon-clon)*Math.cos(clat*Math.PI/180)*111320,-(lat-clat)*110540]}
function featureCenter(feature){const pts=feature.geometry.coordinates[0].map(geoToLocal);const v=pts.reduce((a,p)=>[a[0]+p[0],a[1]+p[1]],[0,0]);return[v[0]/pts.length,v[1]/pts.length]}
function extrudeFeature(feature,baseY=0,scale=1){const pts=feature.geometry.coordinates[0].map(geoToLocal);const sh=new THREE.Shape();pts.forEach(([x,z],i)=>i?sh.lineTo(x*scale,-z*scale):sh.moveTo(x*scale,-z*scale));const h=(feature.properties.height||feature.properties.levels*3.6)*scale;const g=new THREE.ExtrudeGeometry(sh,{depth:h,bevelEnabled:false});g.rotateX(-Math.PI/2);g.translate(0,baseY,0);const mesh=new THREE.Mesh(g,mat(buildingColors[feature.properties.code]||C.blue,{roughness:.5,metalness:.1,emissive:feature.properties.code==='E'?0x07303c:0x061018,emissiveIntensity:.35}));mesh.castShadow=true;mesh.receiveShadow=true;return mesh}

function campusGround(){const g=flatPlane(240,200,0x102b3b);world.add(g);const grid=new THREE.GridHelper(240,32,0x2b6179,0x1b3848);grid.position.y=.03;world.add(grid)}
function renderCampus(){
  clearWorld();state.mode='campus';state.equipment=null;state.cameraMode='overview';syncUI();campusGround();
  for(const f of campusGeoJSON.features){const p=f.properties,mesh=extrudeFeature(f);addPick(mesh,()=>p.code==='E'?renderBuilding():showBuilding(p));world.add(mesh);const [cx,cz]=featureCenter(f);const a=labelAnchor(cx,(p.height||p.levels*3.6)+2,cz,mesh.userData.action);addLabel(a,`${p.code}｜${p.name}`,p.code==='E'?'target':'')}
  setCamera(.78,.48,115,new THREE.Vector3(0,8,0),20,180);showCampus();makeQuickCampus();hideLoader();
}

function eFootprintShape(scale=.28){const f=campusGeoJSON.features.find(x=>x.properties.code==='E');const pts=f.geometry.coordinates[0].map(geoToLocal);const c=featureCenter(f);const sh=new THREE.Shape();pts.forEach(([x,z],i)=>{const X=(x-c[0])*scale,Z=-(z-c[1])*scale;i?sh.lineTo(X,Z):sh.moveTo(X,Z)});return sh}
function slab(shape,y,color,opacity=1){const g=new THREE.ExtrudeGeometry(shape,{depth:.22,bevelEnabled:false});g.rotateX(-Math.PI/2);g.translate(0,y,0);const m=new THREE.Mesh(g,mat(color,{transparent:opacity<1,opacity,roughness:.6,metalness:.08}));m.castShadow=true;m.receiveShadow=true;return m}
function renderBuilding(){
  clearWorld();state.mode='building';state.equipment=null;state.cameraMode='overview';syncUI();
  const sh=eFootprintShape();
  const base=flatPlane(34,30,0x112a38);world.add(base);
  for(let f=1;f<=7;f++){const y=(f-1)*2.15+.15;const active=f===5||f===6;const s=slab(sh,y,active?(f===6?0x3995a8:0x5f7eb4):0x345061,active ? .82 : .36);if(active)addPick(s,()=>renderFloor(f));world.add(s);const a=labelAnchor(8.8,y+1.0,-6.3+f*.12,active?()=>renderFloor(f):()=>showFloorPassive(f));addLabel(a,`${f}F${active?' · IEM':''}`,active?'floor':'')}
  const frame=box(18,.12,14,0x3b6072);frame.position.y=.05;world.add(frame);
  setCamera(.78,.48,48,new THREE.Vector3(0,7,0),10,80);showBuildingDetail();makeQuickBuilding();hideLoader();
}

const roomColors={lab:0x218095,office:0x3c6d9d,seminar:0x63528f,meeting:0x9b763c};
function renderFloor(floor){
  clearWorld();state.mode='floor';state.floor=floor;state.equipment=null;state.cameraMode='overview';syncUI();
  const base=box(17,.18,12,0x193544);base.position.y=.1;world.add(base);
  const corridor=box(14.5,.04,1.3,0x66737a);corridor.position.set(.2,.22,.1);world.add(corridor);
  for(const r of FLOOR_TWIN[floor].rooms){const g=box(r.w,.55,r.d,roomColors[r.kind]||C.blue);g.position.set(r.x,.48,r.z);if(r.lab)addPick(g,()=>renderLab(r.code));else addPick(g,()=>showRoom(r));world.add(g);const a=labelAnchor(r.x,1.55,r.z,g.userData.action);addLabel(a,`${r.code} ${r.name}`,r.lab?'floor':'')}
  setCamera(.7,.7,32,new THREE.Vector3(0,.4,0),8,60);showFloor(floor);makeQuickFloor(floor);hideLoader();
}

function roomShell(lab){
  const {w,d,h}=lab.room;const g=new THREE.Group();
  const floor=flatPlane(w,d,C.floor);g.add(floor);
  for(let x=-w/2;x<=w/2;x+=1.2){const ln=box(.018,.012,d,0x313942);ln.position.set(x,.015,0);g.add(ln)}
  for(let z=-d/2;z<=d/2;z+=1.2){const ln=box(w,.012,.018,0x313942);ln.position.set(0,.016,z);g.add(ln)}
  const back=box(w,h,.12,C.wall);back.position.set(0,h/2,-d/2);g.add(back);
  const left=box(.12,h,d,C.wall);left.position.set(-w/2,h/2,0);g.add(left);
  const right=box(.12,h,d,C.wall);right.position.set(w/2,h/2,0);g.add(right);
  const ceil=box(w,.08,d,0xe9e9e6);ceil.position.set(0,h,0);g.add(ceil);
  for(let x=-w/2+1.4;x<w/2-1;x+=3.2)for(let z=-d/2+1.6;z<d/2-1;z+=3.0){const light=box(1.45,.03,.55,0xffffff);light.material.emissive=new THREE.Color(0xdcecff);light.material.emissiveIntensity=.35;light.position.set(x,h-.08,z);g.add(light)}
  if(lab.code==='E-609'){
    for(const x of [-6.9,-5.7,-4.5]){const curtain=box(1.05,2.35,.06,0xd3cbbb);curtain.position.set(x,1.55,-d/2+.09);g.add(curtain)}
    const ac=box(1.65,.42,.38,0xefefef);ac.position.set(-5.6,2.75,-d/2+.28);g.add(ac);
  }
  const sign=textPlane(lab.name,lab.en,Math.min(7,w*.45),1.35);sign.position.set(-w/2+.08,2.15,0);sign.rotation.y=Math.PI/2;g.add(sign);
  return g
}

function desk(w=2.2,d=.85){const g=new THREE.Group();const top=box(w,.12,d,0xd6d5d2);top.position.y=.78;g.add(top);for(const x of[-w/2+.15,w/2-.15])for(const z of[-d/2+.15,d/2-.15]){const l=box(.09,.72,.09,0x9ca5aa);l.position.set(x,.38,z);g.add(l)}return g}
function monitor(){const g=new THREE.Group();const s=box(.72,.42,.04,0x11171d);s.position.y=.33;s.material.emissive=new THREE.Color(0x193a59);s.material.emissiveIntensity=.45;g.add(s);const st=cyl(.025,.22,0x78858f,10);st.position.y=.12;g.add(st);const b=cyl(.12,.03,0x5b656d,12);b.position.y=.01;g.add(b);return g}
function workstation(dual=false){const g=desk(dual?2.45:1.9,.86);const m1=monitor();m1.position.set(dual?-.45:0,.82,-.1);g.add(m1);if(dual){const m2=monitor();m2.position.set(.45,.82,-.1);g.add(m2)}const pc=box(.2,.45,.42,0x1d2228);pc.position.set(-.72,.25,.18);g.add(pc);return g}
function cabinet(w=1.2,h=1.7,d=.45){const g=new THREE.Group();const b=box(w,h,d,0xd2d7da);b.position.y=h/2;g.add(b);const glass=box(w*.75,h*.68,.025,0x77a8bb);glass.material.transparent=true;glass.material.opacity=.32;glass.position.set(0,h*.56,d/2+.015);g.add(glass);return g}
function bench(w=4.5,d=.7){return desk(w,d)}
function between(p1,p2,r,color){const v=new THREE.Vector3().subVectors(p2,p1),len=v.length(),m=cyl(r,len,color,14);m.position.copy(p1).add(p2).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.clone().normalize());return m}
function robotArm(style='UR'){
  const g=new THREE.Group();const ur=style==='UR',tm=style==='TM',fan=style==='FANUC';const link=fan?0xf4b914:(ur?0xe6edf1:0x667078),joint=fan?0xf2aa00:(ur?C.urBlue:0x364047);
  const base=cyl(fan ? .25 : .22,.28,fan?0xf4b914:0x9da9b2,18);base.position.y=.14;g.add(base);
  const pts=fan?[new THREE.Vector3(0,.3,0),new THREE.Vector3(.15,.9,0),new THREE.Vector3(.7,1.25,0),new THREE.Vector3(1.05,.9,.02),new THREE.Vector3(1.35,1.15,.02)]:[new THREE.Vector3(0,.3,0),new THREE.Vector3(.18,.82,0),new THREE.Vector3(.72,1.22,0),new THREE.Vector3(1.03,.82,.02),new THREE.Vector3(1.35,1.08,.02)];
  for(let i=0;i<pts.length-1;i++){g.add(between(pts[i],pts[i+1],fan ? .10 : .085,link));const j=sphere(fan ? .14 : .12,joint);j.position.copy(pts[i+1]);g.add(j)}
  const tool=box(.09,.2,.09,0x20252a);tool.position.copy(pts.at(-1)).add(new THREE.Vector3(.12,0,0));g.add(tool);if(tm){const cam=box(.16,.12,.12,0xe7e7e7);cam.position.copy(pts.at(-1)).add(new THREE.Vector3(.06,.14,0));g.add(cam)}return g
}
function robotCell(style){const g=new THREE.Group();const b=box(2.5,1.0,1.55,0x292f35);b.position.y=.5;g.add(b);const top=box(2.62,.08,1.68,0xb8c3ca);top.position.y=1.03;g.add(top);const arm=robotArm(style);arm.position.set(-.25,1.06,0);g.add(arm);const pendant=box(.36,.22,.08,style==='TM'?0x315643:0x2f5d83);pendant.position.set(.72,1.25,.58);g.add(pendant);return g}
function videoWall(){const g=new THREE.Group();const tex=canvasTexture((ctx,W,H)=>{ctx.fillStyle='#06172c';ctx.fillRect(0,0,W,H);ctx.fillStyle='#54dfff';ctx.font='bold 44px sans-serif';ctx.fillText('SMART MANUFACTURING WAR ROOM',35,62);ctx.fillStyle='#8eb8d2';ctx.font='24px sans-serif';ctx.fillText('Digital Twin · Robot Status · Quality · Energy',35,103);for(let i=0;i<7;i++){ctx.fillStyle=i%2?'#2e8bd0':'#3fd59c';ctx.fillRect(55+i*105,H-70,55,-50-(i*17%130))}ctx.strokeStyle='#2d89bd';ctx.lineWidth=3;ctx.strokeRect(25,25,W-50,H-50)});for(let r=0;r<2;r++)for(let c=0;c<3;c++){const s=new THREE.Mesh(new THREE.PlaneGeometry(2.05,1.16),new THREE.MeshBasicMaterial({map:tex}));s.position.set((c-1)*2.08,2.05-r*1.2,0);g.add(s)}return g}
function bodyScanner(){const g=new THREE.Group();const base=flatPlane(2.1,2.1,0x20252b);g.add(base);for(const x of[-.72,.72])for(const z of[-.72,.72]){const post=box(.13,2.15,.13,0xbec7cb);post.position.set(x,1.07,z);g.add(post);const sensor=box(.32,.42,.18,0xefefef);sensor.position.set(x,1.2,z);g.add(sensor)}return g}
function pressureMat(){const g=new THREE.Group();const m=box(1.35,.035,2.45,0x202328);m.position.y=.02;g.add(m);for(const x of[-.25,.25]){const f=new THREE.Mesh(new THREE.CapsuleGeometry(.11,.42,4,8),mat(0x596774));f.rotation.x=Math.PI/2;f.position.set(x,.05,.1);g.add(f)}const tower=box(.2,1.65,.2,0xe8e8e8);tower.position.set(.95,.82,-.7);g.add(tower);return g}
function tripodSensor(headType='D455'){
  const g=new THREE.Group();const mast=cyl(.03,1.45,0x858f96,10);mast.position.y=.75;g.add(mast);for(const a of[-.8,0,.8]){const leg=between(new THREE.Vector3(0,.1,0),new THREE.Vector3(Math.sin(a)*.35,0,Math.cos(a)*.35),.025,0x6f7980);g.add(leg)}
  let head;if(headType==='D455'){head=box(.38,.1,.09,0x24292f);for(const x of[-.12,.12]){const lens=cyl(.025,.012,0x77b9d6,12);lens.rotation.x=Math.PI/2;lens.position.set(x,1.48,.052);g.add(lens)}}else{head=box(.16,.16,.1,0x30363d);const lens=cyl(.035,.015,0x6fb0ce,12);lens.rotation.x=Math.PI/2;lens.position.set(0,1.5,.06);g.add(lens)}head.position.y=1.5;g.add(head);return g
}
function tobiiStation(){const g=workstation(false);const bar=box(.34,.025,.025,0x1c4263);bar.position.set(0,1.14,-.075);bar.material.emissive=new THREE.Color(0x1d5c86);bar.material.emissiveIntensity=.3;g.add(bar);return g}
function questStation(){const g=workstation(false);const visor=box(.36,.16,.18,0xededed);visor.position.set(-.28,.88,.1);g.add(visor);const strap=new THREE.Mesh(new THREE.TorusGeometry(.22,.025,8,18,Math.PI*1.25),mat(0xaeb4b8));strap.rotation.y=Math.PI/2;strap.position.set(-.28,.9,.12);g.add(strap);for(const x of[.22,.48]){const c=new THREE.Mesh(new THREE.TorusGeometry(.075,.015,7,14),mat(0xe6e6e6));c.rotation.x=Math.PI/2;c.position.set(x,.84,.12);g.add(c)}return g}
function motionCapture(){const g=new THREE.Group();const zone=box(3,.035,2.8,0x262a2f);zone.position.y=.02;g.add(zone);for(const[x,z]of[[-1.3,-1.2],[1.3,-1.2],[-1.3,1.2],[1.3,1.2]]){const p=tripodSensor('L515');p.scale.set(.8,1.1,.8);p.position.set(x,0,z);g.add(p)}return g}
function forcePlate(){const g=new THREE.Group();const p=box(1.0,.08,1.0,0xa9b4bc);p.position.y=.04;g.add(p);return g}
function physio(){const g=workstation(false);const unit=box(.45,.22,.25,0xd9dfe2);unit.position.set(.5,.9,.05);g.add(unit);for(let i=0;i<4;i++){const port=cyl(.025,.03,i%2?0xe85b5b:0x4ba4e0,10);port.rotation.x=Math.PI/2;port.position.set(.38+i*.08,.9,.18);g.add(port)}return g}
function structuredScanner(){const g=new THREE.Group();const post=cyl(.035,1.65,0x8e999f,10);post.position.set(-.55,.85,0);g.add(post);const head=box(.42,.18,.22,0x30353a);head.position.set(-.35,1.55,0);g.add(head);const lens=cyl(.055,.025,0x70b0cc,14);lens.rotation.x=Math.PI/2;lens.position.set(-.35,1.55,.13);g.add(lens);return g}
function scanTurntable(){const g=new THREE.Group();const p=cyl(.62,.12,0x4b535a,22);p.position.y=.06;g.add(p);return g}
function printer3d(){const g=new THREE.Group();const body=box(1.0,1.35,.85,0xe4e7e9);body.position.y=.68;g.add(body);const win=box(.7,.72,.02,0x8bb4c6);win.material.transparent=true;win.material.opacity=.35;win.position.set(0,.78,.44);g.add(win);return g}
function serverRack(){const g=new THREE.Group();const b=box(.65,1.55,.65,0x20252b);b.position.y=.78;g.add(b);for(let i=0;i<8;i++){const u=box(.5,.08,.03,0x47535e);u.position.set(0,.35+i*.13,.34);g.add(u)}return g}
function cmm(){const g=new THREE.Group();const base=box(2.2,.3,1.5,0x7f8990);base.position.y=.15;g.add(base);for(const x of[-.9,.9]){const col=box(.18,1.8,.18,0xbfc6ca);col.position.set(x,1.05,0);g.add(col)}const top=box(2,.18,.18,0xbfc6ca);top.position.y=1.9;g.add(top);const probe=cyl(.035,1.0,0x4d555b,10);probe.position.set(0,1.35,0);g.add(probe);return g}
function conveyor(){const g=new THREE.Group();const belt=box(2.7,.18,.7,0x3b4248);belt.position.y=.9;g.add(belt);for(const x of[-1.1,1.1]){const l=box(.09,.85,.09,0x929ba0);l.position.set(x,.43,0);g.add(l)}const mast=box(.08,1.3,.08,0xa7b0b5);mast.position.set(0,1.45,0);g.add(mast);const camh=box(.24,.18,.18,0xf0f1f2);camh.position.set(0,2.05,0);g.add(camh);return g}
function laserBench(){const g=desk(2.2,.9);const head=structuredScanner();head.scale.set(.65,.65,.65);head.position.set(-.3,.82,0);g.add(head);return g}
function plcPanel(){const g=new THREE.Group();const b=box(1.2,1.45,.32,0xe6eaed);b.position.y=.73;g.add(b);for(let r=0;r<4;r++)for(let c=0;c<4;c++){const m=box(.12,.12,.04,(r+c)%2?0x35556b:0x728f4a);m.position.set(-.28+c*.19,.52+r*.19,.19);g.add(m)}return g}
function servoTrainer(){const g=desk(1.8,.7);const motor=cyl(.12,.42,0x4b6f86,14);motor.rotation.z=Math.PI/2;motor.position.set(-.25,.96,0);g.add(motor);const rail=box(.75,.08,.15,0x9ba5aa);rail.position.set(.2,.92,0);g.add(rail);return g}
function pneumatic(){const g=desk(2,.75);for(let i=0;i<3;i++){const c=cyl(.06,.55,i===0?0x4e8ac0:i===1?0xe09d4a:0x6da966,10);c.rotation.z=Math.PI/2;c.position.set(-.45+i*.45,.98,0);g.add(c)}return g}
function trainerArm(rotary=false){const g=desk(1.8,.75);const a=robotArm(rotary?'TM':'UR');a.scale.set(.55,.55,.55);a.position.set(-.2,.85,0);g.add(a);return g}

function equipmentModel(item){let g;switch(item.model){case'workstation':g=workstation();break;case'dualWorkstation':g=workstation(true);break;case'glassCabinet':g=cabinet();break;case'longBench':g=bench(5.2,.75);break;case'labTable':g=desk(3.2,1.25);break;case'videoWall6':g=videoWall();break;case'ur7eCell':g=robotCell('UR');break;case'tm5900Cell':g=robotCell('TM');break;case'fanucER4Cell':g=robotCell('FANUC');break;case'bodyScanner':g=bodyScanner();break;case'pressureMat':g=pressureMat();break;case'd455Tripod':g=tripodSensor('D455');break;case'l515Tripod':g=tripodSensor('L515');break;case'tobiiFusionStation':g=tobiiStation();break;case'quest3Station':g=questStation();break;case'motionCaptureZone':g=motionCapture();break;case'forcePlate':g=forcePlate();break;case'physioStation':g=physio();break;case'structuredLightScanner':g=structuredScanner();break;case'scanTurntable':g=scanTurntable();break;case'cadWorkstation':g=workstation();break;case'threeDPrinter':g=printer3d();break;case'serverRack':g=serverRack();break;case'cmmMachine':g=cmm();break;case'visionConveyor':g=conveyor();break;case'laserScannerBench':g=laserBench();break;case'plcPanel':g=plcPanel();break;case'servoTrainer':g=servoTrainer();break;case'pneumaticTrainer':g=pneumatic();break;case'linearArmTrainer':g=trainerArm(false);break;case'rotaryArmTrainer':g=trainerArm(true);break;default:g=desk()}g.position.set(item.x||0,0,item.z||0);g.rotation.y=item.yaw||0;addPick(g,()=>focusEquipment(item,g));return g}

function renderLab(code){
  const lab=LABS[code];if(!lab)return;clearWorld();state.mode='lab';state.lab=code;state.floor=lab.floor;state.equipment=null;state.cameraMode='overview';syncUI();
  const shell=roomShell(lab);world.add(shell);
  for(const item of lab.equipment){const g=equipmentModel(item);world.add(g);if(item.major){const a=labelAnchor(item.x,2.2,item.z,g.userData.action);addLabel(a,item.name,item.provenance==='current'?'current':'')}}
  if(code==='E-609'){
    for(const x of[-6.9,-5.4,-3.9]){const c=cabinet(1.1,1.4,.42);c.position.set(x,0,-4.25);world.add(c)}
    for(const x of[5.8,7.0]){const c=cabinet(1.05,1.2,.42);c.position.set(x,0,-2.3);c.rotation.y=Math.PI/2;world.add(c)}
    const t=desk(3.1,1.0);t.position.set(4.7,0,-3.9);world.add(t);
  }
  setCamera(.73,.45,Math.max(lab.room.w,lab.room.d)*1.45,new THREE.Vector3(0,1.2,0),4,45);showLab(lab);makeQuickLab(lab);hideLoader();
}

function focusEquipment(item,group){state.equipment=item.id;state.cameraMode='focus';const p=group.getWorldPosition(new THREE.Vector3());setCamera(cam.gyaw,.34,6.2,new THREE.Vector3(p.x,1.05,p.z),2.8,18);showEquipment(item,LABS[state.lab]);syncQuickActive()}

function showCampus(){detail.innerHTML=`<div class="kicker">OFFLINE CAMPUS TWIN</div><h2>校園 OSM 離線 3D</h2><div class="en">Static campus.geojson</div><div class="desc">理工大樓採已驗證的 OSM way 292141618 footprint；網站執行時只讀取本地 campus.geojson，不再向 Overpass 或 OSM API 發出查詢。</div><div class="metric-grid"><div class="metric"><span>Runtime</span><b>Offline GeoJSON</b></div><div class="metric"><span>理工大樓</span><b>7F</b></div><div class="metric"><span>Lab Twins</span><b>5</b></div><div class="metric"><span>WebGL</span><b>Three.js</b></div></div><div class="sourcebox">E 棟 footprint：OpenStreetMap way 292141618。其他主要校園建物目前以固化簡化輪廓作導覽背景；後續可離線重跑 OSM snapshot 取代，不影響網站程式。</div><div class="linkrow"><a href="data/campus.geojson" target="_blank">campus.geojson</a><a href="${SITE.sources.osmE}" target="_blank">OSM E 棟 ↗</a></div>`}
function showBuilding(p){detail.innerHTML=`<div class="kicker">CAMPUS BUILDING</div><h2>${p.name}</h2><div class="en">${p.name_en||''}</div><div class="desc">${p.code==='E'?'理工大樓為工管系 Digital Twin Guide 的主要入口。':'校園 3D 導覽背景建物。'}</div><div class="metric-grid"><div class="metric"><span>代碼</span><b>${p.code}</b></div><div class="metric"><span>樓層</span><b>${p.levels}F</b></div></div>`}
function showBuildingDetail(){detail.innerHTML=`<div class="kicker">SCIENCE & ENGINEERING BUILDING</div><h2>理工大樓</h2><div class="en">Science and Engineering Building</div><div class="desc">以 7 層堆疊式 cutaway 呈現，5F 與 6F 為工管系主要辦公／實驗空間。點選 5F 或 6F 進入樓層數位孿生。</div><div class="metric-grid"><div class="metric"><span>OSM ID</span><b>292141618</b></div><div class="metric"><span>樓層</span><b>7F</b></div><div class="metric"><span>IEM</span><b>5F / 6F</b></div><div class="metric"><span>模式</span><b>Cutaway Twin</b></div></div><div class="linkrow"><button data-open-floor="5">進入 5F</button><button data-open-floor="6">進入 6F</button></div>`;$$('[data-open-floor]',detail).forEach(b=>b.onclick=()=>renderFloor(+b.dataset.openFloor))}
function showFloor(f){const rooms=FLOOR_TWIN[f].rooms;detail.innerHTML=`<div class="kicker">${f}F FLOOR TWIN</div><h2>理工大樓 ${f}F</h2><div class="desc">依工管系公開樓層配置的房間關係重建。點選具 3D twin 的實驗室進一步查看設備配置。</div><div class="section-title">ROOMS</div>${rooms.map(r=>`<div class="equip"><strong>${r.code}｜${r.name}</strong><small>${r.lab?'可進入 Lab Twin':'Floor context'}</small></div>`).join('')}<div class="sourcebox">樓層來源：朝陽工管公開 5F / 6F 配置頁。</div>`}
function showRoom(r){detail.innerHTML=`<div class="kicker">ROOM</div><h2>${r.code}</h2><div class="en">${r.name}</div><div class="desc">此空間目前以樓層定位與功能標示呈現。</div>`}
function showFloorPassive(f){detail.innerHTML=`<div class="kicker">BUILDING FLOOR</div><h2>${f}F</h2><div class="desc">此樓層目前不在工管系 Digital Twin 的細部範圍。</div>`}
function badge(prov){return `<span class="badge ${prov==='official'?'official':'current'}">${prov==='official'?'官方公開設備／功能':'現況／場域配置'}</span>`}
function showLab(lab){detail.innerHTML=`<div class="kicker">LAB DIGITAL TWIN</div><h2>${lab.code}｜${lab.name}</h2><div class="en">${lab.en}</div><div class="desc">${lab.publicDescription}</div>${lab.previousPublicName?`<div class="sourcebox">公開頁舊名稱：${lab.previousPublicName}；本 Digital Twin 依目前場域更新為「${lab.name}」。</div>`:''}<div class="metric-grid"><div class="metric"><span>Floor</span><b>${lab.floor}F</b></div><div class="metric"><span>Equipment</span><b>${lab.equipment.length}</b></div><div class="metric"><span>Scene</span><b>Low-poly 3D</b></div><div class="metric"><span>Layout</span><b>${lab.layoutStyle}</b></div></div><div class="section-title">RESEARCH</div><div class="tags">${lab.research.map(x=>`<span class="tag">${x}</span>`).join('')}</div><div class="section-title">EQUIPMENT</div>${lab.equipment.map(x=>`<div class="equip">${badge(x.provenance)}<strong>${x.name}</strong><small>${x.model}</small></div>`).join('')}<div class="sourcebox">官方功能／既有設備來源：朝陽工管「實驗室與設備」。UR/TM、Quest 3、Tobii、D455/L515 等目前場域設備依系上提供之現況配置建模。</div><div class="linkrow"><a href="${lab.source}" target="_blank">官方實驗室資料 ↗</a></div>`}
function showEquipment(item,lab){detail.innerHTML=`<div class="kicker">EQUIPMENT TWIN</div><h2>${item.name}</h2><div class="en">${lab.code} · ${lab.name}</div><div class="desc">此設備已不是單純 hotspot，而是具有外型、相對尺寸與空間位置的低多邊形 3D 模型。</div>${badge(item.provenance)}<div class="metric-grid"><div class="metric"><span>Model</span><b>${item.model}</b></div><div class="metric"><span>Position</span><b>${item.x}, ${item.z}</b></div></div><div class="linkrow"><button id="backLab">回到實驗室全景</button></div>`;$('#backLab').onclick=()=>renderLab(lab.code)}

function makeQuickCampus(){quickbar.innerHTML=`<button class="quick" data-q="E"><strong>E</strong>理工大樓</button>${Object.keys(LABS).map(c=>`<button class="quick" data-lab="${c}"><strong>${c}</strong>${LABS[c].name}</button>`).join('')}`;wireQuick()}
function makeQuickBuilding(){quickbar.innerHTML=`<button class="quick" data-floor="5"><strong>5F</strong>辦公／機電整合</button><button class="quick" data-floor="6"><strong>6F</strong>研究實驗室</button>`;wireQuick()}
function makeQuickFloor(f){quickbar.innerHTML=FLOOR_TWIN[f].rooms.map(r=>`<button class="quick" ${r.lab?`data-lab="${r.code}"`:`data-room="${r.code}"`}><strong>${r.code}</strong>${r.name}</button>`).join('');wireQuick()}
function makeQuickLab(lab){quickbar.innerHTML=`<button class="quick active" data-lab="${lab.code}"><strong>${lab.code}</strong>全景</button>${lab.equipment.map(x=>`<button class="quick" data-eq="${x.id}"><strong>•</strong>${x.name}</button>`).join('')}`;wireQuick()}
function wireQuick(){$$('[data-q]',quickbar).forEach(b=>b.onclick=()=>renderBuilding());$$('[data-floor]',quickbar).forEach(b=>b.onclick=()=>renderFloor(+b.dataset.floor));$$('[data-lab]',quickbar).forEach(b=>b.onclick=()=>renderLab(b.dataset.lab));$$('[data-eq]',quickbar).forEach(b=>b.onclick=()=>{const item=LABS[state.lab].equipment.find(x=>x.id===b.dataset.eq);if(!item)return;const obj=world.children.find(o=>o.userData?.action&&o.position.x===item.x&&o.position.z===item.z);if(obj)focusEquipment(item,obj)});syncQuickActive()}
function syncQuickActive(){$$('.quick',quickbar).forEach(b=>b.classList.toggle('active',b.dataset.eq===state.equipment||(!state.equipment&&b.dataset.lab===state.lab)))}

function syncUI(){
  const mode=state.mode==='floor'?'building':state.mode;$$('.sidebtn').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));$('#campusTab').classList.toggle('active',state.mode==='campus');$('#buildingTab').classList.toggle('active',state.mode==='building'||state.mode==='floor');$('#labsTab').classList.toggle('active',state.mode==='lab');$$('.labbtn').forEach(b=>b.classList.toggle('active',b.dataset.lab===state.lab));
  if(state.mode==='campus'){$('#navTitle').textContent='校園數位孿生';$('#navSubtitle').textContent='靜態 campus.geojson 直接載入，不再連線 Overpass。';$('#crumb').textContent='CYUT / Campus';$('#sceneTitle').textContent='校園 OSM 離線 3D'}
  if(state.mode==='building'){$('#navTitle').textContent='理工大樓';$('#navSubtitle').textContent='7F cutaway，5F / 6F 可進入。';$('#crumb').textContent='CYUT / E Building';$('#sceneTitle').textContent='理工大樓 7F Cutaway'}
  if(state.mode==='floor'){$('#navTitle').textContent=`理工大樓 ${state.floor}F`;$('#navSubtitle').textContent='房間位置與實驗室入口。';$('#crumb').textContent=`CYUT / E / ${state.floor}F`;$('#sceneTitle').textContent=`${state.floor}F Floor Twin`}
  if(state.mode==='lab'){const l=LABS[state.lab];$('#navTitle').textContent=`${l.code} ${l.name}`;$('#navSubtitle').textContent=l.publicDescription;$('#crumb').textContent=`CYUT / E / ${l.floor}F / ${l.code}`;$('#sceneTitle').textContent=l.name}
}

function buildLabButtons(){const wrap=$('#labList');wrap.innerHTML=Object.values(LABS).map(l=>`<button class="labbtn" data-lab="${l.code}"><strong>${l.code}｜${l.name}</strong><small>${l.floor}F · ${l.research.slice(0,3).join(' · ')}</small></button>`).join('');$$('.labbtn',wrap).forEach(b=>b.onclick=()=>renderLab(b.dataset.lab))}

const searchIndex=[];
for(const lab of Object.values(LABS)){searchIndex.push({type:'lab',code:lab.code,name:lab.name,sub:`${lab.floor}F`,text:[lab.code,lab.name,lab.en,...lab.research].join(' ').toLowerCase(),lab:lab.code});for(const e of lab.equipment)searchIndex.push({type:'equipment',code:lab.code,name:e.name,sub:lab.name,text:[e.name,e.model,lab.code,lab.name].join(' ').toLowerCase(),lab:lab.code,eq:e.id})}
searchIndex.push({type:'building',code:'E',name:'理工大樓',sub:'7F',text:'理工大樓 science engineering building E'.toLowerCase()});
function search(q){const box=$('#searchResults');q=q.trim().toLowerCase();if(!q){box.hidden=true;box.innerHTML='';return}const toks=q.split(/\s+/).filter(Boolean);const res=searchIndex.filter(x=>toks.every(t=>x.text.includes(t))).slice(0,16);box.hidden=false;box.innerHTML=res.length?res.map((r,i)=>`<button class="result" data-i="${i}"><code>${r.code}</code><span><b>${r.name}</b><small>${r.sub}</small></span><em>${r.type==='equipment'?'設備':r.type==='lab'?'實驗室':'建物'}</em></button>`).join(''):'<div class="sourcebox">找不到相符項目</div>';$$('[data-i]',box).forEach(b=>b.onclick=()=>{const r=res[+b.dataset.i];box.hidden=true;if(r.type==='building')renderBuilding();else{renderLab(r.lab);if(r.eq)setTimeout(()=>{const item=LABS[r.lab].equipment.find(x=>x.id===r.eq);const obj=world.children.find(o=>o.userData?.action&&Math.abs(o.position.x-item.x)<.01&&Math.abs(o.position.z-item.z)<.01);if(obj)focusEquipment(item,obj)},80)}})}

function walkView(){if(state.mode!=='lab')return;const lab=LABS[state.lab];state.cameraMode='walk';setCamera(0,.12,6.5,new THREE.Vector3(0,1.25,-lab.room.d*.22),2.5,18)}
function overview(){state.cameraMode='overview';if(state.mode==='campus')setCamera(.78,.48,115,new THREE.Vector3(0,8,0),20,180);else if(state.mode==='building')setCamera(.78,.48,48,new THREE.Vector3(0,7,0),10,80);else if(state.mode==='floor')setCamera(.7,.7,32,new THREE.Vector3(0,.4,0),8,60);else{const lab=LABS[state.lab];setCamera(.73,.45,Math.max(lab.room.w,lab.room.d)*1.45,new THREE.Vector3(0,1.2,0),4,45)}}
function hideLoader(){loader.hidden=true}

$('#brandHome').onclick=renderCampus;$('#campusTab').onclick=renderCampus;$('#buildingTab').onclick=renderBuilding;$('#labsTab').onclick=()=>renderLab(state.lab);$$('.sidebtn').forEach(b=>b.onclick=()=>b.dataset.mode==='campus'?renderCampus():b.dataset.mode==='building'?renderBuilding():renderLab(state.lab));$('#overviewBtn').onclick=overview;$('#walkBtn').onclick=walkView;$('#resetBtn').onclick=overview;$('#searchInput').oninput=e=>search(e.target.value);
buildLabButtons();

function resize(){const r=viewport.getBoundingClientRect();renderer.setSize(Math.max(1,r.width),Math.max(1,r.height),false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix()}
addEventListener('resize',resize);resize();

function animate(){requestAnimationFrame(animate);updateCamera();renderer.render(scene,camera);updateLabels()}
renderCampus();animate();
