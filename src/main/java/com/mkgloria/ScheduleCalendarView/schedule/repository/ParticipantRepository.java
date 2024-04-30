package com.mkgloria.ScheduleCalendarView.schedule.repository;


import com.mkgloria.ScheduleCalendarView.schedule.model.ScheduleParticipantEntity;
import com.mkgloria.ScheduleCalendarView.schedule.model.UserScheduleEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@Transactional
public interface ParticipantRepository extends JpaRepository<ScheduleParticipantEntity ,Long> {


    Optional<List<ScheduleParticipantEntity>> findAllByUserScheduleEntity(UserScheduleEntity userScheduleEntity);

    int deleteScheduleParticipantEntitiesByUserScheduleEntityScheduleId(Long ScheduleId);


}
