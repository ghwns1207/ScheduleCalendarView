package com.mkgloria.ScheduleCalendarView.user.controller;



import com.mkgloria.ScheduleCalendarView.user.modle.UserEntity;
import com.mkgloria.ScheduleCalendarView.user.service.UserService;
import com.mkgloria.ScheduleCalendarView.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;


@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class UserController {

    private final UserService userService;

   // @PostMapping("/login")
   // public ResponseEntity<String> login(@RequestParam("userid") String userid, @RequestParam("password") String password) {
      //userService.authenticate(userid, password);
        // if (accessToken != null) {
            // return ResponseEntity.ok("redirect:/index?jwt=" + accessToken);
        // } else {
          //   return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication failed");
        // }
   // }

}
