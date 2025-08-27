// Main Page Profile Management JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Profile dropdown functionality
    const profileIcon = document.getElementById('profileIcon');
    const profileDropdown = document.getElementById('profileDropdown');
    
    if (profileIcon && profileDropdown) {
        // Toggle dropdown on click
        profileIcon.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Check if user is logged in
            const isLoggedIn = localStorage.getItem('isLoggedIn');
            
            if (isLoggedIn === 'true') {
                // User is logged in - show profile dropdown
                profileDropdown.classList.toggle('show');
            } else {
                // User is not logged in - show auth modal
                showAuthModal();
            }
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
    
    // Check authentication status on page load
    checkAuthStatus();
    
    // Initialize profile menu based on auth status
    initializeProfileMenu();
});

// Authentication status check
function checkAuthStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    
    if (isLoggedIn === 'true' && userInfo.email) {
        // User is logged in - show profile menu
        showLoggedInState(userInfo);
    } else {
        // User is not logged in - show login/join menu
        showLoggedOutState();
    }
}

// Show logged in state
function showLoggedInState(userInfo) {
    // Create profile icon if it doesn't exist
    createProfileIcon();
    
    // Update profile info in dropdown
    const profileName = document.querySelector('.profile_details h4');
    const profileEmail = document.querySelector('.profile_details p');
    
    if (profileName && profileEmail) {
        profileName.textContent = userInfo.name || '사용자';
        profileEmail.textContent = userInfo.email || '';
    }
    
    // Update profile menu for logged in users
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
        
        // Add logout functionality
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
    
    // Hide login/join links in header
    const loginLinks = document.querySelectorAll('.xans-layout-statelogoff');
    loginLinks.forEach(link => {
        link.style.display = 'none';
    });
}

// Show logged out state
function showLoggedOutState() {
    // Remove profile icon if it exists
    const profileIcon = document.getElementById('profileIcon');
    if (profileIcon) {
        profileIcon.closest('.user_profile_menu').remove();
    }
    
    // Show login/join links in header
    const loginLinks = document.querySelectorAll('.xans-layout-statelogoff');
    loginLinks.forEach(link => {
        link.style.display = 'inline-block';
    });
}

// Logout function
function logout() {
    // Clear authentication data
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('userToken');
    
    // Show success message
    showNotification('로그아웃되었습니다.', 'success');
    
    // Refresh the page to update the UI
    setTimeout(() => {
        window.location.reload();
    }, 1500);
}

// Initialize profile menu
function initializeProfileMenu() {
    // Add click handlers for profile menu items
    const profileMenu = document.querySelector('.profile_menu');
    if (profileMenu) {
        profileMenu.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                // Close dropdown when menu item is clicked
                const profileDropdown = document.getElementById('profileDropdown');
                if (profileDropdown) {
                    profileDropdown.classList.remove('show');
                }
            }
        });
    }
}

// Create profile icon
function createProfileIcon() {
    // Check if profile icon already exists
    if (document.getElementById('profileIcon')) {
        return;
    }
    
    // Find the header area where to insert the profile icon
    const headerArea = document.querySelector('.top_mypage');
    if (!headerArea) {
        return;
    }
    
    // Create profile icon container
    const profileContainer = document.createElement('div');
    profileContainer.className = 'user_profile_menu';
    profileContainer.innerHTML = `
        <a href="#" class="profile_icon" id="profileIcon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" class="icon" role="img">
                <circle cx="11.5" cy="6.5" r="3.75" stroke="#000" stroke-width="1.5"></circle>
                <path stroke="#000" stroke-width="1.5" d="M1.78 21.25c.382-4.758 4.364-8.5 9.22-8.5h1c4.856 0 8.838 3.742 9.22 8.5H1.78z"></path>
            </svg>
        </a>
        <div class="profile_dropdown" id="profileDropdown">
            <div class="profile_info">
                <div class="profile_avatar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24">
                        <circle cx="12" cy="8" r="5" stroke="#6c757d" stroke-width="2"></circle>
                        <path stroke="#6c757d" stroke-width="2" d="M20 21c0-4.418-3.582-8-8-8s-8 3.582-8 8"></path>
                    </svg>
                </div>
                <div class="profile_details">
                    <h4>사용자</h4>
                    <p>로그인이 필요합니다</p>
                </div>
            </div>
            <ul class="profile_menu">
                <li><a href="member/login.html"><i class="icon">🔑</i> 로그인</a></li>
                <li><a href="member/agreement.html"><i class="icon">📝</i> 회원가입</a></li>
                <li><a href="order/list.html"><i class="icon">📦</i> 주문조회</a></li>
                <li><a href="recent-view-product.html"><i class="icon">👁️</i> 최근 본 상품</a></li>
            </ul>
        </div>
    `;
    
    // Insert profile icon before the cart icon
    const cartIcon = headerArea.querySelector('a[href*="basket"]');
    if (cartIcon) {
        headerArea.insertBefore(profileContainer, cartIcon);
    } else {
        headerArea.appendChild(profileContainer);
    }
    
    // Add event listeners to the new profile icon
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
}

// Show auth modal
function showAuthModal() {
    const authModal = document.getElementById('authModal');
    if (authModal) {
        authModal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // 스크롤 방지
        
        // Show email step
        const emailStep = document.getElementById('emailStep');
        if (emailStep) {
            emailStep.style.display = 'block';
        }
        
        // Hide other steps
        const loginStep = document.getElementById('loginStep');
        const registerStep = document.getElementById('registerStep');
        const agreementStep = document.getElementById('agreementStep');
        
        if (loginStep) loginStep.style.display = 'none';
        if (registerStep) registerStep.style.display = 'none';
        if (agreementStep) agreementStep.style.display = 'none';
        
        // Add event listener for modal close to update profile menu
        const closeBtn = document.getElementById('authCloseBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                // Check if user is logged in after modal closes
                setTimeout(() => {
                    checkAuthStatus();
                }, 100);
            });
        }
    }
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
