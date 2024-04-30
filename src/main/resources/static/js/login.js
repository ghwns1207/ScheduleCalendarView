// function submitForm() {
//
//     const userId = document.getElementById('userid').value;
//     const userPW = document.getElementById('userPW').value;
//
//     const loginData = {
//         username: userId,
//         password: userPW
//     };
//
//     fetch('/api/auth/login', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(loginData)
//     })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Login failed');
//             }
//             return response.json();
//         })
//         .then(data => {
//             // 응답으로 받은 JSON 데이터에서 JWT 토큰 추출
//             const jwtToken = data.jwtToken;
//             // JWT 토큰을 세션 스토리지에 저장하거나 다른 작업을 수행할 수 있음
//             localStorage.setItem('jwtToken', jwtToken);
//         })
//         .catch(error => {
//             // 로그인 실패 시 처리
//             console.error('Login failed:', error);
//             // 여기서 사용자에게 오류를 알리는 등의 처리를 수행합니다.
//         });
// }
