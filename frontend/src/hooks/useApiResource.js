import { useEffect, useState } from "react";

export function useApiResource(fetcher, fallback, deps = []) {
  const blank = value => Array.isArray(value) ? [] : value && typeof value === "object" ? Object.fromEntries(Object.entries(value).map(([key,item])=>[key,blank(item)])) : typeof value === "number" ? 0 : "";
  const [data, setData] = useState(() => blank(fallback));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);

    fetcher()
      .then((result) => {
        if(result==null)throw new Error('요청한 자료가 없습니다. 목록에서 다시 확인해 주세요.');
        if (!ignore) setData(result);
      })
      .catch((err) => {
        if (!ignore) {
          setError(err);
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, deps);

  if (error) throw error;
  return { data, loading, error };
}
