/* Eboni Space — animasi halaman.
   Konten selalu terlihat di frame pertama; hanya bagian di bawah layar
   yang disembunyikan sebentar lalu dimunculkan saat di-scroll. */
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var api = { enabled: false, replay: function () {}, disable: function () {}, enable: function () {} };
  window.EboniMotion = api;
  if (reduce) return;

  var REVEAL = [
    '.section-head', '.card', '.step', '.bot-booking', '.bot-flow-item', '.area-list a', '.areas a',
    '.faq details', '.faq-list details', '.cta', '.related-card', '.article-card', '.tip', '.table-wrap',
    'main .notice', '.note', '.callout', '.game-search-box', '.foot-brand', '.foot-col',
    'main > article .wrap > h2', '.article-cover', 'figure', '.content-card', '.psbox-grid > *'
  ].join(',');
  var io = null, timers = [];

  function inHero(el) { return !!el.closest('.hero'); }

  function indexSiblings(list) {
    var groups = new Map();
    list.forEach(function (el) {
      var p = el.parentElement, n = groups.get(p) || 0;
      el.style.setProperty('--i', Math.min(n, 10));
      groups.set(p, n + 1);
    });
  }

  function setupHero() {
    document.querySelectorAll('.hero-copy > *, .hero > .wrap:not(.hero-grid) > *').forEach(function (el, i) {
      el.style.setProperty('--d', i);
    });
    var hero = document.querySelector('.hero');
    if (!hero || hero.querySelector('.hero-glow')) return;
    var glow = document.createElement('div');
    glow.className = 'hero-glow';
    glow.setAttribute('aria-hidden', 'true');
    hero.prepend(glow);
    if (matchMedia('(hover: hover)').matches) {
      var raf = 0;
      hero.addEventListener('pointermove', function (e) {
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = 0;
          var r = hero.getBoundingClientRect();
          glow.style.setProperty('--gx', (e.clientX - r.left) + 'px');
          glow.style.setProperty('--gy', (e.clientY - r.top) + 'px');
        });
      });
    }
  }

  function setupReveal() {
    var els = Array.prototype.filter.call(document.querySelectorAll(REVEAL), function (el) { return !inHero(el); });
    indexSiblings(els);
    var limit = innerHeight * 0.9;
    if (!('IntersectionObserver' in window)) return;
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        io.unobserve(el);
        if (el.classList.contains('how')) { el.classList.add('r-fill'); return; }
        el.classList.remove('r-wait');
        el.classList.add('r-in');
        el.addEventListener('animationend', function done(ev) {
          if (ev.target !== el) return;
          el.classList.remove('r-in');
          el.removeEventListener('animationend', done);
        });
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(function (el) {
      el.setAttribute('data-r', '');
      if (el.getBoundingClientRect().top > limit) { el.classList.add('r-wait'); io.observe(el); }
    });
    document.querySelectorAll('.how').forEach(function (how) {
      how.querySelectorAll('.step-number').forEach(function (n, i) { n.style.setProperty('--i', i); });
      if (how.getBoundingClientRect().top < limit) timers.push(setTimeout(function () { how.classList.add('r-fill'); }, 400));
      else io.observe(how);
    });
  }

  function setupCards() {
    if (!matchMedia('(hover: hover)').matches) return;
    document.addEventListener('pointermove', function (e) {
      var c = e.target.closest && e.target.closest('.card, .article-card');
      if (!c) return;
      var r = c.getBoundingClientRect();
      c.style.setProperty('--sx', (e.clientX - r.left) + 'px');
      c.style.setProperty('--sy', (e.clientY - r.top) + 'px');
    }, { passive: true });
  }

  function setupScroll() {
    var nav = document.querySelector('.nav');
    var bar = document.querySelector('.actionbar');
    var hero = document.querySelector('.hero');
    var article = document.querySelector('main > article');
    var prog = null;
    if (article && !document.querySelector('.read-progress')) {
      prog = document.createElement('div');
      prog.className = 'read-progress';
      prog.setAttribute('aria-hidden', 'true');
      document.body.appendChild(prog);
    }
    var ticking = false;
    function update() {
      ticking = false;
      var y = scrollY;
      if (nav) nav.classList.toggle('scrolled', y > 8);
      if (bar) bar.classList.toggle('show', !hero || y > Math.min(260, hero.offsetHeight * 0.4));
      if (prog && article) {
        var top = article.offsetTop, h = article.offsetHeight - innerHeight;
        prog.style.transform = 'scaleX(' + Math.max(0, Math.min(1, (y - top) / Math.max(h, 1))) + ')';
      }
    }
    addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  function setupMenu() {
    document.querySelectorAll('.popup-menu a').forEach(function (a, i) { a.style.setProperty('--i', i); });
  }

  function setupPanel() {
    document.querySelectorAll('.psummary dd, #sum-paket, #sum-isi').forEach(function (dd) {
      new MutationObserver(function () {
        dd.classList.remove('flash'); void dd.offsetWidth; dd.classList.add('flash');
      }).observe(dd, { childList: true, characterData: true, subtree: true });
    });
  }

  function start() {
    setupHero(); setupReveal(); setupCards(); setupScroll(); setupMenu(); setupPanel();
    root.classList.add('motion');
    api.enabled = true;
  }

  api.disable = function () {
    root.classList.remove('motion');
    document.querySelectorAll('.r-wait, .r-in').forEach(function (el) { el.classList.remove('r-wait', 'r-in'); });
    document.querySelectorAll('.how').forEach(function (h) { h.classList.add('r-fill'); });
    if (io) io.disconnect();
    api.enabled = false;
  };
  api.enable = function () {
    if (api.enabled) return;
    document.querySelectorAll('.how').forEach(function (h) { h.classList.remove('r-fill'); });
    root.classList.add('motion');
    setupReveal();
    api.enabled = true;
  };
  api.replay = function () {
    timers.forEach(clearTimeout); timers = [];
    api.disable();
    scrollTo({ top: 0, behavior: 'instant' });
    document.querySelectorAll('.how').forEach(function (h) { h.classList.remove('r-fill'); });
    void root.offsetWidth;
    requestAnimationFrame(function () { root.classList.add('motion'); setupReveal(); api.enabled = true; });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
