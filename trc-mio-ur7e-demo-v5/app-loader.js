(async()=>{
  const parts=[
    './chunks/v5-1.part','./chunks/v5-2.part','./chunks/v5-3.part','./chunks/v5-4.part',
    './chunks/v5-5.part','./chunks/v5-6.part','./chunks/v5-7.part','./chunks/v5-8.part'
  ];
  const code=(await Promise.all(parts.map(async u=>{const r=await fetch(u,{cache:'no-store'});if(!r.ok)throw new Error(u+' '+r.status);return r.text()}))).join('');
  const url=URL.createObjectURL(new Blob([code],{type:'text/javascript'}));
  try{await import(url)}finally{setTimeout(()=>URL.revokeObjectURL(url),1000)}
})().catch(e=>{console.error(e);const el=document.getElementById('loading');if(el)el.innerHTML='<b>APP 載入失敗</b><small>'+e.message+'</small>'});
