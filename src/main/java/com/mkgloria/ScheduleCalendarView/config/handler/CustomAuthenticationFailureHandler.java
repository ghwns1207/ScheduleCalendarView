package com.mkgloria.ScheduleCalendarView.config.handler;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;


import java.io.IOException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class CustomAuthenticationFailureHandler implements AuthenticationFailureHandler {

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        // 인증 실패 시 처리할 동작을 여기에 작성합니다.
        // 예를 들어, 실패한 이유를 로깅하거나 사용자에게 알림을 보낼 수 있습니다.
        log.error("Authentication failed: " + exception.getMessage());

        // 원하는 동작을 수행합니다.
        response.sendRedirect("/failLogin");
    }
}
