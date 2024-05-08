package com.mkgloria.ScheduleCalendarView.schedule.service;

import com.mkgloria.ScheduleCalendarView.schedule.model.*;
import com.mkgloria.ScheduleCalendarView.schedule.repository.ParticipantRepository;
import com.mkgloria.ScheduleCalendarView.schedule.repository.ScheduleRepository;
import com.mkgloria.ScheduleCalendarView.scheduleCategory.model.ScheduleCategoryEntity;
import com.mkgloria.ScheduleCalendarView.scheduleCategory.repository.ScheduleCategoryRepository;
import com.mkgloria.ScheduleCalendarView.user.model.UserDTO;
import com.mkgloria.ScheduleCalendarView.user.model.UserEntity;
import com.mkgloria.ScheduleCalendarView.user.repository.UserRepository;
import com.mkgloria.ScheduleCalendarView.utils.Api;
import com.mkgloria.ScheduleCalendarView.utils.ApiResponseUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final UserRepository userRepository;
    private final ScheduleCategoryRepository scheduleCategoryRepository;
    private final ParticipantRepository participantRepository;

    public Api updateSchedule(EventDataDTO eventDataDTO, String scheduleId) {
        try {
            Optional<UserScheduleEntity> userScheduleEntity = scheduleRepository.findById(Long.valueOf(scheduleId));
            if (userScheduleEntity.isEmpty()) {
                return ApiResponseUtil.failureResponse(HttpStatus.NO_CONTENT, "해당 일정이 존재하지 않습니다.");
            }
            Optional<ScheduleCategoryEntity> scheduleCategoryEntity = scheduleCategoryRepository.findById(eventDataDTO.getCategory());
            if (scheduleCategoryEntity.isEmpty()) {
                log.error(" addSchedule scheduleCategoryEntity.isEmpty 스케줄 카테고리 조회 실패");
                return ApiResponseUtil.failureResponse(HttpStatus.NO_CONTENT, "일정 카테고리 조회 실패");
            }

            participantRepository.deleteScheduleParticipantEntitiesByUserScheduleEntityScheduleId(Long.valueOf(scheduleId));

            UserScheduleEntity updateUserSchedule = userScheduleEntity.get();
            updateUserSchedule.setUpdated_at(LocalDateTime.now());
            updateUserSchedule.setScheduleCategoryEntity(scheduleCategoryEntity.get());
            updateUserSchedule.setColor(eventDataDTO.getColor());
            updateUserSchedule.setTitle(eventDataDTO.getTitle());
            updateUserSchedule.setAll_day(eventDataDTO.isAll_day());
            updateUserSchedule.setLocation(eventDataDTO.getLocation());
            updateUserSchedule.setDescription(eventDataDTO.getDescription());
            updateUserSchedule.setStart(eventDataDTO.getStart());
            updateUserSchedule.setEnd(eventDataDTO.getEnd());

            for (Map<String, String> participant : eventDataDTO.getParticipantList()) {
                ScheduleParticipantEntity scheduleParticipant = ScheduleParticipantEntity
                        .builder()
                        .user_id(Long.valueOf(participant.get("id")))
                        .user_name(participant.get("name"))
                        .userScheduleEntity(updateUserSchedule)
                        .build();
                participantRepository.save(scheduleParticipant);
            }


            UserScheduleEntity saveScheduleEntity = scheduleRepository.save(updateUserSchedule);

            log.info("saveScheduleEntity :{}", saveScheduleEntity);
            return ApiResponseUtil.successResponse(HttpStatus.OK, "일정을 수정했습니다.");
        } catch (Exception e) {
            log.error("updateSchedule : {}", e.getMessage());
            return ApiResponseUtil.failureResponse(HttpStatus.INTERNAL_SERVER_ERROR, "서버에 문제가 생겼습니다");
        }

    }


    public UserScheduleDTO retrievesAllSchedule(UserDTO userDTO) {
        try {
            Optional<List<UserScheduleEntity>> userScheduleEntityList = scheduleRepository.findAllByCheckPublicTrue();
            log.info("userScheduleEntityList :{}", userScheduleEntityList);
            if (userScheduleEntityList.isEmpty()) {
                return null;
            }
            UserScheduleDTO userScheduleDTO = UserScheduleDTO
                    .builder()
                    .userDTO(userDTO)
                    //.userScheduleEntityList(userScheduleEntityList.get())
                    .build();

            log.info("userScheduleDTO: {}", userScheduleDTO);

            return userScheduleDTO;

        } catch (Exception e) {
            log.error("retrievesSchedule : {}", e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    public UserScheduleEntity retrieveScheduleByScheduleIdAndUserId(UserDTO userDTO, String scheduleId) {
        try {
            UserScheduleEntity userScheduleEntity = scheduleRepository.findByUserEntity_IdAndScheduleId(userDTO.getId(), Long.valueOf(scheduleId));
            log.info("userScheduleEntity : {}", userScheduleEntity);
            if (userScheduleEntity == null) {
                return null;
            }
            return userScheduleEntity;
        } catch (Exception e) {
            log.error("retrieveScheduleByScheduleId : {}", e.getMessage());
            return null;
        }
    }

    public UserScheduleInfo retrieveScheduleByScheduleId(String scheduleId) {
        try {
            Optional<UserScheduleEntity> userScheduleEntity = scheduleRepository.findById(Long.valueOf(scheduleId));
            log.info("userScheduleEntity : {}", userScheduleEntity);

            return userScheduleEntity.map(scheduleEntity -> UserScheduleInfo.builder()
                    .userId(scheduleEntity.getUserEntity().getId())
                    .userName(scheduleEntity.getUserEntity().getUserName())
                    .scheduleId(scheduleEntity.getScheduleId())
                    .scheduleCategoryEntity(scheduleEntity.getScheduleCategoryEntity())
                    .title(scheduleEntity.getTitle())
                    .description(scheduleEntity.getDescription())
                    .location(scheduleEntity.getLocation())
                    .color(scheduleEntity.getColor())
                    .start(scheduleEntity.getStart())
                    .end(scheduleEntity.getEnd())
                    .all_day(scheduleEntity.isAll_day())
                    .build()).orElse(null);
        } catch (Exception e) {
            log.error("retrieveScheduleByScheduleId : {}", e.getMessage());
            return null;
        }
    }


    public boolean delSchedule(String scheduleId) {
        try {
            scheduleRepository.deleteById(Long.valueOf(scheduleId));
            return true;
        } catch (Exception e) {
            log.error("delSchedule :{}", e.getMessage());
            return false;
        }
    }

    public UserScheduleDTO retrievesSchedule(UserDTO userDTO, String startTime, String endTime) {
        LocalDateTime startDateTime = LocalDateTime.parse(startTime.replace("Z", ""));
        LocalDateTime endDateTime = LocalDateTime.parse(endTime.replace("Z", ""));
        try {
            Optional<List<UserScheduleEntity>> userScheduleEntityList =
                    scheduleRepository.findAllByCheckPublicTrueAndStartBetweenOrEndBetween(startDateTime, endDateTime, startDateTime, endDateTime);
            log.info("userScheduleEntityList :{}", userScheduleEntityList);
            if (userScheduleEntityList.isEmpty()) {
                return null;
            }
            List<UserScheduleInfo> userScheduleInfos = userScheduleEntityList.map(scheduleEntities ->
                            scheduleEntities.stream()
                                    .map(scheduleEntity -> UserScheduleInfo.builder()
                                            .userId(scheduleEntity.getUserEntity().getId())
                                            .userName(scheduleEntity.getUserEntity().getUserName())
                                            .scheduleId(scheduleEntity.getScheduleId())
                                            .scheduleCategoryEntity(scheduleEntity.getScheduleCategoryEntity())
                                            .title(scheduleEntity.getTitle())
                                            .description(scheduleEntity.getDescription())
                                            .location(scheduleEntity.getLocation())
                                            .color(scheduleEntity.getColor())
                                            .start(scheduleEntity.getStart())
                                            .end(scheduleEntity.getEnd())
                                            .all_day(scheduleEntity.isAll_day())
                                            .build())
                                    .collect(Collectors.toList()))
                    .orElse(null);
            UserScheduleDTO userScheduleDTO = UserScheduleDTO
                    .builder()
                    .userDTO(userDTO)
                    .userScheduleInfos(userScheduleInfos)
                    .build();

            log.info("userScheduleDTO: {}", userScheduleDTO);

            return userScheduleDTO;

        } catch (Exception e) {
            log.error("retrievesSchedule : {}", e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    public Api addSchedule(EventDataDTO eventDataDTO, UserDTO userDTO) {

        try {
            if (eventDataDTO == null || userDTO == null) {
                log.error("addSchedule 전송 데이터 정보 없음");
                return ApiResponseUtil.failureResponse(HttpStatus.BAD_REQUEST, "전송 데이터 정보 없음");
            }

            Optional<ScheduleCategoryEntity> scheduleCategoryEntity = scheduleCategoryRepository.findById(eventDataDTO.getCategory());
            if (scheduleCategoryEntity.isEmpty()) {
                log.error(" addSchedule scheduleCategoryEntity.isEmpty 스케줄 카테고리 조회 실패");
                return ApiResponseUtil.failureResponse(HttpStatus.BAD_REQUEST, "스케줄 카테고리 조회 실패");
            }

            UserEntity userEntity = userRepository.findUserEntityByWithdrawnFalseAndUserId(userDTO.getUser_id());
            if (userEntity == null) {
                log.error(" addSchedule userEntity.isEmpty 유저 조회 실패");
                return ApiResponseUtil.failureResponse(HttpStatus.FORBIDDEN, "유저 조회 실패");
            }
            if (eventDataDTO.isRepetition()) {
                // 반복 선택한 경우

                LocalDateTime startTime = eventDataDTO.getStart();
                LocalDateTime endTime = eventDataDTO.getEnd();

                for (int i = 0; i < 4; i++) {
                    // 스타트 타임과 엔드 타임의 년도에 1년씩 추가
                    startTime = startTime.plusYears(1);
                    if (endTime != null) {
                        endTime = endTime.plusYears(1);
                    }
                    UserScheduleEntity userScheduleEntity = UserScheduleEntity.
                            builder()
                            .userEntity(userEntity)
                            .scheduleCategoryEntity(scheduleCategoryEntity.get())
                            .title(eventDataDTO.getTitle())
                            .description(eventDataDTO.getDescription())
                            .location(eventDataDTO.getLocation())
                            .start(startTime)
                            .end(endTime)
                            .checkPublic(true)
                            .color(eventDataDTO.getColor())
                            .all_day(eventDataDTO.isAll_day())
                            .created_at(LocalDateTime.now())
                            .build();
                    UserScheduleEntity schedule = scheduleRepository.save(userScheduleEntity);
                    for (Map<String, String> participant : eventDataDTO.getParticipantList()) {
                        ScheduleParticipantEntity scheduleParticipant = ScheduleParticipantEntity
                                .builder()
                                .user_id(Long.valueOf(participant.get("id")))
                                .user_name(participant.get("name"))
                                .userScheduleEntity(schedule)
                                .build();
                        participantRepository.save(scheduleParticipant);
                    }
                }
            }
            UserScheduleEntity userScheduleEntity = UserScheduleEntity.
                    builder()
                    .userEntity(userEntity)
                    .scheduleCategoryEntity(scheduleCategoryEntity.get())
                    .title(eventDataDTO.getTitle())
                    .description(eventDataDTO.getDescription())
                    .location(eventDataDTO.getLocation())
                    .start(eventDataDTO.getStart())
                    .end(eventDataDTO.getEnd())
                    .checkPublic(true)
                    .color(eventDataDTO.getColor())
                    .all_day(eventDataDTO.isAll_day())
                    .created_at(LocalDateTime.now())
                    .build();

            UserScheduleEntity schedule = scheduleRepository.save(userScheduleEntity);

            for (Map<String, String> participant : eventDataDTO.getParticipantList()) {
                ScheduleParticipantEntity scheduleParticipant = ScheduleParticipantEntity
                        .builder()
                        .user_id(Long.valueOf(participant.get("id")))
                        .user_name(participant.get("name"))
                        .userScheduleEntity(schedule)
                        .build();
                participantRepository.save(scheduleParticipant);
            }

            UserAddScheduleDTO userAddScheduleDTO = UserAddScheduleDTO
                    .builder()
                    .userDTO(userDTO)
                    .userScheduleEntity(schedule)
                    .build();

            return ApiResponseUtil.successResponse(HttpStatus.OK, userAddScheduleDTO);
        } catch (Exception e) {
            log.error("addSchedule save : {}", e.getMessage());
            e.printStackTrace();
            return ApiResponseUtil.failureResponse(HttpStatus.INTERNAL_SERVER_ERROR, "서버에러 잠시 후 다시 시도해주세요.");
        }
    }

    public List<ScheduleParticipantEntity> retrievesParticipant(Long scheduleId) {

        try {
            Optional<List<ScheduleParticipantEntity>> participantEntities =
                    participantRepository.findAllByUserScheduleEntityScheduleId(scheduleId);
            return participantEntities.orElse(null);
        } catch (Exception e) {
            log.error("retrievesParticipant : {}", e.getMessage());
            return null;
        }
    }

    public List<UserScheduleEntity> retrievesIdSchedule(UserDTO userDTO, String dateTime) {
        try {
            // 시간대 정보를 제거한 후에 LocalDateTime으로 파싱
            LocalDateTime localDateTime = LocalDateTime.parse(dateTime.replace(" GMT+0900 (한국 표준시)", ""), DateTimeFormatter.ofPattern("EEE MMM dd yyyy HH:mm:ss", Locale.ENGLISH));

            // 시작 시간은 한 달을 빼고, 종료 시간은 한 달을 더함
            LocalDateTime startDateTime = localDateTime.minusMonths(1);
            LocalDateTime endDateTime = localDateTime.plusMonths(1);
            Optional<List<UserScheduleEntity>> userScheduleEntityList = scheduleRepository.findAllByCheckPublicTrueAndUserEntityIdAndStartBetweenOrEndBetween(userDTO.getId(), startDateTime, endDateTime, startDateTime, endDateTime);
            log.info("userScheduleEntityList : {}", userScheduleEntityList.get());
            return userScheduleEntityList.orElse(null);
        } catch (Exception e) {
            log.error("retrievesParticipant : {}", e.getMessage());
            return null;
        }
    }

}
