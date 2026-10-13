import { request,toQuery } from "./http.js";
const real=import.meta.env.VITE_USE_REAL_API === "true";
export const discoveryApi={
  status:()=>real?request("/discovery/status"):Promise.resolve({youtube:false,musicbrainz:false,server:false}),
  search:(q,provider)=>real?request(`/discovery/music/search${toQuery({q,provider})}`):Promise.reject(new Error("외부 음악 검색은 실제 서버 연결 후 사용할 수 있습니다. 곡 링크나 음악 목록을 후보에 추가해 주세요.")),
  playlist:(id)=>real?request(`/discovery/music/playlist${toQuery({id})}`):Promise.reject(new Error("YouTube 재생목록 자동 가져오기는 실제 서버와 API 키 연결이 필요합니다. 음악 목록을 직접 가져올 수 있습니다.")),
  video:(id)=>real?request(`/discovery/music/video${toQuery({id})}`):Promise.reject(new Error("링크의 자동 곡 정보 조회는 실제 서버 연결이 필요합니다. 곡명과 아티스트를 함께 입력해 주세요."))
};
