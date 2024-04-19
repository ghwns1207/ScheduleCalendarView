package com.mkgloria.ScheduleCalendarView.config.auth;


import com.mkgloria.ScheduleCalendarView.user.modle.UserDTO;
import com.mkgloria.ScheduleCalendarView.user.modle.UserEntity;
import com.mkgloria.ScheduleCalendarView.utils.JwtUtil;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;


@Data
@Builder
@Component
@NoArgsConstructor
public class PrincipalDetails implements UserDetails {

    private UserDTO user; //   콤포지션
    private Map<String, Object> attributes;

    public PrincipalDetails(UserDTO user) {
        this.user = user;
    }

    public PrincipalDetails(UserDTO user, Map<String, Object> attributes) {
        this.user = user;
        this.attributes = attributes;
    }

    //해당 User의 권환을 리턴하는 곳!!
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<GrantedAuthority> collection = new ArrayList<>();
        // 사용자의 권한을 가져와서 Collection에 추가합니다.
        collection.add(new GrantedAuthority() {
            @Override
            public String getAuthority() {
                // 사용자의 역할(Role) 이름을 반환합니다.
                return user.getUserRole();
            }
        });

// 권한이 포함된 Collection을 반환합니다.
        return collection;
    }


    @Override // 패스워드 리턴
    public String getPassword() {
        return user.getUser_password();
    }

    @Override
    public String getUsername() {
        return user.getUser_id();
    }

    @Override // 계정 만료
    public boolean isAccountNonExpired() {return true;}

    @Override // 계정이 잠겼는지 확인
    public boolean isAccountNonLocked() {return true;}

    @Override // 비밀번호 유효기간이 지났는지 확인
    public boolean isCredentialsNonExpired() {return true;}

    @Override // 계정이 활성화 되어 있는지 (휴면 계정 확인)
    public boolean isEnabled() {

        // 우리 사이트에서 1년 동안 로그인을 안학 휴면 계정으로 되어 있다면
        // 현재시간 - 마지막 로그인 시간 => 1년이 초과하면 return false;
        return true;
    }
}
