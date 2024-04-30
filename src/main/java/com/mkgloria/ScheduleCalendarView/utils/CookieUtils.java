package com.mkgloria.ScheduleCalendarView.utils;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Optional;
@Slf4j
@Component
@AllArgsConstructor
public class CookieUtils {
    public static Optional<String> getJwtTokenFromCookie(HttpServletRequest request) {
        // HttpServletRequest를 통해 쿠키를 가져옵니다.
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                // 쿠키 이름이 "jwtToken"인 경우 해당 쿠키의 값을 가져옵니다.
                if (cookie.getName().equals("jwtToken")) {
                    return Optional.of(cookie.getValue());
                }
            }
        }
        // "jwtToken" 쿠키를 찾지 못한 경우 빈 Optional을 반환합니다.
        return Optional.empty();
    }
}
