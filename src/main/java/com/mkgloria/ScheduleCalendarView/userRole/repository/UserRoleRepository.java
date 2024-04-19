package com.mkgloria.ScheduleCalendarView.userRole.repository;

import com.mkgloria.ScheduleCalendarView.userRole.model.UserRoleEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRoleRepository extends JpaRepository<UserRoleEntity , Integer> {
}
