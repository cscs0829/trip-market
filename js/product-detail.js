// 트립페이지 상품 상세 페이지 기능 제어
document.addEventListener('DOMContentLoaded', function() {
    console.log('트립페이지 상품 상세 시스템 로드됨');
    
    // 상품 정보
    const productInfo = {
        id: 15,
        name: '아미고 스위스 레드 트레인 여행',
        price: 2500000,
        category: '투어'
    };
    
    // 현재 날짜를 최소 출발일로 설정
    setupDateInput();
    
    // 썸네일 이미지 클릭 이벤트
    setupThumbnailEvents();
    
    // 관심상품 버튼 이벤트
    setupWishButton();
    
    // 장바구니 담기 버튼 이벤트
    setupAddToCartButton();
    
    // 탭 기능
    setupTabs();
    
    console.log('상품 상세 시스템 초기화 완료');
    
    // 날짜 입력 설정
    function setupDateInput() {
        const departureDateInput = document.getElementById('departureDate');
        if (departureDateInput) {
            // 오늘부터 1년 후까지 선택 가능
            const today = new Date();
            const maxDate = new Date();
            maxDate.setFullYear(today.getFullYear() + 1);
            
            departureDateInput.min = today.toISOString().split('T')[0];
            departureDateInput.max = maxDate.toISOString().split('T')[0];
        }
    }
    
    // 썸네일 이미지 클릭 이벤트
    function setupThumbnailEvents() {
        const thumbnails = document.querySelectorAll('.thumbnail');
        const mainImage = document.getElementById('mainImage');
        
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                // 활성 썸네일 표시 변경
                thumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // 메인 이미지 변경
                if (mainImage) {
                    const newSrc = this.getAttribute('data-src');
                    mainImage.src = newSrc;
                    mainImage.alt = this.alt;
                }
            });
        });
    }
    
    // 관심상품 버튼 이벤트
    function setupWishButton() {
        const wishBtn = document.getElementById('wishBtn');
        const wishIcon = document.getElementById('wishIcon');
        let isWished = false;
        
        if (wishBtn) {
            wishBtn.addEventListener('click', function() {
                if (!isWished) {
                    // 관심상품 등록
                    isWished = true;
                    wishIcon.src = '../images/wish-on.png';
                    wishIcon.alt = '관심상품 등록됨';
                    wishBtn.querySelector('span').textContent = 'WISHED';
                    wishBtn.classList.add('active');
                    
                    showMessage('관심상품에 등록되었습니다.');
                    
                    // 로컬 스토리지에 저장
                    saveWishItem(productInfo);
                } else {
                    // 관심상품 해제
                    isWished = false;
                    wishIcon.src = '../images/wish-off.png';
                    wishIcon.alt = '관심상품 등록 전';
                    wishBtn.querySelector('span').textContent = 'WISH';
                    wishBtn.classList.remove('active');
                    
                    showMessage('관심상품에서 해제되었습니다.');
                    
                    // 로컬 스토리지에서 제거
                    removeWishItem(productInfo.id);
                }
            });
        }
    }
    
    // 장바구니 담기 버튼 이벤트
    function setupAddToCartButton() {
        const addToCartBtn = document.getElementById('addToCartBtn');
        
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', function() {
                // 필수 옵션 선택 확인
                if (!validateOptions()) {
                    showMessage('필수 옵션을 선택해주세요.', 'error');
                    return;
                }
                
                // 장바구니에 상품 추가 확인
                if (confirm('장바구니에 동일한 상품이 있습니다.\n장바구니에 추가하시겠습니까?')) {
                    addToCart();
                }
            });
        }
    }
    
    // 옵션 유효성 검사
    function validateOptions() {
        const travelPeriod = document.getElementById('travelPeriod');
        const travelers = document.getElementById('travelers');
        const departureDate = document.getElementById('departureDate');
        
        if (!travelPeriod.value) {
            showMessage('여행 기간을 선택해주세요.', 'error');
            return false;
        }
        
        if (!travelers.value) {
            showMessage('출발 인원을 선택해주세요.', 'error');
            return false;
        }
        
        if (!departureDate.value) {
            showMessage('출발 날짜를 선택해주세요.', 'error');
            return false;
        }
        
        return true;
    }
    
    // 장바구니에 상품 추가
    function addToCart() {
        const travelPeriod = document.getElementById('travelPeriod');
        const travelers = document.getElementById('travelers');
        const departureDate = document.getElementById('departureDate');
        
        const cartItem = {
            id: productInfo.id,
            name: productInfo.name,
            price: productInfo.price,
            category: productInfo.category,
            image: '../images/swiss-train.jpg',
            options: {
                travelPeriod: travelPeriod.options[travelPeriod.selectedIndex].text,
                travelers: travelers.options[travelers.selectedIndex].text,
                departureDate: departureDate.value
            },
            quantity: 1,
            addedAt: new Date().toISOString()
        };
        
        // 로컬 스토리지에 장바구니 상품 저장
        saveCartItem(cartItem);
        
        // 성공 메시지 표시
        showMessage('상품이 장바구니에 추가되었습니다.', 'success');
        
        // 장바구니 아이콘 업데이트
        updateCartCount();
        
        // 옵션 초기화
        resetOptions();
    }
    
    // 탭 기능 설정
    function setupTabs() {
        const tabHeaders = document.querySelectorAll('.tab_headers li');
        const tabContents = document.querySelectorAll('.tab_content');
        
        tabHeaders.forEach((header, index) => {
            header.addEventListener('click', function(e) {
                e.preventDefault();
                
                // 활성 탭 변경
                tabHeaders.forEach(h => h.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                this.classList.add('active');
                tabContents[index].classList.add('active');
            });
        });
    }
    
    // 관심상품 저장
    function saveWishItem(item) {
        let wishItems = JSON.parse(localStorage.getItem('wishItems') || '[]');
        
        // 중복 확인
        const existingIndex = wishItems.findIndex(wish => wish.id === item.id);
        if (existingIndex === -1) {
            wishItems.push({
                ...item,
                addedAt: new Date().toISOString()
            });
            localStorage.setItem('wishItems', JSON.stringify(wishItems));
        }
    }
    
    // 관심상품 제거
    function removeWishItem(itemId) {
        let wishItems = JSON.parse(localStorage.getItem('wishItems') || '[]');
        wishItems = wishItems.filter(item => item.id !== itemId);
        localStorage.setItem('wishItems', JSON.stringify(wishItems));
    }
    
    // 장바구니 상품 저장
    function saveCartItem(item) {
        let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
        
        // 중복 상품 확인 (옵션이 동일한 경우)
        const existingIndex = cartItems.findIndex(cart => 
            cart.id === item.id && 
            JSON.stringify(cart.options) === JSON.stringify(item.options)
        );
        
        if (existingIndex !== -1) {
            // 기존 상품 수량 증가
            cartItems[existingIndex].quantity += 1;
        } else {
            // 새 상품 추가
            cartItems.push(item);
        }
        
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
    
    // 장바구니 아이콘 업데이트
    function updateCartCount() {
        const cartCount = document.querySelector('.cart_count');
        if (cartCount) {
            const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
            const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalQuantity;
        }
    }
    
    // 옵션 초기화
    function resetOptions() {
        const travelPeriod = document.getElementById('travelPeriod');
        const travelers = document.getElementById('travelers');
        const departureDate = document.getElementById('departureDate');
        
        if (travelPeriod) travelPeriod.value = '';
        if (travelers) travelers.value = '';
        if (departureDate) departureDate.value = '';
    }
    
    // 메시지 표시
    function showMessage(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast-message toast-${type}`;
        toast.textContent = message;
        
        // 메시지 타입에 따른 스타일
        const styles = {
            info: 'background: #333; color: white;',
            success: 'background: #4CAF50; color: white;',
            error: 'background: #f44336; color: white;'
        };
        
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            ${styles[type]}
        `;
        
        document.body.appendChild(toast);
        
        // 3초 후 자동 제거
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
    
    // CSS 애니메이션 추가
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .wish_btn.active {
            background-color: #ff6b6b;
            color: white;
        }
        
        .thumbnail {
            cursor: pointer;
            opacity: 0.6;
            transition: opacity 0.3s;
        }
        
        .thumbnail.active {
            opacity: 1;
            border: 2px solid #007bff;
        }
        
        .tab_headers li {
            cursor: pointer;
        }
        
        .tab_headers li.active {
            border-bottom: 2px solid #007bff;
        }
        
        .tab_content {
            display: none;
        }
        
        .tab_content.active {
            display: block;
        }
    `;
    document.head.appendChild(style);
    
    // 페이지 로드 시 장바구니 아이콘 업데이트
    updateCartCount();
});
