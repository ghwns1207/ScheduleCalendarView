package com.mkgloria.ScheduleCalendarView;

import com.mkgloria.ScheduleCalendarView.schedule.repository.ScheduleRepository;
import com.mkgloria.ScheduleCalendarView.user.model.UserEntity;
import com.mkgloria.ScheduleCalendarView.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class ScheduleCalendarViewApplicationTests {

	@Autowired
	private ScheduleRepository scheduleRepository;
	@Autowired
	private UserRepository userRepository;


	@Test
	void contextLoads() {
	UserEntity b
				= userRepository.findUserEntityByUserId("rlaghwns1207");
		System.out.println(b);
	}

}
