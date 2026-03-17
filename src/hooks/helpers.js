import { formatDistanceToNow, parseISO } from "date-fns";
import { useEffect, useState } from "react";

const localStorage = window.localStorage;

// MEDIUM: Safe localStorage utilities with validation and sanitization
const MAX_STORAGE_SIZE = 1024 * 1024; // 1MB limit
const MAX_STRING_LENGTH = 10000; // Limit string field length

// Validate and sanitize article data
const validateArticle = (article) => {
  if (!article || typeof article !== 'object') return null;
  
  const validArticle = {};
  const allowedFields = ['title', 'url', 'published', 'description', 'image', 'author', 'source'];
  
  for (const field of allowedFields) {
    if (article[field] !== undefined && article[field] !== null) {
      // Sanitize string fields
      if (typeof article[field] === 'string') {
        validArticle[field] = article[field].slice(0, MAX_STRING_LENGTH);
      } else if (typeof article[field] === 'number' || typeof article[field] === 'boolean') {
        validArticle[field] = article[field];
      }
    }
  }
  
  return Object.keys(validArticle).length > 0 ? validArticle : null;
};

// Safe localStorage operations
export const safeLocalStorage = {
  setItem: (key, value) => {
    try {
      const sanitized = JSON.stringify(value);
      // Prevent storing excessively large data
      if (sanitized.length > MAX_STORAGE_SIZE) {
        console.warn('Data too large for localStorage');
        return false;
      }
      localStorage.setItem(key, sanitized);
      return true;
    } catch (e) {
      console.error('localStorage error:', e);
      return false;
    }
  },
  getItem: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error('localStorage parse error:', e);
      localStorage.removeItem(key); // Remove corrupted data
      return null;
    }
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('localStorage remove error:', e);
      return false;
    }
  }
};

const useLocalStorage = (storageKey, fallbackState) => {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : fallbackState;
    } catch {
      return fallbackState;
    }
  });

  useEffect(() => {
    safeLocalStorage.setItem(storageKey, value);
  }, [value, storageKey]);

  return [value, setValue];
};

export const formatTime = (date) => {
  try {
    // LOW: Replaced moment.js with date-fns for smaller bundle size
    const parsedDate = parseISO(new Date(date).toISOString());
    return formatDistanceToNow(parsedDate, { addSuffix: true });
  } catch {
    return 'Unknown';
  }
};

export const sortList = (list) =>
  list.sort((a, b) => new Date(b.published) - new Date(a.published));

export const setWithExpiry = (key, value, ttl) => {
  // ttl means time to live
  const now = new Date();
  // Validate data before storing
  const sanitizedValue = Array.isArray(value) 
    ? value.map(item => validateArticle(item)).filter(Boolean)
    : value;
  
  // create local storage item with expiry time
  const item = {
    value: sanitizedValue,
    expiry: now.getTime() + ttl,
  };
  safeLocalStorage.setItem(key, item);
};

export const getWithExpiry = (key) => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) {
    return null;
  }
  try {
    const item = JSON.parse(itemStr);
    const now = new Date();
    // compare the expiry time of the item with the current time
    if (now.getTime() > item.expiry) {
      // If the item is expired, delete the item from storage and return null
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
};

export const removeAllItemsWithExpiry = () => {
  let eachitem;
  let eachkey;
  let dummyitem;

  // Loop all localStorage items that has an expiry date
  // FIXED: Use 'let' instead of 'var' for proper scoping
  for (let i = 0; i < localStorage.length; i++) {
    eachitem = localStorage.getItem(localStorage.key(i));
    eachkey = localStorage.key(i);
    // If value includes "expiry", call getWithExpiry to read it and delete if expired
    if (eachitem && eachitem.includes("expiry")) {
      // Call function to read it and delete if expired
      dummyitem = getWithExpiry(eachkey);
    }
  }
};

export default useLocalStorage;