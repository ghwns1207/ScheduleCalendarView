package com.mkgloria.ScheduleCalendarView.admin.model;

import com.mkgloria.ScheduleCalendarView.schedule.model.UserScheduleParticipant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AdminScheduleParticipantDTO {
    private List<AdminScheduleParticipant> adminScheduleParticipants;

}
