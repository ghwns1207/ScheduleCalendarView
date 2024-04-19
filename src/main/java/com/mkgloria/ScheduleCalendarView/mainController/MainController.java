package com.mkgloria.ScheduleCalendarView.mainController;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Slf4j
@Controller
public class MainController {

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



}
