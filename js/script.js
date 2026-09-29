/* ==========================================================================
   REGENT FUEL INJECTORS — Core JavaScript Engine
   Features:
   - Sticky Header & Active Nav Tracking (root & subfolder aware)
   - Mobile Navigation & Submenu Drawer
   - Homepage Hero Slider (Autoplay, Touch Swipe, Controls, Slide Counter)
   - Scroll Reveal (IntersectionObserver with Safety Timeout)
   - Product Catalog Category Filter
   - Accessible FAQ Accordion
   - Contact Form Validation & Prepared EmailJS Integration
   - Dynamic Copyright Year
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  /* ------------------------------------------------------------------------
     1. DYNAMIC COPYRIGHT YEAR
     ------------------------------------------------------------------------ */
  var yearEls = document.querySelectorAll('[data-year]');
  var currentYear = new Date().getFullYear();
  yearEls.forEach(function (el) {
    el.textContent = currentYear;
  });

  /* ------------------------------------------------------------------------
     2. STICKY HEADER SCROLL EFFECT
     ------------------------------------------------------------------------ */
  var siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    var checkScroll = function () {
      if (window.scrollY > 30) {
        siteHeader.classList.add('is-scrolled');
      } else {
        siteHeader.classList.remove('is-scrolled');
      }
    };
    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
  }

  /* ------------------------------------------------------------------------
     3. MOBILE NAVIGATION DRAWER
     ------------------------------------------------------------------------ */
  var hamburger = document.querySelector('.hamburger');
  var mobileNav = document.querySelector('.mobile-nav');

  if (hamburger && mobileNav) {
    var toggleMobileNav = function () {
      var isOpen = mobileNav.classList.toggle('is-open');
      hamburger.classList.toggle('is-open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    hamburger.addEventListener('click', toggleMobileNav);

    // Close when clicking internal links
    mobileNav.querySelectorAll('a:not(.mobile-sub-toggle)').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('is-open');
        hamburger.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ------------------------------------------------------------------------
     4. ACTIVE NAVIGATION LINK DETECTION
     ------------------------------------------------------------------------ */
  var currentPath = window.location.pathname.replace(/\/$/, '');
  var currentFilename = currentPath.split('/').pop() || 'index.html';
  var isProductSubpage = currentPath.indexOf('/products/') !== -1;

  document.querySelectorAll('.nav-link, .mobile-nav-links a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href) return;

    var cleanHref = href.split('#')[0].replace(/\/$/, '');
    var hrefFilename = cleanHref.split('/').pop();

    if (
      hrefFilename === currentFilename ||
      (currentFilename === 'index.html' && (cleanHref === '' || cleanHref === '.' || cleanHref === 'index.html')) ||
      (isProductSubpage && hrefFilename === 'products.html')
    ) {
      link.classList.add('active');
    }
  });

  /* ------------------------------------------------------------------------
     5. HERO SLIDER (HOMEPAGE)
     ------------------------------------------------------------------------ */
  var slider = document.querySelector('.hero-slider');
  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('.hero-dot'));
    var prevBtn = slider.querySelector('.hero-prev');
    var nextBtn = slider.querySelector('.hero-next');
    var currentCounter = slider.querySelector('.hero-counter .current');
    var totalCounter = slider.querySelector('.hero-counter .total');

    if (slides.length > 0) {
      var currentIndex = 0;
      var AUTOPLAY_DELAY = 5500;
      var autoplayTimer = null;

      if (totalCounter) {
        totalCounter.textContent = slides.length < 10 ? '0' + slides.length : slides.length;
      }

      var updateSlide = function (newIndex) {
        slides[currentIndex].classList.remove('is-active');
        if (dots[currentIndex]) dots[currentIndex].classList.remove('is-active');

        currentIndex = (newIndex + slides.length) % slides.length;

        slides[currentIndex].classList.add('is-active');
        if (dots[currentIndex]) dots[currentIndex].classList.add('is-active');

        if (currentCounter) {
          var displayNum = currentIndex + 1;
          currentCounter.textContent = displayNum < 10 ? '0' + displayNum : displayNum;
        }
      };

      var nextSlide = function () {
        updateSlide(currentIndex + 1);
      };

      var prevSlide = function () {
        updateSlide(currentIndex - 1);
      };

      var startAutoplay = function () {
        stopAutoplay();
        autoplayTimer = setInterval(nextSlide, AUTOPLAY_DELAY);
      };

      var stopAutoplay = function () {
        if (autoplayTimer) {
          clearInterval(autoplayTimer);
          autoplayTimer = null;
        }
      };

      if (nextBtn) {
        nextBtn.addEventListener('click', function () {
          nextSlide();
          startAutoplay();
        });
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', function () {
          prevSlide();
          startAutoplay();
        });
      }

      dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
          updateSlide(i);
          startAutoplay();
        });
      });

      // Pause on hover
      slider.addEventListener('mouseenter', stopAutoplay);
      slider.addEventListener('mouseleave', startAutoplay);

      // Touch swipe support
      var touchStartX = 0;
      slider.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      slider.addEventListener('touchend', function (e) {
        var touchEndX = e.changedTouches[0].screenX;
        var diffX = touchEndX - touchStartX;
        if (Math.abs(diffX) > 45) {
          if (diffX < 0) {
            nextSlide();
          } else {
            prevSlide();
          }
          startAutoplay();
        }
      }, { passive: true });

      startAutoplay();
    }
  }

  /* ------------------------------------------------------------------------
     6. SCROLL REVEAL ANIMATIONS
     ------------------------------------------------------------------------ */
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length > 0) {
    if ('IntersectionObserver' in window) {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            revealObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      });

      reveals.forEach(function (el) {
        revealObserver.observe(el);
      });
    } else {
      reveals.forEach(function (el) {
        el.classList.add('in-view');
      });
    }

    // Safety timeout: ensure everything is visible after 1.2s regardless of JS observer state
    setTimeout(function () {
      reveals.forEach(function (el) {
        el.classList.add('in-view');
      });
    }, 1200);
  }

  /* ------------------------------------------------------------------------
     7. PRODUCT CATALOG CATEGORY FILTER (products.html)
     ------------------------------------------------------------------------ */
  var filterTabs = document.querySelectorAll('.filter-tab[data-filter]');
  var catalogItems = document.querySelectorAll('.catalog-item[data-category]');

  if (filterTabs.length > 0 && catalogItems.length > 0) {
    filterTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        filterTabs.forEach(function (t) { t.classList.remove('is-active'); });
        tab.classList.add('is-active');

        var filterValue = tab.getAttribute('data-filter');

        catalogItems.forEach(function (item) {
          var categories = (item.getAttribute('data-category') || '').split(' ');
          if (filterValue === 'all' || categories.indexOf(filterValue) !== -1) {
            item.style.display = '';
            item.classList.add('in-view');
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  /* ------------------------------------------------------------------------
     8. ACCESSIBLE FAQ ACCORDION (faq.html)
     ------------------------------------------------------------------------ */
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var button = item.querySelector('.faq-question');
    var answer = item.querySelector('.faq-answer');

    if (button && answer) {
      button.setAttribute('aria-expanded', 'false');

      button.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');

        // Optional: Close siblings for single-expanded view
        faqItems.forEach(function (sibling) {
          if (sibling !== item && sibling.classList.contains('is-open')) {
            sibling.classList.remove('is-open');
            var sibBtn = sibling.querySelector('.faq-question');
            var sibAns = sibling.querySelector('.faq-answer');
            if (sibBtn) sibBtn.setAttribute('aria-expanded', 'false');
            if (sibAns) sibAns.style.maxHeight = null;
          }
        });

        if (isOpen) {
          item.classList.remove('is-open');
          button.setAttribute('aria-expanded', 'false');
          answer.style.maxHeight = null;
        } else {
          item.classList.add('is-open');
          button.setAttribute('aria-expanded', 'true');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    }
  });

  /* ------------------------------------------------------------------------
     9. CONTACT FORM VALIDATION & PREPARED EMAILJS INTEGRATION
     ------------------------------------------------------------------------ */
  var contactForm = document.querySelector('.contact-form-inner');
  if (contactForm) {
    var successAlert = document.querySelector('.form-alert.alert-success');
    var errorAlert = document.querySelector('.form-alert.alert-error');

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (successAlert) successAlert.classList.remove('is-visible');
      if (errorAlert) errorAlert.classList.remove('is-visible');

      var nameInput = contactForm.querySelector('[name="name"]');
      var phoneInput = contactForm.querySelector('[name="phone"]');
      var emailInput = contactForm.querySelector('[name="email"]');
      var messageInput = contactForm.querySelector('[name="message"]');

      var name = nameInput ? nameInput.value.trim() : '';
      var phone = phoneInput ? phoneInput.value.trim() : '';
      var email = emailInput ? emailInput.value.trim() : '';
      var message = messageInput ? messageInput.value.trim() : '';

      // Basic client-side validation
      if (!name || !phone || !email || !message) {
        if (errorAlert) {
          errorAlert.textContent = 'Please fill in all required fields (Name, Phone, Email, Message).';
          errorAlert.classList.add('is-visible');
          errorAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        return;
      }

      // Email validation regex
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        if (errorAlert) {
          errorAlert.textContent = 'Please provide a valid email address.';
          errorAlert.classList.add('is-visible');
          errorAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        return;
      }

      /* 
         EMAILJS HOOK (READY FOR CREDENTIALS):
         To activate direct email sending via EmailJS:
         1. Sign up at https://www.emailjs.com/
         2. Include <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script> in contact.html
         3. Initialize: emailjs.init("YOUR_PUBLIC_KEY");
         4. Call emailjs.sendForm("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", contactForm);
      */

      // Current behavior: Display success state and reset form
      var submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending Enquiry...';
      }

      setTimeout(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Submit Technical Enquiry</span>';
        }
        if (successAlert) {
          successAlert.classList.add('is-visible');
          successAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        contactForm.reset();
      }, 600);
    });
  }

});
