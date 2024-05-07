package com.mkgloria.ScheduleCalendarView.user.repository;


import com.mkgloria.ScheduleCalendarView.user.model.UserEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Transactional
public interface UserRepository extends JpaRepository<UserEntity, Long> {

    UserEntity findUserEntityByWithdrawnFalseAndUserId(String userId);
    List<UserEntity> findAllByWithdrawnFalse();


    UserEntity findUserEntityByUserId(String userId);

    // 유저 롤 이름이 'ROLE_ADMIN'인 사용자를 찾는 메소드
    @Query("SELECT u FROM UserEntity u WHERE u.userRole.role_name = 'ROLE_ADMIN'")
    List<UserEntity> findUserEntityByUserRoleRoleNameAdmin();

    //@Query("SELECT u FROM UserEntity u WHERE u.userRole.roleName = ?1")
   // List<UserEntity> findByUserRoleRoleName(String roleName);


    List<UserEntity> findAllByWithdrawnFalseAndUserNameContaining(String userName);
}
