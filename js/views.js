/* RareVersion — telas (geram HTML a partir do catálogo) */
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
        strip('row-music', t('mu_home_row'), musicFrames(), '#musicas') +
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

  function fmtLabel(r) { return r.format === 'other' ? (L(r.formatText) || t('fmt_other')) : t('fmt_' + r.format); }
  function placeText(r) { return r.country ? A.countryName(r.country) : L(r.regionText); }

  function editionsTable(f, v) {
    const list = A.releasesOf(f).filter((r) => r.version === v.id);
    if (!list.length) return '';
    return '<h4>' + esc(t('rl_with_master')) + '</h4><ul class="v-eds">' + list.map((r) =>
      '<li><span class="v-ed-date">' + esc(r.date ? A.fmtDate(r.date) : t('rl_nodate')) + '</span> ' +
      '<span class="fmt f-' + esc(r.format) + '">' + esc(fmtLabel(r)) + '</span> ' +
      esc([placeText(r), L(r.label), L(r.name)].filter(Boolean).join(' · ')) + '</li>').join('') + '</ul>' +
      '<p><button type="button" class="link-chip" data-action="film-tab" data-film="' + esc(f.id) + '" data-tab="lancamentos">' + esc(t('rl_see_tab')) + '</button></p>';
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
          editionsTable(f, v) +
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

  /* ---------------- avaliação ---------------- */
  const CRITERIA = ['fidelity', 'picture', 'audio', 'extras'];
  function scoreOf(v, c) { const x = v.scores && v.scores[c]; const n = Math.round(Number(x && x.v)); return n >= 1 && n <= 5 ? n : 0; }
  function scoredVersions(f) { return sorted(f).filter((v) => CRITERIA.some((c) => scoreOf(v, c))); }
  function dots(n) {
    let h = '';
    for (let i = 1; i <= 5; i++) h += '<i' + (i <= n ? ' class="on"' : '') + '></i>';
    return '<span class="dots" aria-hidden="true">' + h + '</span>';
  }
  function fmtScore(x, scale) {
    if (typeof x === 'number') return x.toLocaleString(A.locale(), { maximumFractionDigits: 1 }) + '/' + (scale || 5);
    return String(x);
  }
  function reviewItem(r) {
    const s = A.sources[r.src] || {};
    const url = A.safeUrl(r.url || s.u);
    const label = r.label || String(s.t || '').split(' — ')[0];
    const parts = [];
    ['video', 'audio', 'extras', 'overall'].forEach((k) => { if (r[k] != null && r[k] !== '') parts.push(t('sc_r_' + k) + ' ' + fmtScore(r[k], r.scale)); });
    if (r.text) parts.push(L(r.text));
    return '<li>' + (url ? '<a href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' + esc(label) + ICON.ext + '</a>' : esc(label)) +
      (parts.length ? ' — ' + esc(parts.join(' · ')) : '') + (r.date ? ' <span class="muted">(' + esc(A.fmtDate(r.date)) + ')</span>' : '') + '</li>';
  }
  function dubNames(f, v) {
    return (v.dubs || []).map((id) => f.dubs.find((d) => d.id === id)).filter(Boolean).map((d) => esc(d.year ? String(d.year) : L(d.name))).join(', ');
  }
  function currentScore(f, list, crit) {
    const raw = String(A.state.scoreSel[f.id] || '');
    const i = raw.lastIndexOf(':');
    const v = list.find((x) => x.id === raw.slice(0, i));
    const c = raw.slice(i + 1);
    if (v && crit.indexOf(c) >= 0 && scoreOf(v, c)) return { v, c };
    const c0 = crit[0];
    const best = list.slice().sort((a, b) => scoreOf(b, c0) - scoreOf(a, c0))[0];
    return { v: best, c: c0 };
  }
  function scoreDetail(f, v, c) {
    const n = scoreOf(v, c);
    const x = v.scores[c] || {};
    const src = sourceLinks(x.src, x.src_urls);
    return '<div class="sc-detail t-' + esc(v.type) + '" aria-live="polite">' +
      '<p class="sc-detail-k">' + esc(t('sc_' + c)) + ' · <b>' + esc(L(v.name)) + '</b></p>' +
      '<p class="sc-detail-n lv' + n + '">' + dots(n) + ' <span>' + esc(t('sc_of5', { n })) + ' · ' + esc(t('sc_lv' + n)) + '</span></p>' +
      (L(x.why) ? '<p class="sc-why">' + esc(L(x.why)) + '</p>' : '') +
      (src ? '<div class="sc-src"><h4>' + esc(t('sc_sources')) + '</h4>' + src + '</div>' : '') +
      (v.reviews.length ? '<div class="sc-reviews"><h4>' + esc(t('sc_reviews')) + '</h4><ul>' + v.reviews.map(reviewItem).join('') + '</ul></div>' : '') +
      '<p><a class="link-chip" href="#' + esc(f.id) + '" data-focus-version="' + esc(v.id) + '">' + esc(t('sc_see_version')) + '</a></p>' +
    '</div>';
  }
  function scoreSection(f) {
    const list = scoredVersions(f);
    if (!list.length) return '';
    const crit = CRITERIA.filter((c) => list.some((v) => scoreOf(v, c)));
    const hasDub = f.dubs.length && list.some((v) => (v.dubs || []).length);
    const sel = currentScore(f, list, crit);
    const selBtn = (v, c, inner, cls, label) => '<button type="button" class="' + cls + (sel.v === v && sel.c === c ? ' on' : '') + '" aria-pressed="' + (sel.v === v && sel.c === c) + '" data-action="score-sel" data-film="' + esc(f.id) + '" data-sel="' + esc(v.id + ':' + c) + '"' + (label ? ' aria-label="' + esc(label) + '"' : '') + '>' + inner + '</button>';
    const picks = crit.map((c) => {
      let best = 0;
      list.forEach((v) => { best = Math.max(best, scoreOf(v, c)); });
      const top = list.filter((v) => scoreOf(v, c) === best);
      return '<div class="pick"><span class="pick-k">' + esc(t('sc_pick_' + c)) + '</span>' +
        '<span class="pick-vs">' + top.map((v) => selBtn(v, c, '<i class="tdot t-' + esc(v.type) + '"></i>' + esc(L(v.name)), 'pick-v')).join('<span class="pick-tie">' + esc(t('sc_tie')) + '</span>') + '</span>' +
        '<span class="pick-n lv' + best + '">' + dots(best) + ' ' + best + '/5</span></div>';
    }).join('');
    const head = '<tr><th scope="col">' + esc(t('sc_version')) + '</th>' +
      crit.map((c) => '<th scope="col"><span title="' + esc(t('scd_' + c)) + '">' + esc(t('sc_' + c)) + '</span></th>').join('') +
      (hasDub ? '<th scope="col">' + esc(t('sc_dub')) + '</th>' : '') + '</tr>';
    const rows = list.map((v) => '<tr><th scope="row"><span class="sc-name t-' + esc(v.type) + '"><i></i>' + esc(L(v.name)) + '</span></th>' +
      crit.map((c) => {
        const n = scoreOf(v, c);
        return '<td>' + (n ? selBtn(v, c, dots(n) + '<b>' + n + '</b>', 'sc lv' + n, t('sc_' + c) + ', ' + L(v.name) + ': ' + t('sc_of5', { n }) + ' (' + t('sc_lv' + n) + ')') : '<span class="sc-none" title="' + esc(t('sc_none')) + '">–</span>') + '</td>';
      }).join('') +
      (hasDub ? '<td class="sc-dub">' + (dubNames(f, v) || '<span class="sc-none">–</span>') + '</td>' : '') + '</tr>').join('');
    return '<section class="sec score" id="sec-score">' +
      '<div class="sec-head"><h2>' + esc(t('sc_title')) + '</h2><p class="sec-lead">' + esc(t('sc_lead')) + '</p></div>' +
      '<div class="picks">' + picks + '</div>' +
      (L(f.score_note) ? '<p class="score-note">' + esc(L(f.score_note)) + '</p>' : '') +
      '<div class="score-grid"><div class="table-wrap"><table class="score-table"><thead>' + head + '</thead><tbody>' + rows + '</tbody></table></div>' +
      scoreDetail(f, sel.v, sel.c) + '</div>' +
      '<details class="score-method"><summary>' + esc(t('sc_method_t')) + '</summary><p>' + esc(t('sc_method')) + '</p><dl>' +
        crit.map((c) => '<div><dt>' + esc(t('sc_' + c)) + '</dt><dd>' + esc(t('scd_' + c)) + '</dd></div>').join('') + '</dl></details>' +
    '</section>';
  }

  /* ---------------- lançamentos ---------------- */
  const LINK_LABELS = { bluray: 'Blu-ray.com', dvdcompare: 'DVDCompare', lddb: 'LaserDisc Database', caps: 'Caps-a-holic' };
  function srcMini(r) {
    const seen = {};
    const items = [];
    (r.src || []).forEach((k) => { const s = A.sources[k]; if (s && A.safeUrl(s.u) && !seen[s.u]) { seen[s.u] = 1; items.push({ u: s.u, t: s.t }); } });
    (r.src_urls || []).forEach((u) => { if (A.safeUrl(u) && !seen[u]) { seen[u] = 1; items.push({ u, t: A.host(u) }); } });
    return items.map((x) => '<a href="' + esc(x.u) + '" target="_blank" rel="noopener noreferrer" title="' + esc(x.t) + '">' + esc(A.host(x.u)) + ICON.ext + '</a>').join('');
  }
  function masterCell(f, r) {
    const v = r.version && f.versions.find((x) => x.id === r.version);
    if (!v) return '<span class="muted">' + esc(t('rl_unknown_master')) + '</span>';
    return '<a class="rl-master t-' + esc(v.type) + '" href="#' + esc(f.id) + '" data-focus-version="' + esc(v.id) + '"><i></i>' + esc(L(v.name)) + '</a>' +
      (r.version_sure === false ? ' <span class="muted">(' + esc(t('rl_probable')) + ')</span>' : '');
  }
  function releasesSection(f) {
    const all = A.releasesOf(f);
    const head = '<div class="sec-head"><h2>' + esc(t('rl_title')) + '</h2><p class="sec-lead">' + esc(t('rl_lead')) + '</p></div>';
    const links = Object.keys(f.links || {}).filter((k) => A.safeUrl(f.links[k]));
    const more = links.length ? '<p class="rel-more">' + esc(t('rl_more')) + ' ' + links.map((k) =>
      '<a href="' + esc(f.links[k]) + '" target="_blank" rel="noopener noreferrer">' + esc(LINK_LABELS[k] || A.host(f.links[k])) + ICON.ext + '</a>').join(' ') + '</p>' : '';
    if (!all.length) return '<section class="sec" id="sec-releases">' + head + '<p class="muted">' + esc(t('rl_empty')) + '</p>' + more + '</section>';
    const fmts = A.FORMAT_ORDER.concat(['other']).filter((x) => all.some((r) => r.format === x));
    let curF = A.state.relFormat[f.id] || 'all';
    if (curF !== 'all' && fmts.indexOf(curF) < 0) curF = 'all';
    const countries = Array.from(new Set(all.map((r) => r.country).filter(Boolean))).sort((a, b) => A.countryName(a).localeCompare(A.countryName(b), A.locale()));
    let curC = A.state.relCountry[f.id] || '';
    if (countries.indexOf(curC) < 0) curC = '';
    const chip = (key, label, n) => '<button type="button" class="fchip' + (key === curF ? ' on' : '') + '" aria-pressed="' + (key === curF) + '" data-action="rel-format" data-film="' + esc(f.id) + '" data-format="' + esc(key) + '">' + esc(label) + ' <span class="fcount">' + n + '</span></button>';
    const chips = chip('all', t('rl_all'), all.length) + fmts.map((x) => chip(x, x === 'other' ? t('fmt_other') : t('fmt_' + x), all.filter((r) => r.format === x).length)).join('');
    const select = countries.length > 1 ? '<label class="rel-country"><span>' + esc(t('rl_country')) + '</span><select data-action="rel-country" data-film="' + esc(f.id) + '">' +
      '<option value="">' + esc(t('rl_any_country')) + '</option>' + countries.map((c) => '<option value="' + esc(c) + '"' + (c === curC ? ' selected' : '') + '>' + esc(A.countryName(c)) + '</option>').join('') + '</select></label>' : '';
    const rows = all.filter((r) => (curF === 'all' || r.format === curF) && (!curC || r.country === curC));
    const th = ['rl_date', 'rl_country', 'rl_format', 'rl_edition', 'rl_master', 'rl_source'].map((k) => '<th scope="col">' + esc(t(k)) + '</th>').join('');
    const body = rows.map((r) => '<tr>' +
      '<td data-label="' + esc(t('rl_date')) + '" class="rl-date">' + (r.date ? esc(A.fmtDate(r.date)) : '<span class="muted">' + esc(t('rl_nodate')) + '</span>') + '</td>' +
      '<td data-label="' + esc(t('rl_country')) + '">' + (r.country ? '<span class="cc">' + esc(r.country) + '</span> ' : '') + esc(placeText(r)) + '</td>' +
      '<td data-label="' + esc(t('rl_format')) + '"><span class="fmt f-' + esc(r.format) + '">' + esc(fmtLabel(r)) + '</span></td>' +
      '<td data-label="' + esc(t('rl_edition')) + '" class="rl-ed"><b>' + esc(L(r.label)) + '</b>' + (L(r.name) ? ' <span>' + esc(L(r.name)) + '</span>' : '') +
        (L(r.specs) ? '<small class="rl-specs">' + esc(L(r.specs)) + '</small>' : '') + (L(r.note) ? '<small class="rl-note">' + esc(L(r.note)) + '</small>' : '') + '</td>' +
      '<td data-label="' + esc(t('rl_master')) + '">' + masterCell(f, r) + '</td>' +
      '<td data-label="' + esc(t('rl_source')) + '" class="rl-src">' + (srcMini(r) || '<span class="muted">–</span>') + '</td></tr>').join('');
    return '<section class="sec" id="sec-releases">' + head +
      '<div class="rel-tools"><div class="fchips" role="group" aria-label="' + esc(t('rl_format')) + '">' + chips + '</div>' + select + '</div>' +
      '<p class="rel-count muted">' + esc(rows.length === 1 ? t('rl_one') : t('rl_n', { n: rows.length })) + '</p>' +
      '<div class="table-wrap"><table class="rels"><thead><tr>' + th + '</tr></thead><tbody>' + body + '</tbody></table></div>' +
      more + '</section>';
  }

  /* ---------------- galeria ---------------- */
  const GL_STEP = 24;
  const GL_SIZES = { posters: ['w185', 'w780'], backdrops: ['w300', 'w1280'], logos: ['w185', 'w500'] };
  function galLangs(f, d) {
    const count = {};
    d.posters.forEach((p) => { count[p[1]] = (count[p[1]] || 0) + 1; });
    const pref = [A.lang, A.lang === 'pt' ? 'en' : 'pt'];
    return Object.keys(count).sort((a, b) => {
      const pa = pref.indexOf(a), pb = pref.indexOf(b);
      if (pa >= 0 || pb >= 0) return (pa < 0 ? 9 : pa) - (pb < 0 ? 9 : pb);
      return count[b] - count[a];
    }).map((code) => ({ code, n: count[code] }));
  }
  function langLabel(code) { return code ? A.languageName(code) : t('gl_notext'); }
  V.galleryList = function (f, kind) {
    const g = A.gallery.get(f.tmdb);
    if (!g || g.state !== 'ok') return [];
    const list = g.data[kind] || [];
    if (kind !== 'posters') return list;
    const lang = A.state.galLang[f.id];
    return lang == null || lang === '*' ? list : list.filter((p) => p[1] === lang);
  };
  function galBlock(f, kind, title, chipsHtml) {
    const list = V.galleryList(f, kind);
    if (!list.length && !chipsHtml) return '';
    const show = A.state.galShow[f.id + ':' + kind] || GL_STEP;
    const inUse = kind === 'logos' ? '' : (kind === 'posters' ? A.filmPosterPath(f) : A.filmBackdropPath(f));
    const cells = list.slice(0, show).map((p, i) =>
      '<button type="button" class="gthumb g-' + kind + (p[0] === inUse ? ' in-use' : '') + '" data-action="gal-open" data-film="' + esc(f.id) + '" data-kind="' + kind + '" data-i="' + i + '" aria-label="' + esc(t('gl_open') + ' ' + (i + 1)) + '">' +
        '<img src="' + esc(A.tmdb.img(p[0], GL_SIZES[kind][0])) + '" alt="" loading="lazy" decoding="async">' +
        (kind !== 'backdrops' ? '<span class="gtag">' + esc(langLabel(p[1])) + '</span>' : '') +
        (p[0] === inUse ? '<span class="gcur">' + esc(t('gl_in_use')) + '</span>' : '') + '</button>').join('');
    return '<section class="gal-block"><h3>' + esc(title) + ' <span class="fcount">' + list.length + '</span></h3>' + (chipsHtml || '') +
      '<div class="gal-grid g-' + kind + '">' + cells + '</div>' +
      (list.length > show ? '<p><button type="button" class="btn small ghost" data-action="gal-more" data-film="' + esc(f.id) + '" data-kind="' + kind + '">' + esc(t('gl_more')) + '</button></p>' : '') + '</section>';
  }
  function gallerySection(f) {
    const head = '<div class="sec-head"><h2>' + esc(t('gl_title')) + '</h2><p class="sec-lead">' + esc(t('gl_lead')) + '</p></div>';
    const wrap = (inner) => '<section class="sec gallery" id="sec-gallery">' + head + inner + '</section>';
    if (A.tmdb.mode() === 'off') {
      return wrap('<div class="gal-off"><h3>' + esc(t('gl_off_t')) + '</h3><p>' + esc(t('gl_off')) + '</p>' +
        '<button type="button" class="btn primary" data-action="settings">' + esc(t('gl_open_settings')) + '</button></div>');
    }
    const g = A.gallery.get(f.tmdb);
    if (!g || g.state === 'loading') return wrap('<p class="gal-wait" role="status">' + esc(t('gl_loading')) + '</p>');
    if (g.state === 'error') return wrap('<div class="gal-off"><p>' + esc(t('gl_fail')) + '</p><button type="button" class="btn ghost" data-action="gal-retry" data-film="' + esc(f.id) + '">' + esc(t('gl_retry')) + '</button></div>');
    const d = g.data;
    if (!d.posters.length && !d.backdrops.length && !d.logos.length) return wrap('<p class="muted">' + esc(t('gl_empty')) + '</p>');
    const langs = galLangs(f, d);
    const cur = A.state.galLang[f.id] == null ? '*' : A.state.galLang[f.id];
    const lchip = (code, label, n) => '<button type="button" class="fchip' + (code === cur ? ' on' : '') + '" aria-pressed="' + (code === cur) + '" data-action="gal-lang" data-film="' + esc(f.id) + '" data-lang="' + esc(code) + '">' + esc(label) + ' <span class="fcount">' + n + '</span></button>';
    const chips = d.posters.length ? '<div class="fchips" role="group" aria-label="' + esc(t('gl_posters')) + '">' + lchip('*', t('gl_all'), d.posters.length) + langs.map((l) => lchip(l.code, langLabel(l.code), l.n)).join('') + '</div>' : '';
    return wrap(galBlock(f, 'posters', t('gl_posters'), chips) + galBlock(f, 'backdrops', t('gl_backdrops')) + galBlock(f, 'logos', t('gl_logos')) +
      '<p class="gal-credit muted">' + esc(t('gl_credit')) + '</p>');
  }
  V.lightbox = function (f, kind, i) {
    const list = V.galleryList(f, kind);
    const p = list[i];
    if (!p) return '';
    const sizes = GL_SIZES[kind];
    const meta = [t(kind === 'posters' ? 'gl_poster' : kind === 'backdrops' ? 'gl_backdrop' : 'gl_logo'), kind !== 'backdrops' ? langLabel(p[1]) : '', p[2] && p[3] ? p[2] + '×' + p[3] : '', t('gl_of', { i: i + 1, n: list.length })].filter(Boolean).join(' · ');
    const target = kind === 'posters' ? 'poster' : kind === 'backdrops' ? 'backdrop' : '';
    const mine = A.covers.get(f.id);
    const pinned = A.pins.get(f.id);
    let actions = '';
    if (target) {
      actions += '<button type="button" class="btn small primary" data-action="gal-cover" data-film="' + esc(f.id) + '" data-target="' + target + '" data-path="' + esc(p[0]) + '">' + esc(t(target === 'poster' ? 'gl_use_cover' : 'gl_use_bg')) + '</button>';
      if (mine.poster || mine.backdrop) actions += '<button type="button" class="btn small ghost" data-action="gal-reset" data-film="' + esc(f.id) + '">' + esc(t('gl_reset')) + '</button>';
      if (A.isCurator()) {
        const isPinned = pinned[target] === p[0];
        actions += '<button type="button" class="btn small ghost" data-action="gal-pin" data-film="' + esc(f.id) + '" data-target="' + target + '" data-path="' + esc(isPinned ? '' : p[0]) + '">' + esc(t(isPinned ? 'gl_unpin' : 'gl_pin')) + '</button>';
      }
    }
    actions += '<a class="btn small ghost" href="' + esc(A.tmdb.img(p[0], 'original')) + '" target="_blank" rel="noopener noreferrer">' + esc(t('gl_original')) + ICON.ext + '</a>';
    return '<div class="lb-stage lb-' + kind + '"><img src="' + esc(A.tmdb.img(p[0], sizes[1])) + '" alt="' + esc(A.filmTitle(f) + ' — ' + meta) + '"></div>' +
      '<div class="lb-bar"><div class="lb-nav">' +
        '<button type="button" class="icon-btn" data-action="gal-step" data-dir="-1" aria-label="' + esc(t('prev')) + '"' + (i <= 0 ? ' disabled' : '') + '>' + ICON.left + '</button>' +
        '<p class="lb-meta">' + esc(meta) + '</p>' +
        '<button type="button" class="icon-btn" data-action="gal-step" data-dir="1" aria-label="' + esc(t('next')) + '"' + (i >= list.length - 1 ? ' disabled' : '') + '>' + ICON.right + '</button>' +
      '</div><div class="lb-actions">' + actions + '</div></div>';
  };

  /* ---------------- página do filme (com abas) ---------------- */
  const FILM_TABS = ['guia', 'versoes', 'lancamentos', 'galeria'];
  V.SECTION_TAB = { 'sec-guide': 'guia', 'sec-score': 'guia', 'sec-timeline': 'versoes', 'sec-versions': 'versoes', 'sec-cuts': 'versoes', 'sec-dubs': 'versoes', 'sec-notes': 'versoes', 'sec-sources': 'versoes', 'sec-releases': 'lancamentos', 'sec-gallery': 'galeria' };
  V.filmTabs = function (f) {
    const hasGuide = f.guide.length || scoredVersions(f).length;
    return FILM_TABS.filter((tb) => (tb === 'guia' ? hasGuide : tb === 'galeria' ? !!f.tmdb : true));
  };
  V.filmTab = function (f) {
    const tabs = V.filmTabs(f);
    const want = A.state.filmTab[f.id];
    return tabs.indexOf(want) >= 0 ? want : tabs[0];
  };
  function tabLabel(f, tb) {
    if (tb === 'guia') return '<span class="tl-long">' + esc(t('tab_guide')) + '</span><span class="tl-short">' + esc(t('tab_guide_short')) + '</span>';
    if (tb === 'versoes') return esc(t('tab_versions')) + ' <span class="fcount">' + f.versions.length + '</span>';
    if (tb === 'lancamentos') { const n = A.releasesOf(f).length; return esc(t('tab_releases')) + (n ? ' <span class="fcount">' + n + '</span>' : ''); }
    return esc(t('tab_gallery'));
  }
  function filmPanel(f, tb) {
    if (tb === 'guia') return guideSection(f) + scoreSection(f);
    if (tb === 'lancamentos') return releasesSection(f);
    if (tb === 'galeria') return gallerySection(f);
    return timelineSection(f) + versionsSection(f) + cutsSection(f) + dubsSection(f) + notesSection(f) +
      (f.wanted ? '<aside class="wanted-note"><h2>' + esc(t('fp_wanted')) + '</h2><p>' + esc(L(f.wanted)) + '</p><button class="btn small ghost" type="button" data-action="suggest" data-film="' + esc(f.id) + '" data-kind="version">' + esc(t('nav_suggest')) + '</button></aside>' : '') +
      sourcesSection(f);
  }

  V.film = function (f) {
    if (!f) return V.notFound();
    const title = A.filmTitle(f);
    const bd = A.filmBackdrop(f, 'w1280');
    const poster = A.filmPoster(f, 'w342');
    const fan = f.versions.filter((v) => isFan(v.type)).length;
    const aka = f.aka ? (f.aka[A.lang] || []) : [];
    const showOriginal = f.original_title && A.fold(f.original_title) !== A.fold(title);
    const tabs = V.filmTabs(f);
    const tab = V.filmTab(f);
    return '<article class="film" style="' + art(f) + '">' +
      '<header class="film-hero">' +
        '<div class="hero-bg" aria-hidden="true">' + (bd ? '<img src="' + esc(bd) + '" alt="" decoding="async">' : '<span class="hero-year">' + esc(f.year) + '</span>') + '</div>' +
        '<div class="film-hero-inner">' +
          '<div class="film-side"><div class="film-poster">' + (poster
            ? '<img src="' + esc(poster) + '" alt="' + esc(title) + '" decoding="async">'
            : '<span class="poster-label"><span class="pl-year">' + esc(f.year) + '</span><span class="pl-title">' + esc(title) + '</span><span class="pl-dir">' + esc(f.director || '') + '</span></span>') + '</div>' +
            (!poster && f.tmdb && A.tmdb.mode() === 'off' ? '<button type="button" class="link-chip tmdb-hint" data-action="settings">' + esc(t('hero_tmdb_hint')) + '</button>' : '') +
          '</div>' +
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
              (tabs.indexOf('guia') >= 0 ? '<button class="btn primary" type="button" data-action="goto" data-target="sec-guide">' + esc(t('hero_cta_guide')) + '</button>' : '') +
              '<button class="btn ghost" type="button" data-action="suggest" data-film="' + esc(f.id) + '" data-kind="version">' + esc(t('fp_suggest')) + '</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</header>' +
      (L(f.intro) ? '<section class="film-intro"><p>' + esc(L(f.intro)) + '</p></section>' : '') +
      '<nav class="film-tabs" id="film-tabs" aria-label="' + esc(t('tabs_label')) + '"><div class="film-tabs-inner" role="tablist">' +
        tabs.map((tb) => '<button type="button" role="tab" class="ftab' + (tb === tab ? ' on' : '') + '" id="tab-' + tb + '" aria-selected="' + (tb === tab) + '" aria-controls="film-panel" tabindex="' + (tb === tab ? '0' : '-1') + '" data-action="film-tab" data-film="' + esc(f.id) + '" data-tab="' + tb + '">' + tabLabel(f, tb) + '</button>').join('') +
      '</div></nav>' +
      '<div class="film-panel" id="film-panel" role="tabpanel" aria-labelledby="tab-' + tab + '">' + filmPanel(f, tab) + '</div>' +
    '</article>';
  };

  /* ---------------- músicas ---------------- */
  const PLAY = '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M7 4.5v15l12-7.5z" fill="currentColor"/></svg>';
  const MLINKS = ['wikipedia', 'archive', 'musicbrainz', 'discogs', 'setlistfm', 'concerts'];
  const artArt = (a) => '--a:' + A.safeColor(a.accent, '#e0607e') + ';--b:' + A.safeColor(a.accent2, '#6c8fd6');
  const artistHref = (a, tab, focus) => '#musicas/' + a.id + (tab && tab !== 'musicas' ? '/' + tab : '') + (focus ? '/' + focus : '');
  const songHref = (a, s) => '#musicas/' + a.id + '/' + s.id;
  function mtBadge(type) { return '<span class="badge mt-' + esc(type) + '"><i aria-hidden="true"></i>' + esc(t('mt_' + type)) + '</span>'; }
  function msChip(st) { return '<span class="chip ms-' + esc(st) + '">' + esc(t('ms_' + st)) + '</span>'; }
  V.mtBadge = mtBadge;
  function songTitle(a, tr) {
    const s = tr.song && A.song(a, tr.song);
    return s ? s.title : (L(tr.title) || t('mu_song'));
  }
  function playBtn(o) {
    if (!A.ia.ok(o.id)) return '';
    return '<button type="button" class="btn small play' + (o.icon ? ' icon-only' : '') + '" data-action="play" data-ia="' + esc(o.id) + '"' +
      (o.file ? ' data-file="' + esc(o.file) + '"' : '') + ' data-title="' + esc(o.title) + '" data-sub="' + esc(o.sub || '') + '"' +
      (o.icon ? ' aria-label="' + esc(t('mu_listen') + ': ' + o.title) + '" title="' + esc(t('mu_listen')) + '"' : '') + '>' + PLAY + (o.icon ? '' : '<span>' + esc(o.label || t('mu_listen')) + '</span>') + '</button>';
  }
  function iaLink(id) {
    const u = A.ia.details(id);
    return u ? '<a class="btn small ghost" href="' + esc(u) + '" target="_blank" rel="noopener noreferrer">' + esc(t('mu_open_ia')) + ICON.ext + '</a>' : '';
  }
  function artistStats(a) {
    let rare = 0;
    a.songs.forEach((s) => { rare += A.songVersions(a, s).filter(A.isRare).length; });
    return { songs: a.songs.length, rare, unrel: a.songs.filter((s) => s.status === 'unreleased').length, sessions: a.sessions.length };
  }
  function statLine(st) {
    return [A.plural(st.songs, 'mu_one_song', 'mu_n_songs'), A.plural(st.rare, 'mu_one_rare', 'mu_n_rare'),
      st.unrel ? A.plural(st.unrel, 'mu_one_unrel', 'mu_n_unrel') : '', st.sessions ? A.plural(st.sessions, 'mu_one_session', 'mu_n_sessions') : ''].filter(Boolean);
  }
  function artistCard(a) {
    return '<a class="acard" href="' + esc(artistHref(a)) + '" style="' + artArt(a) + '">' +
      '<span class="acard-disc" aria-hidden="true"><span class="acard-label">' + esc(a.name.replace(/^[’']/, '').charAt(0)) + '</span></span>' +
      '<span class="acard-body"><span class="acard-name">' + esc(a.name) + '</span>' +
        '<span class="acard-meta">' + esc([a.years, L(a.origin)].filter(Boolean).join(' · ')) + '</span>' +
        '<span class="acard-counts">' + statLine(artistStats(a)).map((x) => '<span>' + esc(x) + '</span>').join('') + '</span></span></a>';
  }
  function songRow(a, s, showArtist) {
    const vs = A.songVersions(a, s);
    const types = A.MUSIC_TYPES.filter((tp) => vs.some((v) => v.type === tp));
    return '<li class="srow"><a class="srow-link" href="' + esc(songHref(a, s)) + '"><span class="srow-title">' + esc(s.title) + '</span>' +
      (showArtist ? '<span class="srow-artist">' + esc(a.name) + '</span>' : (s.year ? '<span class="srow-year">' + esc(s.year) + '</span>' : '')) + '</a>' +
      '<span class="srow-status">' + msChip(s.status) + '</span>' +
      '<span class="srow-types">' + types.map((tp) => {
        const n = vs.filter((v) => v.type === tp).length;
        return '<span class="tchip mt-' + tp + '"><i aria-hidden="true"></i>' + esc(t('mt_' + tp)) + (n > 1 ? ' <b>×' + n + '</b>' : '') + '</span>';
      }).join('') + '</span></li>';
  }
  // Cartões das versões raras para a fileira da página inicial
  function musicFrames() {
    const out = [];
    A.music.artists.forEach((a) => a.songs.forEach((s) => A.songVersions(a, s).filter(A.isRare).forEach((v) => out.push({ a, s, v }))));
    out.sort((p, q) => (q.s.status === 'unreleased') - (p.s.status === 'unreleased') || A.dateKey(p.v.date) - A.dateKey(q.v.date));
    return out.slice(0, 16).map((o) => '<a class="frame mframe-card mt-' + esc(o.v.type) + '" href="' + esc(songHref(o.a, o.s)) + '" style="' + artArt(o.a) + '">' +
      '<span class="frame-pic"><span class="frame-film">' + esc(o.a.name) + '</span><span class="frame-name">' + esc(o.s.title) + '</span></span>' +
      '<span class="frame-info">' + mtBadge(o.v.type) + '<span class="frame-date">' + esc(A.fmtDate(o.v.date)) + '</span></span>' +
      '<span class="frame-seal">' + msChip(o.s.status) + '</span></a>').join('');
  }
  function sessionMini(a, x) {
    return '<article class="smini mt-' + esc(x.kind) + '">' +
      '<p class="smini-top">' + mtBadge(x.kind) + '<span class="smini-date">' + esc(A.fmtDate(x.date)) + '</span></p>' +
      '<h3><a href="' + esc(artistHref(a, 'gravacoes', x.id)) + '">' + esc(L(x.title)) + '</a></h3>' +
      '<p class="smini-meta">' + esc([a.name, A.sessionPlace(x), x.source_type ? t('msrc_' + x.source_type) : ''].filter(Boolean).join(' · ')) + '</p>' +
      '<p class="smini-actions">' + (x.archive ? playBtn({ id: x.archive.id, title: L(x.title), sub: a.name + ' · ' + A.fmtDate(x.date), label: t('mu_listen_all') }) : '') + '</p>' +
    '</article>';
  }
  function musicSearch(fq) {
    const arts = [];
    const songs = [];
    const sess = [];
    A.music.artists.forEach((a) => {
      if (A.fold(a.name).replace(/[’']/g, '').indexOf(fq.replace(/[’']/g, '')) >= 0) arts.push(a);
      a.songs.forEach((s) => { if (A.fold(s.title).indexOf(fq) >= 0) songs.push({ a, s }); });
      a.sessions.forEach((x) => { if ([L(x.title), x.venue, x.city, x.date].some((v) => A.fold(v).indexOf(fq) >= 0)) sess.push({ a, x }); });
    });
    if (!arts.length && !songs.length && !sess.length) return '';
    return '<div class="sr-group"><h3>' + esc(t('s_music')) + '</h3>' +
      arts.map((a) => '<a class="sr-item" href="' + esc(artistHref(a)) + '"><span class="sr-title">' + esc(a.name) + '</span><span class="sr-sub"><span>' + esc(a.years || '') + '</span><span>' + esc(A.plural(a.songs.length, 'mu_one_song', 'mu_n_songs')) + '</span></span></a>').join('') +
      songs.slice(0, 8).map((o) => '<a class="sr-item" href="' + esc(songHref(o.a, o.s)) + '"><span class="sr-title">' + esc(o.s.title) + '</span><span class="sr-sub"><span>' + esc(o.a.name) + '</span><span>' + esc(t('ms_' + o.s.status)) + '</span></span></a>').join('') +
      sess.slice(0, 4).map((o) => '<a class="sr-item" href="' + esc(artistHref(o.a, 'gravacoes', o.x.id)) + '"><span class="sr-title">' + esc(L(o.x.title)) + '</span><span class="sr-sub"><span>' + esc(o.a.name) + '</span><span>' + esc(A.fmtDate(o.x.date)) + '</span></span></a>').join('') +
    '</div>';
  }

  V.musicHome = function () {
    const arts = A.music.artists;
    const unrel = [];
    const sess = [];
    arts.forEach((a) => {
      a.songs.filter((s) => s.status === 'unreleased').forEach((s) => unrel.push({ a, s }));
      a.sessions.forEach((x) => sess.push({ a, x }));
    });
    sess.sort((p, q) => A.dateKey((q.x.archive && q.x.archive.added) || q.x.date) - A.dateKey((p.x.archive && p.x.archive.added) || p.x.date));
    return '<section class="page music-home">' +
      '<header class="page-head"><h1>' + esc(t('mu_title')) + '</h1><p class="lead">' + esc(t('mu_lead')) + '</p>' +
        '<p><button type="button" class="btn small ghost" data-action="suggest" data-kind="music">' + esc(t('nav_suggest')) + '</button></p></header>' +
      '<section class="sec"><div class="sec-head"><h2>' + esc(t('mu_artists')) + '</h2></div><div class="acards">' + arts.map(artistCard).join('') + '</div></section>' +
      (sess.length ? '<section class="sec"><div class="sec-head"><h2>' + esc(t('mu_sessions_row')) + '</h2></div><div class="smini-list">' + sess.slice(0, 6).map((o) => sessionMini(o.a, o.x)).join('') + '</div></section>' : '') +
      (unrel.length ? '<section class="sec"><div class="sec-head"><h2>' + esc(t('mu_unrel_row')) + '</h2></div><ul class="slist">' + unrel.map((o) => songRow(o.a, o.s, true)).join('') + '</ul></section>' : '') +
      '<p class="sec mu-policy muted">' + esc(t('mu_policy')) + '</p>' +
    '</section>';
  };

  /* página do artista */
  const ARTIST_TABS = ['musicas', 'gravacoes', 'discografia'];
  V.ARTIST_TABS = ARTIST_TABS;
  V.artistTab = function (a) { const tb = A.state.artistTab[a.id]; return ARTIST_TABS.indexOf(tb) >= 0 ? tb : 'musicas'; };
  function linksBlock(a) {
    const ks = MLINKS.filter((k) => A.safeUrl(a.links[k]));
    if (!ks.length) return '';
    return '<p class="rel-more">' + esc(t('mu_links')) + ': ' + ks.map((k) => '<a href="' + esc(a.links[k]) + '" target="_blank" rel="noopener noreferrer">' + esc(t('mu_link_' + k)) + ICON.ext + '</a>').join(' ') + '</p>';
  }
  function songsPanel(a) {
    const cur = A.state.songFilter[a.id] || 'all';
    const tests = {
      all: () => true,
      unrel: (s) => s.status === 'unreleased',
      demo: (s) => A.songVersions(a, s).some((v) => v.type === 'demo'),
      live: (s) => A.songVersions(a, s).some((v) => v.type === 'live' || v.type === 'session')
    };
    const keys = ['all', 'unrel', 'demo', 'live'].filter((k) => k === 'all' || a.songs.some(tests[k]));
    const chips = keys.map((k) => {
      const n = a.songs.filter(tests[k]).length;
      return '<button type="button" class="fchip' + (k === cur ? ' on' : '') + '" aria-pressed="' + (k === cur) + '" data-action="song-filter" data-artist="' + esc(a.id) + '" data-filter="' + k + '">' +
        esc(t(k === 'all' ? 'mu_all' : 'mu_f_' + k)) + ' <span class="fcount">' + n + '</span></button>';
    }).join('');
    const list = a.songs.filter(tests[cur] || tests.all).slice().sort((p, q) => p.title.localeCompare(q.title));
    const srcs = sourceLinks((a.intro_src || []).concat(...a.songs.map((s) => s.src || [])));
    return '<section class="sec" id="sec-songs"><div class="fchips" role="group" aria-label="' + esc(t('atab_songs')) + '">' + chips + '</div>' +
      (list.length ? '<ul class="slist">' + list.map((s) => songRow(a, s)).join('') + '</ul>' : '<p class="muted">' + esc(t('mu_none')) + '</p>') + '</section>' +
      (a.wanted ? '<aside class="wanted-note"><h2>' + esc(t('mu_wanted')) + '</h2><p>' + esc(L(a.wanted)) + '</p><button class="btn small ghost" type="button" data-action="suggest" data-kind="music" data-artist="' + esc(a.id) + '">' + esc(t('nav_suggest')) + '</button></aside>' : '') +
      '<section class="sec">' + linksBlock(a) + (srcs ? '<h2 class="h-small">' + esc(t('fp_sources')) + '</h2>' + srcs : '') + '<p class="mu-policy muted">' + esc(t('mu_policy')) + '</p></section>';
  }
  function sessionCard(a, x) {
    const meta = [A.sessionPlace(x), x.source_type ? t('msrc_' + x.source_type) : '', x.archive && x.archive.runtime ? x.archive.runtime : ''].filter(Boolean).join(' · ');
    const tracks = x.tracks.map((tr) => {
      const s = tr.song && A.song(a, tr.song);
      const title = songTitle(a, tr);
      return '<li><span class="trk-n">' + esc(tr.n || '') + '</span>' +
        '<span class="trk-t">' + (s ? '<a href="' + esc(songHref(a, s)) + '">' + esc(title) + '</a>' + (s.status === 'unreleased' ? ' ' + msChip('unreleased') : '') : '<span class="muted">' + esc(title) + '</span>') +
          (L(tr.note) ? '<small>' + esc(L(tr.note)) + '</small>' : '') + '</span>' +
        '<span class="trk-l">' + esc(tr.length || '') + '</span>' +
        '<span class="trk-p">' + (x.archive && tr.file ? playBtn({ id: x.archive.id, file: tr.file, title, sub: a.name + ' · ' + L(x.title) + ' · ' + A.fmtDate(x.date), icon: true }) : '') + '</span></li>';
    }).join('');
    const q = Math.round(Number(x.quality) || 0);
    return '<article class="sess mt-' + esc(x.kind) + '" id="s-' + esc(x.id) + '">' +
      '<header class="sess-head"><p class="smini-top">' + mtBadge(x.kind) + '<span class="smini-date">' + esc(A.fmtDate(x.date)) + '</span>' + (x.community ? ' <span class="chip community">' + esc(t('fp_community')) + '</span>' : '') + '</p>' +
        '<h3>' + esc(L(x.title)) + '</h3><p class="sess-meta">' + esc(meta) + '</p></header>' +
      (L(x.notes) ? '<p class="sess-notes">' + esc(L(x.notes)) + '</p>' : '') +
      (x.archive ? '<p class="sess-actions">' + playBtn({ id: x.archive.id, title: L(x.title), sub: a.name + ' · ' + A.fmtDate(x.date), label: t('mu_listen_all') }) + iaLink(x.archive.id) + '</p>' : '') +
      '<details class="vrow-more"><summary>' + esc(t('mu_lineage')) + '</summary><dl class="specs">' +
        (L(x.lineage) ? '<div><dt>' + esc(t('mu_lineage')) + '</dt><dd>' + esc(L(x.lineage)) + '</dd></div>' : '') +
        (q ? '<div><dt>' + esc(t('mu_quality')) + '</dt><dd><span class="lv' + q + '">' + dots(q) + '</span> ' + esc(t('sc_lv' + q)) + (L(x.quality_note) ? ' — ' + esc(L(x.quality_note)) : '') + '</dd></div>' : '') +
        (x.archive && x.archive.uploader ? '<div><dt>Internet Archive</dt><dd>' + esc(t('mu_uploaded', { u: x.archive.uploader, d: A.fmtDate(x.archive.added) })) + (x.archive.collection ? ' · ' + esc(x.archive.collection) : '') + '</dd></div>' : '') +
      '</dl>' + sourceLinks(x.src, x.src_urls) + '</details>' +
      (tracks ? '<h4>' + esc(t('mu_tracks')) + '</h4><ol class="tracks">' + tracks + '</ol>' : '') +
    '</article>';
  }
  function sessionsPanel(a) {
    const list = a.sessions.slice().sort((p, q) => A.dateKey(p.date) - A.dateKey(q.date));
    return '<section class="sec" id="sec-sessions">' + (list.length ? '<div class="sess-list">' + list.map((x) => sessionCard(a, x)).join('') + '</div>' : '<p class="muted">' + esc(t('mu_none')) + '</p>') +
      '<p class="mu-policy muted">' + esc(t('mu_policy')) + '</p></section>';
  }
  const RG_ORDER = ['Album', 'EP', 'Single', 'Live', 'Compilation', 'Other'];
  function rgGroup(g) {
    if (g.sec.indexOf('Compilation') >= 0) return 'Compilation';
    if (g.sec.indexOf('Live') >= 0) return 'Live';
    return ['Album', 'EP', 'Single'].indexOf(g.type) >= 0 ? g.type : 'Other';
  }
  function discoPanel(a) {
    const head = '<div class="sec-head"><p class="sec-lead">' + esc(t('mu_disco_lead')) + '</p></div>';
    const m = A.mb.get(a);
    if (!m || m.state === 'loading') return '<section class="sec" id="sec-disco">' + head + '<p class="gal-wait" role="status">' + esc(t('mu_disco_loading')) + '</p></section>';
    if (m.state === 'error') return '<section class="sec" id="sec-disco">' + head + '<div class="gal-off"><p>' + esc(t('mu_disco_fail')) + '</p><button type="button" class="btn ghost" data-action="disco-retry" data-artist="' + esc(a.id) + '">' + esc(t('gl_retry')) + '</button></div></section>';
    if (!m.data.length) return '<section class="sec" id="sec-disco">' + head + '<p class="muted">' + esc(t('mu_disco_empty')) + '</p></section>';
    const groups = RG_ORDER.map((k) => ({ k, items: m.data.filter((g) => rgGroup(g) === k).sort((p, q) => String(p.date).localeCompare(String(q.date))) })).filter((g) => g.items.length);
    return '<section class="sec" id="sec-disco">' + head + groups.map((g) =>
      '<div class="gal-block"><h3>' + esc(t('mu_rg_' + g.k)) + ' <span class="fcount">' + g.items.length + '</span></h3><div class="rg-grid">' + g.items.map((r) =>
        '<a class="rg" href="https://musicbrainz.org/release-group/' + esc(r.id) + '" target="_blank" rel="noopener noreferrer">' +
          '<span class="rg-cover" style="' + artArt(a) + '"><span class="rg-ph">' + esc(r.title) + '</span><img src="' + esc(A.caa(r.id, 250)) + '" alt="" loading="lazy" decoding="async"></span>' +
          '<span class="rg-title">' + esc(r.title) + '</span><span class="rg-year">' + esc(A.year(r.date) || '') + '</span></a>').join('') + '</div></div>').join('') +
      '<p class="gal-credit muted">' + esc(t('mu_disco_credit')) + (m.mbid ? ' <a href="https://musicbrainz.org/artist/' + esc(m.mbid) + '" target="_blank" rel="noopener noreferrer">MusicBrainz' + ICON.ext + '</a>' : '') + '</p></section>';
  }
  V.artist = function (a) {
    const tab = V.artistTab(a);
    const st = artistStats(a);
    const members = a.members.map((m) => esc(m.name) + (L(m.role) ? ' <span class="muted">(' + esc(L(m.role)) + ')</span>' : '')).join(' · ');
    const tabs = [['musicas', 'atab_songs', a.songs.length], ['gravacoes', 'atab_sessions', a.sessions.length], ['discografia', 'atab_disco', 0]];
    const panel = tab === 'gravacoes' ? sessionsPanel(a) : tab === 'discografia' ? discoPanel(a) : songsPanel(a);
    return '<article class="film artist" style="' + artArt(a) + '">' +
      '<header class="film-hero"><div class="hero-bg" aria-hidden="true"><span class="hero-year">' + esc(String(a.years || '').slice(0, 4)) + '</span></div>' +
        '<div class="film-hero-inner"><div class="film-side"><div class="film-poster disc-poster"><span class="acard-disc big" aria-hidden="true"><span class="acard-label">' + esc(a.name.replace(/^[’']/, '').charAt(0)) + '</span></span></div></div>' +
          '<div class="film-head"><p class="eyebrow"><a href="#musicas">' + esc(t('mu_title')) + '</a></p><h1>' + esc(a.name) + '</h1>' +
            '<p class="meta">' + [a.years, L(a.origin)].filter(Boolean).map((x) => '<span>' + esc(x) + '</span>').join('') + '</p>' +
            (members ? '<p class="film-alt">' + esc(t('mu_members')) + ': ' + members + '</p>' : '') +
            (L(a.intro) ? '<p class="film-overview">' + esc(L(a.intro)) + '</p>' : '') +
            '<p class="film-counts">' + statLine(st).map((x) => '<span>' + esc(x) + '</span>').join('') + '</p>' +
            '<div class="actions"><button class="btn ghost" type="button" data-action="suggest" data-kind="music" data-artist="' + esc(a.id) + '">' + esc(t('nav_suggest')) + '</button></div>' +
          '</div></div></header>' +
      '<nav class="film-tabs" id="artist-tabs" aria-label="' + esc(t('atabs_label')) + '"><div class="film-tabs-inner" role="tablist">' +
        tabs.map((tb) => '<button type="button" role="tab" class="ftab' + (tb[0] === tab ? ' on' : '') + '" id="atab-' + tb[0] + '" aria-selected="' + (tb[0] === tab) + '" aria-controls="artist-panel" tabindex="' + (tb[0] === tab ? '0' : '-1') + '" data-action="artist-tab" data-artist="' + esc(a.id) + '" data-tab="' + tb[0] + '">' +
          esc(t(tb[1])) + (tb[2] ? ' <span class="fcount">' + tb[2] + '</span>' : '') + '</button>').join('') +
      '</div></nav><div class="film-panel" id="artist-panel" role="tabpanel" aria-labelledby="atab-' + tab + '">' + panel + '</div></article>';
  };

  /* página da música */
  V.song = function (a, s) {
    const vs = A.songVersions(a, s);
    const rare = vs.filter(A.isRare).length;
    const rows = vs.map((v) => {
      const x = v.session && A.recording(a, v.session);
      const title = L(v.title) || t('mt_' + v.type);
      const meta = [L(v.place), v.source_type ? t('msrc_' + v.source_type) : '', v.length, v.track ? t('mu_track', { n: v.track }) : '', L(v.by)].filter(Boolean).join(' · ');
      const listen = x && x.archive ? playBtn({ id: x.archive.id, file: v.file, title: s.title, sub: a.name + ' · ' + title + ' · ' + A.fmtDate(v.date) }) + iaLink(x.archive.id) : '';
      return '<article class="mver mt-' + esc(v.type) + '" id="mv-' + esc(v.id) + '">' +
        '<div class="mver-head">' + mtBadge(v.type) + '<h3>' + esc(title) + '</h3><span class="vrow-date">' + esc(A.fmtDate(v.date)) + '</span>' + (v.community ? ' <span class="chip community">' + esc(t('fp_community')) + '</span>' : '') + '</div>' +
        (meta ? '<p class="mver-meta">' + esc(meta) + '</p>' : '') +
        '<p class="badges">' + (v.availability ? '<span class="chip mav-' + esc(v.availability) + '">' + esc(t('mav_' + v.availability)) + '</span>' : '') +
          (v.type === 'studio' ? '<span class="chip">' + esc(t('mu_studio_ref')) + '</span>' : '') + '</p>' +
        (L(v.summary) ? '<p class="vrow-sum">' + esc(L(v.summary)) + '</p>' : '') +
        (L(v.trackNote) ? '<p class="vrow-sum muted">' + esc(L(v.trackNote)) + '</p>' : '') +
        ((v.differences || []).length ? '<ul class="diffs">' + v.differences.map((d) => '<li>' + esc(L(d)) + '</li>').join('') + '</ul>' : '') +
        '<p class="sess-actions">' + listen + (x ? '<a class="link-chip" href="' + esc(artistHref(a, 'gravacoes', x.id)) + '">' + esc(t('mu_from_session', { x: L(x.title) + ' (' + A.fmtDate(x.date) + ')' })) + '</a>' : '') + '</p>' +
        (sourceLinks(v.src, v.src_urls) ? '<details class="vrow-more"><summary>' + esc(t('fp_sources')) + '</summary>' + sourceLinks(v.src, v.src_urls) + '</details>' : '') +
      '</article>';
    }).join('');
    return '<article class="film song" style="' + artArt(a) + '">' +
      '<header class="song-head sec"><p class="eyebrow"><a href="#musicas">' + esc(t('mu_title')) + '</a> / <a href="' + esc(artistHref(a)) + '">' + esc(a.name) + '</a></p>' +
        '<h1>' + esc(s.title) + '</h1>' +
        '<p class="badges">' + msChip(s.status) + (s.year ? '<span class="chip">' + esc(s.year) + '</span>' : '') +
          '<span class="chip">' + esc(A.plural(rare, 'mu_one_rare', 'mu_n_rare')) + '</span></p>' +
        (L(s.first) ? '<p class="film-alt">' + esc(t('mu_first', { x: L(s.first) })) + '</p>' : '') +
        (L(s.note) ? '<p class="film-overview">' + esc(L(s.note)) + '</p>' : '') +
        (sourceLinks(s.src) ? '<details class="vrow-more"><summary>' + esc(t('fp_sources')) + '</summary>' + sourceLinks(s.src) + '</details>' : '') +
      '</header>' +
      '<section class="sec"><div class="sec-head"><h2>' + esc(t('mu_versions')) + '</h2></div>' +
        (rows ? '<div class="mver-list">' + rows + '</div>' : '<p class="muted">' + esc(t('mu_no_versions')) + '</p>') +
        '<p><button class="btn small ghost" type="button" data-action="suggest" data-kind="music" data-artist="' + esc(a.id) + '" data-song="' + esc(s.id) + '">' + esc(t('nav_suggest')) + '</button></p>' +
      '</section></article>';
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
      '<section class="sec"><h2>' + esc(t('ab_score')) + '</h2><p>' + esc(t('ab_score_lead')) + '</p><dl class="legend-list">' +
        CRITERIA.map((c) => '<div><dt><b>' + esc(t('sc_' + c)) + '</b></dt><dd>' + esc(t('scd_' + c)) + '</dd></div>').join('') + '</dl></section>' +
      '<section class="sec"><h2>' + esc(t('ab_dubs')) + '</h2><p>' + esc(t('ab_dubs_lead')) + '</p></section>' +
      '<section class="sec"><h2>' + esc(t('ab_music')) + '</h2><p>' + esc(t('ab_music_lead')) + '</p><dl class="legend-list">' +
        A.MUSIC_TYPES.map((tp) => '<div><dt>' + mtBadge(tp) + '</dt><dd>' + esc(t('mtd_' + tp)) + '</dd></div>').join('') + '</dl>' +
        '<p class="rel-more"><a href="https://archive.org/" target="_blank" rel="noopener noreferrer">Internet Archive' + ICON.ext + '</a> ' +
        '<a href="https://musicbrainz.org/" target="_blank" rel="noopener noreferrer">MusicBrainz' + ICON.ext + '</a> ' +
        '<a href="https://coverartarchive.org/" target="_blank" rel="noopener noreferrer">Cover Art Archive' + ICON.ext + '</a></p></section>' +
      '<section class="sec"><h2>' + esc(t('ab_data')) + '</h2><p>' + esc(t('ab_data_lead')) + '</p>' +
        '<p class="rel-more"><a href="https://www.blu-ray.com/" target="_blank" rel="noopener noreferrer">Blu-ray.com' + ICON.ext + '</a> ' +
        '<a href="https://www.dvdcompare.net/" target="_blank" rel="noopener noreferrer">DVDCompare' + ICON.ext + '</a></p></section>' +
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
    html += musicSearch(fq);
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
