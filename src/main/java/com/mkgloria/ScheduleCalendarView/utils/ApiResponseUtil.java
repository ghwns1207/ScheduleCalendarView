package com.mkgloria.ScheduleCalendarView.utils;

import org.springframework.http.HttpStatus;

public class ApiResponseUtil {

  public static Api successResponse(HttpStatus status , Object data) {
    return Api.builder()
        .resultCode(String.valueOf(status.value()))
        .resultMessage(status.getReasonPhrase())
        .data(data)
        .build();
  }

  public static Api failureResponse(HttpStatus status, String errorMessage) {
    return Api.builder()
        .resultCode(String.valueOf(status.value()))
        .resultMessage(status.getReasonPhrase())
        .errorMessage(errorMessage)
        .build();
  }

}
