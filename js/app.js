/* RareVersion — inicialização, rotas, busca, sugestões, comparação e eventos */
(function () {
  'use strict';
  const A = window.AMR;
  const esc = A.esc;
  const t = A.t;
  const L = A.L;
  const V = A.views;
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (sel, root) => (root || document).querySelector(sel);

  A.state = {
    compare: new Set(), compareFilm: null, guideNeed: {}, typeFilter: {}, newsFilter: 'fan', pendingFocus: null, route: '',
    filmTab: {}, scoreSel: {}, relFormat: {}, relCountry: {}, galLang: {}, galShow: {}, lb: null,
    artistTab: {}, songFilter: {}, photoKind: {}
  };
  const ARTIST_TABS = ['musicas', 'gravacoes', 'galeria', 'discografia'];

  const GEAR = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" stroke-width="2"/>' +
    '<path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
    '<circle cx="12" cy="12" r="6.6" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
  const EYE = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="2"/></svg>';

  const BRAND_MARK = '<svg class="brand-mark" viewBox="0 0 30 22" width="30" height="22" aria-hidden="true">' +
    '<rect x="1" y="1" width="28" height="20" rx="3" fill="none" stroke="currentColor" stroke-width="2"/>' +
    '<rect x="8.5" y="5" width="13" height="12" rx="1.5" fill="currentColor"/>' +
    '<g fill="currentColor"><rect x="3.4" y="4" width="2.6" height="2.4" rx=".6"/><rect x="3.4" y="9.8" width="2.6" height="2.4" rx=".6"/><rect x="3.4" y="15.6" width="2.6" height="2.4" rx=".6"/>' +
    '<rect x="24" y="4" width="2.6" height="2.4" rx=".6"/><rect x="24" y="9.8" width="2.6" height="2.4" rx=".6"/><rect x="24" y="15.6" width="2.6" height="2.4" rx=".6"/></g></svg>';

  /* ---------------- moldura do site ---------------- */
  function siteName() { return A.cfg('SITE_NAME') || 'RareVersion'; }

  function header() {
    const r = A.state.route;
    const base = String(r).split('/')[0];
    const nav = [['', 'nav_home'], ['filmes', 'nav_films'], ['musicas', 'nav_music'], ['novos', 'nav_new'], ['sobre', 'nav_about']].map((n) =>
      '<a href="#' + n[0] + '"' + (base === n[0] ? ' aria-current="page"' : '') + '>' + esc(t(n[1])) + '</a>').join('');
    return '<a class="skip" href="#main">' + (A.lang === 'pt' ? 'Pular para o conteúdo' : 'Skip to content') + '</a>' +
      '<header class="topbar"><div class="topbar-inner">' +
        '<a class="brand" href="#">' + BRAND_MARK + '<span>' + esc(siteName()) + '</span></a>' +
        '<nav class="mainnav" aria-label="' + esc(siteName()) + '">' + nav + '</nav>' +
        '<div class="search" role="search">' +
          '<label class="sr-only" for="q">' + esc(t('search_label')) + '</label>' +
          '<input id="q" type="search" autocomplete="off" spellcheck="false" placeholder="' + esc(t('search_ph')) + '" aria-controls="search-panel">' +
          '<div class="search-panel" id="search-panel" hidden></div>' +
        '</div>' +
        '<div class="lang" role="group" aria-label="' + esc(t('lang_group')) + '">' +
          '<button type="button" data-action="lang" data-lang="pt" aria-pressed="' + (A.lang === 'pt') + '">PT</button>' +
          '<button type="button" data-action="lang" data-lang="en" aria-pressed="' + (A.lang === 'en') + '">EN</button>' +
        '</div>' +
        '<button type="button" class="icon-btn gear" data-action="settings" aria-label="' + esc(t('st_title')) + '" title="' + esc(t('st_title')) + '">' + GEAR + '</button>' +
        '<button type="button" class="btn small primary suggest-btn" data-action="suggest">' + esc(t('nav_suggest')) + '</button>' +
      '</div></header>';
  }

  function footer() {
    return '<footer class="site-foot"><div class="foot-inner">' +
      '<p class="foot-brand">' + BRAND_MARK + '<span>' + esc(siteName()) + '</span></p>' +
      '<p>' + esc(t('ft_tag')) + ' ' + esc(t('ft_policy')) + '</p>' +
      '<p class="muted">' + esc(t('ft_tmdb')) + '</p>' +
      '<p class="muted">' + esc(t('ft_updated', { d: A.fmtDate(A.catalogUpdated) })) +
        (A.backend.mode() === 'demo' ? ' <span class="chip">' + esc(t('ft_demo')) + '</span>' : '') + '</p>' +
      '<nav class="foot-nav"><a href="#sobre">' + esc(t('nav_about')) + '</a><button type="button" class="link-btn" data-action="settings">' + esc(t('st_title')) + '</button><a href="#admin">' + esc(t('nav_admin')) + '</a></nav>' +
    '</div></footer>';
  }

  function vtypeOptions() {
    return ['official', 'fan_scan', 'fan_restoration', 'fan_edit'].map((tp) => '<option value="' + tp + '">' + esc(t('type_' + tp)) + '</option>').join('');
  }
  function filmOptions() {
    return '<option value="">' + esc(t('sg_choose')) + '</option>' +
      A.films.slice().sort((a, b) => A.filmTitle(a).localeCompare(A.filmTitle(b))).map((f) => '<option value="' + esc(f.id) + '">' + esc(A.filmTitle(f) + ' (' + f.year + ')') + '</option>').join('');
  }

  /* envio de fotos e flyers (modelo do Entre Margens: link direto + crédito + moderação) */
  function photoRow(n) {
    return '<fieldset class="ph-row" data-row="' + n + '"><legend>' + esc(t('ph_img', { n })) + '</legend>' +
      '<div class="ph-row-grid"><div class="ph-prev" aria-hidden="true"><img alt="" referrerpolicy="no-referrer" data-keep="1" hidden></div>' +
      '<div class="ph-fields">' +
        '<label><span>' + esc(t('ph_url')) + ' *</span><input name="purl" type="url" maxlength="500" placeholder="https://i.imgur.com/….jpg" autocomplete="off" spellcheck="false"></label>' +
        '<p class="ph-status small" role="status" aria-live="polite"></p>' +
        '<div class="row2"><label><span>' + esc(t('ph_kind')) + '</span><select name="pkind">' + A.PHOTO_KINDS.map((k) => '<option value="' + k + '">' + esc(t('pk1_' + k)) + '</option>').join('') + '</select></label>' +
        '<label class="narrow"><span>' + esc(t('ph_date')) + '</span><input name="pdate" maxlength="10" placeholder="1985-06-14"></label></div>' +
        '<label><span>' + esc(t('ph_caption')) + '</span><input name="pcap" maxlength="300"></label>' +
        '<div class="row2 eq"><label><span>' + esc(t('ph_credit_l')) + '</span><input name="pcredit" maxlength="120"></label>' +
        '<label><span>' + esc(t('ph_source_l')) + '</span><input name="psource" type="url" maxlength="500" placeholder="https://"></label></div>' +
        (n > 1 ? '<button type="button" class="btn small ghost" data-action="photo-row-del">' + esc(t('ph_remove')) + '</button>' : '') +
      '</div></div></fieldset>';
  }
  function photoDialog() {
    return '<dialog id="dlg-photo" class="dlg" aria-labelledby="ph-h">' +
      '<form class="sg-form" data-form="photo" novalidate>' +
        '<div class="dlg-head"><h2 id="ph-h">' + esc(t('ph_title')) + '</h2>' +
          '<button type="button" class="icon-btn" data-action="close-dialog" aria-label="' + esc(t('close')) + '">&times;</button></div>' +
        '<div class="dlg-body">' +
          '<p class="policy">' + esc(t('ph_policy')) + '</p>' +
          '<div class="row2 eq"><label><span>' + esc(t('ph_artist')) + ' *</span><select name="partist">' +
            A.music.artists.map((a) => '<option value="' + esc(a.id) + '">' + esc(a.name) + '</option>').join('') +
            '<option value="__new">' + esc(t('ph_new_artist_opt')) + '</option></select></label>' +
          '<label class="ph-newart" hidden><span>' + esc(t('ph_new_artist')) + '</span><input name="pnewartist" maxlength="120"></label></div>' +
          '<div class="ph-rows">' + photoRow(1) + '</div>' +
          '<p><button type="button" class="btn small ghost" data-action="photo-row-add">' + esc(t('ph_add_row')) + '</button></p>' +
          '<div class="row2 eq"><label><span>' + esc(t('ph_yourname')) + '</span><input name="pname" maxlength="80" autocomplete="nickname"></label>' +
          '<label><span>' + esc(t('ph_contact')) + '</span><input name="pcontact" maxlength="80"></label></div>' +
          '<div class="hp" aria-hidden="true"><label>Website<input name="website" tabindex="-1" autocomplete="off"></label></div>' +
          (A.backend.mode() === 'demo' ? '<p class="muted small">' + esc(t('sg_demo')) + '</p>' : '') +
          '<p class="form-msg" role="status" aria-live="polite"></p>' +
        '</div>' +
        '<div class="dlg-foot"><button type="button" class="btn ghost" data-action="close-dialog">' + esc(t('cancel')) + '</button>' +
          '<button type="submit" class="btn primary">' + esc(t('sg_send')) + '</button></div>' +
      '</form></dialog>';
  }
  function openPhotoDialog(artistId) {
    const d = openDialog('dlg-photo');
    if (!d) return;
    const form = d.querySelector('form');
    form.reset();
    form.querySelector('.ph-rows').innerHTML = photoRow(1);
    form.querySelector('.form-msg').textContent = '';
    if (artistId && A.artist(artistId)) form.elements.partist.value = artistId;
    syncPhotoArtist(form);
    setTimeout(() => { const u = form.querySelector('input[name="purl"]'); if (u) u.focus(); }, 30);
  }
  function syncPhotoArtist(form) {
    const isNew = form.elements.partist.value === '__new';
    form.querySelector('.ph-newart').hidden = !isNew;
  }
  function previewPhoto(input) {
    const row = input.closest('.ph-row');
    if (!row) return;
    const img = row.querySelector('.ph-prev img');
    const st = row.querySelector('.ph-status');
    const url = A.safeUrl(input.value.trim());
    st.className = 'ph-status small';
    if (!input.value.trim()) { img.hidden = true; img.removeAttribute('src'); st.textContent = ''; return; }
    if (!url || A.isBlockedLink(url)) { img.hidden = true; st.textContent = t('ph_err_url'); st.classList.add('error'); return; }
    img.onload = () => { img.hidden = false; st.textContent = t('ph_ok'); st.className = 'ph-status small ok'; };
    img.onerror = () => { img.hidden = true; st.textContent = t('ph_bad'); st.className = 'ph-status small error'; };
    img.src = url;
  }
  async function submitPhoto(form) {
    const f = form.elements;
    const msg = form.querySelector('.form-msg');
    const setMsg = (text, cls) => { msg.textContent = text; msg.className = 'form-msg' + (cls ? ' ' + cls : ''); };
    const v = (el) => String((el && el.value) || '').trim();
    const artistSel = v(f.partist);
    const art = artistSel !== '__new' ? A.artist(artistSel) : null;
    const newName = v(f.pnewartist);
    if (!art && !newName) { setMsg(t('ph_err_artist'), 'error'); return; }
    const name = v(f.pname);
    const today = new Date().toISOString().slice(0, 10);
    const photos = [];
    for (const row of form.querySelectorAll('.ph-row')) {
      const q = (n) => v(row.querySelector('[name="' + n + '"]'));
      const raw = q('purl');
      if (!raw) continue;
      const url = A.safeUrl(raw);
      const src = q('psource');
      if (!url || A.isBlockedLink(url) || (src && (!A.safeUrl(src) || A.isBlockedLink(src)))) { setMsg(t('ph_err_url'), 'error'); return; }
      const cap = q('pcap');
      photos.push({
        url, kind: A.PHOTO_KINDS.indexOf(q('pkind')) >= 0 ? q('pkind') : 'photo', date: q('pdate'),
        caption: cap ? { pt: cap, en: cap } : undefined, credit: q('pcredit'), source: src ? A.safeUrl(src) : '',
        added_by: name, added: today
      });
    }
    if (!photos.length) { setMsg(t('ph_err_none'), 'error'); return; }
    if (v(f.website)) { setMsg(t('sg_sent'), 'ok'); return; }
    const dados = { photos };
    if (art) dados.artist_id = art.id; else dados.artist = { id: A.slug(newName), name: newName };
    const who = art ? art.name : newName;
    const payload = {
      tipo: 'music', film_id: '', titulo: who + ': ' + (photos.length === 1 ? t('ph_one') : t('ph_n', { n: photos.length })) + ' (' + t('atab_gallery') + ')',
      fonte_url: photos[0].source || '', contato: v(f.pcontact), dados
    };
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    try {
      const r = await A.backend.suggest(payload);
      setMsg(r && r.demo ? t('sg_sent') + ' ' + t('sg_demo') : t('sg_sent'), 'ok');
      setTimeout(() => closeDialog(form.closest('dialog')), 1800);
      if (A.state.route === 'admin') { A.adminState.data = null; A.rerender(); }
    } catch (e) {
      setMsg(t('sg_err_send'), 'error');
    } finally {
      btn.disabled = false;
    }
  }

  /* foto principal do artista (só para quem abriu a Moderação) */
  function openAvatar(artistId, url) {
    const a = A.artist(artistId);
    if (!a) return;
    closeDialog(document.getElementById('dlg-image'));
    const cur = url || a.image || '';
    const pos = a.image_pos || 'center';
    const pics = a.photos.filter((p) => p.kind === 'photo' || p.kind === 'press' || p.kind === 'other' || p.url === cur);
    $('#av-body').innerHTML =
      '<input type="hidden" name="avartist" value="' + esc(a.id) + '">' +
      '<div class="av-top"><div class="av-prev">' + V.artistAvatar(Object.assign({}, a, { image: '' }), true) + '<img class="acard-img" alt="" referrerpolicy="no-referrer" data-keep="1" hidden></div>' +
        '<p class="muted">' + esc(t('av_lead')) + '</p></div>' +
      '<fieldset class="av-pick"><legend>' + esc(t('av_from_gallery')) + '</legend>' +
        (pics.length ? '<div class="av-grid">' + pics.map((p) => '<button type="button" class="av-thumb' + (p.url === cur ? ' on' : '') + '" aria-pressed="' + (p.url === cur) + '" data-action="av-pick" data-url="' + esc(p.url) + '" aria-label="' + esc(L(p.caption) || t('pk1_' + p.kind)) + '"><img src="' + esc(p.url) + '" alt="" loading="lazy" referrerpolicy="no-referrer" data-keep="1"></button>').join('') + '</div>'
          : '<p class="small muted">' + esc(t('av_none_gallery')) + '</p>') + '</fieldset>' +
      '<label><span>' + esc(t('av_url')) + '</span><input name="avurl" type="url" maxlength="500" placeholder="https://" value="' + esc(cur) + '" autocomplete="off" spellcheck="false"></label>' +
      '<fieldset class="kind av-pos"><legend>' + esc(t('av_pos')) + '</legend>' +
        ['top', 'center', 'bottom'].map((k) => '<label><input type="radio" name="avpos" value="' + k + '"' + (k === pos ? ' checked' : '') + '> ' + esc(t('av_pos_' + k)) + '</label>').join('') + '</fieldset>' +
      '<label class="check"><input type="checkbox" name="avhero"' + (a.hero && a.hero === a.image ? ' checked' : '') + '> ' + esc(t('av_hero')) + '</label>' +
      '<p class="form-msg" role="status" aria-live="polite"></p>';
    $('#dlg-avatar .av-reset').hidden = !a.image;
    openDialog('dlg-avatar');
    avatarPreview();
  }
  function avatarPreview() {
    const form = $('#dlg-avatar form');
    if (!form) return;
    const img = form.querySelector('.av-prev > img');
    const url = A.safeUrl(String(form.elements.avurl.value || '').trim());
    const pos = (form.querySelector('input[name="avpos"]:checked') || {}).value || 'center';
    form.querySelectorAll('.av-thumb').forEach((b) => { const on = b.dataset.url === url; b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on)); });
    if (!url) { img.hidden = true; img.removeAttribute('src'); return; }
    img.style.objectPosition = A.IMAGE_POS[pos];
    img.onload = () => { img.hidden = false; };
    img.onerror = () => { img.hidden = true; const m = form.querySelector('.form-msg'); m.textContent = t('ph_bad'); m.className = 'form-msg error'; };
    if (img.getAttribute('src') !== url) img.src = url;
  }
  async function saveAvatar(form, reset) {
    const msg = form.querySelector('.form-msg');
    const setMsg = (x, c) => { msg.textContent = x; msg.className = 'form-msg' + (c ? ' ' + c : ''); };
    const a = A.artist(form.elements.avartist.value);
    if (!a) return;
    const url = A.safeUrl(String(form.elements.avurl.value || '').trim());
    if (!reset && (!url || A.isBlockedLink(url))) { setMsg(t('av_err_url'), 'error'); return; }
    const key = A.session.get('amr.admin.key', '');
    if (A.backend.mode() !== 'demo' && !key) { setMsg(t('av_err_key'), 'error'); return; }
    const pos = (form.querySelector('input[name="avpos"]:checked') || {}).value || 'center';
    const set = reset ? { image: '', image_pos: '' } : { image: url, image_pos: pos };
    if (reset) { if (a.hero && a.hero === a.image) set.hero = ''; }
    else if (form.elements.avhero.checked) set.hero = url;
    else if (a.hero && a.hero === a.image) set.hero = '';
    const btns = form.querySelectorAll('button');
    btns.forEach((b) => { b.disabled = true; });
    try {
      const r = await A.backend.adminAdd(key, { tipo: 'music', film_id: '', titulo: t('av_item', { x: a.name }), dados: { artist_id: a.id, set } });
      if (r && r.ok === false) throw new Error(r.error || 'erro');
      try { A.approved = await A.backend.approved(); } catch (e) { (A.approved = A.approved || []).push({ id: A.uid('l'), tipo: 'music', dados: { artist_id: a.id, set } }); }
      A.rebuild();
      A.rerender();
      closeDialog(form.closest('dialog'));
      A.toast(t(reset ? 'av_reset_done' : 'av_saved'));
    } catch (e) {
      setMsg(String(e && e.message).indexOf('nao_autorizado') >= 0 ? t('av_err_key') : t('av_err_save'), 'error');
    } finally {
      btns.forEach((b) => { b.disabled = false; });
    }
  }

  function dialogs() {
    return '<dialog id="dlg-suggest" class="dlg" aria-labelledby="sg-h">' +
      '<form class="sg-form" data-form="suggest" novalidate>' +
        '<div class="dlg-head"><h2 id="sg-h">' + esc(t('sg_title')) + '</h2>' +
          '<button type="button" class="icon-btn" data-action="close-dialog" aria-label="' + esc(t('close')) + '">&times;</button></div>' +
        '<div class="dlg-body">' +
          '<fieldset class="kind"><legend>' + esc(t('sg_kind')) + '</legend>' +
            '<label><input type="radio" name="kind" value="version" checked> ' + esc(t('sg_kind_version')) + '</label>' +
            '<label><input type="radio" name="kind" value="film"> ' + esc(t('sg_kind_film')) + '</label>' +
            '<label><input type="radio" name="kind" value="fix"> ' + esc(t('sg_kind_fix')) + '</label>' +
            '<label><input type="radio" name="kind" value="music"> ' + esc(t('sg_kind_music')) + '</label>' +
          '</fieldset>' +
          '<div class="kgroup" data-kinds="music">' +
            '<div class="row2"><label><span>' + esc(t('sg_artist')) + ' *</span><input name="martist" maxlength="120" list="dl-artists" autocomplete="off"></label>' +
            '<label><span>' + esc(t('sg_song')) + ' *</span><input name="msong" maxlength="160" list="dl-songs" autocomplete="off"></label></div>' +
            '<datalist id="dl-artists">' + A.music.artists.map((a) => '<option value="' + esc(a.name) + '">').join('') + '</datalist>' +
            '<datalist id="dl-songs">' + A.music.artists.map((a) => a.songs.map((x) => '<option value="' + esc(x.title) + '">').join('')).join('') + '</datalist>' +
            '<div class="row2"><label><span>' + esc(t('sg_mtype')) + '</span><select name="mtype">' + ['demo', 'live', 'session', 'alternate', 'remix', 'studio'].map((tp) => '<option value="' + tp + '">' + esc(t('mt_' + tp)) + '</option>').join('') + '</select></label>' +
            '<label class="narrow"><span>' + esc(t('sg_vyear')) + '</span><input name="myear" maxlength="10" placeholder="1984-03-01"></label></div>' +
            '<label><span>' + esc(t('sg_mplace')) + '</span><input name="mplace" maxlength="160"></label>' +
            '<label><span>' + esc(t('sg_desc')) + '</span><textarea name="mdesc" rows="3" maxlength="1500"></textarea></label>' +
          '</div>' +
          '<div class="kgroup" data-kinds="film">' +
            '<div class="row2"><label><span>' + esc(t('sg_film_title')) + ' *</span><input name="ftitle" maxlength="160"></label>' +
            '<label class="narrow"><span>' + esc(t('sg_year')) + '</span><input name="fyear" inputmode="numeric" maxlength="4"></label></div>' +
            '<input type="hidden" name="ftmdb">' +
          '</div>' +
          '<div class="kgroup" data-kinds="version fix">' +
            '<label><span>' + esc(t('sg_film')) + ' *</span><select name="film_id">' + filmOptions() + '</select></label>' +
          '</div>' +
          '<div class="kgroup" data-kinds="version">' +
            '<label><span>' + esc(t('sg_vname')) + ' *</span><input name="vname" maxlength="160"></label>' +
            '<div class="row2"><label><span>' + esc(t('sg_vtype')) + '</span><select name="vtype">' + vtypeOptions() + '</select></label>' +
            '<label class="narrow"><span>' + esc(t('sg_vyear')) + '</span><input name="vyear" maxlength="10" placeholder="2024"></label></div>' +
            '<label><span>' + esc(t('sg_vby')) + '</span><input name="vby" maxlength="120"></label>' +
            '<label><span>' + esc(t('sg_desc')) + '</span><textarea name="vdesc" rows="3" maxlength="1500"></textarea></label>' +
          '</div>' +
          '<div class="kgroup" data-kinds="fix">' +
            '<label><span>' + esc(t('sg_fix')) + ' *</span><textarea name="fix" rows="4" maxlength="2000"></textarea></label>' +
          '</div>' +
          '<label><span>' + esc(t('sg_link')) + '</span><input name="link" type="url" maxlength="500" placeholder="https://"></label>' +
          '<label><span>' + esc(t('sg_name')) + '</span><input name="contact" maxlength="80" autocomplete="nickname"></label>' +
          '<div class="hp" aria-hidden="true"><label>Website<input name="website" tabindex="-1" autocomplete="off"></label></div>' +
          '<p class="policy">' + esc(t('sg_policy')) + '</p>' +
          (A.backend.mode() === 'demo' ? '<p class="muted small">' + esc(t('sg_demo')) + '</p>' : '') +
          '<p class="form-msg" role="status" aria-live="polite"></p>' +
        '</div>' +
        '<div class="dlg-foot"><button type="button" class="btn ghost" data-action="close-dialog">' + esc(t('cancel')) + '</button>' +
          '<button type="submit" class="btn primary">' + esc(t('sg_send')) + '</button></div>' +
      '</form></dialog>' +
      '<dialog id="dlg-compare" class="dlg wide" aria-labelledby="cmp-h">' +
        '<div class="dlg-head"><h2 id="cmp-h">' + esc(t('cmp_title')) + '</h2>' +
          '<button type="button" class="icon-btn" data-action="close-dialog" aria-label="' + esc(t('close')) + '">&times;</button></div>' +
        '<div class="dlg-body" id="cmp-body"></div>' +
      '</dialog>' +
      '<dialog id="dlg-settings" class="dlg" aria-labelledby="st-h">' +
        '<form data-form="settings" novalidate autocomplete="off">' +
        '<div class="dlg-head"><h2 id="st-h">' + esc(t('st_title')) + '</h2>' +
          '<button type="button" class="icon-btn" data-action="close-dialog" aria-label="' + esc(t('close')) + '">&times;</button></div>' +
        '<div class="dlg-body">' +
          '<section class="st-sec"><h3>' + esc(t('st_tmdb_h')) + '</h3><p class="muted">' + esc(t('st_tmdb_lead')) + '</p>' +
            '<p class="st-status" id="st-status"></p>' +
            '<label class="st-label" for="st-key">' + esc(t('st_key')) + '</label>' +
            '<div class="key-row"><input id="st-key" name="tmdbkey" type="password" spellcheck="false" autocapitalize="off" autocomplete="off">' +
              '<button type="button" class="icon-btn eye" data-action="st-toggle" aria-pressed="false" aria-label="' + esc(t('st_show')) + '" title="' + esc(t('st_show')) + '">' + EYE + '</button></div>' +
            '<div class="st-btns"><button type="submit" class="btn primary">' + esc(t('st_save')) + '</button>' +
              '<button type="button" class="btn ghost" data-action="st-remove" id="st-remove">' + esc(t('st_remove')) + '</button></div>' +
            '<p class="form-msg" role="status" aria-live="polite"></p>' +
            '<p class="small muted">' + esc(t('st_help')) + ' <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noopener noreferrer">' + esc(t('st_get_key')) + '</a></p>' +
          '</section>' +
          '<section class="st-sec"><h3>' + esc(t('st_data_h')) + '</h3><p class="small muted">' + esc(t('st_data_lead')) + '</p>' +
            '<div class="st-btns"><button type="button" class="btn small ghost" data-action="st-clear-cache">' + esc(t('st_clear_cache')) + '</button>' +
            '<button type="button" class="btn small ghost" data-action="st-clear-covers">' + esc(t('st_clear_covers')) + '</button></div></section>' +
        '</div>' +
        '<div class="dlg-foot"><button type="button" class="btn ghost" data-action="close-dialog">' + esc(t('close')) + '</button></div>' +
      '</form></dialog>' +
      photoDialog() +
      '<dialog id="dlg-avatar" class="dlg" aria-labelledby="av-h"><form class="sg-form" data-form="avatar" novalidate>' +
        '<div class="dlg-head"><h2 id="av-h">' + esc(t('av_title')) + '</h2>' +
          '<button type="button" class="icon-btn" data-action="close-dialog" aria-label="' + esc(t('close')) + '">&times;</button></div>' +
        '<div class="dlg-body" id="av-body"></div>' +
        '<div class="dlg-foot"><button type="button" class="btn ghost av-reset" data-action="av-reset">' + esc(t('av_reset')) + '</button>' +
          '<button type="button" class="btn ghost" data-action="close-dialog">' + esc(t('cancel')) + '</button>' +
          '<button type="submit" class="btn primary">' + esc(t('av_save')) + '</button></div>' +
      '</form></dialog>' +
      '<dialog id="dlg-image" class="dlg lightbox" aria-labelledby="lb-h">' +
        '<div class="dlg-head"><h2 id="lb-h" class="sr-only">' + esc(t('gl_title')) + '</h2>' +
          '<button type="button" class="icon-btn" data-action="close-dialog" aria-label="' + esc(t('close')) + '">&times;</button></div>' +
        '<div class="lb-body" id="lb-body"></div>' +
      '</dialog>';
  }

  function renderShell() {
    document.body.innerHTML = header() +
      '<main id="main" tabindex="-1"></main>' +
      footer() + dialogs() +
      '<div class="cmp-tray" id="cmp-tray" hidden></div>' +
      '<div class="dock" id="dock" hidden><div class="dock-inner">' +
        '<div class="dock-meta"><span class="dock-now">' + esc(t('mu_now')) + '</span><b id="dock-title"></b><span id="dock-sub"></span></div>' +
        '<div class="dock-frame" id="dock-frame"></div>' +
        '<div class="dock-actions"><a id="dock-link" class="link-chip" href="https://archive.org/" target="_blank" rel="noopener noreferrer">Internet Archive</a>' +
        '<button type="button" class="icon-btn" data-action="dock-close" aria-label="' + esc(t('mu_dock_close')) + '">&times;</button></div>' +
      '</div></div>' +
      '<div class="toasts" id="toasts" aria-live="polite"></div>';
  }

  /* ---------------- rotas ---------------- */
  function currentRoute() {
    let h = '';
    try { h = decodeURIComponent((window.location.hash || '').replace(/^#/, '')); } catch (e) { h = ''; }
    const parts = h.split('/');
    if (parts[0] === 'musicas' && parts[1]) {
      if (!parts[2] || ARTIST_TABS.indexOf(parts[2]) >= 0) return { base: 'musicas/' + parts[1], tab: parts[2] || '', focus: parts[3] || '' };
      return { base: 'musicas/' + parts[1] + '/' + parts[2], tab: '', focus: '' };
    }
    const base = parts[0] === 'inicio' ? '' : parts[0];
    return { base, tab: parts[1] || '', focus: '' };
  }

  function routeArtist() {
    const p = A.state.route.split('/');
    return p[0] === 'musicas' && p[1] && !p[2] ? A.artist(p[1]) : null;
  }
  function setArtistTab(aid, tab) {
    A.state.artistTab[aid] = tab;
    const h = '#musicas/' + aid + (tab && tab !== 'musicas' ? '/' + tab : '');
    try { if (window.location.hash !== h) history.replaceState(null, '', h); } catch (e) { /* sem history (prévia) */ }
    A.rerender();
    const bar = document.getElementById('artist-tabs');
    if (bar) { const top = bar.getBoundingClientRect().top; if (top < 0) window.scrollTo(0, window.scrollY + top); }
    maybeLoadDisco();
  }
  function maybeLoadDisco() {
    const a = routeArtist();
    if (!a || V.artistTab(a) !== 'discografia' || A.mb.get(a)) return;
    A.mb.load(a).then(() => { const b = routeArtist(); if (b === a && V.artistTab(a) === 'discografia') A.rerender(); });
  }

  // Troca a aba do filme sem recarregar a página; o endereço fica compartilhável (#filme/aba)
  function setFilmTab(filmId, tab, keepScroll) {
    const f = A.film(filmId);
    if (!f) return;
    A.state.filmTab[filmId] = tab;
    const def = V.filmTabs(f)[0];
    const h = '#' + filmId + (tab && tab !== def ? '/' + tab : '');
    try { if (window.location.hash !== h) history.replaceState(null, '', h); } catch (e) { /* sem history (prévia) */ }
    A.rerender();
    if (!keepScroll) {
      const bar = document.getElementById('film-tabs');
      if (bar) { const top = bar.getBoundingClientRect().top; if (top < 0) window.scrollTo(0, window.scrollY + top); }
    }
    maybeLoadGallery();
  }

  function maybeLoadGallery() {
    const f = A.film(A.state.route);
    if (!f || !f.tmdb || V.filmTab(f) !== 'galeria' || A.tmdb.mode() === 'off') return;
    if (A.gallery.get(f.tmdb)) return;
    A.gallery.load(f.tmdb).then(() => { if (A.state.route === f.id && V.filmTab(f) === 'galeria') A.rerender(); });
  }

  function viewFor(r) {
    if (r === '') return V.home();
    if (r === 'musicas') return V.musicHome();
    if (r.indexOf('musicas/') === 0) {
      const p = r.split('/');
      const a = A.artist(p[1]);
      if (!a) return V.notFound();
      if (p[2]) { const so = A.song(a, p[2]); return so ? V.song(a, so) : V.notFound(); }
      return V.artist(a);
    }
    if (r === 'filmes') return V.films();
    if (r === 'novos') return V.news();
    if (r === 'sobre') return V.about();
    if (r === 'admin') return V.admin();
    const f = A.film(r);
    return f ? V.film(f) : V.notFound();
  }

  function titleFor(r) {
    const names = { '': '', filmes: t('nav_films'), novos: t('nw_title'), sobre: t('nav_about'), admin: t('nav_admin'), musicas: t('mu_title') };
    let page = names[r];
    if (page === undefined && r.indexOf('musicas/') === 0) {
      const p = r.split('/');
      const a = A.artist(p[1]);
      const so = a && p[2] ? A.song(a, p[2]) : null;
      page = so ? so.title + ' — ' + a.name : a ? a.name : t('nf_title');
    }
    if (page === undefined) { const f = A.film(r); page = f ? A.filmTitle(f) : t('nf_title'); }
    return page ? page + ' · ' + siteName() : siteName();
  }

  function updateNav() {
    document.querySelectorAll('.mainnav a').forEach((a) => {
      const target = (a.getAttribute('href') || '').replace(/^#/, '');
      if (target === A.state.route.split('/')[0]) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }

  function route() {
    const cr = currentRoute();
    const r = cr.base;
    const changedPage = r !== A.state.route;
    A.state.route = r;
    const film = A.film(r);
    if (film) {
      const tabs = V.filmTabs(film);
      if (cr.tab && tabs.indexOf(cr.tab) >= 0) A.state.filmTab[film.id] = cr.tab;
      else if (changedPage) A.state.filmTab[film.id] = tabs[0];
    }
    const art = routeArtist();
    if (art) {
      if (cr.tab) A.state.artistTab[art.id] = cr.tab;
      else if (changedPage) A.state.artistTab[art.id] = 'musicas';
      if (cr.focus) A.state.pendingFocus = { session: cr.focus };
    }
    if (changedPage && A.state.compareFilm && A.state.compareFilm !== r) { A.state.compare.clear(); A.state.compareFilm = null; }
    const main = $('#main');
    main.innerHTML = viewFor(r);
    document.title = titleFor(r);
    updateNav();
    hideSearch();
    updateTray();
    if (A.state.pendingFocus) {
      const pf = A.state.pendingFocus;
      A.state.pendingFocus = null;
      requestAnimationFrame(() => (pf.session ? focusSession(pf.session) : pf.version ? focusVersion(pf.version) : focusSection(pf.section)));
    } else if (changedPage) {
      window.scrollTo(0, 0);
    }
    maybeLoadGallery();
    maybeLoadDisco();
  }

  function focusSession(id) {
    const el = document.getElementById('s-' + id);
    if (!el) return;
    el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    flash(el);
  }

  // Redesenha a tela atual sem perder a posição de rolagem
  A.rerender = function () {
    const y = window.scrollY;
    const main = $('#main');
    if (!main) return;
    const active = document.activeElement;
    const activeId = active && active.id;
    main.innerHTML = viewFor(A.state.route);
    document.title = titleFor(A.state.route);
    updateTray();
    window.scrollTo(0, y);
    if (activeId) { const el = document.getElementById(activeId); if (el && el.focus) el.focus({ preventScroll: true }); }
  };

  function fullRender() {
    renderShell();
    route();
  }

  function flash(el) {
    el.classList.remove('flash');
    void el.offsetWidth;
    el.classList.add('flash');
    setTimeout(() => el.classList.remove('flash'), 1800);
  }

  function focusVersion(id) {
    let el = document.getElementById('v-' + id);
    if (!el) {
      const hit = A.findVersion(id);
      if (hit) {
        if (A.state.typeFilter[hit.film.id]) A.state.typeFilter[hit.film.id] = 'all';
        if (A.state.route === hit.film.id && V.filmTab(hit.film) !== 'versoes') { setFilmTab(hit.film.id, 'versoes', true); }
        else A.rerender();
        el = document.getElementById('v-' + id);
      }
    }
    if (!el) return;
    el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    flash(el);
    const h = el.querySelector('h3');
    if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
  }

  function focusSection(id) {
    let el = document.getElementById(id);
    if (!el) {
      const f = A.film(A.state.route);
      const tab = V.SECTION_TAB[id];
      if (f && tab && V.filmTabs(f).indexOf(tab) >= 0) { setFilmTab(f.id, tab, true); el = document.getElementById(id); }
    }
    if (!el) return;
    el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    const h = el.querySelector('h2');
    if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
  }

  /* ---------------- avisos ---------------- */
  A.toast = function (msg, kind) {
    const box = $('#toasts');
    if (!box || !msg) return;
    const el = document.createElement('div');
    el.className = 'toast' + (kind ? ' ' + kind : '');
    el.textContent = msg;
    box.appendChild(el);
    setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 400); }, kind === 'error' ? 5200 : 2800);
  };

  /* ---------------- busca ---------------- */
  let searchTimer = null;
  let photoTimer = null;
  function showSearch(html) {
    const p = $('#search-panel');
    if (!p) return;
    if (!html) { p.hidden = true; p.innerHTML = ''; return; }
    p.innerHTML = html;
    p.hidden = false;
  }
  function hideSearch() { const p = $('#search-panel'); if (p) { p.hidden = true; } }

  async function tmdbSearch(q) {
    const box = $('#sr-tmdb');
    if (!box) return;
    if (A.tmdb.mode() === 'off') { box.innerHTML = '<p class="sr-none">' + esc(t('s_tmdb_off')) + '</p>'; return; }
    box.innerHTML = '<p class="sr-none">' + esc(t('s_searching')) + '</p>';
    try {
      const r = await A.tmdb.search(q, A.lang === 'pt' ? 'pt-BR' : 'en-US');
      box.innerHTML = V.tmdbResults(r.results || []);
    } catch (e) {
      box.innerHTML = '<p class="sr-none">' + esc(t('s_tmdb_fail')) + '</p>';
    }
  }

  /* ---------------- sugestões ---------------- */
  function openDialog(id) {
    const d = document.getElementById(id);
    if (!d) return null;
    if (typeof d.showModal === 'function') { if (!d.open) d.showModal(); } else d.setAttribute('open', '');
    return d;
  }
  function closeDialog(d) {
    if (!d) return;
    if (typeof d.close === 'function') d.close(); else d.removeAttribute('open');
  }

  function syncKind(form) {
    const kind = (form.querySelector('input[name="kind"]:checked') || {}).value || 'version';
    form.querySelectorAll('.kgroup').forEach((g) => { g.hidden = (g.dataset.kinds || '').split(' ').indexOf(kind) < 0; });
  }

  function openSuggest(opts) {
    const d = openDialog('dlg-suggest');
    if (!d) return;
    const form = d.querySelector('form');
    form.reset();
    const msg = form.querySelector('.form-msg');
    msg.textContent = '';
    msg.className = 'form-msg';
    const kind = opts.kind || (opts.film ? 'version' : 'version');
    const radio = form.querySelector('input[name="kind"][value="' + kind + '"]');
    if (radio) radio.checked = true;
    if (opts.film) form.elements.film_id.value = opts.film;
    if (opts.title) form.elements.ftitle.value = opts.title;
    if (opts.year) form.elements.fyear.value = opts.year;
    form.elements.ftmdb.value = opts.tmdb || '';
    if (opts.artist) { const a = A.artist(opts.artist); if (a) form.elements.martist.value = a.name; }
    if (opts.song && opts.artist) { const so = A.song(A.artist(opts.artist), opts.song); if (so) form.elements.msong.value = so.title; }
    syncKind(form);
    const first = form.querySelector('.kgroup:not([hidden]) input, .kgroup:not([hidden]) select');
    if (first) setTimeout(() => first.focus(), 30);
  }

  async function submitSuggest(form) {
    const f = form.elements;
    const msg = form.querySelector('.form-msg');
    const kind = (form.querySelector('input[name="kind"]:checked') || {}).value || 'version';
    const val = (n) => String((f[n] && f[n].value) || '').trim();
    const setMsg = (text, cls) => { msg.textContent = text; msg.className = 'form-msg' + (cls ? ' ' + cls : ''); };
    const link = val('link');
    const allText = [link, val('vdesc'), val('fix'), val('vname'), val('ftitle'), val('mdesc'), val('mplace')].join(' ');
    if (A.isBlockedLink(allText)) { setMsg(t('sg_err_link'), 'error'); return; }
    if (link && !A.safeUrl(link)) { setMsg(t('sg_err_link'), 'error'); return; }

    let payload = null;
    if (kind === 'music') {
      if (!val('martist') || !val('msong')) { setMsg(t('sg_err_required'), 'error'); return; }
      const fold = (x) => A.fold(x).replace(/[’']/g, '');
      const art = A.music.artists.find((a) => fold(a.name) === fold(val('martist')));
      const so = art ? art.songs.find((x) => fold(x.title) === fold(val('msong'))) : null;
      const dados = {
        version: {
          id: A.slug((art ? art.id : val('martist')) + '-' + val('msong') + '-' + val('mtype') + '-' + val('myear')).slice(0, 70),
          type: val('mtype') || 'live', date: val('myear'), title: { pt: val('mplace'), en: val('mplace') },
          summary: { pt: val('mdesc'), en: val('mdesc') }, src_urls: link ? [link] : []
        }
      };
      if (art) dados.artist_id = art.id; else dados.artist = { id: A.slug(val('martist')), name: val('martist') };
      if (so) dados.song_id = so.id; else dados.song = { id: A.slug(val('msong')), title: val('msong'), status: 'unreleased' };
      payload = { tipo: 'music', film_id: '', titulo: val('martist') + ': ' + val('msong') + ' (' + t('mt_' + (val('mtype') || 'live')) + ')', dados };
    } else if (kind === 'film') {
      if (!val('ftitle')) { setMsg(t('sg_err_required'), 'error'); return; }
      const year = parseInt(val('fyear'), 10) || null;
      const tmdb = parseInt(val('ftmdb'), 10) || null;
      payload = {
        tipo: 'film', tmdb_id: tmdb, titulo: val('ftitle') + (year ? ' (' + year + ')' : ''),
        dados: { film: { title: { pt: val('ftitle'), en: val('ftitle') }, original_title: val('ftitle'), year, tmdb } }
      };
    } else {
      const filmId = val('film_id');
      const film = A.film(filmId);
      if (!film) { setMsg(t('sg_err_required'), 'error'); return; }
      if (kind === 'version') {
        if (!val('vname')) { setMsg(t('sg_err_required'), 'error'); return; }
        payload = {
          tipo: 'version', film_id: filmId, tmdb_id: film.tmdb || null, titulo: A.filmTitle(film) + ': ' + val('vname'),
          dados: {
            film_id: filmId,
            version: {
              id: A.slug(filmId + '-' + val('vname')).slice(0, 60),
              type: val('vtype') || 'official',
              name: { pt: val('vname'), en: val('vname') },
              by: val('vby'),
              released: val('vyear'),
              cut: 'theatrical',
              summary: { pt: val('vdesc'), en: val('vdesc') },
              reception: { level: 'sem_dados' },
              availability: val('vtype') === 'official' ? 'check' : 'unofficial',
              src_urls: link ? [link] : []
            }
          }
        };
      } else {
        if (!val('fix')) { setMsg(t('sg_err_required'), 'error'); return; }
        payload = { tipo: 'correction', film_id: filmId, tmdb_id: film.tmdb || null, titulo: A.filmTitle(film), dados: { film_id: filmId, texto: { pt: val('fix'), en: val('fix') } } };
      }
    }
    payload.fonte_url = link;
    payload.contato = val('contact');
    // Armadilha para robôs: o campo escondido só é preenchido por spam
    if (val('website')) { setMsg(t('sg_sent'), 'ok'); return; }
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    try {
      const r = await A.backend.suggest(payload);
      setMsg(r && r.demo ? t('sg_sent') + ' ' + t('sg_demo') : t('sg_sent'), 'ok');
      setTimeout(() => closeDialog(form.closest('dialog')), 1600);
      if (A.state.route === 'admin') { A.adminState.data = null; A.rerender(); }
    } catch (e) {
      setMsg(t('sg_err_send'), 'error');
    } finally {
      btn.disabled = false;
    }
  }

  /* ---------------- comparação ---------------- */
  function updateTray() {
    const tray = $('#cmp-tray');
    if (!tray) return;
    const n = A.state.compare.size;
    const onFilm = A.state.compareFilm && A.state.compareFilm === A.state.route;
    if (!n || !onFilm) { tray.hidden = true; tray.innerHTML = ''; return; }
    tray.innerHTML = '<span>' + esc(n === 1 ? t('cmp_one') : t('cmp_selected', { n })) + '</span>' +
      '<button type="button" class="btn small ghost" data-action="cmp-clear">' + esc(t('cmp_clear')) + '</button>' +
      '<button type="button" class="btn small primary" data-action="cmp-open"' + (n < 2 ? ' aria-disabled="true"' : '') + '>' + esc(t('cmp_open')) + '</button>';
    tray.hidden = false;
  }

  function openCompare() {
    if (A.state.compare.size < 2) { A.toast(t('cmp_min')); return; }
    const items = Array.from(A.state.compare).map((id) => A.findVersion(id)).filter(Boolean)
      .sort((a, b) => A.dateKey(a.v.released) - A.dateKey(b.v.released));
    const d = openDialog('dlg-compare');
    if (d) $('#cmp-body').innerHTML = V.compareTable(items);
  }

  /* ---------------- eventos ---------------- */
  function onClick(e) {
    const focusLink = e.target.closest('[data-focus-version],[data-focus-section]');
    if (focusLink && focusLink.tagName === 'A') {
      const target = (focusLink.getAttribute('href') || '').replace(/^#/, '');
      const pf = focusLink.dataset.focusVersion ? { version: focusLink.dataset.focusVersion } : { section: focusLink.dataset.focusSection };
      if (target === A.state.route) {
        e.preventDefault();
        hideSearch();
        pf.version ? focusVersion(pf.version) : focusSection(pf.section);
      } else {
        A.state.pendingFocus = pf;
      }
      return;
    }
    const el = e.target.closest('[data-action]');
    if (!el) {
      if (!e.target.closest('.search')) hideSearch();
      return;
    }
    const action = el.dataset.action;
    if (action === 'compare') return; // tratado no evento change
    if (action.indexOf('adm-') === 0) { e.preventDefault(); A.adminAction(action, el); return; }
    switch (action) {
      case 'lang':
        if (el.dataset.lang !== A.lang) {
          A.setLang(el.dataset.lang);
          const y = window.scrollY;
          fullRender();
          window.scrollTo(0, y);
          A.toast(t('toast_lang'));
        }
        break;
      case 'suggest':
        e.preventDefault();
        hideSearch();
        openSuggest({ kind: el.dataset.kind, film: el.dataset.film, title: el.dataset.title, year: el.dataset.year, tmdb: el.dataset.tmdb, artist: el.dataset.artist, song: el.dataset.song });
        break;
      case 'close-dialog':
        closeDialog(el.closest('dialog'));
        break;
      case 'need':
        A.state.guideNeed[el.dataset.film] = el.dataset.need;
        A.rerender();
        break;
      case 'focus-version':
        focusVersion(el.dataset.version);
        break;
      case 'goto':
        focusSection(el.dataset.target);
        break;
      case 'type-filter':
        A.state.typeFilter[el.dataset.film] = el.dataset.type;
        A.rerender();
        break;
      case 'news-filter':
        A.state.newsFilter = el.dataset.filter;
        A.rerender();
        break;
      case 'strip': {
        const track = document.getElementById(el.dataset.target);
        if (track) track.scrollBy({ left: Number(el.dataset.dir) * track.clientWidth * 0.85, behavior: reduceMotion ? 'auto' : 'smooth' });
        break;
      }
      case 'cmp-open':
        openCompare();
        break;
      case 'cmp-clear':
        A.state.compare.clear();
        A.state.compareFilm = null;
        document.querySelectorAll('input[data-action="compare"]').forEach((c) => { c.checked = false; });
        updateTray();
        break;
      case 'tmdb-search':
        tmdbSearch(el.dataset.q);
        break;
      case 'film-tab':
        setFilmTab(el.dataset.film, el.dataset.tab);
        { const b = document.getElementById('tab-' + el.dataset.tab); if (b) b.focus({ preventScroll: true }); }
        break;
      case 'score-sel':
        A.state.scoreSel[el.dataset.film] = el.dataset.sel;
        A.rerender();
        { const b = document.querySelector('.score-table [data-sel="' + el.dataset.sel + '"]'); if (b && el.closest('.score-table')) b.focus({ preventScroll: true }); }
        break;
      case 'rel-format':
        A.state.relFormat[el.dataset.film] = el.dataset.format;
        A.rerender();
        break;
      case 'settings':
        e.preventDefault();
        hideSearch();
        openSettings();
        break;
      case 'st-toggle': {
        const input = $('#st-key');
        const show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        el.setAttribute('aria-pressed', String(show));
        el.setAttribute('aria-label', t(show ? 'st_hide' : 'st_show'));
        el.title = t(show ? 'st_hide' : 'st_show');
        break;
      }
      case 'st-remove':
        A.tmdb.setUserKey('');
        $('#st-key').value = '';
        settingsMsg(t('st_removed'), 'ok');
        refreshSettingsStatus();
        A.gallery.reset();
        A.rerender();
        break;
      case 'st-clear-cache':
        A.clearTmdbCache();
        A.toast(t('st_cache_cleared'));
        A.rerender();
        reloadTmdb();
        break;
      case 'st-clear-covers':
        A.covers.clear();
        A.toast(t('st_covers_cleared'));
        A.rerender();
        break;
      case 'artist-tab':
        setArtistTab(el.dataset.artist, el.dataset.tab);
        { const b = document.getElementById('atab-' + el.dataset.tab); if (b) b.focus({ preventScroll: true }); }
        break;
      case 'song-filter':
        A.state.songFilter[el.dataset.artist] = el.dataset.filter;
        A.rerender();
        break;
      case 'disco-retry': {
        const a = A.artist(el.dataset.artist);
        if (a) { A.mb.reset(a); maybeLoadDisco(); A.rerender(); }
        break;
      }
      case 'play': {
        const src = A.ia.embed(el.dataset.ia, el.dataset.file || '');
        if (!src) break;
        const dock = $('#dock');
        $('#dock-frame').innerHTML = '<iframe src="' + esc(src) + '" title="' + esc(el.dataset.title || 'Internet Archive') + '" allow="autoplay; fullscreen" loading="lazy"></iframe>';
        dock.classList.toggle('playlist', !el.dataset.file);
        $('#dock-title').textContent = el.dataset.title || '';
        $('#dock-sub').textContent = el.dataset.sub || '';
        $('#dock-link').href = A.ia.details(el.dataset.ia);
        dock.hidden = false;
        document.body.classList.add('has-dock');
        document.body.classList.toggle('dock-tall', !el.dataset.file);
        break;
      }
      case 'dock-close':
        $('#dock-frame').innerHTML = '';
        $('#dock').hidden = true;
        document.body.classList.remove('has-dock', 'dock-tall');
        break;
      case 'gal-lang':
        A.state.galLang[el.dataset.film] = el.dataset.lang;
        delete A.state.galShow[el.dataset.film + ':posters'];
        A.rerender();
        break;
      case 'gal-more': {
        const k = el.dataset.film + ':' + el.dataset.kind;
        A.state.galShow[k] = (A.state.galShow[k] || 24) + 24;
        A.rerender();
        break;
      }
      case 'gal-retry': {
        const f = A.film(el.dataset.film);
        if (f) { A.gallery.reset(); maybeLoadGallery(); A.rerender(); }
        break;
      }
      case 'avatar-edit':
        openAvatar(el.dataset.artist, el.dataset.url || '');
        break;
      case 'av-pick': {
        const f = el.closest('form');
        f.elements.avurl.value = el.dataset.url;
        f.querySelector('.form-msg').textContent = '';
        avatarPreview();
        break;
      }
      case 'av-reset':
        saveAvatar(el.closest('form'), true);
        break;
      case 'photo-kind':
        A.state.photoKind[el.dataset.artist] = el.dataset.kind;
        A.rerender();
        break;
      case 'photo-open':
        A.state.lb = { artist: el.dataset.artist, i: Number(el.dataset.i) || 0 };
        openDialog('dlg-image');
        renderLightbox();
        break;
      case 'photo-send':
        openPhotoDialog(el.dataset.artist);
        break;
      case 'photo-row-add': {
        const box = el.closest('form').querySelector('.ph-rows');
        const n = box.querySelectorAll('.ph-row').length;
        if (n >= 10) break;
        box.insertAdjacentHTML('beforeend', photoRow(n + 1));
        const inp = box.lastElementChild.querySelector('input[name="purl"]');
        if (inp) inp.focus();
        break;
      }
      case 'photo-row-del': {
        const row = el.closest('.ph-row');
        const box = row && row.parentElement;
        if (!row) break;
        row.remove();
        box.querySelectorAll('.ph-row').forEach((r, i) => { r.dataset.row = i + 1; r.querySelector('legend').textContent = t('ph_img', { n: i + 1 }); });
        break;
      }
      case 'gal-open':
        A.state.lb = { film: el.dataset.film, kind: el.dataset.kind, i: Number(el.dataset.i) || 0 };
        openDialog('dlg-image');
        renderLightbox();
        break;
      case 'gal-step':
        stepLightbox(Number(el.dataset.dir) || 0);
        break;
      case 'gal-cover':
        A.covers.set(el.dataset.film, el.dataset.target, el.dataset.path);
        A.toast(t(el.dataset.target === 'poster' ? 'gl_cover_set' : 'gl_bg_set'));
        A.rerender();
        renderLightbox();
        break;
      case 'gal-reset':
        A.covers.clear(el.dataset.film);
        A.toast(t('gl_reset_done'));
        A.rerender();
        renderLightbox();
        break;
      case 'gal-pin':
        A.pins.set(el.dataset.film, el.dataset.target, el.dataset.path);
        A.toast(t(el.dataset.path ? 'gl_pin_done' : 'gl_unpin_done'));
        A.rerender();
        renderLightbox();
        break;
      default:
        break;
    }
  }

  /* ---------------- galeria ampliada ---------------- */
  function renderLightbox() {
    const lb = A.state.lb;
    const body = $('#lb-body');
    if (!lb || !body) return;
    if (lb.artist) { const a = A.artist(lb.artist); if (a) body.innerHTML = V.photoLightbox(a, lb.i); return; }
    const f = A.film(lb.film);
    if (f) body.innerHTML = V.lightbox(f, lb.kind, lb.i);
  }
  function stepLightbox(dir) {
    const lb = A.state.lb;
    if (!lb || !dir) return;
    let n = 0;
    if (lb.artist) { const a = A.artist(lb.artist); if (!a) return; n = V.photoList(a).length; }
    else { const f = A.film(lb.film); if (!f) return; n = V.galleryList(f, lb.kind).length; }
    const next = Math.max(0, Math.min(n - 1, lb.i + dir));
    if (next === lb.i) return;
    lb.i = next;
    renderLightbox();
  }

  /* ---------------- configurações (chave do TMDB) ---------------- */
  function settingsMsg(text, kind) {
    const m = document.querySelector('#dlg-settings .form-msg');
    if (!m) return;
    m.textContent = text || '';
    m.className = 'form-msg' + (kind ? ' ' + kind : '');
  }
  function refreshSettingsStatus() {
    const el = $('#st-status');
    if (!el) return;
    const mode = A.tmdb.userKey() ? 'user' : A.cfg('APPS_SCRIPT_URL') ? 'proxy' : A.cfg('TMDB_API_KEY') ? 'site' : 'off';
    el.textContent = t('st_status_' + mode);
    el.className = 'st-status s-' + mode;
    const rm = $('#st-remove');
    if (rm) rm.hidden = !A.tmdb.userKey();
  }
  function openSettings() {
    const d = openDialog('dlg-settings');
    if (!d) return;
    const input = $('#st-key');
    input.value = A.tmdb.userKey();
    input.type = 'password';
    const eye = d.querySelector('[data-action="st-toggle"]');
    if (eye) { eye.setAttribute('aria-pressed', 'false'); eye.setAttribute('aria-label', t('st_show')); eye.title = t('st_show'); }
    settingsMsg('');
    refreshSettingsStatus();
    setTimeout(() => input.focus(), 30);
  }
  async function reloadTmdb() {
    A.gallery.reset();
    let changed = false;
    for (const f of A.films) { if (await A.enrichFilm(f)) changed = true; }
    if (changed) A.rerender();
    maybeLoadGallery();
  }
  async function saveSettings(form) {
    const key = String(form.querySelector('[name="tmdbkey"]').value || '').trim();
    if (!key) { settingsMsg(t('st_empty'), 'error'); return; }
    if (!A.tmdb.looksLikeKey(key)) { settingsMsg(t('st_format'), 'error'); return; }
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    settingsMsg(t('st_testing'));
    const res = await A.tmdb.test(key);
    btn.disabled = false;
    if (res === 'bad') { settingsMsg(t('st_bad'), 'error'); return; }
    A.tmdb.setUserKey(key);
    settingsMsg(t(res === 'ok' ? 'st_ok' : 'st_neterr'), res === 'ok' ? 'ok' : 'warn');
    refreshSettingsStatus();
    A.rerender();
    if (res === 'ok') reloadTmdb();
  }

  function onChange(e) {
    const el = e.target;
    if (el.matches('input[data-action="compare"]')) {
      const id = el.dataset.version;
      const hit = A.findVersion(id);
      if (!hit) return;
      if (A.state.compareFilm && A.state.compareFilm !== hit.film.id) A.state.compare.clear();
      A.state.compareFilm = hit.film.id;
      if (el.checked) {
        if (A.state.compare.size >= 4) { el.checked = false; A.toast(t('cmp_max')); return; }
        A.state.compare.add(id);
      } else {
        A.state.compare.delete(id);
      }
      updateTray();
    } else if (el.matches('select[data-action="rel-country"]')) {
      A.state.relCountry[el.dataset.film] = el.value;
      A.rerender();
      const sel = document.querySelector('select[data-action="rel-country"]');
      if (sel) sel.focus({ preventScroll: true });
    } else if (el.name === 'partist' && el.closest('form[data-form="photo"]')) {
      syncPhotoArtist(el.closest('form'));
    } else if (el.name === 'avpos' || el.name === 'avurl') {
      avatarPreview();
    } else if (el.name === 'purl') {
      previewPhoto(el);
    } else if (el.name === 'kind' && el.closest('form[data-form="suggest"]')) {
      syncKind(el.closest('form'));
    }
  }

  function onSubmit(e) {
    const form = e.target.closest('form[data-form]');
    if (!form) return;
    e.preventDefault();
    const name = form.dataset.form;
    if (name === 'suggest') submitSuggest(form);
    else if (name === 'settings') saveSettings(form);
    else if (name === 'photo') submitPhoto(form);
    else if (name === 'avatar') saveAvatar(form, false);
    else if (A.adminSubmit) A.adminSubmit(name, form);
  }

  function onInput(e) {
    if (e.target.id === 'st-key') { settingsMsg(''); return; }
    if (e.target.name === 'avurl') { const f = e.target.closest('form'); f.querySelector('.form-msg').textContent = ''; clearTimeout(photoTimer); photoTimer = setTimeout(avatarPreview, 400); return; }
    if (e.target.name === 'purl') { clearTimeout(photoTimer); const el = e.target; photoTimer = setTimeout(() => previewPhoto(el), 450); return; }
    if (e.target.id !== 'q') return;
    const q = e.target.value;
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => showSearch(V.searchResults(q)), 120);
  }

  function onKeydown(e) {
    const lb = document.getElementById('dlg-image');
    if (lb && lb.open && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
      e.preventDefault();
      stepLightbox(e.key === 'ArrowLeft' ? -1 : 1);
      return;
    }
    if (e.target.classList && e.target.classList.contains('ftab') && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
      const tabs = Array.from(document.querySelectorAll('.ftab'));
      const i = tabs.indexOf(e.target) + (e.key === 'ArrowLeft' ? -1 : 1);
      const next = tabs[(i + tabs.length) % tabs.length];
      if (next) { e.preventDefault(); next.click(); }
      return;
    }
    if (e.target.id === 'q') {
      if (e.key === 'Escape') { e.target.value = ''; hideSearch(); }
      if (e.key === 'Enter') {
        const first = document.querySelector('#search-panel .sr-item');
        if (first) { e.preventDefault(); first.click(); }
      }
      if (e.key === 'ArrowDown') {
        const first = document.querySelector('#search-panel a, #search-panel button');
        if (first) { e.preventDefault(); first.focus(); }
      }
    } else if (e.key === 'Escape' && e.target.closest && e.target.closest('#search-panel')) {
      hideSearch();
      const q = $('#q');
      if (q) q.focus();
    }
  }

  function onFocusIn(e) {
    if (e.target.id === 'q' && e.target.value.trim()) showSearch(V.searchResults(e.target.value));
  }

  // Imagens que não carregam (sem rede, bloqueio ou TMDB fora) saem de cena e deixam a arte de reserva
  function onImgError(e) {
    const el = e.target;
    if (el && el.tagName === 'IMG') {
      if (el.dataset.keep) return;
      const ph = el.closest('.ph-btn');
      if (ph) { ph.classList.add('is-broken'); return; }
      const p = el.closest('.poster');
      if (p) p.classList.remove('has-img');
      el.remove();
    }
  }

  /* ---------------- dados remotos ---------------- */
  async function loadRemote() {
    try {
      A.approved = await A.backend.approved();
      A.rebuild();
      A.rerender();
    } catch (e) {
      console.warn('[RareVersion] Itens aprovados indisponíveis:', e);
    }
    if (A.tmdb.mode() !== 'off') {
      let changed = false;
      for (const f of A.films) {
        if (await A.enrichFilm(f)) changed = true;
      }
      if (changed) A.rerender();
    }
    maybeLoadGallery();
  }

  function init() {
    A.setLang(A.lang);
    A.rebuild();
    fullRender();
    window.addEventListener('hashchange', route);
    document.addEventListener('click', onClick);
    document.addEventListener('change', onChange);
    document.addEventListener('submit', onSubmit);
    document.addEventListener('input', onInput);
    document.addEventListener('keydown', onKeydown);
    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('error', onImgError, true);
    document.addEventListener('close', (e) => { if (e.target && e.target.id === 'dlg-image') A.state.lb = null; }, true);
    loadRemote();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
