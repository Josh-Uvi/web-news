import React, { createContext, useContext } from "react";
import useLocalStorage from "./helpers";
import { useQuery } from "@tanstack/react-query";

const PostContext = createContext();

export function PostContextProvider({ children }) {
  const [category, setCategory] = useLocalStorage("@category", "general");
  const [country, setCountry] = useLocalStorage("@country", "gb");
  const url =
    process.env.NODE_ENV !== "production"
      ? `/api?country=${country}&category=${category}`
      : `/api/news?country=${country}&category=${category}`;

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["@news", { country, category }],
    queryFn: async () => {
      try {
        const req = await fetch(url);
        if (!req.ok) {
          throw new Error("Failed to fetch!");
        }
        const res = await req.json();
        return res.news;
      } catch (err) {
        throw new Error(err.message);
      }
    },
  });

  return (
    <PostContext.Provider
      value={{
        data,
        loading: isPending,
        isError,
        error,
        category,
        country,
        setCountry,
        setCategory,
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
