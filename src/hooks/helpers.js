import { useEffect, useState } from "react";

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

export default useLocalStorage;
