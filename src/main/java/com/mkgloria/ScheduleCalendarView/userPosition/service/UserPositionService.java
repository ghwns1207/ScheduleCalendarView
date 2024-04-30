package com.mkgloria.ScheduleCalendarView.userPosition.service;

import com.mkgloria.ScheduleCalendarView.userPosition.model.UserPositionEntity;
import com.mkgloria.ScheduleCalendarView.userPosition.repository.UserPositionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class UserPositionService {

    private final UserPositionRepository userPositionRepository;

    public List<UserPositionEntity> retrievesPositions(){
        try {
            List<UserPositionEntity> userPositionEntityList = userPositionRepository.findAll();
            if(userPositionEntityList.isEmpty()){
                return null;
            }
            return userPositionEntityList;
        }catch (Exception e){
            log.error("retrievesPositions :{}", e.getMessage());
            return null;
        }
    }

}
