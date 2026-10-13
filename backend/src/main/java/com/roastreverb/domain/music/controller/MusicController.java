package com.roastreverb.domain.music.controller;

import com.roastreverb.domain.music.service.DiscogsService;
import com.roastreverb.domain.music.service.LastfmService;
import com.roastreverb.domain.music.service.MusicService;
import com.roastreverb.global.response.ApiResponse;
import com.roastreverb.global.security.SecurityUtil;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping({"/api/music-logs", "/api/music"})
public class MusicController {
    private static final Long DEFAULT_MEMBER_ID = 1L;

    private final MusicService musicService;
    private final LastfmService lastfmService;
    private final DiscogsService discogsService;

    public MusicController(MusicService musicService, LastfmService lastfmService, DiscogsService discogsService) {
        this.musicService = musicService;
        this.lastfmService = lastfmService;
        this.discogsService = discogsService;
    }

    @GetMapping
    public ApiResponse<?> findAll(@RequestParam(defaultValue = "1") Long memberId,
                                  @RequestParam(required = false) String keyword,
                                  @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
                                  @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
                                  @RequestParam(defaultValue = "30") int limit,
                                  @RequestParam(defaultValue = "0") int offset) {
        return ApiResponse.ok(musicService.findAll(memberId, keyword, from, to, limit, offset));
    }

    @GetMapping("/{musicLogId}")
    public ApiResponse<?> findById(@PathVariable Long musicLogId,
                                   @RequestParam(defaultValue = "1") Long memberId) {
        return ApiResponse.ok(musicService.findById(memberId, musicLogId));
    }

    @PostMapping
    public ApiResponse<?> create(@RequestBody Map<String, Object> musicLog) {
        musicLog.put("memberId", SecurityUtil.currentMemberId(DEFAULT_MEMBER_ID));
        return ApiResponse.ok(musicService.create(musicLog));
    }

    @PutMapping("/{musicLogId}")
    public ApiResponse<?> update(@PathVariable Long musicLogId,
                                 @RequestParam(defaultValue = "1") Long memberId,
                                 @RequestBody Map<String, Object> musicLog) {
        return ApiResponse.ok(Map.of("updated", musicService.update(memberId, musicLogId, musicLog)));
    }

    @DeleteMapping("/{musicLogId}")
    public ApiResponse<?> delete(@PathVariable Long musicLogId,
                                 @RequestParam(defaultValue = "1") Long memberId) {
        return ApiResponse.ok(Map.of("deleted", musicService.delete(memberId, musicLogId)));
    }

    @GetMapping("/tags/recent")
    public ApiResponse<?> recentTags(@RequestParam(defaultValue = "1") Long memberId,
                                     @RequestParam(defaultValue = "12") int limit) {
        return ApiResponse.ok(musicService.findRecentTags(memberId, limit));
    }

    @GetMapping("/search/lastfm")
    public ApiResponse<?> searchLastfm(@RequestParam String keyword) {
        return ApiResponse.ok(lastfmService.searchTrack(keyword));
    }

    @GetMapping("/search/discogs")
    public ApiResponse<?> searchDiscogs(@RequestParam String keyword) {
        return ApiResponse.ok(discogsService.searchRelease(keyword));
    }
}
