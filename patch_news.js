/* 투표록 위·변조 보도 6건을 자유 탭 페이지 출처/보도 목록에 추가 (멱등) */
const fs = require('fs');

const N = [
  { d:'11.04', host:'news.kbs.co.kr', u:'https://news.kbs.co.kr/news/pc/view/view.do?ncd=8703928',
    t:'[단독] “무번호 투표지 수사 우려”…투표록 위조 혐의 10여 명 입건', o:'KBS', day:'2026.11.4' },
  { d:'11.04', host:'imnews.imbc.com', u:'https://imnews.imbc.com/news/2026/society/article/6863144_36918.html',
    t:'선관위 특검 “중앙선관위 지시로 투표록 사후 위변조”', o:'MBC', day:'2026.11.4' },
  { d:'11.04', host:'kyeonggi.com', u:'https://www.kyeonggi.com/article/20261104580132',
    t:'“무번호 용지 덮으려 투표록 조작”…특검, 중앙선관위 압수수색', o:'경기일보', day:'2026.11.4' },
  { d:'11.04', host:'mk.co.kr', u:'https://www.mk.co.kr/news/politics/12196236',
    t:'[속보] 특검 “투표지 부족 투표소, 선관위 지시로 투표록 사후 위변조”', o:'매일경제', day:'2026.11.4' },
  { d:'11.05', host:'donga.com', u:'https://www.donga.com/news/Society/article/all/20261105/134968278/2',
    t:'[단독] 특검 “중앙선관위, 용지부족 투표소 40여곳 투표록 위조 지시”', o:'동아일보', day:'2026.11.5' },
  { d:'11.05', host:'yna.co.kr', u:'https://www.yna.co.kr/view/AKR20261105068200004',
    t:'특검, 중앙선관위 나흘째 압수수색…‘투표록 위조’ 자료 확보', o:'연합뉴스', day:'2026.11.5' }
];

const MARK = '<!-- news-20261123 -->';

const plainLi = i => `<li${i.v ? ` value="${i.v}"` : ''}><a href="${i.u}">${i.o} — ${i.t} (${i.day})</a></li>`;
const blankLi = i => `<li><a href="${i.u}" target="_blank" rel="noopener">${i.o} — ${i.t} (${i.day})</a></li>`;
const srcsLi  = i => `<li><span class="dt">${i.d}</span><a href="${i.u}" target="_blank" rel="noopener">${i.t}</a><span class="host">${i.host}</span></li>`;

function insertIntoList(file, openTag, closeTag, build) {
  let s = fs.readFileSync(file, 'utf8');
  if (s.includes(MARK)) { console.log('SKIP already', file); return; }
  const a = s.indexOf(openTag);
  if (a < 0) { console.log('SKIP no-anchor', file); return; }
  const b = s.indexOf(closeTag, a);
  if (b < 0) { console.log('SKIP no-close', file); return; }
  const block = '\n    ' + MARK + '\n    ' + N.map(build).join('\n    ') + '\n  ';
  s = s.slice(0, b) + block + s.slice(b);
  fs.writeFileSync(file, s);
  console.log('ADDED', file, N.length, 'entries');
}

/* 1) 특검 페이지 — 시간순 출처 목록 */
insertIntoList('teukgeom.html', '<ol class="src-list">', '</ol>', plainLi);
/* 2) 10·28 리포트 */
insertIntoList('liberty-report.html', '<ul class="footnotes">', '</ul>', blankLi);
/* 3) 증거 아카이브 */
insertIntoList('liberty-archive.html', '<ul class="srclist">', '</ul>', blankLi);
/* 4) 감정 추적판 */
insertIntoList('forensic.html', '<ul class="srcs">', '</ul>', srcsLi);

/* 5) 자유 랜딩 — 보도 섹션 신설 (#notice 앞) */
(function () {
  const f = 'liberty.html';
  let s = fs.readFileSync(f, 'utf8');
  if (s.includes(MARK)) { console.log('SKIP already', f); return; }
  const anchor = '<section id="notice">';
  const p = s.indexOf(anchor);
  if (p < 0) { console.log('SKIP no-anchor', f); return; }
  const items = N.map(i => `      <li style="margin:9px 0;line-height:1.55"><a href="${i.u}" target="_blank" rel="noopener" style="text-decoration:none"><b style="font-size:12px;letter-spacing:.06em;color:#0F766E">${i.o}</b> ${i.t} <span style="font-size:12px;opacity:.6">${i.day}</span></a></li>`).join('\n');
  const sec = `${MARK}
<section id="news"><div class="wrap">
  <div class="sec-head">
    <h2>최근 보도 — 투표록 위·변조</h2>
    <span class="no">§ 4 · 2026. 11. 4. ~ 5.</span>
  </div>
  <p style="max-width:78ch;line-height:1.75;margin:0 0 18px;font-size:15px;opacity:.85">특검이 6·3 지방선거 투표록이 개표 뒤 사후 수정된 정황을 포착해 중앙선관위를 압수수색한 사안입니다. 판단은 붙이지 않고 <b>보도된 제목과 원문 링크</b>만 시간순으로 옮겼습니다.</p>
    <ul style="list-style:none;padding:0;margin:0;border-left:3px solid #DC2626;padding-left:16px">
${items}
    </ul>
</div></section>

`;
  s = s.slice(0, p) + sec + s.slice(p);
  fs.writeFileSync(f, s);
  console.log('ADDED', f, N.length, 'entries');
})();
