import { getProductsByFilter, addToCart, toggleWishlist } from './modules/actions.js';
import { createProductCard } from './modules/templates.js';

const productGrid = document.querySelector('[data-product-grid]');
const resultsCount = document.querySelector('[data-results-count]');
const activeFiltersSummary = document.querySelector('[data-active-filters]');
const filterForm = document.querySelector('[data-filter-form]');
const filterToggle = document.querySelector('[data-filter-toggle]');
const filtersPanel = document.querySelector('[data-filters]');
const resetFiltersButton = document.querySelector('[data-reset-filters]');
const sortSelect = document.querySelector('[data-sort]');
const viewButtons = document.querySelectorAll('[data-view]');

function readFiltersFromForm() {
  const formData = filterForm ? new FormData(filterForm) : new FormData();
  const categories = formData.getAll('category');
  const collections = formData.getAll('collection');
  const price = formData.get('price');
  return { categories, collections, price: price === 'all' ? null : price };
}

function getPresetFilters() {
  const params = new URLSearchParams(window.location.search);
  const categories = params.getAll('category');
  const collection = params.get('collection');
  return {
    categories,
    collections: collection ? [collection] : params.getAll('collection'),
    price: params.get('price')
  };
}

function applyPresetFilters() {
  if (!filterForm) return;
  const presets = getPresetFilters();
  const categoryInputs = filterForm.querySelectorAll('input[name="category"]');
  categoryInputs.forEach((input) => {
    input.checked = presets.categories.includes(input.value);
  });
  const collectionInputs = filterForm.querySelectorAll('input[name="collection"]');
  collectionInputs.forEach((input) => {
    input.checked = presets.collections.includes(input.value);
  });
  if (presets.price) {
    const priceInput = filterForm.querySelector(`input[name="price"][value="${presets.price}"]`);
    if (priceInput) priceInput.checked = true;
  }
}

function sortProducts(products) {
  const value = sortSelect?.value ?? 'recommended';
  if (value === 'price-low') {
    return [...products].sort((a, b) => a.price - b.price);
  }
  if (value === 'price-high') {
    return [...products].sort((a, b) => b.price - a.price);
  }
  if (value === 'newest') {
    return [...products].reverse();
  }
  return products;
}

function renderProducts() {
  if (!productGrid) return;
  const filters = readFiltersFromForm();
  let products = getProductsByFilter(filters);
  products = sortProducts(products);
  productGrid.innerHTML = '';
  if (products.length === 0) {
    productGrid.innerHTML = '<div class="catalog-empty">No products found. Please adjust your filters.</div>';
  } else {
    products.forEach((product) => {
      const card = createProductCard(product);
      productGrid.appendChild(card);
    });
  }
  if (resultsCount) {
    resultsCount.textContent = String(products.length);
  }
  if (activeFiltersSummary) {
    const summaryParts = [];
    if (filters.categories.length) {
      summaryParts.push(`Categories: ${filters.categories.join(', ')}`);
    }
    if (filters.collections.length) {
      summaryParts.push(`Collections: ${filters.collections.join(', ')}`);
    }
    if (filters.price) {
      summaryParts.push(`Price: ${filters.price}`);
    }
    activeFiltersSummary.textContent = summaryParts.join(' · ');
  }
}

function toggleFiltersPanel() {
  if (!filtersPanel) return;
  const isHidden = filtersPanel.hasAttribute('hidden');
  if (isHidden) {
    filtersPanel.removeAttribute('hidden');
    filterToggle?.setAttribute('aria-expanded', 'true');
  } else {
    filtersPanel.setAttribute('hidden', '');
    filterToggle?.setAttribute('aria-expanded', 'false');
  }
}

function handleGridClick(event) {
  const card = event.target.closest('.product-card');
  if (!card) return;
  const productId = card.dataset.productId;
  if (!productId) return;
  if (event.target.matches('[data-add-to-cart]')) {
    addToCart(productId, 1);
  }
  if (event.target.matches('[data-toggle-wishlist]')) {
    toggleWishlist(productId);
  }
}

function updateView(view) {
  productGrid?.setAttribute('data-view', view);
  viewButtons.forEach((button) => {
    button.classList.toggle('is-active', button.dataset.view === view);
  });
}

function initCatalog() {
  applyPresetFilters();
  renderProducts();
  updateView('grid');

  productGrid?.addEventListener('click', handleGridClick);
  filterForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    renderProducts();
  });
  resetFiltersButton?.addEventListener('click', () => {
    window.setTimeout(renderProducts, 0);
  });
  filterToggle?.addEventListener('click', toggleFiltersPanel);
  sortSelect?.addEventListener('change', renderProducts);
  viewButtons.forEach((button) => {
    button.addEventListener('click', () => updateView(button.dataset.view ?? 'grid'));
  });
}

initCatalog();
