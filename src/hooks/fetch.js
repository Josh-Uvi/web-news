import { useEffect, useRef, useReducer } from "react";

export const useFetch = (url) => {
  const cache = useRef({});
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

  let cacheData = initialState.data;

  useEffect(() => {
    let cancelRequest = false;
    if (!url || !url.trim()) return;

    const fetchData = async () => {
      dispatch({ type: "FETCHING" });
      if (cacheData !== null && cache.current[url]) {
        // const data = cache.current[url];
        const getItem = localStorage.getItem("@cacheData");
        cacheData = JSON.parse(getItem);
        dispatch({ type: "FETCHED", payload: cacheData });
      } else {
        try {
          const response = await fetch(url);
          const data = await response.json();
          cache.current[url] = data;
          cacheData = localStorage.setItem("@cacheData", JSON.stringify(data));
          if (cancelRequest) return;
          dispatch({ type: "FETCHED", payload: data });
        } catch (error) {
          if (cancelRequest) return;
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
