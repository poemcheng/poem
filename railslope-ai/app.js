import * as THREE from 'three';
import { OrbitControls } from 'three/addons/OrbitControls.js';

const LINES=[
 {line:"縱貫線",total:1839,ch:344,util:94.75,bottle:"八堵–樹林",attention:"high"},
 {line:"宜蘭線",total:910,ch:101,util:89.43,bottle:"八堵–雙溪",attention:"high"},
 {line:"平溪線",total:374,ch:103,util:61.82,bottle:"三貂嶺–菁桐",attention:"high"},
 {line:"北迴線",total:330,ch:22,util:77.37,bottle:"蘇澳新–和平",attention:"high"},
 {line:"臺中線",total:294,ch:40,util:84.32,bottle:"臺中–彰化",attention:"mid"},
 {line:"集集線",total:172,ch:63,util:52.94,bottle:"二水–車埕",attention:"mid"},
 {line:"內灣線",total:346,ch:37,util:75.56,bottle:"九讚頭–內灣",attention:"mid"},
 {line:"屏東線",total:102,ch:0,util:90.43,bottle:"高雄–潮州",attention:"mid"},
 {line:"臺東線",total:568,ch:4,util:75.56,bottle:"花蓮–玉里",attention:"mid"},
 {line:"深澳線",total:92,ch:3,util:37.04,bottle:"瑞芳–海科",attention:"low"},
 {line:"花蓮港線",total:34,ch:0,util:30.00,bottle:"北埔–花蓮港",attention:"low"},
 {line:"成追線",total:3,ch:0,util:18.75,bottle:"成功–追分",attention:"low"},
 {line:"南迴線",total:0,ch:0,util:60.00,bottle:"枋寮–臺東",attention:"mid"}
];

const EVENTS=[
 {date:"2026/05/04",line:"北迴線",place:"宜蘭－和平站間",type:"地震",title:"宜蘭南方地震，北迴線受影響",desc:"TRA-04 記錄天然災變；TRA-08/09/10 同日可見天然災變(地震)原因標記。",trains:"22",minutes:"748*",passengers:"—",coord:[121.78,24.42]},
 {date:"2026/05/13",line:"北迴線",place:"新城－鳳林",type:"地震",title:"花蓮北方規模 5.0 地震",desc:"同日行車資料有 34 筆天然災變(地震)原因標記。",trains:"9",minutes:"274*",passengers:"—",coord:[121.54,23.95]},
 {date:"2025/11/11",line:"臺東線",place:"萬榮－光復",type:"泥流",title:"鳳凰颱風泥流淹及路線",desc:"光復隧道北口上方淹水，上下行列車預防性停駛。",trains:"17 停駛",minutes:"—",passengers:"—",coord:[121.42,23.62]},
 {date:"2025/09/24",line:"宜蘭線",place:"八斗子站",type:"落石",title:"落石侵入路線",desc:"列車無法進站，工務移除落石後恢復正常行駛。",trains:"2 停駛",minutes:"—",passengers:"約 30",coord:[121.80,25.14]},
 {date:"2025/07/09",line:"內灣線",place:"上員－榮華",type:"落石",title:"列車撞擊侵入路線石頭",desc:"1801 次撞石後水箱破裂、引擎故障；現場限速 25 km/h。",trains:"3",minutes:"44",passengers:"—",coord:[121.02,24.74]},
 {date:"2025/05/18",line:"北迴線",place:"和仁－崇德",type:"土石流/淹水",title:"豪雨造成水淹軌面並伴隨土石流",desc:"西正線水淹超過軌面且路線受損，區間一度雙向不通。",trains:"多列調整",minutes:"—",passengers:"—",coord:[121.70,24.18]},
 {date:"2022/10/16",line:"宜蘭線",place:"七堵－汐止、雙溪－貢寮等",type:"豪雨/土石流",title:"豪雨水淹軌面與部分土石流",desc:"原始影響欄：78 列 / 6654 分 / 旅客 16769 人。",trains:"78",minutes:"6,654",passengers:"16,769",coord:[121.72,25.03]}
];

const SLOPES=[
 {line:"宜蘭線",code:"1040E-001313-001394L",grade:"C",section:"八堵－暖暖",km:"1,313–1,394 m",desc:"位於山崩與地質敏感區，未發現明顯異狀。",coord:[121.731,25.107]},
 {line:"宜蘭線",code:"1040E-001443-001498L",grade:"C",section:"八堵－暖暖",km:"1,443–1,498 m",desc:"位於山崩與地質敏感區，未發現明顯異狀。",coord:[121.734,25.106]},
 {line:"宜蘭線",code:"1040E-001498-001570L",grade:"C",section:"八堵－暖暖",km:"1,498–1,570 m",desc:"位於山崩與地質敏感區，未發現明顯異狀。",coord:[121.736,25.105]},
 {line:"宜蘭線",code:"1040W-000945-000956R",grade:"C",section:"八堵－暖暖",km:"945–956 m",desc:"鋼筋外露銹蝕與洩水孔堵塞。",coord:[121.729,25.108]},
 {line:"宜蘭線",code:"1040W-000956-000980R",grade:"C",section:"八堵－暖暖",km:"956–980 m",desc:"噴凝土坡面混凝土剝落、破損，建議由工務修補。",coord:[121.730,25.108]},
 {line:"宜蘭線",code:"1040W-000990-001070R",grade:"C",section:"八堵－暖暖",km:"990–1,070 m",desc:"坡面噴凝土劣化剝落及樹木根系造成破損。",coord:[121.732,25.107]},
 {line:"宜蘭線",code:"1040W-001515-001550R",grade:"C",section:"八堵－暖暖",km:"1,515–1,550 m",desc:"樹根拔起若翻落有影響鐵軌之虞，建議加強調查。",coord:[121.738,25.104]},
 {line:"北迴線",code:"1050E-001492-001688L",grade:"C",section:"蘇澳新－新城",km:"1,492–1,688 m",desc:"原始清冊無 GPS；依北迴線站間與里程做展示定位。",coord:[121.854,24.585]},
 {line:"北迴線",code:"1050E-001702-001742L",grade:"C",section:"蘇澳新－新城",km:"1,702–1,742 m",desc:"原始清冊無 GPS；依北迴線站間與里程做展示定位。",coord:[121.857,24.574]},
 {line:"北迴線",code:"1050E-001749-001912L",grade:"C",section:"蘇澳新－新城",km:"1,749–1,912 m",desc:"原始清冊無 GPS；依北迴線站間與里程做展示定位。",coord:[121.861,24.561]}
];

const HOTSPOTS=[
 {line:"縱貫線",coord:[120.90,24.50],weight:1.00,label:"縱貫線 C高 344 / 最高利用率 94.75%"},
 {line:"宜蘭線",coord:[121.77,24.90],weight:.88,label:"宜蘭線 C高 101 / 最高利用率 89.43%"},
 {line:"平溪線",coord:[121.76,25.00],weight:.70,label:"平溪線 C高 103"},
 {line:"北迴線",coord:[121.73,24.28],weight:.76,label:"北迴線 C高 22 / 最高利用率 77.37%"},
 {line:"臺中線",coord:[120.69,24.15],weight:.63,label:"臺中線 C高 40 / 最高利用率 84.32%"},
 {line:"集集線",coord:[120.79,23.83],weight:.56,label:"集集線 C高 63"},
 {line:"內灣線",coord:[121.12,24.72],weight:.58,label:"內灣線 C高 37 / 最高利用率 75.56%"}
];

const CASE_CHAINS={
 "北迴線":{asset:"1050E-001492-001688L、1050E-001702-001742L",assetDesc:"TRA-03 北迴線 C 級邊坡候選；蘇澳新—新城；里程 1,492–1,742 m",event:"2026/05/04 地震｜宜蘭－和平站間",eventDesc:"TRA-04 天然災變事件，與北迴線同線別。",train:"受影響列車 22 車次",trainDesc:"從 TRA-08/09/10 辨識同日天然災變(地震)原因並彙整受影響車次。",delay:"延誤合計 748* 分鐘",delayDesc:"* 系統衍生統計：每一受影響車次取當日最大延誤後加總。",capacity:"蘇澳新–和平 77.37%",capacityDesc:"TRA-11 顯示該區段利用率偏高。",action:"工務巡查 + 慢行複核 + 行控調整",actionDesc:"先查核邊坡與軌道狀態，再依現場結果決定慢行與調度。",rules:["同線別匹配：北迴線 TRA-03 ↔ TRA-04。","站間 / 地名匹配：宜蘭、和平、和仁、崇德。","以事件日期回查 TRA-08/09/10。","再接 TRA-11 瓶頸容量。"],decision:["優先確認東部幹線坡面與軌道通行條件。","若可通行但風險未排除，先採慢行與加密巡查。","保留本次巡檢與復原時間，形成下次事件記憶。"]},
 "宜蘭線":{asset:"1040E-001313-001394L、1040E-001443-001498L",assetDesc:"TRA-03 宜蘭線 C 級邊坡候選；八堵—暖暖；位於山崩與地質敏感區。",event:"2025/09/24 落石｜八斗子站",eventDesc:"TRA-04 記錄落石侵入路線。",train:"受影響列車 2 列停駛",trainDesc:"原始事件欄已明列停駛 2 列次與旅客約 30 人。",delay:"停駛 / 旅客衝擊",delayDesc:"此案例重點為落石造成進站受阻。",capacity:"八堵–雙溪 89.43%",capacityDesc:"高利用率區間，若阻斷持續，營運影響擴散快。",action:"落石排除 + 現場封鎖 + 恢復查核",actionDesc:"完成清除後再恢復正常行駛。",rules:["同線別匹配：宜蘭線清冊 ↔ 宜蘭線事件。","站間優先：八堵、暖暖、瑞芳、雙溪。","容量資料用於補強營運後果。"],decision:["高利用率宜蘭線應先處理落石排除與通行安全。","後續將落石位置回填對應邊坡編號。"]},
 "內灣線":{asset:"TRA-03 內灣線候選邊坡群（346 處 / C高 37）",assetDesc:"目前以線別與站間作候選關聯。",event:"2025/07/09 落石｜上員－榮華",eventDesc:"TRA-04 記錄列車撞石、水箱破裂與引擎故障。",train:"1801 / 1803 / 1846 次",trainDesc:"事件表已明列受影響車次。",delay:"44 分鐘",delayDesc:"由原始事件影響欄整理為 3 車次共 44 分鐘。",capacity:"九讚頭–內灣 75.56%",capacityDesc:"中高利用率。",action:"慢行 25 km/h + 清理落石 + 解除慢行",actionDesc:"完整的支線處置案例。",rules:["站間精確匹配：上員－榮華。","先讀原始事故影響欄，再補容量與邊坡資料。"],decision:["展示系統不只支援幹線，也保留支線事故處置知識。"]}
};

const STORE_KEY="railslope_real3d_memory_v1";
let selected="縱貫線";
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const viewer=$("#viewer3d"), hoverLabel=$("#hoverLabel");
let renderer,scene,camera,controls,meta,demPixels,demW,demH,planeW,planeH,verticalScale=8.3;
let routeGroup,eventGroup,slopeGroup,heatGroup,stationGroup,terrainMesh;
const routeObjects=[],pickables=[];
const raycaster=new THREE.Raycaster(), pointer=new THREE.Vector2();
raycaster.params.Line.threshold=.28;

function toast(t){const e=$("#toast");e.textContent=t;e.classList.add("show");clearTimeout(e._);e._=setTimeout(()=>e.classList.remove("show"),2200)}
function getCases(){try{return JSON.parse(localStorage.getItem(STORE_KEY)||"[]")}catch{return[]}}
function saveCaseData(arr){localStorage.setItem(STORE_KEY,JSON.stringify(arr));renderLocalCases()}
function level(att){return att==="high"?"高關注":att==="mid"?"注意":"一般"}
function lineInfo(name){return LINES.find(v=>v.line===name)||LINES[0]}

async function loadJSON(url){const r=await fetch(url,{cache:"no-store"});if(!r.ok)throw new Error(url+" "+r.status);return r.json()}
function loadImage(url){return new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=()=>reject(new Error("image "+url));i.src=url+"?v=1";})}
function imageData(img){const c=document.createElement("canvas");c.width=img.naturalWidth;c.height=img.naturalHeight;const ctx=c.getContext("2d",{willReadFrequently:true});ctx.drawImage(img,0,0);return ctx.getImageData(0,0,c.width,c.height)}

function mercator(lon,lat){const R=6378137, x=R*lon*Math.PI/180, y=R*Math.log(Math.tan(Math.PI/4+lat*Math.PI/360));return [x,y]}
function uvFromLonLat(lon,lat){const [mx,my]=mercator(lon,lat);const [minx,miny,maxx,maxy]=meta.mercator_bounds;return [(mx-minx)/(maxx-minx),(my-miny)/(maxy-miny)]}
function sampleElevationUV(u,v){u=Math.max(0,Math.min(1,u));v=Math.max(0,Math.min(1,v));const x=Math.round(u*(demW-1));const y=Math.round((1-v)*(demH-1));return demPixels[(y*demW+x)*4]/255*4000}
function worldFromLonLat(lon,lat,offset=.16){const [u,v]=uvFromLonLat(lon,lat);const x=(u-.5)*planeW,z=(.5-v)*planeH,y=sampleElevationUV(u,v)/4000*verticalScale+offset;return new THREE.Vector3(x,y,z)}

function normalizeLineName(props){
 const s=((props?.id||"")+" "+(props?.name||"")+" "+(props?.lineKey||"")).replace(/s/g,"");
 const map=[["北迴","北迴線"],["宜蘭","宜蘭線"],["臺東","臺東線"],["台東","臺東線"],["屏東","屏東線"],["南迴","南迴線"],["內灣","內灣線"],["集集","集集線"],["平溪","平溪線"],["深澳","深澳線"],["花蓮港","花蓮港線"],["成追","成追線"],["臺中","臺中線"],["台中","臺中線"],["山線","臺中線"],["海岸","縱貫線"],["縱貫","縱貫線"]];
 for(const [k,v] of map)if(s.includes(k))return v;
 return "";
}

function renderList(){const data=[...LINES].sort((a,b)=>(b.ch*1.2+b.util)-(a.ch*1.2+a.util));$("#lineList").innerHTML=data.map(x=>`<button class="row ${x.line===selected?"active":""}" data-line="${x.line}"><div class="top"><b>${x.line}</b><span class="level ${x.attention}">${level(x.attention)}</span></div><div class="meta"><span>邊坡 ${x.total.toLocaleString()}</span><span>C高 ${x.ch}</span><span>最高利用率 ${x.util.toFixed(1)}%</span></div></button>`).join("");$$("#lineList .row").forEach(b=>b.onclick=()=>selectLine(b.dataset.line,true))}

function buildTerrain(baseTexture){
 planeW=22; planeH=planeW*(meta.pixel_size[1]/meta.pixel_size[0]);
 const geo=new THREE.PlaneGeometry(planeW,planeH,127,255);geo.rotateX(-Math.PI/2);
 const pos=geo.attributes.position,uv=geo.attributes.uv;
 for(let i=0;i<pos.count;i++){const u=uv.getX(i),v=uv.getY(i);pos.setY(i,sampleElevationUV(u,v)/4000*verticalScale)}
 pos.needsUpdate=true;geo.computeVertexNormals();
 const mat=new THREE.MeshStandardMaterial({map:baseTexture,roughness:.94,metalness:.02,side:THREE.DoubleSide});
 terrainMesh=new THREE.Mesh(geo,mat);terrainMesh.receiveShadow=true;scene.add(terrainMesh);
 const sea=new THREE.Mesh(new THREE.PlaneGeometry(planeW+18,planeH+18),new THREE.MeshStandardMaterial({color:0xc9dce8,roughness:1,transparent:true,opacity:.74}));
 sea.rotation.x=-Math.PI/2;sea.position.y=-.22;scene.add(sea);
}

function featureParts(g){if(!g)return[];if(g.type==="LineString")return[g.coordinates];if(g.type==="MultiLineString")return g.coordinates;return[]}
function buildRailways(data){
 routeGroup=new THREE.Group();scene.add(routeGroup);
 const features=data.features||[];
 for(const f of features){const ln=normalizeLineName(f.properties);for(const part of featureParts(f.geometry)){let coords=part;if(coords.length>1200){const step=Math.ceil(coords.length/900);coords=coords.filter((_,i)=>i%step===0||i===coords.length-1)}
   const pts=[];for(const c of coords){const [u,v]=uvFromLonLat(c[0],c[1]);if(u<-.02||u>1.02||v<-.02||v>1.02)continue;pts.push(worldFromLonLat(c[0],c[1],.20))}
   if(pts.length<2)continue;const geom=new THREE.BufferGeometry().setFromPoints(pts);const mat=new THREE.LineBasicMaterial({color:0x8b2f2f,transparent:true,opacity:.68,depthTest:true});const line=new THREE.Line(geom,mat);line.userData={type:"route",line:ln,name:f.properties?.name||f.properties?.id||"TRA 軌道"};routeGroup.add(line);routeObjects.push(line);pickables.push(line)}}
}

function buildStations(data){
 stationGroup=new THREE.Group();scene.add(stationGroup);
 const positions=[];for(const f of data.features||[]){if(f.geometry?.type!=="Point")continue;const [lon,lat]=f.geometry.coordinates;const [u,v]=uvFromLonLat(lon,lat);if(u<0||u>1||v<0||v>1)continue;const p=worldFromLonLat(lon,lat,.28);positions.push(p.x,p.y,p.z)}
 const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(positions,3));const m=new THREE.PointsMaterial({size:.095,color:0xffffff,transparent:true,opacity:.95,depthTest:true});const points=new THREE.Points(g,m);points.userData={type:"stations"};stationGroup.add(points)
}

function eventColor(type){return /地震/.test(type)?0x8d5aa7:/落石|土石流|泥流/.test(type)?0xc24d4d:0xd38a31}
function buildEvents(){
 eventGroup=new THREE.Group();scene.add(eventGroup);
 for(const e of EVENTS){const col=eventColor(e.type);const mesh=new THREE.Mesh(new THREE.ConeGeometry(.25,.72,5),new THREE.MeshStandardMaterial({color:col,emissive:col,emissiveIntensity:.28,roughness:.38,transparent:true,opacity:.95}));mesh.position.copy(worldFromLonLat(e.coord[0],e.coord[1],.52));mesh.rotation.y=Math.PI/4;mesh.userData={type:"event",...e};eventGroup.add(mesh);pickables.push(mesh)}
}
function buildSlopes(){
 slopeGroup=new THREE.Group();scene.add(slopeGroup);
 for(const s of SLOPES){const col=s.grade==="C"?0xe2a32f:0x6f8894;const mesh=new THREE.Mesh(new THREE.CylinderGeometry(.12,.12,.46,8),new THREE.MeshStandardMaterial({color:col,emissive:col,emissiveIntensity:.15,roughness:.42,transparent:true,opacity:.98}));mesh.position.copy(worldFromLonLat(s.coord[0],s.coord[1],.34));mesh.userData={type:"slope",...s};slopeGroup.add(mesh);pickables.push(mesh)}
}
function buildHeat(){
 heatGroup=new THREE.Group();scene.add(heatGroup);
 for(const h of HOTSPOTS){const radius=1.15+h.weight*1.7;const mesh=new THREE.Mesh(new THREE.CircleGeometry(radius,40),new THREE.MeshBasicMaterial({color:0xd9633e,transparent:true,opacity:.13,depthWrite:false,side:THREE.DoubleSide}));mesh.rotation.x=-Math.PI/2;mesh.position.copy(worldFromLonLat(h.coord[0],h.coord[1],.07));mesh.userData={type:"heat",...h};heatGroup.add(mesh)}
}

async function init3D(){
 const fallback=$("#realMapFallback"),loading=$("#viewerLoading");
 try{
  const [m,tracks,stations,demImg]=await Promise.all([loadJSON("./assets/realmap_meta.json"),loadJSON("./assets/tra_track_lines.geojson"),loadJSON("./assets/tra_track_stations.geojson"),loadImage("./assets/taiwan_dem_height.png")]);
  meta=m;const pix=imageData(demImg);demPixels=pix.data;demW=pix.width;demH=pix.height;
  renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(viewer.clientWidth,viewer.clientHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.shadowMap.enabled=true;viewer.appendChild(renderer.domElement);
  scene=new THREE.Scene();scene.background=new THREE.Color(0xdfeaf0);scene.fog=new THREE.Fog(0xdfeaf0,48,100);
  camera=new THREE.PerspectiveCamera(36,viewer.clientWidth/viewer.clientHeight,.1,200);camera.position.set(15,24,37);
  controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.06;controls.target.set(0,2,0);controls.minDistance=20;controls.maxDistance=80;controls.maxPolarAngle=Math.PI*.48;
  scene.add(new THREE.HemisphereLight(0xffffff,0x61736c,1.5));const sun=new THREE.DirectionalLight(0xffffff,1.55);sun.position.set(-18,30,-10);sun.castShadow=true;scene.add(sun);
  const texture=await new THREE.TextureLoader().loadAsync("./assets/taiwan_basemap_relief.png");texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=renderer.capabilities.getMaxAnisotropy();
  buildTerrain(texture);buildHeat();buildRailways(tracks);buildStations(stations);buildEvents();buildSlopes();
  fallback.style.opacity="0";fallback.style.pointerEvents="none";loading.hidden=true;$("#viewMode").textContent="3D 真實地形";$("#viewerTip").textContent="NLSC 真實臺灣底圖 + SRTM-3 高程 + 真實 TRA 軌道。拖曳旋轉、滾輪縮放，點鐵路/事件/邊坡查看。";
  bind3D();highlightSelected();animate()
 }catch(err){console.error(err);loading.textContent="3D 載入失敗，已保留真實 2D 地圖 + TRA 軌道";$("#viewMode").textContent="真實 2D 備援";$("#viewerTip").textContent="真實 NLSC 地圖與 TRA 軌道已顯示；3D WebGL 未能啟動，但其他決策功能可正常使用。"}
}

function animate(){requestAnimationFrame(animate);controls?.update();renderer?.render(scene,camera)}
function onResize(){if(!renderer)return;renderer.setSize(viewer.clientWidth,viewer.clientHeight);camera.aspect=viewer.clientWidth/viewer.clientHeight;camera.updateProjectionMatrix()}
function pointerFromEvent(e){const r=renderer.domElement.getBoundingClientRect();pointer.x=((e.clientX-r.left)/r.width)*2-1;pointer.y=-((e.clientY-r.top)/r.height)*2+1}
function pick(e){pointerFromEvent(e);raycaster.setFromCamera(pointer,camera);const hits=raycaster.intersectObjects(pickables,false);return hits[0]||null}
function pointLabel(d){if(d.type==="event")return`${d.date}｜${d.title}`;if(d.type==="slope")return`${d.code}｜${d.grade}級`;if(d.type==="route")return d.line||d.name;return""}
function onMove(e){const hit=pick(e);if(!hit){hoverLabel.style.display="none";renderer.domElement.style.cursor="grab";return}const label=pointLabel(hit.object.userData);renderer.domElement.style.cursor="pointer";if(label){const r=renderer.domElement.getBoundingClientRect();hoverLabel.style.display="block";hoverLabel.textContent=label;hoverLabel.style.left=`${e.clientX-r.left}px`;hoverLabel.style.top=`${e.clientY-r.top}px`}}
function onClick3D(e){const hit=pick(e);if(!hit)return;const d=hit.object.userData;if(d.line)selectLine(d.line,false);if(d.type==="event"||d.type==="slope")openInspector(d)}
function bind3D(){renderer.domElement.addEventListener("pointermove",onMove);renderer.domElement.addEventListener("click",onClick3D);window.addEventListener("resize",onResize)}
function openInspector(d){const p=$("#pointInspector");p.hidden=false;if(d.type==="event"){$("#pointType").textContent="EVENT · TRA-04";$("#pointTitle").textContent=d.title;$("#pointMeta").textContent=`${d.date}｜${d.line}｜${d.type}｜${d.place}`;$("#pointDescription").textContent=d.desc;$("#pointSource").textContent="事件位置依 TRA-04 站間/地名做近似定位；軌道幾何本身是真實 GeoJSON。"}else{$("#pointType").textContent="SLOPE · TRA-03";$("#pointTitle").textContent=d.code;$("#pointMeta").textContent=`${d.line}｜${d.section}｜${d.km}｜確認分級 ${d.grade}`;$("#pointDescription").textContent=d.desc;$("#pointSource").textContent="TRA-03 無 GPS 的清冊紀錄依站間與里程映射於真實 TRA 軌道路廊。"}}

function highlightSelected(){if(!routeGroup)return;for(const o of routeObjects){const active=o.userData.line===selected;o.material.color.setHex(active?0xc02525:0x8b2f2f);o.material.opacity=active?1:.40;o.renderOrder=active?5:2}for(const g of [eventGroup,slopeGroup,heatGroup])if(g)for(const o of g.children){const active=o.userData.line===selected;o.visible=active||selected==="縱貫線"?true:true;if(o.material?.opacity!==undefined)o.material.opacity=active?(o.userData.type==="heat"?.22:1):(o.userData.type==="heat"?.06:.28)}}
function cameraTo(mode){if(!camera||!controls)return;if(mode==="top"){camera.position.set(0,58,.01);controls.target.set(0,0,0);$("#viewMode").textContent="2D 俯視"}else if(mode==="north"){const p=worldFromLonLat(121.72,25.05,1);camera.position.set(p.x+8,15,p.z+10);controls.target.copy(p);$("#viewMode").textContent="聚焦北部"}else if(mode==="east"){const p=worldFromLonLat(121.67,24.0,1);camera.position.set(p.x+10,14,p.z+14);controls.target.copy(p);$("#viewMode").textContent="聚焦東部"}else{camera.position.set(15,24,37);controls.target.set(0,2,0);$("#viewMode").textContent="3D 真實地形"}controls.update()}

function selectLine(line,focus=true){selected=line;renderList();const x=lineInfo(line);$("#badgeLine").textContent=x.line;$("#lineTitle").textContent=x.line;$("#lineSub").textContent=`${x.line}：真實地形、真實軌道與案例鏈已連動`;$("#mSlope").textContent=`${x.ch} / ${x.total.toLocaleString()}`;$("#mUtil").textContent=`${x.util.toFixed(1)}%`;$("#mBottle").textContent=x.bottle;$("#geoLineName").textContent=x.line;$("#geoBottle").textContent=x.bottle;$("#txtPhysical").textContent=x.ch?`此線共有 ${x.total.toLocaleString()} 處邊坡，其中 C高 ${x.ch} 處；3D 場景中的鐵路幾何來自真實 TRA GeoJSON。`:"目前此線 C高較少，但仍需關注單點風險。";$("#txtOps").textContent=x.util>=85?`最高區間利用率 ${x.util.toFixed(1)}%，事件發生時調度餘裕小。`:x.util>=70?`最高區間利用率 ${x.util.toFixed(1)}%，屬中高營運曝露。`:`最高區間利用率 ${x.util.toFixed(1)}%，營運曝露相對較低。`;$("#txtDecision").textContent="地形、底圖與軌道使用真實地理資料；TRA 事件與邊坡若無 GPS 則標示為站間/里程展示定位。";const rel=EVENTS.filter(e=>e.line===line).slice(0,3);$("#relatedCases").innerHTML=rel.length?rel.map(e=>`<div class="case ${/土石流|落石|泥流/.test(e.type)?"hazard":""}"><b>${e.date}｜${e.title}</b><small>${e.place}｜${e.type}</small><p>${e.desc}</p></div>`).join(""):'<div class="case"><b>目前未綁定代表事件</b><p>可依站間、日期與事件類型繼續擴充案例鏈。</p></div>';highlightSelected();renderChain();renderLocalCases();if(focus&&line==="北迴線")cameraTo("east")}

function chainDetails(c){return{asset:{source:"TRA-03",title:"邊坡資產詳情",record:c.asset,dataset:"TRA-03 邊坡清冊",match:"同線別 + 站間 + 里程候選關聯。",evidence:c.assetDesc,boundary:"無 GPS 時，點位為沿真實軌道的展示映射。",primary:"回到 3D 地圖",target:"map"},event:{source:"TRA-04",title:"歷史異常事件",record:c.event,dataset:"TRA-04 異常事件",match:"同線別 + 站間/地名 + 災害類型。",evidence:c.eventDesc,boundary:"只有站間時採近似位置。",primary:"查看歷史事件",target:"events"},train:{source:"TRA-08 / TRA-10",title:"受影響列車",record:c.train,dataset:"TRA-08 到離站 + TRA-10 原因",match:"事件日期 + 原因欄 + 車次。",evidence:c.trainDesc,boundary:"只顯示競賽資料可重現的關聯。",primary:"查看歷史事件",target:"events"},delay:{source:"TRA-09",title:"延誤後果",record:c.delay,dataset:"TRA-09 誤點分鐘",match:"同車次最大到/離站延誤彙整。",evidence:c.delayDesc,boundary:"帶 * 為系統衍生值。",primary:"查看營運影響",target:"ops"},capacity:{source:"TRA-11",title:"瓶頸容量曝露",record:c.capacity,dataset:"TRA-11 路線利用率",match:"事件所在路線對應容量區段。",evidence:c.capacityDesc,boundary:"利用率不代表災害機率。",primary:"查看營運影響",target:"ops"},action:{source:"Decision Memory",title:"處置與回填",record:c.action,dataset:"歷史處置 + 人工回填",match:"歷史處置供人員參考。",evidence:c.actionDesc,boundary:"不自動下達限速、封鎖或復駛命令。",primary:"建立追蹤回填",target:"track"}}}
function showChainDetail(step){const c=CASE_CHAINS[selected];if(!c)return;const d=chainDetails(c)[step];$$(".chain-node").forEach(n=>n.classList.toggle("selected",n.dataset.step===step));$("#detailSource").textContent=d.source;$("#detailTitle").textContent=d.title;$("#detailStatus").textContent=step==="asset"?"候選匹配":"已關聯";$("#detailRecord").textContent=d.record;$("#detailDataset").textContent=d.dataset;$("#detailMatch").textContent=d.match;$("#detailEvidence").textContent=d.evidence;$("#detailBoundary").textContent=d.boundary;$("#detailPrimary").textContent=d.primary;$("#detailPrimary").dataset.target=d.target}
function renderChain(){const c=CASE_CHAINS[selected];if(!c){$("#chainFlow").innerHTML='<div class="case"><b>目前尚未建立此路線的完整案例鏈</b><p>可先用線別與站間規則做候選匹配。</p></div>';$("#chainRules").innerHTML="<ul><li>尚未綁定路線級規則。</li></ul>";$("#chainDecision").innerHTML="<ul><li>請先建立事件—站間—里程關聯。</li></ul>";$("#detailTitle").textContent="尚無案例鏈";$("#detailRecord").textContent="此路線目前沒有完整的六段資料鏈。";return}const nodes=[["asset","TRA-03 邊坡","邊坡資產",c.asset,c.assetDesc],["event","TRA-04 事件","異常事件",c.event,c.eventDesc],["train","TRA-08/10","受影響列車",c.train,c.trainDesc],["delay","TRA-09","延誤後果",c.delay,c.delayDesc],["capacity","TRA-11","容量曝露",c.capacity,c.capacityDesc],["action","Decision","建議處置",c.action,c.actionDesc]];$("#chainFlow").innerHTML=nodes.map(([step,source,title,record,desc])=>`<button type="button" class="chain-node ${step}" data-step="${step}"><span class="step">${source}</span><h4>${title}</h4><b>${record}</b><p>${desc}</p></button>`).join("");$$(".chain-node").forEach(n=>n.onclick=()=>showChainDetail(n.dataset.step));$("#chainRules").innerHTML=`<ul>${c.rules.map(i=>`<li>${i}</li>`).join("")}</ul>`;$("#chainDecision").innerHTML=`<ul>${c.decision.map(i=>`<li>${i}</li>`).join("")}</ul>`;showChainDetail("asset")}

function renderEvents(){$("#eventGrid").innerHTML=EVENTS.map(e=>`<div class="event-card"><small>${e.date}</small><b>${e.title}</b><p>${e.line}｜${e.place}</p><p style="margin-top:6px"><strong>影響：</strong>${e.trains}${e.minutes!=="—"?`｜${e.minutes} 分`:""}${e.passengers!=="—"?`｜${e.passengers} 人`:""}</p></div>`).join("")}
function renderUtil(){const max=Math.max(...LINES.map(x=>x.util));$("#utilBars").innerHTML=LINES.filter(x=>x.util>30).map(x=>`<div class="bar"><span>${x.line}</span><div class="track"><i class="${x.util>=85?"hot":x.util>=70?"warn":""}" style="width:${x.util/max*100}%"></i></div><b>${x.util.toFixed(1)}%</b></div>`).join("")}
function renderLocalCases(){const arr=getCases().filter(x=>x.line===selected);$("#memoryList").innerHTML=arr.length?arr.slice(0,4).map(c=>`<div class="memory"><b>${new Date(c.time).toLocaleString("zh-TW")}｜${c.outcome}</b><p>${c.note||"無補充說明"}</p></div>`).join(""):'<div class="memory"><b>尚無人工回填</b><p>這裡保留人工巡檢與處置記錄。</p></div>'}

$("#btnSave").onclick=()=>{const arr=getCases();arr.unshift({time:new Date().toISOString(),line:selected,outcome:$("#caseOutcome").value,note:$("#caseNote").value.trim()});saveCaseData(arr);$("#caseNote").value="";toast("已儲存人工回填")};
$("#btnOpenAll").onclick=()=>{const arr=getCases();$("#allCasesBody").innerHTML=arr.length?arr.map(c=>`<div class="memory"><b>${new Date(c.time).toLocaleString("zh-TW")}｜${c.line}｜${c.outcome}</b><p>${c.note||"無補充說明"}</p></div>`).join(""):'<p style="color:#6e818d">尚無人工回填案件。</p>';$("#allCasesModal").classList.add("open")};
$("#btnCloseAll").onclick=()=>$("#allCasesModal").classList.remove("open");
$("#pointInspectorClose").onclick=()=>$("#pointInspector").hidden=true;
$("#btnDemo").onclick=()=>{selectLine("北迴線",true);document.querySelector("#chainBlock").scrollIntoView({behavior:"smooth",block:"start"});toast("已切換北迴線真實 3D 地形與案例鏈")};
$("#btnReset").onclick=()=>cameraTo("perspective");$("#btnResetCamera").onclick=()=>cameraTo("perspective");
$("#btnTopView").onclick=()=>cameraTo("top");$("#btnPerspective").onclick=()=>cameraTo("perspective");$("#btnTerrain").onclick=()=>cameraTo("east");
$("#btnFocusNorth").onclick=()=>cameraTo("north");$("#btnFocusEast").onclick=()=>cameraTo("east");
$("#btnShowChain").onclick=()=>document.querySelector("#chainBlock").scrollIntoView({behavior:"smooth",block:"start"});
$("#btnShowOps").onclick=()=>document.querySelector("#utilBars").scrollIntoView({behavior:"smooth",block:"center"});
$("#layerRoutes").onchange=e=>{if(routeGroup)routeGroup.visible=e.target.checked};$("#layerEvents").onchange=e=>{if(eventGroup)eventGroup.visible=e.target.checked};$("#layerSlopes").onchange=e=>{if(slopeGroup)slopeGroup.visible=e.target.checked};$("#layerHeat").onchange=e=>{if(heatGroup)heatGroup.visible=e.target.checked};$("#layerStations").onchange=e=>{if(stationGroup)stationGroup.visible=e.target.checked};
$("#detailPrimary").onclick=()=>{const t=$("#detailPrimary").dataset.target;if(t==="map")document.querySelector(".scene-panel").scrollIntoView({behavior:"smooth",block:"start"});else if(t==="events")document.querySelector("#eventGrid").scrollIntoView({behavior:"smooth",block:"center"});else if(t==="ops")document.querySelector("#utilBars").scrollIntoView({behavior:"smooth",block:"center"});else{$("#caseNote").focus();document.querySelector(".detail-panel").scrollIntoView({behavior:"smooth",block:"start"})}};
$("#detailTrack").onclick=()=>{$("#caseNote").focus();document.querySelector(".detail-panel").scrollIntoView({behavior:"smooth",block:"start"});toast("請填寫人工巡檢或處置回填")};

renderList();renderEvents();renderUtil();selectLine("縱貫線",false);init3D();
