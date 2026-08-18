/* =============================================================
   DOTHEGAMEX — App JS
   - Header/Footer/Floaters dùng chung (inject 1 nơi, đồng bộ mọi trang)
   - Song ngữ VI/EN (data-en trên phần tử; lưu localStorage)
   - Mobile menu, scroll reveal, sticky header, form liên hệ
   ============================================================= */
(function () {
  'use strict';

  /* ------------------------- Thông tin công ty ------------------------ */
  var CO = {
    name: 'CÔNG TY CỔ PHẦN MAY ĐÔNG THÀNH',
    brand: 'MAY ĐÔNG THÀNH',
    tag: 'DOTHEGAMEX',
    phone: '0255.3829.714',
    phoneRaw: '02553829714',
    email: 'dongthanhqng@gmail.com',
    tax: '4300269721',
    since: '1984',
    addressVi: '32 Lê Văn Sỹ, Phường Nghĩa Lộ, TP. Quảng Ngãi, Tỉnh Quảng Ngãi, Việt Nam',
    addressEn: '32 Le Van Sy St., Nghia Lo Ward, Quang Ngai City, Quang Ngai Province, Vietnam',
    facebook: 'https://www.facebook.com/profile.php?id=61592872725461',
    tiktok: 'https://www.tiktok.com/@dongthanh.garment'
  };

  /* ------------------------- Menu điều hướng -------------------------- */
  var NAV = [
    { href: 'index.html',        vi: 'Trang chủ',   en: 'Home',          key: 'home' },
    { href: 'about.html',        vi: 'Giới thiệu',  en: 'About Us',      key: 'about' },
    { href: 'capabilities.html', vi: 'Năng lực',    en: 'Capabilities',  key: 'capabilities' },
    { href: 'profile.html',      vi: 'Hồ sơ năng lực', en: 'Company Profile', key: 'profile' },
    { href: 'careers.html',      vi: 'Tuyển dụng',  en: 'Careers',       key: 'careers' },
    { href: 'contact.html',      vi: 'Liên hệ',     en: 'Contact',       key: 'contact' }
  ];

  var UI = {
    quote:   { vi: 'Nhận báo giá', en: 'Get a Quote' },
    apply:   { vi: 'Ứng tuyển ngay', en: 'Apply Now' },
    hotline: { vi: 'Hotline', en: 'Hotline' }
  };

  // Logo thật của công ty (file gốc PNG, nền trong suốt). logo.png = bản navy (nền sáng), logo-white.png = bản trắng (nền tối).
  var LOGO_DARK = '<img class="brand__logo" src="assets/logo.png" alt="Logo May Đông Thành (DOTHEGAMEX)">';
  var LOGO_WHITE = '<img class="brand__logo" src="assets/logo-white.png" alt="Logo May Đông Thành (DOTHEGAMEX)">';

  /* ============================ i18n ================================= */
  var LANG_KEY = 'dt_lang';
  function getLang() { return localStorage.getItem(LANG_KEY) || 'vi'; }
  function setLang(lang) {
    localStorage.setItem(LANG_KEY, lang);
    applyLang(lang);
  }
  function applyLang(lang) {
    document.documentElement.lang = lang;
    // Nội dung văn bản
    document.querySelectorAll('[data-en]').forEach(function (el) {
      if (!el.hasAttribute('data-vi')) el.setAttribute('data-vi', el.innerHTML);
      el.innerHTML = lang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-vi');
    });
    // Placeholder
    document.querySelectorAll('[data-en-ph]').forEach(function (el) {
      if (!el.hasAttribute('data-vi-ph')) el.setAttribute('data-vi-ph', el.getAttribute('placeholder') || '');
      el.setAttribute('placeholder', lang === 'en' ? el.getAttribute('data-en-ph') : el.getAttribute('data-vi-ph'));
    });
    // aria-label
    document.querySelectorAll('[data-en-al]').forEach(function (el) {
      if (!el.hasAttribute('data-vi-al')) el.setAttribute('data-vi-al', el.getAttribute('aria-label') || '');
      el.setAttribute('aria-label', lang === 'en' ? el.getAttribute('data-en-al') : el.getAttribute('data-vi-al'));
    });
    // Nút chuyển ngôn ngữ
    document.querySelectorAll('.lang-toggle button').forEach(function (b) {
      b.classList.toggle('is-active', b.dataset.lang === lang);
      b.setAttribute('aria-pressed', b.dataset.lang === lang);
    });
    // Chống "chữ mồ côi": giữ 2 từ cuối mỗi đoạn/tiêu đề dính nhau (chạy lại sau mỗi lần đổi ngôn ngữ)
    preventWidows();
  }
  function t(obj) { return getLang() === 'en' ? obj.en : obj.vi; }

  /* --------- Chống chữ mồ côi (widow) — nối 2 từ cuối bằng non-breaking space --------- */
  function preventWidows() {
    var sel = 'p, h1, h2, h3, h4, li, figcaption, blockquote, .eyebrow, .media-tag, .lbl, .footer-about, .hero__lead, .trust-item, .breadcrumb, .cert, .profile-legal .row';
    document.querySelectorAll(sel).forEach(joinLastTwoWords);
  }
  // Noi 2 tu cuoi bang non-breaking space; di sau vao the con cuoi de khong bo sot cho nao
  function joinLastTwoWords(el) {
    var nodes = el.childNodes;
    for (var i = nodes.length - 1; i >= 0; i--) {
      var n = nodes[i];
      if (n.nodeType === 3) {
        var txt = n.nodeValue;
        if (/\S\s+\S/.test(txt)) { n.nodeValue = txt.replace(/\s+(\S+)\s*$/, '\u00A0$1'); return true; }
        if (/\S/.test(txt)) return true;
      } else if (n.nodeType === 1) {
        var tag = (n.tagName || '').toLowerCase();
        if (tag === 'br' || tag === 'svg' || tag === 'img') return true;
        if (joinLastTwoWords(n)) return true;
        if (/\S/.test(n.textContent || '')) return true;
      }
    }
    return false;
  }

  /* ========================= Build Header ============================ */
  function buildHeader() {
    var host = document.getElementById('site-header');
    if (!host) return;
    var active = document.body.getAttribute('data-page');

    var links = NAV.map(function (n) {
      var is = n.key === active ? ' is-active' : '';
      var aria = n.key === active ? ' aria-current="page"' : '';
      return '<li><a class="nav__link' + is + '" href="' + n.href + '"' + aria +
        ' data-en="' + n.en + '">' + n.vi + '</a></li>';
    }).join('');

    host.className = 'site-header';
    host.innerHTML =
      '<div class="container">' +
        '<nav class="nav" aria-label="Chính">' +
          '<a class="brand" href="index.html" aria-label="' + CO.brand + ' — ' + CO.tag + '">' +
            LOGO_DARK +
            '<span><span class="brand__name">' + CO.brand + '</span>' +
            '<span class="brand__tag">' + CO.tag + '</span></span>' +
          '</a>' +
          '<ul class="nav__links" id="nav-links">' + links +
            '<li class="nav__cta-mobile"><a class="btn btn--block" href="contact.html" data-en="' + UI.quote.en + '">' + UI.quote.vi + '</a></li>' +
          '</ul>' +
          '<div class="nav__actions">' +
            '<div class="lang-toggle" role="group" aria-label="Language / Ngôn ngữ">' +
              '<button type="button" data-lang="vi">VI</button>' +
              '<button type="button" data-lang="en">EN</button>' +
            '</div>' +
            '<a class="btn nav__cta-desktop" href="contact.html" data-en="' + UI.quote.en + '">' + UI.quote.vi + '</a>' +
            '<button class="nav__toggle" id="nav-toggle" aria-label="Mở menu" aria-expanded="false" aria-controls="nav-links"><span></span></button>' +
          '</div>' +
        '</nav>' +
      '</div>';
  }

  /* ========================= Build Footer ============================ */
  function icon(path) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + path + '</svg>';
  }
  var I = {
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7A2 2 0 0 1 22 16.9Z"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    doc: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
    facebook: '<path d="M15 3h-2a4.5 4.5 0 0 0-4.5 4.5V10H6v3.5h2.5V21H12v-7.5h2.6l.4-3.5H12V7.7c0-.9.4-1.4 1.4-1.4H15V3Z" fill="currentColor" stroke="none"/>',
    tiktok: '<path d="M15.5 2.5c.4 2.4 1.9 4.1 4.5 4.4v3.3a7.6 7.6 0 0 1-4.5-1.4v6.9a5.9 5.9 0 1 1-5.9-5.9c.3 0 .6 0 .9.1v3.3a2.6 2.6 0 1 0 1.8 2.5V2.5h3.2Z" fill="currentColor" stroke="none"/>'
  };

  function buildFooter() {
    var host = document.getElementById('site-footer');
    if (!host) return;
    var year = new Date().getFullYear();

    var quick = NAV.map(function (n) {
      return '<li><a href="' + n.href + '" data-en="' + n.en + '">' + n.vi + '</a></li>';
    }).join('');

    host.className = 'site-footer';
    host.innerHTML =
      '<div class="container">' +
        '<div class="footer-grid">' +
          '<div class="footer-brand">' +
            '<a class="brand" href="index.html">' + LOGO_WHITE +
              '<span><span class="brand__name">' + CO.brand + '</span><span class="brand__tag">' + CO.tag + '</span></span>' +
            '</a>' +
            '<p class="footer-slogan" data-en="Where the craft of needle and thread is preserved and honored.">Nơi nghề kim chỉ được giữ gìn và trân trọng.</p>' +
            '<p class="footer-about" data-en="Garment manufacturer established in 1999 with over 25 years of operation in Quang Ngai — strategic partner of NOA GROUP, reliable for domestic and export markets.">' +
              'Doanh nghiệp may mặc thành lập năm 1999, hơn 25 năm hoạt động tại Quảng Ngãi — đối tác chiến lược của NOA GROUP, tin cậy cho thị trường trong nước và xuất khẩu.' +
            '</p>' +
            '<div class="footer-social">' +
              '<a href="' + CO.facebook + '" target="_blank" rel="noopener" aria-label="Facebook">' + icon(I.facebook) + '</a>' +
              '<a href="' + CO.tiktok + '" target="_blank" rel="noopener" aria-label="TikTok">' + icon(I.tiktok) + '</a>' +
            '</div>' +
          '</div>' +
          '<div class="footer">' +
            '<h4 data-en="Navigation">Điều hướng</h4>' +
            '<ul class="footer-links">' + quick + '</ul>' +
          '</div>' +
          '<div class="footer">' +
            '<h4 data-en="Company">Công ty</h4>' +
            '<ul class="footer-links">' +
              '<li><span style="color:#94a3b8" data-en="Tax code">Mã số thuế</span>: ' + CO.tax + '</li>' +
              '<li><span style="color:#94a3b8" data-en="Main line">Ngành chính</span>: ' + '<span data-en="Made-up textiles (excl. apparel)">Sản xuất hàng dệt sẵn (trừ trang phục)</span></li>' +
              '<li><span style="color:#94a3b8" data-en="Heritage">Bề dày</span>: ' + '<span data-en="25+ years (since 1999)">Hơn 25 năm (từ 1999)</span></li>' +
              '<li><span style="color:#94a3b8" data-en="Strategic partner">Đối tác chiến lược</span>: NOA GROUP</li>' +
              '<li><a href="capabilities.html" data-en="OEM / ODM Services">Dịch vụ OEM / ODM</a></li>' +
              '<li><a href="careers.html" data-en="Recruitment">Tuyển dụng</a></li>' +
            '</ul>' +
          '</div>' +
          '<div class="footer">' +
            '<h4 data-en="Contact">Liên hệ</h4>' +
            '<ul class="footer-contact">' +
              '<li>' + icon(I.pin) + '<span data-en="' + CO.addressEn + '">' + CO.addressVi + '</span></li>' +
              '<li>' + icon(I.phone) + '<a href="tel:' + CO.phoneRaw + '">' + CO.phone + '</a></li>' +
              '<li>' + icon(I.mail) + '<a href="mailto:' + CO.email + '">' + CO.email + '</a></li>' +
              '<li>' + icon(I.clock) + '<span data-en="Mon–Sat: 7:30 – 16:30">Thứ 2–7: 7:30 – 16:30</span></li>' +
            '</ul>' +
          '</div>' +
        '</div>' +
        '<div class="footer-bottom">' +
          '<span>© ' + year + ' ' + CO.name + '. <span data-en="All rights reserved.">Bảo lưu mọi quyền.</span></span>' +
          '<span data-en="Design system: Trust &amp; Authority">Thiết kế theo chuẩn Trust &amp; Authority</span>' +
        '</div>' +
      '</div>';
  }

  /* ======================== Floating buttons ========================= */
  function buildFloaters() {
    var host = document.getElementById('floaters');
    if (!host) return;
    host.className = 'floaters';
    host.innerHTML =
      '<a class="floater floater--phone" href="tel:' + CO.phoneRaw + '" data-tip="' + CO.phone + '" aria-label="Gọi hotline">' + icon(I.phone) + '</a>' +
      '<a class="floater floater--mail" href="mailto:' + CO.email + '" data-tip="' + CO.email + '" aria-label="Gửi email">' + icon(I.mail) + '</a>' +
      '<button class="floater floater--top" id="to-top" data-tip="Lên đầu trang" aria-label="Lên đầu trang">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>' +
      '</button>';
  }

  /* =========================== Interactions ========================== */
  function initInteractions() {
    var header = document.getElementById('site-header');
    var toggle = document.getElementById('nav-toggle');
    var links = document.getElementById('nav-links');
    var toTop = document.getElementById('to-top');

    // Sticky shadow + back-to-top + tự ẩn/hiện header khi cuộn
    var lastY = window.scrollY;
    function onScroll() {
      var y = window.scrollY;
      if (header) header.classList.toggle('is-scrolled', y > 8);
      if (toTop) toTop.classList.toggle('is-show', y > 500);
      // Ẩn khi cuộn xuống (nhường nội dung), hiện lại ngay khi cuộn lên
      var menuOpen = links && links.classList.contains('is-open');
      if (header && !menuOpen) {
        if (y > 240 && y > lastY + 6) header.classList.add('is-hidden');
        else if (y < lastY - 6 || y < 160) header.classList.remove('is-hidden');
      }
      lastY = y;
    }
    // Gom xu ly theo khung hinh (requestAnimationFrame) thay vi chay tren tung
    // su kien scroll (co the ban hang chuc lan/giay) -> muot hon, do giat lag.
    var scrollTicking = false;
    window.addEventListener('scroll', function () {
      if (scrollTicking) return;
      scrollTicking = true;
      requestAnimationFrame(function () { onScroll(); scrollTicking = false; });
    }, { passive: true });
    onScroll();

    // Mobile menu
    if (toggle && links) {
      toggle.addEventListener('click', function () {
        var open = links.classList.toggle('is-open');
        toggle.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', open);
        document.body.style.overflow = open ? 'hidden' : '';
      });
      links.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          links.classList.remove('is-open');
          toggle.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });
    }

    // Back to top
    if (toTop) toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Language toggle
    document.querySelectorAll('.lang-toggle button').forEach(function (b) {
      b.addEventListener('click', function () { setLang(b.dataset.lang); });
    });
  }

  /* =========================== Scroll reveal ========================= */
  function initReveal() {
    var els = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window) || !els.length) {
      els.forEach(function (e) { e.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ============================ Count-up ============================= */
  function initCounters() {
    var nums = document.querySelectorAll('[data-count]');
    if (!nums.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, target = parseFloat(el.getAttribute('data-count')), t0 = null, dur = 1400;
        function step(ts) {
          if (!t0) t0 = ts;
          var p = Math.min((ts - t0) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased).toLocaleString('vi-VN');
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        io.unobserve(el);
      });
    }, { threshold: 0.6 });
    nums.forEach(function (n) { io.observe(n); });
  }

  /* ============================= Preloader =========================== */
  function initPreloader() {
    var pl = document.getElementById('preloader');
    if (!pl) return;
    var done = false;
    function hide() {
      if (done) return; done = true;
      pl.classList.add('is-hidden');
      setTimeout(function () { if (pl.parentNode) pl.parentNode.removeChild(pl); }, 600);
    }
    if (document.readyState === 'complete') {
      setTimeout(hide, 250);
    } else {
      window.addEventListener('load', function () { setTimeout(hide, 250); });
      setTimeout(hide, 1600); // giới hạn: luôn ẩn sau tối đa 1.6s
    }
  }

  /* ============================== Lightbox =========================== */
  function initLightbox() {
    var thumbs = document.querySelectorAll('.cert-thumb, .media-frame img');
    if (!thumbs.length) return;

    // Gom theo thư viện chứa nó (để bấm mũi tên chuyển ảnh trong cùng bộ)
    var groupSel = '.cert-gallery, .gallery-mosaic, .prod-grid';
    function groupOf(t) {
      var g = t.closest(groupSel);
      return g || t; // ảnh đơn lẻ (media-frame) tự làm nhóm riêng 1 ảnh
    }
    var groups = [];
    var groupIndex = new Map();
    thumbs.forEach(function (t) {
      var g = groupOf(t);
      if (!groupIndex.has(g)) { groupIndex.set(g, groups.length); groups.push([]); }
      groups[groupIndex.get(g)].push(t);
    });

    var box = document.createElement('div');
    box.className = 'lightbox';
    box.innerHTML =
      '<button class="lightbox__close" aria-label="Đóng">&times;</button>' +
      '<button class="lightbox__nav lightbox__prev" aria-label="Ảnh trước">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>' +
      '</button>' +
      '<img alt="">' +
      '<button class="lightbox__nav lightbox__next" aria-label="Ảnh sau">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>' +
      '</button>' +
      '<div class="lightbox__cap"></div>';
    document.body.appendChild(box);
    var bimg = box.querySelector('img');
    var bcap = box.querySelector('.lightbox__cap');
    var bprev = box.querySelector('.lightbox__prev');
    var bnext = box.querySelector('.lightbox__next');

    var curGroup = null, curIdx = 0;

    function captionOf(t) {
      var img = t.tagName === 'IMG' ? t : t.querySelector('img');
      if (!img) return { img: null, cap: '' };
      var cap = t.getAttribute('data-cap');
      if (!cap) {
        var fc = t.querySelector && t.querySelector('figcaption');
        cap = fc ? fc.textContent : (img.getAttribute('alt') || '');
      }
      return { img: img, cap: cap };
    }

    function show(idx) {
      curIdx = (idx + curGroup.length) % curGroup.length;
      var info = captionOf(curGroup[curIdx]);
      if (!info.img) return;
      bimg.src = info.img.getAttribute('src'); bimg.alt = info.cap || '';
      bcap.textContent = info.cap || '';
      var multi = curGroup.length > 1;
      bprev.style.display = bnext.style.display = multi ? '' : 'none';
    }

    function open(t) {
      var g = groupOf(t);
      curGroup = groups[groupIndex.get(g)] || [t];
      curIdx = curGroup.indexOf(t);
      if (curIdx < 0) curIdx = 0;
      show(curIdx);
      box.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
    var clearTimer;
    function close() {
      box.classList.remove('is-open');
      document.body.style.overflow = '';
      clearTimeout(clearTimer);
      clearTimer = setTimeout(function () {
        if (!box.classList.contains('is-open')) bimg.src = '';
      }, 450);
    }

    thumbs.forEach(function (t) {
      t.style.cursor = 'zoom-in';
      t.addEventListener('click', function () { open(t); });
    });
    bprev.addEventListener('click', function (e) { e.stopPropagation(); show(curIdx - 1); });
    bnext.addEventListener('click', function (e) { e.stopPropagation(); show(curIdx + 1); });
    box.addEventListener('click', function (e) {
      if (e.target === box || e.target.classList.contains('lightbox__close')) close();
    });
    document.addEventListener('keydown', function (e) {
      if (!box.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(curIdx - 1);
      else if (e.key === 'ArrowRight') show(curIdx + 1);
    });
  }

  /* ============================ Contact form ========================= */
  function encodeFormData(data) {
    return Object.keys(data).map(function (k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
    }).join('&');
  }

  function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;
    var status = document.getElementById('form-status');
    var submit = form.querySelector('button[type="submit"]');
    var submitText = submit ? submit.innerHTML : '';
    var isNetlifyForm = form.hasAttribute('data-netlify');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var lang = getLang();
      status.className = 'form__status';
      var data = Object.fromEntries(new FormData(form).entries());

      if (submit) { submit.disabled = true; submit.innerHTML = lang === 'en' ? 'Sending…' : 'Đang gửi…'; }

      var req = isNetlifyForm
        // Website tĩnh (Netlify): gửi qua Netlify Forms (không cần backend)
        ? fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: encodeFormData(data)
          }).then(function (r) { if (!r.ok) throw new Error('netlify-form-error'); return { ok: true }; })
        // Chạy kèm server.js (Node/Express): gửi qua API nội bộ
        : fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          }).then(function (r) { return r.json().then(function (j) { return { ok: r.ok && j.ok, body: j }; }); });

      req
        .then(function (res) {
          if (res.ok) {
            status.classList.add('is-ok');
            status.textContent = lang === 'en'
              ? 'Thank you! Your message has been received — we will respond soon.'
              : 'Cảm ơn bạn! Chúng tôi đã nhận thông tin và sẽ phản hồi sớm nhất.';
            form.reset();
          } else {
            throw new Error((res.body && res.body.error) || 'error');
          }
        })
        .catch(function () {
          // Fallback: chưa chạy Node/API -> mở email soạn sẵn
          status.classList.add('is-err');
          var subject = encodeURIComponent('[Website] ' + (data.subject || 'Liên hệ') + ' - ' + (data.name || ''));
          var bodyTxt = encodeURIComponent(
            'Họ tên: ' + (data.name || '') + '\nEmail: ' + (data.email || '') +
            '\nĐiện thoại: ' + (data.phone || '') + '\nCông ty: ' + (data.company || '') +
            '\n\nNội dung:\n' + (data.message || '')
          );
          status.innerHTML = (lang === 'en'
            ? 'Online sending is unavailable right now. '
            : 'Gửi trực tuyến hiện chưa sẵn sàng. ') +
            '<a href="mailto:' + CO.email + '?subject=' + subject + '&body=' + bodyTxt + '" style="text-decoration:underline;font-weight:600">' +
            (lang === 'en' ? 'Click here to email us' : 'Bấm để gửi email') + '</a>' +
            (lang === 'en' ? ' or call ' : ' hoặc gọi ') +
            '<a href="tel:' + CO.phoneRaw + '" style="text-decoration:underline;font-weight:600">' + CO.phone + '</a>.';
        })
        .finally(function () {
          if (submit) { submit.disabled = false; submit.innerHTML = submitText; }
          status.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    });
  }

  /* ============================== Init =============================== */
  function init() {
    initPreloader();
    buildHeader();
    buildFooter();
    buildFloaters();
    applyLang(getLang());
    initInteractions();
    initReveal();
    initCounters();
    initLightbox();
    initContactForm();
    initMediaRotator();
    initAwardsModal();
  }

  /* ==================== Khoi "Bang khen & Giay khen" ================== */
  function initAwardsModal() {
    var trigger = document.querySelector('.awards-trigger');
    var modal = document.getElementById('awards-modal');
    if (!trigger || !modal) return;
    var closeBtn = modal.querySelector('.awards-modal__close');

    function open() {
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
      trigger.focus();
    }
    trigger.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
    });
  }

  /* ===================== Slideshow anh tu dong chay ==================== */
  // Anh khong hien thi dau tien (2,3,4...) duoc de src="" -> data-src="" trong HTML
  // de trinh duyet KHONG tai truoc, tranh canh tranh bang thong voi noi dung dang xem.
  // Sau khi trang da tai xong (window load), moi tai ngam cac anh con lai.
  function loadPendingRotatorImg(img) {
    var src = img.getAttribute('data-src');
    if (!src) return;
    img.src = src;
    img.removeAttribute('data-src');
  }
  function deferRotatorImages() {
    var pending = document.querySelectorAll('.rotator-img[data-src]');
    if (!pending.length) return;
    pending.forEach(loadPendingRotatorImg);
  }
  function initMediaRotator() {
    var frames = document.querySelectorAll('.media-frame--rotator, .hero-rotator, .prod');
    if (!frames.length) return;
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (document.readyState === 'complete') {
      setTimeout(deferRotatorImages, 400);
    } else {
      window.addEventListener('load', function () { setTimeout(deferRotatorImages, 400); });
    }

    frames.forEach(function (frame) {
      var imgs = frame.querySelectorAll('.rotator-img');
      if (imgs.length < 2) return;
      var dotsBox = frame.parentElement ? frame.parentElement.querySelector('.rotator-dots') : null;
      var dots = dotsBox ? dotsBox.querySelectorAll('.rotator-dot') : null;
      var i = 0, timer;

      function show(idx) {
        imgs[i].classList.remove('is-active');
        i = (idx + imgs.length) % imgs.length;
        loadPendingRotatorImg(imgs[i]); // phong khi chuyen anh truoc luc tai ngam xong
        imgs[i].classList.add('is-active');
        if (dots) {
          dots.forEach(function (d, di) {
            d.classList.toggle('is-active', di === i);
            d.setAttribute('aria-current', di === i ? 'true' : 'false');
          });
        }
      }
      function start() {
        if (reduceMotion) return; // giu nguyen anh dang xem, khong tu chay
        clearInterval(timer);
        timer = setInterval(function () { show(i + 1); }, 3000);
      }
      if (dots) {
        dots.forEach(function (d, di) {
          d.addEventListener('click', function () { show(di); start(); });
        });
      }
      start();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
