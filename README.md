# Regent Fuel Injectors — Website

Ready-to-run static website (HTML5 / CSS3 / JavaScript). Open `index.html`
directly in a browser, or use the VS Code "Live Server" extension for the
best experience (right-click `index.html` → "Open with Live Server").

## What's new in this version

- New logo applied site-wide (header, footer, favicon)
- Switched from dark theme to a white/light theme throughout
- Homepage hero is now a 4-image carousel (Automotive, Motorbike, Marine,
  GDI) with no text overlay, auto-scrolling from page load
- Homepage content trimmed to match PPT slides 1–2 exactly (Our Services
  line, ASNU badge, 95% call-to-action, Our Products categories) —
  the fuller detail (company history, testing procedure, GDI manufacturer
  table, etc.) lives on the About Us and Services pages, matching the
  PPT's own multi-slide structure

## Folder structure

```
regent-website/
├── index.html          Home (4-image hero, services line, 95% CTA, products)
├── about.html           About Us
├── services.html        Services, injector types, testing procedure, GDI
├── products.html         Products — Automotive / Motorbike / Marine / GDI / Parts
├── faq.html             FAQ (categorised accordion)
├── contact.html          Contact (form + map + details)
├── css/style.css        All styling
├── js/script.js         Slider, mobile menu, FAQ accordion, animations
└── images/
    ├── logo.png          Your logo (used in header + footer)
    ├── hero/              Home page slider images (4 slides)
    ├── services/          Category banner images (car/bike/marine/gdi fleet)
    └── products/          All 42 real injector photos across 4 categories
```

## Replacing images

To swap any hero slide, just replace the file at the same path/name
(e.g. overwrite `images/hero/hero-1.jpg` with your own image, same
filename) — no code changes needed.

## Content source

All company information is taken directly from the PPT you provided.
The home page mirrors slides 1–2 specifically; About Us and Services
draw from the later slides (company history, the 11-step testing and
cleaning procedure, GDI manufacturer table). Nothing has been invented
beyond what's in the PPT or your existing site.

## Notes

- The contact form is front-end only (no backend is configured) — it
  shows a confirmation message but does not actually send an email.
- The Google Map on the Contact page is a live embed pointed at your
  address — no API key required for the basic embed used here.
- The footer stays dark for visual grounding/contrast, which is standard
  practice even on white-themed sites — let me know if you'd like that
  made white too.
