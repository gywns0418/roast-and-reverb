package com.roastreverb.domain.collection.service;

import com.roastreverb.domain.collection.mapper.CollectionMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class CollectionService {
    private final CollectionMapper collectionMapper;

    public CollectionService(CollectionMapper collectionMapper) {
        this.collectionMapper = collectionMapper;
    }

    public List<Map<String, Object>> findAll(Long memberId, String format, String keyword) {
        return collectionMapper.findAll(memberId, format, keyword);
    }

    public Map<String, Object> findById(Long memberId, Long collectionId) {
        return collectionMapper.findById(collectionId, memberId);
    }

    public Map<String, Object> create(Map<String, Object> collection) {
        collectionMapper.insert(collection);
        return collection;
    }

    public int update(Long memberId, Long collectionId, Map<String, Object> collection) {
        collection.put("memberId", memberId);
        collection.put("collectionId", collectionId);
        return collectionMapper.update(collection);
    }

    public int delete(Long memberId, Long collectionId) {
        return collectionMapper.delete(collectionId, memberId);
    }
}
