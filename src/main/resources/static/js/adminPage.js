document.addEventListener("DOMContentLoaded", function() {
    // 세션 스토리지에서 JWT 토큰 가져오기
    const jwtToken = localStorage.getItem('jwtToken');

    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwtToken
    };

    fetch("/admin/api/checkAdmin/retrievesAdminInfo", {
        method: 'GET',
        headers: headers,
        credentials: 'include',// 쿠키를 자동으로 함께 보냄)
        redirect:"follow",
    })
        .then(response=>{
            if (!response.ok) {
                throw new Error('Failed to fetch data');
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
                let userInfo = resData.data;
                document.getElementById("userName").innerText= userInfo.user_name;
            }else if (resData.resultCode === "403 "){
                alert("로그아웃 되었습니다. 다시 로그인 해주세요.");
                return window.location.assign("/logout");
            }
        })
        .catch(err => {
            console.error(err);
        });
});

document.getElementById("addUserBtn").addEventListener("click",function() {
    window.location.assign("/admin/signUp");
});
// document.getElementById("scheduleBtn").addEventListener("click",function() {
//     window.location.assign("/admin/schedule");
// });
document.getElementById("category").addEventListener("click",function() {
    window.location.assign("/admin/category");
});
document.getElementById("position").addEventListener("click",function() {
    window.location.assign("/admin/position");
});
document.getElementById("userInfoBtn").addEventListener("click",function() {
    window.location.assign("/admin/userInfo");
});

document.getElementById("moveCal").addEventListener("click",function() {
    window.location.assign("/user/calendarView");
});
