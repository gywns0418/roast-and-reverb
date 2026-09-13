import { useEffect, useState } from "react";

export function useApiResource(fetcher, fallback, deps = []) {
  const [data, setData] = useState(fallback);
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

  return { data, loading, error };
}
