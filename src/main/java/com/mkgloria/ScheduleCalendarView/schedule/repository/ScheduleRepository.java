package com.mkgloria.ScheduleCalendarView.schedule.repository;

import com.mkgloria.ScheduleCalendarView.schedule.model.UserScheduleEntity;
import jakarta.transaction.Transactional;
import jdk.dynalink.linker.LinkerServices;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.swing.*;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
@Transactional
public interface ScheduleRepository extends JpaRepository<UserScheduleEntity, Long> {

    Optional<List<UserScheduleEntity>> findAllByCheckPublicTrue();

    Optional<List<UserScheduleEntity>> findAllByCheckPublicTrueAndStartBetweenOrEndBetween(LocalDateTime start_time, LocalDateTime  end_time, LocalDateTime start_time2, LocalDateTime end_time2);

    Optional<List<UserScheduleEntity>> findAllByAndUserEntity_IdAndStartBetweenOrEndBetween(Long userId,LocalDateTime start_time, LocalDateTime  end_time, LocalDateTime start_time2, LocalDateTime end_time2);

    UserScheduleEntity findByUserEntity_IdAndScheduleId( Long userId, Long schedule_id );


}
