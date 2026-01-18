// THEME TOGGLE & NAVBAR
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const html = document.documentElement;
const mobileNav = document.getElementById('mobileNav');
const menuBtn = document.getElementById('menuBtn');
const header = document.querySelector('header');
const scrollTopBtn = document.getElementById('scrollTopBtn');

// Remember dark mode preference
try {
  if (localStorage.getItem('theme') === 'dark') {
    html.classList.add('dark');
    if (themeIcon) {
      themeIcon.classList.replace('fa-moon', 'fa-sun');
    }
  }
} catch (e) {
  // localStorage not available - ignore
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    html.classList.toggle('dark');
    const isDark = html.classList.contains('dark');
    if (themeIcon) {
      themeIcon.classList.toggle('fa-sun', isDark);
      themeIcon.classList.toggle('fa-moon', !isDark);
    }
    try {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    } catch (e) {}
  });
}

// Mobile menu
if (menuBtn && mobileNav) {
  menuBtn.addEventListener('click', () => {
    mobileNav.classList.toggle('hidden');
  });
}

// Navbar blur on scroll
window.addEventListener('scroll', () => {
  if (!header) return;
  if (window.scrollY > 50) {
    header.classList.add('backdrop-blur-md', 'bg-white/90', 'dark:bg-gray-900/80', 'shadow-lg');
  } else {
    header.classList.remove('backdrop-blur-md', 'bg-white/90', 'dark:bg-gray-900/80', 'shadow-lg');
  }
});

// Scroll to top visibility + action
if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.remove('opacity-0', 'pointer-events-none');
    } else {
      scrollTopBtn.classList.add('opacity-0', 'pointer-events-none');
    }
  });
  scrollTopBtn.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
  );
}

// Scroll reveal
const fadeEls = document.querySelectorAll('.fade-in');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  fadeEls.forEach((el) => observer.observe(el));
} else {
  fadeEls.forEach((el) => el.classList.add('visible'));
}

// Hero parallax
const hero = document.getElementById('home');
const heroOrbs = document.querySelectorAll('.hero-orb');

if (hero && heroOrbs.length && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    heroOrbs.forEach((orb, index) => {
      const intensity = (index + 1) * 8;
      orb.style.transform = `translate(${ -x * intensity }px, ${ -y * intensity }px)`;
    });
  });

  hero.addEventListener('mouseleave', () => {
    heroOrbs.forEach((orb) => {
      orb.style.transform = 'translate(0,0)';
    });
  });
}

// Navbar active link
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a[href^="#"], #mobileNav a[href^="#"]');

function setActiveNav() {
  let currentId = null;
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 120 && rect.bottom >= 120) {
      currentId = section.id;
    }
  });
  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    const id = href ? href.slice(1) : null;
    if (id && id === currentId) {
      link.classList.add('nav-link--active');
    } else {
      link.classList.remove('nav-link--active');
    }
  });
}

window.addEventListener('scroll', setActiveNav);
window.addEventListener('load', setActiveNav);

/* Cookie consent & legal modals */
const cookieBanner = document.getElementById('cookieBanner');
const cookieAccept = document.getElementById('cookieAccept');
const cookieReject = document.getElementById('cookieReject');
const cookiePrefsModal = document.getElementById('cookiePreferencesModal');
const analyticsCheckbox = document.getElementById('cookieAnalytics');
const marketingCheckbox = document.getElementById('cookieMarketing');

const privacyModal = document.getElementById('privacyModal');
const termsModal = document.getElementById('termsModal');

const manageCookieButtons = document.querySelectorAll('[data-manage-cookies]');
const privacyButtons = document.querySelectorAll('[data-open-privacy]');
const termsButtons = document.querySelectorAll('[data-open-terms]');
const saveCookiePrefs = document.getElementById('saveCookiePrefs');

function getCookieConsent() {
  try {
    return JSON.parse(localStorage.getItem('cookieConsent')) || null;
  } catch (e) {
    return null;
  }
}

function setCookieConsent(consent) {
  try {
    localStorage.setItem('cookieConsent', JSON.stringify(consent));
  } catch (e) {}
  applyCookieConsent(consent);
}

function applyCookieConsent(consent) {
  // Hook for analytics / third-party scripts
}

function showCookieBannerIfNeeded() {
  const consent = getCookieConsent();
  if (!consent) {
    if (cookieBanner) cookieBanner.classList.remove('hidden');
  } else {
    if (cookieBanner) cookieBanner.classList.add('hidden');
    applyCookieConsent(consent);
  }
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

[cookiePrefsModal, privacyModal, termsModal].forEach((modal) => {
  if (!modal) return;
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  });
});

function openCookiePreferences() {
  const consent = getCookieConsent() || {
    necessary: true,
    analytics: false,
    marketing: false
  };
  if (analyticsCheckbox) analyticsCheckbox.checked = !!consent.analytics;
  if (marketingCheckbox) marketingCheckbox.checked = !!consent.marketing;
  openModal('cookiePreferencesModal');
}

if (cookieAccept) {
  cookieAccept.addEventListener('click', () => {
    setCookieConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    });
    if (cookieBanner) cookieBanner.classList.add('hidden');
  });
}

if (cookieReject) {
  cookieReject.addEventListener('click', () => {
    setCookieConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    });
    if (cookieBanner) cookieBanner.classList.add('hidden');
  });
}

manageCookieButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    if (cookieBanner) cookieBanner.classList.add('hidden');
    openCookiePreferences();
  });
});

if (saveCookiePrefs) {
  saveCookiePrefs.addEventListener('click', () => {
    const consent = {
      necessary: true,
      analytics: !!(analyticsCheckbox && analyticsCheckbox.checked),
      marketing: !!(marketingCheckbox && marketingCheckbox.checked),
      timestamp: new Date().toISOString()
    };
    setCookieConsent(consent);
    closeModal('cookiePreferencesModal');
  });
}

privacyButtons.forEach((btn) => {
  btn.addEventListener('click', () => openModal('privacyModal'));
});
termsButtons.forEach((btn) => {
  btn.addEventListener('click', () => openModal('termsModal'));
});

window.addEventListener('load', showCookieBannerIfNeeded);

/* Contact form handler */
const contactForm = document.getElementById('contactForm');
const formAlert = document.getElementById('formAlert');

function showAlert(message, colorClass) {
  if (!formAlert) return;
  formAlert.textContent = message;
  formAlert.className = `fixed bottom-6 right-6 px-6 py-4 rounded-lg text-white text-sm font-semibold shadow-lg z-50 ${colorClass}`;
  formAlert.classList.remove('hidden');
  setTimeout(() => {
    formAlert.classList.add('hidden');
  }, 4000);
}

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    try {
      const response = await fetch(contactForm.action, {
        method: contactForm.method,
        body: formData,
        headers: {
          Accept: 'application/json'
        }
      });
      if (response.ok) {
        showAlert('✅ Message sent successfully!', 'bg-green-600');
        contactForm.reset();
      } else {
        showAlert('❌ Something went wrong. Please try again.', 'bg-red-600');
      }
    } catch (err) {
      showAlert('⚠️ Network error. Please try again later.', 'bg-orange-500');
    }
  });
}

/* Magnetic social icons */
const magnets = document.querySelectorAll('.magnet');

magnets.forEach((magnet) => {
  magnet.addEventListener('mousemove', function (e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    this.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
  });

  magnet.addEventListener('mouseleave', function () {
    this.style.transform = 'translate(0, 0)';
  });
});
