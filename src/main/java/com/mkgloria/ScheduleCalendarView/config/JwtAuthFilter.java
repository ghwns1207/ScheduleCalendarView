package com.mkgloria.ScheduleCalendarView.config;

import com.mkgloria.ScheduleCalendarView.config.auth.PrincipalDetailsService;
import com.mkgloria.ScheduleCalendarView.utils.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;


@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final PrincipalDetailsService principalDetailsService;
    private final JwtUtil jwtUtil;
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authorizationHeader = request.getHeader("Authorization");

        // JWT 헤더 확인
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer")) {
            String token = authorizationHeader.substring(7);

            // JWT 유효성 검증
            if (jwtUtil.validateToken(token)) {
                String userID = jwtUtil.getUserInfo(token).getUser_id();

                // 사용자 정보 로드
                UserDetails userDetails = principalDetailsService.loadUserByUsername(userID);

                if (userDetails != null) {
                    // 인증 설정
                    UsernamePasswordAuthenticationToken authenticationToken =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    // SecurityContext에 설정
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                }
            }
        }
        // 다음 필터 호출
        filterChain.doFilter(request, response);
    }


}
