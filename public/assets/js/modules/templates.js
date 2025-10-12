export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

export function createProductCard(product, options = {}) {
  const { showSummary = true, includeActions = true } = options;
  const article = document.createElement('article');
  article.className = 'product-card';
  article.dataset.productId = product.id;
  const badges = product.badges?.map((badge) => `<span class="product-card__badge">${badge}</span>`).join('') ?? '';
  article.innerHTML = `
    <img src="${product.image}" alt="${product.name}" loading="lazy" />
    <div class="product-card__meta">
      <div>
        <h3>${product.name}</h3>
        <p class="product-card__badge-wrapper">${badges}</p>
      </div>
      <span>${formatCurrency(product.price)}</span>
    </div>
    ${
      showSummary
        ? `<p>${product.summary ?? product.description ?? ''}</p>`
        : ''
    }
  `;

  if (includeActions) {
    const actions = document.createElement('div');
    actions.className = 'product-card__actions';
    actions.innerHTML = `
      <button class="button" type="button" data-add-to-cart>Add to cart</button>
      <a class="button button--ghost" href="./product.html?id=${product.id}">Quick view</a>
      <button class="button button--ghost" type="button" data-toggle-wishlist>
        <span aria-hidden="true">♡</span> Wishlist
      </button>
    `;
    article.appendChild(actions);
  }

  return article;
}

export function createCartItem(product, item) {
  const container = document.createElement('article');
  container.className = 'cart-item';
  container.dataset.productId = product.id;
  container.innerHTML = `
    <div class="cart-item__header">
      <div>
        <h3>${product.name}</h3>
        <p>${product.summary ?? product.description ?? ''}</p>
      </div>
      <strong>${formatCurrency(product.price * item.quantity)}</strong>
    </div>
    <div class="cart-item__controls">
      <button type="button" data-qty="decrease" aria-label="Decrease quantity">-</button>
      <span>${item.quantity}</span>
      <button type="button" data-qty="increase" aria-label="Increase quantity">+</button>
      <button type="button" class="button button--ghost" data-remove>Remove</button>
    </div>
  `;
  return container;
}

export function createWishlistItem(product) {
  const item = document.createElement('li');
  item.dataset.productId = product.id;
  item.innerHTML = `
    <span>${product.name}</span>
    <div>
      <span>${formatCurrency(product.price)}</span>
      <button class="button button--ghost" type="button" data-move-to-cart>Move to cart</button>
    </div>
  `;
  return item;
}

export function createAddressItem(address) {
  const item = document.createElement('li');
  item.innerHTML = `
    <div>
      <strong>${address.name}</strong>
      <p>${address.address}<br />${address.city}, ${address.postal}</p>
    </div>
    <button class="button button--ghost" type="button" data-remove-address>Remove</button>
  `;
  return item;
}
