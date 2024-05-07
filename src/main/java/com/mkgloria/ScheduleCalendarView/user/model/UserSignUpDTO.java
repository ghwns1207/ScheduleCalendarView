package com.mkgloria.ScheduleCalendarView.user.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UserSignUpDTO {

    @NotBlank
    private String userId;

    @NotBlank
    private String userName;

    @NotNull
    private LocalDate userBirthday;

    @NotBlank
    private String userPW;

    @NotBlank
    private String userRole;

    @NotBlank
    private String userPosition;


//    const userIdRegex = /^(?!.*[<>])(?=.*\d)(?=.*[a-z])(?!.*\badmin\b)[^<>]{5,15}$/;
//    const passwordRegex = /^(?!.*[<>])(?!.*\badmin\b)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
//    const phoneNumberRegex = /^(?!.*[<>])(?!.*\badmin\b)\d{10,11}$/;
//       const userNameRegex = /^(?!.*[<>])(?!.*\badmin\b)([a-zA-Z]+|[가-힣]+){2,15}$/;
}
