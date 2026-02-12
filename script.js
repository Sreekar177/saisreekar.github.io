// ===== NAVIGATION =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
const navLinkItems = document.querySelectorAll('.nav-link');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    
    // Animate hamburger
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = navLinks.classList.contains('active') ? 'rotate(45deg) translate(5px, 5px)' : 'none';
    spans[1].style.opacity = navLinks.classList.contains('active') ? '0' : '1';
    spans[2].style.transform = navLinks.classList.contains('active') ? 'rotate(-45deg) translate(7px, -6px)' : 'none';
});

// Close mobile menu when clicking a link
navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Active nav link on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinkItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

// ===== PARTICLE BACKGROUND =====
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.2;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }
    
    draw() {
        ctx.fillStyle = `rgba(0, 240, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

const particles = [];
const particleCount = 100;

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        // Connect particles
        for (let j = i; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                ctx.strokeStyle = `rgba(0, 240, 255, ${0.2 - distance / 500})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
    
    requestAnimationFrame(animateParticles);
}

animateParticles();

// ===== STAT COUNTERS =====
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                stat.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                stat.textContent = target + '+';
            }
        };
        
        // Start animation when stats section is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(stat);
    });
}

animateStats();

// ===== SKILL BARS ANIMATION =====
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.width = entry.target.style.getPropertyValue('--progress');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => {
        bar.style.width = '0';
        observer.observe(bar);
    });
}

animateSkillBars();

// ===== SCROLL REVEAL ANIMATION =====
function revealOnScroll() {
    const reveals = document.querySelectorAll('.skill-category, .project-card, .timeline-item, .cert-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'all 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    reveals.forEach(element => {
        observer.observe(element);
    });
}

revealOnScroll();

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== CURSOR EFFECT (Optional - Desktop only) =====
if (window.innerWidth > 768) {
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);
    
    const cursorStyle = document.createElement('style');
    cursorStyle.innerHTML = `
        .custom-cursor {
            width: 20px;
            height: 20px;
            border: 2px solid var(--primary);
            border-radius: 50%;
            position: fixed;
            pointer-events: none;
            z-index: 9999;
            transition: all 0.1s ease;
            transform: translate(-50%, -50%);
            mix-blend-mode: difference;
        }
        
        .custom-cursor.click {
            transform: translate(-50%, -50%) scale(0.8);
            background: var(--primary);
        }
    `;
    document.head.appendChild(cursorStyle);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    document.addEventListener('mousedown', () => {
        cursor.classList.add('click');
    });
    
    document.addEventListener('mouseup', () => {
        cursor.classList.remove('click');
    });
}

// ===== TYPING EFFECT =====
const typingText = document.querySelector('.typing-text');
if (typingText) {
    const text = 'SOC Analyst';
    let index = 0;
    
    function type() {
        if (index < text.length) {
            typingText.textContent = text.substring(0, index + 1);
            index++;
            setTimeout(type, 150);
        }
    }
    
    // Start typing after a delay
    setTimeout(type, 1000);
}

// ===== PARALLAX EFFECT =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.gradient-orb');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ===== CONSOLE EASTER EGG =====
console.log('%c🔐 Welcome to the Matrix...', 'color: #00f0ff; font-size: 20px; font-weight: bold;');
console.log('%cLooking for something? 👀', 'color: #ff00ff; font-size: 16px;');
console.log('%cIf you\'re interested in cybersecurity or just want to connect, reach out!', 'color: #00ff88; font-size: 14px;');
console.log('%c📧 sreekarreddy369@gmail.com', 'color: #00f0ff; font-size: 14px;');

// ===== PREVENT RIGHT CLICK (Optional - can be removed if you don't want this) =====
// Uncomment if you want to prevent right-click
/*
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    console.log('Nice try! 😉');
});
*/

// ===== LOADING ANIMATION =====
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ===== PROJECT CARD TILT EFFECT =====
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ===== DYNAMIC YEAR IN FOOTER =====
const currentYear = new Date().getFullYear();
const footerText = document.querySelector('.footer-left p');
if (footerText) {
    footerText.textContent = `© ${currentYear} Sai Sreekar Reddy Boyapally. All rights reserved.`;
}

// ===== THEME TOGGLE (Future enhancement - currently commented out) =====
/*
const themeToggle = document.createElement('button');
themeToggle.innerHTML = '🌙';
themeToggle.classList.add('theme-toggle');
document.body.appendChild(themeToggle);

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    themeToggle.innerHTML = document.body.classList.contains('light-theme') ? '☀️' : '🌙';
});
*/

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            fadeInObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Apply to sections
document.querySelectorAll('section').forEach(section => {
    fadeInObserver.observe(section);
});

// ===== CONTACT FORM VALIDATION (For future form implementation) =====
// This is a placeholder for when you add a contact form
/*
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Add form validation and submission logic here
        console.log('Form submitted!');
    });
}
*/

// ===== PERFORMANCE OPTIMIZATION =====
// Debounce scroll events
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
// Skip to main content
const skipLink = document.createElement('a');
skipLink.href = '#home';
skipLink.textContent = 'Skip to main content';
skipLink.className = 'skip-link';
document.body.insertBefore(skipLink, document.body.firstChild);

const skipLinkStyle = document.createElement('style');
skipLinkStyle.innerHTML = `
    .skip-link {
        position: absolute;
        top: -40px;
        left: 0;
        background: var(--primary);
        color: var(--dark-bg);
        padding: 8px;
        text-decoration: none;
        z-index: 10000;
    }
    
    .skip-link:focus {
        top: 0;
    }
`;
document.head.appendChild(skipLinkStyle);

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
    // Press 'h' to go to home
    if (e.key === 'h' && !e.ctrlKey && !e.metaKey) {
        const target = document.querySelector('#home');
        if (target && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
});

// ===== CONSOLE SIGNATURE =====
const signature = `
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   ███████╗ █████╗ ██╗    ███████╗██████╗ ███████╗███████╗  ║
║   ██╔════╝██╔══██╗██║    ██╔════╝██╔══██╗██╔════╝██╔════╝  ║
║   ███████╗███████║██║    ███████╗██████╔╝█████╗  █████╗    ║
║   ╚════██║██╔══██║██║    ╚════██║██╔══██╗██╔══╝  ██╔══╝    ║
║   ███████║██║  ██║██║    ███████║██║  ██║███████╗███████╗  ║
║   ╚══════╝╚═╝  ╚═╝╚═╝    ╚══════╝╚═╝  ╚═╝╚══════╝╚══════╝  ║
║                                                              ║
║              SOC Analyst | Cybersecurity Professional       ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`;

console.log(`%c${signature}`, 'color: #00f0ff; font-family: monospace;');
console.log('%c🛡️ Defending systems, one threat at a time.', 'color: #00ff88; font-size: 14px; font-weight: bold;');

// ===== INITIALIZE ALL ANIMATIONS =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Website fully loaded and initialized!');
    console.log('💡 Tip: Press "h" to quickly scroll to the top!');
});
