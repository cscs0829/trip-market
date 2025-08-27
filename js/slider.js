// Trippage Clone - Slider JavaScript

class ProductSlider {
    constructor(container, options = {}) {
        this.container = typeof container === 'string' ? document.querySelector(container) : container;
        this.options = {
            slidesToShow: options.slidesToShow || 4,
            slidesToScroll: options.slidesToScroll || 1,
            autoplay: options.autoplay !== false,
            autoplaySpeed: options.autoplaySpeed || 3000,
            pauseOnHover: options.pauseOnHover !== false,
            dots: options.dots !== false,
            arrows: options.arrows !== false,
            responsive: options.responsive || [],
            ...options
        };
        
        this.currentSlide = 0;
        this.totalSlides = 0;
        this.autoplayInterval = null;
        this.isAnimating = false;
        
        this.init();
    }
    
    init() {
        if (!this.container) return;
        
        this.slides = this.container.querySelectorAll('.slide-item, .prdList__item');
        this.totalSlides = this.slides.length;
        
        if (this.totalSlides === 0) return;
        
        this.createSliderStructure();
        this.setupEventListeners();
        this.updateSlider();
        
        if (this.options.autoplay) {
            this.startAutoplay();
        }
        
        // Handle responsive breakpoints
        this.handleResponsive();
        window.addEventListener('resize', this.debounce(() => this.handleResponsive(), 250));
    }
    
    createSliderStructure() {
        // Create slider wrapper
        this.sliderWrapper = document.createElement('div');
        this.sliderWrapper.className = 'slider-wrapper';
        this.sliderWrapper.style.cssText = `
            position: relative;
            overflow: hidden;
            width: 100%;
        `;
        
        // Create slider track
        this.sliderTrack = document.createElement('div');
        this.sliderTrack.className = 'slider-track';
        this.sliderTrack.style.cssText = `
            display: flex;
            transition: transform 0.5s ease;
            width: ${this.totalSlides * (100 / this.options.slidesToShow)}%;
        `;
        
        // Move slides to track
        this.slides.forEach(slide => {
            const slideWrapper = document.createElement('div');
            slideWrapper.className = 'slide-wrapper';
            slideWrapper.style.cssText = `
                flex: 0 0 ${100 / this.options.slidesToShow}%;
                padding: 0 10px;
                box-sizing: border-box;
            `;
            slideWrapper.appendChild(slide.cloneNode(true));
            this.sliderTrack.appendChild(slideWrapper);
        });
        
        // Create navigation arrows
        if (this.options.arrows) {
            this.createArrows();
        }
        
        // Create dots navigation
        if (this.options.dots) {
            this.createDots();
        }
        
        // Assemble slider
        this.sliderWrapper.appendChild(this.sliderTrack);
        this.container.innerHTML = '';
        this.container.appendChild(this.sliderWrapper);
    }
    
    createArrows() {
        // Previous arrow
        this.prevArrow = document.createElement('button');
        this.prevArrow.className = 'slider-arrow slider-prev';
        this.prevArrow.innerHTML = '&#10094;';
        this.prevArrow.style.cssText = `
            position: absolute;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(0,0,0,0.7);
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            z-index: 10;
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.3s;
        `;
        
        // Next arrow
        this.nextArrow = document.createElement('button');
        this.nextArrow.className = 'slider-arrow slider-next';
        this.nextArrow.innerHTML = '&#10095;';
        this.nextArrow.style.cssText = `
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(0,0,0,0.7);
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            z-index: 10;
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.3s;
        `;
        
        // Hover effects
        [this.prevArrow, this.nextArrow].forEach(arrow => {
            arrow.addEventListener('mouseenter', () => {
                arrow.style.background = 'rgba(0,0,0,0.9)';
            });
            arrow.addEventListener('mouseleave', () => {
                arrow.style.background = 'rgba(0,0,0,0.7)';
            });
        });
        
        this.sliderWrapper.appendChild(this.prevArrow);
        this.sliderWrapper.appendChild(this.nextArrow);
    }
    
    createDots() {
        this.dotsContainer = document.createElement('div');
        this.dotsContainer.className = 'slider-dots';
        this.dotsContainer.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 8px;
            margin-top: 20px;
        `;
        
        const totalDots = Math.ceil(this.totalSlides / this.options.slidesToScroll);
        
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('button');
            dot.className = 'slider-dot';
            dot.style.cssText = `
                width: 12px;
                height: 12px;
                border-radius: 50%;
                border: none;
                background: #ddd;
                cursor: pointer;
                transition: background 0.3s;
            `;
            
            dot.addEventListener('click', () => {
                this.goToSlide(i * this.options.slidesToScroll);
            });
            
            this.dotsContainer.appendChild(dot);
        }
        
        this.container.appendChild(this.dotsContainer);
    }
    
    setupEventListeners() {
        // Arrow navigation
        if (this.prevArrow) {
            this.prevArrow.addEventListener('click', () => {
                this.prevSlide();
            });
        }
        
        if (this.nextArrow) {
            this.nextArrow.addEventListener('click', () => {
                this.nextSlide();
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });
        
        // Touch/swipe support
        this.setupTouchEvents();
        
        // Pause autoplay on hover
        if (this.options.pauseOnHover) {
            this.sliderWrapper.addEventListener('mouseenter', () => {
                this.pauseAutoplay();
            });
            
            this.sliderWrapper.addEventListener('mouseleave', () => {
                this.resumeAutoplay();
            });
        }
    }
    
    setupTouchEvents() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        
        this.sliderWrapper.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        this.sliderWrapper.addEventListener('touchmove', (e) => {
            e.preventDefault();
        });
        
        this.sliderWrapper.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Check if it's a horizontal swipe
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        });
    }
    
    updateSlider() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        
        const translateX = -(this.currentSlide * (100 / this.options.slidesToShow));
        this.sliderTrack.style.transform = `translateX(${translateX}%)`;
        
        // Update dots
        if (this.dotsContainer) {
            const dots = this.dotsContainer.querySelectorAll('.slider-dot');
            dots.forEach((dot, index) => {
                if (index === Math.floor(this.currentSlide / this.options.slidesToScroll)) {
                    dot.style.background = '#667eea';
                } else {
                    dot.style.background = '#ddd';
                }
            });
        }
        
        // Update arrows state
        if (this.prevArrow) {
            this.prevArrow.style.opacity = this.currentSlide === 0 ? '0.5' : '1';
            this.prevArrow.style.pointerEvents = this.currentSlide === 0 ? 'none' : 'auto';
        }
        
        if (this.nextArrow) {
            const maxSlide = this.totalSlides - this.options.slidesToShow;
            this.nextArrow.style.opacity = this.currentSlide >= maxSlide ? '0.5' : '1';
            this.nextArrow.style.pointerEvents = this.currentSlide >= maxSlide ? 'none' : 'auto';
        }
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 500);
    }
    
    nextSlide() {
        if (this.currentSlide < this.totalSlides - this.options.slidesToShow) {
            this.currentSlide += this.options.slidesToScroll;
            this.updateSlider();
        }
    }
    
    prevSlide() {
        if (this.currentSlide > 0) {
            this.currentSlide -= this.options.slidesToScroll;
            this.updateSlider();
        }
    }
    
    goToSlide(slideIndex) {
        if (slideIndex >= 0 && slideIndex <= this.totalSlides - this.options.slidesToShow) {
            this.currentSlide = slideIndex;
            this.updateSlider();
        }
    }
    
    startAutoplay() {
        this.autoplayInterval = setInterval(() => {
            if (this.currentSlide >= this.totalSlides - this.options.slidesToShow) {
                this.currentSlide = 0;
            } else {
                this.currentSlide += this.options.slidesToScroll;
            }
            this.updateSlider();
        }, this.options.autoplaySpeed);
    }
    
    pauseAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
    
    resumeAutoplay() {
        if (this.options.autoplay && !this.autoplayInterval) {
            this.startAutoplay();
        }
    }
    
    handleResponsive() {
        const width = window.innerWidth;
        let newSlidesToShow = this.options.slidesToShow;
        
        // Check responsive breakpoints
        for (let breakpoint of this.options.responsive) {
            if (width <= breakpoint.breakpoint) {
                newSlidesToShow = breakpoint.settings.slidesToShow || 1;
                break;
            }
        }
        
        // Update if slides to show changed
        if (newSlidesToShow !== this.options.slidesToShow) {
            this.options.slidesToShow = newSlidesToShow;
            this.sliderTrack.style.width = `${this.totalSlides * (100 / this.options.slidesToShow)}%`;
            
            // Update slide wrapper widths
            const slideWrappers = this.sliderTrack.querySelectorAll('.slide-wrapper');
            slideWrappers.forEach(wrapper => {
                wrapper.style.flex = `0 0 ${100 / this.options.slidesToShow}%`;
            });
            
            // Reset to first slide if current slide is out of bounds
            const maxSlide = this.totalSlides - this.options.slidesToShow;
            if (this.currentSlide > maxSlide) {
                this.currentSlide = maxSlide;
            }
            
            this.updateSlider();
        }
    }
    
    destroy() {
        this.pauseAutoplay();
        
        if (this.sliderWrapper) {
            this.sliderWrapper.remove();
        }
        
        if (this.dotsContainer) {
            this.dotsContainer.remove();
        }
    }
    
    // Utility function for debouncing
    debounce(func, wait) {
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
}

// Initialize sliders when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize product slider
    const productSliderContainer = document.querySelector('.product_slider');
    if (productSliderContainer) {
        new ProductSlider(productSliderContainer, {
            slidesToShow: 4,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 4000,
            pauseOnHover: true,
            dots: true,
            arrows: true,
            responsive: [
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: 3
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 2
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1
                    }
                }
            ]
        });
    }
    
    // Initialize banner slider with different settings
    const bannerSliderContainer = document.querySelector('.banner_slider');
    if (bannerSliderContainer) {
        new ProductSlider(bannerSliderContainer, {
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 5000,
            pauseOnHover: true,
            dots: false,
            arrows: true
        });
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductSlider;
}
