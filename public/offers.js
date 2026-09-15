/* Live offers: mirrors src/data/offers.js logic in the browser so prices on cards, product pages and the store banner
   reflect today's date even if the site was built days ago. The worker recomputes at checkout; this is display only. */
(() => {
  const lang = (document.documentElement.lang || 'en').slice(0, 2);
  const T = lang === 'es' ? { off: 'de descuento', ends: 'La oferta termina el', code: 'Código' } : { off: 'off', ends: 'Offer ends', code: 'Code' };
  const fmt = (n) => new Intl.NumberFormat(lang, { style: 'currency', currency: 'EUR' }).format(n);
  const ymd = (d) => d.toISOString().slice(0, 10); const md = (d) => ymd(d).slice(5);
  const bfw = (y) => { const nov1 = new Date(Date.UTC(y, 10, 1)); const ft = 1 + ((4 - nov1.getUTCDay() + 7) % 7); const bf = new Date(Date.UTC(y, 10, ft + 22)); const end = new Date(bf); end.setUTCDate(bf.getUTCDate() + 3); return { from: ymd(bf), until: ymd(end) }; };
  const now = new Date(); const today = ymd(now);
  const active = (o, p) => {
    if (o.kind === 'range') return !!o.from && !!o.until && o.from <= today && today <= o.until;
    if (o.kind === 'season') { const t = md(now); return o.start <= o.end ? (o.start <= t && t <= o.end) : (t >= o.start || t <= o.end); }
    if (o.kind === 'blackfriday') { const w = bfw(now.getUTCFullYear()); return w.from <= today && today <= w.until; }
    if (o.kind === 'launch') { if (!p || !p.released) return false; const diff = (now - new Date(p.released + 'T00:00:00Z')) / 86400000; return diff >= 0 && diff < o.days; }
    return false;
  };
  const until = (o, p) => {
    if (o.kind === 'range') return o.until;
    if (o.kind === 'season') { const y = now.getUTCFullYear(); const wraps = o.start > o.end && md(now) >= o.start; return `${y + (wraps ? 1 : 0)}-${o.end}`; }
    if (o.kind === 'blackfriday') return bfw(now.getUTCFullYear()).until;
    if (o.kind === 'launch') { const d = new Date(p.released + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + o.days - 1); return ymd(d); }
    return '';
  };
  const applies = (o, p) => o.products === 'all' || o.products === `cat:${p.cat}` || (Array.isArray(o.products) && o.products.includes(p.slug));
  fetch('/offers.json').then((r) => r.json()).then(({ offers, products }) => {
    const bySlug = Object.fromEntries(products.map((p) => [p.slug, p]));
    // cards and buy boxes carry data-slug; update their price tags
    document.querySelectorAll('[data-slug]').forEach((el) => {
      const p = bySlug[el.dataset.slug]; if (!p) return;
      const o = offers.filter((x) => applies(x, p) && active(x, p)).sort((a, b) => b.percent - a.percent)[0] || null;
      const final = o ? Math.round(p.price * (100 - o.percent)) / 100 : p.price;
      const tags = el.querySelector('.price-tags'); const big = el.querySelector('.price');
      if (tags) tags.innerHTML = o ? `<span class="tag sale">-${o.percent}%</span><span class="tag"><s style="opacity:.6">${fmt(p.price)}</s> ${fmt(final)}</span>` : `<span class="tag">${fmt(p.price)}</span>`;
      if (big) {
        big.innerHTML = o ? `<span class="big">${fmt(final)}</span> <s class="muted">${fmt(p.price)}</s> <span class="tag sale">-${o.percent}% ${T.off}</span>` : `<span class="big">${fmt(p.price)}</span>`;
        const note = el.querySelector('.offer-note'); if (note) { note.hidden = !o; if (o) note.textContent = `${o.name[lang]} · ${T.ends} ${until(o, p)}${o.code ? ` · ${T.code}: ${o.code}` : ''}`; }
      }
    });
    // store banner
    const banner = document.getElementById('offer-banner');
    if (banner) {
      const list = offers.filter((o) => o.kind !== 'launch' && active(o));
      banner.hidden = list.length === 0;
      banner.innerHTML = list.map((o) => `<p style="margin:0"><strong>${o.name[lang]}:</strong> -${o.percent}% · ${T.ends} ${until(o)}${o.code ? ` · ${T.code} ${o.code}` : ''}</p>`).join('');
    }
  }).catch(() => {});
})();
