'use strict';


document.addEventListener('DOMContentLoaded', function () {

    // 세션 스토리지에서 JWT 토큰 가져오기
    const jwtToken = localStorage.getItem('jwtToken');

    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwtToken
    };
// 서버에서 포지션 데이터 가져오는 API 호출
    fetch("/admin/api/positions/retrievesPositions", {
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
            if (resData.resultCode === "200") { // 변수명 변경: resData -> data
                // 서버로부터 받은 포지션 데이터를 이용하여 옵션 동적으로 추가
                const positionSelect = document.getElementById('userPosition');
                positionSelect.innerHTML = ''; // 기존 옵션 삭제
                resData.data.userPositionEntityList.forEach(position => {
                    const option = document.createElement('option');
                    option.value = position.position_id;
                    option.textContent = position.position_name;
                    positionSelect.appendChild(option);
                });
            }else if(resData.resultCode === "403"){
                return window.location.assign("/logout");
            } else {
                alert(resData.errorMessage); // 변수명 변경: resData -> data
            }
        })
        .catch(error => {
            // 오류 처리
            console.error('Error:', error);
        });
})

let checkUserId = true;

document.getElementById("userId").addEventListener('input', function (){
    document.getElementById("checkIdBtn").disabled = false;
    checkUserId =true;
})

document.getElementById("checkIdBtn").addEventListener('click', function (){
    let userId = document.getElementById('userId').value;
    if(!userId){
        alert("아이디를 입력해주세요.")
        return;
    }

    // 세션 스토리지에서 JWT 토큰 가져오기
    const jwtToken = localStorage.getItem('jwtToken');

    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwtToken
    };

    fetch(`/admin/api/checkUserId/duplicateUserId/${userId}`, {
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
            if (resData.resultCode === "403") {
                return window.location.assign("/logout");
            }

            if (resData.resultCode === "200") { // 변수명 변경: resData -> data
                alert(resData.data)
                document.getElementById("checkIdBtn").disabled = true;
                checkUserId = false;
            }else if(resData.resultCode === "409"){
                alert(resData.data); // 변수명 변경: resData -> data
                checkUserId=true;
                document.getElementById("userId").focus();
                document.getElementById("checkIdBtn").disabled = false;
            }else {
                document.getElementById("userId").focus();
                alert(resData.errorMessage);
                checkUserId=true;
                document.getElementById("checkIdBtn").disabled = false;
            }
        })
        .catch();

    console.log(checkUserId);

});




function submitData() {
    // 사용자가 입력한 데이터 가져오기
    let userName = document.getElementById('userName').value;
    let userBirthday = document.getElementById('userBirthday').value;
    let userId = document.getElementById('userId').value;
    let userPW = document.getElementById('userPW').value;
    let userCheckPW = document.getElementById('userCheckPW').value;
    let userRole = document.getElementById('userRole').value;
    let userPosition = document.getElementById('userPosition').value;

    // 데이터 유효성 검사 등 필요한 작업 수행
    // 데이터 유효성 검사 등 필요한 작업 수행
    if (!userName || !userBirthday || !userId || !userPW || !userCheckPW || !userRole || !userPosition) {
        // 입력값이 비어있는 필드가 있을 경우 알림 표시 및 포커스 이동
        alert('모든 필드를 입력해주세요.');
        if (!userName) {
            document.getElementById('userName').focus();
        } else if (!userBirthday) {
            document.getElementById('userBirthday').focus();
        } else if (!userId) {
            document.getElementById('userId').focus();
        } else if (!userPW) {
            document.getElementById('userPW').focus();
        } else if (!userCheckPW) {
            document.getElementById('userCheckPW').focus();
        } else if (!userRole) {
            document.getElementById('userRole').focus();
        } else if (!userPosition) {
            document.getElementById('userPosition').focus();
        }
        return;
    }

    if (userPW !== userCheckPW) {
        alert("비밀번호가 불일치 합니다.")
        return;
    }

    if(checkUserId){
        alert("아이디 중복 확인을 해주세요.")
        document.getElementById("userId").focus();
        return;
    }
    // 서버로 데이터 전송
    fetch('/admin/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        body: JSON.stringify({
            userId: userId,
            userName: userName,
            userBirthday: userBirthday,
            userPW: userPW,
            userRole: userRole,
            userPosition: userPosition
        })
    })
        .then(response => {
            if (!response.ok) {
                // 실패 시 에러 처리
                alert("서버에 문제가 생겼습니다. 잠시 후 다시 시도해주세요.");
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
                    alert(resData.data);
                    if (confirm("더 추가하시겠습니까??")) {
                        // 사용자가 입력한 데이터 가져오기
                        document.getElementById('userName').value = '';
                        document.getElementById('userBirthday').value='';
                        document.getElementById('userId').value ='';
                        document.getElementById('userPW').value ='';
                        document.getElementById('userCheckPW').value ='';
                        document.getElementById('userRole').value ='';
                        document.getElementById('userPosition').value='';
                    } else {
                        window.location.assign("/admin/adminPage");
                    }
                }else if(resData.resultCode === "403"){
                    alert("로그아웃 되었습니다. 다시 로그인 해주세요.");
                    return window.location.assign("/logout");
                } else {
                    alert(resData.data);
                }
            }
        ).catch(error => {
        console.error('오류 발생:', error);
    });
}

// 취소 버튼을 눌렀을 때 입력 내용을 초기화하는 함수
function resetForm() {
    document.getElementById('userName').value = "";
    document.getElementById('userBirthday').value = "";
    document.getElementById('userId').value = "";
    document.getElementById('userPW').value = "";
    document.getElementById('userCheckPW').value = "";
    document.getElementById('userRole').value = "3"; // 유저 기본값으로 초기화
    document.getElementById('userPosition').value = "";

    window.location.assign("/admin/adminPage");
}