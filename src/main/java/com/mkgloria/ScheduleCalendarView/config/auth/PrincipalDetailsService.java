package com.mkgloria.ScheduleCalendarView.config.auth;


import com.mkgloria.ScheduleCalendarView.user.model.UserDTO;
import com.mkgloria.ScheduleCalendarView.user.model.UserEntity;
import com.mkgloria.ScheduleCalendarView.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Data
@Service
@Transactional
@RequiredArgsConstructor
public class PrincipalDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    @Override
    public PrincipalDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserEntity user = userRepository.findUserEntityByWithdrawnFalseAndUserId(username);

        if (user == null) {
            throw new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + username);
        }
        UserDTO userDTO = UserDTO.builder()
                .id(user.getId())
                .user_id(user.getUserId())
                .user_name(user.getUserName())
                .userRole(user.getUserRole().getRole_name())
                .user_password(user.getUserPw())
                .userPositionName(user.getUserPosition().getPosition_name())
                .build();
        return new PrincipalDetails(userDTO);
    }

}
