// AImlyfy Business Model Presentation JavaScript

class PresentationManager {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 8;
        this.slides = document.querySelectorAll('.slide');
        this.navButtons = document.querySelectorAll('.nav-btn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.currentSlideSpan = document.getElementById('currentSlide');
        this.totalSlidesSpan = document.getElementById('totalSlides');
        
        // Revenue data for chart
        this.revenueData = [
            { month: 1, revenue: 139.94 },
            { month: 3, revenue: 1019.57 },
            { month: 6, revenue: 4997.95 },
            { month: 9, revenue: 13794.45 },
            { month: 12, revenue: 30987.50 }
        ];

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateSlideIndicator();
        this.updateNavigationButtons();
        this.initializeCharts();
    }

    setupEventListeners() {
        // Navigation buttons
        this.navButtons.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                this.goToSlide(index);
            });
        });

        // Previous/Next buttons
        this.prevBtn.addEventListener('click', () => {
            this.previousSlide();
        });

        this.nextBtn.addEventListener('click', () => {
            this.nextSlide();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.previousSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });

        // Touch/swipe navigation for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });

        const handleSwipe = () => {
            if (touchEndX < touchStartX - 50) {
                this.nextSlide();
            }
            if (touchEndX > touchStartX + 50) {
                this.previousSlide();
            }
        };

        this.handleSwipe = handleSwipe;
    }

    goToSlide(slideIndex) {
        if (slideIndex < 0 || slideIndex >= this.totalSlides) return;

        // Hide current slide
        this.slides[this.currentSlide].classList.remove('active');
        this.navButtons[this.currentSlide].classList.remove('active');

        // Show new slide
        this.currentSlide = slideIndex;
        this.slides[this.currentSlide].classList.add('active');
        this.navButtons[this.currentSlide].classList.add('active');

        this.updateSlideIndicator();
        this.updateNavigationButtons();

        // Initialize chart if we're on the financial slide
        if (this.currentSlide === 5) {
            setTimeout(() => this.initializeCharts(), 100);
        }
    }

    nextSlide() {
        if (this.currentSlide < this.totalSlides - 1) {
            this.goToSlide(this.currentSlide + 1);
        }
    }

    previousSlide() {
        if (this.currentSlide > 0) {
            this.goToSlide(this.currentSlide - 1);
        }
    }

    updateSlideIndicator() {
        this.currentSlideSpan.textContent = this.currentSlide + 1;
        this.totalSlidesSpan.textContent = this.totalSlides;
    }

    updateNavigationButtons() {
        // Update prev/next button states
        this.prevBtn.disabled = this.currentSlide === 0;
        this.nextBtn.disabled = this.currentSlide === this.totalSlides - 1;

        // Update nav button active states
        this.navButtons.forEach((btn, index) => {
            btn.classList.toggle('active', index === this.currentSlide);
        });
    }

    initializeCharts() {
        const canvas = document.getElementById('revenueChart');
        if (!canvas) return;

        // Destroy existing chart if it exists
        if (this.revenueChart) {
            this.revenueChart.destroy();
        }

        const ctx = canvas.getContext('2d');
        
        // Chart colors matching design system
        const chartColors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F'];
        
        this.revenueChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.revenueData.map(d => `Month ${d.month}`),
                datasets: [{
                    label: 'Monthly Revenue ($)',
                    data: this.revenueData.map(d => d.revenue),
                    borderColor: chartColors[0],
                    backgroundColor: chartColors[0] + '20',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: chartColors[0],
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: getComputedStyle(document.documentElement)
                                .getPropertyValue('--color-text').trim(),
                            font: {
                                family: 'FKGroteskNeue, Inter, sans-serif',
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: getComputedStyle(document.documentElement)
                            .getPropertyValue('--color-surface').trim(),
                        titleColor: getComputedStyle(document.documentElement)
                            .getPropertyValue('--color-text').trim(),
                        bodyColor: getComputedStyle(document.documentElement)
                            .getPropertyValue('--color-text-secondary').trim(),
                        borderColor: getComputedStyle(document.documentElement)
                            .getPropertyValue('--color-border').trim(),
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            title: function(context) {
                                return context[0].label;
                            },
                            label: function(context) {
                                return `Revenue: $${context.parsed.y.toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: getComputedStyle(document.documentElement)
                                .getPropertyValue('--color-border').trim() + '40',
                            borderColor: getComputedStyle(document.documentElement)
                                .getPropertyValue('--color-border').trim()
                        },
                        ticks: {
                            color: getComputedStyle(document.documentElement)
                                .getPropertyValue('--color-text-secondary').trim(),
                            font: {
                                family: 'FKGroteskNeue, Inter, sans-serif',
                                size: 11
                            }
                        }
                    },
                    y: {
                        grid: {
                            color: getComputedStyle(document.documentElement)
                                .getPropertyValue('--color-border').trim() + '40',
                            borderColor: getComputedStyle(document.documentElement)
                                .getPropertyValue('--color-border').trim()
                        },
                        ticks: {
                            color: getComputedStyle(document.documentElement)
                                .getPropertyValue('--color-text-secondary').trim(),
                            font: {
                                family: 'FKGroteskNeue, Inter, sans-serif',
                                size: 11
                            },
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        },
                        beginAtZero: true
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    // Method to handle theme changes and update chart colors
    updateChartColors() {
        if (this.revenueChart) {
            const textColor = getComputedStyle(document.documentElement)
                .getPropertyValue('--color-text').trim();
            const textSecondaryColor = getComputedStyle(document.documentElement)
                .getPropertyValue('--color-text-secondary').trim();
            const borderColor = getComputedStyle(document.documentElement)
                .getPropertyValue('--color-border').trim();
            const surfaceColor = getComputedStyle(document.documentElement)
                .getPropertyValue('--color-surface').trim();

            // Update chart options
            this.revenueChart.options.plugins.legend.labels.color = textColor;
            this.revenueChart.options.plugins.tooltip.backgroundColor = surfaceColor;
            this.revenueChart.options.plugins.tooltip.titleColor = textColor;
            this.revenueChart.options.plugins.tooltip.bodyColor = textSecondaryColor;
            this.revenueChart.options.plugins.tooltip.borderColor = borderColor;
            
            this.revenueChart.options.scales.x.grid.color = borderColor + '40';
            this.revenueChart.options.scales.x.grid.borderColor = borderColor;
            this.revenueChart.options.scales.x.ticks.color = textSecondaryColor;
            
            this.revenueChart.options.scales.y.grid.color = borderColor + '40';
            this.revenueChart.options.scales.y.grid.borderColor = borderColor;
            this.revenueChart.options.scales.y.ticks.color = textSecondaryColor;

            this.revenueChart.update();
        }
    }

    // Add animation effects for slide transitions
    animateSlideTransition() {
        const currentSlideEl = this.slides[this.currentSlide];
        currentSlideEl.style.opacity = '0';
        currentSlideEl.style.transform = 'translateX(20px)';
        
        setTimeout(() => {
            currentSlideEl.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            currentSlideEl.style.opacity = '1';
            currentSlideEl.style.transform = 'translateX(0)';
        }, 50);
    }

    // Add method to export presentation data (could be used for analytics)
    getAnalytics() {
        return {
            currentSlide: this.currentSlide,
            totalSlides: this.totalSlides,
            slideViews: this.slideViews || {},
            timeSpent: Date.now() - (this.startTime || Date.now())
        };
    }
}

// Additional utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(amount);
}

function formatPercentage(value) {
    return (value * 100).toFixed(1) + '%';
}

// Initialize presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the presentation manager
    window.presentationManager = new PresentationManager();
    
    // Add some interactive enhancements
    addInteractiveEnhancements();
    
    // Track presentation start time for analytics
    window.presentationManager.startTime = Date.now();
    window.presentationManager.slideViews = {};
});

// Add interactive enhancements
function addInteractiveEnhancements() {
    // Add hover effects to cards and interactive elements
    const interactiveElements = document.querySelectorAll('.card, .pricing-tier, .mentor-tier, .flow-item, .revenue-item');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
            element.style.transform = 'translateY(-2px)';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translateY(0)';
        });
    });

    // Add click feedback to buttons
    const buttons = document.querySelectorAll('.btn, .control-btn, .nav-btn');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = (e.clientX - button.offsetLeft) + 'px';
            ripple.style.top = (e.clientY - button.offsetTop) + 'px';
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 300);
        });
    });

    // Add progress bar for presentation
    createProgressBar();
}

// Create a progress bar showing presentation progress
function createProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.innerHTML = '<div class="progress-fill"></div>';
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .progress-bar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: var(--color-secondary);
            z-index: 1000;
        }
        .progress-fill {
            height: 100%;
            background: var(--color-primary);
            width: 12.5%;
            transition: width 0.3s ease;
        }
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.3s linear;
            pointer-events: none;
        }
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(progressBar);
    
    // Update progress when slide changes
    const originalGoToSlide = window.presentationManager.goToSlide;
    window.presentationManager.goToSlide = function(slideIndex) {
        originalGoToSlide.call(this, slideIndex);
        const progress = ((slideIndex + 1) / this.totalSlides) * 100;
        document.querySelector('.progress-fill').style.width = progress + '%';
    };
}

// Handle window resize for chart responsiveness
window.addEventListener('resize', () => {
    if (window.presentationManager && window.presentationManager.revenueChart) {
        window.presentationManager.revenueChart.resize();
    }
});

// Handle theme changes (if implementing theme switching)
window.addEventListener('storage', (e) => {
    if (e.key === 'theme' && window.presentationManager) {
        window.presentationManager.updateChartColors();
    }
});

// Export for potential external use
window.PresentationUtils = {
    formatCurrency,
    formatPercentage,
    goToSlide: (index) => window.presentationManager?.goToSlide(index),
    getAnalytics: () => window.presentationManager?.getAnalytics()
};