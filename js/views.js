/* AllMovieRelease — telas (geram HTML a partir do catálogo) */
(function () {
  'use strict';
  const A = window.AMR;
  const esc = A.esc;
  const t = A.t;
  const L = A.L;
  const V = (A.views = A.views || {});

  const TYPE_ORDER = ['theatrical', 'official', 'fan_scan', 'fan_restoration', 'fan_edit'];
  const NEEDS = ['fidelidade', 'imagem', 'oficial', 'dublagem', 'colecionador'];
  const REC_LEVELS = ['aclamado', 'bem_avaliado', 'misto', 'controverso', 'criticado', 'referencia'];
  const FILMIC = ['theatrical', 'fan_scan', 'fan_restoration'];

  const ICON = {
    left: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    right: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    ext: '<svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };
  V.ICON = ICON;

  /* ---------------- pequenos componentes ---------------- */
  const byDateAsc = (a, b) => A.dateKey((a.v || a).released) - A.dateKey((b.v || b).released);
  const byDateDesc = (a, b) => -byDateAsc(a, b);
  const isFan = (type) => String(type).indexOf('fan_') === 0;
  const sorted = (f) => f.versions.slice().sort(byDateAsc);
  const art = (f) => '--a:' + A.safeColor(f.accent, '#c9a24a') + ';--b:' + A.safeColor(f.accent2, '#3b5d8f');

  function typeBadge(type) {
    return '<span class="badge t-' + esc(type) + '"><i aria-hidden="true"></i>' + esc(t('type_' + type)) + '</span>';
  }
  function recSeal(rec) {
    const lvl = (rec && rec.level) || 'sem_dados';
    return '<span class="seal r-' + esc(lvl) + '">' + esc(t('rec_' + lvl)) + '</span>';
  }
  function availChip(av) {
    return av ? '<span class="chip av-' + esc(av) + '">' + esc(t('av_' + av)) + '</span>' : '';
  }
  function plainChip(text) {
    return text ? '<span class="chip">' + esc(text) + '</span>' : '';
  }
  function formatsText(list) {
    return (list || []).map((x) => (x === 'file' ? t('fmt_file') : L(x))).filter(Boolean).join(', ');
  }
  function firstFormat(v) {
    const f = (v.formats || [])[0];
    if (!f) return '';
    return f === 'file' ? t('fmt_file').split(' (')[0] : L(f);
  }
  V.typeBadge = typeBadge;
  V.recSeal = recSeal;
  V.availChip = availChip;

  function sourceLinks(keys, urls) {
    const items = [];
    const seen = {};
    (keys || []).forEach((k) => {
      const s = A.sources[k];
      if (s && A.safeUrl(s.u) && !seen[s.u]) { seen[s.u] = 1; items.push({ t: s.t, u: s.u }); }
    });
    (urls || []).forEach((u) => {
      if (A.safeUrl(u) && !seen[u]) { seen[u] = 1; items.push({ t: A.host(u) || u, u }); }
    });
    if (!items.length) return '';
    return '<ul class="srcs">' + items.map((s) =>
      '<li><a href="' + esc(s.u) + '" target="_blank" rel="noopener noreferrer">' + esc(s.t) + ICON.ext + '</a></li>').join('') + '</ul>';
  }
  V.sourceLinks = sourceLinks;

  // Fotograma pequeno (linha da versão, cartão de resposta, notícias)
  function miniFrame(f, v) {
    const filmic = FILMIC.indexOf(v.type) >= 0;
    return '<span class="mframe t-' + esc(v.type) + (filmic ? ' filmic' : '') + '" style="' + art(f) + '" aria-hidden="true">' +
      '<span class="mf-year">' + esc(A.year(v.released) || '') + '</span>' +
      '<span class="mf-fmt">' + esc(firstFormat(v)) + '</span></span>';
  }
  V.miniFrame = miniFrame;

  /* ---------------- cartões das fileiras ---------------- */
  function posterCard(f) {
    const img = A.filmPoster(f, 'w342');
    const title = A.filmTitle(f);
    const n = f.versions.length;
    const fan = f.versions.filter((v) => isFan(v.type)).length;
    return '<a class="poster' + (img ? ' has-img' : '') + '" href="#' + esc(f.id) + '" style="' + art(f) + '">' +
      (img ? '<img src="' + esc(img) + '" alt="" loading="lazy" decoding="async">' : '') +
      '<span class="poster-label">' +
        '<span class="pl-year">' + esc(f.year || '') + '</span>' +
        '<span class="pl-title">' + esc(title) + '</span>' +
        '<span class="pl-dir">' + esc(f.director || '') + '</span>' +
      '</span>' +
      '<span class="poster-foot"><span>' + esc(A.plural(n, 'one_version', 'n_versions')) + '</span>' +
        (fan ? '<span class="pf-fan">' + esc(A.plural(fan, 'one_fan', 'n_fan')) + '</span>' : '') + '</span>' +
      '<span class="sr-only">' + esc(title) + '</span>' +
    '</a>';
  }
  V.posterCard = posterCard;

  function frameCard(x) {
    const f = x.film;
    const v = x.v;
    const filmic = FILMIC.indexOf(v.type) >= 0;
    return '<a class="frame t-' + esc(v.type) + (filmic ? ' filmic' : '') + '" href="#' + esc(f.id) + '" data-focus-version="' + esc(v.id) + '" style="' + art(f) + '">' +
      '<span class="frame-pic">' +
        '<span class="frame-film">' + esc(A.filmTitle(f)) + '</span>' +
        '<span class="frame-name">' + esc(L(v.name)) + '</span>' +
      '</span>' +
      '<span class="frame-info">' + typeBadge(v.type) +
        '<span class="frame-date">' + esc(A.fmtDate(v.released, v.released_label)) + '</span>' +
        (v.res ? '<span class="frame-res">' + esc(L(v.res)) + '</span>' : '') +
      '</span>' +
      '<span class="frame-seal">' + recSeal(v.reception) + '</span>' +
    '</a>';
  }

  function strip(id, title, inner, link) {
    if (!inner) return '';
    return '<section class="strip" aria-labelledby="' + id + '-h">' +
      '<div class="strip-head"><h2 id="' + id + '-h">' + esc(title) + '</h2>' +
        (link ? '<a class="strip-link" href="' + esc(link) + '">' + esc(t('see_all')) + '</a>' : '') +
        '<div class="strip-nav">' +
          '<button class="icon-btn" type="button" data-action="strip" data-target="' + id + '" data-dir="-1" aria-label="' + esc(t('prev')) + '">' + ICON.left + '</button>' +
          '<button class="icon-btn" type="button" data-action="strip" data-target="' + id + '" data-dir="1" aria-label="' + esc(t('next')) + '">' + ICON.right + '</button>' +
        '</div>' +
      '</div>' +
      '<div class="strip-track" id="' + id + '" tabindex="0">' + inner + '</div>' +
    '</section>';
  }

  /* ---------------- destaque (topo da página inicial) ---------------- */
  function miniTimeline(f) {
    const vs = sorted(f).filter((v) => A.yearFrac(v.released) != null);
    if (!vs.length) return '';
    const years = vs.map((v) => A.year(v.released));
    const y0 = Math.min.apply(null, years);
    const y1 = Math.max.apply(null, years);
    const fr = vs.map((v) => A.yearFrac(v.released));
    const a = Math.min.apply(null, fr);
    let b = Math.max.apply(null, fr);
    if (b - a < 1) b = a + 1;
    // 2% de margem nas pontas para os pontos não encostarem nas bordas
    const pct = (x) => 2 + ((x - a) / (b - a)) * 96;
    const caption = t('hero_count', { n: vs.length, a: y0, b: y1 });
    const dots = vs.map((v) =>
      '<span class="mt-dot t-' + esc(v.type) + '" style="left:' + pct(A.yearFrac(v.released)).toFixed(2) + '%" title="' + esc(L(v.name) + ' (' + A.year(v.released) + ')') + '"></span>').join('');
    return '<figure class="mini-tl"><div class="mt-line" role="img" aria-label="' + esc(caption) + '">' + dots + '</div>' +
      '<div class="mt-ends" aria-hidden="true"><span>' + y0 + '</span><span>' + y1 + '</span></div>' +
      '<figcaption>' + esc(caption) + '</figcaption></figure>';
  }

  function intro(f, max) {
    const s = L(f.intro) || A.filmOverview(f);
    if (s.length <= max) return s;
    const cut = s.slice(0, max);
    const end = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('! '));
    return end > 60 ? cut.slice(0, end + 1) : cut.replace(/\s+\S*$/, '') + '…';
  }

  function hero(f) {
    if (!f) return '';
    const bd = A.filmBackdrop(f, 'w1280');
    return '<section class="hero" style="' + art(f) + '">' +
      '<div class="hero-bg" aria-hidden="true">' + (bd ? '<img src="' + esc(bd) + '" alt="" decoding="async">' : '<span class="hero-year">' + esc(f.year) + '</span>') + '</div>' +
      '<div class="hero-inner">' +
        '<h1 class="hero-title">' + esc(A.filmTitle(f)) + '</h1>' +
        '<p class="meta"><span>' + esc(f.year) + '</span>' + (A.filmRuntime(f) ? '<span>' + esc(t('fp_runtime', { n: A.filmRuntime(f) })) + '</span>' : '') + (f.director ? '<span>' + esc(f.director) + '</span>' : '') + '</p>' +
        '<p class="hero-intro">' + esc(intro(f, 260)) + '</p>' +
        miniTimeline(f) +
        '<div class="actions">' +
          '<a class="btn primary" href="#' + esc(f.id) + '" data-focus-section="sec-guide">' + esc(t('hero_cta_guide')) + '</a>' +
          '<a class="btn ghost" href="#' + esc(f.id) + '" data-focus-section="sec-versions">' + esc(t('hero_cta_all', { n: f.versions.length })) + '</a>' +
        '</div>' +
      '</div>' +
    '</section>';
  }

  /* ---------------- página inicial ---------------- */
  V.home = function () {
    const featured = A.film(A.cfg('FEATURED')) || A.films[0];
    const all = A.allVersions();
    const fan = all.filter((x) => isFan(x.v.type)).sort(byDateDesc);
    const soon = all.filter((x) => x.v.upcoming).sort(byDateAsc);
    const official = all.filter((x) => x.v.type === 'official' && !x.v.upcoming).sort(byDateDesc).slice(0, 12);
    const acclaimed = all.filter((x) => x.v.reception && x.v.reception.level === 'aclamado').sort(byDateDesc);
    const wanted = A.films.filter((f) => f.wanted);
    return hero(featured) +
      '<div class="rows">' +
        strip('row-new', t('row_newscans'), fan.map(frameCard).join(''), '#novos') +
        strip('row-cat', t('row_catalog'), A.films.slice().sort((a, b) => a.year - b.year).map(posterCard).join(''), '#filmes') +
        (soon.length ? strip('row-soon', t('row_soon'), soon.map(frameCard).join('')) : '') +
        strip('row-off', t('row_official'), official.map(frameCard).join('')) +
        strip('row-acc', t('row_acclaimed'), acclaimed.map(frameCard).join('')) +
      '</div>' +
      wantedSection(wanted);
  };

  function wantedSection(films) {
    if (!films.length) return '';
    return '<section class="wanted-sec">' +
      '<div class="sec-head"><h2>' + esc(t('row_wanted')) + '</h2><p class="sec-lead">' + esc(t('wanted_lead')) + '</p></div>' +
      '<div class="wanted-list">' + films.map((f) =>
        '<article class="wanted-card" style="' + art(f) + '">' +
          '<h3><a href="#' + esc(f.id) + '">' + esc(A.filmTitle(f)) + '</a></h3>' +
          '<p>' + esc(L(f.wanted)) + '</p>' +
          '<button class="btn small ghost" type="button" data-action="suggest" data-film="' + esc(f.id) + '" data-kind="version">' + esc(t('nav_suggest')) + '</button>' +
        '</article>').join('') +
      '</div></section>';
  }

  /* ---------------- lista de filmes ---------------- */
  V.films = function () {
    return '<section class="page">' +
      '<header class="page-head"><h1>' + esc(t('fl_title')) + '</h1><p class="lead">' + esc(t('fl_lead')) + '</p></header>' +
      '<div class="poster-grid">' + A.films.slice().sort((a, b) => a.year - b.year).map(posterCard).join('') + '</div>' +
    '</section>';
  };

  /* ---------------- novos lançamentos ---------------- */
  function newsItem(x) {
    const f = x.film;
    const v = x.v;
    return '<article class="news t-' + esc(v.type) + '">' +
      '<a class="news-frame" href="#' + esc(f.id) + '" data-focus-version="' + esc(v.id) + '" tabindex="-1">' + miniFrame(f, v) + '</a>' +
      '<div class="news-body">' +
        '<p class="news-film"><a href="#' + esc(f.id) + '">' + esc(A.filmTitle(f)) + '</a></p>' +
        '<h3><a href="#' + esc(f.id) + '" data-focus-version="' + esc(v.id) + '">' + esc(L(v.name)) + '</a></h3>' +
        '<p class="badges">' + typeBadge(v.type) + recSeal(v.reception) + plainChip(A.fmtDate(v.released, v.released_label)) + '</p>' +
        '<p class="news-sum">' + esc(L(v.summary)) + '</p>' +
      '</div></article>';
  }
  V.news = function () {
    const filter = A.state.newsFilter || 'fan';
    let items = A.allVersions().filter((x) => x.v.type !== 'theatrical');
    if (filter === 'fan') items = items.filter((x) => isFan(x.v.type));
    if (filter === 'official') items = items.filter((x) => x.v.type === 'official');
    items.sort(byDateDesc);
    const tabs = [['fan', 'nw_fan'], ['official', 'nw_official'], ['all', 'nw_all']].map((p) =>
      '<button type="button" class="fchip' + (p[0] === filter ? ' on' : '') + '" aria-pressed="' + (p[0] === filter) + '" data-action="news-filter" data-filter="' + p[0] + '">' + esc(t(p[1])) + '</button>').join('');
    return '<section class="page">' +
      '<header class="page-head"><h1>' + esc(t('nw_title')) + '</h1><p class="lead">' + esc(t('nw_lead')) + '</p></header>' +
      '<div class="fchips" role="group">' + tabs + '</div>' +
      '<div class="news-list">' + items.map(newsItem).join('') + '</div>' +
    '</section>';
  };

  /* ---------------- página do filme ---------------- */
  function guideSection(f) {
    const items = f.guide.filter((g) => NEEDS.indexOf(g.need) >= 0 && (g.version ? f.versions.some((v) => v.id === g.version) : f.dubs.some((d) => d.id === g.dub)));
    if (!items.length) return '';
    const want = A.state.guideNeed[f.id];
    const cur = items.find((g) => g.need === want) || items[0];
    const tabs = items.map((g) =>
      '<button type="button" role="tab" class="need' + (g === cur ? ' on' : '') + '" aria-selected="' + (g === cur) + '" data-action="need" data-film="' + esc(f.id) + '" data-need="' + esc(g.need) + '">' + esc(t('need_' + g.need)) + '</button>').join('');
    return '<section class="sec guide" id="sec-guide">' +
      '<div class="sec-head"><h2>' + esc(t('fp_guide')) + '</h2><p class="sec-lead">' + esc(t('fp_guide_hint')) + '</p></div>' +
      '<div class="needs" role="tablist">' + tabs + '</div>' +
      '<div class="answer" role="tabpanel" aria-live="polite">' + answerCard(f, cur) + '</div>' +
    '</section>';
  }

  function answerCard(f, g) {
    if (g.version) {
      const v = f.versions.find((x) => x.id === g.version);
      return '<div class="answer-card t-' + esc(v.type) + '">' +
        '<div class="answer-frame">' + miniFrame(f, v) + '</div>' +
        '<div class="answer-body">' +
          '<h3>' + esc(L(v.name)) + '</h3>' +
          '<p class="badges">' + typeBadge(v.type) + recSeal(v.reception) + availChip(v.availability) + '</p>' +
          '<p>' + esc(L(g.why)) + '</p>' +
          '<button class="btn small" type="button" data-action="focus-version" data-version="' + esc(v.id) + '">' + esc(t('fp_view_version')) + '</button>' +
        '</div></div>';
    }
    const d = f.dubs.find((x) => x.id === g.dub);
    return '<div class="answer-card dub-answer">' +
      '<div class="answer-frame"><span class="mframe dubframe" aria-hidden="true"><span class="mf-year">' + esc(d.year || '') + '</span><span class="mf-fmt">PT-BR</span></span></div>' +
      '<div class="answer-body">' +
        '<h3>' + esc(L(d.name)) + '</h3>' +
        '<p class="badges">' + plainChip(d.studio) + '</p>' +
        '<p>' + esc(L(g.why)) + '</p>' +
        '<button class="btn small" type="button" data-action="goto" data-target="dub-' + esc(d.id) + '">' + esc(t('fp_view_dubs')) + '</button>' +
      '</div></div>';
  }

  function timelineSection(f) {
    const vs = sorted(f).filter((v) => A.yearFrac(v.released) != null);
    if (vs.length < 2) return '';
    const fr = vs.map((v) => A.yearFrac(v.released));
    const a = Math.floor(Math.min.apply(null, fr)) - 1;
    const b = Math.ceil(Math.max.apply(null, fr)) + 1;
    const pct = (x) => ((x - a) / (b - a)) * 100;
    const lanes = [];
    const GAP = 5.5;
    const marks = vs.map((v) => {
      const p = pct(A.yearFrac(v.released));
      let lane = lanes.findIndex((end) => p - end >= GAP);
      if (lane < 0) { lane = lanes.length; lanes.push(p); } else lanes[lane] = p;
      return { v, p, lane };
    });
    const ticks = [];
    for (let y = Math.ceil(a / 10) * 10; y <= b; y += 10) ticks.push(y);
    const present = TYPE_ORDER.filter((tp) => vs.some((v) => v.type === tp));
    return '<section class="sec" id="sec-timeline">' +
      '<div class="sec-head"><h2>' + esc(t('fp_timeline')) + '</h2><p class="sec-lead">' + esc(t('fp_timeline_hint')) + '</p></div>' +
      '<div class="tl-wrap"><div class="tl" style="--lanes:' + Math.max(1, lanes.length) + '">' +
        ticks.map((y) => '<span class="tl-tick" style="left:' + pct(y).toFixed(2) + '%"><span>' + y + '</span></span>').join('') +
        marks.map((m) =>
          '<button type="button" class="tl-mark t-' + esc(m.v.type) + '" style="left:' + m.p.toFixed(2) + '%;--lane:' + m.lane + '" data-action="focus-version" data-version="' + esc(m.v.id) + '" aria-label="' + esc(L(m.v.name) + ', ' + A.fmtDate(m.v.released, m.v.released_label)) + '">' +
            '<span class="tl-dot"></span><span class="tl-tip">' + esc(L(m.v.name)) + '<small>' + esc(A.fmtDate(m.v.released, m.v.released_label)) + '</small></span>' +
          '</button>').join('') +
      '</div></div>' +
      '<p class="legend">' + present.map(typeBadge).join('') + '</p>' +
    '</section>';
  }

  function specRows(f, v) {
    const cut = f.cuts.find((c) => c.id === v.cut);
    const dubNames = (v.dubs || []).map((id) => f.dubs.find((d) => d.id === id)).filter(Boolean).map((d) => L(d.name));
    const rows = [
      [t('fp_by'), L(v.by)],
      [t('fp_released'), A.fmtDate(v.released, v.released_label)],
      [t('fp_cut'), cut ? L(cut.name) : ''],
      [t('fp_source'), L(v.source)],
      [t('fp_res'), L(v.res)],
      [t('fp_hdr'), L(v.hdr)],
      [t('fp_aspect'), L(v.aspect)],
      [t('fp_formats'), formatsText(v.formats)],
      [t('fp_audio'), (v.audio || []).map(L).join('; ')],
      [t('fp_dub'), dubNames.join('; ')],
      [t('fp_reception'), v.reception && v.reception.note ? L(v.reception.note) : ''],
      [t('fp_availability'), v.availability ? t('av_' + v.availability) : '']
    ].filter((r) => r[1]);
    return '<dl class="specs">' + rows.map((r) => '<div><dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd></div>').join('') + '</dl>';
  }

  function editionsTable(v) {
    if (!v.editions || !v.editions.length) return '';
    return '<h4>' + esc(t('fp_editions')) + '</h4><div class="table-wrap"><table class="eds"><thead><tr>' +
      ['fp_ed_year', 'fp_ed_format', 'fp_ed_region', 'fp_ed_label', 'fp_ed_note'].map((k) => '<th scope="col">' + esc(t(k)) + '</th>').join('') +
      '</tr></thead><tbody>' + v.editions.map((e) =>
        '<tr><td>' + esc(e.year || '') + '</td><td>' + esc(L(e.format)) + '</td><td>' + esc(L(e.region)) + '</td><td>' + esc(L(e.label)) + '</td><td>' + esc(L(e.note)) + '</td></tr>').join('') +
      '</tbody></table></div>';
  }

  function versionRow(f, v) {
    const checked = A.state.compare.has(v.id);
    const diffs = (v.differences || []).map(L).filter(Boolean);
    return '<article class="vrow t-' + esc(v.type) + '" id="v-' + esc(v.id) + '">' +
      '<div class="vrow-frame">' + miniFrame(f, v) + '</div>' +
      '<div class="vrow-main">' +
        '<div class="vrow-top">' +
          '<h3>' + esc(L(v.name)) + (v.community ? ' <span class="chip community" title="' + esc(t('fp_community_tip')) + '">' + esc(t('fp_community')) + '</span>' : '') + '</h3>' +
          '<span class="vrow-date">' + esc(A.fmtDate(v.released, v.released_label)) + '</span>' +
        '</div>' +
        '<p class="badges">' + typeBadge(v.type) + recSeal(v.reception) + availChip(v.availability) + plainChip(L(v.res)) + plainChip(L(v.hdr)) + '</p>' +
        '<p class="vrow-sum">' + esc(L(v.summary)) + '</p>' +
        '<details class="vrow-more"><summary>' + esc(t('fp_details')) + '</summary>' +
          specRows(f, v) +
          (diffs.length ? '<h4>' + esc(t('fp_diffs')) + '</h4><ul class="diffs">' + diffs.map((d) => '<li>' + esc(d) + '</li>').join('') + '</ul>' : '') +
          editionsTable(v) +
          (sourceLinks(v.src, v.src_urls) ? '<h4>' + esc(t('fp_sources')) + '</h4>' + sourceLinks(v.src, v.src_urls) : '') +
        '</details>' +
      '</div>' +
      '<label class="vrow-cmp"><input type="checkbox" data-action="compare" data-version="' + esc(v.id) + '"' + (checked ? ' checked' : '') + '><span>' + esc(t('fp_compare')) + '</span></label>' +
    '</article>';
  }

  function versionsSection(f) {
    const vs = sorted(f);
    const present = TYPE_ORDER.filter((tp) => vs.some((v) => v.type === tp));
    let cur = A.state.typeFilter[f.id] || 'all';
    if (cur !== 'all' && present.indexOf(cur) < 0) cur = 'all';
    const chips = ['all'].concat(present).map((tp) => {
      const n = tp === 'all' ? vs.length : vs.filter((v) => v.type === tp).length;
      return '<button type="button" class="fchip' + (tp === cur ? ' on' : '') + '" aria-pressed="' + (tp === cur) + '" data-action="type-filter" data-film="' + esc(f.id) + '" data-type="' + tp + '">' +
        esc(tp === 'all' ? t('fp_all') : t('type_' + tp)) + ' <span class="fcount">' + n + '</span></button>';
    }).join('');
    const rows = vs.filter((v) => cur === 'all' || v.type === cur).map((v) => versionRow(f, v)).join('');
    return '<section class="sec" id="sec-versions">' +
      '<div class="sec-head"><h2>' + esc(t('fp_versions')) + '</h2></div>' +
      '<div class="fchips" role="group" aria-label="' + esc(t('fp_versions')) + '">' + chips + '</div>' +
      '<div class="vlist">' + (rows || '<p class="muted">' + esc(t('fp_none_type')) + '</p>') + '</div>' +
    '</section>';
  }

  function cutsSection(f) {
    const showCuts = f.cuts.length > 1 || f.cuts.some((c) => c.note || (c.changes && c.changes.length));
    if (!showCuts) return '';
    return '<section class="sec" id="sec-cuts"><div class="sec-head"><h2>' + esc(t('fp_cuts')) + '</h2></div><ol class="cuts">' +
      f.cuts.map((c) => {
        const users = sorted(f).filter((v) => v.cut === c.id);
        return '<li class="cut"><h3>' + esc(L(c.name)) + '</h3>' +
          (c.note ? '<p>' + esc(L(c.note)) + '</p>' : '') +
          (c.changes && c.changes.length ? '<ul class="changes">' + c.changes.map((x) => '<li>' + esc(L(x)) + '</li>').join('') + '</ul>' : '') +
          (users.length && f.cuts.length > 1 ? '<p class="used-by"><span>' + esc(t('fp_used_by')) + '</span>' + users.map((v) => '<button type="button" class="link-chip" data-action="focus-version" data-version="' + esc(v.id) + '">' + esc(L(v.name)) + '</button>').join('') + '</p>' : '') +
        '</li>';
      }).join('') + '</ol></section>';
  }

  function dubsSection(f) {
    const head = '<div class="sec-head"><h2>' + esc(t('fp_dubs')) + '</h2></div>';
    if (!f.dubs.length) {
      return '<section class="sec" id="sec-dubs">' + head +
        '<p class="muted">' + esc(L(f.dubs_note) || t('fp_no_dubs')) + '</p>' +
        '<button class="btn small ghost" type="button" data-action="suggest" data-film="' + esc(f.id) + '" data-kind="fix">' + esc(t('fp_suggest')) + '</button></section>';
    }
    return '<section class="sec" id="sec-dubs">' + head + '<div class="dubs">' + f.dubs.map((d) => {
      const inV = sorted(f).filter((v) => (v.dubs || []).indexOf(d.id) >= 0);
      return '<article class="dub" id="dub-' + esc(d.id) + '">' +
        '<h3>' + esc(L(d.name)) + '</h3>' +
        '<dl class="dub-facts">' +
          (d.studio ? '<div><dt>' + esc(t('fp_dub_studio')) + '</dt><dd>' + esc(d.studio) + '</dd></div>' : '') +
          (d.director ? '<div><dt>' + esc(t('fp_dub_director')) + '</dt><dd>' + esc(L(d.director)) + '</dd></div>' : '') +
        '</dl>' +
        (d.cast && d.cast.length ? '<h4>' + esc(t('fp_dub_cast')) + '</h4><dl class="cast">' + d.cast.map((c) => '<div><dt>' + esc(c[0]) + '</dt><dd>' + esc(c[1]) + '</dd></div>').join('') + '</dl>' : '') +
        (d.note ? '<p class="dub-note">' + esc(L(d.note)) + '</p>' : '') +
        (inV.length ? '<p class="used-by"><span>' + esc(t('fp_dub_in')) + '</span>' + inV.map((v) => '<button type="button" class="link-chip" data-action="focus-version" data-version="' + esc(v.id) + '">' + esc(L(v.name)) + '</button>').join('') + '</p>' : '') +
        sourceLinks(d.src) +
      '</article>';
    }).join('') + '</div></section>';
  }

  function notesSection(f) {
    if (!f.notes.length) return '';
    return '<section class="sec" id="sec-notes"><div class="sec-head"><h2>' + esc(t('fp_notes')) + '</h2></div><ul class="notes">' +
      f.notes.map((n) => '<li><p>' + esc(L(n.text)) + '</p>' + (A.safeUrl(n.url) ? '<a href="' + esc(n.url) + '" target="_blank" rel="noopener noreferrer">' + esc(A.host(n.url)) + ICON.ext + '</a>' : '') + '</li>').join('') +
      '</ul></section>';
  }

  function sourcesSection(f) {
    const keys = [];
    const urls = [];
    f.versions.forEach((v) => { (v.src || []).forEach((k) => keys.push(k)); (v.src_urls || []).forEach((u) => urls.push(u)); });
    f.dubs.forEach((d) => (d.src || []).forEach((k) => keys.push(k)));
    const html = sourceLinks(keys, urls);
    return html ? '<section class="sec" id="sec-sources"><div class="sec-head"><h2>' + esc(t('fp_sources')) + '</h2></div>' + html + '</section>' : '';
  }

  V.film = function (f) {
    if (!f) return V.notFound();
    const title = A.filmTitle(f);
    const bd = A.filmBackdrop(f, 'w1280');
    const poster = A.filmPoster(f, 'w342');
    const fan = f.versions.filter((v) => isFan(v.type)).length;
    const aka = f.aka ? (f.aka[A.lang] || []) : [];
    const showOriginal = f.original_title && A.fold(f.original_title) !== A.fold(title);
    return '<article class="film" style="' + art(f) + '">' +
      '<header class="film-hero">' +
        '<div class="hero-bg" aria-hidden="true">' + (bd ? '<img src="' + esc(bd) + '" alt="" decoding="async">' : '<span class="hero-year">' + esc(f.year) + '</span>') + '</div>' +
        '<div class="film-hero-inner">' +
          '<div class="film-poster">' + (poster
            ? '<img src="' + esc(poster) + '" alt="' + esc(title) + '" decoding="async">'
            : '<span class="poster-label"><span class="pl-year">' + esc(f.year) + '</span><span class="pl-title">' + esc(title) + '</span><span class="pl-dir">' + esc(f.director || '') + '</span></span>') + '</div>' +
          '<div class="film-head">' +
            '<h1>' + esc(title) + '</h1>' +
            '<p class="meta"><span>' + esc(f.year) + '</span>' + (A.filmRuntime(f) ? '<span>' + esc(t('fp_runtime', { n: A.filmRuntime(f) })) + '</span>' : '') + (f.director ? '<span>' + esc(f.director) + '</span>' : '') + '</p>' +
            (showOriginal ? '<p class="film-alt">' + esc(t('fp_original', { t: f.original_title })) + '</p>' : '') +
            (aka.length ? '<p class="film-alt">' + esc(t('fp_aka', { t: aka.join(', ') })) + '</p>' : '') +
            '<p class="film-overview">' + esc(A.filmOverview(f)) + '</p>' +
            '<p class="film-counts">' +
              '<span>' + esc(A.plural(f.versions.length, 'one_version', 'n_versions')) + '</span>' +
              (fan ? '<span>' + esc(A.plural(fan, 'one_fan', 'n_fan')) + '</span>' : '') +
              (f.dubs.length ? '<span>' + esc(A.plural(f.dubs.length, 'one_dub', 'n_dubs')) + '</span>' : '') +
            '</p>' +
            '<div class="actions">' +
              (f.guide.length ? '<button class="btn primary" type="button" data-action="goto" data-target="sec-guide">' + esc(t('hero_cta_guide')) + '</button>' : '') +
              '<button class="btn ghost" type="button" data-action="suggest" data-film="' + esc(f.id) + '" data-kind="version">' + esc(t('fp_suggest')) + '</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</header>' +
      (L(f.intro) ? '<section class="film-intro"><p>' + esc(L(f.intro)) + '</p></section>' : '') +
      guideSection(f) +
      timelineSection(f) +
      versionsSection(f) +
      cutsSection(f) +
      dubsSection(f) +
      notesSection(f) +
      (f.wanted ? '<aside class="wanted-note"><h2>' + esc(t('fp_wanted')) + '</h2><p>' + esc(L(f.wanted)) + '</p><button class="btn small ghost" type="button" data-action="suggest" data-film="' + esc(f.id) + '" data-kind="version">' + esc(t('nav_suggest')) + '</button></aside>' : '') +
      sourcesSection(f) +
    '</article>';
  };

  /* ---------------- comparação ---------------- */
  V.compareTable = function (items) {
    const cutName = (x) => { const c = x.film.cuts.find((k) => k.id === x.v.cut); return c ? esc(L(c.name)) : ''; };
    const dubs = (x) => (x.v.dubs || []).map((id) => x.film.dubs.find((d) => d.id === id)).filter(Boolean).map((d) => esc(L(d.name))).join('<br>');
    const rows = [
      [t('sg_vtype'), (x) => typeBadge(x.v.type)],
      [t('fp_released'), (x) => esc(A.fmtDate(x.v.released, x.v.released_label))],
      [t('fp_cut'), cutName],
      [t('fp_source'), (x) => esc(L(x.v.source))],
      [t('fp_res'), (x) => esc(L(x.v.res))],
      [t('fp_hdr'), (x) => esc(L(x.v.hdr))],
      [t('fp_aspect'), (x) => esc(L(x.v.aspect))],
      [t('fp_audio'), (x) => (x.v.audio || []).map((a) => esc(L(a))).join('<br>')],
      [t('fp_dub'), dubs],
      [t('fp_reception'), (x) => recSeal(x.v.reception) + (x.v.reception && x.v.reception.note ? '<br><span class="cmp-note">' + esc(L(x.v.reception.note)) + '</span>' : '')],
      [t('fp_availability'), (x) => (x.v.availability ? esc(t('av_' + x.v.availability)) : '')],
      [t('fp_diffs'), (x) => ((x.v.differences || []).length ? '<ul>' + x.v.differences.map((d) => '<li>' + esc(L(d)) + '</li>').join('') + '</ul>' : '')]
    ];
    return '<div class="table-wrap"><table class="cmp"><thead><tr><th scope="col"><span class="sr-only">' + esc(t('fp_versions')) + '</span></th>' +
      items.map((x) => '<th scope="col">' + miniFrame(x.film, x.v) + '<span class="cmp-name">' + esc(L(x.v.name)) + '</span></th>').join('') +
      '</tr></thead><tbody>' + rows.map((r) =>
        '<tr><th scope="row">' + esc(r[0]) + '</th>' + items.map((x) => '<td>' + (r[1](x) || '<span class="muted">' + esc(t('fp_unknown')) + '</span>') + '</td>').join('') + '</tr>').join('') +
      '</tbody></table></div>';
  };

  /* ---------------- sobre ---------------- */
  V.about = function () {
    return '<section class="page prose-page">' +
      '<header class="page-head"><h1>' + esc(t('ab_title')) + '</h1><p class="lead">' + esc(t('ab_lead')) + '</p></header>' +
      '<section class="sec"><h2>' + esc(t('ab_types')) + '</h2><dl class="legend-list">' +
        TYPE_ORDER.map((tp) => '<div><dt>' + typeBadge(tp) + '</dt><dd>' + esc(t('typed_' + tp)) + '</dd></div>').join('') + '</dl></section>' +
      '<section class="sec"><h2>' + esc(t('ab_rec')) + '</h2><p>' + esc(t('ab_rec_lead')) + '</p><dl class="legend-list">' +
        REC_LEVELS.map((lv) => '<div><dt>' + recSeal({ level: lv }) + '</dt><dd>' + esc(t('recd_' + lv)) + '</dd></div>').join('') + '</dl></section>' +
      '<section class="sec"><h2>' + esc(t('ab_dubs')) + '</h2><p>' + esc(t('ab_dubs_lead')) + '</p></section>' +
      '<section class="sec"><h2>' + esc(t('ab_contrib')) + '</h2><p>' + esc(t('ab_contrib_lead')) + '</p>' +
        '<button class="btn primary" type="button" data-action="suggest">' + esc(t('nav_suggest')) + '</button></section>' +
      '<section class="sec"><h2>' + esc(t('ab_policy')) + '</h2><p>' + esc(t('ab_policy_lead')) + '</p></section>' +
      '<section class="sec"><h2>' + esc(t('ab_tmdb')) + '</h2><p>' + esc(t('ab_tmdb_lead')) + '</p>' +
        '<p class="tmdb-credit"><img class="tmdb-logo" src="assets/tmdb-logo.svg" alt="The Movie Database (TMDB)" width="140" height="18">' +
        '<span>This product uses the TMDB API but is not endorsed or certified by TMDB.</span></p>' +
        (A.lang === 'pt' ? '<p class="muted">' + esc(t('ft_tmdb')) + '</p>' : '') + '</section>' +
    '</section>';
  };

  V.notFound = function () {
    return '<section class="page"><header class="page-head"><h1>' + esc(t('nf_title')) + '</h1><p class="lead">' + esc(t('nf_lead')) + '</p></header>' +
      '<a class="btn primary" href="#">' + esc(t('nf_back')) + '</a></section>';
  };

  /* ---------------- busca ---------------- */
  V.searchResults = function (q) {
    const fq = A.fold(q.trim());
    if (!fq) return '';
    const hay = (f) => [A.filmTitle(f), f.title && f.title.pt, f.title && f.title.en, f.original_title]
      .concat(f.aka ? (f.aka.pt || []).concat(f.aka.en || []) : []);
    const films = A.films.filter((f) => hay(f).some((s) => A.fold(s).indexOf(fq) >= 0));
    const vers = A.allVersions().filter((x) => [L(x.v.name), x.v.name && x.v.name.en, L(x.v.by)].some((s) => A.fold(s).indexOf(fq) >= 0)).slice(0, 8);
    let html = '';
    if (films.length) {
      html += '<div class="sr-group"><h3>' + esc(t('s_films')) + '</h3>' + films.map((f) =>
        '<a class="sr-item" href="#' + esc(f.id) + '"><span class="sr-title">' + esc(A.filmTitle(f)) + '</span><span class="sr-sub"><span>' + esc(f.year) + '</span><span>' + esc(A.plural(f.versions.length, 'one_version', 'n_versions')) + '</span></span></a>').join('') + '</div>';
    }
    if (vers.length) {
      html += '<div class="sr-group"><h3>' + esc(t('s_versions')) + '</h3>' + vers.map((x) =>
        '<a class="sr-item" href="#' + esc(x.film.id) + '" data-focus-version="' + esc(x.v.id) + '"><span class="sr-title">' + esc(L(x.v.name)) + '</span><span class="sr-sub"><span>' + esc(A.filmTitle(x.film)) + '</span><span>' + esc(t('type_' + x.v.type)) + '</span></span></a>').join('') + '</div>';
    }
    if (!films.length) {
      html += '<div class="sr-group"><p class="sr-none">' + esc(t('s_none', { q: q.trim() })) + '</p>' +
        '<button type="button" class="sr-action" data-action="tmdb-search" data-q="' + esc(q.trim()) + '">' + esc(t('s_tmdb_try', { q: q.trim() })) + '</button>' +
        '<button type="button" class="sr-action" data-action="suggest" data-kind="film" data-title="' + esc(q.trim()) + '">' + esc(t('s_suggest', { q: q.trim() })) + '</button>' +
        '<div id="sr-tmdb" aria-live="polite"></div></div>';
    }
    return html;
  };

  V.tmdbResults = function (results) {
    if (!results.length) return '<p class="sr-none">' + esc(t('s_none', { q: '' })).replace(' “”', '') + '</p>';
    return '<h3>' + esc(t('s_tmdb')) + '</h3>' + results.slice(0, 6).map((r) => {
      const y = (r.release_date || '').slice(0, 4);
      const img = A.tmdb.img(r.poster_path, 'w92');
      return '<div class="sr-tmdb-item">' + (img ? '<img src="' + esc(img) + '" alt="" width="34" height="51" loading="lazy">' : '<span class="sr-noimg" aria-hidden="true"></span>') +
        '<span class="sr-title">' + esc(r.title || r.original_title) + (y ? ' <small>' + esc(y) + '</small>' : '') + '</span>' +
        '<button type="button" class="btn small ghost" data-action="suggest" data-kind="film" data-title="' + esc(r.title || r.original_title) + '" data-year="' + esc(y) + '" data-tmdb="' + esc(r.id) + '">' + esc(t('nav_suggest')) + '</button></div>';
    }).join('');
  };
})();
