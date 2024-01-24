import React, { createContext, useContext, useEffect, useState } from "react";
import useLocalStorage, {
  getWithExpiry,
  removeAllItemsWithExpiry,
  setWithExpiry,
} from "./helpers";

const PostContext = createContext();

export function PostContextProvider({ children }) {
  const [category, setCategory] = useLocalStorage("@category", "general");
  const [country, setCountry] = useLocalStorage("@country", "gb");
  const [data, setData] = useState({ articles: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const apiUrl =
    process.env.NODE_ENV !== "production"
      ? `/api?country=${country}&category=${category}`
      : `/api/news?country=${country}&category=${category}`;
  const [url, setUrl] = useState(apiUrl);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const cachedResult = getWithExpiry(url);

      try {
        if (cachedResult) {
          setData({ articles: cachedResult });
          setLoading(false);
        } else {
          const req = await fetch(url);
          const res = await req.json();
          setData({ articles: res.news });
          setWithExpiry(url, res.news, 10000); // 1770000
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        setError(error.message);
      }
      setLoading(false);
    };

    fetchData();

    //  Periodically refresh current cache(url) after ttl
    const refreshStore = setInterval(() => {
      fetchData();
    }, 1800000); //   30mins

    // Periodically remove all cache(url) with ttl
    const resetStore = setInterval(() => {
      removeAllItemsWithExpiry();
      fetchData();
    }, 43200000); // 12hrs

    return () => {
      clearInterval(refreshStore);
      clearInterval(resetStore);
    };
  }, [url]);

  return (
    <PostContext.Provider
      value={{
        category,
        country,
        data,
        loading,
        error,
        setData,
        setUrl,
        setCountry,
        setCategory,
        setError,
        setLoading,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}

export function usePost() {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error("Context must be used within a Provider");
  }
  return context;
}
