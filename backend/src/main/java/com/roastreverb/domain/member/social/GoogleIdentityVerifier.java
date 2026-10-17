package com.roastreverb.domain.member.social;
import org.springframework.stereotype.Component;
import org.springframework.security.oauth2.jwt.*;
@Component
public class GoogleIdentityVerifier {
 private final NimbusJwtDecoder decoder;
 public GoogleIdentityVerifier() {
  decoder=NimbusJwtDecoder.withJwkSetUri("https://www.googleapis.com/oauth2/v3/certs").build();
  decoder.setJwtValidator(JwtValidators.createDefault());
 }
 public Jwt verify(String credential) { return decoder.decode(credential); }
}
