document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Soft Un-Blur Scroll Reveal Observer ---
    const revealTargets = document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealTargets.forEach(el => revealObserver.observe(el));

    // --- 2. Interactive Spotlight Mouse Glow ---
    const spotlightCards = document.querySelectorAll('.spotlight-card');
    spotlightCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // --- 3. 3D Tilt Dynamics for macOS Editor Windows ---
    const tiltTargets = document.querySelectorAll('.tilt-target');
    if (window.matchMedia("(pointer: fine)").matches) {
        tiltTargets.forEach(target => {
            target.addEventListener('mousemove', (e) => {
                const rect = target.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                const rotateX = -(y / (rect.height / 2)) * 6;
                const rotateY = (x / (rect.width / 2)) * 6;
                target.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            target.addEventListener('mouseleave', () => {
                target.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
            });
        });
    }

    // --- 4. 3D Flippable Digital ID Card ---
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
    }

    // --- 5. Projects Carousel Slider & Touch Gestures ---
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
            const visible = Math.max(1, Math.floor((containerWidth + gap) / (cardWidth + gap)));
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

        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const swipeDistance = touchStartX - touchEndX;
            const { maxIdx } = getVisibleMetrics();

            if (swipeDistance > 45 && currentIndex < maxIdx) {
                currentIndex++;
                updateSlider();
            } else if (swipeDistance < -45 && currentIndex > 0) {
                currentIndex--;
                updateSlider();
            }
        }, { passive: true });

        window.addEventListener('resize', updateSlider);
        setTimeout(updateSlider, 200);
    });

    // --- 6. Scroll Progress Bar ---
    const progressBar = document.querySelector('.scroll-progress');
    window.addEventListener('scroll', () => {
        if (progressBar) {
            const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            progressBar.style.width = scrollPercent + '%';
        }
    });

    // --- 7. Theme Switcher (Dark / Light) ---
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

    // --- 8. Contact Form Modal ---
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
                    alert("Submission error. Please email directly to tomaquinmark123@gmail.com.");
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