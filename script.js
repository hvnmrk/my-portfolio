document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Custom Trailing Cursor ---
    if (window.matchMedia("(pointer: fine)").matches) {
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorOutline = document.querySelector('.cursor-outline');
        const hoverTargets = document.querySelectorAll('.hover-target');
        let mouseX = 0, mouseY = 0, outlineX = 0, outlineY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX; mouseY = e.clientY;
            cursorDot.style.left = `${mouseX}px`; cursorDot.style.top = `${mouseY}px`;
        });

        function animateCursor() {
            outlineX += (mouseX - outlineX) * 0.15;
            outlineY += (mouseY - outlineY) * 0.15;
            cursorOutline.style.left = `${outlineX}px`; cursorOutline.style.top = `${outlineY}px`;
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        document.body.addEventListener('mouseenter', (e) => {
            if (e.target.classList && e.target.classList.contains('hover-target')) {
                cursorOutline.classList.add('expand');
            }
        }, true);
        document.body.addEventListener('mouseleave', (e) => {
            if (e.target.classList && e.target.classList.contains('hover-target')) {
                cursorOutline.classList.remove('expand');
            }
        }, true);
    }

    // --- 2. Scroll Progress Bar ---
    const progressBar = document.querySelector('.scroll-progress');
    window.addEventListener('scroll', () => {
        if (progressBar) {
            const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            progressBar.style.width = scrollPercent + '%';
        }
    });

    // --- 3. Magnetic Buttons ---
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            btn.style.transform = `translate(${(e.clientX - (rect.left + rect.width / 2)) * 0.25}px, ${(e.clientY - (rect.top + rect.height / 2)) * 0.25}px)`;
        });
        btn.addEventListener('mouseleave', () => btn.style.transform = `translate(0px, 0px)`);
    });

    // --- 4. Adaptive Grid/Carousel Switcher ---
    const adaptiveContainers = document.querySelectorAll('.adaptive-carousel');

    adaptiveContainers.forEach(grid => {
        const cards = grid.children;
        const totalCards = cards.length;

        // Transform system only if contents have more than 3 units
        if (totalCards > 3) {
            grid.classList.add('carousel-active');
            const sectionHeader = grid.closest('.carousel-container').previousElementSibling;

            // Generate nav arrows inside the category block
            const navWrapper = document.createElement('div');
            navWrapper.classList.add('carousel-nav-controls');
            navWrapper.innerHTML = `
                <button class="carousel-arrow prev-arrow hover-target">←</button>
                <button class="carousel-arrow next-arrow hover-target">→</button>
            `;
            sectionHeader.appendChild(navWrapper);

            let currentIndex = 0;
            const prevBtn = navWrapper.querySelector('.prev-arrow');
            const nextBtn = navWrapper.querySelector('.next-arrow');

            function updateCarousel() {
                const cardWidth = cards[0].getBoundingClientRect().width;
                const gap = 30;
                // Changed Math.floor to Math.round to fix the empty space bug
                const visibleAmt = Math.round(grid.parentElement.getBoundingClientRect().width / (cardWidth + gap));
                const maxIndex = totalCards - visibleAmt;

                if (currentIndex < 0) currentIndex = 0;
                // Prevents index from going out of bounds
                if (currentIndex > maxIndex) currentIndex = Math.max(0, maxIndex);

                const moveX = currentIndex * (cardWidth + gap);
                grid.style.transform = `translateX(-${moveX}px)`;
            }

            nextBtn.addEventListener('click', () => {
                const cardWidth = cards[0].getBoundingClientRect().width;
                const gap = 30;
                // Changed Math.floor to Math.round here as well
                const visibleAmt = Math.round(grid.parentElement.getBoundingClientRect().width / (cardWidth + gap));
                const maxIndex = totalCards - visibleAmt;

                if (currentIndex < maxIndex) {
                    currentIndex++;
                    updateCarousel();
                }
            });
            prevBtn.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateCarousel();
                }
            });

            window.addEventListener('resize', updateCarousel);
            setTimeout(updateCarousel, 300); // Deferred execution hook to accurately map spacing calculations
        }
    });

    // --- 5. Scroll Reveal ---
    const revealOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealOnScroll.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach(el => revealOnScroll.observe(el));

    // --- 6. YouTube Controls ---
    document.querySelectorAll('.hover-video-card').forEach(card => {
        const iframe = document.getElementById(card.getAttribute('data-video-id'));
        const sendCmd = (cmd) => iframe?.contentWindow.postMessage(JSON.stringify({ event: 'command', func: cmd, args: [] }), '*');
        card.addEventListener('mouseenter', () => sendCmd('playVideo'));
        card.addEventListener('mouseleave', () => sendCmd('pauseVideo'));
    });

    // --- 7. Contact Form Modal Logic ---
    const contactForm = document.getElementById('contact-form');
    const modal = document.getElementById('email-modal');
    const closeBtn = document.getElementById('close-modal');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const response = await fetch("https://formspree.io/f/xlgvzele", {
                method: "POST",
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                modal.style.display = 'flex';
                contactForm.reset();
            } else {
                alert("Submission failed. Please try again.");
            }
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => modal.style.display = 'none');
    }

    // --- 8. Theme Toggle ---
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
            document.documentElement.setAttribute('data-theme', isLight ? 'dark' : 'light');
            localStorage.setItem('theme', isLight ? 'dark' : 'light');
            themeIcon.textContent = isLight ? '☼' : '☾';
        });
    }
});

function showToast() {
    const toast = document.getElementById('toast-notification');
    toast.classList.add('active');
    setTimeout(() => toast.classList.remove('active'), 3000);
}