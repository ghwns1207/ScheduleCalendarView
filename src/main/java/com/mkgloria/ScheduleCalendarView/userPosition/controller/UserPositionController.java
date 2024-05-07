package com.mkgloria.ScheduleCalendarView.userPosition.controller;

import com.mkgloria.ScheduleCalendarView.user.model.UserDTO;
import com.mkgloria.ScheduleCalendarView.userPosition.model.UserPositionDTO;
import com.mkgloria.ScheduleCalendarView.userPosition.model.UserPositionEntity;
import com.mkgloria.ScheduleCalendarView.userPosition.service.UserPositionService;
import com.mkgloria.ScheduleCalendarView.utils.Api;
import com.mkgloria.ScheduleCalendarView.utils.ApiResponseUtil;
import com.mkgloria.ScheduleCalendarView.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/api/positions")
public class UserPositionController {

    private final JwtUtil jwtUtil;

    private final UserPositionService  userPositionService;
    // 포지션 조회
    @GetMapping("/retrievesPositions")
    public ResponseEntity<Api> retrievesPositions(@RequestHeader HttpHeaders headers){
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

            List<UserPositionEntity>  userPositionEntityList =  userPositionService.retrievesPositions();
            if(userPositionEntityList.isEmpty()){
                return ResponseEntity.ok().body(ApiResponseUtil.failureResponse(HttpStatus.NO_CONTENT,"직급 정보를 불러오기 실패했습니다."));
            }
            log.info("userPositionEntityList :{}", userPositionEntityList);
            UserPositionDTO userPositionDTO = UserPositionDTO.builder()
                    .userPositionEntityList(userPositionEntityList)
                    .build();
            return ResponseEntity.ok().body(ApiResponseUtil.successResponse(HttpStatus.OK,userPositionDTO));

        }catch (Exception e){
            log.error("retrievesPositions : {}",e.getMessage());
            return ResponseEntity.ok().body(ApiResponseUtil.failureResponse(HttpStatus.INTERNAL_SERVER_ERROR,"직급 정보를 불러오기 실패했습니다."));
        }

    }

}
