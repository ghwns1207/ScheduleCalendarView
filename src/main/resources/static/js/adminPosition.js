document.addEventListener('DOMContentLoaded', function () {

    // 세션 스토리지에서 JWT 토큰 가져오기
    const jwtToken = localStorage.getItem('jwtToken');

    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwtToken
    };

    fetch("/admin/api/schedulePosition/retrievesPosition", {
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
                createPositionRow(resData.data);
            } else if (resData.resultCode === "403") {
                alert("로그아웃 되었습니다. 다시 로그인 해주세요.");
                return window.location.assign("/logout");
            } else if (resData.resultCode === "204") {
                alert(resData.errorMessage);
                const positionBody = document.getElementById("positionBody");
                positionBody.innerHTML = '';
            }
        })
        .catch(error => {
            console.error(error);
        })
});

function createPositionRow(positionData){
    const positionBody = document.getElementById("positionBody");
    positionBody.innerHTML = '';

    // 데이터 배열을 순회하면서 테이블 행을 생성합니다.
    positionData.forEach(function (data) {
        let positionSave = data.position_name;
        let row = document.createElement("tr");
        // 카테고리 ID
        let positionIdCell = document.createElement("td");
        positionIdCell.textContent = data.position_id;
        row.appendChild(positionIdCell);

        // 카테고리 명
        let positionNameCell = document.createElement("td");
        let positionNameInput = document.createElement("input");
        positionNameInput.type = "text";
        positionNameInput.value = data.position_name;
        positionNameInput.readOnly = true; // 읽기 전용 설정
        positionNameCell.appendChild(positionNameInput);
        row.appendChild(positionNameCell);

        // 편집 버튼
        let editButtonCell = document.createElement("td");
        let editButton = document.createElement("button");
        editButton.textContent = "편집";
        editButton.id = "editButton_" + data.position_id; // 고유한 ID 부여
        // 편집 버튼에 이벤트 리스너 추가
        editButton.addEventListener("click", function () {
            // 입력창 수정 가능하도록 설정
            positionNameInput.readOnly = false;
            positionNameInput.focus();
            // 편집 버튼과 저장 버튼 보이지 않도록 설정
            editButton.style.display = "none";
            saveButton.style.display = "inline-block";
            cancelButton.style.display = "inline-block";
        });

        // 저장 버튼
        let saveButton = document.createElement("button");
        saveButton.textContent = "저장";
        saveButton.style.display = "none"; // 초기에는 보이지 않도록 설정
        saveButton.id = "saveButton_" + data.position_id; // 고유한 ID 부여
        // 저장 버튼에 이벤트 리스너 추가
        saveButton.addEventListener("click", function () {
            if(confirm("직급을 수정하시겠습니까")) {
                // 입력창 읽기 전용 설정
                positionNameInput.readOnly = true;
                // 편집 버튼과 저장 버튼 숨김
                editButton.style.display = "inline-block";
                saveButton.style.display = "none";
                cancelButton.style.display = "none";

                if(!positionNameInput.value){
                    alert("직급 명을 확인해주세요.")
                    positionNameInput.focus();
                }

                editCategory(data.position_id ,positionNameInput.value);
            }else {
                positionNameInput.readOnly = true;
                // 편집 버튼과 저장 버튼 숨김
                editButton.style.display = "inline-block";
                saveButton.style.display = "none";
                cancelButton.style.display = "none";
                positionNameInput.value = positionSave;
            }


        });

        // 취소 버튼
        let cancelButton = document.createElement("button");
        cancelButton.textContent = "취소";
        cancelButton.style.display = "none"; // 초기에는 보이지 않도록 설정
        cancelButton.id = "cancelButton_" + data.position_id; // 고유한 ID 부여
        // 취소 버튼에 이벤트 리스너 추가
        cancelButton.addEventListener("click", function () {
            // 입력창 읽기 전용 설정
            positionNameInput.readOnly = true;
            // 편집 버튼과 저장 버튼 숨김
            editButton.style.display = "inline-block";
            saveButton.style.display = "none";
            cancelButton.style.display = "none";
            positionNameInput.value = positionSave;
        });

        // 편집 버튼만 초기에 보이도록 설정
        editButtonCell.appendChild(editButton);
        editButtonCell.appendChild(saveButton);
        editButtonCell.appendChild(cancelButton);
        row.appendChild(editButtonCell);
        positionBody.appendChild(row)
    });
}

function editPosition(id,position){
    // 세션 스토리지에서 JWT 토큰 가져오기
    const jwtToken = localStorage.getItem('jwtToken');

    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwtToken
    };

    fetch( `/admin/api/schedulePosition/editSchedulePosition/${id}/${position}`, {
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
        .then(resData=>{
            if (resData.resultCode === "200") {
                alert("카테고리가 편집되었습니다");
                createPositionRow(resData.data);
            }else if (resData.resultCode === "403") {
                alert("로그아웃 되었습니다. 다시 로그인 해주세요.");
                return window.location.assign("/logout");
            }else{
                alert(resData.errorMessage);
            }
        })
        .catch(error => {
            console.error(error);
        })

}


document.getElementById("backBtn").addEventListener('click',function (){
    window.history.back();
})

function addBtnCen(){
    document.getElementById("addPosition").value ="";
}

function addBtnSave(){
    let addPosition = document.getElementById("addPosition").value;
    if(!addPosition){
        alert("직급명을 입력해주세요")
        document.getElementById("addPosition").focus();
        return;
    }
    // 세션 스토리지에서 JWT 토큰 가져오기
    const jwtToken = localStorage.getItem('jwtToken');

    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwtToken
    };
    fetch( `/admin/api/schedulePosition/addSchedulePosition/${addPosition}`, {
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
                alert("직급이 추가되었습니다");
                createPositionRow(resData.data);
            }else if (resData.resultCode === "403") {
                alert("로그아웃 되었습니다. 다시 로그인 해주세요.");
                return window.location.assign("/logout");
            }else{
                alert(resData.errorMessage);
            }
        })
        .catch(error => {
            console.error(error);
        })
}
