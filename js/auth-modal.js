// 트립페이지 로그인/회원가입 모달 제어
document.addEventListener('DOMContentLoaded', function() {
    console.log('트립페이지 인증 모달 시스템 로드됨');
    
    // 모달 요소들
    const modal = document.getElementById('authModal');
    const loginBtn = document.getElementById('loginBtn');
    const closeBtn = document.getElementById('authCloseBtn');
    
    // 단계별 요소들
    const emailStep = document.getElementById('emailStep');
    const loginStep = document.getElementById('loginStep');
    const registerStep = document.getElementById('registerStep');
    const agreementStep = document.getElementById('agreementStep');
    
    // 폼 요소들
    const emailForm = document.getElementById('emailForm');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const agreementForm = document.getElementById('agreementForm');
    
    // 현재 상태
    let currentStep = 'email';
    let userEmail = '';
    let userData = {};
    
    // 모달 열기
    loginBtn.addEventListener('click', function() {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // 스크롤 방지
        showStep('email');
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
    
    // 이메일 폼 제출
    emailForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('userEmail').value;
        
        if (validateEmail(email)) {
            userEmail = email;
            // 실제로는 서버에서 기존 회원 여부를 확인해야 함
            // 여기서는 간단하게 이메일 형식만 확인
            if (email === 'demo@trippage.com') {
                showStep('login');
            } else {
                showStep('agreement');
            }
        }
    });
    
    // 로그인 폼 제출
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const password = document.getElementById('loginPassword').value;
        
        if (password === '123456') {
            // 실제로는 서버에 로그인 요청을 보내야 함
            console.log('로그인 시도:', { email: userEmail, password: password });
            
            // 로그인 성공 시 사용자 정보 저장
            const userInfo = {
                name: '홍길동',
                email: userEmail,
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
            showError('loginError', '비밀번호가 올바르지 않습니다. (데모: 123456)');
        }
    });
    
    // 약관 동의 폼 제출 - 기본 정보 입력 단계로 이동
    document.getElementById('nextToAgreement').addEventListener('click', function(e) {
        e.preventDefault();
        
        if (validateAgreementForm()) {
            showStep('register');
        }
    });
    
    // 뒤로가기 버튼 (약관 동의 단계에서)
    document.getElementById('backToEmail').addEventListener('click', function() {
        showStep('email');
    });
    
    // 뒤로가기 버튼 (기본 정보 입력 단계에서)
    document.getElementById('backToAgreement').addEventListener('click', function() {
        showStep('agreement');
    });
    
    // 회원가입 폼 제출
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(registerForm);
        userData = {
            email: userEmail,
            name: formData.get('name'),
            phone: formData.get('phone'),
            age: formData.get('age'),
            gender: formData.get('gender'),
            password: formData.get('password'),
            passwordConfirm: formData.get('passwordConfirm')
        };
        
        if (validateRegisterForm(userData)) {
            // 실제로는 서버에 회원가입 요청을 보내야 함
            console.log('회원가입 시도:', userData);
            
            // 회원가입 성공 시 사용자 정보 저장
            const userInfo = {
                name: userData.name,
                email: userEmail,
                joinDate: new Date().toISOString().split('T')[0]
            };
            
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
            localStorage.setItem('userToken', 'demo-token-' + Date.now());
            
            // 프로필 메뉴 업데이트
            updateProfileMenu(userInfo);
            
            alert('회원가입 성공! (데모)');
            closeModal();
        }
    });
    
    // 비밀번호 확인 실시간 검증
    document.getElementById('userPasswordConfirm').addEventListener('input', function() {
        const password = document.getElementById('userPassword').value;
        const confirmPassword = this.value;
        
        if (confirmPassword && password !== confirmPassword) {
            showError('passwordError', '비밀번호가 일치하지 않습니다.');
        } else {
            hideError('passwordError');
        }
    });
    
    // 회원가입 완료 버튼 이벤트 리스너
    document.getElementById('completeRegistration').addEventListener('click', function(e) {
        e.preventDefault();
        
        if (validateAgreementForm()) {
            // 회원가입 성공 시 사용자 정보 저장
            const userInfo = {
                name: userData.name || '사용자',
                email: userEmail,
                joinDate: new Date().toISOString().split('T')[0]
            };
            
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
            localStorage.setItem('userToken', 'demo-token-' + Date.now());
            
            // 프로필 메뉴 업데이트
            updateProfileMenu(userInfo);
            
            alert('회원가입 성공! (데모)');
            closeModal();
        }
    });
    
    // 모달 닫기 함수
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // 스크롤 복원
        resetForm();
        showStep('email');
        
        // 모달이 닫힌 후 프로필 메뉴 상태 확인
        setTimeout(() => {
            const isLoggedIn = localStorage.getItem('isLoggedIn');
            if (isLoggedIn === 'true') {
                // 사용자가 로그인된 경우 프로필 메뉴 업데이트
                const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
                updateProfileMenu(userInfo);
            }
        }, 100);
    }
    
    // 프로필 메뉴 업데이트 함수
    function updateProfileMenu(userInfo) {
        // 프로필 정보 업데이트
        const profileName = document.querySelector('.profile_details h4');
        const profileEmail = document.querySelector('.profile_details p');
        
        if (profileName && profileEmail) {
            profileName.textContent = userInfo.name || '사용자';
            profileEmail.textContent = userInfo.email || '';
        }
        
        // 프로필 메뉴를 로그인된 사용자용으로 변경
        const profileMenu = document.querySelector('.profile_menu');
        if (profileMenu) {
            profileMenu.innerHTML = `
                <li><a href="member/profile.html"><i class="icon">👤</i> 마이페이지</a></li>
                <li><a href="member/edit.html"><i class="icon">⚙️</i> 프로필 관리</a></li>
                <li><a href="wishlist.html"><i class="icon">❤️</i> 찜한 상품</a></li>
                <li><a href="recent-view-product.html"><i class="icon">👁️</i> 최근 본 상품</a></li>
                <li><a href="order/list.html"><i class="icon">📦</i> 주문내역</a></li>
                <li><a href="#" id="logoutBtn"><i class="icon">🚪</i> 로그아웃</a></li>
            `;
            
            // 로그아웃 기능 추가
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    if (confirm('정말 로그아웃 하시겠습니까?')) {
                        logout();
                    }
                });
            }
        }
        
        // 헤더의 로그인/회원가입 링크 숨기기
        const loginLinks = document.querySelectorAll('.xans-layout-statelogoff');
        loginLinks.forEach(link => {
            link.style.display = 'none';
        });
    }
    
    // 로그아웃 함수
    function logout() {
        // 인증 데이터 제거
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userInfo');
        localStorage.removeItem('userToken');
        
        // 프로필 메뉴를 비로그인 사용자용으로 변경
        const profileMenu = document.querySelector('.profile_menu');
        if (profileMenu) {
            profileMenu.innerHTML = `
                <li><a href="member/login.html"><i class="icon">🔑</i> 로그인</a></li>
                <li><a href="member/agreement.html"><i class="icon">📝</i> 회원가입</a></li>
                <li><a href="order/list.html"><i class="icon">📦</i> 주문조회</a></li>
                <li><a href="recent-view-product.html"><i class="icon">👁️</i> 최근 본 상품</a></li>
            `;
        }
        
        // 프로필 정보 초기화
        const profileName = document.querySelector('.profile_details h4');
        const profileEmail = document.querySelector('.profile_details p');
        
        if (profileName && profileEmail) {
            profileName.textContent = '사용자';
            profileEmail.textContent = '로그인이 필요합니다';
        }
        
        // 헤더의 로그인/회원가입 링크 표시
        const loginLinks = document.querySelectorAll('.xans-layout-statelogoff');
        loginLinks.forEach(link => {
            link.style.display = 'inline-block';
        });
        
        alert('로그아웃되었습니다.');
    }
    
    // 단계별 표시 함수
    function showStep(step) {
        // 모든 단계 숨기기
        emailStep.style.display = 'none';
        loginStep.style.display = 'none';
        registerStep.style.display = 'none';
        agreementStep.style.display = 'none';
        
        // 현재 단계 표시
        switch(step) {
            case 'email':
                emailStep.style.display = 'block';
                currentStep = 'email';
                break;
            case 'login':
                loginStep.style.display = 'block';
                currentStep = 'login';
                // 이메일 표시
                document.querySelector('#loginStep p').textContent = userEmail;
                break;
            case 'register':
                registerStep.style.display = 'block';
                currentStep = 'register';
                break;
            case 'agreement':
                agreementStep.style.display = 'block';
                currentStep = 'agreement';
                break;
        }
    }
    
    // 이메일 검증
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('emailError', '올바른 이메일 형식을 입력해주세요.');
            return false;
        }
        hideError('emailError');
        return true;
    }
    
    // 회원가입 폼 검증
    function validateRegisterForm(data) {
        // 필수 필드 확인
        if (!data.name || !data.phone || !data.age || !data.gender || !data.password) {
            alert('모든 필수 항목을 입력해주세요.');
            return false;
        }
        
        // 비밀번호 확인
        if (data.password !== data.passwordConfirm) {
            showError('passwordError', '비밀번호가 일치하지 않습니다.');
            return false;
        }
        
        // 비밀번호 길이 확인
        if (data.password.length < 6) {
            alert('비밀번호는 6자 이상이어야 합니다.');
            return false;
        }
        
        return true;
    }
    
    // 약관 동의 폼 검증
    function validateAgreementForm() {
        // 필수 약관 동의 확인
        const requiredCheckboxes = document.querySelectorAll('.required-checkbox');
        for (let checkbox of requiredCheckboxes) {
            if (!checkbox.checked) {
                alert('필수 약관에 동의해주세요.');
                return false;
            }
        }
        
        return true;
    }
    
    // 에러 메시지 표시
    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
    
    // 에러 메시지 숨기기
    function hideError(elementId) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }
    
    // 폼 초기화
    function resetForm() {
        emailForm.reset();
        loginForm.reset();
        registerForm.reset();
        agreementForm.reset();
        hideError('emailError');
        hideError('loginError');
        hideError('passwordError');
        userEmail = '';
        userData = {};
    }
    
    // 뒤로가기 버튼 (로그인 단계에서)
    const backToEmailBtn = document.createElement('button');
    backToEmailBtn.type = 'button';
    backToEmailBtn.className = 'auth-back-btn';
    backToEmailBtn.innerHTML = '← 뒤로';
    backToEmailBtn.addEventListener('click', function() {
        showStep('email');
    });
    
    // 로그인 단계에 뒤로가기 버튼 추가
    const loginStepTitle = document.querySelector('#loginStep .auth-step-title');
    if (loginStepTitle) {
        loginStepTitle.appendChild(backToEmailBtn);
    }
    
    // 전체 동의 체크박스 기능
    const agreeAllCheckbox = document.getElementById('agreeAll');
    if (agreeAllCheckbox) {
        agreeAllCheckbox.addEventListener('change', function() {
            const allCheckboxes = document.querySelectorAll('#agreementForm input[type="checkbox"]');
            allCheckboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }
    
    // 약관 내용 토글 기능
    const toggleButtons = document.querySelectorAll('.btn-toggle');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const content = document.getElementById(targetId);
            if (content) {
                if (content.style.display === 'none' || !content.style.display) {
                    content.style.display = 'block';
                    this.textContent = '내용접기';
                } else {
                    content.style.display = 'none';
                    this.textContent = '내용보기';
                }
            }
        });
    });
    
    console.log('인증 모달 시스템 초기화 완료');
});
