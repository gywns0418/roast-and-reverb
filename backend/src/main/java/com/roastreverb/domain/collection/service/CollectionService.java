package com.roastreverb.domain.collection.service;

import com.roastreverb.domain.collection.mapper.CollectionMapper;
import org.springframework.stereotype.Service;
import com.roastreverb.global.exception.CustomException;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Map;

@Service
public class CollectionService {
    private final CollectionMapper collectionMapper;
    private final com.roastreverb.domain.pairing.mapper.PairingMapper pairings;

    public CollectionService(CollectionMapper collectionMapper,com.roastreverb.domain.pairing.mapper.PairingMapper pairings) {
        this.collectionMapper = collectionMapper;
        this.pairings=pairings;
    }
    private void checkPairing(Map<String,Object> value){Object id=value.get("linkedPairingId");if(id==null)return;try{if(pairings.findById(Long.valueOf(id.toString()),((Number)value.get("memberId")).longValue())!=null)return;}catch(NumberFormatException ignored){}throw new CustomException(HttpStatus.BAD_REQUEST,"본인의 페어링만 연결할 수 있습니다.");}

    public List<Map<String, Object>> findAll(Long memberId, String format, String keyword) {
        return collectionMapper.findAll(memberId, format, keyword);
    }

    public Map<String, Object> findById(Long memberId, Long collectionId) {
        var record = collectionMapper.findById(collectionId, memberId);
        if (record == null) throw new CustomException(HttpStatus.NOT_FOUND, "기록을 찾을 수 없습니다.");
        return record;
    }

    public Map<String, Object> create(Map<String, Object> collection) {
        checkPairing(collection);
        collectionMapper.insert(collection);
        return collection;
    }

    public int update(Long memberId, Long collectionId, Map<String, Object> collection) {
        collection.put("memberId", memberId);
        collection.put("collectionId", collectionId);
        checkPairing(collection);
        return collectionMapper.update(collection);
    }

    public int delete(Long memberId, Long collectionId) {
        return collectionMapper.delete(collectionId, memberId);
    }
}
