package com.mkgloria.ScheduleCalendarView.user.modle;



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
@Table(name = "user")
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id", referencedColumnName = "role_id", nullable = false)
    private UserRoleEntity userRole;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "position_id", referencedColumnName = "position_id", nullable = false)
    private UserPositionEntity userPosition;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "user_pw", nullable = false)
    private String userPw;

    @Column(name = "user_name", nullable = false)
    private String userName;

    @Column(name = "image_id")
    private Long imageId;

    @Column(name = "is_withdrawn", nullable = false)
    private boolean withdrawn;

    @Column(name = "birthday", nullable = false)
    private LocalDate birthday;

    @CreationTimestamp
    @Column(name = "created_at",nullable = false)
    private LocalDateTime createdAt;

}
