document.addEventListener('DOMContentLoaded', function () {
    const slideCloseBtn = document.querySelector('.slide-close-button');
    const slideMenu = document.querySelector('.slide-menu');

    slideCloseBtn.addEventListener('click', function () {
        slideMenu.classList.toggle('active');
    });


    const calendarEl = document.getElementById('calendar')

    // URL에서 쿼리 문자열을 추출합니다.
    let queryString = window.location.search;

    // URL의 쿼리 문자열을 객체로 파싱합니다.
    let params = new URLSearchParams(queryString);

    // "jwt" 파라미터의 값을 가져옵니다.
    let token = params.get('jwt');

    if (token) {
        localStorage.setItem('jwtToken', token);
    }
    // 세션 스토리지에서 JWT 토큰 가져오기

    const jwtToken = localStorage.getItem('jwtToken');

    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwtToken
    };

    fetch("/user/api/checkUserInfo/retrievesUserInfo", {
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
                userSaveId = resData.data.id;
                userSaveRole = resData.data.userRole;
                userSaveName = resData.data.user_name;
                renderCalendar();
                document.getElementById("userName").innerHTML = userSaveName;
                document.getElementById("userId").innerHTML = resData.data.user_id;
                document.getElementById("logOutId").innerHTML = resData.data.user_id;
            } else if (resData.resultCode === "403") {
                alert("로그아웃 되었습니다. 다시 로그인 해주세요.");
                return window.location.assign("/logout");
            }
        })
        .catch(err => {
            console.error(err);
        })

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
            if (resData.resultCode === "200") {
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
                return     fetch("/user/api/participant/retrievesParticipant", {
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
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    });
            } else if (resData.resultCode === "403") {
                alert("로그아웃 되었습니다. 다시 로그인 해주세요.");
                return window.location.assign("/logout");
            }
        })
        .catch(error => {
            // 오류 처리
            console.error('Error:', error);
        });

    function renderCalendar(){
        window.calendar = new FullCalendar.Calendar(calendarEl, {
            height: '90%',
            timeZone: 'UTC',
            expandRows: true,
            slotMinTime: '00:00',
            slotMaxTime: '24:00',
            googleCalendarApiKey: "AIzaSyDkeS4ZcAjgh1ktUMheWKDAeAGXKM77FhQ",
            // showNonCurrentDates: false, // 이전 달과 다음 달의 날짜도 표시
            customButtons: {
                mySaveBtn: {
                    // text : "일정 추가",
                    icon: "make",
                    click: function () {
                        openModal();
                    }
                },
                myAdminPage : {
                    text : "관리자",
                    click : function () {
                        window.location.assign("/admin/adminPage");
                    }
                },
                myPage : {
                    text : "내 정보",
                    click : function () {

                    }
                },
                hamburger : {
                    text : "",
                    click : function () {
                        const slideMenu = document.querySelector('.slide-menu');
                        slideMenu.classList.toggle('active');
                    }
                }
            },
            locale: "ko",
            headerToolbar: {
                left: 'mySaveBtn',
                center: 'prev title next',
                right: 'hamburger'
            },
            footerToolbar : {
                left: (userSaveRole === "ROLE_ADMIN" ? 'myAdminPage' : ''),
                right: 'today',
            },
            initialView: 'dayGridMonth',
            navLinks: false, // can click day/week names to navigate views
            editable: false,
            //selectable: true,
            nowIndicator: true,
            dayMaxEvents: true, // allow "more" link when too many events
            eventClick: function (arg) {
                //- event에서 url 호출 하는걸 막는 방법
                arg.jsEvent.cancelBubble = true;
                arg.jsEvent.preventDefault();
                let scheduleId = arg.event._def.groupId;
                if(scheduleId){
                    openEventInfoModal(scheduleId);
                }
            },
            eventOverlap: function(stillEvent, movingEvent) {debugger; return false;    },
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
            eventSources: [
                // {
                //     googleCalendarId: "ko.south_korea.official#holiday@group.v.calendar.google.com",
                //     className: "koHolidays",
                //     color: 'red',
                //     textColor: 'white',
                //
                // },
                {
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
                                        eventList = event.userScheduleInfos.map(function (schedule) {
                                            if (schedule.all_day) {
                                                if (schedule.end) {
                                                    let endDate = new Date(schedule.end); // 종료 시간을 Date 객체로 변환
                                                    endDate.setDate(endDate.getDate() + 1); // 종료 시간에 1일을 더함
                                                    let endtime = endDate.toISOString(); // 늘어난 종료 시간을 ISO 문자열로 변환
                                                    return {
                                                        allDay: schedule.all_day,
                                                        groupId: schedule.scheduleId,
                                                        title: schedule.userName + "-" + schedule.title + "  " + schedule.scheduleCategoryEntity.category_name
                                                            + ((schedule.description || schedule.location ? "(" : "")) + schedule.location + ((schedule.location && schedule.description ? ", " : "")) + schedule.description
                                                            + ((schedule.description || schedule.location ? ")" : "")),
                                                        color: schedule.color,
                                                        start: schedule.start,
                                                        end: endtime,
                                                    };
                                                } else {
                                                    return {
                                                        allDay: schedule.all_day,
                                                        groupId: schedule.scheduleId,
                                                        title: schedule.userName + "-" + schedule.title + "  " + schedule.scheduleCategoryEntity.category_name
                                                            + ((schedule.description || schedule.location ? "(" : "")) + schedule.location + ((schedule.location && schedule.description ? ", " : "")) + schedule.description
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
                                                        title: schedule.userName + "-" + schedule.title + "  " + schedule.scheduleCategoryEntity.category_name
                                                            + ((schedule.description || schedule.location ? "(" : "")) + schedule.location + ((schedule.location && schedule.description ? ", " : "")) + schedule.description
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
                                                        title: schedule.userName + "-" + schedule.title + "  " + schedule.scheduleCategoryEntity.category_name
                                                            + ((schedule.description || schedule.location ? "(" : "")) + schedule.location + ((schedule.location && schedule.description ? ", " : "")) + schedule.description
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
                                } else if (resData.resultCode === "403") {
                                    alert("로그아웃 되었습니다. 다시 로그인 해주세요.");
                                    return window.location.assign("/logout");
                                } else {
                                    alert(resData.errorMessage);
                                }
                            })
                            .catch(error => {
                                // 오류 처리
                                console.error('Error:', error);
                            });
                    }
                }, ]

        });
        calendar.render();
    }


    // 모달 창 닫기 버튼에 이벤트 추가
    document.getElementById('close').addEventListener('click', closeModal);
    // 모달 창 저장 버튼에 이벤트 추가
    document.getElementById('saveChanges').addEventListener('click', saveSchedule);

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
            month: '월별',
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

let userSaveId = "";
let userSaveRole = "";
let userSaveName = "";

// 참석자 리스트
let participantList = [];
// 업데이트 참석자 리스트
let updateParticipantList = [];

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

    fetch(`/user/api/calendar/updateSchedule/${scheduleId}`, {
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
                alert(resData.data);
                closeUpdateModal();
                openEventInfoModal(scheduleId);
                window.calendar.refetchEvents();
                updateParticipantList = [];
            } else if (resData.resultCode === "403") {
                alert("로그아웃 되었습니다. 다시 로그인 해주세요.");
                return window.location.assign("/logout");
            } else {
                alert(resData.errorMessage);
                closeUpdateModal();
            }
        })
        .catch(err => {
            console.error(err);
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
            if (resData.resultCode === "200") {
                const schedule = resData.data.userScheduleInfo;

                const participants = resData.data.participantEntities;
                if (participants) {
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

                modalFooter.innerHTML = '';

                // "저장" 버튼 요소를 생성합니다.
                const button = document.createElement("button");
                button.setAttribute("type", "button");
                button.setAttribute("class", "btn btn-secondary");
                button.className = "btn btn-secondary";
                button.textContent = "취소";

                // "저장" 버튼 요소를 생성합니다.
                const saveButton = document.createElement("button");
                saveButton.setAttribute("type", "button");
                saveButton.setAttribute("class", "btn btn-primary");
                saveButton.className = "btn btn-primary";
                saveButton.textContent = "저장";

                // "저장" 버튼에 클릭 이벤트 리스너를 추가합니다.
                saveButton.addEventListener("click", function () {
                    updateSchedule(schedule.scheduleId, participants);
                });

                button.addEventListener('click', closeUpdateModal)

                // modal-footer 요소에 "저장" 버튼을 추가합니다.
                modalFooter.appendChild(button);
                modalFooter.appendChild(saveButton);

            } else if (resData.resultCode === "204") {
                alert(resData.errorMessage);
                closeUpdateModal();
            } else if (resData.resultCode === "403") {
                alert("로그아웃 되었습니다. 다시 로그인 해주세요.");
                return window.location.assign("/logout");
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
                    closeEventInfoModal();
                } else if (resData.resultCode === "204") {
                    alert(resData.errorMessage);
                    window.calendar.rerenderEvents();
                }
            })
            .catch(error => {
                console.error(error);
            });
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
                            title: eventDTO.user_name + "-" + schedule.title + "  " + schedule.scheduleCategoryEntity.category_name
                                + ((schedule.description || schedule.location ? "(" : "")) + schedule.location + ((schedule.location && schedule.description ? ", " : "")) + schedule.description + ((schedule.description || schedule.location ? ")" : "")),
                            start: schedule.start,
                            end: endtime,
                            color: schedule.color,
                            // 필요한 경우 다른 필드도 추가할 수 있음
                        };
                    } else {
                        eventData = {
                            allDay: schedule.all_day,
                            groupId: schedule.scheduleId,
                            title: eventDTO.user_name + "-" + schedule.title + "  " + schedule.scheduleCategoryEntity.category_name
                                + ((schedule.description || schedule.location ? "(" : "")) + schedule.location + ((schedule.location && schedule.description ? ", " : "")) + schedule.description + ((schedule.description || schedule.location ? ")" : "")),
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
                            title: eventDTO.user_name + "-" + schedule.title + "  " + schedule.scheduleCategoryEntity.category_name
                                + ((schedule.description || schedule.location ? "(" : "")) + schedule.location + ((schedule.location && schedule.description ? ", " : "")) + schedule.description + ((schedule.description || schedule.location ? ")" : "")),
                            start: schedule.start,
                            end: schedule.end,
                            color: schedule.color,
                            // 필요한 경우 다른 필드도 추가할 수 있음
                        };
                    } else {
                        eventData = {
                            allDay: schedule.all_day,
                            groupId: schedule.scheduleId,
                            title: eventDTO.user_name + "-" + schedule.title + "  " + schedule.scheduleCategoryEntity.category_name
                                + ((schedule.description || schedule.location ? "(" : "")) + schedule.location + ((schedule.location && schedule.description ? ", " : "")) + schedule.description + ((schedule.description || schedule.location ? ")" : "")),
                            start: schedule.start,
                            color: schedule.color,
                            // 필요한 경우 다른 필드도 추가할 수 있음
                        };
                    }
                }

                window.calendar.addEvent(eventData);
                closeModal();

            } else if (resData.resultCode === "403") {
                alert("로그아웃 되었습니다. 다시 로그인 해주세요.");
                return window.location.assign("/logout");
            } else {
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
                const schedule = resData.data.userScheduleInfo;

                const participants = resData.data.participantEntities;
                document.getElementById("scheduleInName").innerHTML = schedule.userName + "님의 일정" ;
                document.getElementById("upCa").innerHTML = schedule.scheduleCategoryEntity.category_name;
                document.getElementById("upTit").innerHTML = schedule.title;
                document.getElementById("upDay").innerHTML = schedule.all_day ? '<input type="checkbox" checked disabled>' : '<input type="checkbox" disabled>';
                document.getElementById("upLoca").innerHTML = schedule.location;
                document.getElementById("upPar").innerHTML = participants ?  generateParticipantList(participants) : "참석자가 없습니다." ;
                document.getElementById("upStart").innerHTML = formatDate(schedule.start);
                if(schedule.end){
                    document.getElementById("upEnd").innerHTML = formatDate(schedule.end);
                }else{
                    document.getElementById("upEnd").innerHTML = schedule.end;
                }
                document.getElementById("upMemo").innerHTML = schedule.description;
                const updateSchInfo = document.getElementById("updateSchInfo");
                updateSchInfo.innerHTML = "";
                if(schedule.userId === userSaveId || userSaveRole === "ROLE_ADMIN"){

                    let editButton = document.createElement("button");
                    editButton.type="button"
                    editButton.textContent = "편집";
                    editButton.className = "btn btn-secondary"
                    editButton.onclick = function () {
                        if(confirm("일정을 수정하시겠습니까?")){
                            editSchedule(schedule.scheduleId)
                        }
                    };

                    let delButton = document.createElement("button")
                    delButton.type="button"
                    delButton.textContent = "삭제";
                    delButton.className = "btn btn-primary"
                    delButton.onclick = function () {
                        deleteSchedule(schedule.scheduleId);
                    }
                    updateSchInfo.appendChild(editButton);
                    updateSchInfo.appendChild(delButton);

                }
            } else if (resData.resultCode === "204") {
                closeEditModal();
            } else if (resData.resultCode === "403") {
                alert("로그아웃 되었습니다. 다시 로그인 해주세요.");
                return window.location.assign("/logout");
            }
        })
        .catch(error => {
            console.error(error);
        });

    // 모달 열기
    eventInfoModal.style.display = "block";
}

function formatDate(isoDate) {
    const date = new Date(isoDate);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    const formattedDate = new Intl.DateTimeFormat('ko-KR', options).format(date);
    return formattedDate.replace(',', ''); // 쉼표 제거
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

function updateParticipants(participants) {
    participants.forEach(function (participant) {
        if (updateParticipantList.length >= 10) {
            alert("최대 10명까지만 추가할 수 있습니다.");
            return;
        }

        let participantId = participant.user_id + "";
        let participantName = participant.user_name;

        if (isParticipantAlreadyAdded(updateParticipantList, participantId)) {
            alert(participantName + "님은 이미 참석자 명단에 있습니다.");
            return;
        }

        updateParticipantList.push({id: participantId, name: participantName});

        let updateParticipantTable = document.getElementById("updateParticipantTable");
        let newRow = updateParticipantTable.insertRow();

        let cell1 = newRow.insertCell(0);
        let cell2 = newRow.insertCell(1);
        let cell3 = newRow.insertCell(2);

        let imgElement = document.createElement("img");
        imgElement.src = "/images/human.png"; // 이미지 파일의 상대 경로 설정
        imgElement.alt = "아이콘 이미지";
        imgElement.style.width = "24px";
        imgElement.style.height = "24px";
        cell1.appendChild(imgElement); // 셀에 이미지 요소 추가

        let deleteButton = document.createElement("button");
        deleteButton.textContent = "지우기";
        deleteButton.onclick = function () {
            removeParticipantRow(newRow, participantId);
        };

        cell2.textContent = participantName;
        cell3.appendChild(deleteButton);
    });

}

function updateParticipant() {
    let participantSelect = document.getElementById("updateParticipant");
    let selectedOption = participantSelect.options[participantSelect.selectedIndex];
    let participantId = selectedOption.value + "";
    let participantName = selectedOption.textContent;

    if (participantName.trim() === "") {
        return;

    }
    if (isParticipantAlreadyAdded(updateParticipantList, participantId)) {
        alert(participantName + "님은 이미 참석자 명단에 있습니다.");
        return;

    }
    if (updateParticipantList.length >= 10) {
        alert("최대 10명까지만 추가할 수 있습니다.");
        return;

    }

    updateParticipantList.push({id: participantId, name: participantName});

    let updateParticipantTable = document.getElementById("updateParticipantTable");
    let newRow = updateParticipantTable.insertRow();

    let cell1 = newRow.insertCell(0);
    let cell2 = newRow.insertCell(1);
    let cell3 = newRow.insertCell(2);

    let imgElement = document.createElement("img");
    imgElement.src = "/images/human.png"; // 이미지 파일의 상대 경로 설정
    imgElement.alt = "아이콘 이미지";
    imgElement.style.width = "24px";
    imgElement.style.height = "24px";

    cell1.appendChild(imgElement); // 셀에 이미지 요소 추가

    let deleteButton = document.createElement("button");
    deleteButton.textContent = "지우기";
    deleteButton.onclick = function () {
        removeParticipantRow(newRow, participantId);
    };

    cell2.textContent = participantName;
    cell3.appendChild(deleteButton);
}

// 이미 참석자가 리스트에 있는지 확인하는 함수
function isParticipantAlreadyAdded(lists, participantId) {
    return lists.some(participant => participant.id === participantId);
}


function removeParticipantRow(row, participantId) {
    updateParticipantList = updateParticipantList.filter(participant => participant.id !== participantId);
    row.remove();
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

    if (isParticipantAlreadyAdded(participantList, participantId)) {
        alert(participantName + "님은 이미 참석가 명단에있습니다.");
        return;
    }

    participantList.push({id: participantId, name: participantName}); // { id: name } 형식으로 참석자 리스트에 추가

    let participantTable = document.getElementById("participantTable");
    let newRow = participantTable.insertRow(); // 새로운 행 추가

    let cell1 = newRow.insertCell(0);
    let cell2 = newRow.insertCell(1);
    let cell3 = newRow.insertCell(2);

    let imgElement = document.createElement("img");
    imgElement.src = "/images/human.png"; // 이미지 파일의 상대 경로 설정
    imgElement.alt = "아이콘 이미지";
    imgElement.style.width = "24px";
    imgElement.style.height = "24px";

    cell1.appendChild(imgElement); // 셀에 이미지 요소 추가

    let deleteButton = document.createElement("button");
    deleteButton.className = "btn btn-primary"
    deleteButton.textContent = "지우기";

    deleteButton.onclick = function () {
        let index = newRow.rowIndex - 1; // 해당 행의 인덱스
        participantList.splice(index, 1); // 참석자 리스트에서 제거
        newRow.remove(); // 해당 행 제거
    };

    cell2.textContent = participantName; // 두 번째 셀에 참석자 이름 추가
    cell3.appendChild(deleteButton); // 삭제 버튼을 세 번째 셀에 추가
}

const slideMenu = document.querySelector('.slide-menu');
// 일간 보기 버튼 클릭 시
function changeToDay(){
    window.calendar.changeView('dayGridDay'); // 일간 뷰로 변경
    slideMenu.classList.toggle('active');
}

// 주간 보기 버튼 클릭 시
function changeToWeek(){
    window.calendar.changeView('timeGridWeek'); // 주간 뷰로 변경
    slideMenu.classList.toggle('active');
}

// 월간 보기 버튼 클릭 시
function changeToMonth(){
    window.calendar.changeView('dayGridMonth'); // 월간 뷰로 변경
    slideMenu.classList.toggle('active');
}

document.getElementById("logout").addEventListener("click", function () {
    window.location.assign("/logout");
})


// 월간 보기 버튼 클릭 시
function changeToListWeek(){

    let dateTime = window.calendar.getDate();
    const jwtToken = localStorage.getItem('jwtToken');
    console.log(dateTime);
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwtToken
    };

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
        .then(resData =>{
            if (resData.resultCode === "200") {
                console.log(resData.data);
                // 캘린더에서 모든 이벤트 제거
                window.calendar.removeAllEvents();
                let event = resData.data;
                let eventList = [];
                if (event) {
                    eventList = event.map(function (schedule) {
                        if (schedule.all_day) {
                            if (schedule.end) {
                                let endDate = new Date(schedule.end); // 종료 시간을 Date 객체로 변환
                                endDate.setDate(endDate.getDate() + 1); // 종료 시간에 1일을 더함
                                let endtime = endDate.toISOString(); // 늘어난 종료 시간을 ISO 문자열로 변환
                                return {
                                    allDay: schedule.all_day,
                                    groupId: schedule.scheduleId,
                                    title:  schedule.title + "  " + schedule.scheduleCategoryEntity.category_name
                                        + ((schedule.description || schedule.location ? "(" : "")) + schedule.location + ((schedule.location && schedule.description ? ", " : "")) + schedule.description
                                        + ((schedule.description || schedule.location ? ")" : "")),
                                    color: schedule.color,
                                    start: schedule.start,
                                    end: endtime,
                                };
                            } else {
                                return {
                                    allDay: schedule.all_day,
                                    groupId: schedule.scheduleId,
                                    title:  schedule.title + "  " + schedule.scheduleCategoryEntity.category_name
                                        + ((schedule.description || schedule.location ? "(" : "")) + schedule.location + ((schedule.location && schedule.description ? ", " : "")) + schedule.description
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
                                    title:  schedule.title + "  " + schedule.scheduleCategoryEntity.category_name
                                        + ((schedule.description || schedule.location ? "(" : "")) + schedule.location + ((schedule.location && schedule.description ? ", " : "")) + schedule.description
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
                                    title: schedule.title + "  " + schedule.scheduleCategoryEntity.category_name
                                        + ((schedule.description || schedule.location ? "(" : "")) + schedule.location + ((schedule.location && schedule.description ? ", " : "")) + schedule.description
                                        + ((schedule.description || schedule.location ? ")" : "")),
                                    start: schedule.start, // 적절한 필드로 변경해야 함
                                    color: schedule.color,
                                };
                            }
                        }
                    });
                }

                window.calendar.addEvent(eventList)
                window.calendar.changeView('listMonth');
            }else if (resData.resultCode === "204") {
                console.log(resData.data);
            } else if (resData.resultCode === "403") {
                alert("로그아웃 되었습니다. 다시 로그인 해주세요.");
                return window.location.assign("/logout");
            }
        })
        .catch(error => {
            console.error(error);
        });

    slideMenu.classList.toggle('active');
}
