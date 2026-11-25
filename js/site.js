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
  // 이메일 주소가 자동 링크로 바뀌어 밑줄이 생기지 않게 (원본은 글자만 표시)
  const plainMail = h => h.replace(/<a href="mailto:([^"]*)">([^<]*)<\/a>/g, (m, a, t) => (a === t ? t : m));
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
    /* ===== 하위 페이지용 블록 (Home 블록은 위에서 그대로) ===== */
    page_title(b) {
      const st = b.style || {};
      const btn = b.button_label ? '<a class="pt-btn" href="' + esc(safeUrl(b.button_url)) + '">' + esc(b.button_label) + '</a>' : '';
      const inner = '<div class="pt-row"><h1>' + esc(b.title) + '</h1>' + btn + '</div>' +
        (b.rule === false ? '' : '<hr class="rule" style="margin-top:' + Math.max(0, Math.min(num(b.rule_gap, 28), 200)) + 'px">');
      return blk('blk-pg blk-pt' + (b.title_regular ? ' reg' : ''), b, inner);
    },
    richtext(b) {
      const w = num(b.width, 0);
      return blk('blk-pg blk-rt', b, '<div class="rt"' + (w > 0 ? ' style="max-width:' + Math.min(w, 1020) + 'px"' : '') + '>' +
        (b.heading ? '<h2>' + esc(b.heading) + '</h2>' : '') + '<div class="md">' + md(b.body) + '</div></div>');
    },
    slideshow(b, o) {
      const imgs = (b.images || []).filter(i => i && i.image);
      const h = Math.max(200, Math.min(num(b.height, 662), 1200));
      const slides = imgs.map((i, n) => '<img class="ss-img' + (n === 0 ? ' on' : '') + '" src="' + esc(o.img(i.image)) + '" alt="' + esc(i.alt || '') + '">').join('');
      const btn = b.button_label ? '<a class="ss-btn" href="' + esc(safeUrl(b.button_url)) + '">' + esc(b.button_label) + '</a>' : '';
      return blk('blk-pg blk-ss', b, '<div class="ss" data-ss="' + Math.max(0, num(b.interval, 5)) + '" style="--ssn:' + h + '">' + slides + btn + '</div>');
    },
    members(b, o) {
      const items = (b.items || []).filter(Boolean).map(m => {
        const pic = m.photo ? '<div class="mem-pic"><img src="' + esc(o.img(m.photo)) + '" alt="' + esc(m.name || '') + '"></div>' : '<div class="mem-pic"></div>';
        const nm = m.name ? '<' + (m.name_large ? 'h3' : 'h4') + ' class="mem-name' + (m.name_large ? ' big' : '') + '">' + esc(m.name) + '</' + (m.name_large ? 'h3' : 'h4') + '>' : '';
        return '<div class="mem">' + pic + '<div class="mem-tx">' + nm + (m.role ? '<div class="mem-role md">' + md(m.role) + '</div>' : '') +
          (m.details ? '<div class="md mem-d">' + plainMail(md(m.details)) + '</div>' : '') + (m.links ? '<div class="mem-links md">' + md(m.links) + '</div>' : '') + '</div></div>';
      }).join('');
      return blk('blk-pg blk-mem', b, (b.rule_top ? '<hr class="rule">' : '') + (b.heading ? '<h3 class="sec-h">' + esc(b.heading) + '</h3>' : '') + items);
    },
    line_list(b) {
      const items = (b.items || []).filter(i => i && i.text).map(i => '<p>' + mdInline(i.text) + '</p>').join('');
      return blk('blk-pg blk-ll', b, (b.heading ? '<p class="ll-h">' + esc(b.heading) + '</p>' : '') + '<div class="ll">' + items + '</div>');
    },
    course_list(b) {
      const rows = (b.items || []).filter(i => i && (i.code || i.title)).map(i =>
        '<div class="crs"><h4>' + esc(i.code) + '</h4><p>' + mdInline(i.title) + '</p></div><hr class="rule">').join('');
      return blk('blk-pg blk-crs', b, rows);
    },
    publications(b, o) {
      const groups = (b.groups || []).filter(Boolean).map(g => {
        const items = (g.items || []).filter(Boolean).map(p => {
          const t = mdInline(p.title);
          const ttl = '<p class="pub-t">' + (p.number ? esc(p.number) + '. ' : '') + (p.url ? '<a target="_blank" rel="noopener" href="' + esc(safeUrl(p.url)) + '">' + t + '</a>' : t) + '</p>';
          const ps = [p.authors, p.journal, p.note].filter(x => x && String(x).trim()).map(x => '<p>' + mdInline(x) + '</p>').join('');
          const ims = (p.images || []).filter(i => i && i.image).map(i => '<img src="' + esc(o.img(i.image)) + '" alt="' + esc(i.alt || '') + '" style="width:' + Math.max(40, Math.min(num(i.width, 230), 400)) + 'px">').join('');
          return '<article class="pub' + (ims ? ' has-img' : '') + '"><div class="pub-tx">' + ttl + ps + '</div>' + (ims ? '<div class="pub-im">' + ims + '</div>' : '') + '</article>';
        }).join('');
        return '<div class="pub-g">' + (g.year ? '<p class="pub-y">' + esc(g.year) + '</p>' : '') + items + '</div>';
      }).join('');
      return blk('blk-pg blk-pub', b, groups);
    },
    photo_grid(b, o) {
      const cols = Math.max(1, Math.min(num(b.columns, 4), 8));
      const items = (b.items || []).filter(i => i && i.image);
      const tiles = items.map((i, n) => '<figure class="ph"><a class="ph-a" href="' + esc(o.img(i.image)) + '" data-lb="' + n + '" data-t="' + esc(i.title || '') + '"><img src="' + esc(o.img(i.image)) + '" alt="' + esc(i.title || '') + '" loading="lazy"></a>' +
        (i.title ? '<figcaption>' + esc(i.title) + '</figcaption>' : '') + '</figure>').join('');
      return blk('blk-pg blk-ph', b, '<div class="ph-grid" data-lbgroup style="--cols:' + cols + '">' + tiles + '</div>');
    },
    two_columns(b) {
      const lw = Math.max(20, Math.min(num(b.left_width, 66), 80));
      const q = String(b.map_query || '').trim();
      const map = q ? '<div class="map" style="height:' + Math.max(120, Math.min(num(b.map_height, 384), 900)) + 'px"><iframe loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="map" src="https://maps.google.com/maps?q=' + encodeURIComponent(q) + '&z=' + Math.max(1, Math.min(num(b.map_zoom, 15), 21)) + '&output=embed"></iframe></div>' : '';
      return blk('blk-pg blk-tc', b, '<div class="tc" style="--lw:' + lw + '%"><div class="tc-l">' + (b.left_heading ? '<h1>' + esc(b.left_heading) + '</h1>' : '') + '<div class="md">' + plainMail(md(b.left_body)) + '</div></div>' +
        '<div class="tc-r">' + (b.right_heading ? '<h3>' + esc(b.right_heading) + '</h3>' : '') + '<div class="md">' + plainMail(md(b.right_body)) + '</div>' + map + '</div></div>');
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
    const cur = String(current || '').replace(/^\.\//, '');
    const same = u => { u = String(u || '').replace(/^\.\//, '').split('#')[0].split('?')[0]; return u === cur || (cur === 'index.html' && (u === '' || u === './')); };
    const nav = (h.menu || []).map(m => '<a href="' + esc(safeUrl(m.url)) + '"' + (same(m.url) ? ' aria-current="page"' : '') + '>' + esc(m.label) + '</a>').join('');
    const st = (col(h.bg_color) ? '--hbg:' + col(h.bg_color) + ';' : '') + (col(h.button_color) ? '--cta:' + col(h.button_color) : '');
    return '<header class="site-header" style="' + esc(st) + '"><div class="bar"><a class="logo" href="index.html">' +
      (h.logo ? '<img src="' + esc(h.logo) + '" alt="Park Group">' : '<strong>Park Group</strong>') + '</a>' +
      '<nav id="main-nav">' + nav + '</nav>' +
      (h.button_label ? '<a class="cta" href="' + esc(safeUrl(h.button_url)) + '">' + esc(h.button_label) + '</a>' : '') +
      '<button class="burger" type="button" aria-label="Menu" aria-expanded="false">☰</button></div></header>';
  }
  function renderFooter(f) {
    f = f || {};
    // Keep existing CMS content, including the original combined contact/copyright field.
    const legacy = String(f.text || '');
    const copyrightAt = legacy.search(/Copyright\s*(?:©|\(c\))/i);
    const contact = copyrightAt >= 0 ? legacy.slice(0, copyrightAt).trim() : legacy;
    const fallbackCopyright = copyrightAt >= 0 ? legacy.slice(copyrightAt).trim() :
      'Copyright © 2026 The Park Group - Functional Inorganic Materials Chemistry Laboratory (FIMCL)\n\nAll rights reserved.';
    const copyright = f.copyright_text == null ? fallbackCopyright : String(f.copyright_text);
    const limit = (value, fallback, lo, hi) => Math.max(lo, Math.min(num(value, fallback), hi));
    const css = [
      '--fbg:' + (col(f.bg_color) || '#212121'),
      '--ffg:' + (col(f.text_color) || '#858585'),
      '--footer-width:' + limit(f.content_width, 1400, 640, 1800) + 'px',
      '--footer-col:' + limit(f.logo_column_width, 300, 120, 420) + 'px',
      '--footer-gap:' + limit(f.column_gap, 56, 12, 160) + 'px',
      '--footer-row-gap:' + limit(f.row_gap, 70, 0, 200) + 'px',
      '--footer-size:' + limit(f.font_size, 22, 12, 36) + 'px',
      '--footer-top:' + limit(f.pad_top, 64, 0, 240) + 'px',
      '--footer-bottom:' + limit(f.pad_bottom, 86, 0, 240) + 'px',
      '--footer-logo-width:' + limit(f.logo_width, 180, 40, 420) + 'px',
      '--footer-logo2-width:' + limit(f.logo2_width, 170, 40, 420) + 'px',
      '--footer-logo-align:' + pick(f.logo_align, ['flex-start', 'center', 'flex-end'], 'flex-start'),
      '--footer-caption-color:' + (col(f.caption_color) || '#000000')
    ].join(';');
    const logo = f.logo ? '<img class="footer-primary-img" src="' + esc(safeUrl(f.logo)) + '" alt="FIMCL">' : '';
    const logo2Path = f.logo2 == null ? 'images/uploads/logo-kaist-white.webp' : f.logo2;
    const logo2 = logo2Path ? '<img class="footer-secondary-img" src="' + esc(safeUrl(logo2Path)) + '" alt="KAIST">' : '';
    const department = f.department_text == null ? 'Department of\nChemistry' : String(f.department_text);
    const departmentHtml = department ? '<span class="footer-department">' + esc(department).replace(/\r?\n/g, '<br>') + '</span>' : '';
    const caption = f.logo2_caption == null ? 'Make it stand out' : String(f.logo2_caption);
    return '<footer class="site-footer" style="' + esc(css) + '"><div class="fin">' +
      '<div class="footer-primary">' + logo + '</div>' +
      '<div class="footer-contact md">' + md(contact) + '</div>' +
      '<div class="footer-secondary"><div class="footer-institution">' + logo2 + departmentHtml + '</div>' +
        (caption ? '<p class="footer-caption">' + esc(caption) + '</p>' : '') + '</div>' +
      '<div class="footer-copyright md">' + md(copyright) + '</div>' +
      '</div></footer>';
  }
  function wireMenu(scope) {
    const hd = scope.querySelector('.site-header'), bt = scope.querySelector('.burger');
    if (!hd || !bt) return;
    bt.addEventListener('click', () => { const o = hd.classList.toggle('open'); bt.setAttribute('aria-expanded', o); bt.textContent = o ? '×' : '☰'; });
  }


  /* 슬라이드쇼 · 사진 확대 보기 (공개 페이지에서만 동작) */
  function wireExtras(scope) {
    scope.querySelectorAll('[data-ss]').forEach(el => {
      const imgs = [].slice.call(el.querySelectorAll('.ss-img')), sec = (parseFloat(el.dataset.ss) || 0) * 1000;
      if (imgs.length < 2 || !sec) return;
      let i = 0; setInterval(() => { imgs[i].classList.remove('on'); i = (i + 1) % imgs.length; imgs[i].classList.add('on'); }, sec);
    });
    scope.querySelectorAll('[data-lbgroup]').forEach(grid => {
      const links = [].slice.call(grid.querySelectorAll('[data-lb]'));
      let box = null, cur = 0, sx = null;
      const show = n => {
        cur = (n + links.length) % links.length;
        const a = links[cur];
        box.querySelector('img').src = a.getAttribute('href');
        box.querySelector('img').alt = a.dataset.t || '';
        box.querySelector('.lb-t').textContent = a.dataset.t || '';
        box.querySelector('.lb-n').textContent = (cur + 1) + ' / ' + links.length;
      };
      const close = () => { if (!box) return; document.removeEventListener('keydown', key); box.remove(); box = null; document.documentElement.classList.remove('lb-open'); if (links[cur]) links[cur].focus(); };
      const key = e => { if (e.key === 'Escape') close(); else if (e.key === 'ArrowRight') show(cur + 1); else if (e.key === 'ArrowLeft') show(cur - 1); };
      const open = n => {
        box = document.createElement('div'); box.className = 'lb'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'Photo viewer');
        box.innerHTML = '<button class="lb-x" type="button" aria-label="Close">×</button><button class="lb-p" type="button" aria-label="Previous">‹</button><button class="lb-nx" type="button" aria-label="Next">›</button>' +
          '<figure><img alt=""><figcaption><span class="lb-t"></span><span class="lb-n"></span></figcaption></figure>';
        document.body.appendChild(box); document.documentElement.classList.add('lb-open');
        box.addEventListener('click', e => { if (e.target === box || e.target.tagName === 'FIGURE') close(); });
        box.querySelector('.lb-x').onclick = close; box.querySelector('.lb-p').onclick = () => show(cur - 1); box.querySelector('.lb-nx').onclick = () => show(cur + 1);
        box.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
        box.addEventListener('touchend', e => { if (sx == null) return; const d = e.changedTouches[0].clientX - sx; sx = null; if (Math.abs(d) > 50) show(cur + (d < 0 ? 1 : -1)); });
        document.addEventListener('keydown', key); show(n); box.querySelector('.lb-x').focus();
      };
      links.forEach((a, n) => a.addEventListener('click', e => { e.preventDefault(); open(n); }));
    });
  }

  root.PL = { renderBlocks, renderHeader, renderFooter, wireMenu, wireExtras, md };

  // Public page bootstrap (skipped inside the admin preview).
  if (root.document && document.getElementById('site-main')) {
    const get = u => fetch(u, { cache: 'no-cache' }).then(r => { if (!r.ok) throw new Error(u + ' ' + r.status); return r.json(); });
    const page = document.body.dataset.page || 'home';
    Promise.all([get('content/' + page + '.json'), get('content/site.json')]).then(([p, s]) => {
      if (s.site_title && page === 'home') document.title = s.site_title; // 하위 페이지는 각 html 파일의 제목을 씁니다
      document.getElementById('site-header').innerHTML = renderHeader(s.header, (location.pathname.split('/').pop() || 'index.html'));
      document.getElementById('site-main').innerHTML = renderBlocks(p.blocks);
      document.getElementById('site-footer').innerHTML = renderFooter(s.footer);
      wireMenu(document);
      wireExtras(document);
      document.documentElement.dataset.ready = '1';
    }).catch(e => {
      document.getElementById('site-main').innerHTML = '<p class="empty-note">페이지 내용을 불러오지 못했어요. (' + esc(e.message) + ')</p>';
    });
  }
})(window);
