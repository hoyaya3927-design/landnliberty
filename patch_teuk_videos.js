/* teukgeom.html — 11.22 단독 보도 강조 블록 + 영상 자료실 최신순 재배열 (멱등) */
const fs = require('fs');
const F = 'teukgeom.html';
let s = fs.readFileSync(F, 'utf8');

const MARK = '<!-- blk-1122v -->';

/* ---------- A. 11.22 강조 블록 ---------- */
if (!s.includes(MARK)) {
  const block = [
    MARK,
    '<section id="lead1122" style="margin:0 0 36px;padding:26px 26px 22px;border:1px solid #FECACA;border-left:6px solid #DC2626;border-radius:14px;background:linear-gradient(180deg,#FFF5F5 0%,#FFFFFF 72%)">',
    '  <div class="eyebrow" style="color:#DC2626">Exclusive &middot; 2026. 11. 22.</div>',
    '  <h2 class="sec-t" style="margin:6px 0 12px">위조된 투표록이 ‘선거무효 소청’을 덮었다</h2>',
    '  <p class="sub" style="margin:0 0 18px">중앙일보 단독(11.22)과 파이낸스투데이 후속 보도로 확인된 내용입니다. 핵심은 구속영장 청구서에 적힌 한 문장입니다 — <b>“사후 변조된 투표록이 소청심사 근거로 제출됐다.”</b></p>',
    '  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(132px,1fr));gap:10px;margin:0 0 18px">',
    '    <div style="padding:12px 14px;border:1px solid #F3F4F6;border-radius:10px;background:#fff"><div style="font-size:22px;font-weight:800;color:#DC2626">690건</div><div style="font-size:11.5px;line-height:1.5;opacity:.72;margin-top:3px">6·3 선거무효 소청 접수<br>2022년 45건의 <b>15.3배</b></div></div>',
    '    <div style="padding:12px 14px;border:1px solid #F3F4F6;border-radius:10px;background:#fff"><div style="font-size:22px;font-weight:800;color:#DC2626">8명</div><div style="font-size:11.5px;line-height:1.5;opacity:.72;margin-top:3px">11.18 구속영장 청구<br>11.23(월) 영장실질심사</div></div>',
    '    <div style="padding:12px 14px;border:1px solid #F3F4F6;border-radius:10px;background:#fff"><div style="font-size:22px;font-weight:800;color:#DC2626">40여 곳</div><div style="font-size:11.5px;line-height:1.5;opacity:.72;margin-top:3px">투표록 사후 위·변조<br>봉인 해제 뒤 작성</div></div>',
    '    <div style="padding:12px 14px;border:1px solid #F3F4F6;border-radius:10px;background:#fff"><div style="font-size:22px;font-weight:800;color:#DC2626">0건</div><div style="font-size:11.5px;line-height:1.5;opacity:.72;margin-top:3px">8월 소청심사위 인용<br>전부 기각·각하</div></div>',
    '  </div>',
    '  <ul style="margin:0 0 16px;padding-left:18px;font-size:14px;line-height:1.85">',
    '    <li><b>8월 소청심사위는 690건을 전부 기각·각하</b>했습니다. 서울·부산·인천·경기는 “규정 위반은 있으나 결과에 영향 없음”, 전남광주·울산·충북은 “위반 인정 안 됨”이 이유였습니다. 그 심사 근거로 쓰인 투표록이 변조본이었습니다.</li>',
    '    <li><b>지시선은 6월 5일</b> — 중앙선관위가 시·도선관위에 “부실하게 기재했으면 추가 기재하라”고 지시했고, 40여 곳이 봉인을 해제한 뒤 무번호 투표지를 감춘 채 일련번호를 손으로 적어 투표록을 다시 만들었습니다.</li>',
    '    <li>소청심사위 <b>최종 보고서에는 “무번호 투표용지 활용에 법적 이상 없다”</b>고 적혔습니다. 특검은 이를 셀프 면죄부로 보고 있습니다.</li>',
    '    <li>변조본은 <b>국회 국정조사특위와 선관위 진상규명위에도 제출</b>됐습니다. 수사 대상이 선관위 내부를 넘어 국회·심사 절차까지 번지는 이유입니다.</li>',
    '    <li>특검은 <b>위계에 의한 공무집행방해</b> 혐의 적용을 검토 중입니다. 다만 이번 영장에는 아직 적용되지 않았습니다.</li>',
    '    <li>재선거 가능성은 낮게 평가됩니다 — 서울시장 표차 6만259표에 비해 문제된 무번호 투표지는 3,697장입니다. <span style="opacity:.7">(수치·판단 모두 보도 기준)</span></li>',
    '  </ul>',
    '  <p style="margin:0 0 18px;font-size:13px;line-height:1.8;opacity:.8">원문 — <a href="https://www.joongang.co.kr/article/25480826" target="_blank" rel="noopener"><b>중앙일보</b> 단독(11.22)</a> &middot; <a href="https://www.fntoday.co.kr/news/articleView.html?idxno=399611" target="_blank" rel="noopener"><b>파이낸스투데이</b> 후속(11.22)</a></p>',
    '  <div style="padding:16px;border:1px solid #F3F4F6;border-radius:12px;background:#fff">',
    '    <p style="margin:0 0 10px;font-size:12.5px;letter-spacing:.04em;font-weight:700;color:#B91C1C">영상 — 특검 출범 후 첫 브리핑 (2026. 11. 18.)</p>',
    '    <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:10px;background:#000">',
    '      <iframe src="https://www.youtube-nocookie.com/embed/keM9uWk2QXI" title="선관위 특검, 출범 이후 첫 브리핑 — 선관위 직원 8명 구속영장 청구 (YTN, 2026.11.18)" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;border:0"></iframe>',
    '    </div>',
    '    <p style="margin:9px 0 0;font-size:12.5px;line-height:1.7;opacity:.75">YTN 현장영상 · 1분 6초. 전체 브리핑은 <a href="https://www.youtube.com/watch?v=ithORnwzFZY" target="_blank" rel="noopener">JTBC 풀영상(4분 46초)</a>.</p>',
    '  </div>',
    '</section>',
    ''
  ].join('\n');
  const at = s.indexOf('<section id="timeline">');
  if (at < 0) { console.log('SKIP no timeline anchor'); process.exit(1); }
  s = s.slice(0, at) + block + '\n' + s.slice(at);
  console.log('ADDED 1122 block');
} else { console.log('SKIP 1122 block'); }

/* ---------- B. 첫 번째 vgrid 재배열 ---------- */
function parseDate(card) {
  let m = card.match(/·\s*(20\d\d)\.(\d{1,2})\.(\d{1,2})/);
  if (!m) m = card.match(/\((20\d\d)\.(\d{1,2})\.(\d{1,2})\)/);
  if (!m) return 0;
  return (+m[1]) * 10000 + (+m[2]) * 100 + (+m[3]);
}
function gridInner(str, openIdx) {
  const open = '<div class="vgrid">';
  let depth = 1, p = openIdx + open.length;
  while (depth > 0 && p < str.length) {
    const a = str.indexOf('<div', p), b = str.indexOf('</div>', p);
    if (b < 0) break;
    if (a >= 0 && a < b) { depth++; p = a + 4; } else { depth--; p = b + 6; }
  }
  return { start: openIdx + open.length, end: p - 6 };
}

const NEW = [
  ['mscL5mmoAiw', '김태우TV', '2026.11.22', '선관위 ‘변조 투표록’ 활용 6·3 선거 소청 전부 기각·각하 (라이브 49분)'],
  ['SQHdIGod3jk', '뉴스TVCHOSUN', '2026.11.18', '“투표록·투표율 조작”…특검, 선관위 8명 첫 영장 청구 [뉴스9]'],
  ['keM9uWk2QXI', 'YTN', '2026.11.18', '선관위 특검, 출범 이후 첫 브리핑…“선관위 직원 8명 구속영장 청구” [현장영상+]', '1분 6초'],
  ['ithORnwzFZY', 'JTBC', '2026.11.18', '[풀영상/현장] 특검, 선관위 직원 8명 구속영장…지방선거 5개월만', '4분 46초'],
  ['pjJYgSlCgB8', 'YTN', '2026.11.4', '‘투표록 조작’에 ‘459억 입찰 비리’까지…특검, 선관위 압수수색'],
  ['02zLaauffpI', 'KBS', '2026.11.4', '[단독] “무번호 투표지 수사 우려”…투표록 위조 혐의 10여 명 입건']
];
const BADGE = '<span style="display:inline-block;background:#DC2626;color:#fff;font-family:IBM Plex Mono,ui-monospace,monospace;font-size:9.5px;font-weight:700;letter-spacing:.08em;padding:2px 5px;border-radius:4px;vertical-align:middle;margin-left:4px">NEW</span>';
function mkCard(id, ch, d, t, dur) {
  const capT = dur ? t + ' (' + dur + ')' : t;
  return '<div class="vcard"><div class="ratio"><iframe data-src="https://www.youtube-nocookie.com/embed/' + id + '" title="' + ch + ' — ' + t + ' (' + d + ')" loading="lazy" allowfullscreen src="https://www.youtube-nocookie.com/embed/' + id + '"></iframe></div><div class="cap">' + ch + ' · ' + d + ' — ' + capT + BADGE + '</div></div>';
}

const secA = s.indexOf('<section id="videos">');
const gridA = s.indexOf('<div class="vgrid">', secA);
const r = gridInner(s, gridA);
let inner = s.slice(r.start, r.end);
let cards = inner.split('<div class="vcard">').slice(1).map(p => '<div class="vcard">' + p.replace(/\s+$/, ''));
const before = cards.length;
cards = cards.filter(c => /<\/div><\/div>$/.test(c));
if (cards.length !== before) console.log('dropped malformed', before - cards.length);

const existingIds = new Set((s.match(/embed\/([\w-]{11})/g) || []).map(x => x.slice(6)));
for (const [id, ch, d, t, dur] of NEW) {
  if (existingIds.has(id)) { console.log('dup', id); continue; }
  cards.push(mkCard(id, ch, d, t, dur));
  existingIds.add(id);
  console.log('add', id, d);
}

const sorted = cards.map((c, i) => ({ c, d: parseDate(c), i }))
  .sort((x, y) => (y.d - x.d) || (x.i - y.i));
const out = sorted.map(o => o.c);
s = s.slice(0, r.start) + '\n    ' + out.join('\n    ') + '\n  ' + s.slice(r.end);
console.log('grid cards', out.length, 'range', parseDate(out[0]), '→', parseDate(out[out.length - 1]));

s = s.replace(/원영상 \d+선/, '원영상 ' + out.length + '선')
  .replace('2026.11.20 통합판', '2026.11.23 통합판')
  .replace('최신(11.20) → 과거', '최신(11.22) → 과거');

fs.writeFileSync(F, s);
console.log('WROTE', F);
fs.writeFileSync('order.json', JSON.stringify(sorted.map(o => ({ d: o.d, ch: (o.c.match(/class="cap">([^·<]+)/) || [])[1] || '?' })), null, 0));
