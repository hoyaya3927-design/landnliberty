const fs = require('fs');
const base = 'C:/Users/hoyay/Downloads/site-2026-11-09/site-2026-11-09/';
const f = 'teukgeom.html';
let s = fs.readFileSync(base + f, 'utf8');
const rep = [];

// ---------- A) timeline: sort ascending (과거->최신), NEW badge는 11.18행만 ----------
const secA = '<section id="timeline"';
const i0 = s.indexOf(secA);
if (i0 < 0) throw new Error('no #timeline section');
const i1 = s.indexOf('</section>', i0);
let sec = s.slice(i0, i1);
const rows = [];
const re = /<div class="row [^"]*"><div class="date">([^<]*)<\/div>[\s\S]*?<\/div><\/div>/g;
let m;
while ((m = re.exec(sec)) !== null) rows.push({ date: m[1], html: m[0], start: m.index, end: m.index + m[0].length });
if (rows.length === 0) throw new Error('no rows');
function key(d) { const mm = d.match(/^(\d{1,2})\.(\d{1,2})/); return mm ? (+mm[1]) * 100 + (+mm[2]) : null; }
let dated = [], undated = [];
rows.forEach((r, idx) => { const k = key(r.date); (k === null ? undated : dated).push({ r, k, idx }); });
dated.sort((a, b) => a.k - b.k || a.idx - b.idx);
undated.sort((a, b) => a.idx - b.idx);
const ordered = undated.concat(dated).map(x => x.r);
const isSorted = ordered.every((r, i, arr) => i === 0 || key(arr[i - 1].date) === null || key(arr[i - 1].date) <= key(r.date));
if (!isSorted) {
  const first = rows[0].start, last = rows[rows.length - 1].end;
  sec = sec.slice(0, first) + ordered.map(r => r.html).join('') + sec.slice(last);
  s = s.slice(0, i0) + sec + s.slice(i1);
  rep.push('timeline re-sorted');
} else rep.push('timeline already sorted (fix was applied)');
// NEW badges in timeline: keep only 11.18 row
let tRemoved = 0;
const i2 = s.indexOf(secA), i3 = s.indexOf('</section>', i2);
let sec2 = s.slice(i2, i3);
sec2 = sec2.replace(/<span style="display:inline-block;background:#DC2626;color:#fff;font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:9\.5px;font-weight:700;letter-spacing:\.08em;padding:2px 5px;border-radius:4px;vertical-align:middle;margin-left:4px">NEW<\/span>/g, (mm2, off) => {
  const ctx = sec2.slice(Math.max(0, off - 500), off);
  return /="date">11\.18</.test(ctx) ? mm2 : (tRemoved++, '');
});
s = s.slice(0, i2) + sec2 + s.slice(i3);
rep.push('timeline NEW removed: ' + tRemoved);

// ---------- B) video cards: NEW badge 중 cap에 2026.11.18 없으면 제거 ----------
let vRemoved = 0;
s = s.replace(/<span style="display:inline-block;background:#DC2626;color:#fff;font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:9\.5px;font-weight:700;letter-spacing:\.08em;padding:2px 5px;border-radius:4px;vertical-align:middle;margin-left:4px">NEW<\/span>/g, (mm3, off) => {
  const ctx = s.slice(Math.max(0, off - 800), off + 100);
  return /2026\.11\.18/.test(ctx) ? mm3 : (vRemoved++, '');
});
rep.push('video NEW removed: ' + vRemoved);
fs.writeFileSync(base + f, s, 'utf8');
rep.push('NEW remaining in file: ' + (s.match(/NEW<\/span>/g) || []).length);

// ---------- C) cleanup temp scripts ----------
['teuk_timeline_fix.js', 'teuk_update.js'].forEach(x => { try { fs.unlinkSync(base + x); rep.push('deleted ' + x); } catch (e) { rep.push('keep ' + x + ' (' + e.code + ')'); } });

console.log(rep.join('\n'));
console.log('FINAL timeline order: ' + (s.match(/<div class="date">[^<]*/g) || []).map(x => x.replace('<div class="date">', '')).join(' | '));
