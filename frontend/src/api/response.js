export async function readApiResponse(response) {
  if(response.status===204)return null;
  let payload;
  try {payload=await response.json();}catch {const error=new Error(response.ok?'서버 응답을 읽지 못했습니다. 완료 여부를 확인한 뒤 다시 시도해 주세요.':`서버 요청에 실패했습니다 (${response.status}).`);error.status=response.status;throw error;}
  if(!response.ok||payload?.success===false){const error=new Error(payload?.message||`API 요청에 실패했습니다 (${response.status}).`);error.status=response.status;throw error;}
  return payload&&typeof payload==='object'&&'data' in payload?payload.data:payload;
}
