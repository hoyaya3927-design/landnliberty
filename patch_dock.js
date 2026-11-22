const fs = require('fs');

const FILES = ['index.html','policy.html','liberty.html','teukgeom.html','salriki.html','jojakkiso_teukgeom_factsheet.html'];

const NEW = `  var DOCK_GROUP={};
  DOCK_GROUP['teukgeom.html']='lib';
  DOCK_GROUP['liberty.html']='lib';
  DOCK_GROUP['liberty-report.html']='lib';
  DOCK_GROUP['liberty-archive.html']='lib';
  DOCK_GROUP['forensic.html']='lib';
  DOCK_GROUP['salriki.html']='sal';
  DOCK_GROUP['jojakkiso_teukgeom_factsheet.html']='joz';
  DOCK_GROUP['jozakkiso_teukgeom_factsheet.html']='joz';
  DOCK_GROUP['assembly-reset.html']='rst';
  DOCK_GROUP['index.html']='land';
  DOCK_GROUP['policy.html']='land';
  DOCK_GROUP['land-dividend-manifesto.html']='land';
  function dockFind(key){
    for(var k=0;k<dl.length;k++){
      var hr=(dl[k].getAttribute('href')||'').toLowerCase();
      if(hr.indexOf(key)>-1) return k;
    }
    return -1;
  }
  function routeIndex(){
    var p=(location.pathname||'').split('/').pop().toLowerCase()||'index.html';
    var h=(location.hash||'').toLowerCase();
    var ix=-1;
    if(h.indexOf('join')>-1) ix=dockFind('join');
    if(ix<0) ix=dockFind(p);
    if(ix<0){
      var g=DOCK_GROUP[p]||'land';
      if(g==='lib') ix=dockFind('liberty.html');
      else if(g==='sal') ix=dockFind('salriki');
      else if(g==='joz') ix=dockFind('jojakkiso');
      else if(g==='rst') ix=dockFind('assembly-reset');
      else ix=dockFind('#/');
    }
    return ix<0?0:ix;
  }
`;

const A = '  function routeIndex(){';
const B = '  function syncDock(){';

const report = [];
for (const f of FILES) {
  let s = fs.readFileSync(f, 'utf8');
  const i = s.indexOf(A);
  const j = s.indexOf(B, i);
  if (i < 0 || j < 0) { report.push(f + ' : SKIP (marker not found)'); continue; }
  if (s.indexOf('DOCK_GROUP') > -1) { report.push(f + ' : already patched'); continue; }
  fs.copyFileSync(f, f + '.bak-20261123-dock');
  s = s.slice(0, i) + NEW + s.slice(j);
  fs.writeFileSync(f, s);
  report.push(f + ' : patched (' + (i) + '-' + j + ')');
}
console.log(report.join('\n'));

// ---- behavioural test: run the real routeIndex with stubbed dock/location ----
function dockOf(f) {
  const s = fs.readFileSync(f, 'utf8');
  const a = s.indexOf('<div id="site-dock"');
  const b = s.indexOf('</div>', a);
  const chunk = s.slice(a, b);
  const hrefs = [];
  const re = /<a[^>]*href="([^"]*)"/g;
  let m;
  while ((m = re.exec(chunk))) hrefs.push(m[1]);
  return hrefs;
}
function run(f, pathname, hash) {
  const s = fs.readFileSync(f, 'utf8');
  const i = s.indexOf('  var DOCK_GROUP={}');
  const j = s.indexOf('  function syncDock(){', i);
  if (i < 0 || j < 0) return 'no-fn';
  const src = s.slice(i, j);
  const hrefs = dockOf(f);
  const dl = hrefs.map(h => ({ getAttribute: () => h }));
  const location = { pathname: '/site/' + pathname, hash: hash || '' };
  const fn = new Function('dl', 'location', 'return (function(){' + src + ';return routeIndex();})()');
  const idx = fn(dl, location);
  return { idx: idx, picked: hrefs[idx] };
}

const cases = [
  ['teukgeom.html', 'teukgeom.html', ''],
  ['liberty.html', 'liberty.html', ''],
  ['index.html', 'index.html', ''],
  ['policy.html', 'policy.html', ''],
  ['salriki.html', 'salriki.html', '#/salriki'],
  ['jojakkiso_teukgeom_factsheet.html', 'jojakkiso_teukgeom_factsheet.html', ''],
  ['teukgeom.html', 'teukgeom.html', '#videos']
];
console.log('\n--- behaviour ---');
for (const c of cases) console.log(c[1] + ' ' + (c[2] || '(no hash)') + '  ->  ' + JSON.stringify(run(c[0], c[1], c[2])));
