package com.mkgloria.ScheduleCalendarView.user.modle;



import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mkgloria.ScheduleCalendarView.userPosition.model.UserPositionEntity;
import com.mkgloria.ScheduleCalendarView.userRole.model.UserRoleEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
@Table(name = "user")
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonIgnore
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", referencedColumnName = "role_id", nullable = false)
    private UserRoleEntity userRole;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "position_id", referencedColumnName = "position_id", nullable = false)
    private UserPositionEntity userPosition;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @JsonIgnore
    @Column(name = "user_pw", nullable = false)
    private String userPw;

    @Column(name = "user_name", nullable = false)
    private String userName;

    @JsonIgnore
    @Column(name = "image_id")
    private Long imageId;

    @JsonIgnore
    @Column(name = "is_withdrawn", nullable = false)
    private boolean withdrawn;


    @Column(name = "birthday", nullable = false)
    private LocalDate birthday;

    @JsonIgnore
    @CreationTimestamp
    @Column(name = "created_at",nullable = false)
    private LocalDateTime createdAt;

}
