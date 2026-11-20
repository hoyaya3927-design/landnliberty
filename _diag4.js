const fs=require('fs');
const idx=fs.readFileSync('index.html','utf8');
// 1. index header block
const h0=idx.indexOf('<header id="site-header"');
const h1=idx.indexOf('</header>',h0)+9;
const header=idx.slice(h0,h1);
// 2. rows: links per data-g
for(const m of header.matchAll(/<div class="st-row[^"]*"[^>]*data-g="([^"]+)"[^>]*>([\s\S]*?)<\/div>/g)){
  const links=[...m[2].matchAll(/href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].map(x=>x[1]+' | '+x[2].replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim());
  console.log('ROW '+m[1]+':'); links.forEach(l=>console.log('   '+l));
}
// 3. big tabs labels+href
for(const m of header.matchAll(/<a[^>]*class="gt[^"]*"[^>]*>([\s\S]*?)<\/a>/g)){
  console.log('BIGTAB: '+m[1].replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim());
}
// 4. where target files are referenced in index
for(const f of ['teukgeom.html','assembly-reset.html','nec-reform.html','dday-teukgeom.html']){
  let at=-1,cnt=0; while((at=idx.indexOf(f,at+1))!==-1){cnt++; if(cnt<=4) console.log('IDX REF '+f+' @'+at+': ...'+idx.slice(Math.max(0,at-120),at+40).replace(/\s+/g,' ')+'...');}
  console.log('IDX REF '+f+' total='+cnt);
}
// 5. CSS block windows in index containing gt-shell
const blocks=[...idx.matchAll(/<style[^>]*>/g)].map(m=>m.index);
console.log('style block starts: '+JSON.stringify(blocks));
blocks.forEach((b,i)=>{
  const end=idx.indexOf('</style>',b);
  const seg=idx.slice(b,end);
  const has={gt:seg.includes('.gt-shell{'),mm:seg.includes('#mobile-menu'),st:seg.includes('.st-wrap{'),hdr:seg.includes('#site-header')};
  console.log('block#'+i+' @'+b+' len='+(end-b)+' '+JSON.stringify(has)+' tail='+JSON.stringify(seg.slice(-80)));
});
// 6. does salriki header == index header (ignoring is-on/hidden/aria)?
function norm(s){return s.replace(/ is-on/g,'').replace(/ hidden/g,'').replace(/aria-selected="(true|false)"/g,'').replace(/aria-expanded="(true|false)"/g,'').replace(/\s+/g,' ');}
const sal=fs.readFileSync('salriki.html','utf8');
const s0=sal.indexOf('<header id="site-header"');const s1=sal.indexOf('</header>',s0)+9;
console.log('header equal(ignore-active): '+(norm(idx.slice(h0,h1))===norm(sal.slice(s0,s1))));
console.log('idx header len='+header.length+' sal header len='+(s1-s0));
// 7. CSS diff: extract the gt css window from each and compare
function cssWin(s){const b=s.indexOf('.gt-shell{'); if(b<0)return 'NONE'; const e=s.indexOf('@media(prefers-reduced-motion',b); return s.slice(b, e<0? b+3000: e+400);}
console.log('css window equal: '+(cssWin(idx)===cssWin(sal)));
// 8. teukgeom header size for replacement planning
const tg=fs.readFileSync('teukgeom.html','utf8');
const t0=tg.indexOf('<header id="site-header"');const t1=tg.indexOf('</header>',t0)+9;
console.log('teukgeom header @'+t0+'..'+t1+' len='+(t1-t0));
const ts=[...tg.matchAll(/<style[^>]*>/g)].map(m=>m.index);
ts.forEach((b,i)=>{const e=tg.indexOf('</style>',b);const seg=tg.slice(b,e);console.log('tg block#'+i+' @'+b+' len='+(e-b)+' gt='+seg.includes('.gt-shell{')+' mm='+seg.includes('#mobile-menu')+' tail='+JSON.stringify(seg.slice(-60)));});
// teukgeom rows
const tgh=tg.slice(t0,t1);
for(const m of tgh.matchAll(/<div class="st-row[^"]*"[^>]*data-g="([^"]+)"[^>]*>([\s\S]*?)<\/div>/g)){
  const links=[...m[2].matchAll(/href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].map(x=>x[1]+' | '+x[2].replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim());
  console.log('TG ROW '+m[1]+':'); links.forEach(l=>console.log('   '+l));
}
// where does teukgeom.html link itself in its own nav (is-on)
const onm=tgh.match(/<a[^>]*class="[^"]*is-on[^"]*"[^>]*>([\s\S]*?)<\/a>/g);
console.log('tg is-on els: '+JSON.stringify(onm&&onm.map(x=>x.replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim())));
