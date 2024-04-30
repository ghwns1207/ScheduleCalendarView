package com.mkgloria.ScheduleCalendarView.schedule.controller;


import com.mkgloria.ScheduleCalendarView.schedule.model.*;
import com.mkgloria.ScheduleCalendarView.schedule.service.ScheduleService;
import com.mkgloria.ScheduleCalendarView.user.modle.UserDTO;
import com.mkgloria.ScheduleCalendarView.utils.Api;
import com.mkgloria.ScheduleCalendarView.utils.ApiResponseUtil;
import com.mkgloria.ScheduleCalendarView.utils.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/user/api/calendar")
public class ScheduleController {

    private final JwtUtil jwtUtil;

    private final ScheduleService scheduleService;

    @GetMapping("/retrievesSchedule/{startTime}/{endTime}")
    public ResponseEntity<Api> retrievesSchedule(@RequestHeader HttpHeaders headers,
                                                 @PathVariable(name = "startTime") String startTime, @PathVariable(name = "endTime") String endTime) {
        log.info("startTime: {}", startTime);
        log.info("endTime: {}", endTime);
        String token = jwtUtil.resolveToken(headers);
        if (!jwtUtil.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponseUtil.failureResponse(HttpStatus.FORBIDDEN, "로그인 정보를 확인해주세요."));
        }
        UserDTO userDTO = jwtUtil.getUserInfo(token);
        log.info("userDto : {}", userDTO);
        if (userDTO == null) {
            return ResponseEntity.ok().body(ApiResponseUtil.failureResponse(HttpStatus.FORBIDDEN, "로그인 정보를 확인해주세요."));
        }
        UserScheduleDTO userScheduleDTO = scheduleService.retrievesSchedule(userDTO, startTime, endTime);
        if (userScheduleDTO.getUserScheduleEntityList().isEmpty()) {
            return ResponseEntity.ok().body(ApiResponseUtil.successResponse(HttpStatus.NO_CONTENT, "스케줄이 없습니다,"));
        }
        return ResponseEntity.ok().body(ApiResponseUtil.successResponse(HttpStatus.OK, userScheduleDTO));
    }

    @GetMapping("/retrieveScheduleByScheduleId/{schedule_id}")
    public ResponseEntity<Api> retrieveScheduleByScheduleId(@RequestHeader HttpHeaders headers, @PathVariable(name = "schedule_id") String scheduleId){
        try {
            String token = jwtUtil.resolveToken(headers);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponseUtil.failureResponse(HttpStatus.FORBIDDEN, "로그인 정보를 확인해주세요."));
            }
            UserDTO userDTO = jwtUtil.getUserInfo(token);
            log.info("userDto : {}", userDTO);
                UserScheduleEntity userScheduleEntity = scheduleService.retrieveScheduleByScheduleId(userDTO, scheduleId);
            if (userScheduleEntity == null) {
                return ResponseEntity.ok().body(ApiResponseUtil.successResponse(HttpStatus.NO_CONTENT, "스케줄이 없습니다,"));
            }
            List<ScheduleParticipantEntity> participantEntities =  scheduleService.retrievesParticipant(userScheduleEntity);
            UserScheduleParticipant scheduleParticipant = UserScheduleParticipant.builder()
                    .userScheduleEntity(userScheduleEntity)
                    .participantEntities(participantEntities)
                    .build();

              return ResponseEntity.ok().body(ApiResponseUtil.successResponse(HttpStatus.OK,scheduleParticipant));
        } catch (Exception e) {
            log.error("retrieveScheduleByScheduleId con :{}", e.getMessage());

           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                 ApiResponseUtil.failureResponse(HttpStatus.INTERNAL_SERVER_ERROR, "서버에러 잠시 후 다시 시도해주세요."));
        }
    }

    @PostMapping("/addSchedule")
    public ResponseEntity<Api> addSchedule(@RequestHeader HttpHeaders headers, @RequestBody EventDataDTO eventDataDTO) {
        try {
            String token = jwtUtil.resolveToken(headers);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponseUtil.failureResponse(HttpStatus.FORBIDDEN, "로그인 정보를 확인해주세요."));
            }
            UserDTO userDTO = jwtUtil.getUserInfo(token);
            log.info("userDto : {}", userDTO);
            log.info("eventDataDTO :{}", eventDataDTO);
            Api api = scheduleService.addSchedule(eventDataDTO, userDTO);

            if (!api.getResultCode().equals("200")) {
                return ResponseEntity.ok().body(api);
            }

            return ResponseEntity.ok().body(api);
        } catch (Exception e) {
            log.error("addSchedule :{}", e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ApiResponseUtil.failureResponse(HttpStatus.INTERNAL_SERVER_ERROR, "서버에러 잠시 후 다시 시도해주세요."));
        }
    }




    @GetMapping("/delSchedule/{schedule_id}")
    public ResponseEntity<Api> delSchedule(@RequestHeader HttpHeaders headers, @PathVariable(name = "schedule_id") String scheduleId) {
        try {
            String token = jwtUtil.resolveToken(headers);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponseUtil.failureResponse(HttpStatus.FORBIDDEN, "로그인 정보를 확인해주세요."));
            }
            log.info(scheduleId);
            boolean delSchedule = scheduleService.delSchedule(scheduleId);
            if (delSchedule) {
                return ResponseEntity.ok().body(ApiResponseUtil.successResponse(HttpStatus.OK, "일정이 삭제되었습니다."));
            }else {
                return ResponseEntity.ok().body(ApiResponseUtil.successResponse(HttpStatus.NOT_FOUND, "일정 삭제를 실패 했습니다."));
            }
        }catch (Exception e){
            log.info("delSchedule Con : {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponseUtil.failureResponse(HttpStatus.INTERNAL_SERVER_ERROR, "서버에 에러가 있습니다. 잠시 후 다시 시도해주세요."));
        }
    }

    @GetMapping("/retrievesIdSchedule/{dateTime}")
    public ResponseEntity<Api> retrievesIdSchedule(@RequestHeader HttpHeaders headers, @PathVariable(name = "dateTime") String dateTime) {
        try {
            String token = jwtUtil.resolveToken(headers);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponseUtil.failureResponse(HttpStatus.FORBIDDEN, "로그인 정보를 확인해주세요."));
            }
            UserDTO userDTO = jwtUtil.getUserInfo(token);
            UserScheduleParticipantDTO scheduleParticipantDTO = scheduleService.retrievesIdSchedule(userDTO, dateTime);

            if (scheduleParticipantDTO == null) {
                return ResponseEntity.ok().body(ApiResponseUtil.successResponse(HttpStatus.NO_CONTENT, "스케줄이 없습니다,"));
            }
            return ResponseEntity.ok().body(ApiResponseUtil.successResponse(HttpStatus.OK, scheduleParticipantDTO));

        } catch (Exception e) {
            log.error("addSchedule :{}", e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ApiResponseUtil.failureResponse(HttpStatus.INTERNAL_SERVER_ERROR, "서버에러 잠시 후 다시 시도해주세요."));
        }
    }

    @PostMapping("/updateSchedule/{scheduleId}/{dateTime}")
    public ResponseEntity<Api> updateSchedule(@RequestHeader HttpHeaders headers,
                                              @RequestBody EventDataDTO eventDataDTO,
                                              @PathVariable(name = "scheduleId") String scheduleId ,
                                              @PathVariable(name = "dateTime") String dateTime){
        try {
            String token = jwtUtil.resolveToken(headers);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponseUtil.failureResponse(HttpStatus.FORBIDDEN, "로그인 정보를 확인해주세요."));
            }
            UserDTO userDTO = jwtUtil.getUserInfo(token);
          Api api = scheduleService.updateSchedule(eventDataDTO, scheduleId ,dateTime, userDTO);

             return ResponseEntity.ok().body(api);

        } catch (Exception e) {
            log.error("addSchedule :{}", e.getMessage());
            e.printStackTrace();
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ApiResponseUtil.failureResponse(HttpStatus.INTERNAL_SERVER_ERROR, "서버에러 잠시 후 다시 시도해주세요."));
        }
    }
}
