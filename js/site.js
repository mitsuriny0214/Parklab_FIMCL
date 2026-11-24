/* Park Group site renderer. Used by the public page and by the admin preview. */
(function (root) {
  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const num = (v, d) => { v = parseFloat(v); return isFinite(v) ? v : d; };
  const col = v => (/^#[0-9a-f]{3,8}$/i.test(v || '') ? v : '');
  const pick = (v, list, d) => (list.indexOf(v) >= 0 ? v : d);
  const safeUrl = u => { u = String(u || '').trim(); return /^(javascript|data|vbscript):/i.test(u) ? '#' : u; };

  if (root.marked) root.marked.use({ renderer: { html() { return ''; } } }); // drop raw HTML typed into text boxes
  const fixLinks = h => h.replace(/<a href="(javascript|data|vbscript):[^"]*"/gi, '<a href="#"')
    .replace(/<a href="(https?:)/g, '<a target="_blank" rel="noopener" href="$1');
  const md = s => fixLinks(root.marked ? root.marked.parse(String(s || '')) : esc(s));
  const mdInline = s => fixLinks(root.marked ? root.marked.parseInline(String(s || '')) : esc(s));

  const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const fmtDate = d => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(d || '')); return m ? MON[+m[2] - 1] + ' ' + (+m[3]) + ', ' + m[1] : esc(d); };

  // Style fields -> CSS variables. Empty fields fall back to the stylesheet defaults.
  function vars(b, extra) {
    const s = b.style || {}, v = [];
    const fs = num(s.font_size, 0), hfs = num(s.heading_size, 0);
    if (fs > 0) v.push('--fs:' + Math.min(fs, 120) + 'px');
    if (hfs > 0) v.push('--hfs:' + Math.min(hfs, 160) + 'px');
    if (col(s.text_color)) v.push('--fg:' + col(s.text_color));
    if (col(s.heading_color)) v.push('--hfg:' + col(s.heading_color));
    if (col(s.bg_color)) v.push('--bg:' + col(s.bg_color));
    if (s.pad_top !== undefined && s.pad_top !== null && s.pad_top !== '') v.push('--pt:' + Math.max(0, Math.min(num(s.pad_top, 40), 400)) + 'px');
    if (s.pad_bottom !== undefined && s.pad_bottom !== null && s.pad_bottom !== '') v.push('--pb:' + Math.max(0, Math.min(num(s.pad_bottom, 40), 400)) + 'px');
    v.push('--al:' + pick(s.align, ['left', 'center', 'right'], 'left'));
    return v.concat(extra || []).join(';');
  }
  const blk = (cls, b, inner, extra, wrapIn = true) =>
    '<section class="blk ' + cls + '" style="' + esc(vars(b, extra)) + '">' + (wrapIn ? '<div class="wrap">' + inner + '</div>' : inner) + '</section>';

  const R = {
    hero(b, o) {
      const abs = u => { try { return new URL(u, root.document.baseURI).href; } catch (e) { return u; } }; // CSS variables resolve urls against the stylesheet, so make it absolute
      const img = b.image ? 'url("' + abs(o.img(b.image)).replace(/"/g, '%22') + '")' : 'none';
      const inner = '<div class="hin">' + (b.kicker ? '<p class="kicker">' + esc(b.kicker) + '</p>' : '') +
        (b.title ? '<h1 class="title">' + esc(b.title) + '</h1>' : '') + '</div>';
      return blk('blk-hero', b, inner, ['--h:' + Math.max(80, Math.min(num(b.height, 324), 900)) + 'px', '--img:' + img, '--ov:' + Math.max(0, Math.min(num(b.overlay, 0), 90)) / 100], false);
    },
    text(b) {
      return blk('blk-text', b, (b.heading ? '<h2>' + esc(b.heading) + '</h2>' : '') + '<div class="md">' + md(b.body) + '</div>');
    },
    image_text(b, o) {
      const iw = Math.max(10, Math.min(num(b.image_width, 40), 100));
      const va = pick(b.vertical_align, ['flex-start', 'center', 'flex-end'], 'flex-start');
      const pic = b.image ? '<div class="pic"><img src="' + esc(o.img(b.image)) + '" alt="' + esc(b.alt || '') + '"></div>' : '';
      const txt = '<div class="txt">' + (b.heading ? '<h2>' + esc(b.heading) + '</h2>' : '') + '<div class="md">' + md(b.body) + '</div></div>';
      return blk('blk-it', b, '<div class="row ' + (b.image_side === 'right' ? 'right' : 'left') + '">' + pic + txt + '</div>', ['--iw:' + iw + '%', '--va:' + va]);
    },
    image(b, o) {
      const iw = Math.max(10, Math.min(num(b.image_width, 100), 100));
      const al = pick((b.style || {}).align, ['left', 'center', 'right'], 'left');
      const ml = al === 'left' ? '0' : 'auto', mr = al === 'right' ? '0' : 'auto';
      const fig = b.image ? '<figure><img src="' + esc(o.img(b.image)) + '" alt="' + esc(b.alt || '') + '">' + (b.caption ? '<figcaption>' + esc(b.caption) + '</figcaption>' : '') + '</figure>' : '';
      return blk('blk-img', b, fig, ['--iw:' + iw + '%', '--ml:' + ml, '--mr:' + mr]);
    },
    news_list(b) {
      const items = (b.items || []).filter(i => i && i.text).map((i, n) => ({ i, n }))
        .sort((a, c) => String(c.i.date || '').localeCompare(String(a.i.date || '')) || a.n - c.n);
      const list = items.map(({ i }) => '<div class="item"><div class="date">' + fmtDate(i.date) + '</div><div class="tx">' + mdInline(i.text) + '</div></div>').join('');
      const side = b.side_text ? '<aside class="side md">' + md(b.side_text) + '</aside>' : '';
      return blk('blk-news', b, '<div class="cols"><div class="main">' + (b.heading ? '<h2>' + esc(b.heading) + '</h2>' : '') + list + '</div>' + side + '</div>');
    },
    button(b) {
      const color = col(b.button_color);
      return blk('blk-btn', b, b.label ? '<a class="b" href="' + esc(safeUrl(b.url)) + '">' + esc(b.label) + '</a>' : '', color ? ['--btn:' + color] : []);
    },
    spacer(b) {
      return blk('blk-spacer', b, '', ['--sh:' + Math.max(0, Math.min(num(b.height, 60), 600)) + 'px'], false);
    }
  };

  function renderBlocks(blocks, opts) {
    const o = Object.assign({ img: p => p }, opts || {});
    return (blocks || []).map(b => (b && R[b.type]) ? R[b.type](b, o) : '').join('');
  }
  function renderHeader(h, current) {
    h = h || {};
    const nav = (h.menu || []).map(m => '<a href="' + esc(safeUrl(m.url)) + '"' + (m.url === current ? ' aria-current="page"' : '') + '>' + esc(m.label) + '</a>').join('');
    const st = (col(h.bg_color) ? '--hbg:' + col(h.bg_color) + ';' : '') + (col(h.button_color) ? '--cta:' + col(h.button_color) : '');
    return '<header class="site-header" style="' + esc(st) + '"><div class="bar"><a class="logo" href="index.html">' +
      (h.logo ? '<img src="' + esc(h.logo) + '" alt="Park Group">' : '<strong>Park Group</strong>') + '</a>' +
      '<nav id="main-nav">' + nav + '</nav>' +
      (h.button_label ? '<a class="cta" href="' + esc(safeUrl(h.button_url)) + '">' + esc(h.button_label) + '</a>' : '') +
      '<button class="burger" type="button" aria-label="Menu" aria-expanded="false">☰</button></div></header>';
  }
  function renderFooter(f) {
    f = f || {};
    const st = (col(f.bg_color) ? '--fbg:' + col(f.bg_color) + ';' : '') + (col(f.text_color) ? '--ffg:' + col(f.text_color) : '');
    return '<footer class="site-footer" style="' + esc(st) + '"><div class="fin">' +
      '<div class="flogo">' + (f.logo ? '<img src="' + esc(f.logo) + '" alt="">' : '') + '</div>' +
      '<div class="ftxt md">' + md(f.text) + '</div></div></footer>';
  }
  function wireMenu(scope) {
    const hd = scope.querySelector('.site-header'), bt = scope.querySelector('.burger');
    if (!hd || !bt) return;
    bt.addEventListener('click', () => { const o = hd.classList.toggle('open'); bt.setAttribute('aria-expanded', o); bt.textContent = o ? '×' : '☰'; });
  }

  root.PL = { renderBlocks, renderHeader, renderFooter, wireMenu, md };

  // Public page bootstrap (skipped inside the admin preview).
  if (root.document && document.getElementById('site-main')) {
    const get = u => fetch(u, { cache: 'no-cache' }).then(r => { if (!r.ok) throw new Error(u + ' ' + r.status); return r.json(); });
    const page = document.body.dataset.page || 'home';
    Promise.all([get('content/' + page + '.json'), get('content/site.json')]).then(([p, s]) => {
      if (s.site_title) document.title = s.site_title;
      document.getElementById('site-header').innerHTML = renderHeader(s.header, 'index.html');
      document.getElementById('site-main').innerHTML = renderBlocks(p.blocks);
      document.getElementById('site-footer').innerHTML = renderFooter(s.footer);
      wireMenu(document);
      document.documentElement.dataset.ready = '1';
    }).catch(e => {
      document.getElementById('site-main').innerHTML = '<p class="empty-note">페이지 내용을 불러오지 못했어요. (' + esc(e.message) + ')</p>';
    });
  }
})(window);
