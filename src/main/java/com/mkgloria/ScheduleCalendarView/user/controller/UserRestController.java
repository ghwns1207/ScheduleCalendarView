
package com.mkgloria.ScheduleCalendarView.user.controller;


import com.mkgloria.ScheduleCalendarView.user.model.UserDTO;
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

    @GetMapping("/checkUserInfo/retrievesUserInfo")
    public ResponseEntity<Api> retrievesUserInfo(@RequestHeader HttpHeaders headers, HttpServletRequest request, Model model){
        try {
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
            model.addAttribute("userRole", userDTO.getUserPositionName());

            return ResponseEntity.ok().body(ApiResponseUtil.successResponse(HttpStatus.OK,userDTO));
        }catch (Exception e){
            log.error("retrievesUserInfo : {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponseUtil.failureResponse(HttpStatus.INTERNAL_SERVER_ERROR, "서버에러 잠시 후 다시 시도해주세요."));
        }
    }
}
