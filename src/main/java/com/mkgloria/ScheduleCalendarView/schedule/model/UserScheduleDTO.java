package com.mkgloria.ScheduleCalendarView.schedule.model;


import com.mkgloria.ScheduleCalendarView.user.modle.UserDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserScheduleDTO {

    private UserDTO userDTO;
    private List<UserScheduleEntity> userScheduleEntityList;

}
