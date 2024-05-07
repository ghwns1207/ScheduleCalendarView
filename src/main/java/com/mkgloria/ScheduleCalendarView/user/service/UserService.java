package com.mkgloria.ScheduleCalendarView.user.service;


import com.mkgloria.ScheduleCalendarView.user.model.UserDTO;
import com.mkgloria.ScheduleCalendarView.user.model.UserEntity;
import com.mkgloria.ScheduleCalendarView.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;


    public UserEntity authenticate(String userid) {
        UserEntity user = userRepository.findUserEntityByWithdrawnFalseAndUserId(userid);
        if (user == null) {
            throw new UsernameNotFoundException("아이디가 존재하지 않습니다");
        }
        return user;
    }

    public List<UserDTO> retrievesParticipant() {
        List<UserEntity> userEntities = userRepository.findAllByWithdrawnFalse();
        // UserDTO 리스트 생성
        if(userEntities.isEmpty()){
            return null;
        }
        List<UserDTO> userList = new ArrayList<>();
        for (UserEntity userEntity : userEntities) {
            userList.add(UserDTO
                    .builder()
                            .id(userEntity.getId())
                            .user_name(userEntity.getUserName())
                    .build());
        }
        log.info("userList :{}",userList);
        return userList;
    }

}
