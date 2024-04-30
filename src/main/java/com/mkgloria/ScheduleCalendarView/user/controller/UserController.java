package com.mkgloria.ScheduleCalendarView.user.controller;



import com.mkgloria.ScheduleCalendarView.user.modle.UserDTO;
import com.mkgloria.ScheduleCalendarView.user.modle.UserEntity;
import com.mkgloria.ScheduleCalendarView.user.service.UserService;
import com.mkgloria.ScheduleCalendarView.utils.Api;
import com.mkgloria.ScheduleCalendarView.utils.ApiResponseUtil;
import com.mkgloria.ScheduleCalendarView.utils.CookieUtils;
import com.mkgloria.ScheduleCalendarView.utils.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;


@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/user/api")
public class UserController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    @GetMapping("/checkUserInfo/retrievesUserInfo")
    public ResponseEntity<Api> retrievesUserInfo(@RequestHeader HttpHeaders headers, HttpServletRequest request, Model model){
        String token = jwtUtil.resolveToken(headers);
        if (!jwtUtil.validateToken(token)) {
            return ResponseEntity.ok().body(ApiResponseUtil.failureResponse(HttpStatus.FORBIDDEN,"다시 로그인 해주세요."));
        }
        UserDTO userDTO = jwtUtil.getUserInfo(token);
        log.info("userDto : {}",userDTO);
        if(userDTO == null){
            return ResponseEntity.ok().body(ApiResponseUtil.failureResponse(HttpStatus.FORBIDDEN,"로그인 정보를 확인해주세요."));
        }
       Optional<String> jwtTokenFromCookie= CookieUtils.getJwtTokenFromCookie(request);
        if(jwtTokenFromCookie.isPresent()){
            log.info("jwtTokenFromCookie :{}",jwtTokenFromCookie );
        }
        model.addAttribute("username", userDTO.getUser_name());
        model.addAttribute("userRole", userDTO.getUserRole());
        return ResponseEntity.ok().body(ApiResponseUtil.successResponse(HttpStatus.OK,userDTO));
    }
}
