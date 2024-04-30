package com.mkgloria.ScheduleCalendarView.userPosition.model;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserPositionDTO {

    private List<UserPositionEntity> userPositionEntityList;

}
