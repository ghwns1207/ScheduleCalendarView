package com.mkgloria.ScheduleCalendarView.admin.admincontroller;


import com.mkgloria.ScheduleCalendarView.admin.adminService.AdminService;
import com.mkgloria.ScheduleCalendarView.user.modle.UserEntity;
import com.mkgloria.ScheduleCalendarView.user.modle.UserSignUpDTO;
import com.mkgloria.ScheduleCalendarView.utils.Api;
import com.mkgloria.ScheduleCalendarView.utils.ApiResponseUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/api")
public class AdminRestController {

    private final AdminService adminService;

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

}
