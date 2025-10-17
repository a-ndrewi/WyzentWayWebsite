// Navigation & Menu
const burgerMenu = document.getElementById('burgerMenu');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const closeBtn = document.getElementById('closeBtn');
const menuLinks = document.querySelectorAll('.menu-link');

// Toggle sidebar
function toggleSidebar() {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

burgerMenu.addEventListener('click', toggleSidebar);
closeBtn.addEventListener('click', toggleSidebar);
overlay.addEventListener('click', toggleSidebar);

// Close sidebar when clicking menu links
menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });
});

// Animated Counter for Statistics
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = formatNumber(target);
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(Math.floor(current));
        }
    }, 16);
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M+';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(0) + 'K+';
    }
    return num.toString();
}

// Intersection Observer for Stats Animation
const statNumbers = document.querySelectorAll('.stat-number');
const statsSection = document.querySelector('.stats-section');

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                if (target) {
                    animateCounter(stat, target);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

if (statsSection) {
    statsObserver.observe(statsSection);
}

// Carousel Functionality with Touch Swipe
const carouselTrack = document.getElementById('carouselTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const reelCards = document.querySelectorAll('.reel-card');

let currentIndex = 0;
const totalCards = reelCards.length;

// Touch swipe variables
let touchStartX = 0;
let touchEndX = 0;
let isDragging = false;
let startTransform = 0;

function updateCarousel(smooth = true) {
    if (!carouselTrack || totalCards === 0) return;
    
    const cardWidth = 320;
    const gap = 30;
    const offset = currentIndex * (cardWidth + gap);
    
    if (smooth) {
        carouselTrack.style.transition = 'transform 0.5s ease';
    } else {
        carouselTrack.style.transition = 'none';
    }
    
    carouselTrack.style.transform = `translateX(-${offset}px)`;
    
    // Calculate max index
    const maxIndex = Math.max(0, totalCards - 1);
    
    // Update button states
    if (prevBtn) {
        prevBtn.disabled = currentIndex === 0;
        prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
    }
    if (nextBtn) {
        nextBtn.disabled = currentIndex >= maxIndex;
        nextBtn.style.opacity = currentIndex >= maxIndex ? '0.3' : '1';
    }
}

// Button navigation - move one card at a time
if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });
}

if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const maxIndex = Math.max(0, totalCards - 1);
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
        }
    });
}

// Touch swipe functionality
if (carouselTrack) {
    // Touch events
    carouselTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        isDragging = true;
        const transform = carouselTrack.style.transform;
        const match = transform.match(/translateX\((-?\d+)px\)/);
        startTransform = match ? parseInt(match[1]) : 0;
    });

    carouselTrack.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        touchEndX = e.touches[0].clientX;
        const diff = touchEndX - touchStartX;
        const newTransform = startTransform + diff;
        
        // Apply drag with resistance at boundaries
        const maxTransform = 0;
        const minTransform = -(totalCards - 1) * 350;
        
        let finalTransform = newTransform;
        if (newTransform > maxTransform) {
            finalTransform = maxTransform + (newTransform - maxTransform) * 0.3;
        } else if (newTransform < minTransform) {
            finalTransform = minTransform + (newTransform - minTransform) * 0.3;
        }
        
        carouselTrack.style.transition = 'none';
        carouselTrack.style.transform = `translateX(${finalTransform}px)`;
    });

    carouselTrack.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        
        const diff = touchEndX - touchStartX;
        const threshold = 50; // Minimum swipe distance
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0 && currentIndex > 0) {
                // Swiped right - go to previous
                currentIndex--;
            } else if (diff < 0 && currentIndex < totalCards - 1) {
                // Swiped left - go to next
                currentIndex++;
            }
        }
        
        updateCarousel();
        touchStartX = 0;
        touchEndX = 0;
    });

    // Mouse events for desktop drag
    carouselTrack.addEventListener('mousedown', (e) => {
        touchStartX = e.clientX;
        isDragging = true;
        const transform = carouselTrack.style.transform;
        const match = transform.match(/translateX\((-?\d+)px\)/);
        startTransform = match ? parseInt(match[1]) : 0;
        carouselTrack.style.cursor = 'grabbing';
        e.preventDefault();
    });

    carouselTrack.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        touchEndX = e.clientX;
        const diff = touchEndX - touchStartX;
        const newTransform = startTransform + diff;
        
        // Apply drag with resistance at boundaries
        const maxTransform = 0;
        const minTransform = -(totalCards - 1) * 350;
        
        let finalTransform = newTransform;
        if (newTransform > maxTransform) {
            finalTransform = maxTransform + (newTransform - maxTransform) * 0.3;
        } else if (newTransform < minTransform) {
            finalTransform = minTransform + (newTransform - minTransform) * 0.3;
        }
        
        carouselTrack.style.transition = 'none';
        carouselTrack.style.transform = `translateX(${finalTransform}px)`;
    });

    carouselTrack.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        
        const diff = touchEndX - touchStartX;
        const threshold = 50;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0 && currentIndex > 0) {
                currentIndex--;
            } else if (diff < 0 && currentIndex < totalCards - 1) {
                currentIndex++;
            }
        }
        
        updateCarousel();
        carouselTrack.style.cursor = 'grab';
        touchStartX = 0;
        touchEndX = 0;
    });

    carouselTrack.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            updateCarousel();
            carouselTrack.style.cursor = 'grab';
        }
    });

    // Set initial cursor
    carouselTrack.style.cursor = 'grab';
}

// Initialize carousel
if (carouselTrack && totalCards > 0) {
    setTimeout(() => {
        updateCarousel();
    }, 100);
}

// Particle Animation in Hero Section
const particlesContainer = document.getElementById('particles');

function createParticle() {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = Math.random() * 3 + 1 + 'px';
    particle.style.height = particle.style.width;
    particle.style.background = Math.random() > 0.5 ? '#00f0ff' : '#7000ff';
    particle.style.borderRadius = '50%';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.opacity = Math.random() * 0.5 + 0.3;
    particle.style.animation = `float ${Math.random() * 10 + 5}s linear infinite`;
    
    particlesContainer.appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, 15000);
}

// Create particles periodically
setInterval(createParticle, 300);

// Initialize some particles on load
for (let i = 0; i < 30; i++) {
    createParticle();
}

// Smooth scroll behavior for navigation links
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

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');
const scrollTopBtn = document.getElementById('scrollTopBtn');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(10, 10, 15, 0.98)';
        navbar.style.boxShadow = '0 5px 20px rgba(0, 240, 255, 0.1)';
    } else {
        navbar.style.background = 'rgba(10, 10, 15, 0.95)';
        navbar.style.boxShadow = 'none';
    }
    
    // Show/hide scroll to top button
    if (currentScroll > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
    
    lastScroll = currentScroll;
});

// Scroll to top functionality
scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Card hover effects with tilt
const cards = document.querySelectorAll('.stat-card, .reel-card, .cta-box, .starter-cover, .ebook-cover');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
});

// Lazy loading for carousel items
const lazyLoadObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const iframe = entry.target.querySelector('iframe');
            if (iframe) {
                iframe.style.opacity = '1';
            }
            lazyLoadObserver.unobserve(entry.target);
        }
    });
}, { rootMargin: '50px' });

document.querySelectorAll('.reel-card').forEach(card => {
    lazyLoadObserver.observe(card);
});

// Add entrance animations on scroll
const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.stat-card, .reel-card, .growth-text, .cta-box, .ebook-preview, .ebook-details, .starter-preview, .starter-details, .testimonial-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    animateOnScroll.observe(el);
});

// Handle window resize for carousel
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        currentIndex = 0;
        updateCarousel();
    }, 250);
});

// Console message for developers
console.log('%c🚀 Wyzent™ - Transform Your Mindset', 'font-size: 20px; font-weight: bold; color: #00f0ff;');
console.log('%cDeveloped with passion for personal growth', 'font-size: 12px; color: #7000ff;');