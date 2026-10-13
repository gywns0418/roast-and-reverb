// The APIs default to 30 rows; archive filters and report totals need every page.
export async function listDiaryRecords(fetchPage, params = {}, paginated = import.meta.env?.VITE_USE_REAL_API === "true") {
  if (!paginated) return fetchPage(params);
  const limit = 200;
  const result = [];
  for (let offset = 0; ; offset += limit) {
    const page = await fetchPage({ ...params, limit, offset });
    result.push(...page);
    if (page.length < limit) return result;
  }
}
