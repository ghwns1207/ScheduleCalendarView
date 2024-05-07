document.addEventListener('DOMContentLoaded', function () {


    selectAll();

    document.getElementById("selectUserBtn").addEventListener("click", function () {
        // 세션 스토리지에서 JWT 토큰 가져오기
        const jwtToken = localStorage.getItem('jwtToken');

        let headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwtToken
        };

        let userName = document.getElementById("selectUser_input").value;

        if (!jwtToken) {
            window.location.assign("/loginFrom");
            return;
        }

        if (!userName) {
            alert("회원 이름을 입력해주세요.");
            document.getElementById("selectUser_input").focus();
            return;
        }
        if (userName.length < 2) {
            alert("검색 대상의 이름을 2자 이상입력해주세요.");
            document.getElementById("selectUser_input").focus();
            return;
        }

        fetch(`/admin/api/scheduleUser/selectUserByName/${userName}`, {
            method: "GET",
            headers: headers,
            redirect: 'follow',
        }).then(response => {
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
                    document.getElementById("selectUser_input").value = "";
                    createUserRow(resData.data);
                } else if (resData.resultCode === "403") {
                    alert("로그아웃 되었습니다. 다시 로그인 해주세요.");
                    return window.location.assign("/logout");
                } else if (resData.resultCode === "204") {
                    alert(resData.errorMessage);
                    nonUserRow();
                    document.getElementById("selectUser_input").value = "";
                }
            })
            .catch(error => {
                console.log(error);
            })
    })
});

const userRoleList = [];
const userPositionList = [];

function selectAll() {
    // 세션 스토리지에서 JWT 토큰 가져오기
    const jwtToken = localStorage.getItem('jwtToken');

    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwtToken
    };

    if (!jwtToken) {
        window.location.assign("/loginFrom");
        return;
    }

    fetch("/admin/api/scheduleUser/retrievesScheduleUser", {
        method: "GET",
        headers: headers,
        redirect: 'follow',
    }).then(response => {
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
                createUserRow(resData.data);
                document.getElementById("selectUser_input").value = "";
            } else if (resData.resultCode === "403") {
                alert("로그아웃 되었습니다. 다시 로그인 해주세요.");
                return window.location.assign("/logout");
            } else if (resData.resultCode === "204") {
                alert(resData.errorMessage);
                document.getElementById("selectUser_input").value = "";
                nonUserRow();
            }
        })
        .catch(error => {
            console.log(error);
        })
}


function nonUserRow() {
    const userBody = document.getElementById("userBody");
    userBody.innerHTML = '';
    let row = document.createElement("tr");
    let userCell = document.createElement("td");
    userCell.textContent = "검색한 데이터가 없습니다.";
    userCell.colSpan = 7; // 셀이 3개의 열에 걸쳐있는 것으로 설정
    row.appendChild(userCell);
    userBody.appendChild(row)
}

function createUserRow(userData) {
    const userBody = document.getElementById("userBody");
    userBody.innerHTML = '';

    userData.forEach(function (data) {
        let userPosition = data.userPosition;
        let userRole = data.userRole;


        let row = document.createElement("tr");

        // 유저 Name
        let userNameCell = document.createElement("td");
        let userNameInput = document.createElement("input");
        userNameInput.type = "text";
        userNameInput.value = data.userName;
        userNameInput.readOnly = true; // 읽기 전용 설정
        userNameCell.appendChild(userNameInput);
        row.appendChild(userNameCell);

        // 유저 ID
        let userIdCell = document.createElement("td");
        let userIdInput = document.createElement("input");
        userIdInput.type = "text";
        userIdInput.value = data.userId;
        userIdInput.readOnly = true; // 읽기 전용 설정
        userIdCell.appendChild(userIdInput);
        row.appendChild(userIdCell);

        // 유저 role
        let userRoleCell = document.createElement("td");
        let userRoleSelect = document.createElement("select");
        // 옵션 추가
        let userRoleOption = document.createElement("option");
        userRoleOption.value = userRole.role_id;
        userRoleOption.textContent = userRole.role_name;
        // 셀렉트 박스 설정
        userRoleSelect.disabled = true; // 비활성화
        userRoleSelect.appendChild(userRoleOption);

        userRoleCell.appendChild(userRoleSelect);
        row.appendChild(userRoleCell);

        // 유저 role
        let userPositionCell = document.createElement("td");
        let userPositionSelect = document.createElement("select");
        // 옵션 추가
        let userPositionOption = document.createElement("option");
        userPositionOption.value = userPosition.position_id;
        userPositionOption.textContent = userPosition.position_name;
        userPositionSelect.appendChild(userPositionOption);

        // 셀렉트 박스 설정
        userPositionSelect.disabled = true; // 비활성화
        userPositionCell.appendChild(userPositionSelect);
        row.appendChild(userPositionCell);

        // 유저 생년월일
        let userBirthdayCell = document.createElement("td");
        let userBirthdayInput = document.createElement("input");
        userBirthdayInput.type = "date";
        userBirthdayInput.max = "9999-12-31";
        userBirthdayInput.value = data.birthday;
        userBirthdayInput.readOnly = true; // 읽기 전용 설정
        userBirthdayCell.appendChild(userBirthdayInput);
        row.appendChild(userBirthdayCell);

        // 생성일
        let userCreatedAtCell = document.createElement("td");
        userCreatedAtCell.textContent = data.createdAt;
        row.appendChild(userCreatedAtCell);

        // 편집 버튼
        let editButtonCell = document.createElement("td");
        let editButton = document.createElement("button");
        editButton.textContent = "편집";
        // 편집 버튼에 이벤트 리스너 추가
        editButton.addEventListener("click", function () {
            alert("개발 중입니다.");

            // // 입력창 수정 가능하도록 설정
            // userBirthdayInput.readOnly = false;
            // userNameInput.readOnly = false;
            // userIdInput.readOnly = false;
            // userRoleSelect.disabled = false;
            // userPositionSelect.disabled = false;
            // // 편집 버튼과 저장 버튼 보이지 않도록 설정
            // editButton.style.display = "none";
            // delButton.style.display = "none";
            // saveButton.style.display = "inline-block";
            // cancelButton.style.display = "inline-block";
        });


        // 편집 버튼
        let delButton = document.createElement("button");
        delButton.textContent = "삭제";
        // 편집 버튼에 이벤트 리스너 추가
        delButton.addEventListener("click", function () {
            if (confirm(data.userName + " 님의 정보를 삭제하시겠습니까")) {
                delUser(data.userId);
            }
        });

        // 저장 버튼
        let saveButton = document.createElement("button");
        saveButton.textContent = "저장";
        saveButton.style.display = "none"; // 초기에는 보이지 않도록 설정
        // 저장 버튼에 이벤트 리스너 추가
        saveButton.addEventListener("click", function () {
            if (confirm(data.userName + " 님의 정보를 수정하시겠습니까")) {
                // 입력창 수정 가능하도록 설정
                userBirthdayInput.readOnly = true;
                userNameInput.readOnly = true;
                userIdInput.readOnly = true;
                userRoleSelect.disabled = true;
                userPositionSelect.disabled = true;
                // 편집 버튼과 저장 버튼 숨김
                editButton.style.display = "inline-block";
                delButton.style.display = "inline-block";
                saveButton.style.display = "none";
                cancelButton.style.display = "none";

                // if (!categoryNameInput.value) {
                //     alert("카테고리 명을 확인해주세요.")
                //     userNameInput.focus();
                // }
                //
                // editCategory(data.category_id, categoryNameInput.value);
            } else {
                // 입력창 수정 가능하도록 설정
                userBirthdayInput.readOnly = true;
                userNameInput.readOnly = true;
                userIdInput.readOnly = true;
                userRoleSelect.disabled = true;
                userPositionSelect.disabled = true;
                // 편집 버튼과 저장 버튼 숨김
                editButton.style.display = "inline-block";
                delButton.style.display = "inline-block";
                saveButton.style.display = "none";
                cancelButton.style.display = "none";
            }
        });

        // 취소 버튼
        let cancelButton = document.createElement("button");
        cancelButton.textContent = "취소";
        cancelButton.style.display = "none"; // 초기에는 보이지 않도록 설정
        // 취소 버튼에 이벤트 리스너 추가
        cancelButton.addEventListener("click", function () {
            // 입력창 수정 가능하도록 설정
            userBirthdayInput.readOnly = true;
            userNameInput.readOnly = true;
            userIdInput.readOnly = true;
            userRoleSelect.disabled = true;
            userPositionSelect.disabled = true;
            // 편집 버튼과 저장 버튼 숨김
            editButton.style.display = "inline-block";
            delButton.style.display = "inline-block";
            saveButton.style.display = "none";
            cancelButton.style.display = "none";

        });


        // 편집 버튼만 초기에 보이도록 설정
        editButtonCell.appendChild(editButton);
        if (userRole.role_name !== "ROLE_ADMIN") {
            editButtonCell.appendChild(delButton);
        }
        editButtonCell.appendChild(saveButton);
        editButtonCell.appendChild(cancelButton);
        row.appendChild(editButtonCell);
        userBody.appendChild(row)
    });
}

function delUser(userId) {
    // 세션 스토리지에서 JWT 토큰 가져오기
    const jwtToken = localStorage.getItem('jwtToken');

    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwtToken
    };

    if (!jwtToken) {
        alert("로그인을 다시 해주세요.")
        window.location.assign("/loginFrom");
        return;
    }
    console.log(userId);

    fetch(`/admin/api/scheduleUser/delScheduleUser/${userId}`, {
        method: "GET",
        headers: headers,
        redirect: 'follow',
    }).then(response => {
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
                selectAll();
                document.getElementById("selectUser_input").value = "";
            } else if (resData.resultCode === "403") {
                alert("로그아웃 되었습니다. 다시 로그인 해주세요.");
                return window.location.assign("/logout");
            } else if (resData.resultCode === "204") {
                alert(resData.errorMessage);
                document.getElementById("selectUser_input").value = "";
                nonUserRow();
            }
        })
        .catch(error => {
            console.log(error);
        })



}
document.getElementById("backBtn").addEventListener('click',function (){
    window.history.back();
})
