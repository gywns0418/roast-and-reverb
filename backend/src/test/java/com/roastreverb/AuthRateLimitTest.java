package com.roastreverb.global.security;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
class AuthRateLimitTest {
 @Test void boundedWindowBlocksExcessAttemptsAndThenRecovers(){var guard=new AuthRateLimitFilter(true);assertTrue(guard.allow("fixture",2,0));assertTrue(guard.allow("fixture",2,1));assertFalse(guard.allow("fixture",2,2));assertTrue(guard.allow("fixture",2,60000));}
}
