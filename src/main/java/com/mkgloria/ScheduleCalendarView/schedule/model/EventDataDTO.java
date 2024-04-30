package com.mkgloria.ScheduleCalendarView.schedule.model;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EventDataDTO {

    private Integer category;
    private String title;
    private String color;
    private boolean all_day;
    private String description;
    private String location;
    private boolean repetition;
    private List<Map<String,String>> participantList;
    private LocalDateTime start;
    private LocalDateTime end;

}
