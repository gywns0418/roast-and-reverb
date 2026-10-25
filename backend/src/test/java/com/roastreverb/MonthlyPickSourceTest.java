package com.roastreverb;
import org.junit.jupiter.api.Test;
import com.roastreverb.domain.monthlypick.service.MonthlyPickSourceService;
import com.roastreverb.global.exception.CustomException;
import static org.junit.jupiter.api.Assertions.*;
class MonthlyPickSourceTest {
 @Test void readsLargeEscapedStockPayloadWithoutRecursiveRegexOrScriptEvaluation() {
  String expected="{\"name\":\""+"bean".repeat(30000)+"\"}";
  String script="var option_stock_data = '"+expected.replace("\"","\\\"")+"';";
  assertEquals(expected,MonthlyPickSourceService.readQuotedAssignment(script,"option_stock_data"));
 }
 @Test void preventsRequestsToInternalOrUnapprovedHostsAndRedirectDestinations() {
  for(String url:new String[]{"http://127.0.0.1/product/detail.html?product_no=901","https://unspecialty.com.evil.test/product/detail.html?product_no=901","https://user@unspecialty.com/product/detail.html?product_no=901","https://unspecialty.com:443/product/detail.html?product_no=901","https://unspecialty.com/api/secret?product_no=901","https://unspecialty.com/product/detail.html?product_no=901&redirect=http://localhost"}) assertThrows(CustomException.class,()->MonthlyPickSourceService.validateProductUrl(url));
  assertEquals("unspecialty.com",MonthlyPickSourceService.validateProductUrl("https://unspecialty.com/product/detail.html?product_no=901").getHost());
  assertThrows(CustomException.class,()->MonthlyPickSourceService.validateDataUrl("https://127.0.0.1/data.json"));
  assertEquals("d22c6ea6lqg2pi.cloudfront.net",MonthlyPickSourceService.validateDataUrl("https://d22c6ea6lqg2pi.cloudfront.net/UNDERBEAN/UNDERBEAN.json").getHost());
  assertThrows(CustomException.class,()->MonthlyPickSourceService.validateDataUrl("https://evil.cloudfront.net/UNDERBEAN.json"));
 }
 @Test void publicFactsKeepArraysAcrossHttpSerializerAndExcludeMarketing() throws Exception {
  var jackson2=new com.fasterxml.jackson.databind.ObjectMapper();
  var original=jackson2.readTree("{\"order\":[],\"items\":[{\"name\":\"Coffee\",\"type\":\"single origin\",\"options\":[],\"image\":\"private.jpg\",\"details\":{\"specs\":[],\"blocks\":[{\"html\":\"<script>bad</script>\"}]}}]}");
  var facts=new MonthlyPickSourceService(jackson2).publicFacts(original);
  var jackson3=tools.jackson.databind.json.JsonMapper.builder().build();
  var result=jackson3.readTree(jackson3.writeValueAsString(facts));
  assertTrue(result.path("items").isArray());
  assertEquals("Coffee",result.path("items").get(0).path("name").asText());
  assertTrue(result.path("items").get(0).path("details").path("specs").isArray());
  assertFalse(result.path("items").get(0).has("image"));
  assertFalse(result.path("items").get(0).path("details").has("blocks"));
 }
}
