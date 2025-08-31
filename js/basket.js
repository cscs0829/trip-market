// 장바구니 기능
class Basket {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('basket')) || [];
        this.init();
    }

    // 초기화
    init() {
        this.updateBasketCount();
        this.bindEvents();
    }

    // 이벤트 바인딩
    bindEvents() {
        // 장바구니 버튼 클릭 이벤트
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-basket')) {
                const productId = e.target.dataset.productId;
                const productName = e.target.dataset.productName;
                const productPrice = parseInt(e.target.dataset.productPrice);
                const productImage = e.target.dataset.productImage;
                
                this.addItem({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1
                });
            }
        });

        // 장바구니 아이콘 클릭 시 장바구니 페이지로 이동
        const basketIcon = document.querySelector('.bottom-nav__btn[onclick*="장바구니"]');
        if (basketIcon) {
            basketIcon.removeAttribute('onclick');
            basketIcon.addEventListener('click', (e) => {
                e.preventDefault();
                this.openBasket();
            });
        }
    }

    // 상품 추가
    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push(product);
        }
        
        this.saveToStorage();
        this.updateBasketCount();
        this.showNotification('상품이 장바구니에 추가되었습니다!');
    }

    // 상품 제거
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveToStorage();
        this.updateBasketCount();
        this.updateBasketDisplay();
    }

    // 수량 변경
    updateQuantity(productId, newQuantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (newQuantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = newQuantity;
                this.saveToStorage();
                this.updateBasketDisplay();
            }
        }
    }

    // 장바구니 비우기
    clearBasket() {
        this.items = [];
        this.saveToStorage();
        this.updateBasketCount();
        this.updateBasketDisplay();
    }

    // 로컬 스토리지에 저장
    saveToStorage() {
        localStorage.setItem('basket', JSON.stringify(this.items));
    }

    // 장바구니 개수 업데이트
    updateBasketCount() {
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        const badge = document.querySelector('.bottom-nav__badge');
        
        if (badge) {
            if (totalItems > 0) {
                badge.textContent = totalItems;
                badge.style.display = 'block';
            } else {
                badge.style.display = 'none';
            }
        }
    }

    // 장바구니 표시 업데이트
    updateBasketDisplay() {
        const basketContainer = document.getElementById('basketItems');
        if (basketContainer) {
            this.renderBasketItems(basketContainer);
        }
    }

    // 장바구니 아이템 렌더링
    renderBasketItems(container) {
        if (this.items.length === 0) {
            container.innerHTML = `
                <div class="empty-basket">
                    <div class="empty-basket-icon">🛒</div>
                    <h3>장바구니가 비어있습니다</h3>
                    <p>상품을 추가해보세요!</p>
                    <a href="/" class="btn-primary">쇼핑 계속하기</a>
                </div>
            `;
            return;
        }

        const totalPrice = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        container.innerHTML = `
            <div class="basket-items">
                ${this.items.map(item => `
                    <div class="basket-item" data-id="${item.id}">
                        <div class="basket-item-image">
                            <img src="${item.image}" alt="${item.name}">
                        </div>
                        <div class="basket-item-details">
                            <h4>${item.name}</h4>
                            <div class="basket-item-price">₩${item.price.toLocaleString()}</div>
                            <div class="basket-item-quantity">
                                <button class="quantity-btn minus" onclick="basket.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                                <span>${item.quantity}</span>
                                <button class="quantity-btn plus" onclick="basket.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                            </div>
                        </div>
                        <button class="remove-btn" onclick="basket.removeItem('${item.id}')">×</button>
                    </div>
                `).join('')}
            </div>
            <div class="basket-summary">
                <div class="basket-total">
                    <span>총 금액:</span>
                    <span class="total-price">₩${totalPrice.toLocaleString()}</span>
                </div>
                <div class="basket-actions">
                    <button class="btn-secondary" onclick="basket.clearBasket()">장바구니 비우기</button>
                    <button class="btn-primary" onclick="basket.checkout()">주문하기</button>
                </div>
            </div>
        `;
    }

    // 장바구니 열기
    openBasket() {
        // 장바구니 페이지인 경우 아이템 렌더링
        const basketContainer = document.getElementById('basketItems');
        if (basketContainer) {
            this.renderBasketItems(basketContainer);
        }
        
        // 장바구니 페이지로 이동하거나 모달로 표시
        if (window.location.pathname.includes('basket.html')) {
            // 이미 장바구니 페이지에 있는 경우
            return;
        }
        
        // 장바구니 페이지로 이동
        window.location.href = 'order/basket.html';
    }

    // 주문하기
    checkout() {
        if (this.items.length === 0) {
            alert('장바구니가 비어있습니다.');
            return;
        }
        
        // 주문 페이지로 이동
        alert('주문 페이지로 이동합니다.');
        // window.location.href = 'order/checkout.html';
    }

    // 알림 표시
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'basket-notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // 애니메이션 효과
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // 3초 후 제거
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // 장바구니 아이템 가져오기
    getItems() {
        return this.items;
    }

    // 장바구니 총 금액
    getTotalPrice() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }
}

// 전역 장바구니 인스턴스 생성
const basket = new Basket();

// 페이지 로드 시 장바구니 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 장바구니 페이지인 경우 아이템 렌더링
    const basketContainer = document.getElementById('basketItems');
    if (basketContainer) {
        basket.renderBasketItems(basketContainer);
    }
    
    console.log('장바구니 기능 초기화 완료! 🛒');
});
