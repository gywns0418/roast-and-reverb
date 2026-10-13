package com.roastreverb.domain.monthlypick.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import com.roastreverb.global.exception.CustomException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;
import java.util.regex.Pattern;

@Service
public class MonthlyPickSourceService {
    private final ObjectMapper json;
    private final HttpClient client = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(8)).followRedirects(HttpClient.Redirect.NEVER).build();
    public MonthlyPickSourceService(ObjectMapper json) { this.json=json; }

    public static URI validateProductUrl(String value) {
        try {
            URI uri=URI.create(value);
            if (!"https".equals(uri.getScheme()) || !Set.of("unspecialty.com","www.unspecialty.com").contains(uri.getHost()) || uri.getUserInfo()!=null || uri.getPort()!=-1 || !"/product/detail.html".equals(uri.getPath()) || uri.getRawQuery()==null || !uri.getRawQuery().matches("product_no=\\d+")) throw new IllegalArgumentException();
            return URI.create("https://unspecialty.com/product/detail.html?"+uri.getRawQuery());
        } catch(Exception ex) { throw new CustomException(HttpStatus.BAD_REQUEST,"언스페셜티 상품 상세 링크를 입력해 주세요."); }
    }
    public static URI validateDataUrl(String value) {
        try {
            URI uri=URI.create(value);
            if (!"https".equals(uri.getScheme()) || !"unspecialty-community-bucket.s3.ap-northeast-2.amazonaws.com".equals(uri.getHost()) || uri.getUserInfo()!=null || uri.getPort()!=-1 || !uri.getPath().endsWith(".json")) throw new IllegalArgumentException();
            return uri;
        } catch(Exception ex) { throw new CustomException(HttpStatus.BAD_GATEWAY,"지원하지 않는 원두 자료 주소입니다."); }
    }
    private String fetch(URI uri) throws Exception {
        var response=client.send(HttpRequest.newBuilder(uri).timeout(Duration.ofSeconds(20)).header("User-Agent","RoastReverb-MonthlyCatalog/1.0").GET().build(),HttpResponse.BodyHandlers.ofString());
        if(response.statusCode()!=200 || response.body().length()>8_000_000) throw new IllegalStateException("Source unavailable");
        return response.body();
    }
    private static String match(String html,String regex) {
        var matcher=Pattern.compile(regex,Pattern.CASE_INSENSITIVE|Pattern.DOTALL).matcher(html);
        return matcher.find()?matcher.group(1):"";
    }
    public static String readQuotedAssignment(String html,String name) {
        int index=html.indexOf(name);
        if(index<0) return "";
        index=html.indexOf('=',index+name.length());
        if(index<0) return "";
        do { index++; } while(index<html.length() && Character.isWhitespace(html.charAt(index)));
        if(index>=html.length()) return "";
        char quote=html.charAt(index);
        if(quote!='\'' && quote!='"') return "";
        var out=new StringBuilder();
        while(++index<html.length()) {
            char next=html.charAt(index);
            if(next==quote) return out.toString();
            if(next=='\\') { if(++index>=html.length()) return "";out.append(html.charAt(index)); }
            else out.append(next);
        }
        return "";
    }
    public Map<String,Object> preview(String url) {
        URI product=validateProductUrl(url);
        try { return parse(fetch(product),product.toString()); }
        catch(CustomException ex) {throw ex;}
        catch(Exception ex) { if(ex instanceof InterruptedException) Thread.currentThread().interrupt(); throw new CustomException(HttpStatus.BAD_GATEWAY,"월픽 정보를 읽지 못했습니다. 저장된 자료는 유지됩니다."); }
    }
    private Map<String,Object> parse(String html,String source) throws Exception {
        String title=match(html,"<meta\\s+property=[\"']og:title[\"']\\s+content=[\"']([^\"']+)").replaceAll("\\s*-\\s*언스페셜티.*$","");
        String month=match(title,"(\\d{1,2})월\\s*커피\\s*월픽");
        String data=match(html,"<usf-general-price-list\\b[^>]*\\brel=[\"']([^\"']+)").replace("&amp;","&");
        if(month.isBlank() || data.isBlank()) throw new IllegalStateException("Not a monthly pick");
        String year=match(html,"(20\\d{2})년\\s*\\d{1,2}/");
        if(year.isBlank()) year=String.valueOf(LocalDate.now(ZoneId.of("Asia/Seoul")).getYear());
        Map<String,Object> stock=new LinkedHashMap<>();
        String decoded=readQuotedAssignment(html,"option_stock_data");
        if(!decoded.isBlank()) {
            try { stock=json.readValue(decoded,Map.class); }catch(Exception ignored) { /* Availability remains unknown. */ }
        }
        var metadata=new LinkedHashMap<String,Object>();
        metadata.put("title",title); metadata.put("month",year+"-"+String.format("%02d",Integer.parseInt(month))); metadata.put("sourceUrl",source);metadata.put("detailSourceUrl",data);
        metadata.put("roastery",title.replaceAll("^.*?월픽\\]\\s*","").replaceAll("\\s*\\(.*$","")); metadata.put("stock",stock);
        JsonNode original=json.readTree(fetch(validateDataUrl(data)));
        if(!original.path("items").isArray() || original.path("items").isEmpty()) throw new IllegalStateException("Missing beans");
        // Return factual fields only. Marketing prose, images and executable markup are omitted.
        var safe=json.createObjectNode(); safe.set("order",original.path("order")); var items=safe.putArray("items");
        for(JsonNode item:original.path("items")) {
            var out=items.addObject(); for(String key:List.of("name","nameEnglish","type","openAt","options")) if(item.has(key)) out.set(key,item.get(key));
            var heading=out.putObject("heading");heading.set("prices",item.path("heading").path("prices"));
            var detail=out.putObject("details");for(String key:List.of("specs","gauges","updatedAt")) if(item.path("details").has(key)) detail.set(key,item.path("details").get(key));
        }
        return Map.of("metadata",metadata,"data",safe);
    }
}
