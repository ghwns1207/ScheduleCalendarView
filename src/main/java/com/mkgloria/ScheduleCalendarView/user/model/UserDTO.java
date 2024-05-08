package com.mkgloria.ScheduleCalendarView.user.model;



import com.fasterxml.jackson.annotation.JsonIgnore;
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

    private String userPositionName;

    @JsonIgnore
    private String user_password;
}
