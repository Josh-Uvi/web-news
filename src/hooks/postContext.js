import React, { createContext, useContext, useState } from "react";
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
    queryKey: ["@articles", { country, category }],
    queryFn: async () => {
      const req = await fetch(url);
      const res = await req.json();
      if (!req.ok) {
        throw new Error("Failed to fetch!");
      }
      return res.news;
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
