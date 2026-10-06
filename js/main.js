(function () {
  var hamburger = document.querySelector('.hamburger');
  var mobilePanel = document.querySelector('.mobile-panel');

  if (!hamburger || !mobilePanel) return;

  function openMenu() {
    mobilePanel.hidden = false;
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    mobilePanel.hidden = true;
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', function () {
    var isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  mobilePanel.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });
})();

(function () {
  var year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();

(function () {
  var triggers = document.querySelectorAll('[data-book]');
  if (!triggers.length || typeof HTMLDialogElement !== 'function') return;

  var WHATSAPP_NUMBER = '27712562703';
  var SERVICES = [
    'Microneedling',
    'Chemical Peel',
    'Dermaplaning',
    'Gel / Cutex Pedicure',
    'Facial Wax & Tint',
    'Not sure, please advise'
  ];

  var dialog = document.createElement('dialog');
  dialog.className = 'book-modal';
  dialog.setAttribute('aria-labelledby', 'book-title');
  dialog.innerHTML =
    '<form class="book-form" novalidate>' +
    '<button type="button" class="book-close" aria-label="Close">&times;</button>' +
    '<div class="eyebrow">Book an appointment</div>' +
    '<h2 id="book-title">Let\'s get you booked in</h2>' +
    '<p class="book-intro">Fill in your details and we\'ll open WhatsApp with your booking request ready to send to Michelle.</p>' +
    '<label class="book-field"><span>Name</span><input type="text" name="name" autocomplete="name" required /></label>' +
    '<label class="book-field"><span>Phone number</span><input type="tel" name="phone" autocomplete="tel" inputmode="tel" required /></label>' +
    '<label class="book-field"><span>Email <em>(optional)</em></span><input type="email" name="email" autocomplete="email" /></label>' +
    '<fieldset class="book-services"><legend>Which treatment(s)?</legend>' +
    SERVICES.map(function (s) {
      return '<label class="book-chip"><input type="checkbox" name="service" value="' + s.replace(/&/g, '&amp;') + '" /><span>' + s.replace(/&/g, '&amp;') + '</span></label>';
    }).join('') +
    '</fieldset>' +
    '<p class="book-error" role="alert" hidden></p>' +
    '<button type="submit" class="btn btn-primary book-submit">Continue to WhatsApp</button>' +
    '<p class="book-note">Your details are not stored on this website. They are only added to your WhatsApp message.</p>' +
    '</form>';
  document.body.appendChild(dialog);

  var form = dialog.querySelector('form');
  var nameInput = form.querySelector('[name="name"]');
  var phoneInput = form.querySelector('[name="phone"]');
  var emailInput = form.querySelector('[name="email"]');
  var error = dialog.querySelector('.book-error');

  function showError(msg, field) {
    error.textContent = msg;
    error.hidden = false;
    if (field) field.focus();
  }

  triggers.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      error.hidden = true;
      dialog.showModal();
    });
  });

  form.addEventListener('input', function () {
    error.hidden = true;
  });

  dialog.querySelector('.book-close').addEventListener('click', function () {
    dialog.close();
  });

  dialog.addEventListener('click', function (e) {
    if (e.target === dialog) dialog.close();
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = nameInput.value.trim();
    var phone = phoneInput.value.trim();
    var email = emailInput.value.trim();
    var services = Array.prototype.map.call(
      form.querySelectorAll('input[name="service"]:checked'),
      function (el) { return el.value; }
    );

    if (!name) return showError('Please enter your name.', nameInput);
    if (phone.replace(/\D/g, '').length < 10) return showError('Please enter a valid phone number.', phoneInput);
    if (email && !emailInput.checkValidity()) return showError('Please check your email address.', emailInput);
    if (!services.length) return showError('Please choose at least one treatment.', form.querySelector('input[name="service"]'));

    var lines = [
      'Hi Michelle, I would like to make a booking for the following:',
      services.map(function (s) { return '- ' + s; }).join('\n'),
      '',
      'Name: ' + name,
      'Number: ' + phone
    ];
    if (email) lines.push('Email: ' + email);
    lines.push('', 'Thank you');

    window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
    dialog.close();
    form.reset();
  });
})();

(function () {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var TARGETS = [
    '.trust-item',
    '.phil-quote',
    '.phil-body > *',
    '.section-head > *',
    '.svc-card',
    '.svc-media',
    '.brand-logo',
    '.about-mark',
    '.about-copy',
    '.why-item',
    '.faq-item',
    '.cta .wrap > *',
    '.map-panel'
  ].join(',');
  var STAGGER = 110;
  var MAX_DELAY = 550;

  function typeFor(el) {
    if (el.matches('.svc-media, .about-mark')) return 'img';
    if (el.matches('.faq-item, .map-panel, .brand-logo')) return 'fade';
    return 'up';
  }

  var observer = new IntersectionObserver(function (entries) {
    var i = 0;
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      el.style.setProperty('--rd', Math.min(i++ * STAGGER, MAX_DELAY) + 'ms');
      el.classList.add('is-in');
      observer.unobserve(el);
    });
  }, { rootMargin: '0px 0px -10% 0px' });

  document.querySelectorAll(TARGETS).forEach(function (el) {
    // Leave anything already on screen (e.g. restored scroll position) as-is.
    var rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return;
    el.classList.add('reveal', 'reveal-' + typeFor(el));
    observer.observe(el);
  });
})();

(function () {
  var logo = document.querySelector('.brandmark[href="#"]');
  if (!logo) return;

  logo.addEventListener('click', function (e) {
    e.preventDefault();
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
  });
})();
