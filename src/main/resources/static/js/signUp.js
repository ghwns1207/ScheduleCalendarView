'use strict';


function resetForm() {

}

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

    console.log(userBirthday);


    // 서버로 데이터 전송
    fetch('/admin/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
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
            return response.json();
        })
        .then(resData => {
            if(resData.resultCode == "200"){
                alert(resData.data);
            }else {
                alert(resData.data);
            }
        }
        ).catch(error => {
        console.error('오류 발생:', error);
    });
}