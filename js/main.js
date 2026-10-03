document.addEventListener('DOMContentLoaded', () => {

    const revealItems = document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right');

    const revealWatch = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealWatch.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealItems.forEach(el => revealWatch.observe(el));

    const glowCards = document.querySelectorAll('.spotlight-card');

    glowCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    const tiltCards = document.querySelectorAll('.tilt-target');

    if (window.matchMedia("(pointer: fine)").matches) {
        tiltCards.forEach(target => {

            target.addEventListener('mousemove', (e) => {
                const rect = target.getBoundingClientRect();

                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                const rotateX = -(y / (rect.height / 2)) * 6;
                const rotateY = (x / (rect.width / 2)) * 6;

                target.style.transform =
                    `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            target.addEventListener('mouseleave', () => {
                target.style.transform =
                    `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
            });

        });
    }

    // ================================
    // DIGITAL / NFC CARD FLIP
    // ================================

    const interactiveCard =
        document.getElementById('interactiveCard');

    if (interactiveCard) {

        interactiveCard.addEventListener('click', () => {

            interactiveCard.classList.toggle('is-flipped');

        });


        interactiveCard.addEventListener('keydown', (e) => {

            if (
                e.key === 'Enter' ||
                e.key === ' '
            ) {

                e.preventDefault();

                interactiveCard.classList.toggle(
                    'is-flipped'
                );

            }

        });

    }
    const projectTracks = document.querySelectorAll('.adaptive-carousel');

    projectTracks.forEach(track => {

        const cards = Array.from(track.children);
        const cardCount = cards.length;

        const container = track.closest('.carousel-container');

        if (!container) return;

        const header = container.previousElementSibling;

        if (!header) return;

        const prevBtn = header.querySelector('.prev-arrow');
        const nextBtn = header.querySelector('.next-arrow');

        if (!prevBtn || !nextBtn) return;

        let slideIndex = 0;

        function getTrackInfo() {

            const firstCard = cards[0];

            if (!firstCard) {
                return {
                    cardWidth: 0,
                    gap: 24,
                    maxIdx: 0
                };
            }

            const cardWidth = firstCard.getBoundingClientRect().width;

            const style = window.getComputedStyle(track);

            const gap = parseFloat(style.gap) || 24;

            const containerWidth = container.getBoundingClientRect().width;

            const visible = Math.max(
                1,
                Math.floor(
                    (containerWidth + gap) /
                    (cardWidth + gap)
                )
            );

            const maxIdx = Math.max(
                0,
                cardCount - visible
            );

            return {
                cardWidth,
                gap,
                maxIdx
            };
        }

        function moveTrack() {

            const {
                cardWidth,
                gap,
                maxIdx
            } = getTrackInfo();

            if (slideIndex < 0) {
                slideIndex = 0;
            }

            if (slideIndex > maxIdx) {
                slideIndex = maxIdx;
            }

            const translateX =
                slideIndex * (cardWidth + gap);

            track.style.transform =
                `translateX(-${translateX}px)`;

            prevBtn.style.opacity =
                slideIndex === 0 ? '0.3' : '1';

            prevBtn.style.pointerEvents =
                slideIndex === 0 ? 'none' : 'auto';

            nextBtn.style.opacity =
                slideIndex >= maxIdx ? '0.3' : '1';

            nextBtn.style.pointerEvents =
                slideIndex >= maxIdx ? 'none' : 'auto';
        }

        nextBtn.addEventListener('click', (e) => {

            e.preventDefault();

            const { maxIdx } = getTrackInfo();

            if (slideIndex < maxIdx) {
                slideIndex++;
                moveTrack();
            }

        });

        prevBtn.addEventListener('click', (e) => {

            e.preventDefault();

            if (slideIndex > 0) {
                slideIndex--;
                moveTrack();
            }

        });

        let touchStart = 0;
        let touchEnd = 0;

        track.addEventListener('touchstart', (e) => {

            touchStart =
                e.changedTouches[0].screenX;

        }, {
            passive: true
        });

        track.addEventListener('touchend', (e) => {

            touchEnd =
                e.changedTouches[0].screenX;

            const swipeX =
                touchStart - touchEnd;

            const { maxIdx } =
                getTrackInfo();

            if (
                swipeX > 45 &&
                slideIndex < maxIdx
            ) {

                slideIndex++;
                moveTrack();

            } else if (
                swipeX < -45 &&
                slideIndex > 0
            ) {

                slideIndex--;
                moveTrack();

            }

        }, {
            passive: true
        });

        window.addEventListener(
            'resize',
            moveTrack
        );

        setTimeout(
            moveTrack,
            200
        );

    });

    const pageProgress =
        document.querySelector('.scroll-progress');

    window.addEventListener('scroll', () => {

        if (pageProgress) {

            const maxScroll =
                document.body.scrollHeight -
                window.innerHeight;

            const scrollPercent =
                maxScroll > 0
                    ? (window.scrollY / maxScroll) * 100
                    : 0;

            pageProgress.style.width =
                scrollPercent + '%';
        }

    });

    const themeButton =
        document.getElementById('theme-toggle');

    if (themeButton) {

        const themeIcon =
            themeButton.querySelector('.theme-icon');

        const savedTheme =
            localStorage.getItem('theme');

        if (savedTheme) {

            document.documentElement.setAttribute(
                'data-theme',
                savedTheme
            );

            if (themeIcon) {
                themeIcon.textContent =
                    savedTheme === 'light'
                        ? '☾'
                        : '☼';
            }
        }

        themeButton.addEventListener('click', () => {

            const isLight =
                document.documentElement.getAttribute(
                    'data-theme'
                ) === 'light';

            const newTheme =
                isLight ? 'dark' : 'light';

            document.documentElement.setAttribute(
                'data-theme',
                newTheme
            );

            localStorage.setItem(
                'theme',
                newTheme
            );

            if (themeIcon) {
                themeIcon.textContent =
                    isLight ? '☼' : '☾';
            }

        });

    }

    const navLinksList =
        document.querySelectorAll('.nav-link');

    const sections =
        document.querySelectorAll('main section[id]');

    function updateActiveNav() {

        if (!navLinksList.length || !sections.length) {
            return;
        }

        let activeSection = 'home';

        const scrollPoint =
            window.scrollY + 180;

        sections.forEach(section => {

            const sectionTop =
                section.offsetTop;

            const sectionBottom =
                sectionTop +
                section.offsetHeight;

            if (
                scrollPoint >= sectionTop &&
                scrollPoint < sectionBottom
            ) {

                activeSection =
                    section.id;

            }

        });

        navLinksList.forEach(link => {

            const linkTarget =
                link.getAttribute('href');

            link.classList.toggle(
                'active',
                linkTarget === `#${activeSection}`
            );

        });

    }

    window.addEventListener(
        'scroll',
        updateActiveNav
    );

    window.addEventListener(
        'resize',
        updateActiveNav
    );

    updateActiveNav();

    const menuButton =
        document.querySelector('.menu-toggle');

    const menuLinks =
        document.querySelector('.nav-links');

    if (menuButton && menuLinks) {

        const menuMark =
            menuButton.querySelector('.menu-icon') ||
            menuButton;

        function setMenu(open) {

            menuLinks.classList.toggle(
                'nav-active',
                open
            );

            document.body.classList.toggle(
                'menu-open',
                open
            );

            menuMark.textContent =
                open ? '✕' : '☰';

            menuButton.setAttribute(
                'aria-expanded',
                open ? 'true' : 'false'
            );

        }

        setMenu(false);

        menuButton.addEventListener('click', (e) => {

            e.preventDefault();
            e.stopPropagation();

            const isOpen =
                menuLinks.classList.contains(
                    'nav-active'
                );

            setMenu(!isOpen);

        });

        menuLinks.querySelectorAll('a').forEach(link => {

            link.addEventListener('click', () => {

                setMenu(false);

                navLinksList.forEach(item => {
                    item.classList.remove('active');
                });

                link.classList.add('active');

            });

        });

        document.addEventListener('click', (e) => {

            if (
                menuLinks.classList.contains('nav-active') &&
                !menuLinks.contains(e.target) &&
                !menuButton.contains(e.target)
            ) {

                setMenu(false);

            }

        });

        document.addEventListener('keydown', (e) => {

            if (e.key === 'Escape') {
                setMenu(false);
            }

        });

        const mobileView =
            window.matchMedia('(max-width: 768px)');

        const handleMobileChange = (e) => {

            if (!e.matches) {
                setMenu(false);
            }

        };

        if (mobileView.addEventListener) {

            mobileView.addEventListener(
                'change',
                handleMobileChange
            );

        } else {

            mobileView.addListener(
                handleMobileChange
            );

        }

        window.addEventListener('resize', () => {

            if (window.innerWidth > 768) {
                setMenu(false);
            }

        });

    }

});
