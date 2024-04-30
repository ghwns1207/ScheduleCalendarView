package com.mkgloria.ScheduleCalendarView;

import com.mkgloria.ScheduleCalendarView.schedule.model.UserScheduleEntity;
import com.mkgloria.ScheduleCalendarView.schedule.repository.ScheduleRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@SpringBootTest
class ScheduleCalendarViewApplicationTests {

	@Autowired
	private ScheduleRepository scheduleRepository;


	@Test
	void contextLoads() {
		UserScheduleEntity userScheduleEntity	= scheduleRepository.findByUserEntity_IdAndScheduleId(2L,100l);
		System.out.println(userScheduleEntity);
	}

}
