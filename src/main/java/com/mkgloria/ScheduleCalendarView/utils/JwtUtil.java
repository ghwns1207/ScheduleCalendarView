package com.mkgloria.ScheduleCalendarView.utils;


import com.mkgloria.ScheduleCalendarView.config.auth.PrincipalDetails;
import com.mkgloria.ScheduleCalendarView.user.model.UserDTO;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.IllformedLocaleException;

@Slf4j
@Component
@AllArgsConstructor
@RequiredArgsConstructor
public class JwtUtil {

    @Value("${jwt.accessToken.secretKey}")
    private String jwtSecretKey;

    private Long expirationTime= 43200000L;

    /**
     * AccessToken 생성
    * */
    public String createAccessToken(PrincipalDetails user){
        return createToken(user, expirationTime);
    }

    /**
     * JWT 생성
    * */
    private String createToken(PrincipalDetails user, long expirationTime) {
        Claims claims = Jwts.claims();
        claims.put("id", user.getUser().getId());
        claims.put("user_id", user.getUser().getUser_id());
        claims.put("user_name", user.getUser().getUser_name());
        claims.put("userRole", user.getUser().getUserRole());
        claims.put("userPosition",user.getUserPosition());

        ZonedDateTime now = ZonedDateTime.now();
        ZonedDateTime tokenValidity = now.plusSeconds(expirationTime);


        // jwtSecretKey를 SecretKey로 변환합니다.
        SecretKey secretKey = Keys.hmacShaKeyFor(jwtSecretKey.getBytes(StandardCharsets.UTF_8));

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(Date.from(now.toInstant()))
                .setExpiration(Date.from(tokenValidity.toInstant()))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
    * Token에서 UserInfo 추출
    * */
    public UserDTO getUserInfo(String token) {

        Claims claims = parseClaims(token);
        return UserDTO.builder()
                .id(claims.get("id", Long.class))
                .user_id(claims.get("user_id", String.class))
                .user_name(claims.get("user_name", String.class))
                .userRole(claims.get("userRole" , String.class))
                .userPositionName(claims.get("userPosition",String.class))
                .build();
    }

    /*
    * JWT Claims 추출
    * */
    public Claims parseClaims(String accessToken) {
        // jwtSecretKey를 SecretKey로 변환합니다.
        SecretKey secretKey = Keys.hmacShaKeyFor(jwtSecretKey.getBytes(StandardCharsets.UTF_8));

        try {
            return Jwts.parserBuilder()
                    .setSigningKey(secretKey).build()
                    .parseClaimsJws(accessToken).getBody();
        }catch (ExpiredJwtException e){
            return e.getClaims();
        }
    }
    /**
    *  JWT 검증
    * */

    public boolean validateToken(String token) {
        // jwtSecretKey를 SecretKey로 변환합니다.
        SecretKey secretKey = Keys.hmacShaKeyFor(jwtSecretKey.getBytes(StandardCharsets.UTF_8));
        try {
            Jwts.parserBuilder().setSigningKey(secretKey).build()
                    .parseClaimsJws(token).getBody();
            return true;
        } catch (io.jsonwebtoken.security.SecurityException | MalformedJwtException exception) {
            // 보안 예외 또는 부적절한 JWT 예외 발생 시 로그를 출력합니다.
            log.error("잘못된 JWT 토큰입니다", exception);
        } catch (ExpiredJwtException exception) {
            // 만료된 JWT 토큰 예외 발생 시 로그를 출력합니다.
            log.error("만료된 JWT 토큰입니다", exception);
        } catch (UnsupportedJwtException exception) {
            // 지원되지 않는 JWT 토큰 예외 발생 시 로그를 출력합니다.
            log.error("지원되지 않는 JWT 토큰입니다", exception);
        } catch (IllformedLocaleException exception) {
            // JWT 클레임이 비어 있을 때 예외 발생 시 로그를 출력합니다.
            log.error("JWT 클레임이 비어 있습니다", exception);
        } catch (Exception exception){
            // 기타 예외 발생 시 로그를 출력합니다.
            log.error("JWT 예외", exception);
        }
        return false;
    }

    /*
    *  Request Header 부터 JWT 토큰 추출
    * */
    public String resolveToken(HttpHeaders headers){
        String jwtToken = headers.getFirst(HttpHeaders.AUTHORIZATION);
        if (StringUtils.hasText(jwtToken) && jwtToken.startsWith("Bearer ")) {
            return jwtToken.substring(7);
        }
        return null;
    }

}
