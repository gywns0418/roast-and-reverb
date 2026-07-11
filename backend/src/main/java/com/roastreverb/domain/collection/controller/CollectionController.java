package com.roastreverb.domain.collection.controller;

import com.roastreverb.domain.collection.service.CollectionService;
import com.roastreverb.global.response.ApiResponse;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping({"/api/collections", "/api/collection"})
public class CollectionController {
    private static final Long DEFAULT_MEMBER_ID = 1L;

    private final CollectionService collectionService;

    public CollectionController(CollectionService collectionService) {
        this.collectionService = collectionService;
    }

    @GetMapping
    public ApiResponse<?> findAll(@RequestParam(defaultValue = "1") Long memberId,
                                  @RequestParam(required = false) String format,
                                  @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(collectionService.findAll(memberId, format, keyword));
    }

    @GetMapping("/{collectionId}")
    public ApiResponse<?> findById(@PathVariable Long collectionId,
                                   @RequestParam(defaultValue = "1") Long memberId) {
        return ApiResponse.ok(collectionService.findById(memberId, collectionId));
    }

    @PostMapping
    public ApiResponse<?> create(@RequestBody Map<String, Object> collection) {
        collection.putIfAbsent("memberId", DEFAULT_MEMBER_ID);
        return ApiResponse.ok(collectionService.create(collection));
    }

    @PutMapping("/{collectionId}")
    public ApiResponse<?> update(@PathVariable Long collectionId,
                                 @RequestParam(defaultValue = "1") Long memberId,
                                 @RequestBody Map<String, Object> collection) {
        return ApiResponse.ok(Map.of("updated", collectionService.update(memberId, collectionId, collection)));
    }

    @DeleteMapping("/{collectionId}")
    public ApiResponse<?> delete(@PathVariable Long collectionId,
                                 @RequestParam(defaultValue = "1") Long memberId) {
        return ApiResponse.ok(Map.of("deleted", collectionService.delete(memberId, collectionId)));
    }
}
