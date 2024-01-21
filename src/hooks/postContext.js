import React, { createContext, useContext, useEffect, useState } from "react";
import useLocalStorage from "./helpers";

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
      const cachedResult = JSON.parse(localStorage.getItem(url));

      let result;

      if (cachedResult) {
        result = cachedResult;
        setData({ articles: result.news });
      } else {
        try {
          const response = await fetch(url);
          result = await response.json();
          console.log("data: ", result);
          localStorage.setItem(url, JSON.stringify(result));
          setData({ articles: result.news });
          setLoading(false);
        } catch (error) {
          setError(error.message);
        }
      }
    };

    fetchData();
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
