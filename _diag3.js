const fs=require('fs');
const files=["index.html","salriki.html","teukgeom.html","jojakkiso_teukgeom_factsheet.html","jozakkiso_teukgeom_factsheet.html","assembly-reset.html","nec-reform.html","dday-teukgeom.html"];
function diag(name){
  const s=fs.readFileSync(name,'utf8');
  const title=(s.match(/<title>([^<]*)<\/title>/)||[])[1]||'?';
  const r={
    title, bytes:s.length,
    siteHeader:!!s.match(/<header id="site-header"/),
    mastHeader:!!s.match(/<header class="mast"/),
    gtWrap:!!s.match(/class="[^"]*gt-wrap/),
    tabsyncCss1:!!s.match(/tabsync-gt-css1/),
    tabsyncCss2:!!s.match(/tabsync-gt-css2/),
    tabsyncCss:!!s.match(/tabsync-gt-css/),
    mobileMenu:!!s.match(/id="mobile-menu"/),
    dock:!!s.match(/id="site-dock"/),
    tabBarOld:!!s.match(/class="[^"]*site-tabbar|id="site-tabbar"/),
    isOn:(s.match(/is-on/g)||[]).length,
  };
  // find active big tab label(s) in gt is-on
  const act=[...s.matchAll(/<a[^>]*class="[^"]*gt[^"]*is-on[^"]*"[^>]*>([\s\S]*?)<\/a>/g)].map(m=>m[1].replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim());
  r.activeBigTabs=act;
  // header block start position
  r.siteHeaderAt=s.indexOf('<header id="site-header"');
  // what comes right after body tag
  const bi=s.indexOf('<body');
  r.afterBody=s.slice(bi,bi+300).replace(/\s+/g,' ');
  console.log('=== '+name); console.log(JSON.stringify(r,null,1));
}
for(const f of files){ try{diag(f)}catch(e){console.log('=== '+f+' ERROR '+e.message)} }
