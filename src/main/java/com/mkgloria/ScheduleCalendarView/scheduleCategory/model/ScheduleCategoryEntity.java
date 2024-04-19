package com.mkgloria.ScheduleCalendarView.scheduleCategory.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "schedule_category")
public class ScheduleCategoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Integer category_id;


    @Column(name = "category_name", nullable = false)
    private String category_name;

    @Column(name = "created_at",nullable = false)
    private LocalDateTime created_at;


}
