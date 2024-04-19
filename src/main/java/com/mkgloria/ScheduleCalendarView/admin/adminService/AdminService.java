package com.mkgloria.ScheduleCalendarView.admin.adminService;

import com.mkgloria.ScheduleCalendarView.user.modle.UserEntity;
import com.mkgloria.ScheduleCalendarView.user.modle.UserSignUpDTO;
import com.mkgloria.ScheduleCalendarView.user.repository.UserRepository;
import com.mkgloria.ScheduleCalendarView.userPosition.model.UserPositionEntity;
import com.mkgloria.ScheduleCalendarView.userPosition.repository.UserPositionRepository;
import com.mkgloria.ScheduleCalendarView.userRole.model.UserRoleEntity;
import com.mkgloria.ScheduleCalendarView.userRole.repository.UserRoleRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final UserRoleRepository userRoleRepository;
    private final UserPositionRepository userPositionRepository;

    public UserEntity registerUser(UserSignUpDTO userSignUpDTO) {

        String encoderPassword = passwordEncoder.encode(userSignUpDTO.getUserPW());

        Optional<UserRoleEntity> userRole = userRoleRepository.findById(Integer.valueOf(userSignUpDTO.getUserRole()));
        Optional<UserPositionEntity> userPosition = userPositionRepository.findById(Integer.valueOf(userSignUpDTO.getUserPosition()));
        return userRole.map(userRoleEntity -> userPosition.map(userPositionEntity -> userRepository.save(UserEntity.builder()
                .userId(userSignUpDTO.getUserId())
                .userPw(encoderPassword)
                .birthday(userSignUpDTO.getUserBirthday())
                .userName(userSignUpDTO.getUserName())
                .userRole(userRoleEntity)
                .userPosition(userPositionEntity)
                .withdrawn(false)
                .build())).orElse(null)).orElse(null);
    }

}
