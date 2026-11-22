// 다크 테마 기준으로 11.22 블록 스타일 재작성 + 영상 캡션 줄바꿈/가독성 보정
const fs = require('fs');
const F = 'teukgeom.html';
let s = fs.readFileSync(F, 'utf8');
const log = [];

/* 1) 캡션 규칙: 테마 변수 + 줄바꿈 */
const oldCap = '.vcard .cap{padding:12px 15px;font-size:13.5px;line-height:1.7;color:var(--txt,var(--ink,#3F4756))}';
const newCap = '.vcard .cap{padding:13px 15px;font-size:13.5px;line-height:1.75;color:var(--mut);white-space:normal;overflow-wrap:anywhere;word-break:keep-all}';
if (s.includes(oldCap)) { s = s.replace(oldCap, newCap); log.push('cap ok'); } else log.push('cap MISS');

/* 2) 기존에 넣은 블록 CSS 제거 */
const cssStart = s.indexOf('#videos .eyebrow,#videos h2.sec-t,#videos .sub{text-align:center}');
if (cssStart > 0) {
  const re = /@media\(max-width:640px\)\{\.lead1122[^\n]*\}\n/;
  const tail = s.slice(cssStart).match(re);
  if (tail) {
    s = s.slice(0, cssStart) + s.slice(cssStart + tail.index + tail[0].length);
    log.push('old css removed');
  } else log.push('old css tail MISS');
} else log.push('old css MISS');

/* 3) 다크 테마용 새 CSS */
const addCss = `#videos .eyebrow,#videos h2.sec-t,#videos .sub{text-align:center}
#videos .sub{max-width:780px;margin:10px auto 28px;line-height:1.85}
.lead1122{max-width:1000px;margin:0 auto 48px;padding:34px 34px 30px;border:1px solid var(--line);border-top:4px solid var(--red);border-radius:18px;background:linear-gradient(180deg,rgba(255,77,109,.12) 0%,rgba(17,24,48,.85) 46%,var(--card2) 100%);box-shadow:0 14px 44px rgba(0,0,0,.38)}
.lead1122 .lb-eyebrow{font-family:var(--mono);font-size:12px;font-weight:800;letter-spacing:.14em;color:var(--red);text-align:center;line-height:1.8}
.lead1122 h2.lb-t{font-size:clamp(24px,3.2vw,33px);line-height:1.38;font-weight:800;text-align:center;margin:12px auto 16px;max-width:880px;color:var(--txt);letter-spacing:-.01em}
.lead1122 .lb-lead{font-size:17px;line-height:2;color:#cdd8ee;max-width:820px;margin:0 auto 28px;text-align:center}
.lead1122 .lb-lead b{color:#ff8095}
.lb-kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(154px,1fr));gap:12px;max-width:880px;margin:0 auto 30px}
.lb-kpi{padding:18px 12px 16px;border:1px solid var(--line);border-radius:12px;background:var(--card);text-align:center}
.lb-kpi .n{font-family:var(--mono);font-size:30px;font-weight:800;line-height:1.15;color:var(--red);letter-spacing:-.01em}
.lb-kpi .t{font-size:13.5px;line-height:1.7;color:#aab6d0;margin-top:8px}
.lb-kpi .t b{color:#fff}
.lb-body{max-width:850px;margin:0 auto;padding-left:20px}
.lb-body li{font-size:15.5px;line-height:2;color:#d7e0f5;margin-bottom:11px}
.lb-body li b{color:#fff}
.lb-body li::marker{color:var(--red)}
.lb-src{font-size:13.5px;line-height:1.95;color:var(--mut);text-align:center;margin:26px auto 26px;max-width:820px}
.lb-src b{color:var(--txt)}
.lb-video{max-width:740px;margin:0 auto;padding:20px 20px 18px;border:1px solid var(--line);border-radius:14px;background:rgba(10,14,26,.55)}
.lb-video .vt{font-family:var(--mono);font-size:12px;letter-spacing:.06em;font-weight:800;color:var(--red);text-align:center;margin:0 0 14px}
.lb-video .vc{font-size:13px;line-height:1.85;color:#aab6d0;text-align:center;margin:14px 0 0}
.lb-video .vc a{color:var(--neon)}
@media(max-width:640px){.lead1122{padding:24px 18px 22px;border-radius:14px}.lead1122 .lb-lead{font-size:15.5px;line-height:1.95}.lb-kpi .n{font-size:26px}.lb-kpi .t{font-size:12.5px}.lb-body li{font-size:14.5px;line-height:1.95}}
`;
s = s.replace(newCap, newCap + addCss);
log.push('css rewritten');

fs.writeFileSync(F, s, 'utf8');
log.push('WROTE');

/* 4) 미리보기 재생성 */
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
console.log(log.join(' | '), '| preview', preview.length);
