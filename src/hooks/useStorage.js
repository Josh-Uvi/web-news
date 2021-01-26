import React, { useEffect, useState } from 'react';

function useLocalStorage(key, initialValue) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

export const useStorage = (key, initialValue) => {
  const [localValue, setlocalValue] = useState(() => {
    const localData = localStorage.getItem(key);
    return localData === null ? initialValue : JSON.parse(localData);
  });

  useEffect(() => {
    const listener = (e) => {
      if (e.storageArea === localStorage && e.key === key) {
        setlocalValue(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', listener);

    return () => {
      window.removeEventListener('storage', listener);
    };
  }, [key]);

  const setStorageValue = (newValue) => {
    setlocalValue((currentValue) => {
      const result =
        typeof newValue === 'function' ? newValue(currentValue) : newValue;
      localStorage.setItem(key, JSON.stringify(result));
      return result;
    });
  };

  const removeValue = () => {
    const removeItem = localStorage.removeItem(key);
    console.log('item deleted from local storage', removeItem);
    return removeItem;
  };

  return [localValue, setStorageValue];
};

// export const useLocalStorage = (key, initialValue) => {
//   return useStorage(key, initialValue, window.localStorage);
// };

// export default useLocalStorage;
