import {parseMusicLink,safeMusicUrl} from './musicCandidates.js';
export function playlistLink(value){parseMusicLink(value);const u=new URL(value);const id=u.searchParams.get('list');if(['HL','WL','LM'].includes(id))throw new Error('공개 또는 일부 공개로 만든 재생목록을 연결해 주세요.');return parseMusicLink(new URL('/playlist?list='+encodeURIComponent(id||''),u.origin).href);}
export function personalMusic(records,candidates,defaults=[]){
 const known=new Map(defaults.map(x=>[`${x.artist}|${x.track}`,x]));const map=new Map();
 for(const song of [...records,...candidates]){if(!song||typeof song.track!=='string'||!song.track.trim())continue;const match=known.get(`${song.artist}|${song.track}`);const url=safeMusicUrl(song.url||song.raw?.url||match?.url);const key=url||`${song.artist}|${song.track}`;map.set(key,{...match,...song,id:`personal:${key}`,url:url||'',metadataSource:'내가 보관한 음악',caption:'내 음악 보관함에서 가져온 곡'});}
 return [...map.values()].slice(0,60);
}
