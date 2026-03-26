"use client";

import { useDeferredValue, useState } from "react";

export function useDeferredSearch(initialValue = "") {
  const [query, setQuery] = useState(initialValue);
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  return {
    query,
    setQuery,
    deferredQuery,
  };
}
