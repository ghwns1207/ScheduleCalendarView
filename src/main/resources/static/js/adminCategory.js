document.addEventListener('DOMContentLoaded', function () {

    // 세션 스토리지에서 JWT 토큰 가져오기
    const jwtToken = localStorage.getItem('jwtToken');

    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwtToken
    };

    fetch("/admin/api/scheduleCategory/retrievesScheduleCategory", {
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
                createCategoryRow(resData.data);

            } else if (resData.resultCode === "403") {
                alert("로그아웃 되었습니다. 다시 로그인 해주세요.");
                return document.window.location.assign("/loginFrom");
            } else if (resData.resultCode === "204") {
                alert(resData.errorMessage);
                const categoryBody = document.getElementById("categoryBody");
                categoryBody.innerHTML = '';
            }
        })
        .catch(error => {
            console.log(error);
        })
});

function createCategoryRow(categoryData){
    const categoryBody = document.getElementById("categoryBody");
    categoryBody.innerHTML = '';

    // 데이터 배열을 순회하면서 테이블 행을 생성합니다.
    categoryData.forEach(function (data) {
        let categorySave = data.category_name;
        let row = document.createElement("tr");
        // 카테고리 ID
        let categoryIdCell = document.createElement("td");
        categoryIdCell.textContent = data.category_id;
        row.appendChild(categoryIdCell);

        // 카테고리 명
        let categoryNameCell = document.createElement("td");
        let categoryNameInput = document.createElement("input");
        categoryNameInput.type = "text";
        categoryNameInput.value = data.category_name;
        categoryNameInput.readOnly = true; // 읽기 전용 설정
        categoryNameCell.appendChild(categoryNameInput);
        row.appendChild(categoryNameCell);

        // 편집 버튼
        let editButtonCell = document.createElement("td");
        let editButton = document.createElement("button");
        editButton.textContent = "편집";
        editButton.id = "editButton_" + data.category_id; // 고유한 ID 부여
        // 편집 버튼에 이벤트 리스너 추가
        editButton.addEventListener("click", function () {
            // 입력창 수정 가능하도록 설정
            categoryNameInput.readOnly = false;
            categoryNameInput.focus();
            // 편집 버튼과 저장 버튼 보이지 않도록 설정
            editButton.style.display = "none";
            saveButton.style.display = "inline-block";
            cancelButton.style.display = "inline-block";
        });

        // 저장 버튼
        let saveButton = document.createElement("button");
        saveButton.textContent = "저장";
        saveButton.style.display = "none"; // 초기에는 보이지 않도록 설정
        saveButton.id = "saveButton_" + data.category_id; // 고유한 ID 부여
        // 저장 버튼에 이벤트 리스너 추가
        saveButton.addEventListener("click", function () {
            if(confirm("카테고리를 수정하시겠습니까")) {
                // 입력창 읽기 전용 설정
                categoryNameInput.readOnly = true;
                // 편집 버튼과 저장 버튼 숨김
                editButton.style.display = "inline-block";
                saveButton.style.display = "none";
                cancelButton.style.display = "none";

                if(!categoryNameInput.value){
                    alert("카테고리 명을 확인해주세요.")
                    categoryNameInput.focus();
                }

                editCategory(data.category_id ,categoryNameInput.value);
            }else {
                categoryNameInput.readOnly = true;
                // 편집 버튼과 저장 버튼 숨김
                editButton.style.display = "inline-block";
                saveButton.style.display = "none";
                cancelButton.style.display = "none";
                categoryNameInput.value = categorySave;
            }


        });

        // 취소 버튼
        let cancelButton = document.createElement("button");
        cancelButton.textContent = "취소";
        cancelButton.style.display = "none"; // 초기에는 보이지 않도록 설정
        cancelButton.id = "cancelButton_" + data.category_id; // 고유한 ID 부여
        // 취소 버튼에 이벤트 리스너 추가
        cancelButton.addEventListener("click", function () {
            // 입력창 읽기 전용 설정
            categoryNameInput.readOnly = true;
            // 편집 버튼과 저장 버튼 숨김
            editButton.style.display = "inline-block";
            saveButton.style.display = "none";
            cancelButton.style.display = "none";
            categoryNameInput.value = categorySave;
        });

        // 편집 버튼만 초기에 보이도록 설정
        editButtonCell.appendChild(editButton);
        editButtonCell.appendChild(saveButton);
        editButtonCell.appendChild(cancelButton);
        row.appendChild(editButtonCell);
        categoryBody.appendChild(row)
    });
}

function editCategory(id,category){
    // 세션 스토리지에서 JWT 토큰 가져오기
    const jwtToken = localStorage.getItem('jwtToken');

    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwtToken
    };

    fetch( `/admin/api/scheduleCategory/editScheduleCategory/${id}/${category}`, {
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
                createCategoryRow(resData.data);
            }else if (resData.resultCode === "403") {
                alert("로그아웃 되었습니다. 다시 로그인 해주세요.");
                return document.window.location.assign("/loginFrom");
            }else{
                alert(resData.errorMessage);
            }
    })
        .catch(error => {
            console.error(error);
        })

}

function addBtnCen(){
    document.getElementById("addCategory").value ="";
}

function addBtnSave(){
    let addCategory = document.getElementById("addCategory").value;
    if(!addCategory){
        alert("카테고리명을 입력해주세요")
        document.getElementById("addCategory").focus();
        return;
    }
    // 세션 스토리지에서 JWT 토큰 가져오기
    const jwtToken = localStorage.getItem('jwtToken');

    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwtToken
    };
    fetch( `/admin/api/scheduleCategory/addScheduleCategory/${addCategory}`, {
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
                alert("카테고리가 추가되었습니다");
                createCategoryRow(resData.data);
            }else if (resData.resultCode === "403") {
                alert("로그아웃 되었습니다. 다시 로그인 해주세요.");
                return document.window.location.assign("/loginFrom");
            }else{
                alert(resData.errorMessage);
            }
        })
        .catch(error => {
            console.error(error);
        })
}
