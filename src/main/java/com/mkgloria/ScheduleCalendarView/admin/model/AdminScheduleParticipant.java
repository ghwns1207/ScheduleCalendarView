package com.mkgloria.ScheduleCalendarView.admin.model;

import com.mkgloria.ScheduleCalendarView.schedule.model.ScheduleParticipantEntity;
import com.mkgloria.ScheduleCalendarView.schedule.model.UserScheduleEntity;
import com.mkgloria.ScheduleCalendarView.user.modle.UserEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AdminScheduleParticipant {

    private UserEntity userEntity;
    private UserScheduleEntity userScheduleEntity;
    private List<ScheduleParticipantEntity> participantEntities;
}
