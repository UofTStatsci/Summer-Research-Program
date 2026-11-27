
(() => {

  /* =====================================
     MOBILE NAVIGATION
     ===================================== */

  const menuButton =
    document.querySelector('.menu-toggle');

  const navigation =
    document.querySelector('#primary-navigation');


  function closeMenu() {

    if (!menuButton || !navigation) return;

    menuButton.setAttribute('aria-expanded', 'false');

    menuButton.setAttribute(
      'aria-label',
      'Open navigation'
    );

    navigation.classList.remove('is-open');

    document.body.classList.remove('menu-open');

  }


  if (menuButton && navigation) {

    const navLinks =
      navigation.querySelectorAll('a');

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

      document.body.classList.toggle(
        'menu-open',
        !isOpen
      );

    });


    navLinks.forEach((link) => {

      link.addEventListener('click', closeMenu);

    });

  }


  /* =====================================
     MODAL ELEMENTS
     ===================================== */

  const applicationModal =
    document.querySelector('#application-modal');

  const applicationForm =
    document.querySelector('#application-form');

  const posterModal =
    document.querySelector('#poster-modal');

  const posterFrame =
    document.querySelector('#poster-frame');

  const posterTitle =
    document.querySelector('#poster-modal-title');

  const posterPdfLink =
    document.querySelector('#poster-pdf-link');


  let previousApplicationFocus = null;

  let previousPosterFocus = null;


  /* =====================================
     SHARED MODAL HELPERS
     ===================================== */

  function updateScrollLock() {

    const modalIsOpen = Boolean(
      (applicationModal && applicationModal.open) ||
      (posterModal && posterModal.open)
    );

    document.body.classList.toggle(
      'modal-open',
      modalIsOpen
    );

  }


  function restoreFocus(element) {

    if (
      element &&
      element.isConnected &&
      typeof element.focus === 'function'
    ) {

      element.focus({
        preventScroll: true
      });

    }

  }


  function modifiedClick(event) {

    return (
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    );

  }


  /* =====================================
     OPTIONAL GOOGLE ANALYTICS TRACKING
     ===================================== */

  function trackEvent(eventName, parameters = {}) {

    if (typeof window.gtag === 'function') {

      window.gtag(
        'event',
        eventName,
        parameters
      );

    }

  }


  /* =====================================
     APPLICATION REQUEST MODAL
     ===================================== */

  const applicationTriggers =
    document.querySelectorAll(
      '[data-open-application]'
    );

  const applicationCloseButtons =
    document.querySelectorAll(
      '[data-close-application]'
    );


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


    if (posterModal && posterModal.open) {

      return false;

    }


    const mobileNavigationTrigger =
      trigger &&
      navigation &&
      navigation.contains(trigger) &&
      window.matchMedia('(max-width: 720px)').matches;


    previousApplicationFocus =
      mobileNavigationTrigger
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

    updateScrollLock();


    trackEvent('application_package_open', {

      program: 'UTSSRP',

      program_year: 2027,

      trigger_text: trigger
        ? trigger.textContent.trim()
        : 'Application request'

    });


    return true;

  }


  function closeApplicationModal() {

    if (
      !applicationModal ||
      !applicationModal.open
    ) {

      return;

    }

    applicationModal.close();

  }


  applicationTriggers.forEach((trigger) => {

    trigger.setAttribute(
      'aria-haspopup',
      'dialog'
    );

    trigger.setAttribute(
      'aria-controls',
      'application-modal'
    );


    trigger.addEventListener('click', (event) => {

      if (modifiedClick(event)) {

        return;

      }

      if (openApplicationModal(trigger)) {

        event.preventDefault();

      }

    });

  });


  applicationCloseButtons.forEach((button) => {

    button.addEventListener(
      'click',
      closeApplicationModal
    );

  });


  if (applicationModal) {

    applicationModal.addEventListener('close', () => {

      updateScrollLock();

      restoreFocus(previousApplicationFocus);

      previousApplicationFocus = null;

    });

  }


  /* =====================================
     RESEARCH POSTER MODAL
     ===================================== */

  const posterTriggers =
    document.querySelectorAll(
      '[data-open-poster]'
    );

  const posterCloseButtons =
    document.querySelectorAll(
      '[data-close-poster]'
    );


  function openPosterModal(trigger) {

    if (
      !posterModal ||
      !posterFrame ||
      typeof posterModal.showModal !== 'function'
    ) {

      return false;

    }


    if (
      applicationModal &&
      applicationModal.open
    ) {

      return false;

    }


    if (posterModal.open) {

      return true;

    }


    const pdfUrl =
      trigger.getAttribute('href');

    const researchTitle =
      trigger.dataset.posterTitle ||
      'Undergraduate research poster';


    if (!pdfUrl) {

      return false;

    }


    previousPosterFocus =
      trigger || document.activeElement;


    closeMenu();


    /* Update the poster heading */

    if (posterTitle) {

      posterTitle.textContent =
        researchTitle;

    }


    /* Update the fallback PDF link */

    if (posterPdfLink) {

      posterPdfLink.setAttribute(
        'href',
        pdfUrl
      );

    }


    /* Load the selected PDF */

    posterFrame.setAttribute(
      'title',
      researchTitle + ' — Research poster PDF'
    );

    posterFrame.setAttribute(
      'src',
      pdfUrl + '#view=FitH'
    );


    /* Open the blurred-background modal */

    posterModal.showModal();

    updateScrollLock();


    /* Track poster interest if GA4 is configured */

    trackEvent('research_poster_open', {

      program: 'UTSSRP',

      research_year: 2026,

      poster_title: researchTitle,

      poster_url: pdfUrl

    });


    return true;

  }


  function closePosterModal() {

    if (
      !posterModal ||
      !posterModal.open
    ) {

      return;

    }

    posterModal.close();

  }


  /* Open poster when a research card is selected */

  posterTriggers.forEach((trigger) => {

    trigger.setAttribute(
      'aria-haspopup',
      'dialog'
    );

    trigger.setAttribute(
      'aria-controls',
      'poster-modal'
    );


    trigger.addEventListener('click', (event) => {

      if (modifiedClick(event)) {

        return;

      }

      if (openPosterModal(trigger)) {

        event.preventDefault();

      }

    });

  });


  /* Close poster from the close button */

  posterCloseButtons.forEach((button) => {

    button.addEventListener(
      'click',
      closePosterModal
    );

  });


  if (posterModal) {

    posterModal.addEventListener('close', () => {

      /* Unload the PDF when the viewer closes */

      if (posterFrame) {

        posterFrame.setAttribute(
          'src',
          'about:blank'
        );

      }


      if (posterPdfLink) {

        posterPdfLink.removeAttribute('href');

      }


      updateScrollLock();

      restoreFocus(previousPosterFocus);

      previousPosterFocus = null;

    });

  }


  /* =====================================
     KEYBOARD CONTROLS
     ===================================== */

  document.addEventListener('keydown', (event) => {

    if (event.key !== 'Escape') {

      return;

    }


    /*
      Native HTML dialogs handle Escape
      when focus is within the dialog.
    */

    if (
      (applicationModal && applicationModal.open) ||
      (posterModal && posterModal.open)
    ) {

      return;

    }

    closeMenu();

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
    window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;


  if (
    'IntersectionObserver' in window &&
    !reducedMotion
  ) {

    const observer = new IntersectionObserver(

      (entries, currentObserver) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            entry.target.classList.add(
              'is-visible'
            );

            entry.target.classList.remove(
              'reveal-pending'
            );

            currentObserver.unobserve(
              entry.target
            );

          }

        });

      },

      {
        threshold: 0.12
      }

    );


    revealItems.forEach((item) => {

      item.classList.add('reveal-pending');

      observer.observe(item);

    });

  } else {

    revealItems.forEach((item) => {

      item.classList.add('is-visible');

    });

  }

})();
