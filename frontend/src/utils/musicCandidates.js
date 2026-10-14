export function parseMusicLink(value) {
  let url;try{url=new URL(value);}catch{throw new Error("YouTube 또는 YouTube Music 링크를 입력해 주세요.");}
  if(url.protocol!=="https:" || url.username || url.password || url.port || !["youtube.com","www.youtube.com","music.youtube.com","youtu.be"].includes(url.hostname))throw new Error("지원하는 HTTPS YouTube 링크가 아닙니다.");
  const playlist=url.searchParams.get("list");let video=url.hostname==="youtu.be"?url.pathname.slice(1):url.searchParams.get("v");
  if(!video&&url.pathname.startsWith("/shorts/"))video=url.pathname.split("/")[2];
  if(/^[A-Za-z0-9_-]{11}$/.test(video||"")&&url.pathname!=="/playlist")return {kind:"video",id:video,url:`https://music.youtube.com/watch?v=${video}`};
  if(playlist){if(!/^[A-Za-z0-9_-]{10,120}$/.test(playlist)||["HL","WL"].includes(playlist))throw new Error("공개 재생목록 링크를 입력해 주세요.");return {kind:"playlist",id:playlist,url:`https://www.youtube.com/playlist?list=${playlist}`};}
  if(!/^[A-Za-z0-9_-]{11}$/.test(video||""))throw new Error("곡 또는 재생목록 링크를 확인해 주세요.");
  return {kind:"video",id:video,url:`https://music.youtube.com/watch?v=${video}`};
}
export function musicSearchLink(song) {return `https://music.youtube.com/search?q=${encodeURIComponent([song.artist,song.track].filter(Boolean).join(" "))}`;}
export function safeMusicUrl(value) {try{const parsed=parseMusicLink(value);return parsed.kind==="video"?parsed.url:null;}catch{return null;}}
export function parseMusicLines(value) {
  const songs=[];for(const line of String(value).split(/\r?\n/).filter(x=>x.trim()).slice(0,100)) {
    const fields=line.split("\t");if(fields.length<2)throw new Error("아티스트, 곡명, 장르, 링크를 탭으로 구분한 목록을 넣어 주세요.");
    const [artist,track,genre="",url=""]=fields.map(x=>x.trim());if(!artist||!track)continue;
    if(url&&!safeMusicUrl(url))throw new Error("지원하지 않는 음악 링크가 있습니다. YouTube 곡 링크를 확인해 주세요.");
    songs.push({id:`manual:${artist.toLowerCase()}|${track.toLowerCase()}`,artist,track,genre,tags:[],url:url?safeMusicUrl(url):"",source:"playlist",metadataSource:"직접 가져온 음악 목록"});
  }
  if(!songs.length)throw new Error("추가할 곡이 없습니다.");return songs;
}
export function dedupeMusic(previous,incoming) {const map=new Map(previous.map(item=>[item.id,item]));for(const item of incoming)map.set(item.id,item);return [...map.values()];}
export function mergeMusic(previous,incoming) {const values=dedupeMusic(previous,incoming);if(values.length>250)throw new Error("음악 후보는 최대 250곡입니다. 기존 후보를 백업한 뒤 정리해 주세요.");return values;}
