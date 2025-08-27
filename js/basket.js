// 트립페이지 장바구니 기능 제어
document.addEventListener('DOMContentLoaded', function() {
    console.log('트립페이지 장바구니 시스템 로드됨');
    
    // 장바구니 상품 데이터 (실제로는 서버에서 가져와야 함)
    let basketItems = [
        {
            id: 1,
            name: '아미고 스위스 레드 트레인 여행',
            price: 2500000,
            quantity: 1,
            image: '../images/swiss-train.jpg',
            delivery: '무료',
            deliveryType: '기본배송'
        }
    ];
    
    // 수량 변경 버튼 이벤트
    setupQuantityControls();
    
    // 체크박스 이벤트
    setupCheckboxEvents();
    
    // 장바구니 액션 버튼 이벤트
    setupBasketActions();
    
    // 상품 삭제 이벤트
    setupDeleteEvents();
    
    // 초기 가격 계산
    updateTotalPrice();
    
    console.log('장바구니 시스템 초기화 완료');
    
    // 수량 변경 컨트롤 설정
    function setupQuantityControls() {
        const quantityInputs = document.querySelectorAll('.quantity_input');
        const increaseBtns = document.querySelectorAll('.quantity_btn.increase');
        const decreaseBtns = document.querySelectorAll('.quantity_btn.decrease');
        const changeBtns = document.querySelectorAll('.change_btn');
        
        // 수량 증가
        increaseBtns.forEach((btn, index) => {
            btn.addEventListener('click', function() {
                const input = quantityInputs[index];
                const currentQty = parseInt(input.value);
                input.value = currentQty + 1;
                updateItemPrice(index);
                updateTotalPrice();
            });
        });
        
        // 수량 감소
        decreaseBtns.forEach((btn, index) => {
            btn.addEventListener('click', function() {
                const input = quantityInputs[index];
                const currentQty = parseInt(input.value);
                if (currentQty > 1) {
                    input.value = currentQty - 1;
                    updateItemPrice(index);
                    updateTotalPrice();
                }
            });
        });
        
        // 수량 직접 입력
        quantityInputs.forEach((input, index) => {
            input.addEventListener('input', function() {
                const value = parseInt(this.value);
                if (value < 1) {
                    this.value = 1;
                }
                updateItemPrice(index);
                updateTotalPrice();
            });
        });
        
        // 변경 버튼
        changeBtns.forEach((btn, index) => {
            btn.addEventListener('click', function() {
                const input = quantityInputs[index];
                const newQty = parseInt(input.value);
                if (newQty >= 1) {
                    basketItems[index].quantity = newQty;
                    updateItemPrice(index);
                    updateTotalPrice();
                    showMessage('수량이 변경되었습니다.');
                }
            });
        });
    }
    
    // 체크박스 이벤트 설정
    function setupCheckboxEvents() {
        const productCheckboxes = document.querySelectorAll('.product_item input[type="checkbox"]');
        const selectAllBtn = document.querySelector('.select_all_btn');
        const selectDeleteBtn = document.querySelector('.select_delete_btn');
        
        // 개별 상품 체크박스
        productCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                updateTotalPrice();
            });
        });
        
        // 전체선택
        if (selectAllBtn) {
            selectAllBtn.addEventListener('click', function() {
                productCheckboxes.forEach(checkbox => {
                    checkbox.checked = true;
                });
                updateTotalPrice();
            });
        }
        
        // 선택삭제
        if (selectDeleteBtn) {
            selectDeleteBtn.addEventListener('click', function() {
                const checkedItems = Array.from(productCheckboxes).filter(cb => cb.checked);
                if (checkedItems.length === 0) {
                    showMessage('삭제할 상품을 선택해주세요.');
                    return;
                }
                
                if (confirm('선택한 상품을 장바구니에서 삭제하시겠습니까?')) {
                    checkedItems.forEach(checkbox => {
                        const productItem = checkbox.closest('.product_item');
                        if (productItem) {
                            productItem.remove();
                        }
                    });
                    updateTotalPrice();
                    showMessage('선택한 상품이 삭제되었습니다.');
                }
            });
        }
    }
    
    // 장바구니 액션 버튼 설정
    function setupBasketActions() {
        const estimateBtn = document.querySelector('.estimate_btn');
        const overseasMoveBtn = document.querySelector('.overseas_move_btn');
        const orderAllBtn = document.querySelector('.order_all_btn');
        const orderSelectedBtn = document.querySelector('.order_selected_btn');
        
        // 견적서출력
        if (estimateBtn) {
            estimateBtn.addEventListener('click', function() {
                showMessage('견적서 출력 기능은 준비 중입니다.');
            });
        }
        
        // 해외장바구니로 이동
        if (overseasMoveBtn) {
            overseasMoveBtn.addEventListener('click', function() {
                showMessage('해외배송 장바구니로 이동 기능은 준비 중입니다.');
            });
        }
        
        // 전체상품주문
        if (orderAllBtn) {
            orderAllBtn.addEventListener('click', function() {
                const checkedItems = Array.from(document.querySelectorAll('.product_item input[type="checkbox"]')).filter(cb => cb.checked);
                if (checkedItems.length === 0) {
                    showMessage('주문할 상품을 선택해주세요.');
                    return;
                }
                
                if (confirm('장바구니의 모든 상품을 주문하시겠습니까?')) {
                    showMessage('주문서 작성 페이지로 이동합니다.');
                    // 실제로는 주문서 작성 페이지로 이동
                    // window.location.href = '/order/orderform.html';
                }
            });
        }
        
        // 선택상품주문
        if (orderSelectedBtn) {
            orderSelectedBtn.addEventListener('click', function() {
                const checkedItems = Array.from(document.querySelectorAll('.product_item input[type="checkbox"]')).filter(cb => cb.checked);
                if (checkedItems.length === 0) {
                    showMessage('주문할 상품을 선택해주세요.');
                    return;
                }
                
                if (confirm('선택한 상품을 주문하시겠습니까?')) {
                    showMessage('주문서 작성 페이지로 이동합니다.');
                    // 실제로는 주문서 작성 페이지로 이동
                    // window.location.href = '/order/orderform.html';
                }
            });
        }
    }
    
    // 상품 삭제 이벤트 설정
    function setupDeleteEvents() {
        const deleteBtns = document.querySelectorAll('.delete_btn');
        
        deleteBtns.forEach((btn, index) => {
            btn.addEventListener('click', function() {
                if (confirm('이 상품을 장바구니에서 삭제하시겠습니까?')) {
                    const productItem = this.closest('.product_item');
                    if (productItem) {
                        productItem.remove();
                        basketItems.splice(index, 1);
                        updateTotalPrice();
                        showMessage('상품이 삭제되었습니다.');
                    }
                }
            });
        });
    }
    
    // 개별 상품 가격 업데이트
    function updateItemPrice(index) {
        if (basketItems[index]) {
            const item = basketItems[index];
            const quantityInput = document.querySelectorAll('.quantity_input')[index];
            const totalElement = document.querySelectorAll('.product_total strong')[index];
            
            if (quantityInput && totalElement) {
                const quantity = parseInt(quantityInput.value);
                const total = item.price * quantity;
                totalElement.textContent = total.toLocaleString();
                item.quantity = quantity;
            }
        }
    }
    
    // 총 가격 업데이트
    function updateTotalPrice() {
        const checkedItems = Array.from(document.querySelectorAll('.product_item input[type="checkbox"]:checked'));
        let totalPrice = 0;
        let totalDelivery = 0;
        
        checkedItems.forEach((checkbox, index) => {
            if (basketItems[index]) {
                const item = basketItems[index];
                totalPrice += item.price * item.quantity;
                
                // 배송비 계산 (무료 배송이 아닌 경우)
                if (item.delivery !== '무료') {
                    totalDelivery += 2500; // 기본 배송비 2,500원
                }
            }
        });
        
        // 총 상품금액 업데이트
        const totalProductPrice = document.querySelector('.summary_item:first-child strong');
        if (totalProductPrice) {
            totalProductPrice.textContent = totalPrice.toLocaleString();
        }
        
        // 총 배송비 업데이트
        const totalDeliveryPrice = document.querySelector('.summary_item:nth-child(2) strong');
        if (totalDeliveryPrice) {
            totalDeliveryPrice.textContent = totalDelivery.toLocaleString();
        }
        
        // 결제예정금액 업데이트
        const finalTotal = document.querySelector('.summary_total strong');
        if (finalTotal) {
            finalTotal.textContent = (totalPrice + totalDelivery).toLocaleString();
        }
        
        // 장바구니 아이콘의 상품 수 업데이트
        const cartCount = document.querySelector('.cart_count');
        if (cartCount) {
            cartCount.textContent = checkedItems.length;
        }
    }
    
    // 메시지 표시
    function showMessage(message) {
        // 간단한 토스트 메시지 표시
        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #333;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
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
    `;
    document.head.appendChild(style);
});
