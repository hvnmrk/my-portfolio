document.addEventListener('DOMContentLoaded', () => {

    // --- 1. LTO-Style Interactive Business Card / Digital ID Flip ---
    const interactiveCard = document.getElementById('interactiveCard');
    if (interactiveCard) {
        interactiveCard.addEventListener('click', () => {
            interactiveCard.classList.toggle('is-flipped');
        });

        interactiveCard.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                interactiveCard.classList.toggle('is-flipped');
            }
        });

        if (window.matchMedia("(pointer: fine)").matches) {
            interactiveCard.addEventListener('mousemove', (e) => {
                if (!interactiveCard.classList.contains('is-flipped')) {
                    const rect = interactiveCard.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;

                    const rotateX = -(y / (rect.height / 2)) * 8;
                    const rotateY = (x / (rect.width / 2)) * 8;

                    interactiveCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                }
            });

            interactiveCard.addEventListener('mouseleave', () => {
                if (!interactiveCard.classList.contains('is-flipped')) {
                    interactiveCard.style.transform = `rotateX(0deg) rotateY(0deg)`;
                } else {
                    interactiveCard.style.transform = `rotateY(180deg)`;
                }
            });
        }
    }

    // --- 2. Sliding Carousel Engine with Mobile Touch-Swipe Detection ---
    const carousels = document.querySelectorAll('.adaptive-carousel');

    carousels.forEach(track => {
        const cards = Array.from(track.children);
        const totalCards = cards.length;
        const container = track.closest('.carousel-container');
        if (!container) return;

        const header = container.previousElementSibling;
        if (!header) return;

        const prevBtn = header.querySelector('.prev-arrow');
        const nextBtn = header.querySelector('.next-arrow');
        if (!prevBtn || !nextBtn) return;

        let currentIndex = 0;

        function getVisibleMetrics() {
            const firstCard = cards[0];
            const cardWidth = firstCard.getBoundingClientRect().width;
            const style = window.getComputedStyle(track);
            const gap = parseFloat(style.gap) || 24;
            const containerWidth = container.getBoundingClientRect().width;

            // On mobile (cardWidth >= containerWidth), 1 card is visible per slide
            const visible = Math.max(1, Math.round(containerWidth / (cardWidth + (containerWidth > cardWidth ? gap : 0))));
            const maxIdx = Math.max(0, totalCards - visible);
            return { cardWidth, gap, maxIdx };
        }

        function updateSlider() {
            const { cardWidth, gap, maxIdx } = getVisibleMetrics();
            if (currentIndex < 0) currentIndex = 0;
            if (currentIndex > maxIdx) currentIndex = maxIdx;

            const translateX = currentIndex * (cardWidth + gap);
            track.style.transform = `translateX(-${translateX}px)`;

            prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
            prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';

            nextBtn.style.opacity = currentIndex >= maxIdx ? '0.3' : '1';
            nextBtn.style.pointerEvents = currentIndex >= maxIdx ? 'none' : 'auto';
        }

        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const { maxIdx } = getVisibleMetrics();
            if (currentIndex < maxIdx) {
                currentIndex++;
                updateSlider();
            }
        });

        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentIndex > 0) {
                currentIndex--;
                updateSlider();
            }
        });

        // Mobile Touch Swiping Listeners
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const swipeDistance = touchStartX - touchEndX;
            const { maxIdx } = getVisibleMetrics();

            // Swipe Left -> Next Slide
            if (swipeDistance > 45 && currentIndex < maxIdx) {
                currentIndex++;
                updateSlider();
            }
            // Swipe Right -> Previous Slide
            else if (swipeDistance < -45 && currentIndex > 0) {
                currentIndex--;
                updateSlider();
            }
        }, { passive: true });

        window.addEventListener('resize', updateSlider);
        setTimeout(updateSlider, 200);
    });

    // --- 3. Custom Trailing Cursor Engine ---
    if (window.matchMedia("(pointer: fine)").matches) {
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorOutline = document.querySelector('.cursor-outline');
        let mouseX = 0, mouseY = 0, outlineX = 0, outlineY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (cursorDot) {
                cursorDot.style.left = `${mouseX}px`;
                cursorDot.style.top = `${mouseY}px`;
            }
        });

        function animateCursor() {
            outlineX += (mouseX - outlineX) * 0.15;
            outlineY += (mouseY - outlineY) * 0.15;
            if (cursorOutline) {
                cursorOutline.style.left = `${outlineX}px`;
                cursorOutline.style.top = `${outlineY}px`;
            }
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        document.body.addEventListener('mouseenter', (e) => {
            if (e.target.classList && e.target.classList.contains('hover-target')) {
                cursorOutline?.classList.add('expand');
            }
        }, true);

        document.body.addEventListener('mouseleave', (e) => {
            if (e.target.classList && e.target.classList.contains('hover-target')) {
                cursorOutline?.classList.remove('expand');
            }
        }, true);
    }

    // --- 4. Scroll Progress Bar ---
    const progressBar = document.querySelector('.scroll-progress');
    window.addEventListener('scroll', () => {
        if (progressBar) {
            const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            progressBar.style.width = scrollPercent + '%';
        }
    });

    // --- 5. Magnetic Component Interactions ---
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            btn.style.transform = `translate(${(e.clientX - (rect.left + rect.width / 2)) * 0.2}px, ${(e.clientY - (rect.top + rect.height / 2)) * 0.2}px)`;
        });
        btn.addEventListener('mouseleave', () => btn.style.transform = `translate(0px, 0px)`);
    });

    // --- 6. Scroll Intersection Reveal ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // --- 7. Embedded Video Controllers ---
    document.querySelectorAll('.hover-video-card').forEach(card => {
        const iframe = document.getElementById(card.getAttribute('data-video-id'));
        const sendCmd = (cmd) => iframe?.contentWindow.postMessage(JSON.stringify({ event: 'command', func: cmd, args: [] }), '*');
        card.addEventListener('mouseenter', () => sendCmd('playVideo'));
        card.addEventListener('mouseleave', () => sendCmd('pauseVideo'));
    });

    // --- 8. Theme Switcher ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        const themeIcon = themeToggleBtn.querySelector('.theme-icon');
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme) {
            document.documentElement.setAttribute('data-theme', currentTheme);
            themeIcon.textContent = currentTheme === 'light' ? '☾' : '☼';
        }

        themeToggleBtn.addEventListener('click', () => {
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            const nextTheme = isLight ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', nextTheme);
            localStorage.setItem('theme', nextTheme);
            themeIcon.textContent = isLight ? '☼' : '☾';
        });
    }

    // --- 9. Responsive Mobile Navigation Drawer ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('nav-active');
            const menuIcon = menuToggle.querySelector('.menu-icon');
            if (menuIcon) {
                menuIcon.textContent = navLinks.classList.contains('nav-active') ? '✕' : '☰';
            }
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('nav-active');
                const menuIcon = menuToggle.querySelector('.menu-icon');
                if (menuIcon) menuIcon.textContent = '☰';
            });
        });

        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                if (navLinks.classList.contains('nav-active')) {
                    navLinks.classList.remove('nav-active');
                    const menuIcon = menuToggle.querySelector('.menu-icon');
                    if (menuIcon) menuIcon.textContent = '☰';
                }
            }
        });
    }

    // --- 10. Contact Form Transmission & Modal ---
    const contactForm = document.getElementById('contact-form');
    const modal = document.getElementById('email-modal');
    const closeBtn = document.getElementById('close-modal');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            try {
                const response = await fetch("https://formspree.io/f/xlgvzele", {
                    method: "POST",
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    if (modal) modal.style.display = 'flex';
                    contactForm.reset();
                } else {
                    alert("Submission error. Please send an email directly to tomaquinmark123@gmail.com.");
                }
            } catch (err) {
                alert("Network error. Please try again.");
            }
        });
    }

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => modal.style.display = 'none');
    }
});

function showToast() {
    const toast = document.getElementById('toast-notification');
    if (toast) {
        toast.classList.add('active');
        setTimeout(() => toast.classList.remove('active'), 2800);
    }
}