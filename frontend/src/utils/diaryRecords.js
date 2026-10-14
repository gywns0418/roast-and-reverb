// The APIs default to 30 rows; archive filters and report totals need every page.
export async function listDiaryRecords(fetchPage, params = {}, paginated = import.meta.env?.VITE_USE_REAL_API === "true") {
  if (!paginated) return fetchPage(params);
  const limit = 200;
  const result = [];
  for (let offset = 0; ; offset += limit) {
    const page = await fetchPage({ ...params, limit, offset });
    if(!Array.isArray(page))throw new Error('기록 목록의 응답 형식을 확인하지 못했습니다.');
    if(offset>=10000)throw new Error('기록이 너무 많습니다. 날짜 범위를 좁혀 다시 조회해 주세요.');
    result.push(...page);
    if (page.length < limit) return result;
  }
}
