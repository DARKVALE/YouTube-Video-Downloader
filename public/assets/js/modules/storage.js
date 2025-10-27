const STORAGE_KEYS = {
  cart: 'nebula-cart',
  wishlist: 'nebula-wishlist',
  addresses: 'nebula-addresses',
  preferences: 'nebula-preferences'
};

function safeParse(value, fallback) {
  if (!value) {
    return fallback;
  }
  try {
    return JSON.parse(value);
  } catch (error) {
    console.warn('Failed to parse stored value', error);
    return fallback;
  }
}

function safeStringify(value) {
  try {
    return JSON.stringify(value);
  } catch (error) {
    console.warn('Failed to serialise value', error);
    return null;
  }
}

function readStorage(key, fallback) {
  try {
    const value = window.localStorage.getItem(key);
    return safeParse(value, fallback);
  } catch (error) {
    console.warn('Unable to access localStorage', error);
    return fallback;
  }
}

function writeStorage(key, value) {
  const serialised = safeStringify(value);
  if (serialised === null) {
    return;
  }
  try {
    window.localStorage.setItem(key, serialised);
  } catch (error) {
    console.warn('Unable to write to localStorage', error);
  }
}

export function getCart() {
  return readStorage(STORAGE_KEYS.cart, []);
}

export function setCart(items) {
  writeStorage(STORAGE_KEYS.cart, items);
}

export function getWishlist() {
  return readStorage(STORAGE_KEYS.wishlist, []);
}

export function setWishlist(items) {
  writeStorage(STORAGE_KEYS.wishlist, items);
}

export function getAddresses() {
  return readStorage(STORAGE_KEYS.addresses, []);
}

export function setAddresses(addresses) {
  writeStorage(STORAGE_KEYS.addresses, addresses);
}

export function getPreferences() {
  return readStorage(STORAGE_KEYS.preferences, {
    email: true,
    sms: false,
    community: true
  });
}

export function setPreferences(preferences) {
  writeStorage(STORAGE_KEYS.preferences, preferences);
}

export function resetDemo() {
  Object.values(STORAGE_KEYS).forEach((key) => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.warn('Unable to clear storage', error);
    }
  });
}
