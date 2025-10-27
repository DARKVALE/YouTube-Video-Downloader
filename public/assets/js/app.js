import { getCart } from './modules/storage.js';

const navToggle = document.querySelector('[data-nav-toggle]');
const nav = document.querySelector('[data-nav]');
const languageToggle = document.querySelector('[data-language-toggle]');
const languageMenu = document.querySelector('[data-language-menu]');
const languageFeedback = document.querySelector('[data-language-feedback]');
const newsletterForms = document.querySelectorAll('[data-newsletter-form]');
const searchForms = document.querySelectorAll('[data-search-form]');
const cartFeedback = document.querySelector('[data-cart-feedback]');
const cartCount = document.querySelector('[data-cart-count]');
const yearTarget = document.querySelector('[data-year]');

const isMobileNavOpen = () => nav?.classList.contains('is-open');

function closeNavOnEscape(event) {
  if (event.key === 'Escape' && isMobileNavOpen()) {
    nav?.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
  }
}

function toggleNav() {
  if (!nav) return;
  const expanded = nav.classList.toggle('is-open');
  navToggle?.setAttribute('aria-expanded', String(expanded));
}

function toggleLanguageMenu() {
  if (!languageMenu) return;
  const isHidden = languageMenu.hasAttribute('hidden');
  if (isHidden) {
    languageMenu.removeAttribute('hidden');
    languageToggle?.setAttribute('aria-expanded', 'true');
  } else {
    languageMenu.setAttribute('hidden', '');
    languageToggle?.setAttribute('aria-expanded', 'false');
  }
}

function hideLanguageMenu() {
  languageMenu?.setAttribute('hidden', '');
  languageToggle?.setAttribute('aria-expanded', 'false');
}

function updateLanguage(event) {
  const button = event.target.closest('button[data-locale]');
  if (!button) return;
  const label = button.textContent?.trim() ?? 'EN / USD';
  if (languageToggle) {
    languageToggle.textContent = label;
  }
  if (languageFeedback) {
    languageFeedback.textContent = `Language & currency updated to ${label}.`;
    languageFeedback.hidden = false;
    window.setTimeout(() => {
      if (languageFeedback) {
        languageFeedback.hidden = true;
        languageFeedback.textContent = '';
      }
    }, 3500);
  }
  hideLanguageMenu();
}

function updateCartCount() {
  if (!cartCount) return;
  const items = getCart();
  const quantity = items.reduce((total, item) => total + (item.quantity ?? 0), 0);
  cartCount.textContent = String(quantity);
}

function handleNewsletterSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const feedback = form.querySelector('[data-newsletter-feedback]');
  if (!feedback) return;
  feedback.textContent = 'Thanks! You\'re on the list for Nebula Dispatches.';
  feedback.hidden = false;
  form.reset();
  window.setTimeout(() => {
    feedback.hidden = true;
    feedback.textContent = '';
  }, 4000);
}

function showCartFeedback(message) {
  if (!cartFeedback) return;
  cartFeedback.textContent = message;
  cartFeedback.hidden = false;
  window.setTimeout(() => {
    if (cartFeedback) {
      cartFeedback.hidden = true;
      cartFeedback.textContent = '';
    }
  }, 4000);
}

function handleSearchSubmit(event) {
  event.preventDefault();
  if (!cartFeedback) return;
  const form = event.currentTarget;
  const input = form.querySelector('input[type="search"]');
  const query = input?.value.trim();
  const message = query
    ? `Search is simulated in this demo. Showing featured results for “${query}”.`
    : 'Search is simulated in this demo. Explore featured drops below.';
  showCartFeedback(message);
}

function initialiseGlobalUI() {
  if (yearTarget) {
    yearTarget.textContent = String(new Date().getFullYear());
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', toggleNav);
    document.addEventListener('keydown', closeNavOnEscape);
  }

  if (languageToggle && languageMenu) {
    languageToggle.addEventListener('click', toggleLanguageMenu);
    languageMenu.addEventListener('click', updateLanguage);
    document.addEventListener('click', (event) => {
      if (!languageMenu.contains(event.target) && !languageToggle.contains(event.target)) {
        hideLanguageMenu();
      }
    });
  }

  newsletterForms.forEach((form) => {
    form.addEventListener('submit', handleNewsletterSubmit);
  });

  searchForms.forEach((form) => {
    form.addEventListener('submit', handleSearchSubmit);
  });

  updateCartCount();
  document.addEventListener('cart:update', updateCartCount);
  document.addEventListener('cart:feedback', (event) => {
    if (typeof event.detail === 'string') {
      showCartFeedback(event.detail);
    }
  });
}

initialiseGlobalUI();
