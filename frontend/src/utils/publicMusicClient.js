const MBID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const string=(value,max=200)=>typeof value==='string'?value.slice(0,max):'';
export function musicBrainzRows(data) {
  if(!data||!Array.isArray(data.recordings)||data.recordings.length>100)throw new Error('MusicBrainz 응답 형식을 확인하지 못했습니다.');
  const rows=new Map();
  for(const item of data.recordings) {
    if(!item||typeof item.id!=='string'||!MBID.test(item.id)||!string(item.title).trim())continue;
    const artist=Array.isArray(item['artist-credit'])?item['artist-credit'].map(credit=>string(credit?.name||credit?.artist?.name)+string(credit?.joinphrase,30)).join('').slice(0,200):'';
    rows.set(item.id,{id:`musicbrainz:${item.id}`,track:string(item.title),artist,genre:'',tags:Array.isArray(item.tags)?item.tags.map(tag=>string(tag?.name,100)).filter(Boolean).slice(0,12):[],source:'external',metadataSource:'MusicBrainz 공개 메타데이터',referenceUrl:`https://musicbrainz.org/recording/${item.id}`,url:''});
  }
  return [...rows.values()];
}
export function youtubeEmbedRow(id,data) {
  if(!/^[A-Za-z0-9_-]{11}$/.test(id)||!data||data.provider_name!=='YouTube'||data.type!=='video'||!string(data.title).trim()||!string(data.author_name).trim())throw new Error('YouTube 공개 정보를 확인하지 못했습니다.');
  // Publisher title is not verified track metadata; never inject oEmbed HTML.
  return {id:`youtube:${id}`,track:string(data.title),artist:'',channel:string(data.author_name),genre:'',tags:[],url:`https://music.youtube.com/watch?v=${id}`,source:'external',metadataSource:'YouTube 공개 영상 제목·채널 (곡 정보 미확인)'};
}
export function createPublicMusicClient({fetcher=globalThis.fetch,now=Date.now,wait=ms=>new Promise(resolve=>setTimeout(resolve,ms)),locks=globalThis.navigator?.locks}={}) {
  const cache=new Map();let queue=Promise.resolve();
  async function download(url) {
    const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),15000);
    try {
      const response=await fetcher(url,{signal:controller.signal,credentials:'omit',referrerPolicy:'strict-origin-when-cross-origin',headers:{Accept:'application/json'}});
      if(!response.ok)throw new Error(response.status===404?'공개 영상 또는 음악 정보를 찾지 못했습니다.':response.status===429||response.status===503?'음악 서비스가 바쁩니다. 잠시 뒤 다시 시도해 주세요.':'외부 음악 정보를 가져오지 못했습니다.');
      const text=await response.text();if(text.length>2_000_000)throw new Error('음악 응답이 너무 큽니다.');
      return JSON.parse(text);
    } catch(error) {
      if(error.name==='AbortError')throw new Error('음악 정보 조회 시간이 초과됐습니다. 입력과 기존 후보는 유지됩니다.');
      if(error instanceof TypeError)throw new Error('음악 서비스에 연결하지 못했습니다. 네트워크나 브라우저 차단을 확인해 주세요.');
      if(error instanceof SyntaxError)throw new Error('음악 서비스의 응답 형식이 올바르지 않습니다.');
      throw error;
    } finally {clearTimeout(timeout);}
  }
  function cached(key,task) {
    const entry=cache.get(key);if(entry&&now()-entry.time<300000)return entry.promise;
    const promise=task().catch(error=>{if(cache.get(key)?.promise===promise)cache.delete(key);throw error;});
    if(cache.size>=40)cache.delete(cache.keys().next().value);
    cache.set(key,{time:now(),promise});return promise;
  }
  return {
    search(query) {
      if(typeof query!=='string'||!query.trim()||query.length>160)return Promise.reject(new Error('검색어를 1~160자로 입력해 주세요.'));
      query=query.trim();return cached(`mb:${query}`,()=>{
        const run=async()=>{
          // Web Locks coordinate tabs; the pause also spaces calls from separate client instances.
          await wait(1100);
          const data=await download(`https://musicbrainz.org/ws/2/recording/?fmt=json&limit=12&query=${encodeURIComponent(query)}`);
          return {items:musicBrainzRows(data),source:'MusicBrainz',partial:Number(data.count)>12};
        };
        const execute=()=>locks?.request?locks.request('rr-musicbrainz-read',run):run();
        const result=queue.then(execute,execute);queue=result.catch(()=>{});return result;
      });
    },
    video(id) {
      if(typeof id!=='string'||!/^[A-Za-z0-9_-]{11}$/.test(id))return Promise.reject(new Error('YouTube 곡 링크를 확인해 주세요.'));
      return cached(`yt:${id}`,async()=>({items:[youtubeEmbedRow(id,await download(`https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}&format=json`))],source:'YouTube 공개 영상 정보',partial:false}));
    },
  };
}
export const publicMusicClient=createPublicMusicClient();
