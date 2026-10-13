import { useEffect, useState } from "react";

export function useApiResource(fetcher, fallback, deps = []) {
  const real = import.meta.env.VITE_USE_REAL_API === "true";
  const blank = value => Array.isArray(value) ? [] : value && typeof value === "object" ? Object.fromEntries(Object.entries(value).map(([key,item])=>[key,blank(item)])) : typeof value === "number" ? 0 : "";
  const [data, setData] = useState(() => real ? blank(fallback) : fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);

    fetcher()
      .then((result) => {
        if (!ignore) setData(result ?? fallback);
      })
      .catch((err) => {
        if (!ignore) {
          setError(err);
          setData(fallback);
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, deps);

  if (error && import.meta.env.VITE_USE_REAL_API === "true") throw error;
  return { data, loading, error };
}
