(() => {
      const menuButton = document.querySelector('.menu-toggle');
      const navigation = document.querySelector('#primary-navigation');
      const navLinks = navigation.querySelectorAll('a');

      function closeMenu() {
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Open navigation');
        navigation.classList.remove('is-open');
        document.body.classList.remove('menu-open');
      }

      menuButton.addEventListener('click', () => {
        const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
        menuButton.setAttribute('aria-expanded', String(!isOpen));
        menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
        navigation.classList.toggle('is-open', !isOpen);
        document.body.classList.toggle('menu-open', !isOpen);
      });

      navLinks.forEach((link) => link.addEventListener('click', closeMenu));
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeMenu();
      });

      const revealItems = document.querySelectorAll('.reveal');
      if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const observer = new IntersectionObserver((entries, currentObserver) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              currentObserver.unobserve(entry.target);
            }
          });
        }, { threshold: 0.12 });
        revealItems.forEach((item) => observer.observe(item));
      } else {
        revealItems.forEach((item) => item.classList.add('is-visible'));
      }
    })();
