document.addEventListener("DOMContentLoaded", function() {

    // 로컬 스토리지에서 JWT 토큰을 가져옵니다.
    const storedJwtToken = localStorage.getItem('jwtToken');

    if(storedJwtToken){
        let userName = document.getElementById("userName");
        let headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + storedJwtToken
        };
        fetch("/user/api/checkUserInfo/retrievesUserInfo",{
            method: 'GET',
            headers:headers,
            credentials: 'include' // 쿠키를 자동으로 함께 보냄
        }).then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            return response.json();
        }).then(resData => {
            if (resData.resultCode === "200") {
                const userName = document.getElementById("userName");
                const userPosition = document.getElementById("userPosition");
                let userInfo = resData.data;
                userName.innerText = userInfo.user_name;
                userPosition.innerText = userInfo.userPositionName;
                let userRole= resData.data.userRole;
                const calendar_div = document.getElementById("calendar_div");
                // mainDiv 안에 새로운 a 태그를 추가합니다.
                const anchor1 = document.createElement("button");
                anchor1.textContent = "캘린더"; // 링크에 보여질 텍스트를 설정하세요.
                anchor1.className="mainbutton";
                // 취소 버튼에 이벤트 리스너 추가
                anchor1.addEventListener("click", function () {
                    window.location.assign("/user/calendarView");
                });
                calendar_div.appendChild(anchor1); // mainDiv 안에 추가합니다.
                if("ROLE_ADMIN" === userRole) {
                    const adminPage_div = document.getElementById("adminPage_div");
                    // 두 번째 a 태그도 추가할 수 있어요.
                    const anchor2 = document.createElement("button");
                    anchor2.textContent = "관리자 페이지"; // 링크에 보여질 텍스트를 설정하세요.
                    anchor2.className="mainbutton";
                    anchor2.addEventListener('click',function () {
                        window.location.assign("/admin/adminPage");
                    })
                    adminPage_div.appendChild(anchor2); // mainDiv 안에 추가합니다.
                }
                document.getElementById("loginButton").style.display = "none";
                document.getElementById("logoutBtn").style.display = "block";
            }

        }).catch(error => {
            console.error(error);
        });
    }
    // 버튼 클릭 이벤트를 처리할 JavaScript 코드
    const loginButton = document.getElementById("loginButton");
    loginButton.addEventListener("click", function() {
        // 로그인 버튼을 클릭했을 때 실행될 코드를 작성하세요.
        // 예를 들어, 페이지를 이동하거나 로그인 폼을 보여줄 수 있습니다.
        window.location.href = "/loginFrom";
    });

    // 버튼 클릭 이벤트를 처리할 JavaScript 코드
    const logoutBtn = document.getElementById("logoutBtn");
    logoutBtn.addEventListener("click", function() {
        // 로그인 버튼을 클릭했을 때 실행될 코드
        localStorage.clear(); // 로컬 스토리지 비우기
        window.location.href="/logout"
    });
});

