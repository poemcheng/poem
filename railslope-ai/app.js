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
 {id:"e1",date:"2026/05/04",roc:"115年 0504-1 / 0504-4",line:"北迴線",place:"宜蘭－和平站間",type:"地震",title:"宜蘭南方地震，北迴線受影響",desc:"TRA-04 記錄兩起天然災變；TRA-08/09/10 同日可見「天然災變(地震)」原因標記。",trains:"22",minutes:"748*",passengers:"—",note:"* 748 分為系統衍生值：受影響車次各取當日最大延誤後加總。"},
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
const STORE_KEY='railslope_enterprise_cases_v1';
let selected='縱貫線';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
function toast(txt){const t=$('#toast');t.textContent=txt;t.classList.add('show');clearTimeout(t._);t._=setTimeout(()=>t.classList.remove('show'),2200)}
function getCases(){try{return JSON.parse(localStorage.getItem(STORE_KEY)||'[]')}catch{return[]}}
function saveCaseData(arr){localStorage.setItem(STORE_KEY,JSON.stringify(arr));renderLocalCases()}
function level(att){return att==='high'?'高關注':att==='mid'?'注意':'一般'}
function renderList(){const data=[...LINES].sort((a,b)=>(b.ch*1.2+b.util)-(a.ch*1.2+a.util));$('#lineList').innerHTML=data.map(x=>`<button class="row ${x.line===selected?'active':''}" data-line="${x.line}"><div class="top"><b>${x.line}</b><span class="level ${x.attention}">${level(x.attention)}</span></div><div class="meta"><span>邊坡 ${x.total.toLocaleString()}</span><span>C高 ${x.ch}</span><span>最高利用率 ${x.util.toFixed(1)}%</span></div></button>`).join('');$$('#lineList .row').forEach(b=>b.onclick=()=>selectLine(b.dataset.line));}
function selectLine(line){selected=line;renderList();$$('[data-line]').forEach(el=>el.classList.toggle('selected',el.dataset.line===line));const x=LINES.find(v=>v.line===line)||LINES[0];$('#badgeLine').textContent=x.line;$('#lineTitle').textContent=x.line;$('#mSlope').textContent=`${x.ch} / ${x.total.toLocaleString()}`;$('#mUtil').textContent=`${x.util.toFixed(1)}%`;$('#mBottle').textContent=x.bottle;$('#txtPhysical').textContent = x.ch?`此線共有 ${x.total.toLocaleString()} 處邊坡，其中 C高 ${x.ch} 處；保留臺鐵官方分級，不將其改寫為 AI 機率。`:`目前此線 C高 數量低，但仍須關注單點風險與相鄰設備。`;$('#txtOps').textContent = x.util>=85?`此線最高區間利用率為 ${x.util.toFixed(1)}%，若發生阻斷或慢行，調度餘裕較小，營運影響可能放大。`:x.util>=70?`此線最高區間利用率為 ${x.util.toFixed(1)}%，屬中高營運曝露。`:`此線最高區間利用率為 ${x.util.toFixed(1)}%，相較高利用率幹線，營運影響擴散相對有限。`;$('#txtDecision').textContent='先確認事件位置與邊坡關聯，再結合歷史案例與利用率評估是否需要工務/行控同步處置；避免用單一 AI 分數覆蓋專業判讀。';const rel=EVENTS.filter(e=>e.line===line).slice(0,3);$('#relatedCases').innerHTML=rel.length?rel.map(e=>`<div class="case ${/土石流|落石|泥流/.test(e.type)?'hazard':''}"><b>${e.date}｜${e.title}</b><small>${e.place}｜${e.type}</small><p>${e.desc}</p></div>`).join(''):'<div class="case"><b>目前未綁定相似案例</b><p>正式版可依里程、車站區間與事件類型自動回叫相似事件。</p></div>';renderLocalCases();}
function renderEvents(){ $('#eventGrid').innerHTML = EVENTS.slice(0,6).map(e=>`<div class="event-card"><small>${e.date}｜${e.roc}</small><b>${e.title}</b><p>${e.line}｜${e.place}</p><p style="margin-top:6px"><strong>影響：</strong>${e.trains}${e.minutes!=='—'?`｜${e.minutes} 分`:''}${e.passengers!=='—'?`｜${e.passengers} 人`:''}</p></div>`).join(''); }
function renderUtil(){const max=Math.max(...UTIL.map(x=>x[1]));$('#utilBars').innerHTML=UTIL.map(([line,v])=>`<div class="bar"><span>${line}</span><div class="track"><i class="${v>=85?'hot':v>=70?'warn':''}" style="width:${(v/max*100).toFixed(1)}%"></i></div><b>${v.toFixed(1)}%</b></div>`).join('');}
function renderLocalCases(){const arr=getCases().filter(x=>x.line===selected);$('#memoryList').innerHTML=arr.length?arr.slice(0,4).map(c=>`<div class="memory"><b>${new Date(c.time).toLocaleString('zh-TW')}｜${c.outcome}</b><p>${c.note||'無補充說明'}</p></div>`).join(''):'<div class="memory"><b>尚無人工回填</b><p>這裡保留的是人工巡檢回填，不是生成式 AI 對話紀錄。</p></div>'}
$('#btnSave').onclick=()=>{const arr=getCases();arr.unshift({time:new Date().toISOString(),line:selected,outcome:$('#caseOutcome').value,note:$('#caseNote').value.trim()});saveCaseData(arr);$('#caseNote').value='';toast('已儲存人工回填')};
$('#btnOpenAll').onclick=()=>{const arr=getCases();$('#allCasesBody').innerHTML=arr.length?arr.map(c=>`<div class="memory"><b>${new Date(c.time).toLocaleString('zh-TW')}｜${c.line}｜${c.outcome}</b><p>${c.note||'無補充說明'}</p></div>`).join(''):'<p style="color:#6e818d">尚無人工回填案件。</p>';$('#allCasesModal').classList.add('open')};
$('#btnCloseAll').onclick=()=>$('#allCasesModal').classList.remove('open');
$('#btnTerrain').onclick=()=>$('#terrainModal').classList.add('open'); $('#btnCloseTerrain').onclick=()=>$('#terrainModal').classList.remove('open');
$('#btnDemo').onclick=()=>{selectLine('北迴線');toast('已切換到北迴線：可查看其地震與豪雨土石流案例。')};
$('#btnReset').onclick=()=>selectLine('縱貫線');
$('#btnShowEvents').onclick=()=>document.querySelector('.block').scrollIntoView({behavior:'smooth',block:'start'});
$('#btnShowOps').onclick=()=>document.querySelectorAll('.block')[1].scrollIntoView({behavior:'smooth',block:'start'});
renderList(); selectLine('縱貫線'); renderEvents(); renderUtil();