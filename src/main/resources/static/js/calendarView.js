document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar')
    // 세션 스토리지에서 JWT 토큰 가져오기
    const jwtToken = localStorage.getItem('jwtToken');

    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwtToken
    };


    // fetch 요청: 일정 카테고리 가져오기
    fetch("/user/api/scheduleCategory/retrievesScheduleCategory", {
        method: "GET",
        redirect: 'follow',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            if (response.redirected) {
                // 리다이렉션된 경우
                window.location.assign(response.url);
                return;
            }
            return response.json();
        })
        .then(resData => {
            if(resData.resultCode === "200"){
                // 받은 데이터를 이용하여 옵션을 동적으로 추가
                const categorySelect = document.getElementById('category');
                const updateCategory = document.getElementById("updateCategory");
                resData.data.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.category_id;
                    option.textContent = category.category_name;
                    categorySelect.appendChild(option);
                });
                resData.data.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.category_id;
                    option.textContent = category.category_name;
                    updateCategory.appendChild(option);
                });
            }else if (resData.resultCode === "403"){
                alert("로그아웃 되었습니다. 다시 로그인 해주세요.");
                return document.window.location.assign("/loginFrom");
            }
        })
        .catch(error => {
            // 오류 처리
            console.error('Error:', error);
        });

    fetch("/user/api/participant/retrievesParticipant", {
        method: "GET",
        redirect: 'follow',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            if (response.redirected) {
                // 리다이렉션된 경우
                window.location.assign(response.url);
                return;
            }
            return response.json();
        })
        .then(resData => {
            // 서버로부터 받은 응답 처리
            if (resData.resultCode === "200") {
                // 받은 데이터를 이용하여 옵션을 동적으로 추가
                const participantSelect = document.getElementById('participant');
                const updateParticipant = document.getElementById("updateParticipant");
                resData.data.forEach(participant => {
                    const option = document.createElement('option');
                    option.value = participant.id;
                    option.textContent = participant.user_name;
                    participantSelect.appendChild(option);
                });
                resData.data.forEach(participant => {
                    const option = document.createElement('option');
                    option.value = participant.id;
                    option.textContent = participant.user_name;
                    updateParticipant.appendChild(option);
                });
            } else if (resData.resultCode === "204") {
                alert(resData.errorMessage);
            }else if (resData.resultCode === "403"){
                alert("로그아웃 되었습니다. 다시 로그인 해주세요.");
                return document.window.location.assign("/loginFrom");
            }
        })
        .catch(error => {
            console.error(error);
        });


    window.calendar = new FullCalendar.Calendar(calendarEl, {
        height: '90%',
        timeZone: 'UTC',
        expandRows: true,
        slotMinTime: '00:00',
        slotMaxTime: '24:00',
        customButtons: {
            mySaveBtn: {
                text: "일정추가",
                click: function () {
                    openModal();
                }
            },
            myDeleteBtn: {
                text: "일정수정",
                click: function () {
                    openEditModal();
                }
            }
        },
        locale: "ko",
        headerToolbar: {
            left: 'prev,next today,mySaveBtn,myDeleteBtn',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
        },
        initialView: 'dayGridMonth',
        navLinks: true, // can click day/week names to navigate views
        editable: false,
        //selectable: true,
        nowIndicator: true,
        dayMaxEvents: true, // allow "more" link when too many events
        eventClick: function (arg) {
            let scheduleId = arg.event._def.groupId;
            openEventInfoModal(scheduleId);

        },
        dayCellContent: function (info) {
            let number = document.createElement("a");
            number.classList.add("fc-daygrid-day-number");
            number.innerHTML = info.dayNumberText.replace("일", "");
            if (info.view.type === "dayGridMonth") {
                return {
                    html: number.outerHTML,

                };
            }
            return {
                domNodes: []
            };
        },
        eventSources: [{
            events: function (info, successCallback, failureCallback) {
                let endTime = info.endStr;
                let startTime = info.startStr;
                // fetch 요청: 일정 가져오기
                fetch(`/user/api/calendar/retrievesSchedule/${startTime}/${endTime}`, {
                    method: "GET",
                    headers: headers,
                    redirect: 'follow',
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        if (response.redirected) {
                            // 리다이렉션된 경우
                            window.location.assign(response.url);
                            return;
                        }
                        return response.json();
                    })
                    .then(resData => {
                        if (resData.resultCode === "200") {
                            let event = resData.data;
                            let eventList = [];
                            if (event) {
                                eventList = event.userScheduleEntityList.map(function (schedule) {
                                    if (schedule.all_day) {
                                        if (schedule.end) {
                                            let endDate = new Date(schedule.end); // 종료 시간을 Date 객체로 변환
                                            endDate.setDate(endDate.getDate() + 1); // 종료 시간에 1일을 더함
                                            let endtime = endDate.toISOString(); // 늘어난 종료 시간을 ISO 문자열로 변환

                                            return {
                                                allDay: schedule.all_day,
                                                groupId: schedule.scheduleId,
                                                title: event.userDTO.user_name + "-" + schedule.title + " " + schedule.scheduleCategoryEntity.category_name
                                                    + ((schedule.description || schedule.location ? "(" : "")) + schedule.location + ((schedule.description ? ", " : "")) + schedule.description
                                                    + ((schedule.description || schedule.location ? ")" : "")),
                                                color: schedule.color,
                                                start: schedule.start,
                                                end: endtime,
                                                // 필요한 경우 다른 필드도 추가할 수 있음
                                            };
                                        } else {
                                            return {
                                                allDay: schedule.all_day,
                                                groupId: schedule.scheduleId,
                                                title: event.userDTO.user_name + "-" + schedule.title + " " + schedule.scheduleCategoryEntity.category_name
                                                    + ((schedule.description || schedule.location ? "(" : "")) + schedule.location + ((schedule.description ? ", " : "")) + schedule.description
                                                    + ((schedule.description || schedule.location ? ")" : "")),
                                                start: schedule.start, // 적절한 필드로 변경해야 함
                                                color: schedule.color,
                                            };
                                        }
                                    } else {
                                        if (schedule.end) {
                                            return {
                                                allDay: schedule.all_day,
                                                groupId: schedule.scheduleId,
                                                title: event.userDTO.user_name + "-" + schedule.title + " " + schedule.scheduleCategoryEntity.category_name
                                                    + ((schedule.description || schedule.location ? "(" : "")) + schedule.location + ((schedule.description ? ", " : "")) + schedule.description
                                                    + ((schedule.description || schedule.location ? ")" : "")),
                                                color: schedule.color,
                                                start: schedule.start,
                                                end: schedule.end,
                                                // 필요한 경우 다른 필드도 추가할 수 있음
                                            };
                                        } else {
                                            return {
                                                allDay: schedule.all_day,
                                                groupId: schedule.scheduleId,
                                                title: event.userDTO.user_name + "-" + schedule.title + " " + schedule.scheduleCategoryEntity.category_name
                                                    + ((schedule.description || schedule.location ? "(" : "")) + schedule.location + ((schedule.description ? ", " : "")) + schedule.description
                                                    + ((schedule.description || schedule.location ? ")" : "")),
                                                start: schedule.start, // 적절한 필드로 변경해야 함
                                                color: schedule.color,
                                            };
                                        }
                                    }

                                });
                            }
                            successCallback(eventList);
                        } else if (resData.resultCode === "204") {
                            successCallback([]);
                        }else if (resData.resultCode === "403"){
                            alert("로그아웃 되었습니다. 다시 로그인 해주세요.");
                            return  document.window.location.assign("/loginFrom");
                        } else {
                            alert(resData.errorMessage);
                        }
                    })
                    .catch(error => {
                        // 오류 처리
                        console.error('Error:', error);
                    });
            }
        }]
    });
    calendar.render();

    // 모달 창 닫기 버튼에 이벤트 추가
    document.getElementById('close').addEventListener('click', closeModal);
    // 모달 창 저장 버튼에 이벤트 추가
    document.getElementById('saveChanges').addEventListener('click', saveSchedule);

    // 모달 닫기 버튼에 이벤트 추가
    document.getElementById('closeEditModal').addEventListener('click', closeEditModal);

    // 닫기 버튼에 이벤트 리스너 추가
    document.getElementById("closeEventInfoModal").addEventListener("click", closeEventInfoModal);
    document.getElementById("updateClose").addEventListener("click", closeUpdateModal);

    // 모달 외부 클릭 시 닫기
    window.onclick = function (event) {
        const eventInfoModal = document.getElementById("eventInfoModal");
        if (event.target == eventInfoModal) {
            eventInfoModal.style.display = "none";
        }
    }

})

// // 한국어 설정
FullCalendar.globalLocales.push(function () {
    'use strict';

    var ko = {
        code: 'ko',
        buttonText: {
            prev: '이전달',
            next: '다음달',
            today: '오늘',
            month: '월',
            week: '주',
            day: '일',
            list: '일정목록',
        },
        weekText: '주',
        allDayText: '종일',
        moreLinkText: '개',
        noEventsText: '일정이 없습니다',
    };

    return ko;

}());

// 참석자 리스트
let participantList = [];

// 업데이트 참석자 리스트
let updateParticipantList = [];

// 일정 수정 모달 열기
function openEditModal() {
    document.getElementById('editModal').style.display = 'block';
    // 세션 스토리지에서 JWT 토큰 가져오기
    const jwtToken = localStorage.getItem('jwtToken');

    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwtToken
    };
    let dateTime = calendar.getDate().toISOString();
    fetch(`/user/api/calendar/retrievesIdSchedule/${dateTime}`, {
        method: "GET",
        headers: headers,
        redirect: 'follow',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            if (response.redirected) {
                // 리다이렉션된 경우
                window.location.assign(response.url);
                return;
            }
            return response.json();
        })
        .then(resData => {
            if (resData.resultCode === "200") {
                scheduleEdit(resData.data);
            } else if (resData.resultCode === "204") {
                alert(resData.errorMessage);
                closeEditModal();
            }else if (resData.resultCode === "403"){
                alert("로그아웃 되었습니다. 다시 로그인 해주세요.");
                return document.window.location.assign("/loginFrom");
            }
        })
        .catch(error => {
            console.error(error);
        });
}


function updateSchedule(scheduleId) {

    // 세션 스토리지에서 JWT 토큰 가져오기
    const jwtToken = localStorage.getItem('jwtToken');

    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwtToken
    };
    // 각 입력 요소에서 값 가져오기
    let category = document.getElementById('updateCategory').value;
    let title = document.getElementById('updateTitle').value;
    let allDay = document.getElementById('updateAllDay').checked;
    let description = document.getElementById('updatedDescription').value;
    let location = document.getElementById('updateLocation').value;
    let start = document.getElementById('updateStart').value;
    let end = document.getElementById('updateEnd').value;
    let color = document.querySelector('input[name="color"]:checked').value;

    if (!category) {
        alert("카테고리를 선택해주세요.");
        document.getElementById('category').focus();
        return;
    }

    if (!start) {
        alert("시간을 선택해주세요.");
        document.getElementById('start').focus();
        return;
    }

    if (!title) {
        alert("제목을 입력해주세요.");
        document.getElementById('title').focus();
        return;
    }
    // 엔드 타임이 스타트 타임보다 작거나 같은 경우에 대한 처리
    if (end) {
        let startDateTime = new Date(start);
        let endDateTime = new Date(end);
        if (endDateTime <= startDateTime) {
            alert("종료 시간은 시작 시간보다 커야 합니다.");
            document.getElementById('end').value = "";
            return; // 함수 종료
        }
    }

    // 가져온 값들을 객체로 저장
    let eventData = {
        category: category,
        title: title,
        all_day: allDay,
        description: description,
        location: location,
        start: start,
        end: end,
        color: color,
        repetition: false,
        participantList: updateParticipantList,
    };

    let dateTime = calendar.getDate().toISOString();

    fetch(`/user/api/calendar/updateSchedule/${scheduleId}/${dateTime}`, {
        method: "POST",
        headers: headers,
        redirect: 'follow',
        body: JSON.stringify(eventData) // 객체를 JSON 문자열로 변환하여 바디에 담기
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            if (response.redirected) {
                // 리다이렉션된 경우
                window.location.assign(response.url);
                return;
            }
            return response.json();
        })
        .then(resData => {
            if (resData.resultCode === "200") {
                alert("일정이 수정되었습니다.")
                closeUpdateModal();
                scheduleEdit(resData.data);
                window.calendar.refetchEvents();
                updateParticipantList = [];
            }else if (resData.resultCode === "403"){
                alert("로그아웃 되었습니다. 다시 로그인 해주세요.");
                return document.window.location.assign("/loginFrom");
            } else {
                alert(resData.errorMessage);
                closeUpdateModal();
            }
        })
        .catch(err => {
            console.error(err);
        });

}

// 일정 수정 모달창 스케줄 드로잉 함수
function scheduleEdit(data) {
    let editModalName = document.getElementById("editModalName");
    const scheduleTableBody = document.getElementById("scheduleBody");
    scheduleTableBody.innerHTML = '';
    data.userScheduleParticipants.forEach(scheduleParticipant => {
        const schedule = scheduleParticipant.userScheduleEntity;

        const participants = scheduleParticipant.participantEntities;
        // 기존에 있는 내용들을 초기화
        const row = document.createElement("tr");
        row.innerHTML = `
                <td>${schedule.scheduleCategoryEntity.category_name}</td>
                <td>${schedule.title}</td>
                <td><input type="checkbox" ${schedule.all_day ? 'checked' : ''} disabled></td>
                <td>${schedule.location}</td>
                <td>${schedule.description}</td>         
                <td>${generateParticipantList(participants)}</td>
                <td><input type="datetime-local" value="${schedule.start}" id="start_${schedule.scheduleId}" readonly></td>
                <td><input type="datetime-local" value="${schedule.end}" id="end_${schedule.scheduleId}" readonly></td>
                <td>
                    <button id="edit-button-${schedule.scheduleId}" onclick="editSchedule(${schedule.scheduleId})">수정</button>
                    <button onclick="deleteSchedule(${schedule.scheduleId})">삭제</button>
                </td>
            `;

        scheduleTableBody.appendChild(row);
    });
}

// 일정 수정 이벤트
function editSchedule(scheduleId) {
    const jwtToken = localStorage.getItem('jwtToken');
    openUpdateModal();

    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwtToken
    };

    fetch(`/user/api/calendar/retrieveScheduleByScheduleId/${scheduleId}`, {
        method: "GET",
        headers: headers,
        redirect: 'follow',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            if (response.redirected) {
                // 리다이렉션된 경우
                window.location.assign(response.url);
                return;
            }
            return response.json();
        })
        .then(resData => {
            console.log(resData.resultCode)
            if (resData.resultCode === "200") {
                const schedule = resData.data.userScheduleEntity;

                const participants = resData.data.participantEntities;
                if(participants){
                    updateParticipants(participants);
                }
                // 각 입력 요소의 값을 초기화
                document.getElementById("updateCategory").value = schedule.scheduleCategoryEntity.category_id;
                document.getElementById("updateTitle").value = schedule.title;
                document.getElementById("updateAllDay").checked = schedule.all_day;
                document.getElementById("updateLocation").value = schedule.location;
                document.getElementById("updateParticipant").value = "";
                document.getElementById("updateStart").value = schedule.start;
                document.getElementById("updateEnd").value = schedule.end;
                document.getElementById("updatedDescription").value = schedule.description;
                // modal-footer 요소를 선택합니다.
                const modalFooter = document.getElementById("updateModal-footer");

                modalFooter.innerHTML ='';

                // "저장" 버튼 요소를 생성합니다.
                const button = document.createElement("button");
                button.setAttribute("type", "button");
                button.setAttribute("class", "btn btn-secondary");
                button.textContent = "취소";

                // "저장" 버튼 요소를 생성합니다.
                const saveButton = document.createElement("button");
                saveButton.setAttribute("type", "button");
                saveButton.setAttribute("class", "btn btn-primary");
                saveButton.textContent = "저장";

                // "저장" 버튼에 클릭 이벤트 리스너를 추가합니다.
                saveButton.addEventListener("click", function () {
                    updateSchedule(schedule.scheduleId , participants);
                });

                button.addEventListener('click', closeUpdateModal)

                // modal-footer 요소에 "저장" 버튼을 추가합니다.
                modalFooter.appendChild(button);
                modalFooter.appendChild(saveButton);
            } else if (resData.resultCode === "204") {
                alert(resData.errorMessage);
                closeEditModal();
                closeUpdateModal();
            }else if (resData.resultCode === "403"){
                alert("로그아웃 되었습니다. 다시 로그인 해주세요.");
                return document.window.location.assign("/loginFrom");
            }
        })
        .catch(error => {
            console.error(error);
        });
}

// 일정 삭제 이벤트
function deleteSchedule(scheduleId) {

    if (confirm("정말로 일정을 삭제하시겠습니까?")) {
        // 세션 스토리지에서 JWT 토큰 가져오기
        const jwtToken = localStorage.getItem('jwtToken');

        let headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwtToken
        };

        fetch(`/user/api/calendar/delSchedule/${scheduleId}`, {
            method: "GET",
            headers: headers,
            redirect: 'follow',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                if (response.redirected) {
                    // 리다이렉션된 경우
                    window.location.assign(response.url);
                    return;
                }
                return response.json();
            })
            .then(resData => {
                if (resData.resultCode === "200") {
                    alert(resData.data);
                    window.calendar.refetchEvents();
                    let dateTime = calendar.getDate().toISOString();
                    return fetch(`/user/api/calendar/retrievesIdSchedule/${dateTime}`, {
                        method: "GET",
                        headers: headers,
                        redirect: 'follow',
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            if (response.redirected) {
                                // 리다이렉션된 경우
                                window.location.assign(response.url);
                                return;
                            }
                            return response.json();
                        })
                        .then(resData => {
                            if (resData.resultCode === "200") {
                                scheduleEdit(resData.data);
                            } else if (resData.resultCode === "204") {
                                alert(resData.errorMessage);
                                closeEditModal();
                            } else if (resData.resultCode === "404") {
                                alert(resData.data);
                            }else if (resData.resultCode === "403"){
                                alert("로그아웃 되었습니다. 다시 로그인 해주세요.");
                                return document.window.location.assign("/loginFrom");
                            }
                        })
                        .catch(error => {
                            console.error(error);
                        });
                } else if (resData.resultCode === "204") {
                    alert(resData.errorMessage);
                    window.calendar.refetchEvents();
                }
            })
            .catch(error => {
                console.error(error);
            });
    } else {
        alert("일정 삭제를 취소하셨습니다.");
    }
}

// 일정 업데이트 모달 열기
function openUpdateModal() {
    // 모달 요소 가져오기
    const updateModal = document.getElementById("updateModal");
    // 모달 띄우기
    updateModal.style.display = "block";
}

// 일정 업데이트 모달 닫기
function closeUpdateModal() {
    // 모달 요소 가져오기
    const updateModal = document.getElementById("updateModal");
    // 모달 닫기
    updateModal.style.display = "none";
    // 각 입력 요소의 값을 초기화
    document.getElementById("updateCategory").value = "";
    document.getElementById("updateTitle").value = "";
    document.getElementById("updateAllDay").checked = false;
    document.getElementById("updateLocation").value = "";
    document.getElementById("updateParticipant").value = "";
    document.getElementById("updateStart").value = "";
    document.getElementById("updateEnd").value = "";
    document.getElementById("updatedDescription").value = "";
    updateParticipantList.splice(0, updateParticipantList.length);
    document.getElementById("updateParticipantTable").innerHTML = '';
}

// 일정 수정 참석자 리스트 드로잉
function generateParticipantList(participants) {
    return participants.map(participant => participant.user_name).join(", ");
}

// function selectAddSchedule(arg, calendar){
//     openModal();
//     console.log(arg.end);
//     console.log(arg.start);
//     let end = document.getElementById("end");
//     let start = document.getElementById("start");
//      // 시작일은 그대로 ISO 형식으로 변환
//      start.value = arg.start.toISOString().slice(0, 16);
// end.value = new Date(arg.end).toJSON().slice(0, 16).replace('T', ' '); // 시간대 변환 및 문자열 자르기
//
// }

// 스케줄 저장
function saveSchedule() {
    // 각 입력 요소에서 값 가져오기
    let category = document.getElementById('category').value;
    let title = document.getElementById('title').value;
    let allDay = document.getElementById('allDay').checked;
    let description = document.getElementById('description').value;
    let location = document.getElementById('location').value;
    let start = document.getElementById('start').value;
    let end = document.getElementById('end').value;
    let color = document.querySelector('input[name="color"]:checked').value;
    let repetition = document.getElementById("repetition").checked;


    if (!category) {
        alert("카테고리를 선택해주세요.");
        document.getElementById('category').focus();
        return;
    }

    if (!start) {
        alert("시간을 선택해주세요.");
        document.getElementById('start').focus();
        return;
    }

    if (!title) {
        alert("제목을 입력해주세요.");
        document.getElementById('title').focus();
        return;
    }

    // 엔드 타임이 스타트 타임보다 작거나 같은 경우에 대한 처리
    if (end) {
        let startDateTime = new Date(start);
        let endDateTime = new Date(end);
        if (endDateTime <= startDateTime) {
            alert("종료 시간은 시작 시간보다 커야 합니다.");
            document.getElementById('end').value = "";
            return; // 함수 종료
        }
    }

    // 가져온 값들을 객체로 저장
    let eventData = {
        category: category,
        title: title,
        all_day: allDay,
        description: description,
        location: location,
        start: start,
        end: end,
        color: color,
        repetition: repetition,
        participantList: participantList,
    };
    // 세션 스토리지에서 JWT 토큰 가져오기
    const jwtToken = localStorage.getItem('jwtToken');

    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwtToken
    };

    fetch("/user/api/calendar/addSchedule", {
        method: "POST",
        headers: headers,
        redirect: 'follow',
        body: JSON.stringify(eventData) // 객체를 JSON 문자열로 변환하여 바디에 담기
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            if (response.redirected) {
                // 리다이렉션된 경우
                window.location.assign(response.url);
                return;
            }
            return response.json();
        })
        .then(resData => {
            if (resData.resultCode == "200") {
                alert("스케줄이 추가되었습니다.");
                let eventDTO = resData.data.userDTO;
                let schedule = resData.data.userScheduleEntity;
                let eventData = {};
                if (schedule.all_day) {
                    if (schedule.end) {
                        let endDate = new Date(schedule.end); // 종료 시간을 Date 객체로 변환
                        endDate.setDate(endDate.getDate() + 1); // 종료 시간에 1일을 더함
                        let endtime = endDate.toISOString(); // 늘어난 종료 시간을 ISO 문자열로 변환

                        eventData = {
                            allDay: schedule.all_day,
                            groupId: schedule.scheduleId,
                            title: eventDTO.user_name + "-" + schedule.title + " " + schedule.scheduleCategoryEntity.category_name
                                + ((schedule.description || schedule.location ? "(" : "")) + schedule.location + ((schedule.description ? ", " : "")) + schedule.description + ((schedule.description || schedule.location ? ")" : "")),
                            start: schedule.start,
                            end: endtime,
                            color: schedule.color,
                            // 필요한 경우 다른 필드도 추가할 수 있음
                        };
                    } else {
                        eventData = {
                            allDay: schedule.all_day,
                            groupId: schedule.scheduleId,
                            title: eventDTO.user_name + "-" + schedule.title + " " + schedule.scheduleCategoryEntity.category_name
                                + ((schedule.description || schedule.location ? "(" : "")) + schedule.location + ((schedule.description ? ", " : "")) + schedule.description + ((schedule.description || schedule.location ? ")" : "")),
                            start: schedule.start,
                            color: schedule.color,
                            // 필요한 경우 다른 필드도 추가할 수 있음
                        };
                    }
                } else {
                    if (schedule.end) {
                        eventData = {
                            allDay: schedule.all_day,
                            groupId: schedule.scheduleId,
                            title: eventDTO.user_name + "-" + schedule.title + " " + schedule.scheduleCategoryEntity.category_name
                                + ((schedule.description || schedule.location ? "(" : "")) + schedule.location + ((schedule.description ? ", " : "")) + schedule.description + ((schedule.description || schedule.location ? ")" : "")),
                            start: schedule.start,
                            end: schedule.end,
                            color: schedule.color,
                            // 필요한 경우 다른 필드도 추가할 수 있음
                        };
                    } else {
                        eventData = {
                            allDay: schedule.all_day,
                            groupId: schedule.scheduleId,
                            title: eventDTO.user_name + "-" + schedule.title + " " + schedule.scheduleCategoryEntity.category_name
                                + ((schedule.description || schedule.location ? "(" : "")) + schedule.location + ((schedule.description ? ", " : "")) + schedule.description + ((schedule.description || schedule.location ? ")" : "")),
                            start: schedule.start,
                            color: schedule.color,
                            // 필요한 경우 다른 필드도 추가할 수 있음
                        };
                    }
                }

                window.calendar.addEvent(eventData);
                closeModal();

            }else if (resData.resultCode === "403"){
                alert("로그아웃 되었습니다. 다시 로그인 해주세요.");
                return document.window.location.assign("/loginFrom");
            }else {
                alert(resData.errorMessage);
            }
        })
        .catch(error => {
            // 오류 처리
            console.error('Error:', error);
        });
}

// 이벤트 인포 모달 닫기 함수
function closeEventInfoModal() {
    // 모달 요소 가져오기
    const eventInfoModal = document.getElementById("eventInfoModal");
    // 모달 닫기
    eventInfoModal.style.display = "none";
}

// 이벤트 인포 모달 열기 함수
function openEventInfoModal(scheduleId) {
    // 모달 요소 가져오기
    const eventInfoModal = document.getElementById("eventInfoModal");
    const jwtToken = localStorage.getItem('jwtToken');

    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwtToken
    };

    fetch(`/user/api/calendar/retrieveScheduleByScheduleId/${scheduleId}`, {
        method: "GET",
        headers: headers,
        redirect: 'follow',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            if (response.redirected) {
                // 리다이렉션된 경우
                window.location.assign(response.url);
                return;
            }
            return response.json();
        })
        .then(resData => {
            if (resData.resultCode === "200") {
                const scheduleInfoBody = document.getElementById("scheduleInfoBody");
                scheduleInfoBody.innerHTML = '';
                const schedule = resData.data.userScheduleEntity;

                const participants = resData.data.participantEntities;
                // 기존에 있는 내용들을 초기화
                const row = document.createElement("tr");
                row.innerHTML = `
                <td>${schedule.scheduleCategoryEntity.category_name}</td>
                <td>${schedule.title}</td>
                <td><input type="checkbox" ${schedule.all_day ? 'checked' : ''} disabled></td>
                <td>${schedule.location}</td>
                <td>${generateParticipantList(participants)}</td>
                  <td><input type="datetime-local" value="${schedule.start}" id="start_${schedule.scheduleId}" readonly></td>
                  <td><input type="datetime-local" value="${schedule.end}" id="end_${schedule.scheduleId}" readonly></td>
                <td>${schedule.description}</td>                
            `;

                scheduleInfoBody.appendChild(row);
            } else if (resData.resultCode === "204") {
                closeEditModal();
            }else if (resData.resultCode === "403"){
                alert("로그아웃 되었습니다. 다시 로그인 해주세요.");
                return document.window.location.assign("/loginFrom");
            }
        })
        .catch(error => {
            console.error(error);
        });

    // 모달 열기
    eventInfoModal.style.display = "block";
}


// 일정 추가 모달 열기
function openModal() {
    document.getElementById('myModal').style.display = 'block';
}

// 일정 추가 모달 닫기
function closeModal() {
    // 입력 요소의 값 초기화
    document.getElementById('category').value = "";
    document.getElementById('title').value = "";
    document.getElementById('allDay').checked = false;
    document.getElementById('description').value = "";
    document.getElementById('location').value = "";
    document.getElementById('start').value = "";
    document.getElementById('end').value = "";
    document.getElementById("repetition").checked = false;
    participantList.splice(0, participantList.length);
    document.getElementById('myModal').style.display = 'none';
    document.getElementById("participantTable").innerHTML = '';
}

// 일정 수정 모달 닫기
function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
// 각 입력 요소의 값을 초기화
    document.getElementById("updateCategory").value = "";
    document.getElementById("updateTitle").value = "";
    document.getElementById("updateAllDay").checked = false;
    document.getElementById("updateLocation").value = "";
    document.getElementById("updateParticipant").value = "";
    document.getElementById("updateStart").value = "";
    document.getElementById("updateEnd").value = "";
    document.getElementById("updatedDescription").value = "";
    updateParticipantList.splice(0, updateParticipantList.length);
    document.getElementById("updateParticipantTable").innerHTML = '';
}

// 참석자 추가 함수
function updateParticipants(participants) {
    if (updateParticipantList.length >= 10) {
        alert("최대 10명까지만 추가할 수 있습니다.");
        return; // 최대 참석자 수에 도달하면 함수 종료
    }
    participants.forEach(function(participant) {
        let participantId = participant.user_id;
        let participantName = participant.user_name;

        updateParticipantList.push({id: participantId, name: participantName}); // { id: name } 형식으로 참석자 리스트에 추가

        let updateParticipantTable = document.getElementById("updateParticipantTable");

        // 새로운 행을 생성합니다.
        let newRow = updateParticipantTable.insertRow();

        // 새로운 행에 셀을 추가합니다.
        let cell1 = newRow.insertCell(0);
        let cell2 = newRow.insertCell(1);
        let cell3 = newRow.insertCell(2);

        // 히든 필드 생성
        let hiddenField = document.createElement("input");
        hiddenField.type = "hidden";
        hiddenField.name = participantId; // 히든 필드의 이름 설정
        hiddenField.value = participantId; // 선택된 옵션의 아이디 설정
        cell1.appendChild(hiddenField); // 첫 번째 셀에 히든 필드 추가

        // 참석자 이름을 셀에 추가합니다.
        cell2.textContent = participantName;

        // 삭제 버튼을 생성하고 셀에 추가합니다.
        let deleteButton = document.createElement("button");
        deleteButton.textContent = "지우기";
        deleteButton.onclick = function () {
            let index = newRow.rowIndex - 1; // 해당 행의 인덱스
            updateParticipantList.splice(index, 1); // 참석자 리스트에서 제거
            newRow.remove(); // 해당 행 제거
        };
        cell3.appendChild(deleteButton); // 삭제 버튼을 세 번째 셀에 추가
    });
}

// 참석자 추가
function updateParticipant() {
    let participantSelect = document.getElementById("updateParticipant");
    let selectedOption = participantSelect.options[participantSelect.selectedIndex];
    let participantId = selectedOption.value; // 선택된 옵션의 아이디
    let participantName = selectedOption.textContent;
    if (participantName.trim() === "") {
        return; // 참석자를 선택하지 않으면 함수 종료
    }

    if (updateParticipantList.length >= 10) {
        alert("최대 10명까지만 추가할 수 있습니다.");
        return; // 최대 참석자 수에 도달하면 함수 종료
    }

    updateParticipantList.push({id: participantId, name: participantName}); // { id: name } 형식으로 참석자 리스트에 추가

    let updateParticipantTable = document.getElementById("updateParticipantTable");
    let newRow = updateParticipantTable.insertRow(); // 새로운 행 추가

    let cell1 = newRow.insertCell(0);
    let cell2 = newRow.insertCell(1);
    let cell3 = newRow.insertCell(2);

    // 히든 필드 생성
    let hiddenField = document.createElement("input");
    hiddenField.type = "hidden";
    hiddenField.name = participantId; // 히든 필드의 이름 설정
    hiddenField.value = participantId; // 선택된 옵션의 아이디 설정
    cell1.appendChild(hiddenField); // 첫 번째 셀에 히든 필드 추가

    let deleteButton = document.createElement("button");
    deleteButton.textContent = "지우기";
    deleteButton.onclick = function () {
        let index = newRow.rowIndex - 1; // 해당 행의 인덱스
        participantList.splice(index, 1); // 참석자 리스트에서 제거
        newRow.remove(); // 해당 행 제거
    };

    cell2.textContent = participantName; // 두 번째 셀에 참석자 이름 추가
    cell3.appendChild(deleteButton); // 삭제 버튼을 세 번째 셀에 추가
}

// 참석자 추가
function addParticipants() {
    let participantSelect = document.getElementById("participant");
    let selectedOption = participantSelect.options[participantSelect.selectedIndex];
    let participantId = selectedOption.value; // 선택된 옵션의 아이디
    let participantName = selectedOption.textContent;
    if (participantName.trim() === "") {
        return; // 참석자를 선택하지 않으면 함수 종료
    }

    if (participantList.length >= 10) {
        alert("최대 10명까지만 추가할 수 있습니다.");
        return; // 최대 참석자 수에 도달하면 함수 종료
    }

    participantList.push({id: participantId, name: participantName}); // { id: name } 형식으로 참석자 리스트에 추가

    let participantTable = document.getElementById("participantTable");
    let newRow = participantTable.insertRow(); // 새로운 행 추가

    let cell1 = newRow.insertCell(0);
    let cell2 = newRow.insertCell(1);
    let cell3 = newRow.insertCell(2);

    // 히든 필드 생성
    let hiddenField = document.createElement("input");
    hiddenField.type = "hidden";
    hiddenField.name = participantId; // 히든 필드의 이름 설정
    hiddenField.value = participantId; // 선택된 옵션의 아이디 설정
    cell1.appendChild(hiddenField); // 첫 번째 셀에 히든 필드 추가

    let deleteButton = document.createElement("button");
    deleteButton.textContent = "지우기";
    deleteButton.onclick = function () {
        let index = newRow.rowIndex - 1; // 해당 행의 인덱스
        participantList.splice(index, 1); // 참석자 리스트에서 제거
        newRow.remove(); // 해당 행 제거
    };

    cell2.textContent = participantName; // 두 번째 셀에 참석자 이름 추가
    cell3.appendChild(deleteButton); // 삭제 버튼을 세 번째 셀에 추가
}




