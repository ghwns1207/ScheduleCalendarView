package com.mkgloria.ScheduleCalendarView.schedule.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mkgloria.ScheduleCalendarView.scheduleCategory.model.ScheduleCategoryEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "schedule_participant")
public class ScheduleParticipantEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "participant_id")
    private Long participant_id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "schedule_id", referencedColumnName = "schedule_id", nullable = false,
            foreignKey = @ForeignKey(name = "FK_schedule_participant_schedule_id",
                    foreignKeyDefinition = "FOREIGN KEY (`schedule_id`) REFERENCES `user_schedule` (`schedule_id`) ON DELETE CASCADE ON UPDATE CASCADE"))
    private UserScheduleEntity userScheduleEntity;

    @Column(name = "user_id",nullable = false )
    private Long user_id;

    @Column(name = "user_name",nullable = false )
    private String user_name;

}
