/* ==========================================================================
   REGENT FUEL INJECTORS — Site JS
   Hero slider, mobile nav, scroll reveal, gauge animation,
   FAQ accordion, active-nav highlighting, contact form.
   ========================================================================== */

/* Lightweight polyfill: some older browser engines expose querySelectorAll
   results without NodeList.prototype.forEach. Without this, every call
   below would throw and stop the rest of the script from running. */
if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
}

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Current year in footer ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Mobile nav ---------- */
  var hamburger = document.querySelector('.hamburger');
  var mobileNav = document.querySelector('.mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      var isOpen = mobileNav.classList.toggle('is-open');
      hamburger.classList.toggle('is-open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('is-open');
        hamburger.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Active nav link ---------- */
  var currentPage = (window.location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.nav-primary a, .mobile-nav a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ---------- Hero slider ---------- */
  var slider = document.querySelector('.hero-slider');
  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('.hero-dot'));
    var prevBtn = slider.querySelector('.hero-prev');
    var nextBtn = slider.querySelector('.hero-next');
    var current = 0;
    var AUTOPLAY_MS = 5000;
    var timer = null;

    function goTo(index) {
      slides[current].classList.remove('is-active');
      dots[current] && dots[current].classList.remove('is-active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('is-active');
      dots[current] && dots[current].classList.add('is-active');
    }
    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }
    function startAutoplay() {
      stopAutoplay();
      timer = setInterval(next, AUTOPLAY_MS);
    }
    function stopAutoplay() {
      if (timer) clearInterval(timer);
    }

    if (nextBtn) nextBtn.addEventListener('click', function () { next(); startAutoplay(); });
    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); startAutoplay(); });
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goTo(i); startAutoplay(); });
    });

    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);

    /* basic touch swipe */
    var touchStartX = 0;
    slider.addEventListener('touchstart', function (e) { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    slider.addEventListener('touchend', function (e) {
      var delta = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(delta) > 40) { delta < 0 ? next() : prev(); startAutoplay(); }
    }, { passive: true });

    /* start immediately on page load */
    startAutoplay();
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }
  /* Safety net: force reveal visible shortly after load regardless,
     so content is never permanently hidden if something above fails. */
  window.setTimeout(function () {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }, 1200);

  /* ---------- Gauge animation ---------- */
  var gauges = document.querySelectorAll('.gauge');
  if ('IntersectionObserver' in window && gauges.length) {
    var gaugeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          gaugeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    gauges.forEach(function (g) { gaugeObserver.observe(g); });
  } else {
    gauges.forEach(function (g) { g.classList.add('in-view'); });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var question = item.querySelector('.faq-question');
    var answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;
    question.addEventListener('click', function () {
      var isOpen = item.classList.contains('is-open');
      var group = item.closest('.faq-group');
      if (group) {
        group.querySelectorAll('.faq-item.is-open').forEach(function (openItem) {
          if (openItem !== item) {
            openItem.classList.remove('is-open');
            openItem.querySelector('.faq-answer').style.maxHeight = null;
          }
        });
      }
      item.classList.toggle('is-open', !isOpen);
      answer.style.maxHeight = !isOpen ? answer.scrollHeight + 'px' : null;
    });
  });

  /* ---------- FAQ category filter ---------- */
  var catButtons = document.querySelectorAll('.faq-cat-btn[data-target]');
  var faqGroups = document.querySelectorAll('.faq-group[data-category]');
  if (catButtons.length && faqGroups.length) {
    catButtons.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        if (!btn.hasAttribute('data-target')) return;
        e.preventDefault();
        catButtons.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        var target = btn.getAttribute('data-target');
        faqGroups.forEach(function (group) {
          if (target === 'all' || group.getAttribute('data-category') === target) {
            group.style.display = '';
          } else {
            group.style.display = 'none';
          }
        });
      });
    });
  }

  /* ---------- Contact form (front-end only, no backend configured) ---------- */
  var contactForm = document.querySelector('.contact-form form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var successMsg = document.querySelector('.form-success');
      if (successMsg) {
        successMsg.classList.add('is-visible');
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      contactForm.reset();
    });
  }

});
