package com.roastreverb.global.security;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
class AuthRateLimitTest {
 @Test void boundedWindowBlocksExcessAttemptsAndThenRecovers(){var guard=new AuthRateLimitFilter(true);assertTrue(guard.allow("fixture",2,0));assertTrue(guard.allow("fixture",2,1));assertFalse(guard.allow("fixture",2,2));assertTrue(guard.allow("fixture",2,60000));}
 @Test void excessHttpAttemptsReturn429WithoutCallingAuthentication()throws Exception{
  var filter=new AuthRateLimitFilter(true);var called=new java.util.concurrent.atomic.AtomicInteger();
  for(int i=0;i<31;i++){var request=new org.springframework.mock.web.MockHttpServletRequest("POST","/api/auth/login");request.setRemoteAddr("192.0.2.10");request.addHeader("X-Forwarded-For","198.51.100."+i);var response=new org.springframework.mock.web.MockHttpServletResponse();filter.doFilter(request,response,(a,b)->called.incrementAndGet());if(i==30){assertEquals(429,response.getStatus());assertEquals("60",response.getHeader("Retry-After"));}}
  assertEquals(30,called.get());
 }
}
