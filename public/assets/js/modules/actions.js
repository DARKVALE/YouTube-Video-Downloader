import { PRODUCTS } from '../data/products.js';
import { getCart, setCart, getWishlist, setWishlist } from './storage.js';

function findProduct(productId) {
  return PRODUCTS.find((product) => product.id === productId);
}

function dispatchCartUpdate(message) {
  document.dispatchEvent(new CustomEvent('cart:update'));
  if (message) {
    document.dispatchEvent(
      new CustomEvent('cart:feedback', {
        detail: message
      })
    );
  }
}

export function addToCart(productId, quantity = 1) {
  const product = findProduct(productId);
  if (!product) {
    console.warn('Unknown product', productId);
    return;
  }
  const cart = getCart();
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ id: productId, quantity });
  }
  setCart(cart);
  dispatchCartUpdate(`${product.name} added to your cart.`);
}

export function updateCartQuantity(productId, action) {
  const cart = getCart();
  const item = cart.find((entry) => entry.id === productId);
  if (!item) return;
  if (action === 'increase') {
    item.quantity += 1;
  } else if (action === 'decrease') {
    item.quantity = Math.max(1, item.quantity - 1);
  }
  setCart(cart);
  dispatchCartUpdate();
}

export function removeFromCart(productId) {
  const cart = getCart().filter((item) => item.id !== productId);
  setCart(cart);
  const product = findProduct(productId);
  dispatchCartUpdate(product ? `${product.name} removed from cart.` : undefined);
}

export function toggleWishlist(productId) {
  const product = findProduct(productId);
  if (!product) return;
  const wishlist = getWishlist();
  const index = wishlist.indexOf(productId);
  if (index >= 0) {
    wishlist.splice(index, 1);
    setWishlist([...wishlist]);
    document.dispatchEvent(
      new CustomEvent('wishlist:update', {
        detail: {
          productId,
          action: 'removed'
        }
      })
    );
    document.dispatchEvent(
      new CustomEvent('cart:feedback', {
        detail: `${product.name} removed from wishlist.`
      })
    );
  } else {
    wishlist.push(productId);
    setWishlist(wishlist);
    document.dispatchEvent(
      new CustomEvent('wishlist:update', {
        detail: {
          productId,
          action: 'added'
        }
      })
    );
    document.dispatchEvent(
      new CustomEvent('cart:feedback', {
        detail: `${product.name} saved to wishlist.`
      })
    );
  }
}

export function moveWishlistItemToCart(productId) {
  const wishlist = getWishlist().filter((id) => id !== productId);
  setWishlist(wishlist);
  addToCart(productId, 1);
  document.dispatchEvent(
    new CustomEvent('wishlist:update', {
      detail: {
        productId,
        action: 'moved'
      }
    })
  );
}

export function getProduct(productId) {
  return findProduct(productId);
}

export function getRelatedProducts(productId, limit = 3) {
  const product = findProduct(productId);
  if (!product) return PRODUCTS.slice(0, limit);
  const matches = PRODUCTS.filter((item) => item.id !== productId && item.category === product.category);
  if (matches.length >= limit) {
    return matches.slice(0, limit);
  }
  return [...matches, ...PRODUCTS.filter((item) => item.id !== productId && matches.indexOf(item) === -1)].slice(0, limit);
}

export function getProductsByFilter({ categories = [], collections = [], price = null } = {}) {
  return PRODUCTS.filter((product) => {
    const categoryMatch = categories.length === 0 || categories.includes(product.category);
    const collectionMatch =
      collections.length === 0 || collections.some((collection) => product.collections?.includes(collection));
    let priceMatch = true;
    if (price) {
      if (price === '0-100') priceMatch = product.price < 100;
      if (price === '100-300') priceMatch = product.price >= 100 && product.price <= 300;
      if (price === '300-600') priceMatch = product.price > 300 && product.price <= 600;
      if (price === '600+') priceMatch = product.price > 600;
    }
    return categoryMatch && collectionMatch && priceMatch;
  });
}

export function getProductsByCollection(collection) {
  return PRODUCTS.filter((product) => product.collections?.includes(collection));
}

export function getAllProducts() {
  return [...PRODUCTS];
}
