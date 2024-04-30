package com.mkgloria.ScheduleCalendarView.scheduleCategory.service;


import com.mkgloria.ScheduleCalendarView.scheduleCategory.model.ScheduleCategoryEntity;
import com.mkgloria.ScheduleCalendarView.scheduleCategory.repository.ScheduleCategoryRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class ScheduleCategoryService {

    private final ScheduleCategoryRepository scheduleCategoryRepository;

    public List<ScheduleCategoryEntity> retrievesScheduleCategory(){
        List<ScheduleCategoryEntity> scheduleCategoryEntities = scheduleCategoryRepository.findAll();
        if (scheduleCategoryEntities.isEmpty()){
            return null;
        }

        return scheduleCategoryEntities;

    }
}
