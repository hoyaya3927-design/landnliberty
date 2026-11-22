const fs=require('fs');
const log=[];
const rd=p=>fs.readFileSync(p,'utf8');
const wr=(p,s)=>fs.writeFileSync(p,s,'utf8');
const bk=p=>{const b=p+'.bak-20261123'; if(!fs.existsSync(b)) fs.copyFileSync(p,b);};
const cnt=(s,t)=>s.split(t).length-1;

const DUP=/\n\(function\(\)\{\n\s*var f=document\.getElementById\('join-form'\); if\(!f\) return;\n[\s\S]*?\n\}\)\(\);\n(?=<\/script>)/;
for(const fn of ['index.html','policy.html','salriki.html']){
  if(!fs.existsSync(fn)){log.push('SKIP missing '+fn);continue;}
  let s=rd(fn); const m=s.match(DUP);
  if(!m){log.push('SKIP no-dup-block '+fn);continue;}
  if(!m[0].includes('lf_emails_v1')){log.push('SKIP unexpected-block '+fn);continue;}
  bk(fn);
  let s2=s.replace(DUP,'\n');
  const g1="e.preventDefault();\n      const email = document.getElementById('join-email').value.trim();";
  const g1n="e.preventDefault();\n      if (joinBusy) return;\n      const email = document.getElementById('join-email').value.trim();";
  if(cnt(s2,g1)===1 && cnt(s2,"    form.addEventListener('submit', async (e) => {")===1){
    s2=s2.replace(g1,g1n);
    s2=s2.replace("    form.addEventListener('submit', async (e) => {","    let joinBusy = false;\n    form.addEventListener('submit', async (e) => {");
    if(cnt(s2,"submitBtn.disabled = false;")===1){
      s2=s2.replace("submitBtn.disabled = false;","submitBtn.disabled = false;\n      joinBusy = false;");
    }
    log.push('GUARD added '+fn);
  } else { log.push('WARN guard-skipped '+fn); }
  wr(fn,s2); log.push('FIXED dup-submit '+fn);
}

const OLD_ROUTE=`  function routeIndex(){
    var h=(location.hash||'').toLowerCase();
    if(h.indexOf('salriki')>-1) return 2;
    if(h.indexOf('join')>-1) return 3;
    return 0;
  }`;
const NEW_ROUTE=`  function routeIndex(){
    var h=(location.hash||'').toLowerCase();
    var p=(location.pathname||'').toLowerCase();
    if(h.indexOf('salriki')>-1) return 2;
    if(h.indexOf('join')>-1) return 3;
    /* \uC790\uC720(Liberty) \uC139\uC158 \uD398\uC774\uC9C0\uB294 \uD558\uB2E8 \uD0ED\uC5D0\uC11C '\uC790\uC720 Liberty'\uAC00 \uC790\uB3D9 \uC120\uD0DD */
    if(/(teukgeom|liberty|liberty-report|liberty-archive|forensic)\.html$/.test(p)) return 1;
    return 0;
  }`;
for(const fn of ['teukgeom.html','liberty.html','liberty-report.html','liberty-archive.html','forensic.html']){
  if(!fs.existsSync(fn)){log.push('SKIP missing '+fn);continue;}
  let s=rd(fn);
  if(!s.includes(OLD_ROUTE)){log.push('SKIP no-routeIndex '+fn);continue;}
  bk(fn); wr(fn,s.replace(OLD_ROUTE,NEW_ROUTE)); log.push('FIXED dock-route '+fn);
}

const D='2026.11.23';
const edits={
 'teukgeom.html':[['<span>기준일 <b>2026.11.20 (금) 04:56 KST</b></span>','<span>기준일 <b>2026.11.20 (금) 04:56 KST</b> · 갱신 <b>'+D+' (월)</b></span>']],
 'liberty-report.html':[['<span>기준 2026. 11. 20. 04:56 KST</span>','<span>기준 2026. 11. 20. 04:56 KST · 갱신 2026. 11. 23.</span>']],
 'liberty-archive.html':[['EVIDENCE DOSSIER / 2026.11.20 기준','EVIDENCE DOSSIER / 2026.11.20 기준 · 갱신 '+D],
   ['기준 2026. 11. 20. 05:00 KST · 편집·구성 자체 제작','기준 2026. 11. 20. 05:00 KST · 갱신 2026. 11. 23. · 편집·구성 자체 제작']],
 'forensic.html':[['<span>60초마다 자동 확인</span>','<span>60초마다 자동 확인 · 페이지 갱신 '+D+'</span>']]
};
for(const fn in edits){
  if(!fs.existsSync(fn)){log.push('SKIP missing '+fn);continue;}
  let s=rd(fn),n=0;
  for(const [o,w] of edits[fn]){
    const c=cnt(s,o); if(!c){log.push('WARN no-match '+fn+' :: '+o.slice(0,24));continue;}
    s=s.split(o).join(w); n+=c;
  }
  if(n){bk(fn); wr(fn,s); log.push('FIXED date-stamp '+fn+' ('+n+')');}
}
console.log(log.join('\n'));
