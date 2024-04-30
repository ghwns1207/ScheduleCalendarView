package com.mkgloria.ScheduleCalendarView.admin.admincontroller;


import com.mkgloria.ScheduleCalendarView.admin.adminService.AdminService;
import com.mkgloria.ScheduleCalendarView.admin.model.AdminScheduleParticipantDTO;
import com.mkgloria.ScheduleCalendarView.schedule.model.UserScheduleParticipantDTO;
import com.mkgloria.ScheduleCalendarView.scheduleCategory.model.ScheduleCategoryEntity;
import com.mkgloria.ScheduleCalendarView.user.modle.UserDTO;
import com.mkgloria.ScheduleCalendarView.user.modle.UserEntity;
import com.mkgloria.ScheduleCalendarView.user.modle.UserSignUpDTO;
import com.mkgloria.ScheduleCalendarView.user.service.UserService;
import com.mkgloria.ScheduleCalendarView.userPosition.model.UserPositionEntity;
import com.mkgloria.ScheduleCalendarView.utils.Api;
import com.mkgloria.ScheduleCalendarView.utils.ApiResponseUtil;
import com.mkgloria.ScheduleCalendarView.utils.CookieUtils;
import com.mkgloria.ScheduleCalendarView.utils.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/api")
public class AdminRestController {

    private final AdminService adminService;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<Api> registerUser(@Valid @RequestBody UserSignUpDTO userSignUpDTO) {
        try {
            if (userSignUpDTO == null) {
                return ResponseEntity.ok().body(ApiResponseUtil.failureResponse(HttpStatus.BAD_REQUEST,
                        "정보를 정확하게 입력해주세요"));
            }
            log.info("userDto : {}", userSignUpDTO);
            UserEntity userEntity = adminService.registerUser(userSignUpDTO);

            if (userEntity == null) {
                return ResponseEntity.ok().body(ApiResponseUtil.failureResponse(HttpStatus.INTERNAL_SERVER_ERROR,
                        "입력하신 정보를 확인 후 다시 시도해주세요."));
            }

            return ResponseEntity.ok().body(ApiResponseUtil.successResponse(HttpStatus.OK, "회원가입을 성공했습니다."));
        } catch (Exception exception) {
            log.error("register error", exception);
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(
                    ApiResponseUtil.failureResponse(HttpStatus.SERVICE_UNAVAILABLE, "서버에 문제가 생겼습니다."));
        }
    }

    @GetMapping("/scheduleCategory/retrievesScheduleCategory")
    public ResponseEntity<Api> retrievesAdminCategory(@RequestHeader HttpHeaders headers) {
        try {
            String token = jwtUtil.resolveToken(headers);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.ok().body(ApiResponseUtil.failureResponse(HttpStatus.FORBIDDEN, "다시 로그인 해주세요."));
            }
            UserDTO userDTO = jwtUtil.getUserInfo(token);
            log.info("userDto : {}", userDTO);
            if (userDTO == null) {
                return ResponseEntity.ok().body(ApiResponseUtil.failureResponse(HttpStatus.FORBIDDEN, "로그인 정보를 확인해주세요."));
            }
            List<ScheduleCategoryEntity> scheduleCategoryEntities = adminService.retrievesAdminCategory();
            if (scheduleCategoryEntities.isEmpty()) {
                return ResponseEntity.ok().body(ApiResponseUtil.failureResponse(HttpStatus.NO_CONTENT, "카테고리가 없습니다."));
            }
            return ResponseEntity.ok().body(ApiResponseUtil.successResponse(HttpStatus.OK, scheduleCategoryEntities));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(
                    ApiResponseUtil.failureResponse(HttpStatus.SERVICE_UNAVAILABLE, "서버에 문제가 생겼습니다."));
        }
    }

    @GetMapping("/scheduleCategory/addScheduleCategory/{addCategory}")
    public  ResponseEntity<Api> addScheduleCategory(@RequestHeader HttpHeaders headers,
                                                    @PathVariable(name = "addCategory")String categoryName){
        try {
            String token = jwtUtil.resolveToken(headers);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.ok().body(ApiResponseUtil.failureResponse(HttpStatus.FORBIDDEN, "다시 로그인 해주세요."));
            }
            UserDTO userDTO = jwtUtil.getUserInfo(token);
            log.info("userDto : {}", userDTO);
            if (userDTO == null) {
                return ResponseEntity.ok().body(ApiResponseUtil.failureResponse(HttpStatus.FORBIDDEN, "로그인 정보를 확인해주세요."));
            }
            ScheduleCategoryEntity scheduleCategoryEntity = adminService.addScheduleCategory(categoryName);
            if(scheduleCategoryEntity == null){
                return ResponseEntity.ok().body(ApiResponseUtil.failureResponse(HttpStatus.BAD_REQUEST, "입력 정보를 확인해주세요."));
            }
            List<ScheduleCategoryEntity> scheduleCategoryEntities = adminService.retrievesAdminCategory();
            return ResponseEntity.ok().body(ApiResponseUtil.successResponse(HttpStatus.OK, scheduleCategoryEntities));
        }catch (Exception e){
            log.error("admin addScheduleCategory : {}",e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponseUtil.failureResponse(HttpStatus.INTERNAL_SERVER_ERROR,
                    "서버에러 잠시 후 다시 시도해주세요."));
        }
    }

    @GetMapping("/scheduleCategory/editScheduleCategory/{id}/{category}")
    public  ResponseEntity<Api> editScheduleCategory(@RequestHeader HttpHeaders headers,
                                                    @PathVariable(name = "id")String categoryId,
                                                     @PathVariable(name = "category")String category){
        try {
            String token = jwtUtil.resolveToken(headers);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.ok().body(ApiResponseUtil.failureResponse(HttpStatus.FORBIDDEN, "다시 로그인 해주세요."));
            }
            UserDTO userDTO = jwtUtil.getUserInfo(token);
            log.info("userDto : {}", userDTO);
            if (userDTO == null) {
                return ResponseEntity.ok().body(ApiResponseUtil.failureResponse(HttpStatus.FORBIDDEN, "로그인 정보를 확인해주세요."));
            }
            ScheduleCategoryEntity scheduleCategoryEntity = adminService.editScheduleCategory(categoryId,category);
            if(scheduleCategoryEntity == null){
                return ResponseEntity.ok().body(ApiResponseUtil.failureResponse(HttpStatus.BAD_REQUEST, "입력 정보를 확인해주세요."));
            }
            List<ScheduleCategoryEntity> scheduleCategoryEntities = adminService.retrievesAdminCategory();
            return ResponseEntity.ok().body(ApiResponseUtil.successResponse(HttpStatus.OK, scheduleCategoryEntities));
        }catch (Exception e){
            log.error("admin addScheduleCategory : {}",e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponseUtil.failureResponse(HttpStatus.INTERNAL_SERVER_ERROR,
                    "서버에러 잠시 후 다시 시도해주세요."));
        }
    }

    @GetMapping("/checkAdmin/retrievesAdminInfo")
    public ResponseEntity<Api> retrievesAdminInfo(@RequestHeader HttpHeaders headers, HttpServletRequest request) {
        try {
            String token = jwtUtil.resolveToken(headers);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.ok().body(ApiResponseUtil.failureResponse(HttpStatus.FORBIDDEN, "다시 로그인 해주세요."));
            }
            UserDTO userDTO = jwtUtil.getUserInfo(token);
            log.info("userDto : {}", userDTO);
            if (userDTO == null) {
                return ResponseEntity.ok().body(ApiResponseUtil.failureResponse(HttpStatus.FORBIDDEN, "로그인 정보를 확인해주세요."));
            }
            Optional<String> jwtTokenFromCookie = CookieUtils.getJwtTokenFromCookie(request);
            if (jwtTokenFromCookie.isPresent()) {
                log.info("jwtTokenFromCookie :{}", jwtTokenFromCookie);
            }
            return ResponseEntity.ok().body(ApiResponseUtil.successResponse(HttpStatus.OK, userDTO));
        } catch (Exception e) {
            log.error("retrievesUserInfo : {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponseUtil.failureResponse(HttpStatus.INTERNAL_SERVER_ERROR,
                    "서버에러 잠시 후 다시 시도해주세요."));
        }
    }


    @GetMapping("/schedulePosition/retrievesPosition")
    public ResponseEntity<Api> retrievesPosition(@RequestHeader HttpHeaders headers) {
        try {
            String token = jwtUtil.resolveToken(headers);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.ok().body(ApiResponseUtil.failureResponse(HttpStatus.FORBIDDEN, "다시 로그인 해주세요."));
            }
            UserDTO userDTO = jwtUtil.getUserInfo(token);
            log.info("userDto : {}", userDTO);
            if (userDTO == null) {
                return ResponseEntity.ok().body(ApiResponseUtil.failureResponse(HttpStatus.FORBIDDEN, "로그인 정보를 확인해주세요."));
            }
            List<UserPositionEntity> userPositionEntities = adminService.retrievesPosition();
            if (userPositionEntities.isEmpty()) {
                return ResponseEntity.ok().body(ApiResponseUtil.failureResponse(HttpStatus.NO_CONTENT, "카테고리가 없습니다."));
            }
            return ResponseEntity.ok().body(ApiResponseUtil.successResponse(HttpStatus.OK, userPositionEntities));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(
                    ApiResponseUtil.failureResponse(HttpStatus.SERVICE_UNAVAILABLE, "서버에 문제가 생겼습니다."));
        }
    }

    @GetMapping("/schedulePosition/editSchedulePosition/{id}/{position}")
    public  ResponseEntity<Api> editSchedulePosition(@RequestHeader HttpHeaders headers,
                                                     @PathVariable(name = "id")String positionId,
                                                     @PathVariable(name = "position")String position){
        try {
            String token = jwtUtil.resolveToken(headers);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.ok().body(ApiResponseUtil.failureResponse(HttpStatus.FORBIDDEN, "다시 로그인 해주세요."));
            }
            UserDTO userDTO = jwtUtil.getUserInfo(token);
            log.info("userDto : {}", userDTO);
            if (userDTO == null) {
                return ResponseEntity.ok().body(ApiResponseUtil.failureResponse(HttpStatus.FORBIDDEN, "로그인 정보를 확인해주세요."));
            }
            UserPositionEntity userPosition = adminService.editSchedulePosition(positionId,position);
            if(userPosition == null){
                return ResponseEntity.ok().body(ApiResponseUtil.failureResponse(HttpStatus.BAD_REQUEST, "입력 정보를 확인해주세요."));
            }
            List<UserPositionEntity> userPositionEntities = adminService.retrievesPosition();
            return ResponseEntity.ok().body(ApiResponseUtil.successResponse(HttpStatus.OK, userPositionEntities));
        }catch (Exception e){
            log.error("admin addScheduleCategory : {}",e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponseUtil.failureResponse(HttpStatus.INTERNAL_SERVER_ERROR,
                    "서버에러 잠시 후 다시 시도해주세요."));
        }
    }

    @GetMapping("/schedulePosition/addSchedulePosition/{addPosition}")
    public  ResponseEntity<Api> addSchedulePosition(@RequestHeader HttpHeaders headers,
                                                    @PathVariable(name = "addPosition")String positionName){
        try {
            String token = jwtUtil.resolveToken(headers);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.ok().body(ApiResponseUtil.failureResponse(HttpStatus.FORBIDDEN, "다시 로그인 해주세요."));
            }
            UserDTO userDTO = jwtUtil.getUserInfo(token);
            log.info("userDto : {}", userDTO);
            if (userDTO == null) {
                return ResponseEntity.ok().body(ApiResponseUtil.failureResponse(HttpStatus.FORBIDDEN, "로그인 정보를 확인해주세요."));
            }
            UserPositionEntity userPosition = adminService.addSchedulePosition(positionName);
            if(userPosition == null){
                return ResponseEntity.ok().body(ApiResponseUtil.failureResponse(HttpStatus.BAD_REQUEST, "입력 정보를 확인해주세요."));
            }
            List<UserPositionEntity> userPositionEntities = adminService.retrievesPosition();
            return ResponseEntity.ok().body(ApiResponseUtil.successResponse(HttpStatus.OK, userPositionEntities));
        }catch (Exception e){
            log.error("admin addScheduleCategory : {}",e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponseUtil.failureResponse(HttpStatus.INTERNAL_SERVER_ERROR,
                    "서버에러 잠시 후 다시 시도해주세요."));
        }
    }


    @GetMapping("/retrievesAllSchedule")
    public ResponseEntity<Api> retrievesAllSchedule(@RequestHeader HttpHeaders headers) {
        try {
            String token = jwtUtil.resolveToken(headers);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.ok().body(ApiResponseUtil.failureResponse(HttpStatus.FORBIDDEN, "다시 로그인 해주세요."));
            }
            UserDTO userDTO = jwtUtil.getUserInfo(token);
            log.info("userDto : {}", userDTO);
            if (userDTO == null) {
                return ResponseEntity.ok().body(ApiResponseUtil.failureResponse(HttpStatus.FORBIDDEN, "로그인 정보를 확인해주세요."));
            }

            AdminScheduleParticipantDTO AdminScheduleParticipantDTO = adminService.retrievesAllSchedule(userDTO);
            if (AdminScheduleParticipantDTO == null) {
                return ResponseEntity.ok().body(ApiResponseUtil.successResponse(HttpStatus.NO_CONTENT, "스케줄이 없습니다,"));
            }

            return ResponseEntity.ok().body(ApiResponseUtil.successResponse(HttpStatus.OK, AdminScheduleParticipantDTO));
        } catch (Exception e) {
            log.error("retrievesUserInfo : {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponseUtil.failureResponse(HttpStatus.INTERNAL_SERVER_ERROR,
                    "서버에러 잠시 후 다시 시도해주세요."));
        }
    }


}
