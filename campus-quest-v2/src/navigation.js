'use strict';
/* A* on a game-space grid; no claim about real campus metric accuracy. */
CQ.pathfind=(start,end,boxes,step=4)=>{
 const b=CQ.DATA.boundary,w=Math.floor((b.maxX-b.minX)/step)+1,hh=Math.floor((b.maxZ-b.minZ)/step)+1;
 const key=(x,z)=>z*w+x,pos=i=>({x:b.minX+(i%w)*step,z:b.minZ+Math.floor(i/w)*step});
 const valid=(x,z)=>x>=0&&z>=0&&x<w&&z<hh&&!CQ.collision(b.minX+x*step,b.minZ+z*step,boxes,.9);
 function closest(p){const xx=Math.round((p.x-b.minX)/step),zz=Math.round((p.z-b.minZ)/step);for(let r=0;r<5;r++){let c=[];for(let x=xx-r;x<=xx+r;x++)for(let z=zz-r;z<=zz+r;z++)if(valid(x,z)){let id=key(x,z),q=pos(id);if(CQ.lineClear(p,q,boxes,.45))c.push([CQ.M.dist(p,q),id]);}if(c.length)return c.sort((a,b)=>a[0]-b[0])[0][1];}return -1;}
 let s=closest(start),t=closest(end);if(s<0||t<0)return null;
 let gs=new Float32Array(w*hh).fill(Infinity),prev=new Int32Array(w*hh).fill(-1),closed=new Uint8Array(w*hh),heap=[];gs[s]=0;
 const push=(id,f)=>{let n=heap.length;heap.push([id,f]);while(n){let p=(n-1)>>1;if(heap[p][1]<=f)break;[heap[n],heap[p]]=[heap[p],heap[n]];n=p;}};
 const pop=()=>{let r=heap[0],last=heap.pop();if(heap.length){heap[0]=last;let n=0;while(2*n+1<heap.length){let c=2*n+1;if(c+1<heap.length&&heap[c+1][1]<heap[c][1])c++;if(heap[n][1]<=heap[c][1])break;[heap[n],heap[c]]=[heap[c],heap[n]];n=c;}}return r;};
 push(s,0);let target=pos(t),found=false;
 while(heap.length){let [i]=pop();if(closed[i])continue;if(i===t){found=true;break;}closed[i]=1;let x=i%w,z=Math.floor(i/w);for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++){if(!(dx||dz)||!valid(x+dx,z+dz))continue;if(dx&&dz&&(!valid(x+dx,z)||!valid(x,z+dz)))continue;let j=key(x+dx,z+dz),v=gs[i]+step*Math.hypot(dx,dz);if(v<gs[j]){gs[j]=v;prev[j]=i;push(j,v+CQ.M.dist(pos(j),target));}}}
 if(!found)return null;let points=[end],i=t;while(i>=0){points.push(pos(i));if(i===s)break;i=prev[i];}points.push(start);points.reverse();
 let smooth=[points[0]],at=0;while(at<points.length-1){let next=at+1;for(let j=points.length-1;j>at+1;j--)if(CQ.lineClear(points[at],points[j],boxes,.75)){next=j;break;}smooth.push(points[next]);at=next;}
 return {points:smooth,length:smooth.slice(1).reduce((v,p,i)=>v+CQ.M.dist(p,smooth[i]),0)};
};
CQ.deliveryPlan=(start,stops,end,boxes)=>{
 let best=null;
 const perms=a=>a.length<=1?[a]:a.flatMap((v,i)=>perms(a.filter((_,j)=>j!==i)).map(p=>[v,...p]));
 let cache=new Map();const edge=(a,b)=>{let k=[a.x,a.z,b.x,b.z].join(',');if(!cache.has(k))cache.set(k,CQ.pathfind(a,b,boxes)?.length??Infinity);return cache.get(k);};
 for(let order of perms(stops)){let seq=[start,...order,end],length=seq.slice(1).reduce((sum,p,i)=>sum+edge(seq[i],p),0);if(!best||length<best.length)best={order:order.map(p=>p.id),length};}return best;
};
