// 토스 스타일 인증 시스템
let currentUser = null;
let currentEmail = '';
let signupData = {};

jQuery(document).ready(function() {
    console.log('토스 스타일 인증 시스템 로드됨');

    // 초기 로드 플래그 설정
    window.isInitialLoad = true;

    // 모든 페이지에서 동일 UI 사용: 컨테이너 자동 주입
    ensureTossAuthContainer();
    
    // 페이지 로드 시 로그인 상태 복원
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            console.log('저장된 로그인 상태 복원:', currentUser);
            // 초기 로드 시에는 updateLoginStatus 호출하지 않음 (토스트 알림 방지)
            // updateLoginStatus(currentUser);
        } catch (error) {
            console.error('저장된 사용자 정보 파싱 오류:', error);
            localStorage.removeItem('currentUser');
        }
    }
    
    // 초기 상태 설정
    initializeAuthUI();
    
    // 이벤트 리스너 설정
    setupEventListeners();
    
    // 초기 로드 완료 후 플래그 해제
    setTimeout(() => {
        window.isInitialLoad = false;
    }, 1000);
});

// 페이지에 인증 컨테이너가 없으면 동적으로 추가
function ensureTossAuthContainer() {
    if (document.querySelector('.toss-auth-container')) return;
    const container = document.createElement('div');
    container.className = 'toss-auth-container';
    container.innerHTML = [
        '<div class="skeleton-loading" id="skeletonLoading" style="display: none;">',
        '  <div class="skeleton-header"></div>',
        '  <div class="skeleton-input"></div>',
        '  <div class="skeleton-button"></div>',
        '</div>',
        '',
        '<div class="auth-step" id="emailStep">',
        '  <div class="auth-header">',
        '    <h1>안녕하세요!</h1>',
        '    <p>트립페이지에 오신 것을 환영합니다</p>',
        '  </div>',
        '  <div class="auth-body">',
        '    <div class="input-group">',
        '      <label for="emailInput">이메일</label>',
        '      <input type="email" id="emailInput" class="toss-input" placeholder="이메일을 입력해주세요">',
        '      <div class="error-message" id="emailError"></div>',
        '    </div>',
        '        <button class="toss-button" id="continueBtn" disabled>계속하기</button>',
    '    ',
    '    <!-- 소셜 로그인 섹션 -->',
    '    <div class="social-login-section">',
    '      <div class="divider">',
    '        <span>또는</span>',
    '      </div>',
    '      <div class="social-buttons">',
    '                <button class="social-btn google-btn" id="googleLoginBtn">',
          '          <iconify-icon class="social-icon" icon="logos:google-icon" width="20" height="20"></iconify-icon>',
          '          Google로 계속하기',
    '        </button>',
    '                <button class="social-btn kakao-btn" id="kakaoLoginBtn">',
          '          <iconify-icon class="social-icon" icon="logos:kakao" width="20" height="20"></iconify-icon>',
          '          카카오톡으로 계속하기',
    '        </button>',
    '                <button class="social-btn naver-btn" id="naverLoginBtn">',
          '          <iconify-icon class="social-icon" icon="logos:naver" width="20" height="20"></iconify-icon>',
          '          네이버로 계속하기',
    '        </button>',
    '      </div>',
    '    </div>',
    '  </div>',
    '</div>',
        '',
        '<div class="auth-step" id="passwordStep" style="display:none;">',
        '  <div class="auth-header">',
        '    <button class="back-button" id="backToEmail">←</button>',
        '    <h1>비밀번호를 입력해주세요</h1>',
        '    <p id="userEmail"></p>',
        '  </div>',
        '  <div class="auth-body">',
        '    <div class="input-group">',
        '      <label for="passwordInput">비밀번호</label>',
        '      <input type="password" id="passwordInput" class="toss-input" placeholder="비밀번호를 입력해주세요">',
        '      <div class="error-message" id="passwordError"></div>',
        '    </div>',
        '        <button class="toss-button" id="loginBtn" disabled>로그인</button>',
        '  </div>',
        '</div>',
        '',
        '<div class="auth-step" id="signupStep" style="display:none;">',
        '  <div class="auth-header">',
        '    <button class="back-button" id="backToEmailFromSignup">←</button>',
        '    <h1 id="signupTitle">회원가입을 진행할게요</h1>',
        '    <p id="signupSubtitle">몇 가지 정보가 필요해요</p>',
        '  </div>',
        '  <div class="auth-body">',
        '    <div class="signup-field" id="phoneField">',
        '      <div class="input-group">',
        '        <label for="phoneInput">전화번호</label>',
        '        <input type="tel" id="phoneInput" class="toss-input" placeholder="010-1234-5678">',
        '        <div class="error-message" id="phoneError"></div>',
        '      </div>',
        '      <button class="toss-button" id="phoneNextBtn" disabled>다음</button>',
        '    </div>',
        '    <div class="signup-field" id="nameField" style="display:none;">',
        '      <div class="input-group">',
        '        <label for="nameInput">이름</label>',
        '        <input type="text" id="nameInput" class="toss-input" placeholder="이름을 입력해주세요">',
        '        <div class="error-message" id="nameError"></div>',
        '      </div>',
        '      <button class="toss-button" id="nameNextBtn" disabled>다음</button>',
        '    </div>',
        '    <div class="signup-field" id="ageField" style="display:none;">',
        '      <div class="input-group">',
        '        <label for="ageInput">나이</label>',
        '        <input type="number" id="ageInput" class="toss-input" placeholder="나이를 입력해주세요" min="14" max="100">',
        '        <div class="error-message" id="ageError"></div>',
        '      </div>',
        '      <button class="toss-button" id="ageNextBtn" disabled>다음</button>',
        '    </div>',
        '    <div class="signup-field" id="genderField" style="display:none;">',
        '      <div class="gender-group">',
        '        <label>성별</label>',
        '        <div class="gender-options">',
        '          <button type="button" class="gender-option" data-gender="male">남성</button>',
        '          <button type="button" class="gender-option" data-gender="female">여성</button>',
        '        </div>',
        '        <div class="error-message" id="genderError"></div>',
        '      </div>',
        '      <button class="toss-button" id="genderNextBtn" disabled>다음</button>',
        '    </div>',
        '        <div class="signup-field" id="signupPasswordField" style="display:none;">',
        '          <div class="input-group">',
      '        <label for="signupPasswordInput">비밀번호</label>',
      '        <input type="password" id="signupPasswordInput" class="toss-input" placeholder="비밀번호를 설정해주세요">',
      '        <div class="error-message" id="signupPasswordError"></div>',
      '        <div class="password-hint">6자 이상 입력해주세요</div>',
      '      </div>',
      '      <button class="toss-button" id="passwordNextBtn" disabled>다음</button>',
      '    </div>',
      '    ',
              '        <!-- 비밀번호 확인 단계 -->',
        '        <div class="signup-field" id="signupPasswordConfirmField" style="display:none;">',
        '          <div class="input-group">',
      '        <label for="signupPasswordConfirmInput">비밀번호 확인</label>',
      '        <input type="password" id="signupPasswordConfirmInput" class="toss-input" placeholder="비밀번호를 다시 입력해주세요">',
      '        <div class="error-message" id="signupPasswordConfirmError"></div>',
      '      </div>',
      '      <button class="toss-button" id="completeSignupBtn" disabled>가입 완료</button>',
        '    </div>',
        '  </div>',
        '</div>'
    ].join('');

    // body 끝에 추가
    document.body.appendChild(container);
}

function initializeAuthUI() {
    // 사용자 메뉴 초기 상태
    $('#userMenu').hide();
    $('#userMenuSidebar').hide();
    $('#adminBadge').hide();
    $('#adminBadgeSidebar').hide();
}

function setupEventListeners() {
    // 로그인 버튼 클릭
    $('#openLogin, #openLoginSidebar').on('click', function() {
        showTossAuth();
    });
    

    
    // 모달 외부 클릭 시 닫기
    $('.toss-auth-container').on('click', function(e) {
        if (e.target === this) {
            hideTossAuth();
        }
    });
    
    // ESC 키로 모달 닫기
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape' && $('.toss-auth-container').hasClass('show')) {
            hideTossAuth();
        }
    });
    
    // 1단계: 이메일 입력 및 계속하기
    setupEmailStep();
    
    // 2단계: 비밀번호 입력 (기존 회원)
    setupPasswordStep();
    
    // 3단계: 회원가입 (신규 회원)
    setupSignupStep();
    
    // 4단계: 비밀번호 확인
    setupSignupPasswordConfirmField();
    
    // 소셜 로그인 설정
    setupSocialLogin();
}

function showTossAuth() {
    // 모달을 열기 전에 완전히 초기화
    resetAuthFlow();
    
    // 모달 표시
    $('.toss-auth-container').addClass('show');
    
    // 포커스 설정
    setTimeout(() => {
        $('#emailInput').focus();
    }, 100);
}

function hideTossAuth() {
    // 모달 숨기기
    $('.toss-auth-container').removeClass('show');
    
    // 즉시 초기화 (타이밍 지연 제거)
    resetAuthFlow();
}

function resetAuthFlow() {
    // 모든 단계 숨기기
    $('.auth-step').hide();
    $('#skeletonLoading').hide();
    
    // 진행 상황 표시 제거
    $('#signupProgress').hide();
    
    // 첫 번째 단계 보기
    $('#emailStep').show();
    
    // 모든 입력값 초기화
    $('.toss-input').val('');
    $('.error-message').removeClass('show').text('');
    $('.toss-button').prop('disabled', true);
    
    // 비밀번호 확인 필드 초기화
    $('#signupPasswordConfirmInput').val('');
    
    // 에러 메시지 클래스 초기화
    $('.error-message').removeClass('error info').addClass('error');
    
    // 회원가입 데이터 완전 초기화
    signupData = {};
    currentEmail = '';
    
    // 진행 상황 컨테이너 제거 (새로 생성되도록)
    $('#signupProgress').remove();
    
    // 모든 필드의 active 클래스 제거
    $('.signup-field').removeClass('active');
    
    // 성별 선택 초기화
    $('.gender-option').removeClass('active');
    
    // 비밀번호 확인 단계 숨기기
    $('#signupPasswordConfirmField').hide();
    
    console.log('인증 플로우 완전 초기화 완료');
}

function setupEmailStep() {
    const emailInput = $('#emailInput');
    const continueBtn = $('#continueBtn');
    const errorMessage = $('#emailError');
    
    // 실시간 이메일 중복 검증 설정
    setupRealTimeEmailValidation(emailInput, errorMessage);
    
    // 이메일 입력 시 실시간 검증
    emailInput.on('input', function() {
        const email = $(this).val().trim();
        
        if (email === '') {
            continueBtn.prop('disabled', true);
            hideError(errorMessage);
            return;
        }
        
        const isValid = isValidEmail(email);
        const emailValidation = validateEmailUniqueness(email);
        
        // 이메일 형식이 유효하고, 중복 검증이 완료되면 버튼 활성화
        continueBtn.prop('disabled', !isValid);
        
        if (!isValid) {
            showError(errorMessage, '올바른 이메일 형식을 입력해주세요');
        } else {
            // 이메일 형식이 유효하면 계속하기 버튼 활성화
            // 중복 여부는 계속하기 버튼 클릭 시 확인
        }
    });
    
    // 계속하기 버튼 클릭
    continueBtn.on('click', function() {
        const email = emailInput.val().trim();
        
        if (!isValidEmail(email)) {
            showError(errorMessage, '올바른 이메일 형식을 입력해주세요');
            return;
        }
        
        // 이메일 중복 검증 (기존 회원인지 신규 회원인지 확인)
        const emailValidation = validateEmailUniqueness(email);
        
        // 기존 회원인 경우 안내 메시지 표시
        if (emailValidation.isExistingUser) {
            showError(errorMessage, emailValidation.message);
            errorMessage.removeClass('error').addClass('info');
        }
        
        // 이메일 형식이 유효하면 계속 진행
        checkEmailExists(email);
    });
    
    // 엔터키 처리
    emailInput.on('keypress', function(e) {
        if (e.which === 13 && !continueBtn.prop('disabled')) {
            continueBtn.click();
        }
    });
}

function setupPasswordStep() {
    const passwordInput = $('#passwordInput');
    const loginBtn = $('#loginBtn');
    const errorMessage = $('#passwordError');
    const backBtn = $('#backToEmail');
    
    // 비밀번호 입력 시 버튼 활성화
    passwordInput.on('input', function() {
        const password = $(this).val().trim();
        loginBtn.prop('disabled', password === '');
        hideError(errorMessage);
    });
    
    // 로그인 버튼 클릭
    loginBtn.on('click', function() {
        const password = passwordInput.val().trim();
        
        if (password === '') {
            showError(errorMessage, '비밀번호를 입력해주세요');
            return;
        }
        
        performLogin(currentEmail, password);
    });
    
    // 뒤로가기 버튼
    backBtn.on('click', function() {
        showStep('emailStep');
        $('#emailInput').focus();
    });
    
    // 엔터키 처리
    passwordInput.on('keypress', function(e) {
        if (e.which === 13 && !loginBtn.prop('disabled')) {
            loginBtn.click();
        }
    });
}

function setupSignupStep() {
    const backBtn = $('#backToEmailFromSignup');
    
    // 뒤로가기 버튼
    backBtn.on('click', function() {
        showStep('emailStep');
        $('#emailInput').focus();
    });
    
    // 전화번호 단계
    setupPhoneField();
    
    // 이름 단계
    setupNameField();
    
    // 나이 단계
    setupAgeField();
    
    // 성별 단계
    setupGenderField();
    
    // 비밀번호 단계
    setupSignupPasswordField();
}

function setupPhoneField() {
    const phoneInput = $('#phoneInput');
    const phoneNextBtn = $('#phoneNextBtn');
    const phoneError = $('#phoneError');
    
    // 실시간 전화번호 중복 검증 설정
    setupRealTimePhoneValidation(phoneInput, phoneError);
    
    phoneInput.on('input', function() {
        const phone = $(this).val().trim();
        
        // 전화번호 형식 자동 변환
        const formattedPhone = formatPhoneNumber(phone);
        if (formattedPhone !== phone) {
            $(this).val(formattedPhone);
        }
        
        const isValid = isValidPhoneNumber(formattedPhone);
        const isUnique = validatePhoneUniqueness(formattedPhone).isValid;
        
        phoneNextBtn.prop('disabled', !isValid || !isUnique);
        
        if (phone && !isValid) {
            showError(phoneError, '올바른 전화번호 형식을 입력해주세요');
        } else if (phone && !isUnique) {
            showError(phoneError, '이미 사용 중인 전화번호입니다');
        } else {
            hideError(phoneError);
        }
    });
    
    phoneNextBtn.on('click', function() {
        const phone = phoneInput.val().trim();
        
        if (!isValidPhoneNumber(phone)) {
            showError(phoneError, '올바른 전화번호 형식을 입력해주세요');
            return;
        }
        
        const phoneValidation = validatePhoneUniqueness(phone);
        if (!phoneValidation.isValid) {
            showError(phoneError, phoneValidation.message);
            return;
        }
        
        signupData.phone = phone;
        
        // 수정 모드에서 온 경우 다음 단계로 진행, 아니면 원래 순서대로
        if ($('#phoneField').hasClass('active')) {
            showSignupField('nameField');
            $('#nameInput').focus();
        }
    });
    
    phoneInput.on('keypress', function(e) {
        if (e.which === 13 && !phoneNextBtn.prop('disabled')) {
            phoneNextBtn.click();
        }
    });
}

function setupNameField() {
    const nameInput = $('#nameInput');
    const nameNextBtn = $('#nameNextBtn');
    const nameError = $('#nameError');
    
    nameInput.on('input', function() {
        const name = $(this).val().trim();
        const isValid = name.length >= 2;
        nameNextBtn.prop('disabled', !isValid);
        
        if (name && !isValid) {
            showError(nameError, '이름은 2자 이상 입력해주세요');
        } else {
            hideError(nameError);
        }
    });
    
    nameNextBtn.on('click', function() {
        const name = nameInput.val().trim();
        
        if (name.length < 2) {
            showError(nameError, '이름은 2자 이상 입력해주세요');
            return;
        }
        
        signupData.name = name;
        
        // 수정 모드에서 온 경우 다음 단계로 진행, 아니면 원래 순서대로
        if ($('#nameField').hasClass('active')) {
            showSignupField('ageField');
            $('#ageInput').focus();
        }
    });
    
    nameInput.on('keypress', function(e) {
        if (e.which === 13 && !nameNextBtn.prop('disabled')) {
            nameNextBtn.click();
        }
    });
}

function setupAgeField() {
    const ageInput = $('#ageInput');
    const ageNextBtn = $('#ageNextBtn');
    const ageError = $('#ageError');
    
    ageInput.on('input', function() {
        const age = parseInt($(this).val());
        const isValid = age >= 14 && age <= 100;
        ageNextBtn.prop('disabled', !isValid);
        
        if ($(this).val() && !isValid) {
            showError(ageError, '나이는 14세 이상 100세 이하로 입력해주세요');
        } else {
            hideError(ageError);
        }
    });
    
    ageNextBtn.on('click', function() {
        const age = parseInt(ageInput.val());
        
        if (age < 14 || age > 100) {
            showError(ageError, '나이는 14세 이상 100세 이하로 입력해주세요');
            return;
        }
        
        signupData.age = age;
        
        // 수정 모드에서 온 경우 다음 단계로 진행, 아니면 원래 순서대로
        if ($('#ageField').hasClass('active')) {
            showSignupField('genderField');
        }
    });
    
    ageInput.on('keypress', function(e) {
        if (e.which === 13 && !ageNextBtn.prop('disabled')) {
            ageNextBtn.click();
        }
    });
}

function setupGenderField() {
    const genderNextBtn = $('#genderNextBtn');
    const genderError = $('#genderError');
    
    $('.gender-option').on('click', function() {
        $('.gender-option').removeClass('selected');
        $(this).addClass('selected');
        
        const gender = $(this).data('gender');
        signupData.gender = gender;
        genderNextBtn.prop('disabled', false);
        hideError(genderError);
    });
    
    genderNextBtn.on('click', function() {
        if (!signupData.gender) {
            showError(genderError, '성별을 선택해주세요');
            return;
        }
        
        showSignupField('signupPasswordField');
        $('#signupPasswordInput').focus();
    });
}

function setupSignupPasswordField() {
    const passwordInput = $('#signupPasswordInput');
    const passwordNextBtn = $('#passwordNextBtn');
    const passwordError = $('#signupPasswordError');
    const backToGenderBtn = $('#backToGender');
    
    // 뒤로가기 버튼 클릭 시 성별 선택 단계로 돌아가기
    backToGenderBtn.on('click', function() {
        $('#signupPasswordField').hide();
        $('#genderField').show();
        
        // 성별 선택 버튼에 포커스
        setTimeout(() => {
            $('.gender-option.active').focus();
        }, 100);
    });
    
    // 비밀번호 입력 시 실시간 검증
    passwordInput.on('input', function() {
        const password = $(this).val().trim();
        const isPasswordValid = password.length >= 6;
        
        passwordNextBtn.prop('disabled', !isPasswordValid);
        
        if (password && !isPasswordValid) {
            showError(passwordError, '비밀번호는 6자 이상 입력해주세요');
        } else {
            hideError(passwordError);
        }
    });
    
    // 다음 버튼 클릭 시 비밀번호 확인 단계로 이동
    passwordNextBtn.on('click', function() {
        const password = passwordInput.val().trim();
        
        if (password.length < 6) {
            showError(passwordError, '비밀번호는 6자 이상 입력해주세요');
            return;
        }
        
        // 비밀번호 저장
        signupData.password = password;
        
        // 비밀번호 확인 단계 표시
        $('#signupPasswordField').hide();
        $('#signupPasswordConfirmField').show();
        
        // 비밀번호 확인 입력 필드에 포커스
        setTimeout(() => {
            $('#signupPasswordConfirmInput').focus();
        }, 100);
    });
    
    // Enter 키로 다음 단계 진행
    passwordInput.on('keypress', function(e) {
        if (e.which === 13 && !passwordNextBtn.prop('disabled')) {
            passwordNextBtn.click();
        }
    });
}

// 비밀번호 확인 단계 설정
function setupSignupPasswordConfirmField() {
    const passwordConfirmInput = $('#signupPasswordConfirmInput');
    const completeBtn = $('#completeSignupBtn');
    const passwordConfirmError = $('#signupPasswordConfirmError');
    const backToPasswordBtn = $('#backToPassword');
    
    // 뒤로가기 버튼 클릭 시 비밀번호 단계로 돌아가기
    backToPasswordBtn.on('click', function() {
        $('#signupPasswordConfirmField').hide();
        $('#signupPasswordField').show();
        
        // 비밀번호 입력 필드에 포커스
        setTimeout(() => {
            $('#signupPasswordInput').focus();
        }, 100);
    });
    
    // 비밀번호 확인 입력 시 실시간 검증
    passwordConfirmInput.on('input', function() {
        const password = signupData.password;
        const passwordConfirm = $(this).val().trim();
        
        const isConfirmValid = passwordConfirm === '' || password === passwordConfirm;
        completeBtn.prop('disabled', !isConfirmValid);
        
        if (passwordConfirm && !isConfirmValid) {
            showError(passwordConfirmError, '비밀번호가 일치하지 않습니다');
        } else {
            hideError(passwordConfirmError);
        }
    });
    
    // 가입 완료 버튼 클릭
    completeBtn.on('click', function() {
        const password = signupData.password;
        const passwordConfirm = passwordConfirmInput.val().trim();
        
        if (password !== passwordConfirm) {
            showError(passwordConfirmError, '비밀번호가 일치하지 않습니다');
            
            // 3초 후 비밀번호 입력 창으로 돌아가기
            setTimeout(() => {
                // 비밀번호 확인 단계 숨기기
                $('#signupPasswordConfirmField').hide();
                
                // 비밀번호 입력 단계 표시
                $('#signupPasswordField').show();
                
                // 비밀번호 입력 필드 초기화 및 포커스
                $('#signupPasswordInput').val('').focus();
                $('#signupPasswordConfirmInput').val('');
                
                // 에러 메시지 숨기기
                hideError(passwordConfirmError);
                hideError(passwordError);
                
                // 다음 버튼 비활성화
                $('#passwordNextBtn').prop('disabled', true);
                
                console.log('비밀번호 불일치로 비밀번호 입력 창으로 돌아감');
            }, 3000);
            
            return;
        }
        
        // 회원가입 완료 처리
        signupData.email = currentEmail;
        performSignup(signupData);
    });
    
    // Enter 키로 가입 완료
    passwordConfirmInput.on('keypress', function(e) {
        if (e.which === 13 && !completeBtn.prop('disabled')) {
            completeBtn.click();
        }
    });
}

// 이메일 존재 여부 확인
function checkEmailExists(email) {
    console.log('이메일 확인 API 호출 시작:', email);
    showSkeleton();
    currentEmail = email;
    
    // 로컬 스토리지에서 기존 사용자 확인 (데모용)
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = existingUsers.find(user => user.email === email);
    
    hideSkeleton();
    
    if (existingUser) {
        // 기존 회원 - 비밀번호 입력
        console.log('기존 회원 - 비밀번호 단계로 이동');
        showPasswordStep(email);
    } else {
        // 신규 회원 - 회원가입
        console.log('신규 회원 - 회원가입 단계로 이동');
        showSignupStep(email);
    }
    
    // 실제 API 호출 시 사용할 코드 (현재는 주석 처리)
    /*
    $.ajax({
        url: '/api/auth/check-email',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ email: email }),
        success: function(response) {
            console.log('이메일 확인 API 응답:', response);
            hideSkeleton();
            
            if (response.success) {
                if (response.isExistingUser) {
                    // 기존 회원 - 비밀번호 입력
                    console.log('기존 회원 - 비밀번호 단계로 이동');
                    showPasswordStep(email);
                } else {
                    // 신규 회원 - 회원가입
                    console.log('신규 회원 - 회원가입 단계로 이동');
                    showSignupStep(email);
                }
            } else {
                console.log('이메일 확인 실패:', response.message);
                showError($('#emailError'), response.message);
            }
        },
        error: function(xhr) {
            console.log('이메일 확인 API 오류:', xhr);
            hideSkeleton();
            const response = xhr.responseJSON;
            showError($('#emailError'), response ? response.message : '서버 오류가 발생했습니다.');
        }
    });
    */
}

// 이메일 중복 검증 (토스 스타일)
function validateEmailUniqueness(email, currentUserId = null) {
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const duplicateUser = existingUsers.find(user => 
        user.email === email && user.id !== currentUserId
    );
    
    if (duplicateUser) {
        return {
            isValid: true, // 기존 회원이므로 유효함
            message: '기존 회원입니다. 로그인을 진행합니다.',
            isExistingUser: true
        };
    }
    
    return { 
        isValid: true,
        isExistingUser: false
    };
}

// 전화번호 중복 검증 (토스 스타일)
function validatePhoneUniqueness(phone, currentUserId = null) {
    if (!phone) return { isValid: true };
    
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const duplicateUser = existingUsers.find(user => 
        user.phone === phone && user.id !== currentUserId
    );
    
    if (duplicateUser) {
        return {
            isValid: false,
            message: '이미 사용 중인 전화번호입니다'
        };
    }
    
    return { isValid: true };
}

// 실시간 이메일 중복 검증 (토스 스타일)
function setupRealTimeEmailValidation(inputElement, errorElement, currentUserId = null) {
    let validationTimeout;
    
    inputElement.on('input', function() {
        const email = $(this).val().trim();
        
        // 이전 타이머 클리어
        clearTimeout(validationTimeout);
        
        if (email === '') {
            hideError(errorElement);
            return;
        }
        
        // 이메일 형식 검증
        if (!isValidEmail(email)) {
            showError(errorElement, '올바른 이메일 형식을 입력해주세요');
            return;
        }
        
        // 중복 검증은 사용자가 타이핑을 멈춘 후 500ms 후에 실행
        validationTimeout = setTimeout(() => {
            const validation = validateEmailUniqueness(email, currentUserId);
            
            if (validation.isExistingUser) {
                // 기존 회원인 경우 안내 메시지 표시
                showError(errorElement, validation.message);
                // 에러 스타일이 아닌 안내 스타일로 변경
                errorElement.removeClass('error').addClass('info');
            } else {
                hideError(errorElement);
            }
        }, 500);
    });
}

// 실시간 전화번호 중복 검증 (토스 스타일)
function setupRealTimePhoneValidation(inputElement, errorElement, currentUserId = null) {
    let validationTimeout;
    
    inputElement.on('input', function() {
        const phone = $(this).val().trim();
        
        // 이전 타이머 클리어
        clearTimeout(validationTimeout);
        
        if (phone === '') {
            hideError(errorElement);
            return;
        }
        
        // 전화번호 형식 검증
        if (!isValidPhone(phone)) {
            showError(errorElement, '올바른 전화번호 형식을 입력해주세요');
            return;
        }
        
        // 중복 검증은 사용자가 타이핑을 멈춘 후 500ms 후에 실행
        validationTimeout = setTimeout(() => {
            const validation = validatePhoneUniqueness(phone, currentUserId);
            
            if (!validation.isValid) {
                showError(errorElement, validation.message);
            } else {
                hideError(errorElement);
            }
        }, 500);
    });
}

// 전화번호 형식 검증
function isValidPhone(phone) {
    const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
    return phoneRegex.test(phone);
}

// 로그인 수행
function performLogin(email, password) {
    showSkeleton();
    
    $.ajax({
        url: '/api/auth/login',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ email: email, password: password }),
        success: function(response) {
            hideSkeleton();
            
            if (response.success) {
                currentUser = response.user;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                console.log('로그인 성공, 사용자 정보:', currentUser);
                
                hideTossAuth();
                
                // 로그인 완료 후 원래 페이지로 돌아가기
                setTimeout(() => {
                    window.location.reload();
                }, 500);
                
                // main.js의 updateLoginStatus 호출 (초기 로드 시 제외)
                if (typeof updateLoginStatus === 'function' && !window.isInitialLoad) {
                    updateLoginStatus();
                }
            } else {
                showError($('#passwordError'), response.message);
            }
        },
        error: function(xhr) {
            hideSkeleton();
            const response = xhr.responseJSON;
            showError($('#passwordError'), response ? response.message : '로그인 중 오류가 발생했습니다.');
        }
    });
}

// 회원가입 수행
function performSignup(data) {
    showSkeleton();
    
    $.ajax({
        url: '/api/auth/register',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(response) {
            hideSkeleton();
            
            if (response.success) {
                currentUser = response.user;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                hideTossAuth();
                
                // 회원가입 완료 후 원래 페이지로 돌아가기
                setTimeout(() => {
                    window.location.reload();
                }, 500);
                
                // main.js의 updateLoginStatus 호출 (초기 로드 시 제외)
                if (typeof updateLoginStatus === 'function' && !window.isInitialLoad) {
                    updateLoginStatus();
                }
            } else {
                showError($('#signupPasswordError'), response.message);
            }
        },
        error: function(xhr) {
            hideSkeleton();
            const response = xhr.responseJSON;
            showError($('#signupPasswordError'), response ? response.message : '회원가입 중 오류가 발생했습니다.');
        }
    });
}

// UI 헬퍼 함수들
function showStep(stepId) {
    $('.auth-step').hide();
    $(`#${stepId}`).show();
}

function showPasswordStep(email) {
    console.log('비밀번호 단계 표시:', email);
    $('#userEmail').text(email);
    showStep('passwordStep');
    setTimeout(() => {
        $('#passwordInput').focus();
    }, 100);
}

function showSignupStep(email) {
    console.log('회원가입 단계 표시:', email);
    showStep('signupStep');
    showSignupField('phoneField');
    setTimeout(() => {
        $('#phoneInput').focus();
    }, 100);
}

function showSignupField(fieldId) {
    $('.signup-field').hide().removeClass('active');
    $(`#${fieldId}`).show().addClass('active');
    
    // 제목 업데이트
    const titles = {
        'phoneField': '전화번호를 입력해주세요',
        'nameField': '이름을 입력해주세요', 
        'ageField': '나이를 입력해주세요',
        'genderField': '성별을 선택해주세요',
        'signupPasswordField': '비밀번호를 설정해주세요'
    };
    
    const subtitles = {
        'phoneField': '안전한 서비스 이용을 위해 필요해요',
        'nameField': '실명으로 입력해주세요',
        'ageField': '만 나이로 입력해주세요', 
        'genderField': '더 나은 서비스 제공을 위해 필요해요',
        'signupPasswordField': '안전한 비밀번호로 설정해주세요'
    };
    
    $('#signupTitle').text(titles[fieldId] || '회원가입을 진행할게요');
    $('#signupSubtitle').text(subtitles[fieldId] || '몇 가지 정보가 필요해요');
    
    // 이전에 입력한 정보들을 순차적으로 표시
    updateSignupProgress(fieldId);
}

// 회원가입 진행 상황을 표시하는 함수
function updateSignupProgress(currentFieldId) {
    const progressContainer = $('#signupProgress');
    
    // 진행 상황 컨테이너가 없으면 생성
    if (progressContainer.length === 0) {
        const progressHtml = `
            <div id="signupProgress" class="signup-progress">
                <div class="progress-items"></div>
            </div>
        `;
        $('.auth-body').append(progressHtml);
    }
    
    const progressItems = $('#signupProgress .progress-items');
    progressItems.empty();
    
    // 각 단계별로 입력된 정보를 실제 UI 형태로 표시
    if (signupData.phone) {
        progressItems.append(`
            <div class="progress-item clickable" data-field="phoneField">
                <div class="progress-input-group">
                    <label>전화번호</label>
                    <input type="tel" value="${signupData.phone}" class="editable-input" data-field="phone" data-original="${signupData.phone}">
                    <button class="edit-btn" data-field="phoneField">수정</button>
                </div>
            </div>
        `);
    }
    
    if (signupData.name) {
        progressItems.append(`
            <div class="progress-item clickable" data-field="nameField">
                <div class="progress-input-group">
                    <label>이름</label>
                    <input type="text" value="${signupData.name}" class="editable-input" data-field="name" data-original="${signupData.name}">
                    <button class="edit-btn" data-field="nameField">수정</button>
                </div>
            </div>
        `);
    }
    
    if (signupData.age) {
        progressItems.append(`
            <div class="progress-item clickable" data-field="ageField">
                <div class="progress-input-group">
                    <label>나이</label>
                    <input type="number" value="${signupData.age}" class="editable-input" data-field="age" data-original="${signupData.age}">
                    <button class="edit-btn" data-field="ageField">수정</button>
                </div>
            </div>
        `);
    }
    
    if (signupData.gender) {
        const genderText = signupData.gender === 'male' ? '남성' : '여성';
        progressItems.append(`
            <div class="progress-item clickable" data-field="genderField">
                <div class="progress-input-group">
                    <label>성별</label>
                    <div class="gender-display">${genderText}</div>
                </div>
            </div>
        `);
    }
    
    // 진행 상황 컨테이너 표시/숨김
    if (Object.keys(signupData).length > 0) {
        $('#signupProgress').show();
        
        // 수정 버튼 클릭 이벤트 바인딩
        $('.edit-btn').off('click').on('click', function(e) {
            e.stopPropagation();
            const fieldId = $(this).data('field');
            
            // 수정할 필드를 위로 이동
            moveFieldToTop(fieldId);
            
            // 해당 필드에 포커스
            setTimeout(() => {
                if (fieldId === 'phoneField') {
                    $('#phoneInput').focus();
                } else if (fieldId === 'nameField') {
                    $('#nameInput').focus();
                } else if (fieldId === 'ageField') {
                    $('#ageInput').focus();
                } else if (fieldId === 'genderField') {
                    // 성별은 버튼이므로 포커스 불필요
                }
            }, 100);
        });
        
        // progress-item 클릭 이벤트 바인딩 (수정 버튼이 없는 항목들)
        $('.progress-item.clickable').off('click').on('click', function(e) {
            // 수정 버튼을 클릭한 경우는 제외
            if ($(e.target).hasClass('edit-btn')) {
                return;
            }
            
            const fieldId = $(this).data('field');
            
            // 수정할 필드를 위로 이동
            moveFieldToTop(fieldId);
            
            // 해당 필드에 포커스
            setTimeout(() => {
                if (fieldId === 'phoneField') {
                    $('#phoneInput').focus();
                } else if (fieldId === 'nameField') {
                    $('#nameInput').focus();
                } else if (fieldId === 'ageField') {
                    $('#ageInput').focus();
                } else if (fieldId === 'genderField') {
                    // 성별은 버튼이므로 포커스 불필요
                }
            }, 100);
        });
    } else {
        $('#signupProgress').hide();
    }
}

// 수정할 필드를 위로 이동하는 함수
function moveFieldToTop(fieldId) {
    // 현재 활성화된 필드 숨기기
    $('.signup-field.active').hide().removeClass('active');
    
    // 수정할 필드를 위로 이동
    const targetField = $(`#${fieldId}`);
    targetField.show().addClass('active');
    
    // 제목과 부제목 업데이트
    const titles = {
        'phoneField': '전화번호를 입력해주세요',
        'nameField': '이름을 입력해주세요', 
        'ageField': '나이를 입력해주세요',
        'genderField': '성별을 선택해주세요',
        'signupPasswordField': '비밀번호를 설정해주세요'
    };
    
    const subtitles = {
        'phoneField': '안전한 서비스 이용을 위해 필요해요',
        'nameField': '실명으로 입력해주세요',
        'ageField': '만 나이로 입력해주세요', 
        'genderField': '더 나은 서비스 제공을 위해 필요해요',
        'signupPasswordField': '안전한 비밀번호로 설정해주세요'
    };
    
    $('#signupTitle').text(titles[fieldId] || '회원가입을 진행할게요');
    $('#signupSubtitle').text(subtitles[fieldId] || '몇 가지 정보가 필요해요');
    
    // 진행 상황 업데이트 (수정 중인 필드는 제외)
    updateSignupProgressForEdit(fieldId);
}

// 수정 중일 때 진행 상황을 업데이트하는 함수
function updateSignupProgressForEdit(editingFieldId) {
    const progressContainer = $('#signupProgress');
    
    if (progressContainer.length === 0) {
        const progressHtml = `
            <div id="signupProgress" class="signup-progress">
                <div class="progress-items"></div>
            </div>
        `;
        $('.auth-body').append(progressHtml);
    }
    
    const progressItems = $('#signupProgress .progress-items');
    progressItems.empty();
    
    // 수정 중인 필드를 제외하고 진행 상황 표시
    if (signupData.phone && editingFieldId !== 'phoneField') {
        progressItems.append(`
            <div class="progress-item clickable" data-field="phoneField">
                <div class="progress-input-group">
                    <label>전화번호</label>
                    <input type="tel" value="${signupData.phone}" class="editable-input" data-field="phone" data-original="${signupData.phone}">
                    <button class="edit-btn" data-field="phoneField">수정</button>
                </div>
            </div>
        `);
    }
    
    if (signupData.name && editingFieldId !== 'nameField') {
        progressItems.append(`
            <div class="progress-item clickable" data-field="nameField">
                <div class="progress-input-group">
                    <label>이름</label>
                    <input type="text" value="${signupData.name}" class="editable-input" data-field="name" data-original="${signupData.name}">
                    <button class="edit-btn" data-field="nameField">수정</button>
                </div>
            </div>
        `);
    }
    
    if (signupData.age && editingFieldId !== 'ageField') {
        progressItems.append(`
            <div class="progress-item clickable" data-field="ageField">
                <div class="progress-input-group">
                    <label>나이</label>
                    <input type="number" value="${signupData.age}" class="editable-input" data-field="age" data-original="${signupData.age}">
                    <button class="edit-btn" data-field="ageField">수정</button>
                </div>
            </div>
        `);
    }
    
    if (signupData.gender && editingFieldId !== 'genderField') {
        const genderText = signupData.gender === 'male' ? '남성' : '여성';
        progressItems.append(`
            <div class="progress-item clickable" data-field="genderField">
                <div class="progress-input-group">
                    <label>성별</label>
                    <div class="gender-display">${genderText}</div>
                </div>
            </div>
        `);
    }
    
    // 진행 상황 컨테이너 표시/숨김
    if (Object.keys(signupData).length > 0) {
        $('#signupProgress').show();
        
        // 수정 버튼 클릭 이벤트 바인딩
        $('.edit-btn').off('click').on('click', function(e) {
            e.stopPropagation();
            const fieldId = $(this).data('field');
            
            // 수정할 필드를 위로 이동
            moveFieldToTop(fieldId);
            
            // 해당 필드에 포커스
            setTimeout(() => {
                if (fieldId === 'phoneField') {
                    $('#phoneInput').focus();
                } else if (fieldId === 'nameField') {
                    $('#nameInput').focus();
                } else if (fieldId === 'ageField') {
                    $('#ageInput').focus();
                } else if (fieldId === 'genderField') {
                    // 성별은 버튼이므로 포커스 불필요
                }
            }, 100);
        });
        
        // progress-item 클릭 이벤트 바인딩 (수정 버튼이 없는 항목들)
        $('.progress-item.clickable').off('click').on('click', function(e) {
            // 수정 버튼을 클릭한 경우는 제외
            if ($(e.target).hasClass('edit-btn')) {
                return;
            }
            
            const fieldId = $(this).data('field');
            
            // 수정할 필드를 위로 이동
            moveFieldToTop(fieldId);
            
            // 해당 필드에 포커스
            setTimeout(() => {
                if (fieldId === 'phoneField') {
                    $('#phoneInput').focus();
                } else if (fieldId === 'nameField') {
                    $('#nameInput').focus();
                } else if (fieldId === 'ageField') {
                    $('#ageInput').focus();
                } else if (fieldId === 'genderField') {
                    // 성별은 버튼이므로 포커스 불필요
                }
            }, 100);
        });
    } else {
        $('#signupProgress').hide();
    }
}

// 입력 필드를 편집 모드로 전환하는 함수
function toggleEditMode(fieldId) {
    const inputElement = $(`.editable-input[data-field="${fieldId.replace('Field', '')}"]`);
    
    if (inputElement.length > 0) {
        // 입력 필드를 편집 모드로 전환
        inputElement.prop('readonly', false).addClass('editing');
        
        // 전화번호 필드일 경우 자동 포맷팅 이벤트 추가
        if (fieldId === 'phoneField') {
            inputElement.off('input.phoneFormat').on('input.phoneFormat', function() {
                let value = $(this).val().replace(/[^0-9]/g, '');
                if (value.length >= 3) {
                    value = value.substring(0, 3) + '-' + value.substring(3);
                }
                if (value.length >= 8) {
                    value = value.substring(0, 8) + '-' + value.substring(8);
                }
                $(this).val(value);
            });
        }
        
        // 수정 버튼을 저장 버튼으로 변경
        const editBtn = inputElement.closest('.progress-item').find('.edit-btn');
        editBtn.text('저장').removeClass('edit-btn').addClass('save-btn');
        
        // 저장 버튼 클릭 이벤트
        editBtn.off('click').on('click', function(e) {
            e.stopPropagation();
            saveEdit(fieldId, inputElement);
        });
        
        // 입력 필드에 포커스
        inputElement.focus();
    }
}

// 편집 내용을 저장하는 함수
function saveEdit(fieldId, inputElement) {
    const fieldType = fieldId.replace('Field', '');
    const newValue = inputElement.val().trim();
    const originalValue = inputElement.data('original');
    
    // 값이 변경되었는지 확인
    if (newValue !== originalValue) {
        // 유효성 검사
        let isValid = true;
        let errorMessage = '';
        
        if (fieldType === 'phone') {
            isValid = isValidPhoneNumber(newValue);
            if (!isValid) errorMessage = '올바른 전화번호 형식을 입력해주세요';
        } else if (fieldType === 'name') {
            isValid = newValue.length >= 2;
            if (!isValid) errorMessage = '이름은 2자 이상 입력해주세요';
        } else if (fieldType === 'age') {
            const age = parseInt(newValue);
            isValid = age >= 14 && age <= 100;
            if (!isValid) errorMessage = '나이는 14세 이상 100세 이하로 입력해주세요';
        }
        
        if (isValid) {
            // signupData 업데이트
            signupData[fieldType] = fieldType === 'age' ? parseInt(newValue) : newValue;
            
            // 전화번호 필드일 경우 포맷팅 이벤트 제거
            if (fieldType === 'phone') {
                inputElement.off('input.phoneFormat');
            }
            
            // 입력 필드를 읽기 전용으로 변경
            inputElement.prop('readonly', true).removeClass('editing');
            
            // 저장 버튼을 수정 버튼으로 변경
            const saveBtn = inputElement.closest('.progress-item').find('.save-btn');
            saveBtn.text('수정').removeClass('save-btn').addClass('edit-btn');
            
            // 수정 버튼 클릭 이벤트 복원
            saveBtn.off('click').on('click', function(e) {
                e.stopPropagation();
                toggleEditMode(fieldId);
            });
            
            // 진행 상황 업데이트
            updateSignupProgress();
        } else {
            // 에러 메시지 표시
            alert(errorMessage);
            inputElement.val(originalValue);
        }
    } else {
        // 값이 변경되지 않았으면 편집 모드 해제
        
        // 전화번호 필드일 경우 포맷팅 이벤트 제거
        if (fieldType === 'phone') {
            inputElement.off('input.phoneFormat');
        }
        
        inputElement.prop('readonly', true).removeClass('editing');
        
        // 저장 버튼을 수정 버튼으로 변경
        const saveBtn = inputElement.closest('.progress-item').find('.save-btn');
        saveBtn.text('수정').removeClass('save-btn').addClass('edit-btn');
        
        // 수정 버튼 클릭 이벤트 복원
        saveBtn.off('click').on('click', function(e) {
            e.stopPropagation();
            toggleEditMode(fieldId);
        });
    }
}

function showSkeleton() {
    // 인증 처리 중에는 전체 페이지 스켈레톤을 노출
    try {
        if (typeof window.showPageSkeleton === 'function') {
            window.showPageSkeleton();
        } else {
            // 폴백: 기존 미니 스켈레톤
            $('.auth-step').hide();
            $('#skeletonLoading').show();
        }
    } catch (e) {
        // 폴백 유지
        $('.auth-step').hide();
        $('#skeletonLoading').show();
    }
}

function hideSkeleton() {
    try {
        if (typeof window.hidePageSkeleton === 'function') {
            window.hidePageSkeleton();
        } else {
            $('#skeletonLoading').hide();
        }
    } catch (e) {
        $('#skeletonLoading').hide();
    }
}

function showError(errorElement, message) {
    errorElement.text(message).addClass('show');
}

function hideError(errorElement) {
    errorElement.removeClass('show');
}

// 토스트 알림은 main.js의 함수를 사용

// 검증 함수들
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhoneNumber(phone) {
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    return phoneRegex.test(phone);
}

function formatPhoneNumber(phone) {
    // 숫자만 추출
    const numbers = phone.replace(/[^\d]/g, '');
    
    // 010으로 시작하는 11자리 숫자인 경우 자동 포맷팅
    if (numbers.length === 11 && numbers.startsWith('010')) {
        return `${numbers.substr(0, 3)}-${numbers.substr(3, 4)}-${numbers.substr(7, 4)}`;
    }
    
    return phone;
}

// 로그인 상태 업데이트는 main.js의 함수 사용

// 로그아웃은 main.js의 함수 사용

// 프로필 관련 함수들은 main.js에서 처리

// 소셜 로그인 설정
function setupSocialLogin() {
    // Google 로그인
    $('#googleLoginBtn').on('click', function() {
        handleGoogleLogin();
    });
    
    // 카카오톡 로그인
    $('#kakaoLoginBtn').on('click', function() {
        handleKakaoLogin();
    });
    
    // 네이버 로그인
    $('#naverLoginBtn').on('click', function() {
        handleNaverLogin();
    });
}

// Google OAuth 로그인
function handleGoogleLogin() {
    console.log('Google 로그인 시작');
    
    // Google OAuth 2.0 설정
    const clientId = 'YOUR_GOOGLE_CLIENT_ID'; // 실제 클라이언트 ID로 교체 필요
    const redirectUri = encodeURIComponent(window.location.origin + '/auth/google/callback');
    const scope = encodeURIComponent('openid email profile');
    const state = generateRandomState();
    
    // Google OAuth URL 생성
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${clientId}&` +
        `redirect_uri=${redirectUri}&` +
        `scope=${scope}&` +
        `response_type=code&` +
        `state=${state}`;
    
    // 새 창에서 Google 로그인 열기
    const popup = window.open(googleAuthUrl, 'googleLogin', 
        'width=500,height=600,scrollbars=yes,resizable=yes');
    
    // 팝업 창 모니터링
    const checkClosed = setInterval(() => {
        if (popup.closed) {
            clearInterval(checkClosed);
            console.log('Google 로그인 팝업이 닫힘');
        }
    }, 1000);
}

// 카카오톡 OAuth 로그인
function handleKakaoLogin() {
    console.log('카카오톡 로그인 시작');
    
    // 카카오 OAuth 2.0 설정
    const clientId = 'YOUR_KAKAO_CLIENT_ID'; // 실제 클라이언트 ID로 교체 필요
    const redirectUri = encodeURIComponent(window.location.origin + '/auth/kakao/callback');
    const state = generateRandomState();
    
    // 카카오 OAuth URL 생성
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?` +
        `client_id=${clientId}&` +
        `redirect_uri=${redirectUri}&` +
        `response_type=code&` +
        `state=${state}`;
    
    // 새 창에서 카카오 로그인 열기
    const popup = window.open(kakaoAuthUrl, 'kakaoLogin', 
        'width=500,height=600,scrollbars=yes,resizable=yes');
    
    // 팝업 창 모니터링
    const checkClosed = setInterval(() => {
        if (popup.closed) {
            clearInterval(checkClosed);
            console.log('카카오 로그인 팝업이 닫힘');
        }
    }, 1000);
}

// 네이버 OAuth 로그인
function handleNaverLogin() {
    console.log('네이버 로그인 시작');
    
    // 네이버 OAuth 2.0 설정
    const clientId = 'YOUR_NAVER_CLIENT_ID'; // 실제 클라이언트 ID로 교체 필요
    const redirectUri = encodeURIComponent(window.location.origin + '/auth/naver/callback');
    const state = generateRandomState();
    
    // 네이버 OAuth URL 생성
    const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?` +
        `response_type=code&` +
        `client_id=${clientId}&` +
        `redirect_uri=${redirectUri}&` +
        `state=${state}`;
    
    // 새 창에서 네이버 로그인 열기
    const popup = window.open(naverAuthUrl, 'naverLogin', 
        'width=500,height=600,scrollbars=yes,resizable=yes');
    
    // 팝업 창 모니터링
    const checkClosed = setInterval(() => {
        if (popup.closed) {
            clearInterval(checkClosed);
            console.log('네이버 로그인 팝업이 닫힘');
        }
    }, 1000);
}

// OAuth state 생성 (CSRF 방지)
function generateRandomState() {
    const array = new Uint32Array(28);
    window.crypto.getRandomValues(array);
    return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
}



// 토스트 알림 함수
function showToast(message, type = 'info') {
    // 기존 토스트 제거
    $('.toast-notification').remove();
    
    const toastClass = type === 'success' ? 'toast-success' : 
                      type === 'error' ? 'toast-error' : 'toast-info';
    
    const toast = $(`
        <div class="toast-notification ${toastClass}">
            <span class="toast-message">${message}</span>
            <button class="toast-close">&times;</button>
        </div>
    `);
    
    $('body').append(toast);
    
    // 토스트 표시
    setTimeout(() => toast.addClass('show'), 100);
    
    // 닫기 버튼 이벤트
    toast.find('.toast-close').on('click', function() {
        hideToast(toast);
    });
    
    // 자동 숨김 (5초 후)
    setTimeout(() => hideToast(toast), 5000);
}

// 토스트 숨기기
function hideToast(toast) {
    toast.removeClass('show');
    setTimeout(() => toast.remove(), 300);
}

// 소셜 로그인 콜백 처리 (실제 구현 시 서버에서 처리)
function handleSocialLoginCallback(provider, code, state) {
    console.log(`${provider} 로그인 콜백 처리:`, { code, state });
    
    // 여기서 서버로 인증 코드를 전송하여 액세스 토큰을 받아야 함
    // 실제 구현 시에는 서버 API를 호출해야 합니다
    
    // 데모용: 성공 메시지 표시
    showToast(`${provider} 로그인이 성공했습니다!`, 'success');
    
    // 로그인 성공 후 처리
    setTimeout(() => {
        hideTossAuth();
        // 사용자 정보 업데이트 등 추가 처리
    }, 2000);
}
