package com.mkgloria.ScheduleCalendarView.user.modle;



import com.mkgloria.ScheduleCalendarView.userRole.model.UserRoleEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    private Long id;
    private String user_id;
    private String user_name;
    private String userRole;
    private String user_password;
}
