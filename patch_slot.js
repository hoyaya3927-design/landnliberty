/* liberty.html #news — 11.23 영장심사 결과 삽입 슬롯 + D-day 박스 교체 마커 (멱등) */
const fs = require('fs');
const f = 'liberty.html';
let s = fs.readFileSync(f, 'utf8');
let n = 0;

/* 1) 목록 맨 끝(11.22 항목 아래)에 복사용 슬롯 주석 심기 */
if (!s.includes('INSERT-1123')) {
  const sec = s.indexOf('<section id="news">');
  const end = s.indexOf('</ul>', s.indexOf('<ul style="list-style:none', sec));
  const slot = [
    '      <!-- INSERT-1123: 11.23 영장심사 결과는 아래 양식 주석을 풀어 값만 교체 (이 줄은 남겨두면 됨)',
    '      <li style="margin:9px 0;line-height:1.55"><a href="URL" target="_blank" rel="noopener" style="text-decoration:none"><b style="font-size:12px;letter-spacing:.06em;color:#0F766E">매체</b> 제목 <span style="font-size:12px;opacity:.6">2026.11.23</span></a></li>',
    '      END-INSERT-1123 -->',
    '    '
  ].join('\n');
  s = s.slice(0, end) + slot + s.slice(end);
  n++;
}

/* 2) 상단 빨간 D-day 안내 박스를 결과 문구로 갈아끼울 수 있게 감싸기 */
if (!s.includes('note-1123:start')) {
  const p = s.indexOf('background:#FEF2F2');
  if (p > 0) {
    const a = s.lastIndexOf('<p style=', p);
    const b = s.indexOf('</p>', p) + 4;
    s = s.slice(0, a) + '<!-- note-1123:start -->\n    ' + s.slice(a, b) +
        '\n    <!-- note-1123:end -->' + s.slice(b);
    n++;
  } else {
    console.log('WARN no-note');
  }
}

fs.writeFileSync(f, s);
console.log(n ? 'PATCHED ' + n + ' slot(s)' : 'SKIP already');
