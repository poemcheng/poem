(async()=>{
 const parts=['./appchunks/core-01.part','./appchunks/core-02.part','./appchunks/core-03.part','./appchunks/core-04.part','./appchunks/core-05.part','./appchunks/core-06.part','./appchunks/core-07.part','./appchunks/core-08.part'];
 const code=(await Promise.all(parts.map(async u=>{const r=await fetch(u,{cache:'no-store'});if(!r.ok)throw new Error(u+' '+r.status);return r.text()}))).join('');
 const url=URL.createObjectURL(new Blob([code],{type:'text/javascript'}));
 try{await import(url)}finally{setTimeout(()=>URL.revokeObjectURL(url),1000)}
})().catch(e=>{console.error(e);const el=document.getElementById('loading');if(el)el.innerHTML='<b>APP 載入失敗</b><small>'+e.message+'</small>'});
