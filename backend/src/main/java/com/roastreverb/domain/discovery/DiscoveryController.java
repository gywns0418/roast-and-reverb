package com.roastreverb.domain.discovery;
import com.roastreverb.global.response.ApiResponse;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/discovery")
public class DiscoveryController {
    private final DiscoveryMusicService music;
    public DiscoveryController(DiscoveryMusicService music){this.music=music;}
    @GetMapping("/status") public ApiResponse<?> status(){return ApiResponse.ok(music.status());}
    @GetMapping("/music/search") public ApiResponse<?> search(@RequestParam String q,@RequestParam(defaultValue="musicbrainz") String provider){return ApiResponse.ok(music.search(q,provider));}
    @GetMapping("/music/playlist") public ApiResponse<?> playlist(@RequestParam String id){return ApiResponse.ok(music.playlist(id));}
    @GetMapping("/music/video") public ApiResponse<?> video(@RequestParam String id){return ApiResponse.ok(music.video(id));}
}
