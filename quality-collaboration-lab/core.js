/* Quality Collaboration Lab — MIT; educational reference logic, not production control. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.QualityLab=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const VERSION='2026.11-teaching.1';
const source={value:'0.5',unit:'μm',operator:'≥',state:'present',approved:true,revision:'A-03',output:'5',kind:'suggest_value'};
const scenarios=[
{id:'valid',name:'01 條件相符',description:'來源修正與目前要求的數值、單位、運算子與狀態相符。',target:{...source}},
{id:'operator',name:'02 上限與下限不同',description:'來源是 ≥；目前要求是 ≤。數字相同不表示工程意義相同。',target:{...source,operator:'≤'}},
{id:'conflict',name:'03 內容仍有衝突',description:'目前圖面的候選內容仍在衝突狀態，不能用既有建議掩蓋待釐清事項。',target:{...source,state:'conflict'}},
{id:'pending',name:'04 尚待決策',description:'目前要求尚未完成決策；已有數值不等於已有結論。',target:{...source,state:'pending_decision'}},
{id:'withdrawn',name:'05 來源核准撤回',description:'來源不再有效時，新的建議應停止；這不代表已採納資料全部自動回滾。',target:{...source},sourceApproved:false},
{id:'unit',name:'06 單位不同',description:'來源使用 μm，目標使用 mm；不能直接複製數字。',target:{...source,unit:'mm'}},
{id:'geometry',name:'07 證據框調整',description:'來源的幾何框只作人工參考，不能直接複製到另一張圖。',target:{...source},kind:'review_evidence'}
];
function evaluateReuse(id,policy={operator:true,state:true,source:true}){
 const s=scenarios.find(x=>x.id===id);if(!s)throw new Error('未知的教學情境');
 const checks=[{id:'value',label:'原始值相符',enabled:true,pass:s.target.value===source.value},{id:'unit',label:'單位相符',enabled:true,pass:s.target.unit===source.unit},{id:'source',label:'來源核准仍有效',enabled:!!policy.source,pass:s.sourceApproved!==false},{id:'operator',label:'比較運算子相符',enabled:!!policy.operator,pass:s.target.operator===source.operator},{id:'state',label:'目標內容已存在且無衝突',enabled:!!policy.state,pass:s.target.state==='present'}];
 const referenceOnly=s.kind==='review_evidence';const blocked=checks.some(c=>c.enabled&&!c.pass);
 return {scenario:id,evidence_kind:'synthetic_teaching_rule',checks,allowed:!blocked&&!referenceOnly,referenceOnly:!blocked&&referenceOnly,reasons:checks.filter(c=>c.enabled&&!c.pass).map(c=>c.label),uncheckedRisks:checks.filter(c=>!c.enabled&&!c.pass).map(c=>c.label),target:{...s.target},source:{...source,approved:s.sourceApproved!==false},policy:{...policy}};
}
function adopt(result){if(!result||!result.allowed)throw new Error('沒有可採納建議');return{value:source.output,unit:source.unit,operator:result.target.operator,content_state:'present',review_status:'needs_review',support_verified:false,original_content_state:result.target.state,original_operator:result.target.operator,version_delta:1,approved:false,evidence_kind:'synthetic_teaching_adoption'};}
const motionScenarios={normal:{name:'正常通行',on:99,off:100,obstacle:330},early:{name:'及早闖入後離開',on:2.5,off:4.6,obstacle:330},late:{name:'過晚才出現的障礙',on:3.75,off:5.2,obstacle:330},persistent:{name:'持續佔區',on:2.5,off:99,obstacle:330}};
function simulateMotion(spec,gate=true,latency=0.15){
 if(typeof spec==='string')spec=motionScenarios[spec];if(!spec)throw new Error('未知情境');
 if(!Number.isFinite(latency)||latency<0||latency>2)throw new Error('延遲超出教學範圍');
 const dt=.025,speed=70,accel=180,goal=600,radius=18,maxT=14;let x=60,v=speed,status='timeout',unsafe=false,wait=0,interventions=0,prevBrake=false;const trace=[];
 for(let k=0;k<=Math.round(maxT/dt);k++){
  const t=+(k*dt).toFixed(3),active=t>=spec.on&&t<spec.off;
  const detected=active&&t>=spec.on+latency;const ahead=spec.obstacle>=x-radius;
  const brake=gate&&detected&&ahead;
  if(brake&&!prevBrake)interventions++;prevBrake=brake;
  if(k>0){v=Math.max(0,Math.min(speed,v+(brake?-accel:accel)*dt));x+=v*dt;}
  if(brake&&v<1)wait+=dt;
  const collision=active&&Math.abs(x-spec.obstacle)<=radius;
  trace.push({t,x:+x.toFixed(2),v:+v.toFixed(2),active,detected,brake,collision});
  if(collision){unsafe=true;status='unsafe_event';break;}if(x>=goal){status='success';break;}
 }
 return{evidence_kind:'synthetic_2d_teaching_model',model_version:VERSION,gate,latency,spec:{...spec},status,unsafe,time:trace.at(-1).t,wait:+wait.toFixed(3),interventions,trace,units:'screen pixels and teaching seconds; not engineering control parameters'};
}
function seeded(seed){let s=seed>>>0;return()=>{s=(s+0x6D2B79F5)|0;let t=Math.imul(s^s>>>15,1|s);t^=t+Math.imul(t^t>>>7,61|t);return((t^t>>>14)>>>0)/4294967296;};}
function pairedBatch(seed=20261113,n=24,latency=.15){
 if(!Number.isSafeInteger(seed)||seed<0||seed>4294967295)throw new Error('種子須為 0–4294967295 整數');if(!Number.isInteger(n)||n<1||n>1000)throw new Error('無效批次大小');
 const random=seeded(seed),kinds=Object.keys(motionScenarios),rows=[];
 for(let i=0;i<n;i++){const kind=kinds[Math.floor(random()*kinds.length)];const base=motionScenarios[kind];const jitter=(random()-.5)*.35;const spec={...base,on:base.on+jitter,off:base.off+jitter};const a=simulateMotion(spec,true,latency),b=simulateMotion(spec,false,latency);rows.push({scenario_id:`T${String(i+1).padStart(2,'0')}`,kind,spec,with_gate:{status:a.status,time:a.time,unsafe:a.unsafe,interventions:a.interventions},without_gate:{status:b.status,time:b.time,unsafe:b.unsafe,interventions:b.interventions}});}
 const counts={both_success:0,gate_only:0,no_gate_only:0,both_not_success:0};for(const r of rows){let a=r.with_gate.status==='success',b=r.without_gate.status==='success';counts[a?(b?'both_success':'gate_only'):(b?'no_gate_only':'both_not_success')]++;}
 const summarize=key=>({success:rows.filter(r=>r[key].status==='success').length,unsafe:rows.filter(r=>r[key].unsafe).length,timeout:rows.filter(r=>r[key].status==='timeout').length,mean_all_attempt_time:rows.reduce((s,r)=>s+r[key].time,0)/n});
 return{evidence_kind:'synthetic_teaching_paired_batch',seed,n,latency,independent_human_sample:false,rows,counts,with_gate:summarize('with_gate'),without_gate:summarize('without_gate'),time_definition:'All attempted teaching scenarios; collision terminates early and timeout=14. Raw time is not quality-adjusted productivity.'};
}
const historical={evidence_kind:'reported_historical_physics_simulation_summary',source_date:'2026-11-02',n_per_condition:300,raw_paired_data_included:false,controller:'RRT-Connect; not PPO',conditions:[{name:'分布內',rows:[['A',78.3,17.0,13.3],['B',78.3,17.0,13.8],['C',92.0,2.7,17.4],['D',92.0,2.7,16.9],['E',78.3,17.0,13.4]]},{name:'影像偏移',rows:[['A',78.0,17.3,13.3],['B',78.0,17.3,18.0],['C',92.0,2.7,21.6],['D',92.0,2.7,17.6],['E',78.0,17.3,14.1]]}],time_denominator:'not independently verified in this teaching package'};
function deploymentCheck(options={}){
 const o={environment:'clean',scope:'all',coverAll:false,portable:false,versionAligned:false,corrupt:false,strictIntegrity:true,...options};
 if(!['clean','developer'].includes(o.environment)||!['all','legacy'].includes(o.scope))throw new Error('無效部署條件');
 const rows=[];
 for(let id=1;id<=28;id++){
  const selected=o.scope==='all'||id<=9;if(!selected)continue;
  const name=id===20?'SBAR 跨團隊溝通（示意）':`${id<=9?'新版':'舊版'}教案 ${String(id).padStart(2,'0')}`;
  const missingSeed=o.environment==='clean'&&id>=21&&id<=27&&!o.portable;
  let status='ready',reason='來源配對與檔案檢查通過';
  if(missingSeed){status='missing_structure';reason='新機沒有這份教案結構；開發者本機資料造成隱藏依賴';}
  else if(id>9&&!o.coverAll){status='unpublished';reason='使用者可選到，但原發布計畫未包含';}
  else if(id===20&&!o.versionAligned){status='source_mismatch';reason='原始教案與執行期調適快照的版本指紋不同';}
  else if(id===12&&o.corrupt){status=o.strictIntegrity?'corrupt_media':'false_ready';reason=o.strictIntegrity?'已攔截損毀媒體；校驗不能自行修好檔案':'僅檢查存在會誤宣告可播；檔案其實損毀';}
  rows.push({id,name,status,reason,claimedPlayable:status==='ready'||status==='false_ready',actualPlayable:status==='ready'});
 }
 return{evidence_kind:'synthetic_deployment_fixture',options:o,rows,checked:rows.length,claimed:rows.filter(x=>x.claimedPlayable).length,actual:rows.filter(x=>x.actualPlayable).length,totalReachable:28,scopeComplete:rows.length===28,releaseAccepted:rows.length===28&&rows.every(x=>x.status==='ready')};
}
function percent(x,n){return n?`${(100*x/n).toFixed(1)}%`:'—';}
return{VERSION,source,scenarios,evaluateReuse,adopt,motionScenarios,simulateMotion,pairedBatch,historical,deploymentCheck,percent};
});
