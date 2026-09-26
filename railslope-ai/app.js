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

const STORE_KEY='railslope_enterprise_cases_v2';
let selected='縱貫線';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
function toast(txt){const t=$('#toast');t.textContent=txt;t.classList.add('show');clearTimeout(t._);t._=setTimeout(()=>t.classList.remove('show'),2400)}
function getCases(){try{return JSON.parse(localStorage.getItem(STORE_KEY)||'[]')}catch{return[]}}
function saveCaseData(arr){localStorage.setItem(STORE_KEY,JSON.stringify(arr));renderLocalCases()}
function level(att){return att==='high'?'高關注':att==='mid'?'注意':'一般'}
function renderList(){const data=[...LINES].sort((a,b)=>(b.ch*1.2+b.util)-(a.ch*1.2+a.util));$('#lineList').innerHTML=data.map(x=>`<button class="row ${x.line===selected?'active':''}" data-line="${x.line}"><div class="top"><b>${x.line}</b><span class="level ${x.attention}">${level(x.attention)}</span></div><div class="meta"><span>邊坡 ${x.total.toLocaleString()}</span><span>C高 ${x.ch}</span><span>最高利用率 ${x.util.toFixed(1)}%</span></div></button>`).join('');$$('#lineList .row').forEach(b=>b.onclick=()=>selectLine(b.dataset.line));}
function routeSelect(line){$$('[data-line]').forEach(el=>el.classList.toggle('selected',el.dataset.line===line));}
function selectLine(line){selected=line;renderList();routeSelect(line);const x=LINES.find(v=>v.line===line)||LINES[0];$('#badgeLine').textContent=x.line;$('#lineTitle').textContent=x.line;$('#mSlope').textContent=`${x.ch} / ${x.total.toLocaleString()}`;$('#mUtil').textContent=`${x.util.toFixed(1)}%`;$('#mBottle').textContent=x.bottle;$('#txtPhysical').textContent = x.ch?`此線共有 ${x.total.toLocaleString()} 處邊坡，其中 C高 ${x.ch} 處；畫面保留臺鐵官方分級，並進一步將其與事件與列車後果串接。`:`目前此線 C高 數量較低，但仍須關注單點風險與相鄰設備。`;$('#txtOps').textContent = x.util>=85?`此線最高區間利用率為 ${x.util.toFixed(1)}%，若發生阻斷或慢行，調度餘裕很小，營運影響可能快速擴散。`:x.util>=70?`此線最高區間利用率為 ${x.util.toFixed(1)}%，屬中高營運曝露，需同時考慮資產風險與營運承載。`:`此線最高區間利用率為 ${x.util.toFixed(1)}%，相較高利用率幹線，營運影響擴散相對有限。`;$('#txtDecision').textContent='不直接給一個黑箱風險分數，而是讓使用者沿著「邊坡→事件→列車→延誤→容量→處置」案例鏈做判讀。';const rel=EVENTS.filter(e=>e.line===line).slice(0,3);$('#relatedCases').innerHTML=rel.length?rel.map(e=>`<div class="case ${/土石流|落石|泥流/.test(e.type)?'hazard':''}"><b>${e.date}｜${e.title}</b><small>${e.place}｜${e.type}</small><p>${e.desc}</p></div>`).join(''):'<div class="case"><b>目前未綁定代表事件</b><p>正式版可依里程、站間與事件類型，自動回叫對應的 TRA-04 事件與 TRA-08/09/10 行車後果。</p></div>';renderChain();renderLocalCases();}
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
$('#btnDemo').onclick=()=>{selectLine('北迴線');document.querySelector('#chainBlock').scrollIntoView({behavior:'smooth',block:'start'});toast('已切換到北迴線案例鏈')};
$('#btnReset').onclick=()=>selectLine('縱貫線');
$('#btnShowChain').onclick=()=>document.querySelector('#chainBlock').scrollIntoView({behavior:'smooth',block:'start'});
$('#btnShowOps').onclick=()=>document.querySelectorAll('.block')[2]?.scrollIntoView({behavior:'smooth',block:'start'});
$$('[data-line]').forEach(el=>el.onclick=()=>selectLine(el.dataset.line));

$('#detailPrimary').onclick=()=>{const t=$('#detailPrimary').dataset.target;if(t==='events'){document.querySelector('#eventGrid').scrollIntoView({behavior:'smooth',block:'center'});}else if(t==='ops'){document.querySelector('#utilBars').scrollIntoView({behavior:'smooth',block:'center'});}else if(t==='track'){document.querySelector('#caseNote').focus();document.querySelector('.detail-panel').scrollIntoView({behavior:'smooth',block:'start'});}else{document.querySelector('.layout').scrollIntoView({behavior:'smooth',block:'start'});}};
$('#detailTrack').onclick=()=>{document.querySelector('#caseNote').focus();document.querySelector('.detail-panel').scrollIntoView({behavior:'smooth',block:'start'});toast('請填寫人工巡檢或處置回填');};
renderList(); renderEvents(); renderUtil(); selectLine('縱貫線');