function submitForm(event) {
    event.preventDefault(); // 기본 폼 제출 동작 방지

    const form = event.target;
    const formData = new FormData(form);

    fetch('/api/auth/login', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Login failed');
            }
            return response.json();
        })
        .then(data => {
            // 로그인 성공 시 처리
            console.log('Login successful:', data);
            // 여기서 필요한 추가 작업을 수행합니다.
        })
        .catch(error => {
            // 로그인 실패 시 처리
            console.error('Login failed:', error);
            // 여기서 사용자에게 오류를 알리는 등의 처리를 수행합니다.
        });
}
