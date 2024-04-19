package com.mkgloria.ScheduleCalendarView.userPosition.repository;


import com.mkgloria.ScheduleCalendarView.userPosition.model.UserPositionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserPositionRepository extends JpaRepository<UserPositionEntity , Integer> {
}
