// ================================
// DOM ELEMENTS
// ================================

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const themeToggle = document.getElementById('themeToggle');
const backToTop = document.getElementById('backToTop');
const body = document.body;
const contactForm = document.getElementById('contactForm');

// ================================
// INITIALIZATION
// ================================

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavigation();
    initScrollEvents();
    initScrollReveal();
    initBackToTop();
    initContactForm();
});

// ================================
// THEME TOGGLE (DARK/LIGHT MODE)
// ================================

function initTheme() {
    // Check for saved theme preference or default to dark mode
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
}

function setTheme(theme) {
    if (theme === 'light') {
        body.classList.add('light-mode');
        themeToggle.textContent = '☀️';
    } else {
        body.classList.remove('light-mode');
        themeToggle.textContent = '🌙';
    }
    localStorage.setItem('theme', theme);
}

themeToggle.addEventListener('click', () => {
    const currentTheme = localStorage.getItem('theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
});

// ================================
// MOBILE NAVIGATION
// ================================

function initNavigation() {
    // Hamburger menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-wrapper')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// ================================
// SCROLL EVENTS & ACTIVE NAV
// ================================

function initScrollEvents() {
    window.addEventListener('scroll', () => {
        updateActiveNavLink();
        handleBackToTopButton();
    });
}

function updateActiveNavLink() {
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ================================
// BACK TO TOP BUTTON
// ================================

function initBackToTop() {
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function handleBackToTopButton() {
    if (window.pageYOffset > 300) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
}

// ================================
// SCROLL REVEAL ANIMATIONS
// ================================

function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        '.hero-text, .hero-image, .about-image, .about-text, ' +
        '.skill-category, .project-card, .timeline-item, ' +
        '.service-card, .career-content'
    );

    const revealOnScroll = () => {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;

            if (elementTop < window.innerHeight - 100 && elementBottom > 0) {
                element.classList.add('visible');
            }
        });
    };

    // Add initial class for scroll reveal
    revealElements.forEach(element => {
        element.classList.add('scroll-reveal');
    });

    // Reveal elements on load
    revealOnScroll();

    // Listen for scroll
    window.addEventListener('scroll', revealOnScroll);
}

// ================================
// CONTACT FORM HANDLING
// ================================

function initContactForm() {
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        // Simple validation
        if (!name || !email || !message) {
            showFormNotification('Please fill in all fields', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showFormNotification('Please enter a valid email address', 'error');
            return;
        }

        // Show success message
        showFormNotification('Message sent successfully! I will get back to you soon.', 'success');

        // Reset form
        contactForm.reset();

        // Clear notification after 5 seconds
        setTimeout(() => {
            clearFormNotification();
        }, 5000);
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFormNotification(message, type) {
    // Remove existing notification
    clearFormNotification();

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `form-notification form-notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        padding: 15px 20px;
        margin-bottom: 20px;
        border-radius: 8px;
        font-size: 0.95rem;
        animation: slideInUp 0.3s ease;
    `;

    if (type === 'success') {
        notification.style.background = 'rgba(0, 255, 136, 0.2)';
        notification.style.color = '#00ff88';
        notification.style.border = '1px solid #00ff88';
    } else {
        notification.style.background = 'rgba(255, 100, 100, 0.2)';
        notification.style.color = '#ff6464';
        notification.style.border = '1px solid #ff6464';
    }

    // Insert before the form
    contactForm.parentElement.insertBefore(notification, contactForm);
}

function clearFormNotification() {
    const existingNotification = document.querySelector('.form-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
}

// ================================
// SMOOTH SCROLL FALLBACK
// ================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ================================
// PERFORMANCE: LAZY LOAD IMAGES
// ================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ================================
// KEYBOARD NAVIGATION
// ================================

document.addEventListener('keydown', (e) => {
    // ESC to close mobile menu
    if (e.key === 'Escape') {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }

    // Tab navigation
    if (e.key === 'Tab') {
        document.body.classList.add('tab-focused');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('tab-focused');
});

// ================================
// UTILITY FUNCTIONS
// ================================

// Debounce function for scroll events
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

// ================================
// CONSOLE GREETING
// ================================

console.log('%c🚀 Welcome to Sondos Mohamed Portfolio', 
    'color: #00d4ff; font-size: 20px; font-weight: bold;');
console.log('%cFront-End Developer | Web Development Enthusiast', 
    'color: #00ff88; font-size: 14px;');
console.log('%cMade with ❤️ using HTML5, CSS3, and Vanilla JavaScript', 
    'color: #b8b8c8; font-size: 12px;');
