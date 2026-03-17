import { useEffect, useReducer } from "react";
import { safeLocalStorage } from "./helpers";

export const useFetch = (url) => {
  const localStorage = window.localStorage;

  const initialState = {
    status: "idle",
    error: null,
    data: [],
  };

  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "FETCHING":
        return { ...initialState, status: "fetching" };
      case "FETCHED":
        return { ...initialState, status: "fetched", data: action.payload };
      case "FETCH_ERROR":
        return { ...initialState, status: "error", error: action.payload };
      default:
        return state;
    }
  }, initialState);

  useEffect(() => {
    let cancelRequest = false;
    if (!url || !url.trim()) return;

    const fetchData = async () => {
      dispatch({ type: "FETCHING" });
      
      // LOW: Fixed broken cache logic - check cache FIRST before fetching
      const cachedData = localStorage.getItem(url);
      if (cachedData) {
        try {
          const parsed = JSON.parse(cachedData);
          if (!cancelRequest) {
            dispatch({ type: "FETCHED", payload: parsed });
          }
          return;
        } catch {
          // Invalid cache data, remove it and fetch fresh
          localStorage.removeItem(url);
        }
      }

      // Fetch from network
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Store in cache using safe localStorage
        safeLocalStorage.setItem(url, data);
        
        if (!cancelRequest) {
          dispatch({ type: "FETCHED", payload: data });
        }
      } catch (error) {
        if (!cancelRequest) {
          dispatch({ type: "FETCH_ERROR", payload: error.message });
        }
      }
    };

    fetchData();

    return function cleanup() {
      cancelRequest = true;
    };
  }, [url]);

  return state;
};