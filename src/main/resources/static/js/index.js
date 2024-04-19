document.addEventListener("DOMContentLoaded", function() {
    // URL에서 쿼리 문자열을 추출합니다.
    let queryString = window.location.search;

    // URL의 쿼리 문자열을 객체로 파싱합니다.
    let params = new URLSearchParams(queryString);

    // "jwt" 파라미터의 값을 가져옵니다.
    let jwtToken = params.get('jwt');

    if(jwtToken){
        // 가져온 JWT 토큰을 확인합니다.
        console.log("JWT 토큰:", jwtToken);
        // 가져온 JWT 토큰을 세션 스토리지에 저장합니다.
        sessionStorage.setItem('jwtToken', jwtToken);
        // 페이지를 리다이렉트합니다.
        window.location.href = "/";
    }
});