package com.mkgloria.ScheduleCalendarView.user.repository;


import com.mkgloria.ScheduleCalendarView.user.modle.UserEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Transactional
public interface UserRepository extends JpaRepository<UserEntity, Long> {

    UserEntity findUserEntityByWithdrawnFalseAndUserId(String userId);

    List<UserEntity> findAllByWithdrawnFalse();
}
