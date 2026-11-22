// 마지막 다듬기 (수정판): KPI 숫자 폰트/자간 + 캡션 밝기
const fs = require('fs');
const F = 'teukgeom.html';
let s = fs.readFileSync(F, 'utf8');
const log = [];

function rep(a, b, tag) {
  if (s.includes(a)) { s = s.replace(a, b); log.push(tag + ' ok'); }
  else log.push(tag + ' MISS');
}

rep('.lb-kpi .n{font-family:var(--mono);font-size:30px;font-weight:800;line-height:1.15;color:var(--red);letter-spacing:-.01em}',
    '.lb-kpi .n{font-family:Pretendard,sans-serif;font-variant-numeric:tabular-nums;font-size:30px;font-weight:800;line-height:1.15;color:var(--red);letter-spacing:0}',
    'kpi num');

rep('.vcard .cap{padding:13px 15px;font-size:13.5px;line-height:1.75;color:var(--mut);white-space:normal;overflow-wrap:anywhere;word-break:keep-all}',
    '.vcard .cap{padding:14px 16px;font-size:14px;line-height:1.72;color:#b8c2d8;white-space:normal;overflow-wrap:anywhere;word-break:keep-all}',
    'cap');

rep('.lb-kpi .t{font-size:13.5px;line-height:1.7;color:#aab6d0;margin-top:8px}',
    '.lb-kpi .t{font-size:13.5px;line-height:1.7;color:#b3bfd8;margin-top:8px}',
    'kpi text');

if (s.length < 50000) { console.log('ABORT: file too small', s.length); process.exit(1); }

fs.writeFileSync(F, s, 'utf8');
log.push('WROTE ' + s.length);

const headEnd = s.indexOf('</head>') + 7;
const headPart = s.slice(0, headEnd);
const bodyTag = (s.match(/<body[^>]*>/) || ['<body>'])[0];
const leadHtml = s.slice(s.search(/<!-- blk-1122v2 -->/), s.indexOf('<section id="timeline">'));
const vStart = s.indexOf('<section id="videos">');
const vGrid = s.indexOf('<div class="vgrid">', vStart);
let p = vGrid, n = 0, cut = -1;
while ((p = s.indexOf('<div class="vcard">', p)) >= 0) { n++; if (n === 4) { cut = p; break; } p += 5; }
const preview = headPart + bodyTag + '<div class="wrap" style="padding-top:36px">' + leadHtml + s.slice(vStart, cut) + '\n  </div>\n</section>\n</div></body></html>';
fs.writeFileSync('_preview_1122.html', preview, 'utf8');
console.log(log.join(' | '));
