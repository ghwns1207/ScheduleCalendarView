
document.addEventListener('DOMContentLoaded', function () {

    const jwtToken = localStorage.getItem('jwtToken');

    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwtToken
    };

    fetch(`/admin/api/retrievesAllSchedule`, {
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
        .then(resData=> {
            if(resData.resultCode === "200"){
                console.log(resData.data)
            }else if(resData.resultCode === "204"){
                console.log(resData.errorMessage)
            }else if (resData.resultCode === "403 "){
                alert("로그아웃 되었습니다. 다시 로그인 해주세요.");
                return document.window.location.assign("/loginFrom");
            }
        })
        .catch(error => {
            console.log(error);
        });

});

document.getElementById("selectNameType").style.display = "none";
document.getElementById("selectCategoryType").style.display = "none";
function toggleDiv(divId, radio) {
    // 모든 디브를 숨깁니다.
    document.getElementById("selectNameType").style.display = "none";
    document.getElementById("selectCategoryType").style.display = "none";

    // 선택된 라디오 버튼에 따라 해당하는 디브를 보이게 합니다.
    if (radio.checked) {
        document.getElementById(divId).style.display = "block";
    }
}

