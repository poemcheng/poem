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
 {date:"2026/05/04",roc:"115年 0504-1 / 0504-4",line:"北迴線",place:"宜蘭－和平站間",type:"地震",title:"宜蘭南方地震，北迴線受影響",desc:"TRA-04 記錄兩起天然災變；TRA-08/09/10 同日可見天然災變(地震)原因標記。",trains:"22",minutes:"748*",passengers:"—",note:"* 748 分為系統衍生值：受影響車次各取當日最大延誤後加總。",coord:[121.78,24.42]},
 {date:"2026/05/13",roc:"115年 0513-3",line:"北迴線",place:"新城－鳳林",type:"地震",title:"花蓮北方規模 5.0 地震",desc:"同日行車資料有 34 筆天然災變(地震)原因標記。",trains:"9",minutes:"274*",passengers:"—",note:"* 274 分為系統衍生值。",coord:[121.54,23.95]},
 {date:"2025/11/11",roc:"114年 1111-4",line:"臺東線",place:"萬榮－光復",type:"泥流",title:"鳳凰颱風泥流淹及路線",desc:"光復隧道北口上方淹水，上下行列車預防性停駛；完成導流後恢復。",trains:"17 停駛",minutes:"—",passengers:"—",note:"原始事件影響欄明列停駛 17 列次。",coord:[121.42,23.62]},
 {date:"2025/09/24",roc:"114年 0924-1",line:"宜蘭線",place:"八斗子站",type:"落石",title:"落石侵入路線",desc:"列車無法進站，工務移除落石後恢復正常行駛。",trains:"2 停駛",minutes:"—",passengers:"約 30",note:"原始事故影響欄記錄兩列次停駛。",coord:[121.80,25.14]},
 {date:"2025/07/09",roc:"114年 0709-1",line:"內灣線",place:"上員－榮華",type:"落石",title:"列車撞擊侵入路線石頭",desc:"1801 次撞石後水箱破裂、引擎故障；現場限速 25 km/h，清理後解除慢行。",trains:"3",minutes:"44",passengers:"—",note:"原始事故列出 1846/19 分、1801/11 分、1803/14 分。",coord:[121.02,24.74]},
 {date:"2025/05/18",roc:"114年 0518-1",line:"北迴線",place:"和仁－崇德",type:"土石流/淹水",title:"豪雨造成水淹軌面並伴隨土石流",desc:"西正線水淹超過軌面且電車線、路線受損，區間一度雙向不通。",trains:"多列調整",minutes:"—",passengers:"—",note:"原始敘述包含退行、區間中斷、接駁等處置。",coord:[121.70,24.18]},
 {date:"2022/10/16",roc:"111年 1016-3",line:"宜蘭線",place:"七堵－汐止、雙溪－貢寮等",type:"豪雨/土石流",title:"豪雨水淹軌面與部分土石流",desc:"多區間豪雨水淹軌面與部分土石流。",trains:"78",minutes:"6,654",passengers:"16,769",note:"原始影響欄：78 列 / 6654 分 / 旅客 16769 人。",coord:[121.72,25.03]}
];

const SLOPES=[
 {line:"宜蘭線",code:"1040E-001313-001394L",grade:"C",section:"八堵－暖暖",km:"1,313–1,394 m",desc:"位於山崩與地質敏感區，未發現明顯異狀。",coord:[121.731,25.107]},
 {line:"宜蘭線",code:"1040E-001443-001498L",grade:"C",section:"八堵－暖暖",km:"1,443–1,498 m",desc:"位於山崩與地質敏感區，未發現明顯異狀。",coord:[121.734,25.106]},
 {line:"宜蘭線",code:"1040E-001498-001570L",grade:"C",section:"八堵－暖暖",km:"1,498–1,570 m",desc:"位於山崩與地質敏感區，未發現明顯異狀。",coord:[121.736,25.105]},
 {line:"宜蘭線",code:"1040W-000945-000956R",grade:"C",section:"八堵－暖暖",km:"945–956 m",desc:"鋼筋外露銹蝕與洩水孔堵塞。",coord:[121.729,25.108]},
 {line:"宜蘭線",code:"1040W-000956-000980R",grade:"C",section:"八堵－暖暖",km:"956–980 m",desc:"噴凝土坡面混凝土剝落、破損，建議由工務修補。",coord:[121.730,25.108]},
 {line:"宜蘭線",code:"1040W-000990-001070R",grade:"C",section:"八堵－暖暖",km:"990–1,070 m",desc:"坡面噴凝土劣化剝落及樹木根系造成破損。",coord:[121.732,25.107]},
 {line:"宜蘭線",code:"1040W-001515-001550R",grade:"C",section:"八堵－暖暖",km:"1,515–1,550 m",desc:"樹根拔起若翻落有影響鐵軌之虞，建議加強調查。",coord:[121.738,25.104]},
 {line:"北迴線",code:"1050E-001492-001688L",grade:"C",section:"蘇澳新－新城",km:"1,492–1,688 m",desc:"北迴線 C 級邊坡候選；原始清冊無 GPS，依線別/里程做展示映射。",coord:[121.854,24.585]},
 {line:"北迴線",code:"1050E-001702-001742L",grade:"C",section:"蘇澳新－新城",km:"1,702–1,742 m",desc:"北迴線 C 級邊坡候選；原始清冊無 GPS，依線別/里程做展示映射。",coord:[121.857,24.574]},
 {line:"北迴線",code:"1050E-001749-001912L",grade:"C",section:"蘇澳新－新城",km:"1,749–1,912 m",desc:"北迴線 C 級邊坡候選；原始清冊無 GPS，依線別/里程做展示映射。",coord:[121.861,24.561]}
];

const STATIONS=[
 {name:"八堵",coord:[121.728,25.108]},{name:"宜蘭",coord:[121.753,24.754]},{name:"蘇澳新",coord:[121.827,24.608]},
 {name:"花蓮",coord:[121.601,23.993]},{name:"臺東",coord:[121.123,22.793]},{name:"高雄",coord:[120.302,22.639]},
 {name:"新竹",coord:[120.971,24.801]},{name:"臺中",coord:[120.685,24.137]},{name:"內灣",coord:[121.182,24.705]}
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

const LINE_BOUNDS={
 "縱貫線":[[120.15,22.55],[121.80,25.25]],"宜蘭線":[[121.60,24.50],[121.95,25.18]],"北迴線":[[121.50,23.90],[121.95,24.68]],
 "臺東線":[[121.02,22.65],[121.72,24.12]],"南迴線":[[120.50,22.30],[121.32,22.90]],"屏東線":[[120.25,22.35],[120.75,22.80]],
 "臺中線":[[120.50,23.90],[120.85,24.55]],"內灣線":[[120.92,24.60],[121.25,24.86]],"集集線":[[120.55,23.70],[121.00,24.00]],
 "平溪線":[[121.65,24.85],[121.90,25.10]],"深澳線":[[121.70,25.05],[121.90,25.18]],"花蓮港線":[[121.55,23.90],[121.68,24.08]],"成追線":[[120.55,24.00],[120.75,24.25]]
};

const CASE_CHAINS={
 "北迴線":{asset:"1050E-001492-001688L、1050E-001702-001742L",assetDesc:"TRA-03 北迴線 C 級邊坡候選；站間：蘇澳新—新城；里程 1,492–1,742 m",event:"2026/05/04 地震｜宜蘭－和平站間",eventDesc:"TRA-04 天然災變事件，與北迴線同線別且位於東部幹線高敏感路段。",train:"受影響列車 22 車次",trainDesc:"從 TRA-08/09/10 辨識同日天然災變(地震)原因並彙整受影響車次。",delay:"延誤合計 748* 分鐘",delayDesc:"* 系統衍生統計：每一受影響車次取當日最大延誤後加總；最大單車次 73 分。",capacity:"蘇澳新–和平 77.37%",capacityDesc:"TRA-11 顯示該區段利用率偏高，事件發生時調度餘裕有限。",action:"工務巡查 + 慢行複核 + 行控調整",actionDesc:"建議先查核邊坡與軌道狀態，再依現場結果決定是否發布慢行與調整班次。",rules:["同線別匹配：北迴線 TRA-03 ↔ TRA-04。","站間 / 地名匹配：宜蘭、和平、和仁、崇德等北迴線東部站間。","時間匹配：以事件日期回查 TRA-08/09/10 當日受影響列車與延誤。","後果放大評估：再接 TRA-11 的瓶頸容量資訊。"],decision:["優先確認東部幹線坡面與軌道通行條件。","若現場可通行但風險未排除，先採慢行與加密巡查。","保留本次巡檢紀錄與復原時間，作為下次東部地震事件的可追溯記憶。"]},
 "宜蘭線":{asset:"1040E-001313-001394L、1040E-001443-001498L",assetDesc:"TRA-03 宜蘭線 C 級邊坡候選；站間：八堵—暖暖；位於山崩與地質敏感區。",event:"2025/09/24 落石｜八斗子站",eventDesc:"TRA-04 記錄落石侵入路線，工務移除後恢復正常行駛。",train:"受影響列車 2 列停駛",trainDesc:"原始事件欄已明列停駛 2 列次與旅客約 30 人。",delay:"停駛 / 旅客衝擊",delayDesc:"此案例重點為落石造成進站受阻，故以停駛與旅客影響呈現。",capacity:"八堵–雙溪 89.43%",capacityDesc:"屬高利用率區間，若阻斷持續，營運影響擴散速度快。",action:"落石排除 + 現場封鎖 + 恢復查核",actionDesc:"以現場安全為優先，完成清除後再恢復正常行駛。",rules:["同線別匹配：宜蘭線邊坡清冊 ↔ 宜蘭線事件。","站間優先：八堵、暖暖、瑞芳、雙溪等地名作為候選關聯。","若 TRA-08/09/10 無完整延誤鏈，即保留停駛/旅客欄位。","容量資料用於補強營運後果判讀。"],decision:["高利用率宜蘭線應先處理落石排除與通行安全。","後續需將落石位置回填對應邊坡編號，形成更精準的資產—事件鏈。"]},
 "內灣線":{asset:"TRA-03 內灣線候選邊坡群（346 處 / C高 37）",assetDesc:"目前以線別與站間作候選關聯，正式版可再精準到個別里程。",event:"2025/07/09 落石｜上員－榮華",eventDesc:"TRA-04 記錄列車撞石、水箱破裂與引擎故障。",train:"1801 / 1803 / 1846 次",trainDesc:"事件表已明列受影響車次。",delay:"44 分鐘",delayDesc:"由原始事件影響欄整理為 3 車次共 44 分鐘。",capacity:"九讚頭–內灣 75.56%",capacityDesc:"中高利用率，對支線營運仍具影響。",action:"慢行 25 km/h + 清理落石 + 解除慢行",actionDesc:"這是一個適合展示處置記憶價值的支線案例。",rules:["站間精確匹配：上員－榮華。","先讀原始事故影響欄，再補容量與邊坡清冊資訊。"],decision:["支線案例可展示系統不只支援幹線，也能保留小型但完整的事故處置知識。"]}
};

const STORE_KEY="railslope_real_gis_memory_v1";
let selected="縱貫線";
let map=null, maplibregl=null, mapLoaded=false, terrainOn=true;
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];

function toast(txt){const t=$("#toast");t.textContent=txt;t.classList.add("show");clearTimeout(t._);t._=setTimeout(()=>t.classList.remove("show"),2200)}
function getCases(){try{return JSON.parse(localStorage.getItem(STORE_KEY)||"[]")}catch{return[]}}
function saveCaseData(arr){localStorage.setItem(STORE_KEY,JSON.stringify(arr));renderLocalCases()}
function level(att){return att==="high"?"高關注":att==="mid"?"注意":"一般"}
function lineInfo(name){return LINES.find(v=>v.line===name)||LINES[0]}

function renderList(){
 const data=[...LINES].sort((a,b)=>(b.ch*1.2+b.util)-(a.ch*1.2+a.util));
 $("#lineList").innerHTML=data.map(x=>`<button class="row ${x.line===selected?"active":""}" data-line="${x.line}"><div class="top"><b>${x.line}</b><span class="level ${x.attention}">${level(x.attention)}</span></div><div class="meta"><span>邊坡 ${x.total.toLocaleString()}</span><span>C高 ${x.ch}</span><span>最高利用率 ${x.util.toFixed(1)}%</span></div></button>`).join("");
 $$("#lineList .row").forEach(b=>b.onclick=()=>selectLine(b.dataset.line,true));
}

function eventGeoJSON(){return {type:"FeatureCollection",features:EVENTS.map((e,i)=>({type:"Feature",geometry:{type:"Point",coordinates:e.coord},properties:{id:i,line:e.line,date:e.date,type:e.type,title:e.title,place:e.place,desc:e.desc,source:"TRA-04 / TRA-08 / TRA-09 / TRA-10",approximate:true}}))}}
function slopeGeoJSON(){return {type:"FeatureCollection",features:SLOPES.map((s,i)=>({type:"Feature",geometry:{type:"Point",coordinates:s.coord},properties:{id:i,line:s.line,code:s.code,grade:s.grade,section:s.section,km:s.km,desc:s.desc,source:"TRA-03",approximate:true}}))}}
function stationGeoJSON(){return {type:"FeatureCollection",features:STATIONS.map((s,i)=>({type:"Feature",geometry:{type:"Point",coordinates:s.coord},properties:{id:i,name:s.name}}))}}
function heatGeoJSON(){return {type:"FeatureCollection",features:HOTSPOTS.map((h,i)=>({type:"Feature",geometry:{type:"Point",coordinates:h.coord},properties:{id:i,line:h.line,weight:h.weight,label:h.label}}))}}

async function initMap(){
 const host=$("#viewer3d");
 try{
   maplibregl=await import("https://unpkg.com/maplibre-gl@6.11.2/dist/maplibre-gl.mjs");
 }catch(err){
   console.error(err);
   host.innerHTML='<div style="padding:32px;color:#5f7480">地圖引擎載入失敗。請確認瀏覽器可連線 unpkg.com；其他案例鏈與資料分析仍可使用。</div>';
   $("#viewerTip").textContent="MapLibre 引擎未載入";
   return;
 }
 map=new maplibregl.Map({
   container:"viewer3d",
   center:[120.95,23.70],
   zoom:6.55,
   pitch:58,
   bearing:-8,
   maxPitch:82,
   maxZoom:16,
   minZoom:5.4,
   renderWorldCopies:false,
   style:{
     version:8,
     sources:{
       nlsc:{
         type:"raster",
         tiles:["https://wmts.nlsc.gov.tw/wmts/EMAP5_OPENDATA/default/GoogleMapsCompatible/{z}/{y}/{x}"],
         tileSize:256,minzoom:0,maxzoom:15,
         attribution:'底圖 © 內政部國土測繪中心 NLSC'
       },
       terrain:{
         type:"raster-dem",
         tiles:["https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"],
         tileSize:256,maxzoom:15,encoding:"terrarium",
         attribution:"Terrain: AWS Terrain Tiles"
       },
       railway:{
         type:"raster",
         tiles:["https://tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png"],
         tileSize:256,minzoom:2,maxzoom:19,
         attribution:'Railway: © OpenStreetMap contributors, OpenRailwayMap'
       }
     },
     layers:[
       {id:"nlsc-base",type:"raster",source:"nlsc"},
       {id:"hillshade",type:"hillshade",source:"terrain",paint:{"hillshade-shadow-color":"#5a6259","hillshade-highlight-color":"#ffffff","hillshade-exaggeration":0.32}},
       {id:"railway-overlay",type:"raster",source:"railway",paint:{"raster-opacity":0.82}}
     ]
   }
 });
 map.addControl(new maplibregl.NavigationControl({visualizePitch:true}),"bottom-left");
 map.on("load",()=>{
   mapLoaded=true;
   map.setTerrain({source:"terrain",exaggeration:1.35});
   addOperationalLayers();
   bindMapInteractions();
   selectLine(selected,false);
 });
 map.on("error",e=>console.warn("MapLibre layer error:",e?.error||e));
}

function addOperationalLayers(){
 map.addSource("events",{type:"geojson",data:eventGeoJSON()});
 map.addLayer({id:"events",type:"circle",source:"events",paint:{"circle-radius":["interpolate",["linear"],["zoom"],6,5,12,9],"circle-color":["match",["get","type"],"地震","#8e5ca2","落石","#c34f4f","土石流/淹水","#c34f4f","泥流","#d77d39","#a9655b"],"circle-stroke-color":"#ffffff","circle-stroke-width":2,"circle-opacity":0.95}});
 map.addSource("slopes",{type:"geojson",data:slopeGeoJSON()});
 map.addLayer({id:"slopes",type:"circle",source:"slopes",paint:{"circle-radius":["interpolate",["linear"],["zoom"],6,3.5,13,7],"circle-color":["match",["get","grade"],"C","#e2a32f","B","#c24d4d","D","#6d8f80","#8398a3"],"circle-stroke-color":"#fff","circle-stroke-width":1.5,"circle-opacity":0.92}});
 map.addSource("stations",{type:"geojson",data:stationGeoJSON()});
 map.addLayer({id:"stations",type:"circle",source:"stations",paint:{"circle-radius":4.5,"circle-color":"#ffffff","circle-stroke-color":"#34596b","circle-stroke-width":2}});
 map.addSource("hotspots",{type:"geojson",data:heatGeoJSON()});
 map.addLayer({id:"risk-heat",type:"heatmap",source:"hotspots",maxzoom:12,paint:{"heatmap-weight":["get","weight"],"heatmap-intensity":["interpolate",["linear"],["zoom"],5,0.7,10,1.6],"heatmap-radius":["interpolate",["linear"],["zoom"],5,25,10,55],"heatmap-opacity":0.55,"heatmap-color":["interpolate",["linear"],["heatmap-density"],0,"rgba(0,0,0,0)",0.25,"rgba(244,196,65,0.35)",0.55,"rgba(230,126,46,0.5)",0.85,"rgba(194,77,77,0.65)",1,"rgba(166,50,50,0.78)"]}}, "events");
}

function bindMapInteractions(){
 ["events","slopes","stations"].forEach(id=>{
   map.on("mouseenter",id,()=>map.getCanvas().style.cursor="pointer");
   map.on("mouseleave",id,()=>map.getCanvas().style.cursor="");
 });
 map.on("click","events",e=>{const f=e.features[0];selectLine(f.properties.line,false);showPoint("event",f.properties,e.lngLat);});
 map.on("click","slopes",e=>{const f=e.features[0];selectLine(f.properties.line,false);showPoint("slope",f.properties,e.lngLat);});
 map.on("click","stations",e=>{const f=e.features[0];showPoint("station",f.properties,e.lngLat);});
}

function showPoint(type,p,lngLat){
 const panel=$("#pointInspector"); panel.hidden=false;
 if(type==="event"){
   $("#pointType").textContent="EVENT · TRA-04";
   $("#pointTitle").textContent=p.title;
   $("#pointMeta").textContent=`${p.date}｜${p.line}｜${p.type}｜${p.place}`;
   $("#pointDescription").textContent=p.desc;
   $("#pointSource").textContent="位置依 TRA-04 事件地名/站間定位至鄰近路段，原始資料若無精確座標則屬近似位置。";
 }else if(type==="slope"){
   $("#pointType").textContent="SLOPE · TRA-03";
   $("#pointTitle").textContent=p.code;
   $("#pointMeta").textContent=`${p.line}｜${p.section}｜${p.km}｜確認分級 ${p.grade}`;
   $("#pointDescription").textContent=p.desc;
   $("#pointSource").textContent="來源：TRA-03 原始邊坡清冊；無 GPS 的紀錄依站間與里程沿真實鐵路路廊做展示定位。";
 }else{
   $("#pointType").textContent="STATION";
   $("#pointTitle").textContent=p.name;
   $("#pointMeta").textContent="代表站點";
   $("#pointDescription").textContent="用於輔助辨識臺灣真實鐵路路網與事件位置。";
   $("#pointSource").textContent="鐵路軌道幾何請以 OpenRailwayMap 圖層為準。";
 }
 if(maplibregl&&lngLat) new maplibregl.Popup({closeButton:false,offset:10}).setLngLat(lngLat).setHTML(`<b>${type==="slope"?p.code:p.title||p.name}</b><small>${type==="event"?p.place:type==="slope"?p.section:"代表站點"}</small>`).addTo(map);
}

function setLayerVisible(id,visible){if(mapLoaded&&map.getLayer(id)) map.setLayoutProperty(id,"visibility",visible?"visible":"none")}
function set3D(on){
 if(!mapLoaded)return;
 terrainOn=on;
 map.setTerrain(on?{source:"terrain",exaggeration:1.35}:null);
 map.easeTo({pitch:on?58:0,bearing:on?-8:0,duration:900});
 $("#viewMode").textContent=on?"3D 真實地形":"2D 官方底圖";
}
function fitTaiwan(){if(mapLoaded)map.fitBounds([[119.95,21.8],[122.15,25.4]],{padding:35,pitch:terrainOn?58:0,bearing:terrainOn?-8:0,duration:1000})}
function focusRegion(bounds){if(mapLoaded)map.fitBounds(bounds,{padding:60,pitch:terrainOn?58:0,bearing:terrainOn?-8:0,duration:900})}

function selectLine(line,fly=true){
 selected=line; renderList();
 const x=lineInfo(line);
 $("#badgeLine").textContent=x.line; $("#lineTitle").textContent=x.line;
 $("#lineSub").textContent=`${x.line}：以真實 NLSC 地圖、OpenRailwayMap 軌道與 DEM 地形查看空間脈絡`;
 $("#mSlope").textContent=`${x.ch} / ${x.total.toLocaleString()}`; $("#mUtil").textContent=`${x.util.toFixed(1)}%`; $("#mBottle").textContent=x.bottle;
 $("#geoLineName").textContent=x.line; $("#geoBottle").textContent=x.bottle;
 $("#txtPhysical").textContent=x.ch?`此線共有 ${x.total.toLocaleString()} 處邊坡，其中 C高 ${x.ch} 處；地圖上的邊坡點可進一步查看編號、站間、里程與評估說明。`:"目前此線 C高 數量較低，但仍須關注單點風險與相鄰設備。";
 $("#txtOps").textContent=x.util>=85?`最高區間利用率 ${x.util.toFixed(1)}%，事件發生時調度餘裕小，營運影響可能快速擴散。`:x.util>=70?`最高區間利用率 ${x.util.toFixed(1)}%，屬中高營運曝露。`:`最高區間利用率 ${x.util.toFixed(1)}%，營運曝露相對較低。`;
 $("#txtDecision").textContent="空間位置由真實地圖與鐵路圖層提供；事件、邊坡、延誤與容量再透過案例鏈支援工務/行控判讀。";
 const rel=EVENTS.filter(e=>e.line===line).slice(0,3);
 $("#relatedCases").innerHTML=rel.length?rel.map(e=>`<div class="case ${/土石流|落石|泥流/.test(e.type)?"hazard":""}"><b>${e.date}｜${e.title}</b><small>${e.place}｜${e.type}</small><p>${e.desc}</p></div>`).join(""):'<div class="case"><b>目前未綁定代表事件</b><p>可依站間、日期與事件類型繼續擴充案例鏈。</p></div>';
 if(fly&&LINE_BOUNDS[line])focusRegion(LINE_BOUNDS[line]);
 renderChain(); renderLocalCases();
}

function chainDetails(c){return {
 asset:{source:"TRA-03",title:"邊坡資產詳情",record:c.asset,dataset:"TRA-03 邊坡分級與巡檢指標數據",match:"同線別 + 站間 + 里程候選關聯。",evidence:c.assetDesc,boundary:"原始清冊無 GPS 時，地圖點位為沿真實鐵路路廊的展示映射。",primary:"回到地圖",target:"map"},
 event:{source:"TRA-04",title:"歷史異常事件",record:c.event,dataset:"TRA-04 歷史異常事件日誌",match:"同線別 + 站間/地名 + 災害類型。",evidence:c.eventDesc,boundary:"若只有站間資訊，事件點定位到站間中心或鄰近站點。",primary:"查看事件點",target:"map"},
 train:{source:"TRA-08 / TRA-10",title:"受影響列車",record:c.train,dataset:"TRA-08 到離站 + TRA-10 誤點原因",match:"事件日期 + 原因欄 + 車次。",evidence:c.trainDesc,boundary:"僅顯示可由競賽資料重現的車次關聯。",primary:"查看歷史事件",target:"events"},
 delay:{source:"TRA-09",title:"延誤後果",record:c.delay,dataset:"TRA-09 誤點分鐘數",match:"事件日同車次最大到/離站延誤彙整。",evidence:c.delayDesc,boundary:"帶 * 分鐘為系統衍生值，不是官方事故影響分鐘。",primary:"查看營運影響",target:"ops"},
 capacity:{source:"TRA-11",title:"瓶頸容量曝露",record:c.capacity,dataset:"TRA-11 路線利用率",match:"事件所在路線對應容量區段。",evidence:c.capacityDesc,boundary:"利用率衡量調度餘裕，不代表災害機率。",primary:"查看營運影響",target:"ops"},
 action:{source:"Decision Memory",title:"處置與回填",record:c.action,dataset:"歷史處置 + 人工巡檢回填",match:"以歷史處置為參考，由人員確認。",evidence:c.actionDesc,boundary:"系統不自動下達限速、封鎖或復駛命令。",primary:"建立追蹤回填",target:"track"}
}}
function showChainDetail(step){const c=CASE_CHAINS[selected];if(!c)return;const d=chainDetails(c)[step];$$(".chain-node").forEach(n=>n.classList.toggle("selected",n.dataset.step===step));$("#detailSource").textContent=d.source;$("#detailTitle").textContent=d.title;$("#detailStatus").textContent=step==="asset"?"候選匹配":"已關聯";$("#detailRecord").textContent=d.record;$("#detailDataset").textContent=d.dataset;$("#detailMatch").textContent=d.match;$("#detailEvidence").textContent=d.evidence;$("#detailBoundary").textContent=d.boundary;$("#detailPrimary").textContent=d.primary;$("#detailPrimary").dataset.target=d.target}
function renderChain(){const c=CASE_CHAINS[selected];if(!c){$("#chainFlow").innerHTML='<div class="case"><b>目前尚未建立此路線的完整案例鏈</b><p>可先用線別與站間規則做候選匹配。</p></div>';$("#chainRules").innerHTML="<ul><li>尚未綁定路線級規則。</li></ul>";$("#chainDecision").innerHTML="<ul><li>請先建立事件—站間—里程關聯。</li></ul>";$("#detailTitle").textContent="尚無案例鏈";$("#detailRecord").textContent="此路線目前沒有完整的六段資料鏈。";return}const nodes=[["asset","TRA-03 邊坡","邊坡資產",c.asset,c.assetDesc],["event","TRA-04 事件","異常事件",c.event,c.eventDesc],["train","TRA-08/10","受影響列車",c.train,c.trainDesc],["delay","TRA-09","延誤後果",c.delay,c.delayDesc],["capacity","TRA-11","容量曝露",c.capacity,c.capacityDesc],["action","Decision","建議處置",c.action,c.actionDesc]];$("#chainFlow").innerHTML=nodes.map(([step,source,title,record,desc])=>`<button type="button" class="chain-node ${step}" data-step="${step}"><span class="step">${source}</span><h4>${title}</h4><b>${record}</b><p>${desc}</p></button>`).join("");$$(".chain-node").forEach(n=>n.onclick=()=>showChainDetail(n.dataset.step));$("#chainRules").innerHTML=`<ul>${c.rules.map(i=>`<li>${i}</li>`).join("")}</ul>`;$("#chainDecision").innerHTML=`<ul>${c.decision.map(i=>`<li>${i}</li>`).join("")}</ul>`;showChainDetail("asset")}

function renderEvents(){$("#eventGrid").innerHTML=EVENTS.map(e=>`<div class="event-card"><small>${e.date}｜${e.roc}</small><b>${e.title}</b><p>${e.line}｜${e.place}</p><p style="margin-top:6px"><strong>影響：</strong>${e.trains}${e.minutes!=="—"?`｜${e.minutes} 分`:""}${e.passengers!=="—"?`｜${e.passengers} 人`:""}</p><p style="margin-top:6px;color:#6d7e87">${e.note}</p></div>`).join("")}
function renderUtil(){const max=Math.max(...LINES.map(x=>x.util));$("#utilBars").innerHTML=LINES.filter(x=>x.util>30).map(x=>`<div class="bar"><span>${x.line}</span><div class="track"><i class="${x.util>=85?"hot":x.util>=70?"warn":""}" style="width:${x.util/max*100}%"></i></div><b>${x.util.toFixed(1)}%</b></div>`).join("")}
function renderLocalCases(){const arr=getCases().filter(x=>x.line===selected);$("#memoryList").innerHTML=arr.length?arr.slice(0,4).map(c=>`<div class="memory"><b>${new Date(c.time).toLocaleString("zh-TW")}｜${c.outcome}</b><p>${c.note||"無補充說明"}</p></div>`).join(""):'<div class="memory"><b>尚無人工回填</b><p>這裡保留人工巡檢與處置記錄。</p></div>'}

$("#btnSave").onclick=()=>{const arr=getCases();arr.unshift({time:new Date().toISOString(),line:selected,outcome:$("#caseOutcome").value,note:$("#caseNote").value.trim()});saveCaseData(arr);$("#caseNote").value="";toast("已儲存人工回填")};
$("#btnOpenAll").onclick=()=>{const arr=getCases();$("#allCasesBody").innerHTML=arr.length?arr.map(c=>`<div class="memory"><b>${new Date(c.time).toLocaleString("zh-TW")}｜${c.line}｜${c.outcome}</b><p>${c.note||"無補充說明"}</p></div>`).join(""):'<p style="color:#6e818d">尚無人工回填案件。</p>';$("#allCasesModal").classList.add("open")};
$("#btnCloseAll").onclick=()=>$("#allCasesModal").classList.remove("open");
$("#pointInspectorClose").onclick=()=>$("#pointInspector").hidden=true;
$("#btnTerrain").onclick=()=>{set3D(true);focusRegion([[121.55,23.9],[121.95,24.7]]);toast("已切換 3D 地形並聚焦東部")};
$("#btnDemo").onclick=()=>{selectLine("北迴線",true);set3D(true);document.querySelector("#chainBlock").scrollIntoView({behavior:"smooth",block:"start"});toast("已切換北迴線真實地圖與案例鏈")};
$("#btnReset").onclick=fitTaiwan; $("#btnResetCamera").onclick=fitTaiwan;
$("#btnTopView").onclick=()=>set3D(false); $("#btnPerspective").onclick=()=>set3D(true);
$("#btnFocusNorth").onclick=()=>focusRegion([[121.45,24.70],[122.00,25.30]]);
$("#btnFocusEast").onclick=()=>focusRegion([[121.25,22.60],[122.00,24.70]]);
$("#btnShowChain").onclick=()=>document.querySelector("#chainBlock").scrollIntoView({behavior:"smooth",block:"start"});
$("#btnShowOps").onclick=()=>document.querySelector("#utilBars").scrollIntoView({behavior:"smooth",block:"center"});
$("#layerRoutes").onchange=e=>setLayerVisible("railway-overlay",e.target.checked);
$("#layerEvents").onchange=e=>setLayerVisible("events",e.target.checked);
$("#layerSlopes").onchange=e=>setLayerVisible("slopes",e.target.checked);
$("#layerHeat").onchange=e=>setLayerVisible("risk-heat",e.target.checked);
$("#layerStations").onchange=e=>setLayerVisible("stations",e.target.checked);
$("#detailPrimary").onclick=()=>{const t=$("#detailPrimary").dataset.target;if(t==="map")document.querySelector(".scene-panel").scrollIntoView({behavior:"smooth",block:"start"});else if(t==="events")document.querySelector("#eventGrid").scrollIntoView({behavior:"smooth",block:"center"});else if(t==="ops")document.querySelector("#utilBars").scrollIntoView({behavior:"smooth",block:"center"});else{$("#caseNote").focus();document.querySelector(".detail-panel").scrollIntoView({behavior:"smooth",block:"start"})}};
$("#detailTrack").onclick=()=>{$("#caseNote").focus();document.querySelector(".detail-panel").scrollIntoView({behavior:"smooth",block:"start"});toast("請填寫人工巡檢或處置回填")};

renderList();renderEvents();renderUtil();selectLine("縱貫線",false);initMap();
