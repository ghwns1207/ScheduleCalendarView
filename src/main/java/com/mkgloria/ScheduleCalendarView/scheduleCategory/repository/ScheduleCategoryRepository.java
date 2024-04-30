package com.mkgloria.ScheduleCalendarView.scheduleCategory.repository;

import com.mkgloria.ScheduleCalendarView.scheduleCategory.model.ScheduleCategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScheduleCategoryRepository extends JpaRepository<ScheduleCategoryEntity,Integer > {
}
