package com.mkgloria.ScheduleCalendarView.scheduleCategory.controller;

import com.mkgloria.ScheduleCalendarView.scheduleCategory.model.ScheduleCategoryEntity;
import com.mkgloria.ScheduleCalendarView.scheduleCategory.service.ScheduleCategoryService;
import com.mkgloria.ScheduleCalendarView.utils.Api;
import com.mkgloria.ScheduleCalendarView.utils.ApiResponseUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/user/api/scheduleCategory")
public class ScheduleCategoryController {

    private final ScheduleCategoryService scheduleCategoryService;

    @GetMapping("/retrievesScheduleCategory")
    public ResponseEntity<Api> retrievesScheduleCategory(){
        try {
            List<ScheduleCategoryEntity> scheduleCategoryEntities= scheduleCategoryService.retrievesScheduleCategory();

            if (scheduleCategoryEntities ==null) {
                return ResponseEntity.ok(ApiResponseUtil.failureResponse(HttpStatus.NOT_FOUND, "카테고리 정보가 없습니다."));
            }

            return ResponseEntity.ok(ApiResponseUtil.successResponse(HttpStatus.OK, scheduleCategoryEntities));

        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponseUtil.failureResponse(HttpStatus.INTERNAL_SERVER_ERROR ,"서버에러 잠시 후 다시 시도해주세요."));
        }


    }


}
