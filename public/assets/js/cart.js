import { getCart } from './modules/storage.js';
import { getProduct, updateCartQuantity, removeFromCart } from './modules/actions.js';
import { createCartItem, formatCurrency } from './modules/templates.js';

const cartItemsContainer = document.querySelector('[data-cart-items]');
const subtotalField = document.querySelector('[data-cart-subtotal]');
const shippingField = document.querySelector('[data-cart-shipping]');
const taxField = document.querySelector('[data-cart-tax]');
const totalField = document.querySelector('[data-cart-total]');
const promoForm = document.querySelector('[data-promo-form]');
const promoFeedback = document.querySelector('[data-promo-feedback]');
const checkoutButton = document.querySelector('[data-checkout]');
const checkoutFeedback = document.querySelector('[data-checkout-feedback]');

let discountRate = 0;

function calculateTotals() {
  const cart = getCart();
  let subtotal = 0;
  cart.forEach((item) => {
    const product = getProduct(item.id);
    if (!product) return;
    subtotal += product.price * item.quantity;
  });
  const discount = subtotal * discountRate;
  subtotal -= discount;
  const shipping = subtotal > 150 ? 0 : subtotal === 0 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (subtotalField) subtotalField.textContent = formatCurrency(subtotal);
  if (shippingField) shippingField.textContent = formatCurrency(shipping);
  if (taxField) taxField.textContent = formatCurrency(tax);
  if (totalField) totalField.textContent = formatCurrency(total);
}

function renderCart() {
  if (!cartItemsContainer) return;
  const cart = getCart();
  cartItemsContainer.innerHTML = '';
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="catalog-empty">Your cart is empty. Explore the <a href="./catalog.html">marketplace</a>.</p>';
  } else {
    cart.forEach((item) => {
      const product = getProduct(item.id);
      if (!product) return;
      const cartItem = createCartItem(product, item);
      cartItemsContainer.appendChild(cartItem);
    });
  }
  calculateTotals();
}

function handleCartInteraction(event) {
  const item = event.target.closest('.cart-item');
  if (!item) return;
  const productId = item.dataset.productId;
  if (!productId) return;
  if (event.target.matches('[data-qty]')) {
    updateCartQuantity(productId, event.target.getAttribute('data-qty'));
    renderCart();
  }
  if (event.target.matches('[data-remove]')) {
    removeFromCart(productId);
    renderCart();
  }
}

function handlePromoSubmit(event) {
  event.preventDefault();
  if (!promoForm || !promoFeedback) return;
  const code = new FormData(promoForm).get('promo');
  if (typeof code === 'string' && code.trim().toUpperCase() === 'NEBULA10') {
    discountRate = 0.1;
    promoFeedback.textContent = 'Promo applied! 10% off eligible items.';
    promoFeedback.hidden = false;
  } else {
    discountRate = 0;
    promoFeedback.textContent = 'Code not recognised. Try NEBULA10.';
    promoFeedback.hidden = false;
  }
  calculateTotals();
  window.setTimeout(() => {
    if (promoFeedback) {
      promoFeedback.hidden = true;
      promoFeedback.textContent = '';
    }
  }, 4000);
}

function handleCheckout() {
  if (!checkoutFeedback) return;
  if (getCart().length === 0) {
    checkoutFeedback.textContent = 'Your cart is empty. Add items before checking out.';
  } else {
    checkoutFeedback.textContent = 'Demo checkout initiated! In production this would redirect to secure payment.';
  }
  checkoutFeedback.hidden = false;
  window.setTimeout(() => {
    if (checkoutFeedback) {
      checkoutFeedback.hidden = true;
      checkoutFeedback.textContent = '';
    }
  }, 4000);
}

function initCart() {
  renderCart();
  cartItemsContainer?.addEventListener('click', handleCartInteraction);
  promoForm?.addEventListener('submit', handlePromoSubmit);
  checkoutButton?.addEventListener('click', handleCheckout);
  document.addEventListener('cart:update', renderCart);
}

initCart();
