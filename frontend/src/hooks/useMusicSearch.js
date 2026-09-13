import { useState } from "react";
import { musicApi } from "../api/musicApi.js";
import { adaptMusicLog } from "../api/adapters.js";
import { musicLogs as fallbackLogs } from "../data/sampleData.js";

export function useMusicSearch(initialKeyword = "") {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [results, setResults] = useState(fallbackLogs.map(adaptMusicLog));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function search(nextKeyword = keyword) {
    setKeyword(nextKeyword);
    setLoading(true);
    setError(null);
    try {
      const items = await musicApi.list({ keyword: nextKeyword });
      const mapped = items.map(adaptMusicLog);
      setResults(mapped);
      return mapped;
    } catch (err) {
      setError(err);
      const fallback = fallbackLogs.map(adaptMusicLog);
      setResults(fallback);
      return fallback;
    } finally {
      setLoading(false);
    }
  }

  return { keyword, setKeyword, results, loading, error, search };
}
