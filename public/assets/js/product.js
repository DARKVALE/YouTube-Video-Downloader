import { addToCart, toggleWishlist, getProduct, getRelatedProducts } from './modules/actions.js';
import { createProductCard, formatCurrency } from './modules/templates.js';

const galleryContainer = document.querySelector('[data-product-gallery]');
const summaryContainer = document.querySelector('[data-product-summary]');
const specsContainer = document.querySelector('[data-product-specs]');
const relatedGrid = document.querySelector('[data-related-grid]');

function getProductId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id') ?? 'quantum-kit';
}

function renderGallery(product) {
  if (!galleryContainer) return;
  galleryContainer.innerHTML = '';
  const images = product.gallery?.length ? product.gallery : [product.image];
  images.forEach((src, index) => {
    const figure = document.createElement('figure');
    figure.innerHTML = `<img src="${src}" alt="${product.name} view ${index + 1}" loading="lazy" />`;
    galleryContainer.appendChild(figure);
  });
}

function renderSummary(product) {
  if (!summaryContainer) return;
  summaryContainer.innerHTML = `
    <p class="tag">${product.badges?.[0] ?? 'Nebula Exclusive'}</p>
    <h1>${product.name}</h1>
    <p>${product.description}</p>
    <div class="product-summary__price">
      ${formatCurrency(product.price)}
      <span>Tax included · Free global shipping</span>
    </div>
    <form data-product-form>
      <label for="product-size">Select size</label>
      <select id="product-size" name="size" required>
        <option value="" disabled selected>Choose an option</option>
        <option value="xs">XS</option>
        <option value="s">S</option>
        <option value="m">M</option>
        <option value="l">L</option>
        <option value="xl">XL</option>
      </select>
      <label for="product-quantity">Quantity</label>
      <input id="product-quantity" name="quantity" type="number" min="1" value="1" />
      <div class="product-summary__actions">
        <button class="button" type="submit">Add to cart</button>
        <button class="button button--ghost" type="button" data-product-wishlist>
          <span aria-hidden="true">♡</span> Wishlist
        </button>
      </div>
    </form>
  `;
}

function renderSpecs(product) {
  if (!specsContainer) return;
  specsContainer.innerHTML = '';
  if (product.features?.length) {
    const article = document.createElement('article');
    article.innerHTML = `
      <h3>Highlights</h3>
      <ul>
        ${product.features.map((feature) => `<li>${feature}</li>`).join('')}
      </ul>
    `;
    specsContainer.appendChild(article);
  }
  if (product.specs?.length) {
    const article = document.createElement('article');
    article.innerHTML = `
      <h3>Specifications</h3>
      <ul>
        ${product.specs.map((item) => `<li>${item}</li>`).join('')}
      </ul>
    `;
    specsContainer.appendChild(article);
  }
}

function renderRelated(productId) {
  if (!relatedGrid) return;
  relatedGrid.innerHTML = '';
  const related = getRelatedProducts(productId, 3);
  related.forEach((product) => {
    const card = createProductCard(product, { showSummary: false });
    relatedGrid.appendChild(card);
  });
}

function initProductPage() {
  const productId = getProductId();
  const product = getProduct(productId);
  if (!product) {
    summaryContainer.innerHTML = '<p>Product not found. Please return to the <a href="./catalog.html">catalog</a>.</p>';
    return;
  }
  renderGallery(product);
  renderSummary(product);
  renderSpecs(product);
  renderRelated(productId);

  summaryContainer?.addEventListener('submit', (event) => {
    if (!(event.target instanceof HTMLFormElement)) return;
    event.preventDefault();
    const formData = new FormData(event.target);
    const quantity = Number.parseInt(formData.get('quantity'), 10) || 1;
    addToCart(productId, quantity);
    event.target.reset();
  });

  summaryContainer?.addEventListener('click', (event) => {
    if (event.target.matches('[data-product-wishlist]')) {
      toggleWishlist(productId);
    }
  });

  relatedGrid?.addEventListener('click', (event) => {
    const card = event.target.closest('.product-card');
    if (!card) return;
    const relatedId = card.dataset.productId;
    if (!relatedId) return;
    if (event.target.matches('[data-add-to-cart]')) {
      addToCart(relatedId, 1);
    }
    if (event.target.matches('[data-toggle-wishlist]')) {
      toggleWishlist(relatedId);
    }
  });
}

initProductPage();
