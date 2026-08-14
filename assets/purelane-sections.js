/**
 * purelane-sections.js
 * Shared scroll-reveal, scene crossfade, and parallax/RAF system.
 *
 * Logic preserved verbatim from purelane-homepage.html prototype.
 * Wrapped in a self-contained IIFE; exposes PL global for section scripts.
 *
 * CHANGELOG vs prototype:
 * - CSS class names updated to prefixed pl-rv / pl-in convention
 * - ID references for hstage, heroProd, rot use section-scoped IDs
 *   (each section's own <script> calls PL.initHero(sid) / PL.initRot(sid))
 * - Rail sync removed from global loop (rail is a Dawn header concern, not a section)
 * - All document.getElementById calls take explicit element references, not IDs,
 *   so the same function can be called multiple times per page safely.
 */

(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var raf = null;
  var mx = 0, my = 0;

  /* ---------------------------------------------------------------
     Scroll-reveal (IntersectionObserver + .pl-rv → .pl-in)
     Called once globally; observes ALL .pl-rv elements on the page.
  --------------------------------------------------------------- */
  function initReveal() {
    var revs = document.querySelectorAll('.pl-rv');
    if ('IntersectionObserver' in window && !reduce) {
      var ro = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('pl-in');
            ro.unobserve(e.target);
          }
        });
      }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
      revs.forEach(function (el) { ro.observe(el); });
    } else {
      revs.forEach(function (el) { el.classList.add('pl-in'); });
    }
  }

  /* ---------------------------------------------------------------
     Scene crossfade (scroll-driven, deterministic)
     Reads [data-pl-scene] attributes on section wrappers.
     Drives .scene.on classes and data-d attribute on #pl-scenes wrapper.
     This runs only if a .pl-scenes element exists in the DOM
     (i.e. the background system is installed in theme.liquid).
  --------------------------------------------------------------- */
  var scenes = [];
  var zones  = [];
  var stage  = null;
  var currentScene = 0;

  function setScene(n) {
    if (n === currentScene) return;
    currentScene = n;
    scenes.forEach(function (s, i) { s.classList.toggle('on', i + 1 === n); });
    if (stage) stage.setAttribute('data-d', String(n));
  }

  function pickScene() {
    var focus = window.scrollY + window.innerHeight * 0.5;
    var n = 1;
    for (var i = 0; i < zones.length; i++) {
      var z = zones[i];
      var top = 0, el = z;
      while (el) { top += el.offsetTop; el = el.offsetParent; }
      if (top <= focus) n = parseInt(z.getAttribute('data-pl-scene'), 10) || n;
    }
    setScene(n);
  }

  function initScenes() {
    stage  = document.getElementById('pl-scenes');
    if (!stage) return; // background system not installed — skip silently
    scenes = [].slice.call(stage.querySelectorAll('.scene'));
    zones  = [].slice.call(document.querySelectorAll('[data-pl-scene]'));
  }

  /* ---------------------------------------------------------------
     Parallax / header shrink frame (RAF-throttled)
     Water layer parallax only runs when .pl-scenes is present.
  --------------------------------------------------------------- */
  function frame() {
    raf = null;
    var y = window.scrollY || window.pageYOffset;

    // Header shrink
    var hdr = document.getElementById('pl-hdr');
    if (hdr) hdr.classList.toggle('up', y > 90);

    // Water layer parallax
    if (!reduce && stage) {
      var wls = document.querySelectorAll('#pl-scenes .wl');
      var ds = [0.05, 0.09, 0.03, 0.02];
      for (var i = 0; i < wls.length; i++) {
        var d = ds[i] || 0.05;
        wls[i].style.setProperty('--px', (mx * d * 130).toFixed(1) + 'px');
        wls[i].style.setProperty('--py', (-y * d + my * d * 90).toFixed(1) + 'px');
      }
    }

    pickScene();
  }

  function onScroll() { if (!raf) raf = requestAnimationFrame(frame); }

  /* ---------------------------------------------------------------
     Hero product parallax + ambient drift
     Called per-section by PL.initHero(sectionId)
  --------------------------------------------------------------- */
  function initHeroProd(sid) {
    var prod = document.getElementById('pl-prod-' + sid);
    if (!prod) return;

    // Scroll parallax
    function prodFrame() {
      var y  = window.scrollY || window.pageYOffset;
      var f  = Math.min(y / 700, 1);
      if (!reduce) {
        prod.style.transform = 'translate3d(' + (mx * -16).toFixed(2) + 'px,' +
          (-f * 54 + my * -10).toFixed(2) + 'px,0) scale(' + (1 - f * 0.06).toFixed(3) + ')';
        prod.style.opacity = (1 - f * 0.55).toFixed(3);
      }
    }
    // Patch frame() to also move this prod element
    var _prev = window._plProdFrames || [];
    _prev.push(prodFrame);
    window._plProdFrames = _prev;

    // Ambient shadow drift
    if (!reduce) {
      prod.animate(
        [
          { filter: 'drop-shadow(0 14px 22px rgba(0,74,66,.15))' },
          { filter: 'drop-shadow(0 22px 34px rgba(0,74,66,.22))' },
          { filter: 'drop-shadow(0 14px 22px rgba(0,74,66,.15))' }
        ],
        { duration: 7000, iterations: Infinity, easing: 'ease-in-out' }
      );
    }
  }

  /* ---------------------------------------------------------------
     Hero stage rotator (1 → 2 → 3 products)
     Called per-section by PL.initHero(sectionId)
  --------------------------------------------------------------- */
  function initHeroStage(sid) {
    var hstage = document.getElementById('pl-hstage-' + sid);
    if (!hstage) return;

    var hs = [].slice.call(hstage.querySelectorAll('.pl-hslide'));
    var hd = [].slice.call(document.querySelectorAll('#pl-hdots-' + sid + ' button'));
    var hi = 0, htimer = null;

    function hgo(n) {
      hi = (n + hs.length) % hs.length;
      hs.forEach(function (s, i) { s.classList.toggle('on', i === hi); });
      hd.forEach(function (d, i) { d.classList.toggle('on', i === hi); });
    }
    function hplay() { if (!htimer && !reduce) htimer = setInterval(function () { hgo(hi + 1); }, 3800); }
    function hstop() { if (htimer) { clearInterval(htimer); htimer = null; } }

    hd.forEach(function (d, i) {
      d.addEventListener('click', function () { hstop(); hgo(i); hplay(); });
    });
    hstage.addEventListener('mouseenter', hstop);
    hstage.addEventListener('mouseleave', hplay);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { e.isIntersecting ? hplay() : hstop(); });
      }, { threshold: 0.2 }).observe(hstage);
    } else { hplay(); }
  }

  /* ---------------------------------------------------------------
     Product rotator (proof / how-it-works section)
     Called per-section by PL.initRot(sectionId)
  --------------------------------------------------------------- */
  function initRot(sid) {
    var rot = document.getElementById('pl-rot-' + sid);
    if (!rot) return;

    var rimgs = [].slice.call(rot.querySelectorAll('.pl-rot__frame .pl-pimg'));
    var rdots = [].slice.call(rot.querySelectorAll('.pl-rot__dots i'));
    var rcapB = rot.querySelector('.pl-rot__cap b');
    var rcapS = rot.querySelector('.pl-rot__cap span');
    var ri = 0, rtimer = null;

    function rstep() {
      rimgs[ri].classList.remove('on');
      if (rdots[ri]) rdots[ri].classList.remove('on');
      ri = (ri + 1) % rimgs.length;
      rimgs[ri].classList.add('on');
      if (rdots[ri]) rdots[ri].classList.add('on');
      if (rcapB) rcapB.innerHTML = rimgs[ri].getAttribute('data-name') || '';
      if (rcapS) rcapS.textContent = rimgs[ri].getAttribute('data-note') || '';
    }

    if (!reduce) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting && !rtimer) rtimer = setInterval(rstep, 2900);
          else if (!e.isIntersecting && rtimer) { clearInterval(rtimer); rtimer = null; }
        });
      }, { threshold: 0.25 }).observe(rot);
    }
  }

  /* ---------------------------------------------------------------
     Patch frame() to also run per-section prod parallax
  --------------------------------------------------------------- */
  var _origFrame = frame;
  window.requestAnimationFrame; // prime
  function enhancedFrame() {
    _origFrame();
    var frames = window._plProdFrames || [];
    for (var i = 0; i < frames.length; i++) frames[i]();
  }
  function onScrollEnhanced() { if (!raf) raf = requestAnimationFrame(enhancedFrame); }

  /* ---------------------------------------------------------------
     Mouse parallax (desktop only)
  --------------------------------------------------------------- */
  if (!reduce && window.matchMedia('(min-width: 1024px)').matches) {
    window.addEventListener('mousemove', function (e) {
      mx = (e.clientX / window.innerWidth  - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
      onScrollEnhanced();
    }, { passive: true });
  }

  /* ---------------------------------------------------------------
     Boot
  --------------------------------------------------------------- */
  function boot() {
    initReveal();
    initScenes();
    window.addEventListener('scroll', onScrollEnhanced, { passive: true });
    window.addEventListener('resize', onScrollEnhanced);
    enhancedFrame(); // initial paint
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  /* ---------------------------------------------------------------
     Public API (called by per-section inline scripts)
  --------------------------------------------------------------- */
  window.PL = window.PL || {};
  window.PL.initHero = function (sid) {
    initHeroStage(sid);
    initHeroProd(sid);
  };
  window.PL.initRot  = function (sid) { initRot(sid); };
  window.PL.reveal   = initReveal; // call after dynamic content added

})();
