package com.mkgloria.ScheduleCalendarView.schedule.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mkgloria.ScheduleCalendarView.scheduleCategory.model.ScheduleCategoryEntity;
import com.mkgloria.ScheduleCalendarView.user.model.UserEntity;
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
    private Long scheduleId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JsonIgnore
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false ,
            foreignKey = @ForeignKey(name = "FK_user_schedule_user_id",
            foreignKeyDefinition = "FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON UPDATE CASCADE"))
    private UserEntity userEntity;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", referencedColumnName = "category_id", nullable = false ,
            foreignKey = @ForeignKey(name = "FK_user_schedule_category_id",
                    foreignKeyDefinition = "FOREIGN KEY (`category_id`) REFERENCES `schedule_category` (`category_id`) ON UPDATE CASCADE"))
    private ScheduleCategoryEntity scheduleCategoryEntity;

    @Column(name = "title", nullable = false)
    private String title;               // 제목

    @Column(name = "description")
    private String description;         // 상세 설명

    @Column(name = "location")
    private String location;            // 장소

    @Column(name = "color",  length = 11)
    private String color;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime start;   // 시작 시간

    @Column(name = "end_time")
    private LocalDateTime end;   // 종료 시간

    @Column(name = "all_day", nullable = false)
    private boolean all_day;

    @Column(name = "updated_at")
    private LocalDateTime updated_at;   // 생성시간

    @Column(name = "is_public", nullable = false)
    private boolean checkPublic;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime created_at;   // 생성시간



}
