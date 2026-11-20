// patch-site.js — 2026-11-21 갱신 (전과 지도 내용 보강 + 파일 간 연결 감사)
const fs = require('fs'), path = require('path');
const ROOT = process.cwd();
const BAK = '.bak-20261121';
const log = { changed: [], missing: [], broken: {}, fixedLinks: [], notes: [] };
const bakFile = f => { const b = f + BAK; if (!fs.existsSync(b)) fs.copyFileSync(f, b); };

// ---------- 1. HTML 파일 전수 링크 감사 ----------
function listHtml(dir) {
  let out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === '.git' || e.name === 'node_modules') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out = out.concat(listHtml(p));
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}
const htmls = listHtml(ROOT);
const broken = {};
for (const f of htmls) {
  const src = fs.readFileSync(f, 'utf8');
  const rel = path.dirname(f);
  for (const m of src.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const h = m[1];
    if (!h || h.startsWith('#') || /^(https?:|mailto:|javascript:|data:)/.test(h)) continue;
    if (h.includes('${')) continue; // JS 템플릿 동적 링크
    const clean = h.split('#')[0].split('?')[0];
    if (!clean) continue;
    let target;
    try { target = path.resolve(rel, decodeURIComponent(clean)); } catch (e) { target = path.resolve(rel, clean); }
    if (!fs.existsSync(target)) (broken[f] = broken[f] || []).push(h);
  }
}

// ---------- 2. 전과 지도(MEMBERS/GLOBAL_SOURCES/기준일/빈 href) 패치 ----------
const MAP = path.join(ROOT, '22대-국회-전과-지도.html');
let map = fs.readFileSync(MAP, 'utf8');
bakFile(MAP);

function parseArrayEnd(s, i) {
  let depth = 0, inStr = false, esc = false;
  for (let j = i; j < s.length; j++) {
    const ch = s[j];
    if (inStr) { if (esc) esc = false; else if (ch === '\\') esc = true; else if (ch === '"') inStr = false; }
    else { if (ch === '"') inStr = true; else if (ch === '[') depth++; else if (ch === ']') { depth--; if (depth === 0) return j + 1; } }
  }
  return -1;
}
const mStart = map.indexOf('const MEMBERS=');
const aStart = map.indexOf('[', mStart);
const aEnd = parseArrayEnd(map, aStart);
if (aEnd < 0) { log.missing.push('MEMBERS 배열 종료 미발견'); }
else {
  const MEMBERS = JSON.parse(map.slice(aStart, aEnd));
  const zj = MEMBERS.find(x => x.id === '정준호' || x.name === '정준호');
  if (zj) {
    zj.latest = '2026.9.18 1심 벌금 1,000만 원(당선무효형) → 항소 · 재기소 사건 검찰 징역 2년 구형(2026.7.13)';
    zj.sources = zj.sources || [];
    const us = new Set(zj.sources.map(s => s.u));
    for (const s of [
      { t: '연합뉴스 · 정준호 재기소 사건 징역 2년 구형', u: 'https://www.yna.co.kr/view/AKR20260713148500054' },
      { t: '경향신문 · 정준호 1심 벌금 1,000만 원', u: 'https://www.khan.co.kr/article/202609181230001' },
      { t: 'KBS · 정준호 1심 당선무효형 "즉각 항소"', u: 'https://news.kbs.co.kr/news/view.do?ncd=8667571' }
    ]) if (!us.has(s.u)) zj.sources.push(s);
    log.changed.push('전과지도 MEMBERS:정준호 갱신(재기소 구형 + 출처 3건)');
  } else log.missing.push('MEMBERS:정준호');
  map = map.slice(0, aStart) + JSON.stringify(MEMBERS) + map.slice(aEnd);
}
// GLOBAL_SOURCES 뒤에 검색 보강 출처 추가
const gStart = map.indexOf('const GLOBAL_SOURCES=[');
if (gStart >= 0) {
  const gEnd = map.indexOf('];', gStart);
  if (gEnd >= 0) {
    const add =
      "\n  {t:'연합뉴스 · 정준호 재기소 사건 징역 2년 구형',u:'https://www.yna.co.kr/view/AKR20260713148500054',d:'2026.7.13 구형'}" +
      "\n  ,{t:'경향신문 · 정준호 1심 벌금 1,000만 원',u:'https://www.khan.co.kr/article/202609181230001',d:'2026.9.18 광주지법'}" +
      "\n  ,{t:'KBS · 정준호 1심 당선무효형 · 항소',u:'https://news.kbs.co.kr/news/view.do?ncd=8667571',d:'2026.11.21 검색 보강'},";
    map = map.slice(0, gEnd) + add + map.slice(gEnd);
    log.changed.push('전과지도 GLOBAL_SOURCES +3건(2026-11-21 검색 보강)');
  }
}
// 지도 기준일 갱신 (지도 페이지 한정 — 뉴스 보강이 반영된 날짜)
if (map.includes('2026-11-07')) {
  map = map.split('기준일 2026-11-07').join('기준일 2026-11-21(검색 보강)');
  log.changed.push('전과지도 기준일 표기 → 2026-11-21(검색 보강)');
}
// caseSource가 빈 카드의 빈 href(href="") 방지
const guard = 'href="${esc(m.caseSource||\'#\')}"';
if (map.includes('href="${esc(m.caseSource)}"')) {
  map = map.split('href="${esc(m.caseSource)}"').join(guard);
  log.changed.push('전과지도 빈 caseSource href="#" 가드 적용');
}
fs.writeFileSync(MAP, map);

// ---------- 3. MEMBER_LINKS ↔ members/ 폴더 실재 검증·복구 ----------
const TDIR = path.join(ROOT, '22대-국회의원-공개추적-갱신본');
const MEMDIR = path.join(TDIR, 'members');
const memFiles = new Set(fs.readdirSync(MEMDIR));
const mlStart = map.indexOf('const MEMBER_LINKS =');
const mbStart = map.indexOf('{', mlStart);
const mbEnd = map.indexOf('};', mbStart);
if (mbEnd > 0) {
  const LINKS = JSON.parse(map.slice(mbStart, mbEnd + 1));
  let changed = false;
  for (const [name, file] of Object.entries(LINKS)) {
    if (memFiles.has(file)) continue;
    const hit = [...memFiles].find(f => f.endsWith('-' + name + '.html'));
    if (hit) { LINKS[name] = hit; changed = true; log.fixedLinks.push('MEMBER_LINKS ' + name + ': ' + file + ' → ' + hit); }
    else log.missing.push('members/' + file + ' (' + name + ') 대체 파일 없음');
  }
  if (changed) {
    map = map.slice(0, mbStart) + JSON.stringify(LINKS) + map.slice(mbEnd + 1);
    fs.writeFileSync(MAP, map);
  }
  log.changed.push('MEMBER_LINKS ' + Object.keys(LINKS).length + '건 전수 검증 완료');
} else log.missing.push('MEMBER_LINKS 블록 미발견');

// ---------- 4. cases.html 정준호 카드 갱신 ----------
const CASES = path.join(TDIR, 'cases.html');
let cases = fs.readFileSync(CASES, 'utf8');
bakFile(CASES);
const oldL = '최근: 2026.9.18 1심 벌금 1,000만 원 → 항소';
if (cases.includes(oldL)) {
  cases = cases.split(oldL).join('최근: 2026.9.18 1심 벌금 1,000만 원(당선무효형) → 항소 · 재기소 사건 징역 2년 구형(2026.7.13)');
  log.changed.push('cases.html 정준호 카드 갱신');
} else log.missing.push('cases.html 정준호 카드 문구 불일치');
fs.writeFileSync(CASES, cases);

log.broken = broken;
log.summary = {
  htmlAudited: htmls.length,
  brokenFiles: Object.keys(broken).length,
  brokenLinks: Object.values(broken).reduce((a, b) => a + b.length, 0)
};
console.log(JSON.stringify(log, null, 1));
