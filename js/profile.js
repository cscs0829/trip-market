// Profile Management JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Profile dropdown functionality
    const profileIcon = document.getElementById('profileIcon');
    const profileDropdown = document.getElementById('profileDropdown');
    
    if (profileIcon && profileDropdown) {
        // Toggle dropdown on click
        profileIcon.addEventListener('click', function(e) {
            e.preventDefault();
            profileDropdown.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!profileIcon.contains(e.target) && !profileDropdown.contains(e.target)) {
                profileDropdown.classList.remove('show');
            }
        });
        
        // Close dropdown on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                profileDropdown.classList.remove('show');
            }
        });
    }
    
    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('정말 로그아웃 하시겠습니까?')) {
                logout();
            }
        });
    }
    
    // Check authentication status
    checkAuthStatus();
    
    // Initialize profile stats
    initializeProfileStats();
});

// Authentication status check
function checkAuthStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    
    if (isLoggedIn === 'true' && userInfo.email) {
        // User is logged in - show profile menu
        showLoggedInState(userInfo);
    } else {
        // User is not logged in - redirect to login or show login prompt
        showLoggedOutState();
    }
}

// Show logged in state
function showLoggedInState(userInfo) {
    // Update profile info in dropdown
    const profileName = document.querySelector('.profile_details h4');
    const profileEmail = document.querySelector('.profile_details p');
    
    if (profileName && profileEmail) {
        profileName.textContent = userInfo.name || '사용자';
        profileEmail.textContent = userInfo.email || '';
    }
    
    // Update main profile info
    const mainProfileName = document.querySelector('.profile_info_large h2');
    const mainProfileEmail = document.querySelector('.profile_info_large p');
    
    if (mainProfileName && mainProfileEmail) {
        mainProfileName.textContent = userInfo.name || '사용자';
        mainProfileEmail.textContent = userInfo.email || '';
    }
    
    // Show profile icon
    const profileIcon = document.querySelector('.profile_icon');
    if (profileIcon) {
        profileIcon.style.display = 'flex';
    }
    
    // Hide login/join links in header
    const loginLinks = document.querySelectorAll('.xans-layout-statelogoff');
    loginLinks.forEach(link => {
        link.style.display = 'none';
    });
}

// Show logged out state
function showLoggedOutState() {
    // Hide profile icon
    const profileIcon = document.querySelector('.profile_icon');
    if (profileIcon) {
        profileIcon.style.display = 'none';
    }
    
    // Show login/join links in header
    const loginLinks = document.querySelectorAll('.xans-layout-statelogoff');
    loginLinks.forEach(link => {
        link.style.display = 'inline-block';
    });
    
    // If on profile page, redirect to login
    if (window.location.pathname.includes('/member/profile.html')) {
        window.location.href = 'login.html';
    }
}

// Logout function
function logout() {
    // Clear authentication data
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('userToken');
    
    // Show success message
    showNotification('로그아웃되었습니다.', 'success');
    
    // Redirect to home page after a short delay
    setTimeout(() => {
        window.location.href = '../index.html';
    }, 1500);
}

// Initialize profile statistics
function initializeProfileStats() {
    // Get user's order history from localStorage
    const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const recentViews = JSON.parse(localStorage.getItem('recentViews') || '[]');
    
    // Update stats
    updateStat('order', orderHistory.length);
    updateStat('wishlist', wishlist.length);
    updateStat('recent', recentViews.length);
    
    // Calculate points (example: 100 points per order)
    const totalPoints = orderHistory.length * 100;
    updateStat('points', totalPoints);
    
    // Update recent orders display
    updateRecentOrders(orderHistory);
}

// Update statistics
function updateStat(type, value) {
    const statElement = document.querySelector(`[data-stat="${type}"]`);
    if (statElement) {
        statElement.textContent = value.toLocaleString();
    }
}

// Update recent orders display
function updateRecentOrders(orders) {
    const orderList = document.querySelector('.order_list');
    if (!orderList || orders.length === 0) return;
    
    // Clear existing orders
    orderList.innerHTML = '';
    
    // Show last 3 orders
    const recentOrders = orders.slice(-3).reverse();
    
    recentOrders.forEach(order => {
        const orderItem = document.createElement('div');
        orderItem.className = 'order_item';
        
        orderItem.innerHTML = `
            <div class="order_info">
                <h4>${order.title}</h4>
                <p>${order.date}</p>
                <span class="order_status ${order.status}">${getStatusText(order.status)}</span>
            </div>
            <div class="order_price">
                <p>₩${order.price.toLocaleString()}</p>
            </div>
        `;
        
        orderList.appendChild(orderItem);
    });
}

// Get status text
function getStatusText(status) {
    const statusMap = {
        'completed': '완료',
        'processing': '처리중',
        'shipped': '배송중',
        'delivered': '배송완료',
        'cancelled': '취소됨'
    };
    
    return statusMap[status] || status;
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.background = '#28a745';
            break;
        case 'error':
            notification.style.background = '#dc3545';
            break;
        case 'warning':
            notification.style.background = '#ffc107';
            notification.style.color = '#212529';
            break;
        default:
            notification.style.background = '#17a2b8';
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add CSS animations
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
