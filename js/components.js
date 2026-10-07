/* ==========================================================================
   REGENT FUEL INJECTORS — Dynamic Header & Footer Component Loader
   Enables modular header and footer inclusion on any page.
   ========================================================================== */
(function () {
  'use strict';

  var isSubfolder = window.location.pathname.indexOf('/products/') !== -1;
  var rootPrefix = isSubfolder ? '../' : '';

  function loadComponent(slotId, fileUrl, fallbackTemplate) {
    var slot = document.getElementById(slotId);
    if (!slot) return;

    fetch(rootPrefix + fileUrl)
      .then(function (response) {
        if (!response.ok) throw new Error('Network error');
        return response.text();
      })
      .then(function (html) {
        slot.outerHTML = html.replace(/{{ROOT}}/g, rootPrefix);
        if (typeof window.initHeaderFeatures === 'function') {
          window.initHeaderFeatures();
        }
      })
      .catch(function () {
        if (fallbackTemplate) {
          slot.outerHTML = fallbackTemplate.replace(/{{ROOT}}/g, rootPrefix);
          if (typeof window.initHeaderFeatures === 'function') {
            window.initHeaderFeatures();
          }
        }
      });
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('site-header-slot')) {
      loadComponent('site-header-slot', 'header.html');
    }
    if (document.getElementById('site-footer-slot')) {
      loadComponent('site-footer-slot', 'footer.html');
    }
  });
})();
