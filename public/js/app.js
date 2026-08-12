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
    zalo: '02553829714',
    email: 'dongthanhqng@gmail.com',
    tax: '4300269721',
    since: '1984',
    addressVi: '32 Lê Văn Sỹ, Phường Nghĩa Lộ, TP. Quảng Ngãi, Tỉnh Quảng Ngãi',
    addressEn: '32 Le Van Sy St., Nghia Lo Ward, Quang Ngai City, Quang Ngai Province, Vietnam'
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
    var sel = 'p, h1, h2, h3, h4, figcaption, blockquote, .footer-about, .hero__lead, .eyebrow, .media-tag, .trust-item span, .breadcrumb span';
    document.querySelectorAll(sel).forEach(function (el) {
      var nodes = el.childNodes;
      for (var i = nodes.length - 1; i >= 0; i--) {
        var n = nodes[i];
        if (n.nodeType === 3) { // text node
          var txt = n.nodeValue;
          if (/\S\s+\S/.test(txt)) { n.nodeValue = txt.replace(/\s+(\S+)\s*$/, '\u00A0$1'); break; }
          if (/\S/.test(txt)) break; // text node chỉ có 1 từ -> dừng
        } else if (n.nodeType === 1) { break; } // gặp thẻ con ở cuối -> dừng cho an toàn
      }
    });
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
    doc: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>'
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
            '<p class="footer-about" data-en="Garment manufacturer with 40+ years of heritage (since 1984) in Quang Ngai — strategic partner of NOA GROUP, reliable for domestic and export markets.">' +
              'Doanh nghiệp may mặc với hơn 40 năm bề dày (từ 1984) tại Quảng Ngãi — đối tác chiến lược của NOA GROUP, tin cậy cho thị trường trong nước và xuất khẩu.' +
            '</p>' +
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
              '<li><span style="color:#94a3b8" data-en="Heritage">Bề dày</span>: ' + '<span data-en="40+ years (since 1984)">Hơn 40 năm (từ 1984)</span></li>' +
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
      '<a class="floater floater--zalo" href="https://zalo.me/' + CO.zalo + '" target="_blank" rel="noopener" data-tip="Chat Zalo" aria-label="Chat Zalo">Zalo</a>' +
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

    // Sticky shadow + back-to-top
    function onScroll() {
      var y = window.scrollY;
      if (header) header.classList.toggle('is-scrolled', y > 8);
      if (toTop) toTop.classList.toggle('is-show', y > 500);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
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

    var box = document.createElement('div');
    box.className = 'lightbox';
    box.innerHTML =
      '<button class="lightbox__close" aria-label="Đóng">&times;</button>' +
      '<img alt="">' +
      '<div class="lightbox__cap"></div>';
    document.body.appendChild(box);
    var bimg = box.querySelector('img');
    var bcap = box.querySelector('.lightbox__cap');

    function open(src, cap) {
      bimg.src = src; bimg.alt = cap || '';
      bcap.textContent = cap || '';
      box.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      box.classList.remove('is-open');
      document.body.style.overflow = '';
      bimg.src = '';
    }

    thumbs.forEach(function (t) {
      t.style.cursor = 'zoom-in';
      t.addEventListener('click', function () {
        var img = t.tagName === 'IMG' ? t : t.querySelector('img');
        if (!img) return;
        var cap = t.getAttribute('data-cap');
        if (!cap) {
          var fc = t.querySelector && t.querySelector('figcaption');
          cap = fc ? fc.textContent : (img.getAttribute('alt') || '');
        }
        open(img.getAttribute('src'), cap);
      });
    });
    box.addEventListener('click', function (e) {
      if (e.target === box || e.target.classList.contains('lightbox__close')) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

  /* ============================ Contact form ========================= */
  function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;
    var status = document.getElementById('form-status');
    var submit = form.querySelector('button[type="submit"]');
    var submitText = submit ? submit.innerHTML : '';

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var lang = getLang();
      status.className = 'form__status';
      var data = Object.fromEntries(new FormData(form).entries());

      if (submit) { submit.disabled = true; submit.innerHTML = lang === 'en' ? 'Sending…' : 'Đang gửi…'; }

      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, body: j }; }); })
        .then(function (res) {
          if (res.ok && res.body.ok) {
            status.classList.add('is-ok');
            status.textContent = lang === 'en'
              ? 'Thank you! Your message has been received — we will respond soon.'
              : 'Cảm ơn bạn! Chúng tôi đã nhận thông tin và sẽ phản hồi sớm nhất.';
            form.reset();
          } else {
            throw new Error(res.body.error || 'error');
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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
