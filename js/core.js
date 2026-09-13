import * as THREE from 'three';

export { THREE };

export const C = {
  bg:0x07131f, cyan:0x4edfff, gold:0xf2c56a, green:0x68d99c,
  blue:0x315d7a, wall:0xf0ede6, floor:0xdecfac, metal:0xbcc7cf,
  dark:0x252b31, black:0x101419, glass:0xa8d8ee, urBlue:0x6ebde8,
  tmDark:0x4a4f55, fanuc:0xf2b515, white:0xf4f5f6
};

export function mat(color,opts={}){return new THREE.MeshStandardMaterial({color,roughness:.7,metalness:.05,...opts})}
export function metal(color=C.metal){return mat(color,{roughness:.38,metalness:.65})}
export function box(w,h,d,color=C.white){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(color));m.castShadow=true;m.receiveShadow=true;return m}
export function cyl(r,h,color=C.metal,segments=14){const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,segments),metal(color));m.castShadow=true;m.receiveShadow=true;return m}
export function sphere(r,color=C.metal){const m=new THREE.Mesh(new THREE.SphereGeometry(r,14,10),metal(color));m.castShadow=true;return m}
export function flatPlane(w,d,color=C.floor){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,d),mat(color,{roughness:.95}));m.rotation.x=-Math.PI/2;m.receiveShadow=true;return m}
export function between(p1,p2,r,color){const v=new THREE.Vector3().subVectors(p2,p1),len=v.length(),m=cyl(r,len,color,14);m.position.copy(p1).add(p2).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.clone().normalize());return m}
export function canvasTexture(draw,w=1024,h=512){const c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d');draw(ctx,w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t}
export function textPlane(text,sub,w=5.7,h=1.3){const tex=canvasTexture((ctx,W,H)=>{ctx.fillStyle='#f4f2ec';ctx.fillRect(0,0,W,H);ctx.fillStyle='#14345a';ctx.font='bold 68px sans-serif';ctx.fillText(text,34,105);ctx.fillStyle='#355b7d';ctx.font='30px sans-serif';ctx.fillText(sub,34,160);ctx.strokeStyle='#477da5';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(34,200);ctx.lineTo(W-34,200);ctx.stroke()});return new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tex}))}

export class TwinEngine {
  constructor(viewport, labelsRoot){
    this.viewport=viewport;this.labelsRoot=labelsRoot;this.world=new THREE.Group();this.labels=[];this.moved=false;
    this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;this.renderer.outputColorSpace=THREE.SRGBColorSpace;viewport.prepend(this.renderer.domElement);
    this.scene=new THREE.Scene();this.scene.background=new THREE.Color(C.bg);this.scene.fog=new THREE.Fog(C.bg,45,190);this.scene.add(this.world);
    this.camera=new THREE.PerspectiveCamera(45,1,.08,500);
    this.cam={yaw:.75,pitch:.48,dist:95,target:new THREE.Vector3(),gyaw:.75,gpitch:.48,gdist:95,gtarget:new THREE.Vector3(),minDist:5,maxDist:160};
    this.scene.add(new THREE.HemisphereLight(0xe7f8ff,0x1b2630,1.25));const sun=new THREE.DirectionalLight(0xffffff,1.25);sun.position.set(24,34,18);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-60;sun.shadow.camera.right=60;sun.shadow.camera.top=60;sun.shadow.camera.bottom=-60;this.scene.add(sun);this.scene.add(new THREE.AmbientLight(0x597b93,.3));
    this.raycaster=new THREE.Raycaster();this.pointer=new THREE.Vector2();this.dragging=false;this.last=[0,0];this.down=[0,0];this.bind();this.resize();addEventListener('resize',()=>this.resize());requestAnimationFrame(()=>this.frame());
  }
  bind(){const el=this.renderer.domElement;el.addEventListener('pointerdown',e=>{this.dragging=true;this.moved=false;this.last=[e.clientX,e.clientY];this.down=[e.clientX,e.clientY];el.setPointerCapture(e.pointerId)});el.addEventListener('pointermove',e=>{if(!this.dragging)return;const dx=e.clientX-this.last[0],dy=e.clientY-this.last[1];if(Math.hypot(e.clientX-this.down[0],e.clientY-this.down[1])>4)this.moved=true;this.cam.gyaw+=dx*.006;this.cam.gpitch=Math.max(.05,Math.min(1.25,this.cam.gpitch+dy*.005));this.last=[e.clientX,e.clientY]});el.addEventListener('pointerup',e=>{this.dragging=false;if(!this.moved)this.pick(e)});el.addEventListener('wheel',e=>{e.preventDefault();this.cam.gdist=Math.max(this.cam.minDist,Math.min(this.cam.maxDist,this.cam.gdist*Math.exp(e.deltaY*.0011)))},{passive:false})}
  setCamera(yaw,pitch,dist,target,min=5,max=160){this.cam.gyaw=yaw;this.cam.gpitch=pitch;this.cam.gdist=dist;this.cam.gtarget.copy(target);this.cam.minDist=min;this.cam.maxDist=max}
  updateCamera(){const c=this.cam;c.yaw+=(c.gyaw-c.yaw)*.10;c.pitch+=(c.gpitch-c.pitch)*.10;c.dist+=(c.gdist-c.dist)*.10;c.target.lerp(c.gtarget,.10);const cp=Math.cos(c.pitch);this.camera.position.set(c.target.x+c.dist*cp*Math.sin(c.yaw),c.target.y+c.dist*Math.sin(c.pitch),c.target.z+c.dist*cp*Math.cos(c.yaw));this.camera.lookAt(c.target)}
  pick(e){const r=this.renderer.domElement.getBoundingClientRect();this.pointer.x=((e.clientX-r.left)/r.width)*2-1;this.pointer.y=-((e.clientY-r.top)/r.height)*2+1;this.raycaster.setFromCamera(this.pointer,this.camera);const hits=this.raycaster.intersectObjects(this.world.children,true);for(const hit of hits){let o=hit.object;while(o&&o!==this.world&&!o.userData.action)o=o.parent;if(o?.userData?.action){o.userData.action();break}}}
  addPick(group,action){group.userData.action=action;return group}
  labelAnchor(x,y,z,action){const o=new THREE.Object3D();o.position.set(x,y,z);o.userData.action=action;this.world.add(o);return o}
  addLabel(obj,text,cls=''){const el=document.createElement('button');el.className=`label ${cls}`.trim();el.textContent=text;el.onclick=()=>obj.userData.action?.();this.labelsRoot.appendChild(el);this.labels.push({obj,el})}
  updateLabels(){const rect=this.renderer.domElement.getBoundingClientRect();for(const {obj,el} of this.labels){const p=obj.getWorldPosition(new THREE.Vector3()).project(this.camera);const vis=p.z>-1&&p.z<1;el.style.display=vis?'block':'none';if(vis){el.style.left=`${(p.x*.5+.5)*rect.width}px`;el.style.top=`${(-p.y*.5+.5)*rect.height}px`}}}
  clear(){this.labels.forEach(x=>x.el.remove());this.labels=[];while(this.world.children.length){const o=this.world.children.pop();o.traverse(v=>{v.geometry?.dispose?.();if(v.material)(Array.isArray(v.material)?v.material:[v.material]).forEach(m=>{m.map?.dispose?.();m.dispose?.()})})}}
  resize(){const r=this.viewport.getBoundingClientRect();this.renderer.setSize(Math.max(1,r.width),Math.max(1,r.height),false);this.camera.aspect=r.width/r.height;this.camera.updateProjectionMatrix()}
  frame(){requestAnimationFrame(()=>this.frame());this.updateCamera();this.renderer.render(this.scene,this.camera);this.updateLabels()}
}
