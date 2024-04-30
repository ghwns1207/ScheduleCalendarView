
package com.mkgloria.ScheduleCalendarView.user.controller;


import com.mkgloria.ScheduleCalendarView.user.modle.UserDTO;
import com.mkgloria.ScheduleCalendarView.user.service.UserService;
import com.mkgloria.ScheduleCalendarView.utils.Api;
import com.mkgloria.ScheduleCalendarView.utils.ApiResponseUtil;
import com.mkgloria.ScheduleCalendarView.utils.CookieUtils;
import com.mkgloria.ScheduleCalendarView.utils.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/user/api")
public class UserRestController {
    private final UserService userService;
    private final JwtUtil jwtUtil;
    @GetMapping("/participant/retrievesParticipant")
    public ResponseEntity<Api> retrievesUserInfo(){
        try {
            List<UserDTO> userDTOS = userService.retrievesParticipant();
            if(userDTOS.isEmpty()){
                return ResponseEntity.ok().body(ApiResponseUtil.successResponse(HttpStatus.NO_CONTENT,
                        "참석자 명단이 없습니다."));
            }
            return ResponseEntity.ok().body(ApiResponseUtil.successResponse(HttpStatus.OK,userDTOS));
        } catch (Exception e) {
            log.error("retrievesParticipant : {}",e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponseUtil.failureResponse(HttpStatus.INTERNAL_SERVER_ERROR, "서버 에러"));
        }
    }
}
