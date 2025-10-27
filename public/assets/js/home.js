import { getProductsByCollection, addToCart, toggleWishlist } from './modules/actions.js';
import { createProductCard } from './modules/templates.js';

const featuredGrid = document.querySelector('[data-featured-grid]');

function renderFeaturedProducts() {
  if (!featuredGrid) return;
  const products = getProductsByCollection('featured').slice(0, 4);
  featuredGrid.innerHTML = '';
  products.forEach((product) => {
    const card = createProductCard(product);
    featuredGrid.appendChild(card);
  });
}

function handleFeaturedInteractions(event) {
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

function initHome() {
  renderFeaturedProducts();
  featuredGrid?.addEventListener('click', handleFeaturedInteractions);
}

initHome();
