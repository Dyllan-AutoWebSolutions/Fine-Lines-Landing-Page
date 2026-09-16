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
