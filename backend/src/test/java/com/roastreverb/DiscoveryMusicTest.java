package com.roastreverb;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.roastreverb.domain.discovery.DiscoveryMusicService;
import com.roastreverb.global.exception.CustomException;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
class DiscoveryMusicTest {
 @Test void unavailableYoutubeAndUnsafeInputsFailExplicitly() {
  var service=new DiscoveryMusicService("");
  assertEquals(false,service.status().get("youtube"));
  assertThrows(CustomException.class,()->service.video("abcdefghijk"));
  assertThrows(CustomException.class,()->DiscoveryMusicService.checkedId("../../private",true));
  assertThrows(CustomException.class,()->service.search(" ","musicbrainz"));
  assertThrows(CustomException.class,()->service.search("test","unknown"));
 }
 @Test void publisherChannelDoesNotBecomeArtistOrInventGenre() throws Exception {
  var json=new ObjectMapper().readTree("{\"items\":[{\"id\":\"abcdefghijk\",\"snippet\":{\"title\":\"Test\",\"categoryId\":\"10\",\"channelTitle\":\"Publisher\"}}]}");
  var row=DiscoveryMusicService.youtubeRows(json).get(0);
  assertEquals("",row.get("artist"));assertEquals("",row.get("genre"));assertEquals("Publisher",row.get("channel"));
 }
}
