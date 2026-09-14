/* Header store search: fetches /search.json once, filters client-side, dropdown of results. Enter goes to the store filtered by ?q=. */
(() => {
  const box = document.getElementById('site-search'); if (!box) return;
  const input = box.querySelector('input'); const list = box.querySelector('.results');
  const lang = (document.documentElement.lang || 'en').slice(0, 2); const base = lang === 'es' ? '/es' : '';
  const fmt = (n) => n === 0 ? (lang === 'es' ? 'Gratis' : 'Free') : new Intl.NumberFormat(lang, { style: 'currency', currency: 'EUR' }).format(n);
  let data = null;
  const norm = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const load = async () => { if (!data) { try { data = await (await fetch('/search.json')).json(); } catch { data = []; } } return data; };
  const match = (rows, q) => { q = norm(q).trim(); if (!q) return []; const terms = q.split(/\s+/); return rows.filter((r) => { const hay = norm([r.name, r.sub[lang], r.short[lang], r.catName[lang], r.slug].join(' ')); return terms.every((t) => hay.includes(t)); }).slice(0, 6); };
  const render = (rows) => {
    if (!rows.length) { list.hidden = true; list.innerHTML = ''; return; }
    list.innerHTML = rows.map((r) => `<a href="${base}/assets/${r.slug}/"><img src="${r.cover}" alt="" loading="lazy"><span><b>${r.name}</b><small>${r.sub[lang]}</small></span><em>${fmt(r.price)}</em></a>`).join('');
    list.hidden = false;
  };
  let t; input.addEventListener('input', () => { clearTimeout(t); t = setTimeout(async () => render(match(await load(), input.value)), 80); });
  input.addEventListener('focus', load, { once: true });
  input.addEventListener('keydown', (e) => { if (e.key === 'Escape') { list.hidden = true; input.blur(); } });
  document.addEventListener('click', (e) => { if (!box.contains(e.target)) list.hidden = true; });
  box.addEventListener('submit', (e) => { e.preventDefault(); const q = input.value.trim(); location.href = `${base}/assets/${q ? '?q=' + encodeURIComponent(q) : ''}`; });
  // "/" focuses search (gamer/dev habit)
  window.addEventListener('keydown', (e) => { if (e.key === '/' && !/input|textarea|select/i.test(document.activeElement?.tagName || '')) { e.preventDefault(); input.focus(); } });
  // Store page: filter cards by ?q=
  const q = new URLSearchParams(location.search).get('q');
  if (q && /\/assets\/?$/.test(location.pathname)) {
    input.value = q; const terms = norm(q).split(/\s+/);
    let shown = 0;
    document.querySelectorAll('.card.product').forEach((c) => { const ok = terms.every((t) => norm(c.textContent).includes(t)); c.style.display = ok ? '' : 'none'; if (ok) shown++; });
    document.querySelectorAll('section[id]').forEach((s) => { const any = [...s.querySelectorAll('.card.product')].some((c) => c.style.display !== 'none'); s.style.display = any ? '' : 'none'; });
    const h = document.querySelector('main h2'); if (h) h.insertAdjacentHTML('afterend', `<p class="lead" id="q-note">${shown} ${lang === 'es' ? 'resultados para' : 'results for'} "${q}" · <a href="${base}/assets/">${lang === 'es' ? 'ver todo' : 'show all'}</a></p>`);
  }
})();
