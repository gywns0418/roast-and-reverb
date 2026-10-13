package com.roastreverb.domain.discovery;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.roastreverb.global.exception.CustomException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.*;

@Service
public class DiscoveryMusicService {
    private final String youtubeKey;
    private final ObjectMapper mapper = new ObjectMapper();
    private final HttpClient client = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(6)).followRedirects(HttpClient.Redirect.NEVER).build();
    private record Cached(long created, JsonNode value) {}
    private final Map<String,Cached> cache = new LinkedHashMap<>();
    private long lastMusicBrainzRequest;
    private LocalDate quotaDate = LocalDate.now(ZoneOffset.UTC);
    private int youtubeRequests;
    public DiscoveryMusicService(@Value("${app.youtube.api-key:}") String youtubeKey) { this.youtubeKey = youtubeKey; }
    public Map<String,Object> status() {return Map.of("youtube", youtubeKey != null && !youtubeKey.isBlank(), "musicbrainz",true,"server",true);}
    public static String checkedQuery(String query) {
        if(query == null || query.isBlank() || query.length()>160) throw new CustomException(HttpStatus.BAD_REQUEST,"음악 검색어를 1~160자로 입력해 주세요.");
        return query.trim();
    }
    public static String checkedId(String id, boolean playlist) {
        if(id == null || !(playlist ? id.matches("[A-Za-z0-9_-]{10,120}") && !List.of("HL","WL").contains(id) : id.matches("[A-Za-z0-9_-]{11}"))) throw new CustomException(HttpStatus.BAD_REQUEST,"지원하는 YouTube 식별자가 아닙니다.");
        return id;
    }
    private static String encoded(String value) {return URLEncoder.encode(value,StandardCharsets.UTF_8);}
    private synchronized JsonNode get(String provider, String route) {
        var cached = cache.get(route);if(cached != null && System.currentTimeMillis()-cached.created()<Duration.ofHours(12).toMillis())return cached.value();
        if("youtube".equals(provider)) {
            if(youtubeKey == null || youtubeKey.isBlank()) throw new CustomException(HttpStatus.SERVICE_UNAVAILABLE,"YouTube API 키가 연결되지 않았습니다.");
            var today = LocalDate.now(ZoneOffset.UTC);if(!today.equals(quotaDate)){quotaDate=today;youtubeRequests=0;}
            if(youtubeRequests>=60)throw new CustomException(HttpStatus.TOO_MANY_REQUESTS,"오늘의 무료 검색 한도에 도달했습니다. 저장한 후보를 이용해 주세요.");
            youtubeRequests++;
        }
        try {
            if("musicbrainz".equals(provider)) {
                long remaining=1100-(System.currentTimeMillis()-lastMusicBrainzRequest);if(remaining>0)Thread.sleep(remaining);lastMusicBrainzRequest=System.currentTimeMillis();
            }
            String url="youtube".equals(provider) ? "https://www.googleapis.com/youtube/v3/"+route+"&key="+encoded(youtubeKey) : "https://musicbrainz.org/ws/2/"+route;
            var request = HttpRequest.newBuilder(URI.create(url)).timeout(Duration.ofSeconds(20)).header("Accept","application/json").header("User-Agent","RoastReverb/1.0 (https://github.com/gywns0418/roast-and-reverb)").GET().build();
            var response=client.send(request,HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
            if(response.statusCode() != 200 || response.body().length()>2_000_000)throw new CustomException(HttpStatus.BAD_GATEWAY,"외부 음악 정보를 가져오지 못했습니다. 재생목록의 공개 상태와 서비스 연결을 확인해 주세요.");
            var value=mapper.readTree(response.body());if(value == null || !value.path("youtube".equals(provider)?"items":"recordings").isArray())throw new CustomException(HttpStatus.BAD_GATEWAY,"외부 음악 응답 형식을 확인하지 못했습니다.");if(cache.size()>=120)cache.remove(cache.keySet().iterator().next());cache.put(route,new Cached(System.currentTimeMillis(),value));return value;
        } catch(CustomException error){throw error;} catch(InterruptedException error){Thread.currentThread().interrupt();throw new CustomException(HttpStatus.SERVICE_UNAVAILABLE,"음악 검색이 중단되었습니다.");} catch(Exception error){throw new CustomException(HttpStatus.BAD_GATEWAY,"외부 음악 서비스에 연결하지 못했습니다. 입력과 기존 후보는 유지됩니다.");}
    }
    public Map<String,Object> search(String q,String provider) {
        String query=checkedQuery(q);
        if("youtube".equals(provider)) {
            var data=get("youtube","search?part=snippet&type=video&videoCategoryId=10&maxResults=12&q="+encoded(query));
            List<String> ids=new ArrayList<>();for(var item:data.path("items"))if(item.path("id").path("videoId").asText().matches("[A-Za-z0-9_-]{11}"))ids.add(item.path("id").path("videoId").asText());
            return Map.of("items",videoRows(ids),"source","YouTube","partial",!data.path("nextPageToken").asText().isBlank());
        }
        if(!"musicbrainz".equals(provider))throw new CustomException(HttpStatus.BAD_REQUEST,"지원하지 않는 음악 검색 서비스입니다.");
        var data=get("musicbrainz","recording?fmt=json&limit=12&query="+encoded(query));
        return Map.of("items",musicBrainzRows(data),"source","MusicBrainz","partial",data.path("count").asInt()>12);
    }
    public Map<String,Object> playlist(String id) {
        var data=get("youtube","playlistItems?part=snippet,contentDetails&maxResults=50&playlistId="+encoded(checkedId(id,true)));
        List<String> ids=new ArrayList<>();for(var item:data.path("items")){String videoId=item.path("contentDetails").path("videoId").asText();if(videoId.matches("[A-Za-z0-9_-]{11}"))ids.add(videoId);}
        return Map.of("items",videoRows(ids),"source","YouTube 재생목록","partial",!data.path("nextPageToken").asText().isBlank());
    }
    public Map<String,Object> video(String id) {return Map.of("items",videoRows(List.of(checkedId(id,false))),"source","YouTube","partial",false);}
    private List<Map<String,Object>> videoRows(List<String> ids) {
        if(ids.isEmpty())return List.of();return youtubeRows(get("youtube","videos?part=snippet,contentDetails&maxResults=50&id="+encoded(String.join(",",ids))));
    }
    public static List<Map<String,Object>> youtubeRows(JsonNode root) {
        List<Map<String,Object>> rows=new ArrayList<>();for(var item:root.path("items")) {
            String id=item.path("id").asText();var snippet=item.path("snippet");if(!id.matches("[A-Za-z0-9_-]{11}") || !"10".equals(snippet.path("categoryId").asText()))continue;
            var row=new LinkedHashMap<String,Object>();row.put("id","youtube:"+id);row.put("track",snippet.path("title").asText());row.put("artist","");row.put("channel",snippet.path("channelTitle").asText());row.put("genre","");
            List<String> tags=new ArrayList<>();for(var tag:snippet.path("tags")){if(tags.size()<12)tags.add(tag.asText().substring(0,Math.min(100,tag.asText().length())));}row.put("tags",tags);row.put("source","external");row.put("metadataSource","YouTube 게시자 메타데이터");row.put("url","https://music.youtube.com/watch?v="+id);row.put("duration",item.path("contentDetails").path("duration").asText());rows.add(row);
        }return rows;
    }
    public static List<Map<String,Object>> musicBrainzRows(JsonNode root) {
        List<Map<String,Object>> rows=new ArrayList<>();for(var item:root.path("recordings")) {
            String id=item.path("id").asText();if(!id.matches("[a-fA-F0-9-]{36}"))continue;var row=new LinkedHashMap<String,Object>();row.put("id","musicbrainz:"+id);row.put("track",item.path("title").asText());
            List<String> artists=new ArrayList<>();for(var credit:item.path("artist-credit"))artists.add(credit.path("artist").path("name").asText(credit.path("name").asText()));row.put("artist",String.join(", ",artists));
            List<String> tags=new ArrayList<>();for(var tag:item.path("tags")){if(tags.size()<12)tags.add(tag.path("name").asText());}row.put("tags",tags);row.put("genre","");row.put("source","external");row.put("metadataSource","MusicBrainz 공개 메타데이터");row.put("referenceUrl","https://musicbrainz.org/recording/"+id);row.put("url","");rows.add(row);
        }return rows;
    }
}
