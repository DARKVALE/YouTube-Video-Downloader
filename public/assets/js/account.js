import { getWishlist, getAddresses, setAddresses, getPreferences, setPreferences, resetDemo } from './modules/storage.js';
import { getProduct, addToCart, toggleWishlist } from './modules/actions.js';
import { createWishlistItem, createAddressItem } from './modules/templates.js';

const wishlistContainer = document.querySelector('[data-wishlist]');
const addressForm = document.querySelector('[data-address-form]');
const addressList = document.querySelector('[data-address-list]');
const addressFeedback = document.querySelector('[data-address-feedback]');
const preferencesForm = document.querySelector('[data-preferences-form]');
const preferencesFeedback = document.querySelector('[data-preferences-feedback]');
const loyaltyFeedback = document.querySelector('[data-loyalty-feedback]');
const redeemButton = document.querySelector('[data-redeem]');
const signOutButton = document.querySelector('[data-signout]');

function showFeedback(target, message) {
  if (!target) return;
  target.textContent = message;
  target.hidden = false;
  window.setTimeout(() => {
    if (target) {
      target.hidden = true;
      target.textContent = '';
    }
  }, 3500);
}

function renderWishlist() {
  if (!wishlistContainer) return;
  const wishlist = getWishlist();
  wishlistContainer.innerHTML = '';
  if (wishlist.length === 0) {
    wishlistContainer.innerHTML = '<li>No saved items yet. Explore the <a href="./catalog.html">marketplace</a>.</li>';
    return;
  }
  wishlist.forEach((productId) => {
    const product = getProduct(productId);
    if (!product) return;
    const item = createWishlistItem(product);
    wishlistContainer.appendChild(item);
  });
}

function renderAddresses() {
  if (!addressList) return;
  const addresses = getAddresses();
  addressList.innerHTML = '';
  if (addresses.length === 0) {
    addressList.innerHTML = '<li>No addresses saved yet.</li>';
    return;
  }
  addresses.forEach((address) => {
    const item = createAddressItem(address);
    addressList.appendChild(item);
  });
}

function handleAddressSubmit(event) {
  event.preventDefault();
  if (!addressForm) return;
  const data = Object.fromEntries(new FormData(addressForm).entries());
  const addresses = getAddresses();
  addresses.push(data);
  setAddresses(addresses);
  addressForm.reset();
  renderAddresses();
  showFeedback(addressFeedback, 'Address saved.');
}

function handleAddressActions(event) {
  if (!addressList) return;
  if (!event.target.matches('[data-remove-address]')) return;
  const item = event.target.closest('li');
  if (!item) return;
  const index = Array.from(addressList.children).indexOf(item);
  const addresses = getAddresses();
  addresses.splice(index, 1);
  setAddresses(addresses);
  renderAddresses();
  showFeedback(addressFeedback, 'Address removed.');
}

function handleWishlistActions(event) {
  const productId = event.target.closest('li')?.dataset.productId;
  if (!productId) return;
  if (event.target.matches('[data-move-to-cart]')) {
    addToCart(productId, 1);
    toggleWishlist(productId);
  }
}

function renderPreferences() {
  if (!preferencesForm) return;
  const preferences = getPreferences();
  Object.entries(preferences).forEach(([key, value]) => {
    const input = preferencesForm.querySelector(`input[name="${key}"]`);
    if (input) {
      input.checked = Boolean(value);
    }
  });
}

function handlePreferencesSubmit(event) {
  event.preventDefault();
  if (!preferencesForm) return;
  const formData = new FormData(preferencesForm);
  const preferences = {
    email: formData.get('email') === 'on',
    sms: formData.get('sms') === 'on',
    community: formData.get('community') === 'on'
  };
  setPreferences(preferences);
  showFeedback(preferencesFeedback, 'Preferences updated.');
}

function handleRedeem() {
  showFeedback(loyaltyFeedback, 'Rewards redeemed! A 15% credit is now available at checkout.');
}

function handleSignOut() {
  resetDemo();
  showFeedback(loyaltyFeedback, 'Signed out. Storage cleared for demo purposes.');
  renderWishlist();
  renderAddresses();
  renderPreferences();
}

function initAccount() {
  renderWishlist();
  renderAddresses();
  renderPreferences();
  addressForm?.addEventListener('submit', handleAddressSubmit);
  addressList?.addEventListener('click', handleAddressActions);
  wishlistContainer?.addEventListener('click', handleWishlistActions);
  preferencesForm?.addEventListener('submit', handlePreferencesSubmit);
  redeemButton?.addEventListener('click', handleRedeem);
  signOutButton?.addEventListener('click', handleSignOut);
  document.addEventListener('wishlist:update', renderWishlist);
}

initAccount();
