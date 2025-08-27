// 모바일 메뉴 및 검색 기능
document.addEventListener('DOMContentLoaded', function() {
    
    // 요소들 가져오기
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileSideMenu = document.getElementById('mobileSideMenu');
    const sideMenuClose = document.getElementById('sideMenuClose');
    const bottomNavBtn = document.getElementById('bottomNavBtn');
    const bottomSearchBtn = document.getElementById('bottomSearchBtn');
    const searchModal = document.getElementById('searchModal');
    const searchModalClose = document.getElementById('searchModalClose');
    const searchForm = document.querySelector('.search-modal__form');
    const searchInput = document.getElementById('searchInput');
    
    // 사이드 메뉴 열기
    function openSideMenu() {
        mobileSideMenu.classList.add('active');
        document.body.style.overflow = 'hidden'; // 스크롤 방지
    }
    
    // 사이드 메뉴 닫기
    function closeSideMenu() {
        mobileSideMenu.classList.remove('active');
        document.body.style.overflow = ''; // 스크롤 복원
    }
    
    // 검색 모달 열기
    function openSearchModal() {
        searchModal.classList.add('active');
        searchInput.focus(); // 검색창에 포커스
        document.body.style.overflow = 'hidden'; // 스크롤 방지
    }
    
    // 검색 모달 닫기
    function closeSearchModal() {
        searchModal.classList.remove('active');
        document.body.style.overflow = ''; // 스크롤 복원
        searchInput.value = ''; // 검색창 초기화
    }
    
    // 이벤트 리스너 등록
    
    // 햄버거 메뉴 버튼 클릭
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', openSideMenu);
    }
    
    // 사이드 메뉴 닫기 버튼 클릭
    if (sideMenuClose) {
        sideMenuClose.addEventListener('click', closeSideMenu);
    }
    
    // 하단 네비게이션의 네비게이션 버튼 클릭
    if (bottomNavBtn) {
        bottomNavBtn.addEventListener('click', openSideMenu);
    }
    
    // 하단 네비게이션의 검색 버튼 클릭
    if (bottomSearchBtn) {
        bottomSearchBtn.addEventListener('click', openSearchModal);
    }
    
    // 검색 모달 닫기 버튼 클릭
    if (searchModalClose) {
        searchModalClose.addEventListener('click', closeSearchModal);
    }
    
    // 검색 폼 제출
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                console.log('검색어:', searchTerm);
                // 여기에 실제 검색 로직을 구현할 수 있습니다
                alert(`"${searchTerm}" 검색 결과를 보여줍니다. (데모)`);
                closeSearchModal();
            }
        });
    }
    
    // 사이드 메뉴 외부 클릭 시 닫기
    document.addEventListener('click', function(e) {
        if (mobileSideMenu && mobileSideMenu.classList.contains('active')) {
            if (!mobileSideMenu.contains(e.target) && !hamburgerBtn.contains(e.target) && !bottomNavBtn.contains(e.target)) {
                closeSideMenu();
            }
        }
    });
    
    // 검색 모달 외부 클릭 시 닫기
    document.addEventListener('click', function(e) {
        if (searchModal && searchModal.classList.contains('active')) {
            if (!searchModal.contains(e.target) && !bottomSearchBtn.contains(e.target)) {
                closeSearchModal();
            }
        }
    });
    
    // ESC 키로 모달 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (mobileSideMenu && mobileSideMenu.classList.contains('active')) {
                closeSideMenu();
            }
            if (searchModal && searchModal.classList.contains('active')) {
                closeSearchModal();
            }
        }
    });
    
    // 사이드 메뉴의 로그인/회원가입 버튼 클릭 시 기존 로그인 모달 열기
    const sideMenuLoginBtn = document.getElementById('sideMenuLoginBtn');
    const sideMenuLoginBtn2 = document.getElementById('sideMenuLoginBtn2');
    const loginBtn = document.getElementById('loginBtn');
    
    if (sideMenuLoginBtn && loginBtn) {
        sideMenuLoginBtn.addEventListener('click', function() {
            closeSideMenu(); // 사이드 메뉴 닫기
            // 기존 로그인 모달 열기 (auth-modal.js의 함수 호출)
            if (typeof openModal === 'function') {
                openModal();
            }
        });
    }
    
    if (sideMenuLoginBtn2 && loginBtn) {
        sideMenuLoginBtn2.addEventListener('click', function() {
            closeSideMenu(); // 사이드 메뉴 닫기
            // 기존 로그인 모달 열기 (auth-modal.js의 함수 호출)
            if (typeof openModal === 'function') {
                openModal();
            }
        });
    }
    
    // 윈도우 리사이즈 시 모바일 메뉴 상태 초기화
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeSideMenu();
            closeSearchModal();
        }
    });
    
    // 터치 스와이프로 사이드 메뉴 닫기 (모바일)
    let startX = 0;
    let currentX = 0;
    
    if (mobileSideMenu) {
        mobileSideMenu.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
        });
        
        mobileSideMenu.addEventListener('touchmove', function(e) {
            currentX = e.touches[0].clientX;
        });
        
        mobileSideMenu.addEventListener('touchend', function() {
            const diffX = startX - currentX;
            if (diffX > 50) { // 왼쪽으로 스와이프
                closeSideMenu();
            }
        });
    }
    
    // 초기화 완료 로그
    console.log('모바일 메뉴 및 검색 기능 초기화 완료! 🚀');
});
