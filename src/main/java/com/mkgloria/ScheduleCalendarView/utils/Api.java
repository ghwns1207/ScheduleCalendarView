package com.mkgloria.ScheduleCalendarView.utils;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Api<T> {

  private String resultCode;
  private String resultMessage;

  private T data;

  private String errorMessage;

}
//  private Error error;
//  @Data
//  @NoArgsConstructor
//  @AllArgsConstructor
//  @Builder
//  public static class Error{
//    private List<String> errorMessage;
//
//  }
