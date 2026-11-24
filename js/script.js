
(() => {

  /* =====================================
     MOBILE NAVIGATION
     ===================================== */

  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#primary-navigation');

  function closeMenu() {

    if (!menuButton || !navigation) return;

    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');

    navigation.classList.remove('is-open');
    document.body.classList.remove('menu-open');

  }

  if (menuButton && navigation) {

    const navLinks = navigation.querySelectorAll('a');

    menuButton.addEventListener('click', () => {

      const isOpen =
        menuButton.getAttribute('aria-expanded') === 'true';

      menuButton.setAttribute(
        'aria-expanded',
        String(!isOpen)
      );

      menuButton.setAttribute(
        'aria-label',
        isOpen ? 'Open navigation' : 'Close navigation'
      );

      navigation.classList.toggle('is-open', !isOpen);

      document.body.classList.toggle('menu-open', !isOpen);

    });

    navLinks.forEach((link) => {

      link.addEventListener('click', closeMenu);

    });

  }


  /* =====================================
     APPLICATION REQUEST MODAL
     ===================================== */

  const applicationModal =
    document.querySelector('#application-modal');

  const applicationForm =
    document.querySelector('#application-form');

  const applicationTriggers =
    document.querySelectorAll('[data-open-application]');

  const applicationCloseButtons =
    document.querySelectorAll('[data-close-application]');

  let previousFocus = null;


  function openApplicationModal(trigger) {

    if (
      !applicationModal ||
      typeof applicationModal.showModal !== 'function'
    ) {
      return false;
    }

    if (applicationModal.open) {
      return true;
    }

    const mobileMenuWasOpen =
      trigger &&
      navigation &&
      navigation.contains(trigger) &&
      window.matchMedia('(max-width: 720px)').matches;

    previousFocus = mobileMenuWasOpen
      ? menuButton
      : trigger || document.activeElement;

    closeMenu();

    /* Load Microsoft Forms only when needed */

    if (
      applicationForm &&
      applicationForm.dataset.src &&
      applicationForm.getAttribute('src') === 'about:blank'
    ) {

      applicationForm.setAttribute(
        'src',
        applicationForm.dataset.src
      );

    }

    applicationModal.showModal();

    document.body.classList.add('modal-open');

    return true;

  }


  function closeApplicationModal() {

    if (!applicationModal || !applicationModal.open) {
      return;
    }

    applicationModal.close();

  }


  /* Open modal from application buttons */

  applicationTriggers.forEach((trigger) => {

    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-controls', 'application-modal');

    trigger.addEventListener('click', (event) => {

      if (
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      if (openApplicationModal(trigger)) {

        event.preventDefault();

      }

    });

  });


  /* Close modal from close button */

  applicationCloseButtons.forEach((button) => {

    button.addEventListener('click', closeApplicationModal);

  });


  if (applicationModal) {

    /* Restore page scrolling and focus */

    applicationModal.addEventListener('close', () => {

      document.body.classList.remove('modal-open');

      if (
        previousFocus &&
        typeof previousFocus.focus === 'function'
      ) {

        previousFocus.focus({
          preventScroll: true
        });

      }

      previousFocus = null;

    });

    /*
      The native dialog supports Escape-key closing.
      The form remains loaded if the student closes
      and reopens the modal during the same visit.
    */

  }


  /* =====================================
     KEYBOARD CONTROLS
     ===================================== */

  document.addEventListener('keydown', (event) => {

    if (event.key === 'Escape') {

      if (!applicationModal || !applicationModal.open) {

        closeMenu();

      }

    }

  });


  /* =====================================
     RESPONSIVE NAVIGATION
     ===================================== */

  window.addEventListener('resize', () => {

    if (window.innerWidth > 720) {

      closeMenu();

    }

  });


  /* =====================================
     SCROLL REVEAL ANIMATIONS
     ===================================== */

  const revealItems =
    document.querySelectorAll('.reveal');

  const reducedMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (
    'IntersectionObserver' in window &&
    !reducedMotion
  ) {

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            entry.target.classList.add('is-visible');

            currentObserver.unobserve(entry.target);

          }

        });

      },
      {
        threshold: 0.12
      }
    );

    revealItems.forEach((item) => {

      observer.observe(item);

    });

  } else {

    revealItems.forEach((item) => {

      item.classList.add('is-visible');

    });

  }

})();
