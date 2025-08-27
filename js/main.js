// Trippage Clone - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initTopBanner();
    initNavigation();
    initProductTabs();
    initBannerSlider();
    initScrollEffects();
    initMobileMenu();
});

// Top Banner Management
function initTopBanner() {
    const topBanner = document.querySelector('.main_top_banner');
    const closeCheckbox = document.getElementById('top_banner_box_cloase');
    const closeIcon = document.querySelector('.icoClose');
    
    if (!topBanner) return;
    
    // Check if banner was closed for today
    const bannerClosed = localStorage.getItem('topBannerClosed');
    const today = new Date().toDateString();
    
    if (bannerClosed === today) {
        topBanner.style.display = 'none';
        return;
    }
    
    // Close banner functionality
    if (closeCheckbox) {
        closeCheckbox.addEventListener('change', function() {
            if (this.checked) {
                localStorage.setItem('topBannerClosed', today);
                topBanner.style.display = 'none';
            }
        });
    }
    
    if (closeIcon) {
        closeIcon.addEventListener('click', function() {
            topBanner.style.display = 'none';
        });
    }
}

// Navigation Management
function initNavigation() {
    const navFold = document.querySelector('.eNavFold');
    const topNavBox = document.getElementById('top_nav_box');
    
    if (navFold && topNavBox) {
        navFold.addEventListener('click', function() {
            topNavBox.classList.toggle('nav-folded');
        });
    }
    
    // Sticky header effect
    let lastScrollTop = 0;
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
        
        // Hide header on scroll down, show on scroll up
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Customer Service Dropdown
    initCustomerServiceDropdown();
}

// Customer Service Dropdown Management
function initCustomerServiceDropdown() {
    const customerServiceLink = document.querySelector('.toparea_state_board > a');
    const customerServiceBoard = document.querySelector('.toparea_state_board');
    
    if (customerServiceLink && customerServiceBoard) {
        customerServiceLink.addEventListener('click', function(e) {
            e.preventDefault();
            customerServiceBoard.classList.toggle('on');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!customerServiceBoard.contains(e.target)) {
                customerServiceBoard.classList.remove('on');
            }
        });
        
        // Close dropdown on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                customerServiceBoard.classList.remove('on');
            }
        });
    }
}

// Product Tab Management
function initProductTabs() {
    const tabButtons = document.querySelectorAll('.main_product_tab .button');
    const tabContents = document.querySelectorAll('.tabcontent');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-id');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and target content
            this.classList.add('active');
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// Banner Slider Management
function initBannerSlider() {
    const bannerItems = document.querySelectorAll('.banner_item');
    const prevButton = document.querySelector('.banner_controls .prev');
    const nextButton = document.querySelector('.banner_controls .next');
    
    if (bannerItems.length === 0) return;
    
    let currentIndex = 0;
    const totalItems = bannerItems.length;
    
    // Show first banner
    showBanner(currentIndex);
    
    // Auto slide every 5 seconds
    setInterval(() => {
        nextBanner();
    }, 5000);
    
    // Previous button
    if (prevButton) {
        prevButton.addEventListener('click', function() {
            prevBanner();
        });
    }
    
    // Next button
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            nextBanner();
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevBanner();
        } else if (e.key === 'ArrowRight') {
            nextBanner();
        }
    });
    
    function showBanner(index) {
        bannerItems.forEach((item, i) => {
            if (i === index) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
    
    function nextBanner() {
        currentIndex = (currentIndex + 1) % totalItems;
        showBanner(currentIndex);
    }
    
    function prevBanner() {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        showBanner(currentIndex);
    }
}

// Scroll Effects
function initScrollEffects() {
    // Intersection Observer for fade-in effects
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for fade-in effect
    const fadeElements = document.querySelectorAll('.main_title_section, .main_3dan_banner, .main_product_category, .main_text, .main_map');
    fadeElements.forEach(el => {
        el.classList.add('fade-element');
        observer.observe(el);
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Mobile Menu Management
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.eNavFold');
    const topCategory = document.querySelector('.top_category');
    
    if (mobileMenuToggle && topCategory) {
        mobileMenuToggle.addEventListener('click', function() {
            topCategory.classList.toggle('mobile-open');
            this.classList.toggle('active');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuToggle.contains(e.target) && !topCategory.contains(e.target)) {
                topCategory.classList.remove('mobile-open');
                mobileMenuToggle.classList.remove('active');
            }
        });
    }
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Search Functionality
function initSearch() {
    const searchButton = document.querySelector('.eSearch');
    
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            // Search functionality can be implemented here
            console.log('Search button clicked');
        });
    }
}

// Wishlist and Cart Management
function initWishlistCart() {
    // Wishlist functionality
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('wish')) {
            e.preventDefault();
            const productItem = e.target.closest('.prdList__item');
            const productName = productItem.querySelector('.description .name a').textContent;
            
            // Toggle wishlist state
            e.target.classList.toggle('active');
            if (e.target.classList.contains('active')) {
                e.target.textContent = 'WISHED';
                showNotification(`${productName}이 위시리스트에 추가되었습니다.`);
            } else {
                e.target.textContent = 'WISH';
                showNotification(`${productName}이 위시리스트에서 제거되었습니다.`);
            }
        }
        
        // Cart functionality
        if (e.target.classList.contains('cart')) {
            e.preventDefault();
            const productItem = e.target.closest('.prdList__item');
            const productName = productItem.querySelector('.description .name a').textContent;
            
            // Add to cart animation
            e.target.textContent = 'ADDED';
            e.target.classList.add('added');
            
            setTimeout(() => {
                e.target.textContent = 'ADD';
                e.target.classList.remove('added');
            }, 2000);
            
            showNotification(`${productName}이 장바구니에 추가되었습니다.`);
        }
    });
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    initSearch();
    initWishlistCart();
});

// Performance optimization
window.addEventListener('load', function() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // You can add error reporting here
});

// Add CSS for new features
const additionalStyles = `
    .fade-element {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .fade-element.fade-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .sticky {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        transition: transform 0.3s ease;
    }
    
    .search-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    }
    
    .search-modal-content {
        background: white;
        padding: 30px;
        border-radius: 10px;
        width: 90%;
        max-width: 500px;
    }
    
    .search-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }
    
    .close-search {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
    }
    
    .search-input-container {
        display: flex;
        gap: 10px;
    }
    
    .search-input {
        flex: 1;
        padding: 12px;
        border: 2px solid #ddd;
        border-radius: 5px;
        font-size: 16px;
    }
    
    .search-submit {
        padding: 12px 20px;
        background: #667eea;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-weight: 600;
    }
    
    .wish.active,
    .cart.added {
        background: #4CAF50 !important;
    }
    
    @media (max-width: 768px) {
        .top_category.mobile-open {
            display: block;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border-top: 1px solid #eee;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 1000;
        }
        
        .top_category.mobile-open ul {
            flex-direction: column;
            padding: 20px;
        }
        
        .top_category.mobile-open li {
            margin-bottom: 15px;
        }
        
        .eNavFold.active .icon {
            transform: rotate(180deg);
        }
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
