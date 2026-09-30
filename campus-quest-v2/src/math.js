'use strict';
window.CQ=window.CQ||{};
CQ.M={
 identity:()=>new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]),
 mul:(a,b)=>{const o=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++)for(let k=0;k<4;k++)o[c*4+r]+=a[k*4+r]*b[c*4+k];return o;},
 trs:(x=0,y=0,z=0,ry=0,sx=1,sy=1,sz=1)=>{let c=Math.cos(ry),s=Math.sin(ry);return new Float32Array([c*sx,0,-s*sx,0,0,sy,0,0,s*sz,0,c*sz,0,x,y,z,1]);},
 persp:(fov,aspect,near=.1,far=1100)=>{let f=1/Math.tan(fov/2);return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)/(near-far),-1,0,0,2*far*near/(near-far),0]);},
 look:(eye,target,up=[0,1,0])=>{let z=CQ.M.norm(CQ.M.sub(eye,target)),x=CQ.M.norm(CQ.M.cross(up,z)),y=CQ.M.cross(z,x);return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-CQ.M.dot(x,eye),-CQ.M.dot(y,eye),-CQ.M.dot(z,eye),1]);},
 inverseRigid:a=>{let o=CQ.M.identity();for(let i=0;i<3;i++)for(let j=0;j<3;j++)o[i*4+j]=a[j*4+i];for(let i=0;i<3;i++)o[12+i]=-(o[i]*a[12]+o[4+i]*a[13]+o[8+i]*a[14]);return o;},
 point:(a,v)=>[a[0]*v[0]+a[4]*v[1]+a[8]*v[2]+a[12],a[1]*v[0]+a[5]*v[1]+a[9]*v[2]+a[13],a[2]*v[0]+a[6]*v[1]+a[10]*v[2]+a[14]],
 dir:(a,v)=>[a[0]*v[0]+a[4]*v[1]+a[8]*v[2],a[1]*v[0]+a[5]*v[1]+a[9]*v[2],a[2]*v[0]+a[6]*v[1]+a[10]*v[2]],
 add:(a,b)=>a.map((v,i)=>v+b[i]),sub:(a,b)=>a.map((v,i)=>v-b[i]),scale:(a,s)=>a.map(v=>v*s),dot:(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0),
 cross:(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],
 norm:a=>{let l=Math.hypot(...a)||1;return a.map(v=>v/l);},clamp:(x,a,b)=>Math.max(a,Math.min(b,x)),
 dist:(a,b)=>Math.hypot(a.x-b.x,a.z-b.z)
};
CQ.ground=(x,z)=>(205-z)*.021; // authored gentle slope, not measured terrain
CQ.collision=(x,z,boxes,r=.42)=>boxes.some(b=>{
 const dx=Math.max(Math.abs(x-b.x)-b.w/2,0), dz=Math.max(Math.abs(z-b.z)-b.d/2,0);
 return dx*dx+dz*dz<r*r;
});
CQ.lineClear=(a,b,boxes,r=.45)=>{const n=Math.max(1,Math.ceil(CQ.M.dist(a,b)/.35));for(let i=0;i<=n;i++){let t=i/n;if(CQ.collision(a.x+(b.x-a.x)*t,a.z+(b.z-a.z)*t,boxes,r))return false;}return true;};
CQ.flowshop=(times,n)=>{let end=Array(times.length).fill(0);for(let j=0;j<n;j++)for(let k=0;k<times.length;k++)end[k]=Math.max(end[k],k?end[k-1]:0)+times[k];return end.at(-1);};
CQ.inSpec=x=>x>=9.9-1e-9&&x<=10.1+1e-9;
