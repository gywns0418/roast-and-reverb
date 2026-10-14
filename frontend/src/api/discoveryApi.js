import { request,toQuery } from "./http.js";
import {publicMusicClient} from '../utils/publicMusicClient.js';
const real=import.meta.env.VITE_USE_REAL_API === "true";
export const discoveryApi={
  status:()=>real?request("/discovery/status").then(value=>({...value,youtubeVideo:true})):Promise.resolve({youtube:false,youtubeVideo:true,musicbrainz:true,server:false}),
  search:(q,provider)=>real?request(`/discovery/music/search${toQuery({q,provider})}`):provider==='musicbrainz'?publicMusicClient.search(q):Promise.reject(new Error("YouTube 전체 검색은 서버와 YouTube Data API 키 연결이 필요합니다. MusicBrainz 검색이나 단일 곡 링크를 이용해 주세요.")),
  playlist:(id)=>real?request(`/discovery/music/playlist${toQuery({id})}`):Promise.reject(new Error("YouTube 재생목록 자동 가져오기는 실제 서버와 API 키 연결이 필요합니다. 음악 목록을 직접 가져올 수 있습니다.")),
  video:(id,fullMetadata=false)=>real&&fullMetadata?request(`/discovery/music/video${toQuery({id})}`):publicMusicClient.video(id)
};
