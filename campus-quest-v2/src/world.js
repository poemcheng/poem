'use strict';
/* Architecturally articulated, photo-informed reconstruction, NOT a measured replica.
 * Floors, stairs, room apertures and handrails use the same coordinate system as
 * collision and WebXR. Dormitory/private preschool interiors remain out of scope.
 */
(()=>{
const G=CQ.G,M=CQ.M,D=CQ.DATA;
const C=(r,g,b,mat=0)=>Object.assign([r,g,b],{mat});
const P={stone:C(.99,.99,.96,2),brick:C(1.05,.98,.91,1),trim:C(.92,.91,.86,2),pave:C(1,1,.98,3),road:C(.96,.98,1,4),grass:C(.86,.96,.78,5),wood:C(1,1,1,6),roof:C(.94,.92,.88,7),floor:C(1,1,1,8),metal:C(.77,.82,.85,9),glass:C(.82,.96,1,10),leaves:C(.89,1,.82,11),water:C(.54,.84,.80,12),light:C(.91,.87,.69,13),plaza:C(1,1,.95,14),granite:C(.88,.91,.86,15),black:C(.12,.145,.15),white:C(.94,.95,.91),gold:C(.82,.67,.36)};
let W,phys;
function box(g,x,y,z,w,h,d,col,solid=false,ry=0){g.box(x,y,z,w,h,d,col,ry);if(solid)phys.addSolid({x,z,w,d,y0:y-h/2,y1:y+h/2});}
function floor(g,x,z,w,d,y,bid,f,col=P.floor){if(w<.01||d<.01)return;g.box(x,y-.14,z,w,.28,d,P.stone);g.quad([x-w/2,y+.002,z-d/2],[x-w/2,y+.002,z+d/2],[x+w/2,y+.002,z+d/2],[x+w/2,y+.002,z-d/2],col,[0,1,0]);phys.addSurface({x,z,w,d,y,building:bid,floor:f,kind:'slab'});phys.addSolid({x,z,w,d,y0:y-.28,y1:y-.015,kind:'slab'});}
function plate(g,r,hole,y,bid,f,col=P.floor){let a={x0:r.x-r.w/2,x1:r.x+r.w/2,z0:r.z-r.d/2,z1:r.z+r.d/2};if(!hole||hole.x1<=a.x0||hole.x0>=a.x1||hole.z1<=a.z0||hole.z0>=a.z1){floor(g,r.x,r.z,r.w,r.d,y,bid,f,col);return;}
 let h={x0:Math.max(a.x0,hole.x0),x1:Math.min(a.x1,hole.x1),z0:Math.max(a.z0,hole.z0),z1:Math.min(a.z1,hole.z1)};for(let [x0,x1,z0,z1]of[[a.x0,h.x0,a.z0,a.z1],[h.x1,a.x1,a.z0,a.z1],[h.x0,h.x1,a.z0,h.z0],[h.x0,h.x1,h.z1,a.z1]])floor(g,(x0+x1)/2,(z0+z1)/2,x1-x0,z1-z0,y,bid,f,col);
}
function rail(g,a,b,height=1.10){let y1=a[1]+height,y2=b[1]+height;g.beam([a[0],y1,a[2]],[b[0],y2,b[2]],.035,P.metal,8);g.beam([a[0],a[1]+.52,a[2]],[b[0],b[1]+.52,b[2]],.023,P.metal,6);let dist=Math.hypot(b[0]-a[0],b[2]-a[2]),n=Math.max(1,Math.ceil(dist/1.15));for(let i=0;i<=n;i++){let t=i/n,p=a.map((v,k)=>v+(b[k]-v)*t);g.cylinder(p[0],p[1]+height/2,p[2],.025,height,P.metal,7);}if(Math.abs(a[0]-b[0])<.05)phys.addSolid({x:a[0],z:(a[2]+b[2])/2,w:.11,d:Math.abs(a[2]-b[2])+.08,y0:Math.min(a[1],b[1]),y1:Math.max(y1,y2)});else if(Math.abs(a[2]-b[2])<.05)phys.addSolid({x:(a[0]+b[0])/2,z:a[2],w:Math.abs(a[0]-b[0])+.08,d:.11,y0:Math.min(a[1],b[1]),y1:Math.max(y1,y2)});}
function sign(id,name,sub,x,y,z,yaw=0,w=4,h=.72){W.signs.push({id,name,sub,x,y,z,yaw,w,h});}
function hipRoof(g,x,y,z,w,d,rise,col=P.roof){let k=Math.max(0,w/2-d/2),a=[x-w/2,y,z+d/2],b=[x+w/2,y,z+d/2],c=[x+w/2,y,z-d/2],d0=[x-w/2,y,z-d/2],e=[x-k,y+rise,z],f=[x+k,y+rise,z];g.quad(a,b,f,e,col);g.quad(d0,e,f,c,col);g.tri(a,e,d0,col);g.tri(b,c,f,col);}
function arch(g,x,y,z,w,height,depth,col=P.stone){let r=w/2,cy=y+height-r,th=.33;for(let i=0;i<22;i++){let a=i*Math.PI/22,b=(i+1)*Math.PI/22,p=(t,rr,zz)=>[x+Math.cos(t)*rr,cy+Math.sin(t)*rr,zz];for(let zz of [z-depth/2,z+depth/2])g.quad(p(a,r,zz),p(b,r,zz),p(b,r+th,zz),p(a,r+th,zz),col);g.quad(p(a,r,z-depth/2),p(b,r,z-depth/2),p(b,r,z+depth/2),p(a,r,z+depth/2),col);}
 for(let s of [-1,1])box(g,x+s*(r+th/2),y+(height-r)/2,z,th,height-r,depth,col,true);}
function stair(g,b){let s=b.stair,x=s.x,z=s.z,h=b.floorHeight,n=10,r=h/20,run=4;
 for(let f=0;f<b.floors-1;f++){let y=b.base+f*h;
  for(let i=0;i<n;i++){let za=z+3-(i+.5)*run/n,zb=z-1+(i+.5)*run/n;box(g,x-1.72,y+(i+.5)*r,za,2.65,r,run/n,P.stone);box(g,x+1.72,y+h/2+(i+.5)*r,zb,2.65,r,run/n,P.stone);box(g,x-1.72,y+(i+1)*r+.007,za-run/n/2+.035,2.64,.012,.045,P.granite);box(g,x+1.72,y+h/2+(i+1)*r+.007,zb+run/n/2-.035,2.64,.012,.045,P.granite);}
  phys.addSurface({x:x-1.72,z:z+1,w:2.65,d:4,y:y+h/4,sz:-h/8,building:b.id,floor:f+1,kind:'stair'});
  phys.addSurface({x:x+1.72,z:z+1,w:2.65,d:4,y:y+3*h/4,sz:h/8,building:b.id,floor:f+1,kind:'stair'});
  floor(g,x,z-2,7.15,2,y+h/2,b.id,f+1,P.floor);
  rail(g,[x-3.13,y,z+3],[x-3.13,y+h/2,z-1]);rail(g,[x+3.13,y+h/2,z-1],[x+3.13,y+h,z+3]);
  // Separate flights: no cross-over above a drop. Both ends stay open for landings.
  rail(g,[x-.27,y,z+3],[x-.27,y+h/2,z-1]);rail(g,[x+.27,y+h/2,z-1],[x+.27,y+h,z+3]);
  rail(g,[x-3.14,y+h/2,z-2.95],[x+3.14,y+h/2,z-2.95]);
 }
 for(let f=0;f<b.floors;f++){let y=b.base+f*h;sign('FLOOR-'+b.id+'-'+f,`${f+1}F`,b.id==='E'?(f===4?'工業工程與管理系':'理工大樓'):'樓層平台',x,y+2.35,z+5.35,Math.PI,2.25,.85);W.lifts.push({id:'LIFT_'+b.id+'_'+(f+1),name:b.name+'樓層電梯',x:b.lift.x,z:b.lift.z,y,building:b.id,floor:f+1});
  let ex=b.lift.x,ez=b.lift.z;box(g,ex,y+1.27,ez+1.05,1.7,2.55,.10,P.metal);box(g,ex,y+1.3,ez+.98,.025,2.42,.03,P.black);box(g,ex-1.0,y+1.38,ez+.96,.18,.42,.035,P.black);box(g,ex-.997,y+1.47,ez+.93,.065,.065,.028,P.light);sign('ELEV-'+b.id+'-'+f,'↕ '+(f+1)+'F','E 選擇樓層',ex,y+2.86,ez+.90,Math.PI,1.9,.40);
 }
}
function facade(g,b,rect,side){let isX=side==='east'||side==='west',out=(side==='south'||side==='east')?1:-1,len=isX?rect.d:rect.w,fixed=(isX?rect.x:rect.z)+out*(isX?rect.w:rect.d)/2,center=isX?rect.z:rect.x,n=Math.max(2,Math.round(len/4.2)),cell=len/n;
 let doorT=isX?b.door[1]:b.door[0],nearDoor=Math.abs((isX?b.door[0]:b.door[1])-fixed)<8;
 for(let f=0;f<b.floors;f++){let y=b.base+f*b.floorHeight;
  for(let i=0;i<n;i++){let t=center-len/2+(i+.5)*cell;if(b.id==='E'&&isX&&Math.abs(fixed-b.x)<8&&t<b.z-21)continue;let door=f===0&&nearDoor&&Math.abs(t-doorT)<cell*.72;
   let put=(tt,yy,ww,hh,depth,col,solid=false,offset=0)=>{let xx=isX?fixed+out*offset:tt,zz=isX?tt:fixed+out*offset;box(g,xx,yy,zz,isX?depth:ww,hh,isX?ww:depth,col,solid);};
   let brick=b.id==='M'||b.id==='D'||i===0||i===n-1;let wall=brick?P.brick:P.stone;
   put(t,y+3.37,cell,.85,.34,wall,true);put(t-cell/2,y+1.6,.26,3.2,.44,P.trim,true,.03);
   if(!door){put(t,y+.53,cell,1.06,.30,wall,true);let yy0=y+1.09,yy1=y+2.93,t0=t-cell/2+.25,t1=t+cell/2-.20,fx=fixed-out*.045;
    let p=(a,yy)=>isX?[fx,yy,a]:[a,yy,fx];let q=out===1?[p(t0,yy0),p(t1,yy0),p(t1,yy1),p(t0,yy1)]:[p(t1,yy0),p(t0,yy0),p(t0,yy1),p(t1,yy1)];if(isX)q.reverse();g.quad(...q,P.glass,isX?[out,0,0]:[0,0,out]);
    put(t,y+1.07,cell-.28,.085,.17,P.metal,false,.03);put(t,y+2.98,cell-.18,.065,.16,P.metal,false,.03);put(t,y+2.02,.065,1.88,.13,P.metal,false,.025);
    put(t,y+3.0,cell-.1,.10,1.05,P.trim,false,.3);put(t,y+1.82,cell-.12,.03,.15,P.metal,false,.02);
    // Transparent openings still have glass collision; no walking through a window.
    let xx=isX?fixed:t,zz=isX?t:fixed;phys.addSolid({x:xx,z:zz,w:isX?.24:cell-.18,d:isX?cell-.18:.24,y0:y+1,y1:y+3});
   }else{put(t,y+3,cell,.2,1.45,P.trim,false,.65);put(t-cell*.38,y+1.44,.07,2.88,.12,P.metal);put(t+cell*.38,y+1.44,.07,2.88,.12,P.metal);if(b.enterable){let xx=isX?fixed-out*.4:t,zz=isX?t:fixed-out*.4;W.entrances[b.id]={x:xx,z:zz,y:b.base};}}
  }
 }
}
function furnishedRoom(g,b){let f=b.id==='E'?5:0,y=b.base+f*b.floorHeight;
 if(b.id==='E'){
  // 6F equipment station is an authored learning layout, not the published floor plan.
  for(let i=0;i<3;i++){let x=b.x-14+i*14,z=b.z-33;box(g,x,y+.43,z,3.35,.86,2.5,P.metal,true);box(g,x,y+1.51,z,3.2,1.36,2.40,P.stone,true);box(g,x,y+1.52,z+1.23,2.15,1.05,.09,P.glass);box(g,x+1.3,y+1.49,z+1.29,.29,.86,.08,P.black);for(let j=0;j<4;j++)g.cylinder(x+1.3,y+1.6-j*.12,z+1.35,.033,.012,j===0?C(.8,.16,.1):P.white,8);g.cylinder(x,y+.94,z,.14,.65,P.metal,12);sign('STlabel'+i,'工作站 '+'ABC'[i],[20,35,25][i]+' s／件 · 教學設備',x,y+2.82,z+1.35,0,3.1,.53);
   W.learning.push({id:'ST'+i,name:'工作站 '+'ABC'[i],x,z:z+2.5,y,building:'E',floor:6});
   let bx=b.x-13+i*13,bz=b.z-23;box(g,bx,y+.44,bz,2,.88,1.15,[C(.36,.46,.38),C(.57,.47,.28),C(.49,.29,.22)][i],true);for(let s of [-.75,.75])g.cylinder(bx+s,y+.07,bz,.1,.13,P.black,10);sign('BINlabel'+i,['常用工具','可回收物','待維修隔離'][i],'5S 分類區',bx,y+1.2,bz+.60,0,2.5,.5);W.learning.push({id:'BIN'+i,name:['常用工具區','可回收物區','待維修隔離区'][i],x:bx,z:bz-1.2,y,building:'E',floor:6});
   W.learning.push({id:'ITEM'+i,name:['扳手','空紙箱','損壞電纜'][i],x:b.x-12+i*12,z:b.z-28,y,building:'E',floor:6});
  }
  let qx=b.x+14,qz=b.z-15;desk(g,qx,y,qz,4,1.8);monitor(g,qx,y+.83,qz,1.05);g.box(qx-.65,y+.9,qz+.4,.08,.05,.65,P.metal);sign('QClabel','品質檢驗台','10.00 ± 0.10 mm',qx,y+2.5,qz+.95,0,3.1,.6);W.learning.push({id:'QC',name:'品質檢驗台',x:qx,z:qz+1.7,y,building:'E',floor:6});
  // 5F office, with an actual separate vertical location.
  let oy=b.base+4*b.floorHeight,ox=b.x+14,oz=b.z+4;desk(g,ox,oy,oz,3.4,1.4);monitor(g,ox,oy+.83,oz,1);sign('office','工業工程與管理系','5F 系辦服務點 · 情境配置',ox,oy+2.2,oz-.90,0,4.2,.7);W.learning.push({id:'OFFICE5',name:'工管系 5F 報到櫃台',x:ox,z:oz+1.7,y:oy,building:'E',floor:5});
  for(let f0 of [4,5]){let yy=b.base+f0*b.floorHeight;sign('IEM'+f0,f0===4?'工業工程與管理系':'智慧製造教學實驗室',`${f0+1}F / 本版為教學情境配置`,b.x+14,yy+2.85,b.z-7,Math.PI,5.7,.75);}
 }else if(b.id==='L'){
  for(let xx of [-10,0,10])for(let zz of [-14,-3])shelf(g,b.x+xx,y,b.z+zz,3.2,6);
  for(let xx of [-10,0,10]){desk(g,b.x+xx,y,b.z+16,5,2);for(let j of [-1.5,1.5])chair(g,b.x+xx+j,y,b.z+17.5);}
 }else if(b.id==='T'){
  for(let zz of [-8,-2,4])for(let xx of [-16,-8,0,8]){desk(g,b.x+xx,y,b.z+zz,3.1,1.2);chair(g,b.x+xx,y,b.z+zz+1.15);monitor(g,b.x+xx,y+.80,b.z+zz,1);}
  box(g,b.x,y+1.9,b.z-b.d/2+.35,13,2.1,.10,P.white);sign('TEACH','流程．數據．人因．最佳化','INDUSTRIAL ENGINEERING & MANAGEMENT',b.x,y+2,b.z-b.d/2+.44,0,11.7,1.1);
 }else if(b.id==='OP'){
  for(let i=0;i<4;i++){let xx=b.x-12+i*7;desk(g,xx,y,b.z,4.2,1.8);g.cylinder(xx,y+1.5,b.z,.12,1.2,P.metal,14);g.box(xx,y+2,b.z,.8,.30,.6,P.stone);}
 }else if(b.id==='A'){
  desk(g,b.x,y,b.z+2,8,1.4);for(let i of [-10,10]){bench(g,b.x+i,b.z+4,y);g.cylinder(b.x+i,y+.45,b.z-4,.6,.9,P.granite,24);plant(g,b.x+i,y+.9,b.z-4,1.1);}
 }else{for(let i=0;i<3;i++)bench(g,b.x-b.w*.3+i*b.w*.3,b.z,y);}
}
function desk(g,x,y,z,w=3,d=1.3){box(g,x,y+.78,z,w,.08,d,P.wood,true);for(let dx of [-w/2+.12,w/2-.12])for(let dz of [-d/2+.1,d/2-.1])g.cylinder(x+dx,y+.38,z+dz,.035,.76,P.metal,8);}
function monitor(g,x,y,z,s=1){box(g,x,y+.36,z,1.12*s,.68*s,.055,P.black);box(g,x,y+.36,z+.032,1.00*s,.57*s,.01,C(.30,.43,.46));box(g,x,y+.06,z,.1,.25,.1,P.metal);box(g,x,y-.01,z,.5,.04,.26,P.metal);}
function chair(g,x,y,z){box(g,x,y+.45,z,.48,.07,.45,P.black);box(g,x,y+.82,z+.2,.48,.67,.045,P.black);for(let dx of [-.19,.19])for(let dz of [-.17,.17])g.cylinder(x+dx,y+.22,z+dz,.019,.44,P.metal,7);}
function shelf(g,x,y,z,w,d){box(g,x,y+1.22,z,w,2.44,.15,P.wood,true);for(let yy of [.16,.78,1.40,2.02,2.55])box(g,x,y+yy,z,w,.09,d,P.wood);for(let xx of [-w/2,w/2])box(g,x+xx,y+1.25,z,.11,2.5,d,P.wood);for(let j=0;j<26;j++)for(let yy of [.47,1.10,1.72]){let xx=x-w/2+.16+j*(w-.26)/26;box(g,xx,y+yy,z+d/2-.18,.07,.47,.36,C(.22+(j%5)*.065,.25+(j%3)*.08,.26+(j%7)*.04));}}
function exteriorLOD(b){let g=new G(),y=b.base,w=b.w,d=b.d,rs=b.id==='E'?[{x:b.x-w/2+7,z:b.z,w:14,d},{x:b.x+w/2-7,z:b.z,w:14,d},{x:b.x,z:b.z-d/2+8,w:w-28,d:16}]:[{x:b.x,z:b.z,w,d}];
 for(let r of rs){g.box(r.x,y+b.h/2,r.z,r.w,b.h,r.d,P.stone);for(let side of ['south','north','east','west']){let xx=side==='east'||side==='west',o=side==='south'||side==='east'?1:-1,len=xx?r.d:r.w,fix=(xx?r.x:r.z)+o*(xx?r.w:r.d)/2,center=xx?r.z:r.x,n=Math.round(len/4.2);for(let f=0;f<b.floors;f++){let yy=y+f*3.8;for(let j=0;j<n;j++){let t=center-len/2+(j+.5)*len/n,a=t-len/n/2+.20,bb=t+len/n/2-.20,pt=(v,h)=>xx?[fix+o*.035,h,v]:[v,h,fix+o*.035],q=[pt(a,yy+1.10),pt(bb,yy+1.10),pt(bb,yy+2.93),pt(a,yy+2.93)];if((o<0)!==xx)q.reverse();g.quad(...q,P.glass,xx?[o,0,0]:[0,0,o]);}g.box(xx?fix:r.x,yy+3.06,xx?r.z:fix,xx?.9:r.w,.13,xx?r.d:.9,P.trim);}}g.box(r.x,y+b.h+.1,r.z,r.w+.6,.45,r.d+.6,P.trim);}
 if(['A','D','HALL'].includes(b.id))hipRoof(g,b.x,y+b.h+.3,b.z,w+1,d+1,b.id==='A'?5:3);if(b.id==='A'){g.box(b.x,y+b.h+8.5,b.z,8.5,16,8.5,P.stone);hipRoof(g,b.x,y+b.h+16.8,b.z,10,10,4);}
 return g;}
function building(b){let g=new G(),y=b.base,w=b.w,d=b.d;let hole={x0:b.stair.x-3.6,x1:b.stair.x+3.6,z0:b.stair.z-3.1,z1:b.stair.z+3.1};
 let rects=b.id==='E'?[{x:b.x-w/2+7,z:b.z,w:14,d},{x:b.x+w/2-7,z:b.z,w:14,d},{x:b.x,z:b.z-d/2+8,w:w-28,d:16}]:[{x:b.x,z:b.z,w,d}];
 // Deep footing ensures there is no terrain penetrating the first occupied floor.
 for(let r of rects)box(g,r.x,y-1,r.z,r.w,1.7,r.d,P.granite);
 if(b.enterable){for(let f=0;f<b.floors;f++){let yy=y+f*b.floorHeight;for(let r of rects)plate(g,r,f?hole:null,yy,b.id,f+1);}
 for(let r of rects){let temp={...b,door:b.door};for(let s of ['south','north','east','west'])facade(g,temp,r,s);}stair(g,b);furnishedRoom(g,b);
 if(b.id==='E'){for(let f=0;f<b.floors;f++)for(let x of [b.x-14.5,b.x+14.5])for(let z=b.z-b.d/2+6;z<b.z+b.d/2-3;z+=9){let cy=b.base+(f+1)*3.8-.34;g.box(x,cy,z,.40,.08,1.32,P.metal);g.box(x,cy-.045,z,.32,.025,1.22,P.light);}for(let f of [4,5]){let yy=b.base+f*3.8;for(let z of [b.z+10,b.z+38-5]){box(g,b.x+20.6,yy+1.3,z,.12,.62,.4,C(.59,.16,.11));sign('safety'+f+z,'樓梯／出口','教學動線 · 非消防圖',b.x+19.8,yy+2.7,z,Math.PI/2,2.2,.47);}}}

 // Continuous walking balcony edges and courtyard guard rails on upper storeys.
 if(b.id==='E')for(let f=1;f<b.floors;f++){let yy=y+f*b.floorHeight;rail(g,[b.x-7.6,yy,b.z-20.5],[b.x-7.6,yy,b.z+d/2-.8]);rail(g,[b.x+7.6,yy,b.z-20.5],[b.x+7.6,yy,b.z+d/2-.8]);}
 }else{for(let r of rects)box(g,r.x,y+b.h/2,r.z,r.w,b.h,r.d,P.stone,true);for(let r of rects)for(let s of ['south','north','east','west'])facade(g,b,r,s);}
 for(let r of rects){box(g,r.x,y+b.h-.03,r.z,r.w+.8,.30,r.d+.8,P.trim);box(g,r.x,y+b.h+.28,r.z,r.w,.45,r.d,P.granite);for(let zz of [-1,1])box(g,r.x,y+b.h+.58,r.z+zz*r.d/2,r.w,.75,.25,P.stone);for(let xx of [-1,1])box(g,r.x+xx*r.w/2,y+b.h+.58,r.z,.25,.75,r.d,P.stone);}
 if(b.id==='A'){
  hipRoof(g,b.x,y+b.h+.3,b.z,b.w+1,b.d+1,5.2);for(let dx of [-12,0,12])arch(g,b.x+dx,y,b.z+b.d/2+3,8.4,4.6,2.2,P.stone);floor(g,b.x,b.z+b.d/2+1.5,38,6,y,'A',1,P.granite);
  // Recognisable clock tower massing from official campus photographs.
  let ty=y+b.h+1.7;box(g,b.x,ty+6.8,b.z,8.4,13.6,8.4,P.stone);for(let dx of [-4.25,4.25])box(g,b.x+dx,ty+7,b.z+4.22,.27,14,.22,P.trim);box(g,b.x,ty+14,b.z,9.5,.6,9.5,P.trim);hipRoof(g,b.x,ty+14.3,b.z,10.1,10.1,4.1);
  // Arched central glazing and a real circular clock geometry, not a decal cube.
  g.quad([b.x-1.3,ty+2,b.z+4.23],[b.x+1.3,ty+2,b.z+4.23],[b.x+1.3,ty+8,b.z+4.23],[b.x-1.3,ty+8,b.z+4.23],P.glass,[0,0,1]);arch(g,b.x,ty+2,b.z+4.27,2.6,7,.15,P.trim);
  let cy=ty+10.7,cz=b.z+4.31;for(let i=0;i<48;i++){let a=i*2*Math.PI/48,bb=(i+1)*2*Math.PI/48;g.tri([b.x,cy,cz],[b.x+Math.cos(a)*1.20,cy+Math.sin(a)*1.20,cz],[b.x+Math.cos(bb)*1.20,cy+Math.sin(bb)*1.20,cz],P.white,[0,0,1]);}
  for(let i=0;i<12;i++){let a=i*Math.PI/6;g.beam([b.x+Math.sin(a)*.97,cy+Math.cos(a)*.97,cz+.018],[b.x+Math.sin(a)*1.1,cy+Math.cos(a)*1.1,cz+.018],.025,P.black,5);}g.beam([b.x,cy,cz+.04],[b.x-.70,cy+.40,cz+.04],.043,P.black,6);g.beam([b.x,cy,cz+.04],[b.x+.1,cy+.9,cz+.04],.027,P.black,6);
  sign('A-title','行政大樓','CHAOYANG UNIVERSITY OF TECHNOLOGY',b.x,y+5.0,b.z+d/2+4.13,0,12,1.03);
 }else if(['HALL','D'].includes(b.id))hipRoof(g,b.x,y+b.h+.60,b.z,w+1,d+1,3.0);
 else if(b.id==='GYM'||b.id==='HANGAR'){for(let i=0;i<30;i++){let a=Math.PI*i/30,bb=Math.PI*(i+1)/30,p=(t,zz)=>[b.x+w/2*Math.cos(t),y+b.h+Math.sin(t)*4,zz];g.quad(p(a,b.z-d/2),p(bb,b.z-d/2),p(bb,b.z+d/2),p(a,b.z+d/2),P.metal);}}
 for(let k=0;k<3;k++){let xx=b.x-w*.22+k*w*.19;box(g,xx,y+b.h+1.2,b.z-3,2.5,1.15,2,P.metal);g.cylinder(xx,y+b.h+1.85,b.z-3,.75,.12,P.black,20);}
 let ex=b.door[0],ez=b.door[1];g.road({x:ex,z:ez},{x:M.clamp(ex,b.x-w/2,b.x+w/2),z:M.clamp(ez,b.z-d/2,b.z+d/2)},5,P.pave,.06);
 W.chunks.push({geo:g,lodGeo:exteriorLOD(b),center:[b.x,y+b.h/2,b.z],radius:Math.hypot(w,d)/2,kind:'building',id:b.id});
 W.labels.push({id:b.id,name:b.name,sub:b.enterable?`1–${b.floors}F 可行走｜高度為重建設定`:'外部探索',x:ex,y:CQ.ground(ex,ez)+2.95,z:ez,w:4.8,h:.8});
}
let rand=(()=>{let s=845;return()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296;};})();
function leafCard(g,c,size,yaw,tilt=0,col=P.leaves){let u=[Math.cos(yaw)*size,0,-Math.sin(yaw)*size],v=[Math.sin(yaw)*Math.sin(tilt)*size,Math.cos(tilt)*size,Math.cos(yaw)*Math.sin(tilt)*size],p=(a,b)=>M.add(c,M.add(M.scale(u,a),M.scale(v,b)));g.quad(p(-1,-1),p(1,-1),p(1,1),p(-1,1),col,M.norm(M.cross(u,v)),[[0,1],[1,1],[1,0],[0,0]],11);}
function plant(g,x,y,z,s=1){for(let i=0;i<7;i++)leafCard(g,[x+(rand()-.5)*s,y+s*.6+(rand()-.5)*s*.7,z+(rand()-.5)*s],s*.56,rand()*6.28,(rand()-.5)*.7);}
function tree(g,x,z,s=1){let y=CQ.ground(x,z),height=6.8*s;g.beam([x,y,z],[x+.2*s,y+height*.73,z+.13*s],.16*s,P.wood,10);g.beam([x+.2*s,y+height*.73,z+.13*s],[x+.12*s,y+height,z-.12*s],.085*s,P.wood,8);for(let j=0;j<5;j++){let a=j*2.399,base=[x+.15*s,y+height*.50+j*.32*s,z],end=[x+Math.cos(a)*1.8*s,y+height*.9+j*.20*s,z+Math.sin(a)*1.8*s];g.beam(base,end,.055*s,P.wood,7);}
 for(let i=0;i<25;i++){let a=rand()*6.28,r=Math.sqrt(rand())*2.4*s,yy=y+height+(rand()-.5)*2.5*s;leafCard(g,[x+Math.cos(a)*r,yy,z+Math.sin(a)*r],(.8+rand()*.7)*s,rand()*6.28,(rand()-.5)*1.4,C(.82+rand()*.14,.91+rand()*.12,.68+rand()*.2,11));}phys.addSolid({x,z,w:.32*s,d:.32*s,y0:y,y1:y+height*.6});}
function bench(g,x,z,y=CQ.ground(x,z),yaw=0){let local=new G();for(let i=0;i<5;i++)local.box(0,.48,-.27+i*.135,2.25,.05,.10,P.wood);for(let i=0;i<4;i++)local.box(0,.76+i*.12,-.27,2.25,.08,.055,P.wood);for(let dx of [-.87,.87]){local.beam([dx,.02,-.23],[dx,.51,-.23],.03,P.metal,8);local.beam([dx,.02,.24],[dx,.51,.24],.03,P.metal,8);local.beam([dx,.35,-.26],[dx,1.12,-.26],.027,P.metal,8);}g.append(local,M.trs(x,y,z,yaw));}
function lamp(g,x,z){let y=CQ.ground(x,z);g.cylinder(x,y+.1,z,.23,.2,P.granite,16);g.cylinder(x,y+3.4,z,.055,6.8,P.black,12,.039);g.beam([x,y+6.6,z],[x+.6,y+6.75,z],.04,P.black,8);g.sphere(x+.68,y+6.71,z,.43,.10,.25,P.black,16,8);g.sphere(x+.68,y+6.63,z,.32,.028,.18,P.light,14,6);}
function street(g,a,b,width=9){g.road(a,b,width+4,P.pave,.045);g.road(a,b,width,P.road,.058);let len=M.dist(a,b),dx=(b.x-a.x)/len,dz=(b.z-a.z)/len;for(let i=0;i<len;i+=4.5){let p={x:a.x+dx*i,z:a.z+dz*i},q={x:a.x+dx*Math.min(i+2.6,len),z:a.z+dz*Math.min(i+2.6,len)};g.road(p,q,.12,P.white,.064);}for(let sign of [-1,1])for(let i=0;i<len;i+=2){let xx=a.x+dx*(i+1)-dz*sign*(width/2+.11),zz=a.z+dz*(i+1)+dx*sign*(width/2+.11),yy=CQ.ground(xx,zz);g.box(xx,yy+.08,zz,.18,.15,Math.min(1.93,len-i),P.granite,Math.atan2(dx,dz));}}
function terrain(){let g=new G(),N=96,min=-1050,max=1050;for(let i=0;i<N;i++)for(let j=0;j<N;j++){let x=min+(max-min)*i/N,z=min+(max-min)*j/N,s=(max-min)/N;if(x>-237&&x+s<198&&z>-290&&z+s<263)continue;let p=(xx,zz)=>[xx,CQ.ground(xx,zz)-.22,zz];let c=(xx,zz)=>{let e=.8;return M.norm([CQ.ground(xx-e,zz)-CQ.ground(xx+e,zz),2*e,CQ.ground(xx,zz-e)-CQ.ground(xx,zz+e)]);};for(let [xx,zz]of[[x,z],[x,z+s],[x+s,z+s],[x,z],[x+s,z+s],[x+s,z]])g.vertex(p(xx,zz),c(xx,zz),P.grass,[xx,zz],5);}
 W.chunks.push({geo:g,center:[0,0,0],radius:1600,kind:'terrain'});
 // High-resolution walkable terrain overlay prevents low-resolution mountain mesh
 // from intersecting streets/building pads. Identical height function in physics.
 let near=new G();for(let x=-248;x<205;x+=3)for(let z=-305;z<275;z+=3){let p=(a,b)=>[a,CQ.ground(a,b)+.008,b],normal=(a,b)=>M.norm([CQ.ground(a-.4,b)-CQ.ground(a+.4,b),.8,CQ.ground(a,b-.4)-CQ.ground(a,b+.4)]);for(let [a,b]of[[x,z],[x,z+3],[x+3,z+3],[x,z],[x+3,z+3],[x+3,z]])near.vertex(p(a,b),normal(a,b),P.grass,[a,b],5);}W.chunks.push({geo:near,center:[0,10,0],radius:500,kind:'ground',noShadow:true});
}
function outdoor(){W={key:'campus',geo:new G(),chunks:[],labels:[],signs:[],lifts:[],learning:[],entrances:{},boxes:D.buildings.map(b=>({x:b.x,z:b.z,w:b.w+.4,d:b.d+.4})),bounds:D.boundary};phys=W.physics=new CQ.Spatial();terrain();let g=new G();
 const ring=[[-83,88],[-83,-177],[88,-177],[88,99],[15,109],[-45,108],[-83,88]],roads=[];for(let i=0;i<ring.length-1;i++)roads.push([ring[i],ring[i+1]]);roads.push([[8,255],[8,211]],[[8,211],[-8,164]],[[-8,164],[-45,108]],[[-8,164],[34,166]],[[34,166],[88,99]],[[-83,88],[-212,31]],[[-212,31],[-216,-205]],[[-216,-205],[-194,-242]],[[88,-177],[50,-190]]);
 for(let [a,b]of roads)street(g,{x:a[0],z:a[1]},{x:b[0],z:b[1]},9);
 g.plane(6,-42,143,108,P.pave);g.plane(6,25,65,42,P.plaza);for(let x of [-35,20,62])for(let z of [-75,-35]){g.plane(x,z,19,20,P.grass,null,.065);for(let zz of [-10,10])g.road({x:x-9.8,z:z+zz},{x:x+9.8,z:z+zz},.22,P.granite,.13);}
 // Public stair next to a naturally sloped alternate walking route.
 let sx=7,z0=36,z1=9,ya=CQ.ground(sx,z0)+.075,yb=CQ.ground(sx,z1)+.12,steps=18;for(let i=0;i<steps;i++){let zz=z0-(i+.5)*(z0-z1)/steps,yy=ya+(i+1)*(yb-ya)/steps;g.box(sx,yy-.065,zz,8.5,.13,(z0-z1)/steps,P.granite);phys.addSurface({x:sx,z:zz,w:8.5,d:(z0-z1)/steps,y:yy,kind:'outdoor-step',floor:0});}
 // Fountain with circular rim, water and thin jets.
 let fy=CQ.ground(7,-58);g.ring(7,fy+.4,-58,6.6,6.6,.7,P.granite,80);g.cylinder(7,fy+.19,-58,6,.20,P.water,72);g.cylinder(7,fy+.7,-58,1,.85,P.stone,28);g.cylinder(7,fy+1.65,-58,.38,1.45,P.stone,24);g.cylinder(7,fy+2.42,-58,1.5,.13,P.granite,48);for(let i=0;i<16;i++){let a=i*Math.PI/8;for(let j=0;j<16;j++){let p=t=>[7+Math.cos(a)*(1.1+4.0*t),fy+2.45+1.6*t-3.55*t*t,-58+Math.sin(a)*(1.1+4*t)];g.beam(p(j/16),p((j+1)/16),.015,C(.72,.87,.87),5);}}phys.addSolid({x:7,z:-58,w:12.3,d:12.3,y0:fy,y1:fy+.5});
 // Athletics and recreation, asphalt parking, campus furniture.
 g.ring(-169,null,-113,42,93,10,C(.72,.35,.26,14),96);g.plane(-169,-113,52,107,P.grass);for(let i=1;i<6;i++)g.ring(-169,null,-113,42-i*1.6,93-i*1.6,.095,P.white,96);
 for(let zz of [-131,-91,-52]){g.plane(-108,zz,29,34,C(.48,.55,.49));for(let x of [-121,-95])g.road({x,z:zz-15},{x,z:zz+15},.08,P.white);for(let dz of [-15,15])g.road({x:-121,z:zz+dz},{x:-95,z:zz+dz},.08,P.white);for(let dz of [-12,12]){let y=CQ.ground(-108,zz+dz);g.cylinder(-108,y+1.5,zz+dz,.055,3,P.metal,9);g.box(-108,y+3.2,zz+dz,1.8,1.04,.06,P.white);g.ring(-108,y+2.90,zz+dz-.5,.23,.23,.025,P.metal,20);}}
 for(let [px,pz,pw,pd]of[[-22,134,35,40],[-86,133,41,32],[56,139,29,42]]){g.plane(px,pz,pw,pd,P.road);for(let x=px-pw/2+1;x<px+pw/2;x+=2.6)g.road({x,z:pz-pd/2+.4},{x,z:pz+pd/2-.4},.075,P.white,.08);}
 for(let i=0;i<8;i++){let x=-23+(i%4)*7,z=132+Math.floor(i/4)*10;car(g,x,z,i*.37);}
 // School gate stone signage; it is real 3D geometry, not the generated image.
 let gy=CQ.ground(26,193);box(g,26,gy+.87,193,13,1.74,.95,P.granite,true);sign('GATE-SIGN','朝陽科技大學','CHAOYANG UNIVERSITY OF TECHNOLOGY',26,gy+1.10,193.50,0,11.7,1.15);
 box(g,-4,CQ.ground(-4,213)+1.40,213,4,2.8,4.8,P.stone,true);g.box(-4,CQ.ground(-4,213)+2.95,213,4.7,.18,5.5,P.trim);box(g,7,CQ.ground(7,209)+.98,209,7,.095,.095,C(.85,.37,.19));
 for(let z=190;z>-180;z-=22){lamp(g,-76,z);lamp(g,81,z);}for(let x of [-49,35,73])for(let z of [-86,-42,15])bench(g,x,z);
 sign('mapboard','朝陽主校區','公開圖參考配置｜非實測導航',-8,CQ.ground(-8,183)+1.90,183,0,5.2,1.45);g.cylinder(-10,CQ.ground(-10,183)+1.1,183,.06,2.2,P.metal,8);g.cylinder(-6,CQ.ground(-6,183)+1.1,183,.06,2.2,P.metal,8);
 W.chunks.push({geo:g,center:[0,15,0],radius:500,kind:'landscape'});
 for(let b of D.buildings)building(b);
 // Broadleaf trees replace faceted polygon blobs. Spatial sectors are culled on Quest.
 let sectors=new Map(),positions=[];const addTree=(x,z,s)=>{if(D.buildings.some(b=>Math.abs(x-b.x)<b.w/2+2&&Math.abs(z-b.z)<b.d/2+2))return;let key=Math.floor(x/95)+','+Math.floor(z/95);if(!sectors.has(key))sectors.set(key,{geo:new G(),center:[Math.floor(x/95)*95+47.5,30,Math.floor(z/95)*95+47.5],radius:85,kind:'foliage'});tree(sectors.get(key).geo,x,z,s);positions.push([x,z,s]);};
 for(let z=183;z>-180;z-=16){addTree(-72,z,1+rand()*.28);addTree(75,z,.85+rand()*.28);}for(let x of [-35,20,62])for(let z of [-75,-35])for(let i=0;i<3;i++)addTree(x+(rand()-.5)*14,z+(rand()-.5)*13,.82+rand()*.32);
 for(let i=0;i<150;i++){let x=-240+rand()*460,z=-292+rand()*500;if((Math.abs(x)>183||z<-250)&&!roads.some(([a,b])=>{let p={x:a[0],z:a[1]},q={x:b[0],z:b[1]},t=M.clamp(((x-p.x)*(q.x-p.x)+(z-p.z)*(q.z-p.z))/M.dist(p,q)**2,0,1);return Math.hypot(x-p.x-(q.x-p.x)*t,z-p.z-(q.z-p.z)*t)<7;}))addTree(x,z,1.1+rand()*.45);}
 for(let z of [145,158,173,184]){addTree(-2,z,.85);addTree(23,z,.92); }for(let s of sectors.values())W.chunks.push(s);W.treeCount=positions.length;W.floorCount=phys.surfaces.filter(s=>s.kind==='slab').length;W.buildingFloorCount=D.buildings.filter(b=>b.enterable).reduce((n,b)=>n+b.floors,0);W.geo=W.chunks[0].geo;return W;
}
function car(g,x,z,a=0){let y=CQ.ground(x,z),v=new G(),col=C(.30+.17*Math.sin(a),.33+.15*Math.cos(a),.36+.12*Math.sin(a));v.sphere(0,.70,0,.90,.36,2.0,col,18,9);v.sphere(0,1.08,-.2,.81,.38,1.12,col,16,8);v.box(0,1.16,-.93,1.43,.50,.065,P.glass,-.12);v.box(0,1.15,.67,1.45,.48,.075,P.glass,.05);for(let xx of [-.84,.84])for(let zz of [-1.23,1.20]){v.sphere(xx,.37,zz,.13,.35,.35,P.black,12,8);v.sphere(xx*1.03,.37,zz,.12,.21,.21,P.metal,10,7);}for(let xx of [-.56,.56])v.sphere(xx,.70,-1.93,.21,.1,.055,P.light,10,6);g.append(v,M.trs(x,y,z));}
CQ.makeWorld=()=>outdoor();
CQ.makeAvatar=(color=[.24,.32,.31],t=0,moving=false)=>{let g=new G(),skin=C(.62,.47,.35),shirt=C(...color),jeans=C(.16,.19,.21),swing=moving?Math.sin(t*8)*.29:0;g.sphere(0,1.17,0,.25,.32,.15,shirt,16,10);g.sphere(0,.87,0,.20,.12,.13,jeans,14,8);g.cylinder(0,1.50,0,.065,.15,skin,12);g.sphere(0,1.67,0,.12,.16,.135,skin,20,12);g.sphere(0,1.765,.025,.128,.093,.132,P.black,18,10);g.sphere(0,1.66,-.129,.026,.039,.031,skin,10,7);for(let i of [-1,1]){let z=i*swing,knee=[i*.12,.48,-z*.25],ankle=[i*.12,.11,z];g.beam([i*.12,.87,0],knee,.085,jeans,12);g.sphere(...knee,.087,.087,.087,jeans,10,7);g.beam(knee,ankle,.066,jeans,12);g.sphere(i*.12,.07,z-.055,.09,.069,.18,P.black,14,7);g.beam([i*.27,1.36,0],[i*.32,1.01,-z*.6],.065,shirt,12);g.beam([i*.32,1.01,-z*.6],[i*.31,.76,-z],.047,skin,10);g.sphere(i*.31,.73,-z,.048,.068,.045,skin,10,7);g.beam([i*.16,1.38,-.02],[i*.19,.98,-.13],.024,P.black,7);}g.sphere(0,1.16,.18,.22,.28,.09,C(.12,.14,.13),14,8);g.box(-.075,1.21,-.153,.045,.065,.01,P.white);return g;};
CQ.makeCart=()=>{let g=new G();g.box(0,.52,0,1.5,.2,2.55,P.stone);g.sphere(0,.75,-.9,.75,.33,.45,P.stone,16,9);for(let x of [-.72,.72])for(let z of [-.86,.86]){g.sphere(x,.30,z,.14,.29,.29,P.black,12,8);g.sphere(x*1.06,.30,z,.09,.16,.16,P.metal,12,8);g.beam([x,.66,z],[x,2.06,z],.025,P.metal,8);}g.sphere(0,2.10,0,.91,.085,1.48,P.stone,20,7);g.box(0,.95,.2,1.2,.10,.82,P.black);g.box(0,1.24,.57,1.2,.56,.1,P.black);return g;};
CQ.worldTransform=(dst,src,t)=>dst.append(src,t);CQ.Palette=P;
})();
