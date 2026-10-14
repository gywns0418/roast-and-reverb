export const DIARY_KEY = 'roast-reverb-demo-v1';
export const diaryTables = {coffeeLogs:'coffeeLogId',musicLogs:'musicLogId',pairings:'pairingId',collections:'collectionId',monthlyPicks:'monthly_pick_id'};
export function validateDiary(value) {
  if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('기록장 자료 형식이 올바르지 않습니다.');
  const result={};
  for(const [name,id] of Object.entries(diaryTables)) {
    const rows=value[name];
    if(!Array.isArray(rows)||rows.length>10000||rows.some(row=>!row||!Number.isSafeInteger(row[id])||row[id]<=0)||new Set(rows.map(row=>row[id])).size!==rows.length)throw new Error(`${name} 기록 자료가 손상되었습니다. 기존 자료를 백업한 후 복구해 주세요.`);
    result[name]=rows;
  }
  return result;
}
