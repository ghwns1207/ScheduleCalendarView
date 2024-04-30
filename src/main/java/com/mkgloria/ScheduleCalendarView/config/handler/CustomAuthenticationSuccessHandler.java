package com.mkgloria.ScheduleCalendarView.config.handler;

import com.mkgloria.ScheduleCalendarView.config.auth.PrincipalDetails;
import com.mkgloria.ScheduleCalendarView.config.auth.PrincipalDetailsService;
import com.mkgloria.ScheduleCalendarView.user.modle.UserEntity;
import com.mkgloria.ScheduleCalendarView.utils.JwtUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.ui.ExtendedModelMap;
import org.springframework.ui.Model;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Slf4j
@Component
@RequiredArgsConstructor
public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;
    private final PrincipalDetailsService principalDetailsService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication ) throws IOException, ServletException {
        // 로그인 성공 시에 수행할 동작
        PrincipalDetails userDetails = (PrincipalDetails) principalDetailsService.loadUserByUsername(authentication.getName());
        // 성공적인 로그인 로그 메시지 등을 기록할 수 있습니다.
        log.info("User logged in successfully: {}", userDetails.getUsername());
        // 세션에 사용자 이름을 저장
        request.getSession().setAttribute("username", userDetails.getUsername());

        request.getSession().setAttribute("userRole", userDetails.getUserRole());

        // JWT 토큰 생성
        String jwtToken = jwtUtil.createAccessToken(userDetails);

        // JWT 토큰을 쿠키에 담음
        Cookie cookie = new Cookie("jwtToken", jwtToken);
        cookie.setPath("/"); // 쿠키의 경로 설정
        cookie.setHttpOnly(true); // JavaScript로 쿠키에 접근하는 것을 방지하기 위해 HttpOnly 속성 설정
        cookie.setMaxAge(43200); // 쿠키 유효 시간 설정 (초 단위)
        response.addCookie(cookie);


        // 리다이렉트할 URL에 JWT 토큰을 추가합니다.
        String redirectUrl = "/index?jwt=" + URLEncoder.encode(jwtToken, StandardCharsets.UTF_8);

        // 원하는 대상 페이지로 리다이렉트합니다.
        response.sendRedirect(redirectUrl);
    }
}
