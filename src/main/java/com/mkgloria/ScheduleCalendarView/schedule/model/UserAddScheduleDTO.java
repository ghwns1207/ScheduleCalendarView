package com.mkgloria.ScheduleCalendarView.schedule.model;

import com.mkgloria.ScheduleCalendarView.user.model.UserDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserAddScheduleDTO {

    private UserDTO userDTO;
    private UserScheduleEntity userScheduleEntity;
}
