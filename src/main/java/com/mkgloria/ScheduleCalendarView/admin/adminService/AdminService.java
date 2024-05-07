package com.mkgloria.ScheduleCalendarView.admin.adminService;

import com.mkgloria.ScheduleCalendarView.admin.model.AdminScheduleParticipant;
import com.mkgloria.ScheduleCalendarView.admin.model.AdminScheduleParticipantDTO;
import com.mkgloria.ScheduleCalendarView.schedule.model.ScheduleParticipantEntity;
import com.mkgloria.ScheduleCalendarView.schedule.model.UserScheduleEntity;
import com.mkgloria.ScheduleCalendarView.schedule.repository.ParticipantRepository;
import com.mkgloria.ScheduleCalendarView.schedule.repository.ScheduleRepository;
import com.mkgloria.ScheduleCalendarView.scheduleCategory.model.ScheduleCategoryEntity;
import com.mkgloria.ScheduleCalendarView.scheduleCategory.repository.ScheduleCategoryRepository;
import com.mkgloria.ScheduleCalendarView.user.model.UserDTO;
import com.mkgloria.ScheduleCalendarView.user.model.UserEntity;
import com.mkgloria.ScheduleCalendarView.user.model.UserSignUpDTO;
import com.mkgloria.ScheduleCalendarView.user.repository.UserRepository;
import com.mkgloria.ScheduleCalendarView.userPosition.model.UserPositionEntity;
import com.mkgloria.ScheduleCalendarView.userPosition.repository.UserPositionRepository;
import com.mkgloria.ScheduleCalendarView.userRole.model.UserRoleEntity;
import com.mkgloria.ScheduleCalendarView.userRole.repository.UserRoleRepository;
import com.mkgloria.ScheduleCalendarView.utils.Api;
import com.mkgloria.ScheduleCalendarView.utils.ApiResponseUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final UserRoleRepository userRoleRepository;
    private final UserPositionRepository userPositionRepository;
    private final ScheduleRepository scheduleRepository;
    private final ParticipantRepository participantRepository;
    private final ScheduleCategoryRepository scheduleCategoryRepository;

    public UserEntity registerUser(UserSignUpDTO userSignUpDTO) {

        String encoderPassword = passwordEncoder.encode(userSignUpDTO.getUserPW());

        Optional<UserRoleEntity> userRole = userRoleRepository.findById(Integer.valueOf(userSignUpDTO.getUserRole()));
        Optional<UserPositionEntity> userPosition = userPositionRepository.findById(Integer.valueOf(userSignUpDTO.getUserPosition()));
        return userRole.map(userRoleEntity -> userPosition.map(userPositionEntity -> userRepository.save(UserEntity.builder()
                .userId(userSignUpDTO.getUserId())
                .userPw(encoderPassword)
                .birthday(userSignUpDTO.getUserBirthday())
                .userName(userSignUpDTO.getUserName())
                .userRole(userRoleEntity)
                .userPosition(userPositionEntity)
                .withdrawn(false)
                .build())).orElse(null)).orElse(null);
    }


    public HttpStatus duplicateUserId(String userId){
        try {
            UserEntity  userEntity = userRepository.findUserEntityByUserId(userId);
            if(userEntity ==null){
                return HttpStatus.OK;
            }
            return HttpStatus.CONFLICT;
        }catch (Exception e){
            log.error("admin retrievesAllSchedule :{}", e.getMessage());
            return HttpStatus.INTERNAL_SERVER_ERROR;
        }
    }

    public AdminScheduleParticipantDTO retrievesAllSchedule(UserDTO userDTO) {
        try {
            LocalDateTime dateTime = LocalDateTime.now();
            LocalDateTime startTime = dateTime.minusMonths(1);
            LocalDateTime endTime = dateTime.plusMonths(1);

            Optional<List<UserScheduleEntity>> scheduleEntities = scheduleRepository.findAllByCheckPublicTrueAndStartBetweenOrEndBetween(startTime, endTime, startTime, endTime);
            if (scheduleEntities.isEmpty()) {
                return null;
            }
            List<AdminScheduleParticipant> adminScheduleParticipants = new ArrayList<>();
            scheduleEntities.ifPresent(schedules -> {
                for (UserScheduleEntity schedule : schedules) {
                    Optional<UserEntity> userEntity = userRepository.findById(schedule.getUserEntity().getId());
                    Optional<List<ScheduleParticipantEntity>> participantEntities = participantRepository.findAllByUserScheduleEntity(schedule);
                    if(userEntity.isEmpty() ||participantEntities.isEmpty()){
                        return;
                    }
                    AdminScheduleParticipant scheduleParticipant = AdminScheduleParticipant.builder()
                            .userEntity(userEntity.get())
                            .userScheduleEntity(schedule)
                            .participantEntities(participantEntities.get())
                            .build();
                    adminScheduleParticipants.add(scheduleParticipant);
                }
            });

            return AdminScheduleParticipantDTO.builder()
                    .adminScheduleParticipants(adminScheduleParticipants)
                    .build();
        } catch (Exception e) {
            log.error("admin retrievesAllSchedule :{}", e.getMessage());
            return null;
        }
    }
    public List<UserPositionEntity> retrievesPosition(){
        try {
            List<UserPositionEntity> userPositionEntities
                    = userPositionRepository.findAll();
            if(userPositionEntities.isEmpty()){
                return null;
            }
            return userPositionEntities;
        }catch (Exception e){
            log.error("admin retrievesPosition : {}", e.getMessage());
            return null;
        }
    }

    public UserPositionEntity editSchedulePosition(String positionId,String position){
        try {
            Optional<UserPositionEntity> UserPositionEntity =  userPositionRepository.findById(Integer.valueOf(positionId));
            if(UserPositionEntity.isEmpty()){
                return null;
            }
            UserPositionEntity.get().setPosition_name(position);
            return userPositionRepository.save(UserPositionEntity.get());
        }catch (Exception e){
            log.error("admin editSchedulePosition : {}", e.getMessage());
            return null;
        }
    }

    public UserPositionEntity addSchedulePosition(String positionName){
        try {
            return userPositionRepository.save(UserPositionEntity.builder()
                    .position_name(positionName).build());
        }catch (Exception e){
            log.error("admin retrievesAdminCategory : {}", e.getMessage());
            return null;
        }
    }



    public List<ScheduleCategoryEntity> retrievesAdminCategory(){
        try {
            List<ScheduleCategoryEntity> scheduleCategoryEntities
                    = scheduleCategoryRepository.findAll();
            if(scheduleCategoryEntities.isEmpty()){
                return null;
            }
            return scheduleCategoryEntities;
        }catch (Exception e){
            log.error("admin retrievesAdminCategory : {}", e.getMessage());
            return null;
        }
    }

    public ScheduleCategoryEntity addScheduleCategory(String categoryName){
        try {
            return scheduleCategoryRepository.save(ScheduleCategoryEntity.builder()
                    .category_name(categoryName).created_at(LocalDateTime.now()).build());
        }catch (Exception e){
            log.error("admin retrievesAdminCategory : {}", e.getMessage());
            return null;
        }
    }

    public ScheduleCategoryEntity editScheduleCategory(String categoryId,String categoryName){
        try {
            Optional<ScheduleCategoryEntity> scheduleCategoryEntity =  scheduleCategoryRepository.findById(Integer.valueOf(categoryId));
            if(scheduleCategoryEntity.isEmpty()){
                return null;
            }
            scheduleCategoryEntity.get().setCategory_name(categoryName);
            return scheduleCategoryRepository.save(scheduleCategoryEntity.get());
        }catch (Exception e){
            log.error("admin retrievesAdminCategory : {}", e.getMessage());
            return null;
        }
    }

    public Api retrievesScheduleUser() {
        try {
           List<UserEntity> userEntities = userRepository.findAllByWithdrawnFalse();
           if(userEntities.isEmpty()){
               return ApiResponseUtil.failureResponse(HttpStatus.NO_CONTENT, "회원이 없습니다. 추가해주세요.");
           }
           return ApiResponseUtil.successResponse(HttpStatus.OK, userEntities);
        }catch (Exception e){
            log.error("admin retrievesAdminCategory : {}", e.getMessage());
            return ApiResponseUtil.failureResponse(HttpStatus.INTERNAL_SERVER_ERROR, "서버에 문제가 있습니다. 잠시 후 다시 시도해주세요.");
        }
    }

    public Api selectUserByName(String userName){
        try {
            List<UserEntity> userEntities = userRepository.findAllByWithdrawnFalseAndUserNameContaining(userName);
            if(userEntities.isEmpty()){
                return ApiResponseUtil.failureResponse(HttpStatus.NO_CONTENT, "검색한 회원의 정보가 없습니다.");
            }
            return ApiResponseUtil.successResponse(HttpStatus.OK, userEntities);
        }catch (Exception e){
            log.error("admin retrievesAdminCategory : {}", e.getMessage());
            return ApiResponseUtil.failureResponse(HttpStatus.INTERNAL_SERVER_ERROR, "서버에 문제가 있습니다. 잠시 후 다시 시도해주세요.");
        }
    }

    public Api delScheduleUserByUserId(String userId) {
        try {
            UserEntity userEntity = userRepository.findUserEntityByWithdrawnFalseAndUserId(userId);
            if (userEntity == null) {
                return ApiResponseUtil.failureResponse(HttpStatus.NO_CONTENT, "검색한 회원의 정보가 없습니다.");
            }
            userEntity.setWithdrawn(true);
            userRepository.save(userEntity);
            return ApiResponseUtil.successResponse(HttpStatus.OK, "회원 정보를 삭제했습니다.");
        } catch (Exception e) {
            log.error("delScheduleUserByUserId : {}", e.getMessage());
            return ApiResponseUtil.failureResponse(HttpStatus.INTERNAL_SERVER_ERROR, "서버에 문제가 있습니다. 잠시 후 다시 시도해주세요.");
        }
    }
}
