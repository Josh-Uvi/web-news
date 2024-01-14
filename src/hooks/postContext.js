import React, { createContext, useContext, useEffect, useState } from "react";
import useLocalStorage from "./localStorage";

const apiKey = process.env.API_KEY;
export const API_ENDPOINT = `https://api.currentsapi.services/v1/latest-news?apiKey=${apiKey}&country=`;

const PostContext = createContext();

export function PostContextProvider({ children }) {
  const [category, setCategory] = useLocalStorage("@category", "general");
  const [country, setCountry] = useLocalStorage("@country", "gb");

  const [data, setData] = useState({ articles: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [url, setUrl] = useState(
    `${API_ENDPOINT}${country}&category=${category}`
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const cachedResult = JSON.parse(localStorage.getItem(url));

      let result;

      if (cachedResult) {
        result = cachedResult;
      } else {
        const response = await fetch(url);
        result = await response.json();
        localStorage.setItem(url, JSON.stringify(result));
      }

      setData({ articles: result.news });
      setLoading(false);
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
