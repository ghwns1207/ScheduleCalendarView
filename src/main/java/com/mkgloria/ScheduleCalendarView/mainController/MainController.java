package com.mkgloria.ScheduleCalendarView.mainController;

import com.mkgloria.ScheduleCalendarView.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Slf4j
@Controller
@RequiredArgsConstructor
public class MainController {
    private final JwtUtil jwtUtil;
    @GetMapping(path = {"/index", "","/"})
    public String mainPage(){
        return "index";
    }

    @GetMapping("/loginFrom")
    public String LoginPage() {
        return "loginForm";
    }

    @GetMapping("/failLogin")
    public String failLoginPage(){
        return "loginForm";
    }

    @GetMapping("/user/calendarView")
    public String calendarViewPage(){
        return "calendarView";
    }

    @GetMapping("/admin/adminPage")
    public String adminPage(){return "adminPage";}

}
