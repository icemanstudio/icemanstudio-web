/* IceMan Studio · juice.js
   Game-feel details for the site. Keep it light: no libraries, respects prefers-reduced-motion,
   everything degrades to a static page if JS is off. See DESIGN.md → "Juice" before adding more. */
(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lang = document.documentElement.lang || 'en';
  const T = {
    en: { unlocked: 'Achievement unlocked', konami: 'Konami', konamiDesc: 'Frost mode engaged', pixel: 'Pixel curious', pixelDesc: 'Visited the pixel art catalogue', calc: 'Number cruncher', calcDesc: 'Ran a calculator', explorer: 'Explorer', explorerDesc: 'Visited every section', bilingual: 'Bilingual', bilingualDesc: 'Switched language' },
    es: { unlocked: 'Logro desbloqueado', konami: 'Konami', konamiDesc: 'Modo escarcha activado', pixel: 'Curioso del píxel', pixelDesc: 'Visitaste el catálogo de pixel art', calc: 'Calculadora humana', calcDesc: 'Usaste una calculadora', explorer: 'Explorador', explorerDesc: 'Visitaste todas las secciones', bilingual: 'Bilingüe', bilingualDesc: 'Cambiaste de idioma' }
  }[lang.startsWith('es') ? 'es' : 'en'];

  // ---------- storage (best effort) ----------
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem('ims:' + k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem('ims:' + k, JSON.stringify(v)); } catch {} }
  };

  // ---------- achievements ----------
  const unlocked = new Set(store.get('ach', []));
  let toastTimer;
  function achieve(id, title, desc, icon) {
    if (unlocked.has(id)) return;
    unlocked.add(id); store.set('ach', [...unlocked]);
    let el = document.querySelector('.ach');
    if (!el) { el = document.createElement('div'); el.className = 'ach'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
    el.innerHTML = `<div class="ico">${icon}</div><div><small>${T.unlocked}</small><b>${title}</b><div class="small muted">${desc}</div></div>`;
    requestAnimationFrame(() => el.classList.add('show'));
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 4200);
  }

  // ---------- entrance + scroll reveal ----------
  document.querySelectorAll('.hero > *').forEach((n, i) => n.classList.add('rise', 'd' + Math.min(i, 3)));
  const targets = document.querySelectorAll('section:not(.hero) .card, section:not(.hero) h2, section:not(.hero) .lead');
  if (reduced || !('IntersectionObserver' in window)) targets.forEach((n) => n.classList.add('reveal', 'in'));
  else {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    targets.forEach((n) => { n.classList.add('reveal'); io.observe(n); });
  }

  // ---------- count-up on calculator results ----------
  function countUp(el) {
    if (reduced) return;
    const m = el.textContent.match(/([\d.,]+)/); if (!m) return;
    const raw = m[1]; const num = Number(raw.replace(/[.,]/g, '')); if (!num || num > 1e9) return;
    const decimals = 0; const start = performance.now(); const dur = 500; const before = el.textContent;
    const fmt = (v) => before.replace(raw, new Intl.NumberFormat(lang).format(Math.round(v)));
    const step = (t) => { const p = Math.min(1, (t - start) / dur); const e = 1 - Math.pow(1 - p, 3); el.textContent = fmt(num * e); if (p < 1) requestAnimationFrame(step); else el.textContent = before; };
    requestAnimationFrame(step);
  }
  const results = document.querySelectorAll('.result');
  const mo = new MutationObserver((ms) => ms.forEach((m) => { if (m.attributeName === 'hidden' && !m.target.hidden) { const v = m.target.querySelector('span'); if (v) countUp(v); achieve('calc', T.calc, T.calcDesc, '🧮'); } }));
  results.forEach((r) => mo.observe(r, { attributes: true }));

  // ---------- section explorer ----------
  const path = location.pathname.replace(/^\/es/, '').replace(/\/$/, '') || '/';
  const seen = new Set(store.get('seen', [])); seen.add(path); store.set('seen', [...seen]);
  if (path === '/pixel-art') achieve('pixel', T.pixel, T.pixelDesc, '🎨');
  if (['/assets', '/pixel-art', '/services', '/tools'].every((p) => seen.has(p))) achieve('explorer', T.explorer, T.explorerDesc, '🧭');
  const langs = new Set(store.get('langs', [])); langs.add(lang.slice(0, 2)); store.set('langs', [...langs]);
  if (langs.size >= 2) achieve('bilingual', T.bilingual, T.bilingualDesc, '🌐');

  // ---------- konami → frost mode ----------
  const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let pos = 0;
  window.addEventListener('keydown', (e) => {
    pos = e.key === code[pos] ? pos + 1 : (e.key === code[0] ? 1 : 0);
    if (pos === code.length) { pos = 0; frost(); achieve('konami', T.konami, T.konamiDesc, '❄️'); }
  });
  function frost() {
    if (document.querySelector('.snow') || reduced) return;
    const c = document.createElement('canvas'); c.className = 'snow'; document.body.appendChild(c);
    const ctx = c.getContext('2d'); let w, h; const flakes = [];
    const size = () => { w = c.width = innerWidth; h = c.height = innerHeight; }; size(); addEventListener('resize', size);
    for (let i = 0; i < 140; i++) flakes.push({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, r: 1 + Math.random() * 2.5, s: .4 + Math.random() * 1.2, d: Math.random() * 6.28 });
    (function draw() { ctx.clearRect(0, 0, w, h); ctx.fillStyle = 'rgba(224,242,254,.85)'; for (const f of flakes) { f.y += f.s; f.x += Math.sin(f.d += .01) * .3; if (f.y > h) { f.y = -4; f.x = Math.random() * w; } ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, 6.28); ctx.fill(); } requestAnimationFrame(draw); })();
  }

  // ---------- console greeting (for the devs who look) ----------
  try { console.log('%cIceMan Studio %c— hello, fellow developer. Try the Konami code.', 'color:#38BDF8;font-weight:900;font-size:16px', 'color:#9AA3AD'); } catch {}
})();
