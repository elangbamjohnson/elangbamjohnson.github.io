document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Scroll Reveal Animation
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };
        
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.reveal').forEach(element => {
            observer.observe(element);
        });
    } else {
        // Fallback for older browsers
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
    }

    // 3. FAQ Accordion (One at a time)
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if (e.target.tagName === 'SUMMARY') {
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.hasAttribute('open')) {
                        otherItem.removeAttribute('open');
                    }
                });
            }
        });
    });
    // 4. Matrix Theme Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    // Sync class from html to body if set in head
    if (document.documentElement.classList.contains('theme-matrix')) {
        document.body.classList.add('theme-matrix');
    }
    
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isMatrix = document.body.classList.contains('theme-matrix');
            if (isMatrix) {
                document.body.classList.remove('theme-matrix');
                document.documentElement.classList.remove('theme-matrix');
                localStorage.setItem('site-theme', 'light');
                themeToggleBtn.setAttribute('aria-pressed', 'false');
            } else {
                document.body.classList.add('theme-matrix');
                document.documentElement.classList.add('theme-matrix');
                localStorage.setItem('site-theme', 'matrix');
                themeToggleBtn.setAttribute('aria-pressed', 'true');
            }
        });
        // Set initial aria-pressed state
        const isMatrixOnLoad = document.body.classList.contains('theme-matrix');
        themeToggleBtn.setAttribute('aria-pressed', isMatrixOnLoad ? 'true' : 'false');
    }
});

// Global functions for inline handlers
function copyEmail(event) {
    event.preventDefault();
    const email = 'elangbamjohnson@gmail.com';
    const btn = event.currentTarget;
    const originalText = btn.innerHTML;
    
    navigator.clipboard.writeText(email).then(() => {
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9 21.035l-9-8.638 2.791-2.87 6.156 5.874 12.21-12.436 2.843 2.817z"/></svg> Copied!`;
        btn.style.backgroundColor = '#34C759';
        btn.style.color = '#fff';
        btn.style.borderColor = '#34C759';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

function openVideoModal() {
    const modal = document.getElementById('videoModal');
    const video = document.getElementById('demoVideo');
    if (modal && video) {
        modal.classList.add('active');
        // Ensure source is loaded only when modal opens
        const source = video.querySelector('source');
        if (source && !source.getAttribute('src')) {
            source.setAttribute('src', 'assets/videos/AIAnalyzer.mp4');
            video.load();
        }
        video.play().catch(e => console.log("Auto-play prevented", e));
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const video = document.getElementById('demoVideo');
    if (modal && video) {
        modal.classList.remove('active');
        video.pause();
        video.currentTime = 0;
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
}

function openCaseStudy() {
    const modal = document.getElementById('caseStudyModal');
    if (modal) {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
}

function closeCaseStudy() {
    const modal = document.getElementById('caseStudyModal');
    if (modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
}

// Global modal close handlers
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeVideoModal();
        closeCaseStudy();
    }
});

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
        closeVideoModal();
        closeCaseStudy();
    }
});
