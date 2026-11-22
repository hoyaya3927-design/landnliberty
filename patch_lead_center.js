// 11.22 블록 재작성(가운데 정렬 + 가독성) + 영상 섹션 타이포 정리
const fs = require('fs');
const F = 'teukgeom.html';
let s = fs.readFileSync(F, 'utf8');
const log = [];

/* ---------- 1) CSS: 영상 카드 캡션 가독성 + 그리드 가운데 정렬 ---------- */
const oldGrid = '.vgrid{display:grid;gap:18px;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));margin-bottom:14px}';
const newGrid = '.vgrid{display:grid;gap:20px;grid-template-columns:repeat(auto-fill,minmax(312px,1fr));max-width:1004px;margin:0 auto 16px}';
if (s.includes(oldGrid)) { s = s.replace(oldGrid, newGrid); log.push('css grid ok'); } else log.push('css grid MISS');

const oldCap = '.vcard .cap{padding:10px 14px;font-size:12.5px;color:var(--mut)}';
const newCap = '.vcard .cap{padding:12px 15px;font-size:13.5px;line-height:1.7;color:var(--txt,var(--ink,#3F4756))}';
if (s.includes(oldCap)) { s = s.replace(oldCap, newCap); log.push('css cap ok'); } else log.push('css cap MISS');

/* 새 블록/영상 섹션 전용 스타일 */
const addCss = `
#videos .eyebrow,#videos h2.sec-t,#videos .sub{text-align:center}
#videos .sub{max-width:780px;margin:10px auto 28px;line-height:1.8}
.lead1122{max-width:1000px;margin:0 auto 46px;padding:34px 34px 30px;border:1px solid #FBD5D5;border-top:5px solid #DC2626;border-radius:18px;background:linear-gradient(180deg,#FFF8F8 0%,#FFFFFF 58%)}
.lead1122 .lb-eyebrow{font-family:IBM Plex Mono,ui-monospace,monospace;font-size:11.5px;font-weight:800;letter-spacing:.13em;color:#DC2626;text-align:center;line-height:1.7}
.lead1122 h2.lb-t{font-size:clamp(24px,3.2vw,33px);line-height:1.34;font-weight:800;text-align:center;margin:12px auto 16px;max-width:860px;color:#14213D;letter-spacing:-.01em}
.lead1122 .lb-lead{font-size:17px;line-height:1.95;color:#2A3446;max-width:800px;margin:0 auto 26px;text-align:center}
.lead1122 .lb-lead b{color:#B91C1C}
.lb-kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(152px,1fr));gap:12px;max-width:860px;margin:0 auto 28px}
.lb-kpi{padding:18px 12px 16px;border:1px solid #F1F2F4;border-radius:12px;background:#fff;text-align:center;box-shadow:0 2px 10px rgba(20,33,61,.04)}
.lb-kpi .n{font-size:31px;font-weight:800;line-height:1.1;color:#DC2626;letter-spacing:-.01em}
.lb-kpi .t{font-size:13px;line-height:1.65;color:#4A5568;margin-top:8px}
.lb-kpi .t b{color:#111827}
.lb-body{max-width:840px;margin:0 auto;padding:0 0 0 4px}
.lb-body li{font-size:15.5px;line-height:1.95;color:#232B3A;margin-bottom:10px}
.lb-body li b{color:#111827}
.lb-src{font-size:13.5px;line-height:1.9;color:#5A6472;text-align:center;margin:24px auto 26px;max-width:820px}
.lb-video{max-width:760px;margin:0 auto;padding:18px 18px 16px;border:1px solid #F1F2F4;border-radius:14px;background:#fff}
.lb-video .vt{font-size:12.5px;letter-spacing:.06em;font-weight:800;color:#B91C1C;text-align:center;margin:0 0 12px}
.lb-video .vc{font-size:13px;line-height:1.8;color:#5A6472;text-align:center;margin:12px 0 0}
@media(max-width:640px){.lead1122{padding:24px 18px 22px;border-radius:14px}.lead1122 .lb-lead{font-size:15.5px;line-height:1.85}.lb-kpi .n{font-size:26px}.lb-body li{font-size:14.5px;line-height:1.9}}
`;
if (!s.includes('.lead1122{max-width:1000px')) {
  s = s.replace('.vcard .cap{padding:12px 15px;font-size:13.5px;line-height:1.7;color:var(--txt,var(--ink,#3F4756))}',
    '.vcard .cap{padding:12px 15px;font-size:13.5px;line-height:1.7;color:var(--txt,var(--ink,#3F4756))}' + addCss);
  log.push('css add ok');
} else log.push('css add skip');

/* ---------- 2) 11.22 블록 전면 재작성 ---------- */
const block = `<!-- blk-1122v2 -->
<section id="lead1122" class="lead1122">
  <div class="lb-eyebrow">EXCLUSIVE &middot; 2026. 11. 22. (일) 23:18 &middot; 중앙일보 단독 + 파이낸스투데이 후속</div>
  <h2 class="lb-t">위조된 투표록이 ‘선거무효 소청’ 690건을 통째로 덮었다</h2>
  <p class="lb-lead">특검이 11.18 구속영장 청구서에 적은 문장은 한 줄입니다. <b>“사후 변조된 투표록이 소청심사 근거로 제출됐다.”</b> 8월 소청심사위가 690건을 전부 기각·각하할 때, 그 손에 들려 있던 서류가 원본이 아니었다는 뜻입니다.</p>

  <div class="lb-kpis">
    <div class="lb-kpi"><div class="n">690건</div><div class="t">6·3 지방선거 선거무효 소청<br>2022년 <b>45건의 15.3배</b></div></div>
    <div class="lb-kpi"><div class="n">0건</div><div class="t">8월 소청심사위 인용<br><b>690건 전부</b> 기각·각하</div></div>
    <div class="lb-kpi"><div class="n">40여 곳</div><div class="t">투표록 사후 위·변조<br>봉인 해제 뒤 재작성</div></div>
    <div class="lb-kpi"><div class="n">8명</div><div class="t">11.18 구속영장 청구<br><b>11.23(월)</b> 영장실질심사</div></div>
  </div>

  <ul class="lb-body">
    <li><b>기각 사유는 두 갈래였습니다.</b> 서울·부산·인천·경기는 “규정 위반은 있으나 결과에 영향 없음”, 전남광주·울산·충북은 “위반 인정 안 됨”. 690건 전부가 이 두 문장으로 정리됐습니다.</li>
    <li><b>그 근거 서류가 변조본이었습니다.</b> 6월 5일 중앙선관위가 시·도선관위에 “부실하게 기재했으면 추가로 기재하라”고 지시했고, 40여 곳이 봉인을 해제한 뒤 무번호 투표지를 감춘 채 일련번호를 손으로 적어 투표록을 다시 만들었습니다.</li>
    <li><b>소청심사위 최종 보고서</b>에는 “무번호 투표용지 활용에 법적 이상 없다”고 적혔습니다. 특검은 이 문장을 셀프 면죄부로 보고 있습니다.</li>
    <li><b>변조본은 국회 국정조사특위와 선관위 진상규명위에도 제출</b>됐습니다. 수사 대상이 선관위 내부를 넘어 국회·심사 절차까지 번지는 이유입니다.</li>
    <li><b>특검은 위계에 의한 공무집행방해</b> 적용을 검토 중입니다. 다만 이번 영장에는 아직 적용되지 않았습니다.</li>
    <li><b>재선거 가능성은 낮게</b> 평가됩니다. 서울시장 표차 6만259표에 비해 문제된 무번호 투표지는 3,697장입니다. <span style="opacity:.72">(수치·판단 모두 보도 기준)</span></li>
  </ul>

  <p class="lb-src">원문 &mdash; <a href="https://www.joongang.co.kr/article/25480826" target="_blank" rel="noopener"><b>중앙일보</b> 단독 (11.22)</a> &middot; <a href="https://www.fntoday.co.kr/news/articleView.html?idxno=399611" target="_blank" rel="noopener"><b>파이낸스투데이</b> 후속 (11.22)</a></p>

  <div class="lb-video">
    <p class="vt">영상 &mdash; 구속영장 청구 직후 첫 브리핑 (2026. 11. 18.)</p>
    <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:10px;background:#000">
      <iframe src="https://www.youtube-nocookie.com/embed/keM9uWk2QXI" title="선관위 특검, 출범 이후 첫 브리핑 — 선관위 직원 8명 구속영장 청구 (YTN, 2026.11.18)" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;border:0"></iframe>
    </div>
    <p class="vc">YTN 현장영상 &middot; 1분 6초. 전체 브리핑은 <a href="https://www.youtube.com/watch?v=ithORnwzFZY" target="_blank" rel="noopener">JTBC 풀영상(4분 46초)</a>에서 이어집니다.</p>
  </div>
</section>

`;

const m = s.search(/<!-- blk-1122v[0-9]* -->/);
const tl = s.indexOf('<section id="timeline">');
if (m < 0 || tl < 0) { console.log('ANCHOR MISS', m, tl); process.exit(1); }
s = s.slice(0, m) + block + s.slice(tl);
log.push('block replaced');

/* 새 블록이 중복 생성되지 않았는지 */
if ((s.match(/id="lead1122"/g) || []).length !== 1) { console.log('DUP lead1122'); process.exit(1); }

fs.writeFileSync(F, s, 'utf8');
log.push('WROTE ' + F);

/* ---------- 3) 미리보기 생성 (실제 head/style + 새 블록 + 영상 상단 3카드) ---------- */
const headEnd = s.indexOf('</head>') + 7;
const headPart = s.slice(0, headEnd);
const bodyTagM = s.match(/<body[^>]*>/);
const bodyTag = bodyTagM ? bodyTagM[0] : '<body>';
const leadStart = s.search(/<!-- blk-1122v2 -->/);
const leadHtml = s.slice(leadStart, s.indexOf('<section id="timeline">'));
const vStart = s.indexOf('<section id="videos">');
const vGrid = s.indexOf('<div class="vgrid">', vStart);
let p = vGrid, n = 0, cut = -1;
while ((p = s.indexOf('<div class="vcard">', p)) >= 0) { n++; if (n === 4) { cut = p; break; } p += 5; }
const vidHtml = s.slice(vStart, cut) + '\n  </div>\n</section>\n';
const preview = headPart + bodyTag + '<div class="wrap" style="padding-top:40px">' + leadHtml + vidHtml + '</div></body></html>';
fs.writeFileSync('_preview_1122.html', preview, 'utf8');
log.push('preview bytes=' + preview.length);
console.log(log.join(' | '));
