package com.roastreverb.global.security;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/** Single-instance guard; replace with shared edge/storage limits before scaling out. */
@Component
public class AuthRateLimitFilter extends OncePerRequestFilter {
 private final boolean enabled;
 private final Map<String,Window> windows=new HashMap<>();
 private long nextCleanup;
 private record Window(long expires,int count){}
 public AuthRateLimitFilter(@Value("${app.security.rate-limit.enabled:true}") boolean enabled){this.enabled=enabled;}
 synchronized boolean allow(String key,int limit,long now){
  if(now>=nextCleanup){windows.entrySet().removeIf(entry->entry.getValue().expires<=now);nextCleanup=now+60000;}
  Window previous=windows.get(key);
  if(previous!=null&&previous.expires<=now){windows.remove(key);previous=null;}
  if(previous==null&&windows.size()>=10000)return false;
  if(previous!=null&&previous.count>=limit)return false;
  windows.put(key,new Window(previous==null?now+60000:previous.expires,previous==null?1:previous.count+1));return true;
 }
 @Override protected void doFilterInternal(HttpServletRequest request,HttpServletResponse response,FilterChain chain)throws ServletException,IOException{
  String path=request.getRequestURI();
  boolean signup=path.equals("/api/auth/join");
  boolean login=path.equals("/api/auth/login")||path.startsWith("/api/auth/google/")&&!path.endsWith("/config");
  if(enabled&&"POST".equals(request.getMethod())&&(signup||login)&&!allow(request.getRemoteAddr()+(signup?":join":":login"),signup?10:30,System.currentTimeMillis())){
   response.setStatus(429);response.setHeader("Retry-After","60");response.setHeader("Cache-Control","no-store");response.setContentType("application/json;charset=UTF-8");response.getWriter().write("{\"message\":\"요청이 많습니다. 1분 뒤 다시 시도해 주세요.\"}");return;
  }
  chain.doFilter(request,response);
 }
}
