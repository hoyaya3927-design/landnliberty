/* 11.22 파이낸스투데이 후속 보도 + 특검 첫 브리핑 영상 (멱등) */
const fs = require('fs');
const MARK = '<!-- news-20261122b -->';
const F = {
  u: 'https://www.fntoday.co.kr/news/articleView.html?idxno=399611',
  o: '파이낸스투데이',
  t: '[특검] 위조된 투표록으로 ‘선거무효 소청’ 덮어…선관위 셀프 면죄부 파문',
  day: '2026.11.22',
  host: 'fntoday.co.kr',
  d: '11.22'
};

function read(f) { return fs.readFileSync(f, 'utf8'); }
function save(f, s) { fs.writeFileSync(f, s); console.log('WROTE', f); }

/* 1) liberty.html — 11.22 중앙일보 항목 뒤 · INSERT 슬롯 앞에 삽입 */
(function () {
  const f = 'liberty.html';
  let s = read(f);
  if (s.includes(MARK)) { console.log('SKIP', f); return; }
  const slot = s.indexOf('<!-- INSERT-1123');
  if (slot < 0) { console.log('SKIP no-slot', f); return; }
  const li = `      ${MARK}\n      <li style="margin:9px 0;line-height:1.55"><a href="${F.u}" target="_blank" rel="noopener" style="text-decoration:none"><b style="font-size:12px;letter-spacing:.06em;color:#0F766E">${F.o}</b> ${F.t} <span style="font-size:12px;opacity:.6">${F.day}</span></a></li>\n      `;
  s = s.slice(0, slot) + li + s.slice(slot);

  /* 특검 첫 브리핑 영상 — 목록 아래 */
  const vid = `
  <div style="margin:20px 0 0;max-width:78ch">
    <p style="margin:0 0 8px;font-size:13px;letter-spacing:.04em;color:#B91C1C;font-weight:700">영상 — 선관위 특검 출범 후 첫 브리핑</p>
    <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:10px;background:#000">
      <iframe src="https://www.youtube-nocookie.com/embed/keM9uWk2QXI" title="선관위 특검, 출범 이후 첫 브리핑 — 8명 구속영장 청구 (YTN, 2026.11.18)" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0"></iframe>
    </div>
    <p style="margin:8px 0 0;font-size:13px;line-height:1.7;opacity:.75">YTN 현장영상 · 2026.11.18 · 1분 6초 — “선관위 직원 8명 구속영장 청구”. 전체 브리핑은 <a href="https://www.youtube.com/watch?v=ithORnwzFZY" target="_blank" rel="noopener">JTBC 전체 영상(4분 46초)</a>.</p>
  </div>
`;
  const end = s.lastIndexOf('</div></section>');
  s = s.slice(0, end) + vid + '  ' + s.slice(end);
  save(f, s);
})();

/* 2) 나머지 4개 파일 — 출처 목록 말미 */
(function () {
  const jobs = [
    ['teukgeom.html', '<ol class="src-list">', '</ol>', `<li><a href="${F.u}">${F.o} — ${F.t} (${F.day})</a></li>`],
    ['liberty-report.html', '<ul class="footnotes">', '</ul>', `<li><a href="${F.u}" target="_blank" rel="noopener">${F.o} — ${F.t} (${F.day})</a></li>`],
    ['liberty-archive.html', '<ul class="srclist">', '</ul>', `<li><a href="${F.u}" target="_blank" rel="noopener">${F.o} — ${F.t} (${F.day})</a></li>`],
    ['forensic.html', '<ul class="srcs">', '</ul>', `<li><span class="dt">${F.d}</span><a href="${F.u}" target="_blank" rel="noopener">${F.t}</a><span class="host">${F.host}</span></li>`]
  ];
  for (const [f, open, close, html] of jobs) {
    let s = read(f);
    if (s.includes(MARK)) { console.log('SKIP', f); continue; }
    const a = s.indexOf(open);
    const b = s.indexOf(close, a);
    if (a < 0 || b < 0) { console.log('SKIP anchors', f); continue; }
    s = s.slice(0, b) + '    ' + MARK + '\n    ' + html + '\n  ' + s.slice(b);
    save(f, s);
  }
})();
