const fs=require('fs');
const s=fs.readFileSync('teukgeom.html','utf8');
const hi=s.indexOf('</header>');
const head=s.slice(0,hi), body=s.slice(hi);
const esc=t=>t.replace(/[.*+?^${}()|[\]\]/g,'\$&');
for(const pat of ['st-row','gt-wrap','gt-top','global-tab','tablist','data-g=']){
  console.log(pat,'| in header:',(head.match(new RegExp(esc(pat),'g'))||[]).length,'| below header:',(body.match(new RegExp(esc(pat),'g'))||[]).length);
}
let idx=body.indexOf('st-row');
if(idx>-1) console.log('below st-row ctx:',body.slice(idx-150,idx+150).replace(/\s+/g,' '));
const f=s.lastIndexOf('<footer');
console.log('footer ctx:',f>-1?s.slice(f,f+300).replace(/\s+/g,' '):'none');
