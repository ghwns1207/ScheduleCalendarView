package com.mkgloria.ScheduleCalendarView.admin.admincontroller;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("/admin")
public class AdminController {

    @GetMapping("/signUp")
    public String joinUser(){return "signup";}

    @GetMapping("/schedule")
    public String schedule(){return "adminSchedule";}

    @GetMapping("/category")
    public String category(){return "adminCategory";}

    @GetMapping("/position")
    public String position(){return "adminPosition";}

    @GetMapping("/userInfo")
    public String userInfo(){return "signup";}



}
