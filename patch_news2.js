/* 11.22 중앙일보 단독 보도 추가 (멱등, 기존 11.4~5 목록 뒤에 붙임) */
const fs = require('fs');
const MARK = '<!-- news-20261122 -->';
const A = {
  u: 'https://www.joongang.co.kr/article/25480826',
  o: '중앙일보',
  day: '2026.11.22',
  t: '[단독] ‘6·3 선거’ 소청 다 기각·각하…선관위 ‘변조 투표록’ 쓰였다',
  host: 'joongang.co.kr',
  d: '11.22'
};

function addToList(file, open, close, html) {
  let s = fs.readFileSync(file, 'utf8');
  if (s.includes(MARK)) { console.log('SKIP already', file); return; }
  const a = s.indexOf(open);
  if (a < 0) { console.log('SKIP no-open', file); return; }
  const b = s.indexOf(close, a);
  if (b < 0) { console.log('SKIP no-close', file); return; }
  s = s.slice(0, b) + '    ' + MARK + '\n    ' + html + '\n  ' + s.slice(b);
  fs.writeFileSync(file, s);
  console.log('ADDED', file);
}

addToList('teukgeom.html', '<ol class="src-list">', '</ol>',
  `<li><a href="${A.u}">${A.o} — ${A.t} (${A.day})</a></li>`);

addToList('liberty-report.html', '<ul class="footnotes">', '</ul>',
  `<li><a href="${A.u}" target="_blank" rel="noopener">${A.o} — ${A.t} (${A.day})</a></li>`);

addToList('liberty-archive.html', '<ul class="srclist">', '</ul>',
  `<li><a href="${A.u}" target="_blank" rel="noopener">${A.o} — ${A.t} (${A.day})</a></li>`);

addToList('forensic.html', '<ul class="srcs">', '</ul>',
  `<li><span class="dt">${A.d}</span><a href="${A.u}" target="_blank" rel="noopener">${A.t}</a><span class="host">${A.host}</span></li>`);

/* liberty.html — #news 섹션에 11.22 항목 + 23일 심사 안내 */
(function () {
  const f = 'liberty.html';
  let s = fs.readFileSync(f, 'utf8');
  if (s.includes(MARK)) { console.log('SKIP already', f); return; }
  const sec = s.indexOf('<section id="news">');
  if (sec < 0) { console.log('SKIP no-section', f); return; }
  const ul = s.indexOf('<ul style="list-style:none', sec);
  const end = s.indexOf('</ul>', ul);
  if (ul < 0 || end < 0) { console.log('SKIP no-list', f); return; }

  const item = `      <li style="margin:9px 0;line-height:1.55"><a href="${A.u}" target="_blank" rel="noopener" style="text-decoration:none"><b style="font-size:12px;letter-spacing:.06em;color:#0F766E">${A.o}</b> ${A.t} <span style="font-size:12px;opacity:.6">${A.day}</span></a></li>`;
  s = s.slice(0, end) + '  ' + MARK + '\n' + item + '\n    ' + s.slice(end);

  const note = `<p style="max-width:78ch;line-height:1.7;margin:0 0 14px;font-size:14px;background:#FEF2F2;border:1px solid #FECACA;border-radius:8px;padding:10px 12px"><b style="color:#B91C1C">11. 23.(월) 오늘</b> — 투표록 위·변조 혐의로 영장이 청구된 선관위 직원 8명의 구속영장 실질심사가 서울중앙지법에서 열립니다.</p>
    `;
  s = s.slice(0, ul) + note + s.slice(ul);
  s = s.replace('§ 4 · 2026. 11. 4. ~ 5.', '§ 4 · 2026. 11. 4. ~ 22.');
  fs.writeFileSync(f, s);
  console.log('ADDED', f);
})();
