/* Shared interactions. No build step or external API is required for school content. */
(() => {
  'use strict';
  const data = window.SCHOOL_DATA;
  if (!data) return;
  const base = document.body.dataset.base || '';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const icon = name => `<img class="icon" src="${base}assets/icons/${name}.svg" width="20" height="20" alt="" aria-hidden="true">`;
  const date = value => new Intl.DateTimeFormat('id-ID', {day:'numeric',month:'long',year:'numeric'}).format(new Date(`${value}T12:00:00`));
  const normalize = value => String(value).toLocaleLowerCase('id').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const debounce = (callback, delay = 180) => {
    let timer;
    return (...args) => { clearTimeout(timer); timer = setTimeout(() => callback(...args), delay); };
  };

  // Navigation: separate page links and submenu controls preserve both actions.
  const menuButton = $('#menu-toggle');
  const mobileNav = $('#mobile-nav');
  const setMobileMenu = open => {
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Tutup navigasi' : 'Buka navigasi');
    $('img', menuButton).src = `${base}assets/icons/${open ? 'x' : 'list'}.svg`;
    mobileNav.classList.toggle('is-open', open);
    mobileNav.inert = !open;
    document.body.classList.toggle('menu-open', open);
    for (const element of [$('#content'), $('.site-footer'), $('.utility')]) element.inert = open;
    if (open) $('a', mobileNav)?.focus();
  };
  menuButton.addEventListener('click', () => setMobileMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  $$('.mobile-sub-toggle').forEach(button => button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(open));
    document.getElementById(button.getAttribute('aria-controls')).hidden = !open;
  }));
  $$('a', mobileNav).forEach(anchor => anchor.addEventListener('click', () => setMobileMenu(false)));
  $$('.nav-toggle').forEach(button => button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') !== 'true';
    $$('.nav-toggle').forEach(other => {
      other.setAttribute('aria-expanded', 'false');
      other.closest('.nav-item').classList.remove('is-open');
    });
    button.setAttribute('aria-expanded', String(open));
    button.closest('.nav-item').classList.toggle('is-open', open);
  }));
  document.addEventListener('click', event => {
    if (!event.target.closest('.nav-item')) $$('.nav-toggle').forEach(button => {
      button.setAttribute('aria-expanded','false'); button.closest('.nav-item').classList.remove('is-open');
    });
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      setMobileMenu(false); menuButton.focus();
    }
    if (event.key === 'Tab' && menuButton.getAttribute('aria-expanded') === 'true') {
      const controls = [menuButton, ...$$('a, button', mobileNav).filter(element => element.getClientRects().length)];
      const first = controls[0], last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    if (event.key === 'Escape') $$('.nav-toggle').forEach(button => {
      if (button.getAttribute('aria-expanded') === 'true') { button.setAttribute('aria-expanded','false'); button.closest('.nav-item').classList.remove('is-open'); button.focus(); }
    });
  });
  window.matchMedia('(min-width: 1024px)').addEventListener('change', event => { if (event.matches) setMobileMenu(false); });

  // Native dialog provides keyboard focus containment and Escape dismissal.
  const dialog = $('#detail-dialog');
  let dialogTrigger;
  const openDialog = (title, html, type = '') => {
    dialogTrigger = document.activeElement;
    dialog.className = type ? `dialog-${type}` : '';
    $('#dialog-title').textContent = title;
    $('#dialog-body').innerHTML = html;
    dialog.showModal();
    document.body.classList.add('dialog-open');
    $('.dialog-close', dialog).focus();
  };
  $('.dialog-close', dialog).addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    $('#dialog-body').replaceChildren(); // Stop YouTube playback when dismissed.
    document.body.classList.remove('dialog-open');
    dialogTrigger?.focus();
  });
  document.addEventListener('click', event => {
    const photo = event.target.closest('[data-image]');
    if (photo) openDialog(photo.dataset.title || 'Foto Al Kahfi', `<img src="${base}${escape(photo.dataset.image)}" alt="${escape(photo.dataset.title || 'Foto Al Kahfi')}">`, 'photo');
    const activity = event.target.closest('[data-activity]');
    if (activity) openDialog(activity.dataset.activity, `<p>${escape(activity.dataset.description)}</p><p><strong>Pembimbing:</strong> ${escape(activity.dataset.mentor)}</p><a class="text-link" href="${base}kontak.html">Tanyakan kegiatan ${icon('arrow-right')}</a>`);
    const video = event.target.closest('[data-video]');
    if (video && /^[\w-]{11}$/.test(video.dataset.video)) openDialog(video.dataset.title,
      `<iframe class="video-embed" src="https://www.youtube-nocookie.com/embed/${video.dataset.video}?autoplay=1&rel=0" title="${escape(video.dataset.title)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe><p>${escape(video.dataset.description || 'Video dari kanal resmi SMAIT Al Kahfi.')}</p><a class="text-link" href="https://www.youtube.com/watch?v=${video.dataset.video}" target="_blank" rel="noopener noreferrer">Buka di YouTube ${icon('arrow-up-right')}</a>`, 'video');
    const profile = event.target.closest('[data-profile]');
    if (profile) {
      const alumni = data.alumni.find(item => item.id === Number(profile.dataset.profile));
      if (!alumni) return;
      const fields = [['Tahun kelulusan',alumni.year],['Perguruan tinggi',alumni.university],['Jurusan',alumni.program],['Kota',alumni.city],['Jalur masuk',alumni.route]];
      openDialog(alumni.name, `<p>Profil publik alumni SMAIT Al Kahfi.</p><dl class="profile-details">${fields.map(([label,value]) => `<div><dt>${label}</dt><dd>${escape(value || 'Belum tersedia')}</dd></div>`).join('')}</dl>`);
    }
  });

  // Tabs: mouse, touch, Home/End and arrow keys work consistently.
  $$('[role="tablist"]').forEach(tablist => {
    const tabs = $$('[role="tab"]', tablist);
    const activate = tab => {
      tabs.forEach(other => {
        const selected = other === tab;
        other.setAttribute('aria-selected', String(selected));
        other.tabIndex = selected ? 0 : -1;
        document.getElementById(other.getAttribute('aria-controls')).hidden = !selected;
      });
      window.ScrollTrigger?.refresh();
    };
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activate(tab));
      tab.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length];
        if (event.key === 'ArrowLeft') next = tabs[(index - 1 + tabs.length) % tabs.length];
        if (event.key === 'Home') next = tabs[0];
        if (event.key === 'End') next = tabs.at(-1);
        if (next) { event.preventDefault(); activate(next); next.focus(); }
      });
    });
  });
  $$('.life-accordion details').forEach(details => details.addEventListener('toggle', () => {
    if (details.open) $$('.life-accordion details').forEach(other => { if (other !== details) other.open = false; });
    window.ScrollTrigger?.refresh();
  }));

  function pagination(element, current, total, change) {
    element.innerHTML = '';
    if (total <= 1) return;
    const makeButton = (label, page, disabled, selected = false) => {
      const button = document.createElement('button');
      button.className = 'page-button';
      button.textContent = label;
      button.disabled = disabled;
      button.setAttribute('aria-label', typeof label === 'number' ? `Halaman ${label}` : label === '‹' ? 'Halaman sebelumnya' : 'Halaman berikutnya');
      if (selected) button.setAttribute('aria-current','page');
      button.addEventListener('click', () => change(page));
      element.append(button);
    };
    makeButton('‹', current - 1, current === 1);
    const pages = [...new Set([1, current-1, current, current+1, total])].filter(page => page >= 1 && page <= total).sort((a,b) => a-b);
    let previous = 0;
    for (const page of pages) {
      if (previous && page - previous > 1) { const dots = document.createElement('span'); dots.textContent = '…'; dots.setAttribute('aria-hidden','true'); element.append(dots); }
      makeButton(page, page, false, page === current);
      previous = page;
    }
    makeButton('›', current + 1, current === total);
  }
  const empty = (title, text) => `<div class="empty-state">${icon('magnifying-glass')}<h3>${escape(title)}</h3><p>${escape(text)}</p></div>`;
  const jumpTo = element => element.scrollIntoView({behavior:reducedMotion.matches?'instant':'smooth',block:'start'});

  // Searchable staff directory. Portraits intentionally remain blank.
  if ($('#teacher-search')) {
    let limit = 12;
    const search = $('#teacher-search'), subject = $('#teacher-subject');
    [...new Set(data.teachers.map(item => item.subject))].sort((a,b) => a.localeCompare(b,'id')).forEach(value => {
      if (value === '-') return;
      const option = document.createElement('option'); option.value = value; option.textContent = value; subject.append(option);
    });
    const render = () => {
      const query = normalize(search.value.trim());
      const results = data.teachers.filter(item => (!subject.value || item.subject === subject.value) && normalize(`${item.name} ${item.role} ${item.subject}`).includes(query));
      $('#teacher-count').textContent = `${results.length} tenaga pendidik${results.length > limit ? ` · ${limit} ditampilkan` : ''}`;
      $('#teacher-results').className = results.length ? 'staff-grid' : '';
      $('#teacher-results').innerHTML = results.length ? results.slice(0,limit).map(item => `<article class="staff-card"><div class="teacher-photo" role="img" aria-label="Area foto ${escape(item.name)}, dikosongkan"></div><h3>${escape(item.name)}</h3>${item.role?`<p class="role">${escape(item.role)}</p>`:''}<dl><dt>Mata pelajaran</dt><dd>${escape(item.subject === '-' ? 'Belum tersedia' : item.subject)}</dd><dt>Pendidikan</dt><dd>${escape(item.education && item.education !== '-' ? item.education : 'Belum tersedia')}</dd></dl></article>`).join('') : empty('Tenaga pendidik tidak ditemukan.','Coba nama atau mata pelajaran lain, atau reset filter.');
      $('#teacher-more').hidden = limit >= results.length;
    };
    search.addEventListener('input', debounce(() => {limit = 12; render();}));
    subject.addEventListener('change', () => {limit = 12; render();});
    $('#teacher-reset').addEventListener('click', () => {search.value = ''; subject.value = ''; limit = 12; render(); search.focus();});
    $('#teacher-more').addEventListener('click', () => {limit += 12; render();});
    render();
  }

  // Local news archive: all forty articles are readable without leaving the repository.
  if ($('#news-search')) {
    const search = $('#news-search');
    search.value = new URLSearchParams(location.search).get('q') || '';
    let category = '', page = 1;
    const render = () => {
      const query = normalize(search.value.trim());
      const results = data.posts.filter(post => (!category || post.category === category) && normalize(`${post.title} ${post.excerpt} ${post.paragraphs.map(p=>p.text).join(' ')}`).includes(query));
      const total = Math.ceil(results.length / 9);
      page = Math.max(1, Math.min(page, total || 1));
      $('#news-count').textContent = `${results.length} berita${results.length ? ` · halaman ${page} dari ${total}` : ''}`;
      $('#news-results').className = results.length ? 'news-grid' : '';
      $('#news-results').innerHTML = results.length ? results.slice((page-1)*9,page*9).map(post => `<article class="news-card"><a class="news-image" href="${base}berita/artikel-${post.id}.html" tabindex="-1" aria-hidden="true"><img src="${base}${post.image || data.photos.campus}" alt="${escape(post.title)}" loading="lazy" decoding="async"></a><div class="news-meta"><span class="category">${post.category}</span><span class="separator" aria-hidden="true"></span><time datetime="${post.date}">${date(post.date)}</time></div><h3><a href="${base}berita/artikel-${post.id}.html">${escape(post.title)}</a></h3><a class="text-link" href="${base}berita/artikel-${post.id}.html">Baca berita ${icon('arrow-right')}</a></article>`).join('') : empty('Belum ada berita yang cocok.','Coba kata kunci lain, pilih semua kategori, atau reset pencarian.');
      pagination($('#news-pagination'),page,total,next => {page=next; render(); jumpTo($('.search-toolbar'));});
    };
    search.addEventListener('input', debounce(() => {page=1; render();}));
    $$('[data-news-category]').forEach(button => button.addEventListener('click', () => {
      category = button.dataset.newsCategory; page = 1;
      $$('[data-news-category]').forEach(other => other.setAttribute('aria-pressed',String(other===button))); render();
    }));
    $('#news-reset').addEventListener('click', () => {search.value=''; category=''; page=1; $$('[data-news-category]').forEach(button=>button.setAttribute('aria-pressed',String(!button.dataset.newsCategory))); render(); search.focus();});
    render();
  }

  if ($('#video-results')) {
    let page = 1;
    const videos = data.videos.slice().reverse();
    const render = () => {
      $('#video-results').innerHTML = videos.slice((page-1)*6,page*6).map(video => `<button class="video-card" data-video="${escape(video.id)}" data-title="${escape(video.title)}" data-description="${escape(video.description)}"><span class="video-cover"><img src="${base}${video.image}" alt="${escape(video.title)}" loading="lazy" decoding="async"><span class="play-symbol" aria-hidden="true">${icon('play')}</span></span><h3>${escape(video.title)}</h3><p>Tonton dari kanal resmi ${icon('arrow-up-right')}</p></button>`).join('');
      pagination($('#video-pagination'),page,Math.ceil(videos.length/6),next=>{page=next; render(); jumpTo($('#video-results'));});
    };
    render();
  }

  // Published alumni snapshot: real data, with filters shared by chart links.
  if ($('#alumni-search')) {
    const search = $('#alumni-search'), year = $('#alumni-year'), university = $('#alumni-university');
    const params = new URLSearchParams(location.search);
    let page = 1;
    [...new Set(data.alumni.map(item=>item.university))].sort((a,b)=>a.localeCompare(b,'id')).forEach(value=>{
      const option=document.createElement('option'); option.value=value; option.textContent=value; university.append(option);
    });
    year.value=params.get('year') || ''; university.value=params.get('university') || '';
    let route=params.get('route') || '';
    const render=()=>{
      const query=normalize(search.value.trim());
      const results=data.alumni.filter(item=>(!year.value || String(item.year)===year.value) && (!university.value || item.university===university.value) && (!route || item.route===route) && normalize(item.name).includes(query));
      const total=Math.ceil(results.length/12); page=Math.max(1,Math.min(page,total || 1));
      $('#alumni-count').textContent=`${results.length} profil alumni${route?` · jalur ${route}`:''}${results.length?` · halaman ${page} dari ${total}`:''}`;
      $('#alumni-table').hidden=!results.length; $('#alumni-empty').hidden=!!results.length;
      $('#alumni-empty').innerHTML=results.length?'':empty('Alumni tidak ditemukan.','Coba nama, tahun, atau perguruan tinggi lain, atau reset semua filter.');
      $('#alumni-results').innerHTML=results.slice((page-1)*12,page*12).map(item=>`<tr><td data-label="Nama alumni"><button class="profile-button" data-profile="${item.id}">${escape(item.name)}</button></td><td data-label="Tahun lulus">${item.year}</td><td data-label="Perguruan tinggi">${escape(item.university)}<small>${escape(item.city)}</small></td><td data-label="Jurusan">${escape(item.program)}</td><td data-label="Profil"><button class="table-profile-link" data-profile="${item.id}">Lihat profil ${icon('arrow-up-right')}</button></td></tr>`).join('');
      pagination($('#alumni-pagination'),page,total,next=>{page=next;render();jumpTo($('.search-toolbar'));});
    };
    search.addEventListener('input',debounce(()=>{page=1;render();}));
    for(const control of [year,university])control.addEventListener('change',()=>{page=1;render();});
    $('#alumni-reset').addEventListener('click',()=>{search.value='';year.value='';university.value='';route='';page=1;render();search.focus();});
    render();
  }
  if ($('#alumni-chart')) {
    const year=$('#summary-year'), mode=$('#chart-mode');
    const countBy=(items,key)=>{
      const counts=new Map(); for(const item of items){const value=item[key] || 'Belum tersedia';counts.set(value,(counts.get(value)||0)+1);}
      return [...counts].sort((a,b)=>b[1]-a[1]);
    };
    const bars=(element,groups,key)=>{
      const max=Math.max(...groups.map(x=>x[1]),1);
      element.innerHTML=groups.map(([label,count])=>`<a class="chart-row" href="${base}daftar-alumni.html?${key}=${encodeURIComponent(label)}${year.value && key!=='year'?`&year=${year.value}`:''}" aria-label="Lihat ${count} alumni, ${escape(label)}"><span class="chart-label">${escape(label)}</span><span class="bar-track" aria-hidden="true"><span class="bar-fill" style="display:block;width:${Math.max(1,count/max*100)}%"></span></span><span class="chart-number">${count}</span></a>`).join('');
    };
    const render=()=>{
      const items=data.alumni.filter(item=>!year.value || String(item.year)===year.value);
      const stats=[[items.length,'Profil alumni'],[new Set(items.map(x=>x.university)).size,'Perguruan tinggi'],[new Set(items.map(x=>x.year)).size,'Tahun kelulusan dalam data']];
      $('#alumni-summary').innerHTML=stats.map(([count,label])=>`<div><strong>${count}</strong><span>${label}</span></div>`).join('');
      $('#alumni-chart-title').textContent=mode.value==='year'?'Jumlah alumni per tahun':'Perguruan tinggi dengan profil terbanyak';
      bars($('#alumni-chart'),countBy(items,mode.value).slice(0,mode.value==='university'?8:20),mode.value);
      bars($('#route-chart'),countBy(items,'route'),'route');
    };
    year.addEventListener('change',render);mode.addEventListener('change',render);render();
  }

  // Story preparation is an honest email handoff, never a fabricated server submission.
  if ($('#story-form')) {
    const form=$('#story-form'), text=$('#story-text'), photo=$('#story-photo');
    const draftKey='alkahfi-story-draft-v1';
    let photoUrl='';
    const counter=()=>{$('#story-counter').textContent=`${text.value.length.toLocaleString('id-ID')} / 6.000 karakter`;};
    text.addEventListener('input',counter);
    const setError=(name,message)=>{
      const input=form.elements.namedItem(name), error=$(`#error-${name}`);
      if(error)error.textContent=message;
      if(input instanceof HTMLElement){input.setAttribute('aria-invalid',String(!!message));if(error){const descriptions=(input.getAttribute('aria-describedby')||'').split(' ').filter(Boolean);if(!descriptions.includes(error.id))descriptions.push(error.id);input.setAttribute('aria-describedby',descriptions.join(' '));}}
    };
    photo.addEventListener('change',()=>{
      if(photoUrl)URL.revokeObjectURL(photoUrl);
      $('#photo-preview').replaceChildren();$('#photo-preview').hidden=true;setError('photo','');
      const file=photo.files[0];if(!file)return;
      if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>5*1024*1024){setError('photo','Pilih foto JPG, PNG, atau WebP dengan ukuran maksimal 5 MB.');photo.value='';return;}
      photoUrl=URL.createObjectURL(file);const preview=document.createElement('img');preview.src=photoUrl;preview.alt='Pratinjau foto yang dipilih';const label=document.createElement('span');label.textContent=file.name;$('#photo-preview').append(preview,label);$('#photo-preview').hidden=false;
    });
    const values=()=>Object.fromEntries([...new FormData(form)].filter(([key])=>key!=='photo'&&key!=='consent'));
    const saveDraft=()=>{
      try{localStorage.setItem(draftKey,JSON.stringify(values()));$('#draft-status').textContent='Draf tersimpan di perangkat ini. Foto dan persetujuan perlu dilengkapi kembali.';}
      catch{$('#draft-status').textContent='Draf tidak dapat disimpan di peramban ini. Salin ceritamu sebelum menutup halaman.';}
    };
    $('#save-draft').addEventListener('click',saveDraft);
    try{
      const draft=JSON.parse(localStorage.getItem(draftKey)||'null');
      if(draft){
        const restore=document.createElement('button');restore.type='button';restore.className='text-link';restore.textContent='Pulihkan draf tersimpan';
        restore.addEventListener('click',()=>{for(const [name,value]of Object.entries(draft)){const control=form.elements.namedItem(name);if(control instanceof RadioNodeList){control.value=value;}else if(control && control.type!=='file')control.value=value;}counter();$('#draft-status').textContent='Draf dipulihkan. Periksa kembali cerita dan persetujuan publikasi.';});
        $('#draft-status').append(restore);
      }
    }catch{/* A disabled storage area does not block the form. */}
    form.addEventListener('submit',event=>{
      event.preventDefault();
      const input=values();let firstInvalid;
      for(const name of ['firstName','lastName','email','relation','year','story','consent']){
        let message='';const control=form.elements.namedItem(name);
        if(['firstName','lastName'].includes(name)&&!String(input[name]||'').trim())message='Lengkapi nama ini.';
        if(name==='email'&&(!input.email||!control.validity.valid))message='Masukkan alamat email yang valid.';
        if(name==='relation'&&!input.relation)message='Pilih hubungan dengan Al Kahfi.';
        if(name==='year'&&input.year&&!control.validity.valid)message='Masukkan tahun lulus antara 2000 dan 2026.';
        if(name==='story'&&String(input.story||'').trim().length<50)message='Tulis cerita minimal 50 karakter.';
        if(name==='consent'&&!control.checked)message='Persetujuan publikasi diperlukan untuk melanjutkan.';
        setError(name,message);if(message&&!firstInvalid)firstInvalid=control;
      }
      if(firstInvalid){firstInvalid.focus();return;}
      const body=`Cerita Alumni SMAIT Al Kahfi\n\nPengirim: ${input.firstName.trim()} ${input.lastName.trim()}\nEmail: ${input.email}\nHubungan: ${input.relation}\nJenis cerita: ${input.ownership}\nTahun lulus: ${input.year||'-'}\nPerguruan tinggi: ${input.university||'-'}\nProfesi: ${input.profession||'-'}\n\n${input.story.trim()}\n\nPersetujuan: Saya menyetujui publikasi setelah ditinjau sekolah dan telah memperoleh izin jika cerita milik orang lain.\n${photo.files[0]?`\nFoto yang akan dilampirkan: ${photo.files[0].name}\n`:''}`;
      openDialog('Tinjau ceritamu.',`<p>Periksa informasi sebelum mengirim. Email belum dikirim dari halaman ini.</p><div class="story-review">${escape(body)}</div>${photo.files[0]?'<p>Lampirkan foto yang dipilih secara manual di aplikasi email.</p>':''}<div class="actions"><a class="btn" href="mailto:smaitalkahfi@gmail.com?subject=${encodeURIComponent('Cerita Alumni — '+input.firstName+' '+input.lastName)}&body=${encodeURIComponent(body)}">Buka email ${icon('envelope-simple')}</a><button class="btn btn-secondary" id="download-story">Unduh cerita ${icon('download-simple')}</button></div><p style="margin-top:20px"><a class="text-link" href="https://smaitalkahfi.sch.id/alumni/berbagi-cerita/" target="_blank" rel="noopener noreferrer">Formulir resmi sekolah ${icon('arrow-up-right')}</a></p>`);
      $('#download-story').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([body],{type:'text/plain;charset=utf-8'}));const anchor=document.createElement('a');anchor.href=url;anchor.download='cerita-alumni-al-kahfi.txt';document.body.append(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);});
    });counter();
  }

  const copyButton=$('[data-copy-link]');
  if(copyButton)copyButton.addEventListener('click',async()=>{
    try{await navigator.clipboard.writeText(location.href);$('#copy-status').textContent='Tautan disalin.';}
    catch{openDialog('Salin tautan berita.',`<div class="field"><label for="copy-url">Tautan halaman</label><input id="copy-url" value="${escape(location.href)}" readonly></div><p style="margin-top:15px">Pilih tautan, lalu salin ke pesan atau catatanmu.</p>`);$('#copy-url').select();}
  });

  // Content is visible by default. Motion is progressively enhanced and never hides it permanently.
  if (!reducedMotion.matches && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js-ready');
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.remove('is-pending');entry.target.classList.add('is-visible');observer.unobserve(entry.target);}
    }),{threshold:.08});
    $$('.reveal').forEach(element=>{if(element.getBoundingClientRect().top>window.innerHeight){element.classList.add('is-pending');observer.observe(element);}});
  }
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    const media=gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)',()=>{
      if($('.hero-photo'))gsap.from($('.hero-photo'),{opacity:0,y:16,duration:.85,ease:'power2.out'});
      if($('.hero-copy'))gsap.from($('.hero-copy'),{opacity:0,y:12,duration:.75,ease:'power2.out',delay:.08});
      const photo=$('.social-panel>img');
      if(photo)gsap.from(photo,{scale:.97,scrollTrigger:{trigger:photo,start:'top 90%',end:'top 50%',scrub:1}});
    });
    media.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)',()=>{
      const heading=$('.life-heading'), section=$('.life-story');
      if(heading && section)ScrollTrigger.create({trigger:heading,start:'top 115px',end:()=>`+=${Math.max(0,section.offsetHeight-heading.offsetHeight)}`,pin:true,pinSpacing:false,invalidateOnRefresh:true});
    });
    window.addEventListener('load',()=>ScrollTrigger.refresh(),{once:true});
  }
})();
