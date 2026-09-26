import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const LINES=[
 {line:"縱貫線",total:1839,b:3,ch:344,cl:491,d:1001,util:94.75,bottle:"八堵–樹林",attention:"high"},
 {line:"宜蘭線",total:910,b:0,ch:101,cl:189,d:620,util:89.43,bottle:"八堵–雙溪",attention:"high"},
 {line:"平溪線",total:374,b:0,ch:103,cl:16,d:255,util:61.82,bottle:"三貂嶺–菁桐",attention:"high"},
 {line:"北迴線",total:330,b:0,ch:22,cl:15,d:293,util:77.37,bottle:"蘇澳新–和平",attention:"high"},
 {line:"臺中線",total:294,b:0,ch:40,cl:39,d:215,util:84.32,bottle:"臺中–彰化",attention:"mid"},
 {line:"集集線",total:172,b:0,ch:63,cl:6,d:103,util:52.94,bottle:"二水–車埕",attention:"mid"},
 {line:"內灣線",total:346,b:2,ch:37,cl:27,d:280,util:75.56,bottle:"九讚頭–內灣",attention:"mid"},
 {line:"屏東線",total:102,b:0,ch:0,cl:8,d:94,util:90.43,bottle:"高雄–潮州",attention:"mid"},
 {line:"臺東線",total:568,b:0,ch:4,cl:200,d:364,util:75.56,bottle:"花蓮–玉里",attention:"mid"},
 {line:"深澳線",total:92,b:0,ch:3,cl:20,d:69,util:37.04,bottle:"瑞芳–海科",attention:"low"},
 {line:"花蓮港線",total:34,b:0,ch:0,cl:12,d:22,util:30.00,bottle:"北埔–花蓮港",attention:"low"},
 {line:"成追線",total:3,b:0,ch:0,cl:0,d:3,util:18.75,bottle:"成功–追分",attention:"low"},
 {line:"南迴線",total:0,b:0,ch:0,cl:0,d:0,util:60,bottle:"枋寮–臺東",attention:"mid"}
];

const EVENTS=[
 {id:"e1",date:"2026/05/04",roc:"115年 0504-1 / 0504-4",line:"北迴線",place:"宜蘭－和平站間",type:"地震",title:"宜蘭南方地震，北迴線受影響",desc:"TRA-04 記錄兩起天然災變；TRA-08/09/10 同日可見『天然災變(地震)』原因標記。",trains:"22",minutes:"748*",passengers:"—",note:"* 748 分為系統衍生值：受影響車次各取當日最大延誤後加總。"},
 {id:"e2",date:"2026/05/13",roc:"115年 0513-3",line:"北迴線",place:"新城－鳳林",type:"地震",title:"花蓮北方規模 5.0 地震",desc:"同日行車資料有 34 筆天然災變(地震)原因標記。",trains:"9",minutes:"274*",passengers:"—",note:"* 274 分為系統衍生值。"},
 {id:"e3",date:"2025/11/11",roc:"114年 1111-4",line:"臺東線",place:"萬榮－光復",type:"泥流",title:"鳳凰颱風泥流淹及路線",desc:"光復隧道北口上方淹水，上下行列車預防性停駛；水利署完成導流後恢復。",trains:"17 停駛",minutes:"—",passengers:"—",note:"原始事件影響欄明列停駛 17 列次。"},
 {id:"e4",date:"2025/09/24",roc:"114年 0924-1",line:"宜蘭線",place:"八斗子站",type:"落石",title:"落石侵入路線",desc:"列車無法進站，工務移除落石後恢復正常行駛。",trains:"2 停駛",minutes:"—",passengers:"約 30",note:"原始事故影響欄記錄兩列次停駛。"},
 {id:"e5",date:"2025/07/09",roc:"114年 0709-1",line:"內灣線",place:"上員－榮華",type:"落石",title:"列車撞擊侵入路線石頭",desc:"1801 次撞石後水箱破裂、引擎故障；現場限速 25 km/h，清理後解除慢行。",trains:"3",minutes:"44",passengers:"—",note:"原始事故列出 1846/19 分、1801/11 分、1803/14 分。"},
 {id:"e6",date:"2025/05/18",roc:"114年 0518-1",line:"北迴線",place:"和仁－崇德",type:"土石流/淹水",title:"豪雨造成水淹軌面並伴隨土石流",desc:"西正線水淹超過軌面且電車線、路線受損，區間一度雙向不通。",trains:"多列調整",minutes:"—",passengers:"—",note:"原始敘述包含退行、區間中斷、接駁等處置。"},
 {id:"e7",date:"2022/10/16",roc:"111年 1016-3",line:"宜蘭線",place:"七堵－汐止、雙溪－貢寮等",type:"豪雨/土石流",title:"豪雨水淹軌面與部分土石流",desc:"多區間豪雨水淹軌面與部分土石流。",trains:"78",minutes:"6,654",passengers:"16,769",note:"原始影響欄：78 列 / 6654 分 / 旅客 16769 人。"}
];

const UTIL=[
 ["縱貫線",94.75],["屏東線",90.43],["宜蘭線",89.43],["臺中線",84.32],["北迴線",77.37],["臺東線",75.56],["內灣線",75.56],["平溪線",61.82],["南迴線",60.00],["集集線",52.94]
];

const ROUTE_COORDS={
 '縱貫線': [[396,124],[362,157],[330,212],[305,278],[288,348],[280,420],[284,503],[296,586],[311,655],[325,715]],
 '屏東線': [[325,715],[338,733],[352,748],[368,762]],
 '宜蘭線': [[396,124],[431,129],[463,144],[492,167],[520,196],[548,244]],
 '北迴線': [[548,244],[560,292],[569,342],[575,397],[573,445],[568,493]],
 '臺東線': [[568,493],[562,547],[552,607],[540,647],[520,677]],
 '南迴線': [[520,677],[490,710],[430,744],[368,762]],
 '臺中線': [[293,293],[311,330],[322,372],[328,458]],
 '內灣線': [[289,293],[330,289],[369,289],[406,297]],
 '平溪線': [[502,176],[524,155],[551,144],[580,137]],
 '深澳線': [[492,190],[522,182],[557,181],[590,187]],
 '集集線': [[278,541],[312,547],[344,563],[373,588]],
 '花蓮港線': [[568,430],[594,430],[616,435],[636,450]],
 '成追線': [[306,444],[324,453],[345,463],[360,476]]
};
const STATIONS=[
 {name:'臺北 / 八堵',pos:[396,124]},{name:'新竹',pos:[289,293]},{name:'臺中 / 二水',pos:[278,541]},{name:'高雄',pos:[325,715]},
 {name:'屏東',pos:[368,762]},{name:'宜蘭 / 蘇澳',pos:[548,244]},{name:'花蓮 / 和平',pos:[575,397]},{name:'臺東',pos:[520,677]}
];
const EVENT_POINTS=[
 {line:'北迴線',pos:[559,322],date:'2026/05/04',type:'地震',title:'宜蘭－和平站間地震',desc:'TRA-04 天然災變事件；同日可於 TRA-08/09/10 辨識天然災變(地震)原因與受影響列車。',source:'TRA-04 + TRA-08/09/10'},
 {line:'北迴線',pos:[571,430],date:'2026/05/13',type:'地震',title:'新城－鳳林地震事件',desc:'同日行車資料有 34 筆天然災變(地震)原因標記。',source:'TRA-04 + TRA-08/09/10'},
 {line:'北迴線',pos:[571,382],date:'2025/05/18',type:'土石流/淹水',title:'和仁－崇德豪雨土石流',desc:'西正線水淹超過軌面且路線受損，區間一度雙向不通。',source:'TRA-04'},
 {line:'宜蘭線',pos:[518,190],date:'2025/09/24',type:'落石',title:'八斗子落石侵入路線',desc:'工務移除落石後恢復正常行駛，事件表記錄 2 列次停駛。',source:'TRA-04'},
 {line:'內灣線',pos:[374,296],date:'2025/07/09',type:'落石',title:'上員－榮華列車撞石',desc:'1801 次撞石後水箱破裂、引擎故障；限速 25 km/h，處置後解除慢行。',source:'TRA-04'},
 {line:'臺東線',pos:[551,572],date:'2025/11/11',type:'泥流',title:'萬榮－光復泥流淹及路線',desc:'上下行列車預防性停駛；水利署完成導流後恢復。',source:'TRA-04'},
 {line:'宜蘭線',pos:[486,170],date:'2022/10/16',type:'豪雨/土石流',title:'宜蘭線多區間豪雨與土石流',desc:'原始影響欄：78 列 / 6,654 分 / 旅客 16,769 人。',source:'TRA-04'}
];
const SLOPE_POINTS=[
 {line:'宜蘭線',pos:[407,132],code:'1040E-001313-001394L',grade:'C',section:'八堵－暖暖',km:'1,313–1,394 m',desc:'位於山崩與地質敏感區；未發現明顯異狀。'},
 {line:'宜蘭線',pos:[414,139],code:'1040E-001443-001498L',grade:'C',section:'八堵－暖暖',km:'1,443–1,498 m',desc:'位於山崩與地質敏感區；未發現明顯異狀。'},
 {line:'宜蘭線',pos:[420,145],code:'1040E-001498-001570L',grade:'C',section:'八堵－暖暖',km:'1,498–1,570 m',desc:'位於山崩與地質敏感區；未發現明顯異狀。'},
 {line:'宜蘭線',pos:[402,136],code:'1040W-000945-000956R',grade:'C',section:'八堵－暖暖',km:'945–956 m',desc:'鋼筋外露銹蝕與洩水孔堵塞。'},
 {line:'宜蘭線',pos:[405,140],code:'1040W-000956-000980R',grade:'C',section:'八堵－暖暖',km:'956–980 m',desc:'噴凝土坡面混凝土剝落、破損；建議工務修補。'},
 {line:'宜蘭線',pos:[409,144],code:'1040W-000990-001070R',grade:'C',section:'八堵－暖暖',km:'990–1,070 m',desc:'坡面噴凝土劣化剝落及樹木根系造成破損。'},
 {line:'宜蘭線',pos:[425,151],code:'1040W-001515-001550R',grade:'C',section:'八堵－暖暖',km:'1,515–1,550 m',desc:'樹根拔起若翻落有影響鐵軌之虞，建議加強調查。'},
 {line:'北迴線',pos:[554,282],code:'1050E-001492-001688L',grade:'C',section:'蘇澳新－新城',km:'1,492–1,688 m',desc:'北迴線 C 級邊坡候選；無明顯異狀。'},
 {line:'北迴線',pos:[560,312],code:'1050E-001702-001742L',grade:'C',section:'蘇澳新－新城',km:'1,702–1,742 m',desc:'北迴線 C 級邊坡候選；無明顯異狀。'},
 {line:'北迴線',pos:[564,342],code:'1050E-001749-001912L',grade:'C',section:'蘇澳新－新城',km:'1,749–1,912 m',desc:'北迴線 C 級邊坡候選。'},
 {line:'北迴線',pos:[551,260],code:'1050E-000915-001050L',grade:'D',section:'蘇澳新－新城',km:'915–1,050 m',desc:'地錨邊坡；確認分級 D，原地錨分級 B。'}
];
const HOT_ZONES=[
 {line:'縱貫線',pos:[330,220],radius:5.8,intensity:1.0,label:'縱貫線 C高 344 / 利用率 94.75%'},
 {line:'宜蘭線',pos:[487,183],radius:4.8,intensity:0.88,label:'宜蘭線 C高 101 / 利用率 89.43%'},
 {line:'平溪線',pos:[553,144],radius:4.0,intensity:0.70,label:'平溪線 C高 103'},
 {line:'北迴線',pos:[568,355],radius:4.6,intensity:0.76,label:'北迴線 C高 22 / 利用率 77.37%'},
 {line:'臺中線',pos:[316,385],radius:4.2,intensity:0.63,label:'臺中線 C高 40 / 利用率 84.32%'},
 {line:'集集線',pos:[340,566],radius:3.8,intensity:0.56,label:'集集線 C高 63'},
 {line:'內灣線',pos:[380,295],radius:3.5,intensity:0.58,label:'內灣線 C高 37 / 利用率 75.56%'}
];

const CASE_CHAINS={
 "北迴線":{
   asset:"1050E-001492-001688L、1050E-001702-001742L",
   assetDesc:"TRA-03 北迴線 C 級邊坡候選；站間：蘇澳新—新城；里程 1,492–1,742 m",
   event:"2026/05/04 地震｜宜蘭－和平站間",
   eventDesc:"TRA-04 天然災變事件，與北迴線同線別且位於東部幹線高敏感路段。",
   train:"受影響列車 22 車次",
   trainDesc:"從 TRA-08/09/10 辨識同日天然災變(地震)原因並彙整受影響車次。",
   delay:"延誤合計 748* 分鐘",
   delayDesc:"* 系統衍生統計：每一受影響車次取當日最大延誤後加總；最大單車次 73 分。",
   capacity:"蘇澳新–和平 77.37%",
   capacityDesc:"TRA-11 顯示該區段利用率偏高，事件發生時調度餘裕有限。",
   action:"工務巡查 + 慢行複核 + 行控調整",
   actionDesc:"建議先查核邊坡與軌道狀態，再依現場結果決定是否發布慢行與調整班次。",
   rules:["同線別匹配：北迴線 TRA-03 ↔ TRA-04。","站間 / 地名匹配：宜蘭、和平、和仁、崇德等北迴線東部站間。","時間匹配：以事件日期回查 TRA-08/09/10 當日受影響列車與延誤。","後果放大評估：再接 TRA-11 的瓶頸容量資訊。"],
   decision:["優先確認東部幹線坡面與軌道通行條件。","若現場可通行但風險未排除，先採慢行與加密巡查。","保留本次巡檢紀錄與復原時間，作為下次東部地震事件的可追溯記憶。"]
 },
 "宜蘭線":{
   asset:"1040E-001313-001394L、1040E-001443-001498L",
   assetDesc:"TRA-03 宜蘭線 C 級邊坡候選；站間：八堵—暖暖；位於山崩與地質敏感區。",
   event:"2025/09/24 落石｜八斗子站",
   eventDesc:"TRA-04 記錄落石侵入路線，工務移除後恢復正常行駛。",
   train:"受影響列車 2 列停駛",
   trainDesc:"原始事件欄已明列停駛 2 列次與旅客約 30 人。",
   delay:"停駛 / 旅客衝擊",
   delayDesc:"此案例重點為落石造成進站受阻，故以停駛與旅客影響呈現。",
   capacity:"八堵–雙溪 89.43%",
   capacityDesc:"屬高利用率區間，若阻斷持續，營運影響擴散速度快。",
   action:"落石排除 + 現場封鎖 + 恢復查核",
   actionDesc:"以現場安全為優先，完成清除後再恢復正常行駛。",
   rules:["同線別匹配：宜蘭線邊坡清冊 ↔ 宜蘭線事件。","站間優先：八堵、暖暖、瑞芳、雙溪等地名作為候選關聯。","若 TRA-08/09/10 無完整延誤鏈，即保留停駛/旅客欄位。","容量資料用於補強營運後果判讀。"],
   decision:["高利用率宜蘭線應先處理落石排除與通行安全。","後續需將落石位置回填對應邊坡編號，形成更精準的資產—事件鏈。"]
 },
 "內灣線":{
   asset:"1140E-候選邊坡群（TRA-03 內灣線 346 處 / C高 37）",
   assetDesc:"目前以線別與站間作候選關聯，正式版可再精準到個別里程。",
   event:"2025/07/09 落石｜上員－榮華",
   eventDesc:"TRA-04 記錄列車撞石、水箱破裂與引擎故障。",
   train:"1801 / 1803 / 1846 次",
   trainDesc:"事件表已明列受影響車次。",
   delay:"44 分鐘",
   delayDesc:"由原始事件影響欄整理為 3 車次共 44 分鐘。",
   capacity:"九讚頭–內灣 75.56%",
   capacityDesc:"中高利用率，對支線營運仍具影響。",
   action:"慢行 25 km/h + 清理落石 + 解除慢行",
   actionDesc:"這是一個很適合展示『處置記憶』價值的支線案例。",
   rules:["站間精確匹配：上員－榮華。","先讀原始事故影響欄，再補容量與邊坡清冊資訊。"],
   decision:["支線案例可展示系統不只支援幹線，也能保留小型但完整的事故處置知識。"]
 }
};

const viewer = document.querySelector('#viewer3d');
const hoverLabel = document.querySelector('#hoverLabel');
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const routeMeshes = new Map();
let renderer, scene, camera, controls, islandGroup, routeGroup, markerGroup, eventGroup, slopeGroup, heatGroup, stationGroup;
let pulseMarkers=[], eventMeshes=[], slopeMeshes=[], heatMeshes=[];

const STORE_KEY='railslope_enterprise_cases_v2';
let selected='縱貫線';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
function toast(txt){const t=$('#toast');t.textContent=txt;t.classList.add('show');clearTimeout(t._);t._=setTimeout(()=>t.classList.remove('show'),2400)}
function getCases(){try{return JSON.parse(localStorage.getItem(STORE_KEY)||'[]')}catch{return[]}}
function saveCaseData(arr){localStorage.setItem(STORE_KEY,JSON.stringify(arr));renderLocalCases()}
function level(att){return att==='high'?'高關注':att==='mid'?'注意':'一般'}
function lineInfo(name){return LINES.find(v=>v.line===name)||LINES[0];}
function routeColor(util){return util>=85?0xc24d4d:util>=70?0xc28b27:0x8aa0ad;}
function toWorld([x,y],alt=0){const scale=0.12;return new THREE.Vector3((x-380)*scale,alt,(y-410)*scale);}
function makeHeatTexture(intensity){const canvas=document.createElement('canvas');canvas.width=256;canvas.height=256;const ctx=canvas.getContext('2d');const g=ctx.createRadialGradient(128,128,6,128,128,126);const alpha=Math.min(.52,.22+intensity*.3);g.addColorStop(0,`rgba(205,68,57,${alpha})`);g.addColorStop(.38,`rgba(230,126,46,${alpha*.82})`);g.addColorStop(.72,`rgba(244,196,65,${alpha*.38})`);g.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=g;ctx.fillRect(0,0,256,256);const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;return tex;}
function buildThreeScene(){
 viewer.innerHTML='';
 renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(viewer.clientWidth,viewer.clientHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;viewer.appendChild(renderer.domElement);
 scene=new THREE.Scene();scene.fog=new THREE.Fog(0xe9f0f4,55,110);
 camera=new THREE.PerspectiveCamera(38,viewer.clientWidth/viewer.clientHeight,.1,500);camera.position.set(0,15,40);
 controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.06;controls.target.set(0,2,4);controls.maxPolarAngle=Math.PI*.46;controls.minDistance=22;controls.maxDistance=78;
 scene.add(new THREE.AmbientLight(0xffffff,1.1));const key=new THREE.DirectionalLight(0xffffff,1.4);key.position.set(18,28,14);scene.add(key);const rim=new THREE.DirectionalLight(0xb7d1df,.8);rim.position.set(-20,10,-22);scene.add(rim);
 const ground=new THREE.Mesh(new THREE.CircleGeometry(62,80),new THREE.MeshBasicMaterial({color:0xe8eef2,transparent:true,opacity:.85}));ground.rotation.x=-Math.PI/2;ground.position.y=-2.2;scene.add(ground);
 islandGroup=new THREE.Group();
 const pts=[[417,75],[472,86],[520,118],[549,163],[577,208],[591,255],[596,313],[602,373],[597,439],[583,498],[570,556],[547,620],[517,679],[488,736],[452,774],[411,795],[371,815],[333,806],[297,773],[260,739],[227,691],[201,633],[178,582],[161,514],[155,447],[149,376],[153,308],[168,246],[184,184],[209,136],[248,101],[295,60],[358,55]].map(([x,y])=>new THREE.Vector2((x-380)*.12,(y-410)*.12));
 const islandShape=new THREE.Shape(pts);const islandGeo=new THREE.ExtrudeGeometry(islandShape,{depth:3.2,bevelEnabled:true,bevelThickness:.25,bevelSize:.2,bevelSegments:3,steps:1});islandGeo.rotateX(-Math.PI/2);islandGeo.translate(0,-1.6,0);const islandMesh=new THREE.Mesh(islandGeo,[new THREE.MeshStandardMaterial({color:0xcad7df,roughness:.95}),new THREE.MeshStandardMaterial({color:0xe6efea,roughness:.92})]);islandGroup.add(islandMesh);
 const ridgeCurve=new THREE.CatmullRomCurve3([toWorld([377,120],2.1),toWorld([386,175],2.6),toWorld([389,245],2.9),toWorld([387,330],2.7),toWorld([380,430],2.4),toWorld([366,530],2),toWorld([347,620],1.7),toWorld([320,715],1.2)]);islandGroup.add(new THREE.Mesh(new THREE.TubeGeometry(ridgeCurve,60,1.3,12,false),new THREE.MeshStandardMaterial({color:0xa7bcaa,transparent:true,opacity:.92,roughness:1})));scene.add(islandGroup);
 routeGroup=new THREE.Group();markerGroup=new THREE.Group();eventGroup=new THREE.Group();slopeGroup=new THREE.Group();heatGroup=new THREE.Group();stationGroup=new THREE.Group();scene.add(routeGroup,markerGroup,eventGroup,slopeGroup,heatGroup,stationGroup);
 Object.entries(ROUTE_COORDS).forEach(([name,routePts])=>{const info=lineInfo(name);const color=routeColor(info.util);const curve=new THREE.CatmullRomCurve3(routePts.map((p,i)=>toWorld(p,.22+(i/routePts.length)*.04)));const branch=['內灣線','平溪線','深澳線','集集線','花蓮港線','成追線'].includes(name);const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,Math.max(routePts.length*8,32),branch?.22:.34,12,false),new THREE.MeshStandardMaterial({color,emissive:0x14232a,emissiveIntensity:.12,roughness:.45,metalness:.15}));mesh.userData={line:name,type:'route'};routeGroup.add(mesh);routeMeshes.set(name,mesh);const last=toWorld(routePts[routePts.length-1],.6);const h=Math.max(info.util/18,1.4);const cap=new THREE.Mesh(new THREE.CylinderGeometry(.28,.28,h,12),new THREE.MeshStandardMaterial({color,emissive:0x111111,emissiveIntensity:.08,transparent:true,opacity:.92}));cap.position.copy(last);cap.position.y=h/2+.2;cap.userData={line:name,type:'pillar'};markerGroup.add(cap);});
 STATIONS.forEach(s=>{const mesh=new THREE.Mesh(new THREE.SphereGeometry(.38,18,18),new THREE.MeshStandardMaterial({color:0xffffff,emissive:0x536d79,emissiveIntensity:.35,roughness:.3}));mesh.position.copy(toWorld(s.pos,.62));mesh.userData={type:'station',name:s.name};stationGroup.add(mesh);});
 HOT_ZONES.forEach(z=>{const mesh=new THREE.Mesh(new THREE.PlaneGeometry(z.radius*2,z.radius*2),new THREE.MeshBasicMaterial({map:makeHeatTexture(z.intensity),transparent:true,depthWrite:false,side:THREE.DoubleSide,opacity:.9}));mesh.rotation.x=-Math.PI/2;mesh.position.copy(toWorld(z.pos,.12));mesh.userData={type:'heat',line:z.line,label:z.label};heatGroup.add(mesh);heatMeshes.push(mesh);});
 SLOPE_POINTS.forEach(s=>{const color=s.grade==='C'?0xe2a32f:0x7390a0;const mesh=new THREE.Mesh(new THREE.CylinderGeometry(.18,.18,.78,10),new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:.18,roughness:.35,transparent:true}));mesh.position.copy(toWorld(s.pos,.72));mesh.userData={type:'slope',...s};slopeGroup.add(mesh);slopeMeshes.push(mesh);});
 EVENT_POINTS.forEach(e=>{const color=/地震/.test(e.type)?0x9f5aa8:/落石|土石流|泥流/.test(e.type)?0xc24d4d:0xd58c30;const mesh=new THREE.Mesh(new THREE.ConeGeometry(.34,.92,5),new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:.35,roughness:.3,transparent:true}));mesh.position.copy(toWorld(e.pos,1.05));mesh.rotation.y=Math.PI/4;mesh.userData={type:'event',...e};eventGroup.add(mesh);eventMeshes.push(mesh);});
 renderer.domElement.addEventListener('pointermove',onPointerMove);renderer.domElement.addEventListener('click',onPointerClick);window.addEventListener('resize',onResize);
}
function animate(){requestAnimationFrame(animate);controls.update();const t=performance.now()*.001;eventMeshes.forEach((m,i)=>{if(m.userData.line===selected){const s=1+Math.sin(t*2.2+i)*.08;m.scale.setScalar(s);}});renderer.render(scene,camera);}
function onResize(){if(!renderer)return;renderer.setSize(viewer.clientWidth,viewer.clientHeight);camera.aspect=viewer.clientWidth/viewer.clientHeight;camera.updateProjectionMatrix();}
function screenPointer(e){const r=renderer.domElement.getBoundingClientRect();pointer.x=((e.clientX-r.left)/r.width)*2-1;pointer.y=-((e.clientY-r.top)/r.height)*2+1;}
function pickObject(e){screenPointer(e);raycaster.setFromCamera(pointer,camera);const objs=[...routeGroup.children,...markerGroup.children,...stationGroup.children,...eventGroup.children,...slopeGroup.children];const hits=raycaster.intersectObjects(objs,false);return hits.length?hits[0]:null;}
function pointLabel(d){if(d.type==='event')return `EVENT｜${d.date}｜${d.title}`;if(d.type==='slope')return `SLOPE｜${d.code}｜${d.grade}級`;if(d.type==='station')return d.name;return d.line||'';}
function onPointerMove(e){const hit=pickObject(e);if(!hit){hoverLabel.style.display='none';renderer.domElement.style.cursor='grab';return;}const d=hit.object.userData||{};const label=pointLabel(d);if(!label){hoverLabel.style.display='none';return;}renderer.domElement.style.cursor='pointer';const r=renderer.domElement.getBoundingClientRect();hoverLabel.style.display='block';hoverLabel.textContent=label;hoverLabel.style.left=`${e.clientX-r.left}px`;hoverLabel.style.top=`${e.clientY-r.top}px`;}
function openPointInspector(d){const panel=document.querySelector('#pointInspector');panel.hidden=false;if(d.type==='event'){document.querySelector('#pointType').textContent='EVENT · TRA-04';document.querySelector('#pointTitle').textContent=d.title;document.querySelector('#pointMeta').textContent=`${d.date}｜${d.line}｜${d.type}`;document.querySelector('#pointDescription').textContent=d.desc;document.querySelector('#pointSource').textContent=`來源：${d.source}；位置為事件地名沿路線之展示映射。`;}else if(d.type==='slope'){document.querySelector('#pointType').textContent='SLOPE · TRA-03';document.querySelector('#pointTitle').textContent=d.code;document.querySelector('#pointMeta').textContent=`${d.line}｜${d.section}｜${d.km}｜確認分級 ${d.grade}`;document.querySelector('#pointDescription').textContent=d.desc;document.querySelector('#pointSource').textContent='來源：TRA-03 原始邊坡清冊；此 3D 點位依站間 / 里程沿路線做展示映射，非 GPS 實測座標。';}else if(d.type==='station'){document.querySelector('#pointType').textContent='STATION';document.querySelector('#pointTitle').textContent=d.name;document.querySelector('#pointMeta').textContent='代表站點';document.querySelector('#pointDescription').textContent='用於輔助辨識 3D 台灣路網位置。';document.querySelector('#pointSource').textContent='站點位置為示意相對位置。';}}
function onPointerClick(e){const hit=pickObject(e);if(!hit)return;const d=hit.object.userData||{};if(d.line)selectLine(d.line);if(['event','slope','station'].includes(d.type))openPointInspector(d);}
function focusCamera(position,target=new THREE.Vector3(0,2,4)){camera.position.copy(position);controls.target.copy(target);controls.update();}
function setViewLabel(text){document.querySelector('#viewMode').textContent=text;}
function highlight3D(line){routeMeshes.forEach((mesh,name)=>{const base=routeColor(lineInfo(name).util);mesh.material.color.setHex(base);mesh.material.emissive.setHex(name===line?0x345f73:0x14232a);mesh.material.emissiveIntensity=name===line?.7:.12;mesh.scale.setScalar(name===line?1.03:1);});markerGroup.children.forEach(obj=>{if(obj.userData.type==='pillar')obj.material.emissiveIntensity=obj.userData.line===line?.5:.08;});eventMeshes.forEach(m=>{m.material.opacity=m.userData.line===line?1:.28;m.scale.setScalar(m.userData.line===line?1.18:.88);});slopeMeshes.forEach(m=>{m.material.opacity=m.userData.line===line?1:.22;m.scale.setScalar(m.userData.line===line?1.18:.86);});heatMeshes.forEach(m=>m.material.opacity=m.userData.line===line?1:.28);}
function updateGeoSummary(x){document.querySelector('#geoLineName').textContent=x.line;document.querySelector('#geoBottle').textContent=x.bottle;document.querySelector('#geoCaseStatus').textContent=CASE_CHAINS[x.line]?'已建立案例鏈':'尚無完整案例鏈';}

function renderList(){const data=[...LINES].sort((a,b)=>(b.ch*1.2+b.util)-(a.ch*1.2+a.util));$('#lineList').innerHTML=data.map(x=>`<button class="row ${x.line===selected?'active':''}" data-line="${x.line}"><div class="top"><b>${x.line}</b><span class="level ${x.attention}">${level(x.attention)}</span></div><div class="meta"><span>邊坡 ${x.total.toLocaleString()}</span><span>C高 ${x.ch}</span><span>最高利用率 ${x.util.toFixed(1)}%</span></div></button>`).join('');$$('#lineList .row').forEach(b=>b.onclick=()=>selectLine(b.dataset.line));}
function routeSelect(line){$$('[data-line]').forEach(el=>el.classList.toggle('selected',el.dataset.line===line));}
function selectLine(line){selected=line;renderList();routeSelect(line);if(routeMeshes.size)highlight3D(line);const x=LINES.find(v=>v.line===line)||LINES[0];$('#badgeLine').textContent=x.line;$('#lineTitle').textContent=x.line;$('#mSlope').textContent=`${x.ch} / ${x.total.toLocaleString()}`;$('#mUtil').textContent=`${x.util.toFixed(1)}%`;$('#mBottle').textContent=x.bottle;$('#txtPhysical').textContent = x.ch?`此線共有 ${x.total.toLocaleString()} 處邊坡，其中 C高 ${x.ch} 處；畫面保留臺鐵官方分級，並進一步將其與事件與列車後果串接。`:`目前此線 C高 數量較低，但仍須關注單點風險與相鄰設備。`;$('#txtOps').textContent = x.util>=85?`此線最高區間利用率為 ${x.util.toFixed(1)}%，若發生阻斷或慢行，調度餘裕很小，營運影響可能快速擴散。`:x.util>=70?`此線最高區間利用率為 ${x.util.toFixed(1)}%，屬中高營運曝露，需同時考慮資產風險與營運承載。`:`此線最高區間利用率為 ${x.util.toFixed(1)}%，相較高利用率幹線，營運影響擴散相對有限。`;$('#txtDecision').textContent='不直接給一個黑箱風險分數，而是讓使用者沿著「邊坡→事件→列車→延誤→容量→處置」案例鏈做判讀。';const rel=EVENTS.filter(e=>e.line===line).slice(0,3);$('#relatedCases').innerHTML=rel.length?rel.map(e=>`<div class="case ${/土石流|落石|泥流/.test(e.type)?'hazard':''}"><b>${e.date}｜${e.title}</b><small>${e.place}｜${e.type}</small><p>${e.desc}</p></div>`).join(''):'<div class="case"><b>目前未綁定代表事件</b><p>正式版可依里程、站間與事件類型，自動回叫對應的 TRA-04 事件與 TRA-08/09/10 行車後果。</p></div>';updateGeoSummary(x);renderChain();renderLocalCases();}
function chainDetails(c){
 return {
  asset:{source:"TRA-03",title:"邊坡資產詳情",record:c.asset,dataset:"TRA-03 邊坡分級與巡檢指標數據",match:"以線別、站間與里程建立候選邊坡關聯。",evidence:c.assetDesc,boundary:"目前案例鏈以候選邊坡群為主；若事件未提供精確里程，不宣稱一對一命中。",primary:"查看路線資產",target:"top"},
  event:{source:"TRA-04",title:"歷史異常事件",record:c.event,dataset:"TRA-04 歷史異常事件日誌（去識別化）",match:"同線別 + 站間/地名 + 災害類型匹配。",evidence:c.eventDesc,boundary:"事件地點若只到站間，僅能建立站間層級關聯。",primary:"查看歷史事件",target:"events"},
  train:{source:"TRA-08 / TRA-10",title:"受影響列車",record:c.train,dataset:"TRA-08 列車實際到離站時間 + TRA-10 誤點原因分類",match:"以事件日期、原因欄與車次交叉辨識受影響列車。",evidence:c.trainDesc,boundary:"只顯示可由競賽資料重現的車次關聯；沒有資料時不補造。",primary:"查看事件證據",target:"events"},
  delay:{source:"TRA-09",title:"延誤後果",record:c.delay,dataset:"TRA-09 誤點分鐘數",match:"事件日期下，同車次取最大到/離站延誤，再依案例需要彙整。",evidence:c.delayDesc,boundary:"帶 * 的分鐘數是系統衍生值，不是 TRA-04 官方事故影響分鐘。",primary:"查看營運影響",target:"ops"},
  capacity:{source:"TRA-11",title:"瓶頸容量曝露",record:c.capacity,dataset:"TRA-11 瓶頸路段容量（路線利用率）",match:"將事件所在路線映射到該線最高或相符區間利用率。",evidence:c.capacityDesc,boundary:"利用率用於衡量調度餘裕，不代表災害機率。",primary:"查看容量圖",target:"ops"},
  action:{source:"Decision Memory",title:"處置與回填",record:c.action,dataset:"TRA-04 歷史處置 + 人工巡檢回填",match:"以歷史事件處置作為參考，再由當班行控/工務確認。",evidence:c.actionDesc,boundary:"系統只提供決策支援，不自動下達限速、封鎖或復駛命令。",primary:"建立追蹤回填",target:"track"}
 };
}
function showChainDetail(step){
 const c=CASE_CHAINS[selected]; if(!c)return;
 const d=chainDetails(c)[step]; if(!d)return;
 $$('.chain-node').forEach(n=>n.classList.toggle('selected',n.dataset.step===step));
 $('#detailSource').textContent=d.source; $('#detailTitle').textContent=d.title; $('#detailStatus').textContent=step==='asset'?'候選匹配':'已關聯'; $('#detailRecord').textContent=d.record; $('#detailDataset').textContent=d.dataset; $('#detailMatch').textContent=d.match; $('#detailEvidence').textContent=d.evidence; $('#detailBoundary').textContent=d.boundary; $('#detailPrimary').textContent=d.primary; $('#detailPrimary').dataset.target=d.target;
}
function renderChain(){
 const c=CASE_CHAINS[selected];
 if(!c){
  $('#chainFlow').innerHTML='<div class="case"><b>目前尚未建立此路線的完整案例鏈</b><p>可先用線別與站間規則做候選匹配，後續再加上里程與邊坡編號精確對應。</p></div>';
  $('#chainRules').innerHTML='<ul><li>尚未綁定路線級規則。</li></ul>'; $('#chainDecision').innerHTML='<ul><li>請先建立事件—站間—里程關聯。</li></ul>';
  $('#detailSource').textContent='—'; $('#detailTitle').textContent='尚無案例鏈'; $('#detailStatus').textContent='未建立'; $('#detailRecord').textContent='此路線目前沒有完整的六段資料鏈。'; $('#detailDataset').textContent='—'; $('#detailMatch').textContent='—'; $('#detailEvidence').textContent='—'; $('#detailBoundary').textContent='需先完成路線/站間/里程關聯。'; return;
 }
 const nodes=[
  ['asset','TRA-03 邊坡','邊坡資產',c.asset,c.assetDesc],
  ['event','TRA-04 事件','異常事件',c.event,c.eventDesc],
  ['train','TRA-08/10','受影響列車',c.train,c.trainDesc],
  ['delay','TRA-09','延誤後果',c.delay,c.delayDesc],
  ['capacity','TRA-11','容量曝露',c.capacity,c.capacityDesc],
  ['action','Decision','建議處置',c.action,c.actionDesc]
 ];
 $('#chainFlow').innerHTML=nodes.map(([step,source,title,record,desc])=>`<button type="button" class="chain-node ${step}" data-step="${step}"><span class="step">${source}</span><h4>${title}</h4><b>${record}</b><p>${desc}</p></button>`).join('');
 $$('.chain-node').forEach(n=>n.addEventListener('click',()=>showChainDetail(n.dataset.step)));
 $('#chainRules').innerHTML=`<ul>${c.rules.map(i=>`<li>${i}</li>`).join('')}</ul>`; $('#chainDecision').innerHTML=`<ul>${c.decision.map(i=>`<li>${i}</li>`).join('')}</ul>`;
 showChainDetail('asset');
}
function renderEvents(){ $('#eventGrid').innerHTML = EVENTS.map(e=>`<div class="event-card"><small>${e.date}｜${e.roc}</small><b>${e.title}</b><p>${e.line}｜${e.place}</p><p style="margin-top:6px"><strong>影響：</strong>${e.trains}${e.minutes!=='—'?`｜${e.minutes} 分`:''}${e.passengers!=='—'?`｜${e.passengers} 人`:''}</p><p style="margin-top:6px;color:#6d7e87">${e.note}</p></div>`).join(''); }
function renderUtil(){const max=Math.max(...UTIL.map(x=>x[1]));$('#utilBars').innerHTML=UTIL.map(([line,v])=>`<div class="bar"><span>${line}</span><div class="track"><i class="${v>=85?'hot':v>=70?'warn':''}" style="width:${(v/max*100).toFixed(1)}%"></i></div><b>${v.toFixed(1)}%</b></div>`).join('');}
function renderLocalCases(){const arr=getCases().filter(x=>x.line===selected);$('#memoryList').innerHTML=arr.length?arr.slice(0,4).map(c=>`<div class="memory"><b>${new Date(c.time).toLocaleString('zh-TW')}｜${c.outcome}</b><p>${c.note||'無補充說明'}</p></div>`).join(''):'<div class="memory"><b>尚無人工回填</b><p>這裡保留的是人工巡檢回填，不是生成式 AI 對話紀錄。</p></div>'}
$('#btnSave').onclick=()=>{const arr=getCases();arr.unshift({time:new Date().toISOString(),line:selected,outcome:$('#caseOutcome').value,note:$('#caseNote').value.trim()});saveCaseData(arr);$('#caseNote').value='';toast('已儲存人工回填')};
$('#btnOpenAll').onclick=()=>{const arr=getCases();$('#allCasesBody').innerHTML=arr.length?arr.map(c=>`<div class="memory"><b>${new Date(c.time).toLocaleString('zh-TW')}｜${c.line}｜${c.outcome}</b><p>${c.note||'無補充說明'}</p></div>`).join(''):'<p style="color:#6e818d">尚無人工回填案件。</p>';$('#allCasesModal').classList.add('open')};
$('#btnCloseAll').onclick=()=>$('#allCasesModal').classList.remove('open');
$('#btnTerrain').onclick=()=>$('#terrainModal').classList.add('open'); $('#btnCloseTerrain').onclick=()=>$('#terrainModal').classList.remove('open');
$('#btnDemo').onclick=()=>{selectLine('北迴線');focusCamera(new THREE.Vector3(18,13,34),new THREE.Vector3(10,1,10));setViewLabel('3D 北迴線展示');document.querySelector('#chainBlock').scrollIntoView({behavior:'smooth',block:'start'});toast('已切換到北迴線 3D 展示與案例鏈')};
$('#btnReset').onclick=()=>selectLine('縱貫線');
$('#btnShowChain').onclick=()=>document.querySelector('#chainBlock').scrollIntoView({behavior:'smooth',block:'start'});
$('#btnShowOps').onclick=()=>document.querySelectorAll('.block')[2]?.scrollIntoView({behavior:'smooth',block:'start'});
$$('[data-line]').forEach(el=>el.onclick=()=>selectLine(el.dataset.line));

$('#detailPrimary').onclick=()=>{const t=$('#detailPrimary').dataset.target;if(t==='events'){document.querySelector('#eventGrid').scrollIntoView({behavior:'smooth',block:'center'});}else if(t==='ops'){document.querySelector('#utilBars').scrollIntoView({behavior:'smooth',block:'center'});}else if(t==='track'){document.querySelector('#caseNote').focus();document.querySelector('.detail-panel').scrollIntoView({behavior:'smooth',block:'start'});}else{document.querySelector('.layout').scrollIntoView({behavior:'smooth',block:'start'});}};
$('#detailTrack').onclick=()=>{document.querySelector('#caseNote').focus();document.querySelector('.detail-panel').scrollIntoView({behavior:'smooth',block:'start'});toast('請填寫人工巡檢或處置回填');};
renderList(); renderEvents(); renderUtil();
let threeReady=false;
try{
  buildThreeScene();
  threeReady=true;
  selectLine('縱貫線');
  animate();
}catch(err){
  console.error('Three.js initialization failed:',err);
  selectLine('縱貫線');
  document.querySelector('#viewerTip').textContent='3D 引擎載入失敗，已保留 2D 備援地圖；其他決策功能仍可使用。';
  toast('3D 引擎未載入，已切換備援地圖');
}
document.querySelector('#btnTopView').onclick=()=>{focusCamera(new THREE.Vector3(0,52,8),new THREE.Vector3(0,1,6));setViewLabel('3D 俯視');};
document.querySelector('#btnPerspective').onclick=()=>{focusCamera(new THREE.Vector3(0,15,40),new THREE.Vector3(0,2,4));setViewLabel('3D 斜視');};
document.querySelector('#btnResetCamera').onclick=()=>{focusCamera(new THREE.Vector3(0,15,40),new THREE.Vector3(0,2,4));setViewLabel('3D 斜視');};
document.querySelector('#btnFocusNorth').onclick=()=>{focusCamera(new THREE.Vector3(6,11,18),new THREE.Vector3(2,2,-20));setViewLabel('聚焦北部');};
document.querySelector('#btnFocusEast').onclick=()=>{focusCamera(new THREE.Vector3(24,10,20),new THREE.Vector3(15,1,12));setViewLabel('聚焦東部');};
document.querySelector('#pointInspectorClose').onclick=()=>{document.querySelector('#pointInspector').hidden=true;};
document.querySelector('#layerRoutes').onchange=e=>{routeGroup.visible=e.target.checked;markerGroup.visible=e.target.checked;};
document.querySelector('#layerEvents').onchange=e=>{eventGroup.visible=e.target.checked;};
document.querySelector('#layerSlopes').onchange=e=>{slopeGroup.visible=e.target.checked;};
document.querySelector('#layerHeat').onchange=e=>{heatGroup.visible=e.target.checked;};
document.querySelector('#layerStations').onchange=e=>{stationGroup.visible=e.target.checked;};
