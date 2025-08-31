// 트립페이지 로그인/회원가입 모달 제어
document.addEventListener('DOMContentLoaded', function() {
    console.log('트립페이지 인증 모달 시스템 로드됨');
    
    // 모달 요소들
    const modal = document.getElementById('authModal');
    const closeBtn = document.getElementById('authCloseBtn');
    
    // 폼 요소들
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    // 토글 버튼들
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    
    // 디버깅 정보 출력
    console.log('모달 요소:', modal);
    console.log('닫기 버튼:', closeBtn);
    console.log('로그인 폼:', loginForm);
    console.log('회원가입 폼:', registerForm);
    console.log('토글 버튼들:', toggleBtns);
    
    // 현재 상태
    let currentMode = 'login';
    
    // 토글 버튼 클릭 이벤트
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const mode = this.dataset.mode;
            switchMode(mode);
        });
    });
    
    // 모달 닫기
    closeBtn.addEventListener('click', function() {
        closeModal();
    });
    
    // 모달 외부 클릭 시 닫기
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // ESC 키로 모달 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeModal();
        }
    });
    
    // 로그인/회원가입 링크 클릭 시 모달 열기
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('show-auth-modal')) {
        e.preventDefault();
            console.log('인증 모달 열기 시도');
            openModal();
        }
    });
    
    // 로그인 폼 제출
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        const password = e.target.querySelector('input[type="password"]').value;
        
        // 간단한 유효성 검사
        if (!email || !password) {
            alert('모든 필드를 입력해주세요.');
            return;
        }
        
        // 데모 로그인 (실제로는 서버에 요청)
        if (email === 'demo@trippage.com' && password === '123456') {
            const userInfo = {
                name: '홍길동',
                email: email,
                joinDate: new Date().toISOString().split('T')[0]
            };
            
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
            localStorage.setItem('userToken', 'demo-token-' + Date.now());
            
            // 프로필 메뉴 업데이트
            updateProfileMenu(userInfo);
            
            alert('로그인 성공! (데모)');
            closeModal();
        } else {
            alert('이메일 또는 비밀번호가 올바르지 않습니다.\n데모 계정: demo@trippage.com / 123456');
        }
    });
    
    // 회원가입 폼 제출
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = e.target.querySelector('input[type="text"]').value;
        const email = e.target.querySelector('input[type="email"]').value;
        const password = e.target.querySelectorAll('input[type="password"]')[0].value;
        const passwordConfirm = e.target.querySelectorAll('input[type="password"]')[1].value;
        const agreeAll = e.target.querySelector('#agreeAll').checked;
        
        // 유효성 검사
        if (!name || !email || !password || !passwordConfirm) {
            alert('모든 필드를 입력해주세요.');
            return;
        }
        
        if (password !== passwordConfirm) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }
        
        if (password.length < 6) {
            alert('비밀번호는 6자 이상이어야 합니다.');
            return;
        }
        
        if (!agreeAll) {
            alert('모든 약관에 동의해주세요.');
            return;
        }
        
        // 데모 회원가입 (실제로는 서버에 요청)
            const userInfo = {
            name: name,
            email: email,
                joinDate: new Date().toISOString().split('T')[0]
            };
            
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
            localStorage.setItem('userToken', 'demo-token-' + Date.now());
            
            // 프로필 메뉴 업데이트
            updateProfileMenu(userInfo);
            
            alert('회원가입 성공! (데모)');
            closeModal();
    });
    
    // 모드 전환 함수
    function switchMode(mode) {
        currentMode = mode;
        
        // 모든 토글 버튼에서 active 클래스 제거
        toggleBtns.forEach(btn => btn.classList.remove('active'));
        
        // 클릭된 버튼에 active 클래스 추가
        document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
        
        // 모든 폼 숨기기
        loginForm.classList.remove('active');
        registerForm.classList.remove('active');
        
        // 선택된 모드의 폼 표시
        if (mode === 'login') {
            loginForm.classList.add('active');
        } else if (mode === 'register') {
            registerForm.classList.add('active');
        }
    }
    
    // 모달 열기 함수
    function openModal() {
        console.log('모달 열기 함수 실행');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // 기본적으로 로그인 모드로 시작
            switchMode('login');
        } else {
            console.error('모달 요소를 찾을 수 없습니다');
        }
    }
    
    // 모달 닫기 함수
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // 폼 초기화 - 실제 form 요소를 찾아서 리셋
        const loginFormElement = loginForm.querySelector('form');
        const registerFormElement = registerForm.querySelector('form');
        
        if (loginFormElement) {
            loginFormElement.reset();
        }
        if (registerFormElement) {
            registerFormElement.reset();
        }
        
        // 로그인 모드로 리셋
        switchMode('login');
    }
    
    // 프로필 메뉴 업데이트
    function updateProfileMenu(userInfo) {
        const profileMenu = document.querySelector('.top_mypage');
        if (profileMenu) {
            profileMenu.innerHTML = `
                <div class="profile-dropdown">
                    <button class="profile-btn">
                        <span class="profile-name">${userInfo.name}</span>
                        <i class="profile-arrow">▼</i>
                    </button>
                    <ul class="profile-menu">
                        <li><a href="member/profile.html">👤 프로필</a></li>
                        <li><a href="order/list.html">📦 주문내역</a></li>
                        <li><a href="javascript:;" class="logout-btn">🚪 로그아웃</a></li>
                    </ul>
                </div>
            `;
            
            // 로그아웃 이벤트 추가
            const logoutBtn = profileMenu.querySelector('.logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', function() {
                        logout();
                });
            }
        }
    }
    
    // 로그아웃 함수
    function logout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userInfo');
        localStorage.removeItem('userToken');
        
        // 프로필 메뉴를 로그인 버튼으로 변경
        const profileMenu = document.querySelector('.top_mypage');
        if (profileMenu) {
            profileMenu.innerHTML = `
                <a href="javascript:;" class="show-auth-modal">🔐 로그인/회원가입</a>
            `;
        }
        
        alert('로그아웃되었습니다.');
    }
    
    // 페이지 로드 시 로그인 상태 확인
    function checkLoginStatus() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const userInfo = localStorage.getItem('userInfo');
        
        if (isLoggedIn && userInfo) {
            try {
                const user = JSON.parse(userInfo);
                updateProfileMenu(user);
            } catch (e) {
                console.error('사용자 정보 파싱 오류:', e);
                logout();
            }
        }
    }
    
    // 초기화
    checkLoginStatus();
});
