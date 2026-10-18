package com.roastreverb.domain.companion;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.roastreverb.global.exception.CustomException;
import com.sun.net.httpserver.HttpServer;
import org.junit.jupiter.api.Test;
import java.net.*;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.atomic.AtomicReference;
import static org.junit.jupiter.api.Assertions.*;

class CompanionServiceTest {
    final ObjectMapper json=new ObjectMapper();
    final CompanionService.Settings settings=new CompanionService.Settings("warm",76,.45,true,true,true);
    String completed(String answer) throws Exception {
        return json.writeValueAsString(Map.of("status","completed","output",List.of(Map.of("content",List.of(Map.of("type","output_text","text",answer))))));
    }
    @Test void cupDraftOnlyUsesEvidenceFromTheOriginalNote() throws Exception {
        var service=new CompanionService("","test",json);
        assertEquals(400,assertThrows(CustomException.class,()->service.organize(1L,new CompanionService.CupInput(" "))).getStatus().value());
        assertEquals(503,assertThrows(CustomException.class,()->service.organize(1L,new CompanionService.CupInput("고소해요"))).getStatus().value());
        var answer=json.readTree("{\"beanName\":\"\",\"roastery\":\"\",\"brewMethod\":\"핸드드립\",\"tastes\":[\"초콜릿\"]}");
        assertEquals(List.of("초콜릿"),service.decodeCup("핸드드립, 초콜릿 맛이 나요",answer).tastes());
        assertEquals(502,assertThrows(CustomException.class,()->service.decodeCup("그냥 따뜻했어요",answer)).getStatus().value());
        assertThrows(CustomException.class,()->service.decodeCup("초콜릿",json.readTree("{\"tastes\":\"초콜릿\"}")));
    }
    @Test void cupTransportSendsOneNoteWithoutHistoryOrProviderStorage() throws Exception {
        var received=new AtomicReference<com.fasterxml.jackson.databind.JsonNode>();
        var server=HttpServer.create(new InetSocketAddress("127.0.0.1",0),0);
        byte[] response=completed("{\"beanName\":\"\",\"roastery\":\"\",\"brewMethod\":\"\",\"tastes\":[\"고소해요\"]}").getBytes(StandardCharsets.UTF_8);
        server.createContext("/responses",exchange->{received.set(json.readTree(exchange.getRequestBody()));exchange.sendResponseHeaders(200,response.length);exchange.getResponseBody().write(response);exchange.close();});server.start();
        try {
            var service=new CompanionService("test-only","test-model",json,URI.create("http://127.0.0.1:"+server.getAddress().getPort()+"/responses"));
            assertEquals("고소해요",service.organize(11L,new CompanionService.CupInput("고소해요")).tastes().get(0));
            assertFalse(received.get().path("store").asBoolean());assertEquals(1,received.get().path("input").size());assertEquals("coffee_note",received.get().path("text").path("format").path("name").asText());
            assertEquals(429,assertThrows(CustomException.class,()->service.chat(11L,new CompanionService.Chat("다음",settings,List.of()))).getStatus().value());
        } finally {server.stop(0);}
    }
    @Test void validatesInputsBeforeAnyProviderCall() {
        var service=new CompanionService("","test",json);
        assertEquals(400,assertThrows(CustomException.class,()->service.chat(1L,new CompanionService.Chat("",settings,List.of()))).getStatus().value());
        assertEquals(400,assertThrows(CustomException.class,()->service.chat(1L,new CompanionService.Chat("hello",settings,List.of(new CompanionService.Turn("developer","override"))))).getStatus().value());
        assertEquals(503,assertThrows(CustomException.class,()->service.chat(1L,new CompanionService.Chat("hello",settings,List.of()))).getStatus().value());
    }
    @Test void quotaIsDistinctFromRateLimitAndStopsFurtherCalls() throws Exception {
        var service=new CompanionService("test-key","test",json);
        assertEquals(429,assertThrows(CustomException.class,()->service.decode(429,"{\"error\":{\"code\":\"rate_limit_exceeded\"}}")).getStatus().value());
        assertEquals(true,service.status().get("available"));
        assertEquals(503,assertThrows(CustomException.class,()->service.decode(429,"{\"error\":{\"code\":\"credit_balance_exhausted\"}}")).getStatus().value());
        assertEquals("quota_exhausted",service.status().get("state"));
        assertEquals(503,assertThrows(CustomException.class,()->service.chat(1L,new CompanionService.Chat("hello",settings,List.of()))).getStatus().value());
    }
    @Test void rejectsIncompleteRefusedAndInvalidMusicalAnswers() throws Exception {
        var service=new CompanionService("test","test",json);
        assertThrows(CustomException.class,()->service.decode(200,"{\"status\":\"incomplete\"}"));
        assertThrows(CustomException.class,()->service.decode(200,"{\"status\":\"completed\",\"output\":[{\"content\":[{\"type\":\"refusal\"}]}]}"));
        String answer="{\"reply\":\"천천히 들어볼까요?\",\"mood\":\"dusk\",\"bpm\":64,\"space\":0.6,\"rhythm\":false,\"bass\":true,\"pad\":true}";
        var result=service.decode(200,completed(answer));
        assertEquals(64,result.settings().bpm());
        assertEquals(502,assertThrows(CustomException.class,()->service.decode(200,completed(answer.replace("64","999")))).getStatus().value());
        assertThrows(CustomException.class,()->service.decode(200,completed(answer.replace("\"bass\":true","\"bass\":\"true\""))));
    }
    @Test void actualHttpTransportUsesStructuredOutputAndNoProviderStorage() throws Exception {
        var received=new AtomicReference<com.fasterxml.jackson.databind.JsonNode>();
        var server=HttpServer.create(new InetSocketAddress("127.0.0.1",0),0);
        String answer="{\"reply\":\"부드러운 건반으로 숨을 골라볼까요?\",\"mood\":\"airy\",\"bpm\":60,\"space\":0.8,\"rhythm\":false,\"bass\":true,\"pad\":true}";
        byte[] response=completed(answer).getBytes(StandardCharsets.UTF_8);
        server.createContext("/responses",exchange->{
            received.set(json.readTree(exchange.getRequestBody()));
            exchange.sendResponseHeaders(200,response.length);exchange.getResponseBody().write(response);exchange.close();
        });server.start();
        try {
            var service=new CompanionService("test-only","test-model",json,URI.create("http://127.0.0.1:"+server.getAddress().getPort()+"/responses"));
            assertEquals("airy",service.chat(8L,new CompanionService.Chat("잠시 쉬고 싶어",settings,List.of())).settings().mood());
            assertFalse(received.get().path("store").asBoolean());
            assertEquals("json_schema",received.get().path("text").path("format").path("type").asText());
            assertEquals(2,received.get().path("input").size());
            assertFalse(received.get().toString().contains("test-only"));
            assertEquals(429,assertThrows(CustomException.class,()->service.chat(8L,new CompanionService.Chat("다음",settings,List.of()))).getStatus().value());
        } finally {server.stop(0);}
    }
}
