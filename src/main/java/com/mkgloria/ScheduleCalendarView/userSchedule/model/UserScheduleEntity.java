package com.mkgloria.ScheduleCalendarView.userSchedule.model;

import com.mkgloria.ScheduleCalendarView.scheduleCategory.model.ScheduleCategoryEntity;
import com.mkgloria.ScheduleCalendarView.user.modle.UserEntity;
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
@Table(name = "user_schedule")
public class UserScheduleEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "schedule_id")
    private Long schedule_id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "user_id", nullable = false)
    private UserEntity userEntity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", referencedColumnName = "category_id", nullable = false)
    private ScheduleCategoryEntity scheduleCategoryEntity;

    @Column(name = "title", nullable = false)
    private String title;               // 제목

    @Column(name = "description", nullable = false)
    private String description;         // 상세 설명

    @Column(name = "location", nullable = false)
    private String location;            // 장소

    @Column(name = "start_time", nullable = false)
    private LocalDateTime start_time;   // 시작 시간

    @Column(name = "end_time", nullable = false)
    private LocalDateTime end_time;   // 종료 시간

    @Column(name = "updated_at")
    private LocalDateTime updated_at;   // 생성시간

    @Column(name = "created_at", nullable = false)
    private LocalDateTime created_at;   // 생성시간



}
