/* 관리자 화면 오른쪽 미리보기: 실제 사이트와 같은 코드로 그립니다. */
(function () {
  const h = window.h || (window.CMS && window.CMS.h);
  if (!window.CMS || !h) { console.error('Decap preview: CMS/h not available'); return; }
  CMS.registerPreviewStyle('../css/site.css');

  const imgResolver = getAsset => p => {
    if (!p) return '';
    let u = '';
    try { u = String(getAsset(p) || ''); } catch (e) { u = ''; }
    if (!u || u === 'undefined') u = p;
    return /^(blob:|https?:|data:|\/)/.test(u) ? u : '../' + u.replace(/^\.?\//, '');
  };
  const toJS = e => (e.get('data') && e.get('data').toJS) ? e.get('data').toJS() : {};

  const Page = props => {
    const data = toJS(props.entry), img = imgResolver(props.getAsset);
    return h('div', { dangerouslySetInnerHTML: { __html: PL.renderBlocks(data.blocks, { img }) } });
  };
  const Site = props => {
    const d = toJS(props.entry), img = imgResolver(props.getAsset);
    const header = Object.assign({}, d.header, { logo: d.header && d.header.logo ? img(d.header.logo) : '' });
    const footer = Object.assign({}, d.footer, { logo: d.footer && d.footer.logo ? img(d.footer.logo) : '' });
    return h('div', { dangerouslySetInnerHTML: { __html: PL.renderHeader(header, 'index.html') + '<div class="empty-note">(본문 영역)</div>' + PL.renderFooter(footer) } });
  };
  CMS.registerPreviewTemplate('home', Page);
  CMS.registerPreviewTemplate('site', Site);
})();
