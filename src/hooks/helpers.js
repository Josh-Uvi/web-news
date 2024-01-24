import moment from "moment";
import { useEffect, useState } from "react";

const localStorage = window.localStorage;

const useLocalStorage = (storageKey, fallbackState) => {
  const [value, setValue] = useState(
    JSON.parse(localStorage.getItem(storageKey)) ?? fallbackState
  );

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(value));
  }, [value, storageKey]);

  return [value, setValue];
};

export const formatTime = (date) => {
  const newDate = new Date(date).toISOString();
  const newTime = moment(newDate).fromNow();
  return newTime;
};

export const sortList = (list) =>
  list.sort((a, b) => new Date(b.published) - new Date(a.published));

export const setWithExpiry = (key, value, ttl) => {
  // ttl means time to live
  const now = new Date();
  // create local storage item with expiry time
  const item = {
    value: value,
    expiry: now.getTime() + ttl,
  };
  localStorage.setItem(key, JSON.stringify(item));
};

export const getWithExpiry = (key) => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);
  const now = new Date();
  // compare the expiry time of the item with the current time
  if (now.getTime() > item.expiry) {
    // If the item is expired, delete the item from storage and return null
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
};

export const removeAllItemsWithExpiry = () => {
  let eachitem;
  let eachkey;
  let dummyitem;

  // Loop all localStorage items that has an expiry date
  for (var i = 0; i < localStorage.length; i++) {
    eachitem = localStorage.getItem(localStorage.key(i));
    eachkey = localStorage.key(i);
    // If value includes "expiry", call getWithExpiry to read it and delete if expired
    if (eachitem.includes("expiry")) {
      // Call function to read it and delete if expired
      dummyitem = getWithExpiry(eachkey);
    }
  }
};

export default useLocalStorage;
