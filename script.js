/**
 * ==========================================================================
 * PORTFOLIO JAVASCRIPT: DANIYAL AHMAD MUGHAL
 * Features:
 *  1. Mobile sidebar open/close & backdrop overlay
 *  2. Active navigation link highlighting (IntersectionObserver)
 *  3. Smooth scroll with header/layout offset handling
 *  4. Project category filtering (All, Web, Mobile, Full-Stack, AI)
 *  5. Skill category filtering (All, Languages, Frontend, Backend, Database, Tools)
 *  6. Scroll reveal animations (IntersectionObserver)
 *  7. Interactive Hero 3D Card Tilt & Typing Animation
 *  8. Metric numbers counter animation
 *  9. Project details modal viewer
 * 10. Contact form validation and interactive response
 * 11. Back to top button visibility and scrolling
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // --------------------------------------------------------------------------
    // HERO VIDEO CONTROLLER (GLOBAL SCOPE FOR PRELOADER & USER GESTURE TRIGGERS)
    // --------------------------------------------------------------------------
    const heroVideoEl = document.getElementById('heroShowcaseVideo');
    const heroVideoStatusPill = document.getElementById('heroVideoStatusPill');
    const videoStatusText = document.getElementById('videoStatusText');

    let userManuallyPausedVideo = false;

    const updateVideoPillState = (isPlaying) => {
        if (!heroVideoStatusPill) return;
        if (isPlaying) {
            heroVideoStatusPill.classList.remove('is-paused');
            if (videoStatusText) videoStatusText.textContent = 'VIDEO PLAYING';
        } else {
            heroVideoStatusPill.classList.add('is-paused');
            if (videoStatusText) videoStatusText.textContent = 'PLAY VIDEO';
        }
    };

    const playHeroVideo = () => {
        if (!heroVideoEl || userManuallyPausedVideo) return;
        heroVideoEl.muted = true;
        heroVideoEl.defaultMuted = true;
        heroVideoEl.volume = 0;
        heroVideoEl.loop = true;
        heroVideoEl.setAttribute('muted', '');
        heroVideoEl.setAttribute('playsinline', '');
        heroVideoEl.setAttribute('webkit-playsinline', '');
        heroVideoEl.setAttribute('loop', '');

        const playPromise = heroVideoEl.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    updateVideoPillState(true);
                })
                .catch(() => {
                    updateVideoPillState(false);
                });
        }
    };

    // --------------------------------------------------------------------------
    // 0. FULL-SCREEN DEVELOPER PRELOADER
    // --------------------------------------------------------------------------
    const preloader = document.getElementById('preloader');
    const preloaderFill = document.getElementById('preloaderFill');
    const preloaderPercent = document.getElementById('preloaderPercent');
    const preloaderStatus = document.getElementById('preloaderStatus');
    const preloaderLog = document.getElementById('preloaderLog');

    if (preloader) {
        let progress = 0;
        let isDismissed = false;
        const telemetryLogs = [
            { threshold: 15, status: 'INITIALIZING MODULES...', log: '> Connecting runtime environment...' },
            { threshold: 40, status: 'LOADING ASSETS...', log: '> Bundling TypeScript & Flutter packages...' },
            { threshold: 70, status: 'MOUNTING COMPONENTS...', log: '> Compiling system architecture...' },
            { threshold: 90, status: 'FINALIZING SETUP...', log: '> Verifying API & database schemas...' },
            { threshold: 100, status: 'SYSTEM READY', log: '> Workspace online. Welcome.' }
        ];

        const updateProgress = (targetValue) => {
            progress = Math.min(Math.max(targetValue, progress), 100);
            if (preloaderFill) preloaderFill.style.width = `${progress}%`;
            if (preloaderPercent) preloaderPercent.textContent = `${Math.round(progress)}%`;

            const currentStage = telemetryLogs.slice().reverse().find(s => progress >= s.threshold);
            if (currentStage) {
                if (preloaderStatus) preloaderStatus.textContent = currentStage.status;
                if (preloaderLog) preloaderLog.textContent = currentStage.log;
            }
        };

        const dismissPreloader = () => {
            if (isDismissed) return;
            isDismissed = true;
            clearInterval(progressInterval);
            updateProgress(100);

            setTimeout(() => {
                preloader.classList.add('preloader-hidden');
                document.body.classList.remove('is-loading');
                document.body.classList.add('hero-animated');

                // Trigger video playback upon preloader dismissal
                playHeroVideo();

                setTimeout(() => {
                    if (preloader && preloader.parentNode) {
                        preloader.parentNode.removeChild(preloader);
                    }
                }, 550);
            }, 250);
        };

        const progressInterval = setInterval(() => {
            if (progress < 92) {
                const step = Math.random() * 18 + 12;
                updateProgress(progress + step);
            } else {
                dismissPreloader();
            }
        }, 50);

        if (document.readyState === 'complete') {
            setTimeout(dismissPreloader, 600);
        } else {
            window.addEventListener('load', () => {
                setTimeout(dismissPreloader, 400);
            });
            setTimeout(dismissPreloader, 1000);
        }
    } else {
        document.body.classList.add('hero-animated');
    }

    // --------------------------------------------------------------------------
    // 1. TOP FLOATING NAVBAR & MOBILE DROPDOWN DRAWER
    // --------------------------------------------------------------------------
    const topNavbar = document.getElementById('topNavbar');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileDropdownDrawer = document.getElementById('mobileDropdownDrawer');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileDrawerLinks = document.querySelectorAll('.mobile-drawer-link');

    function updateNavbarScrollState() {
        if (!topNavbar) return;
        if (window.scrollY > 36) {
            topNavbar.classList.add('is-scrolled');
        } else {
            topNavbar.classList.remove('is-scrolled');
        }
    }
    window.addEventListener('scroll', updateNavbarScrollState, { passive: true });
    updateNavbarScrollState();

    function toggleMobileDrawer(openState) {
        if (!mobileDropdownDrawer || !hamburgerBtn) return;
        const isOpen = openState !== undefined
            ? openState
            : !mobileDropdownDrawer.classList.contains('is-open');

        if (isOpen) {
            mobileDropdownDrawer.classList.add('is-open');
            hamburgerBtn.classList.add('is-active');
            hamburgerBtn.setAttribute('aria-expanded', 'true');
        } else {
            mobileDropdownDrawer.classList.remove('is-open');
            hamburgerBtn.classList.remove('is-active');
            hamburgerBtn.setAttribute('aria-expanded', 'false');
        }
    }

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMobileDrawer();
        });
    }

    mobileDrawerLinks.forEach(link => {
        link.addEventListener('click', () => toggleMobileDrawer(false));
    });

    document.addEventListener('click', (e) => {
        if (
            mobileDropdownDrawer &&
            mobileDropdownDrawer.classList.contains('is-open') &&
            topNavbar &&
            !topNavbar.contains(e.target)
        ) {
            toggleMobileDrawer(false);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileDropdownDrawer && mobileDropdownDrawer.classList.contains('is-open')) {
            toggleMobileDrawer(false);
        }
    });

    // --------------------------------------------------------------------------
    // 2. ACTIVE SECTION DETECTION & SIDEBAR HIGHLIGHT (IntersectionObserver)
    // --------------------------------------------------------------------------
    const sections = document.querySelectorAll('section[id]');
    
    const navObserverOptions = {
        root: null,
        rootMargin: '-20% 0px -65% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === currentId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, navObserverOptions);

    sections.forEach(sec => sectionObserver.observe(sec));

    // --------------------------------------------------------------------------
    // 3. SCROLL REVEAL ANIMATIONS
    // --------------------------------------------------------------------------
    const revealElements = document.querySelectorAll('.reveal-element');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: unobserve once revealed for performance
                // revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // --------------------------------------------------------------------------
    // 4. ANIMATED METRICS COUNTER
    // --------------------------------------------------------------------------
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersStarted = false;

    function runCounterAnimation() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'), 10) || 0;
            const duration = 1500;
            const stepTime = 30;
            const steps = duration / stepTime;
            const increment = target / steps;
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = target;
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current);
                }
            }, stepTime);
        });
    }

    const statsRow = document.querySelector('.profile-stats-row');
    if (statsRow) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersStarted) {
                    countersStarted = true;
                    runCounterAnimation();
                }
            });
        }, { threshold: 0.3 });

        statsObserver.observe(statsRow);
    }

    // --------------------------------------------------------------------------
    // 5. SKILLS FILTERING
    // --------------------------------------------------------------------------
    const skillFilterBtns = document.querySelectorAll('[data-skill-filter]');
    const skillCards = document.querySelectorAll('.skill-card');

    skillFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            skillFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-skill-filter').toLowerCase();

            skillCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('is-hidden');
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.classList.add('is-hidden');
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px)';
                }
            });
        });
    });

    // --------------------------------------------------------------------------
    // 6. PROJECTS FILTERING
    // --------------------------------------------------------------------------
    const projFilterBtns = document.querySelectorAll('[data-project-filter]');
    const projectCards = document.querySelectorAll('.project-card');

    projFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            projFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-project-filter').toLowerCase();

            projectCards.forEach(card => {
                const categories = (card.getAttribute('data-proj-category') || '').toLowerCase();
                
                if (filter === 'all' || categories.includes(filter)) {
                    card.classList.remove('is-hidden');
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.classList.add('is-hidden');
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                }
            });
        });
    });

    // --------------------------------------------------------------------------
    // 7. CLEAN FULL-SCREEN VIDEO HERO ENGINE WITH SCROLL ANIMATION
    // --------------------------------------------------------------------------
    const heroScrollTrack = document.getElementById('heroScrollTrack');
    const heroHeaderBlock = document.getElementById('heroHeaderBlock');
    const heroSideBadge = document.getElementById('heroSideBadge');
    const heroVideoStage = document.getElementById('heroVideoStage');
    const heroVideoOverlay = document.getElementById('heroVideoOverlay');
    const heroScrollCue = document.getElementById('heroScrollCue');
    const ambientCanvas = document.getElementById('heroAmbientParticles');

    let heroScrollProgress = 0;
    let targetScrollProgress = 0;
    let mouseTiltX = 0;
    let mouseTiltY = 0;

    if (heroVideoStage && window.innerWidth > 768) {
        heroVideoStage.addEventListener('mousemove', (e) => {
            const rect = heroVideoStage.getBoundingClientRect();
            const nx = (e.clientX - rect.left) / rect.width - 0.5;
            const ny = (e.clientY - rect.top) / rect.height - 0.5;
            mouseTiltY = nx * 5;
            mouseTiltX = -ny * 4;
        });

        heroVideoStage.addEventListener('mouseleave', () => {
            mouseTiltX = 0;
            mouseTiltY = 0;
        });
    }

    function computeHeroScroll() {
        if (!heroScrollTrack) return;
        const rect = heroScrollTrack.getBoundingClientRect();
        const scrollableDistance = Math.max(rect.height - window.innerHeight, 1);
        const scrolled = -rect.top;
        targetScrollProgress = Math.min(Math.max(scrolled / scrollableDistance, 0), 1);
    }

    window.addEventListener('scroll', computeHeroScroll, { passive: true });
    window.addEventListener('resize', computeHeroScroll, { passive: true });
    computeHeroScroll();

    // --------------------------------------------------------------------------
    // BULLETPROOF HERO VIDEO ENGINE & EVENT LISTENERS
    // --------------------------------------------------------------------------
    if (heroVideoEl) {
        // Enforce muted, playsinline, and loop for strict continuous playback
        heroVideoEl.muted = true;
        heroVideoEl.defaultMuted = true;
        heroVideoEl.volume = 0;
        heroVideoEl.loop = true;
        heroVideoEl.setAttribute('loop', '');

        // Try playing immediately
        playHeroVideo();

        // Listen for media readiness events
        heroVideoEl.addEventListener('loadeddata', () => playHeroVideo(), { passive: true });
        heroVideoEl.addEventListener('canplay', () => playHeroVideo(), { passive: true });
        heroVideoEl.addEventListener('canplaythrough', () => playHeroVideo(), { passive: true });

        // --------------------------------------------------------------------------
        // INFINITE GAPLESS LOOP ENGINE (PREVENTS STOPPING AT VIDEO END)
        // --------------------------------------------------------------------------
        // 1. Pre-EOF loop rewind: seamlessly rewinds before browser decoder pauses/halts at EOF
        heroVideoEl.addEventListener('timeupdate', () => {
            if (!userManuallyPausedVideo && heroVideoEl.duration) {
                // If approaching the final 0.15s of the clip, loop back to the start smoothly
                if (heroVideoEl.currentTime >= heroVideoEl.duration - 0.15) {
                    heroVideoEl.currentTime = 0;
                    if (heroVideoEl.paused) {
                        heroVideoEl.play().catch(() => {});
                    }
                }
            }
        }, { passive: true });

        // 2. 'ended' event fallback: if EOF is reached, immediately restart
        heroVideoEl.addEventListener('ended', () => {
            if (!userManuallyPausedVideo) {
                heroVideoEl.currentTime = 0;
                heroVideoEl.play().catch(() => {});
                updateVideoPillState(true);
            }
        }, { passive: true });

        // 3. 'pause' event watchdog: automatically recovers if paused at EOF or during loop transition
        heroVideoEl.addEventListener('pause', () => {
            if (!userManuallyPausedVideo) {
                // If paused near the end or at EOF, restart immediately
                if (!heroVideoEl.duration || heroVideoEl.currentTime >= (heroVideoEl.duration - 0.35) || heroVideoEl.ended) {
                    heroVideoEl.currentTime = 0;
                    heroVideoEl.play().catch(() => {});
                } else {
                    // Check if it's a genuine pause or a browser stutter
                    setTimeout(() => {
                        if (heroVideoEl.paused && !userManuallyPausedVideo) {
                            heroVideoEl.play().catch(() => {
                                updateVideoPillState(false);
                            });
                        }
                    }, 120);
                }
            }
        }, { passive: true });

        // Synchronize UI status pill
        heroVideoEl.addEventListener('playing', () => {
            updateVideoPillState(true);
        }, { passive: true });

        // Fallback to scene-2-developer if primary video decoding encounters an error
        heroVideoEl.addEventListener('error', () => {
            console.warn('Hero video load/decode notice, switching to fallback stream.');
            const fallback = 'assets/videos/scene-2-developer.mp4';
            if (!heroVideoEl.currentSrc.includes('scene-2-developer')) {
                heroVideoEl.src = fallback;
                heroVideoEl.load();
                playHeroVideo();
            }
        });

        // Interactive status pill toggle
        if (heroVideoStatusPill) {
            heroVideoStatusPill.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (heroVideoEl.paused) {
                    userManuallyPausedVideo = false;
                    playHeroVideo();
                } else {
                    userManuallyPausedVideo = true;
                    heroVideoEl.pause();
                    updateVideoPillState(false);
                }
            });
        }

        // Global Wakeup: On the very first user interaction anywhere (click, touch, scroll, pointer, key)
        const wakeVideoOnUserGesture = () => {
            if (heroVideoEl.paused && !userManuallyPausedVideo) {
                playHeroVideo();
            }
            if (!heroVideoEl.paused) {
                ['click', 'touchstart', 'scroll', 'pointerdown', 'keydown'].forEach(evt => {
                    window.removeEventListener(evt, wakeVideoOnUserGesture);
                });
            }
        };

        ['click', 'touchstart', 'scroll', 'pointerdown', 'keydown'].forEach(evt => {
            window.addEventListener(evt, wakeVideoOnUserGesture, { passive: true });
        });

        // Tab Visibility: resume video playback when user switches back to this tab
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && heroVideoEl.paused && !userManuallyPausedVideo) {
                playHeroVideo();
            }
        });

        // Viewport Intersection: only pause when scrolled completely past the hero section
        if ('IntersectionObserver' in window && heroScrollTrack) {
            const heroVideoObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        if (heroVideoEl.paused && !userManuallyPausedVideo) {
                            playHeroVideo();
                        }
                    } else if (entry.boundingClientRect.bottom < 0) {
                        // User has scrolled completely below the hero section
                        if (!heroVideoEl.paused && !userManuallyPausedVideo) {
                            heroVideoEl.pause();
                        }
                    }
                });
            }, { threshold: 0.01 });
            heroVideoObserver.observe(heroScrollTrack);
        }
    }

    // Ambient Background Particles
    let ambCtx = null;
    let ambParticles = [];
    if (ambientCanvas) {
        ambCtx = ambientCanvas.getContext('2d');
        const resizeAmbient = () => {
            ambientCanvas.width = ambientCanvas.offsetWidth || window.innerWidth;
            ambientCanvas.height = ambientCanvas.offsetHeight || window.innerHeight;
        };
        resizeAmbient();
        window.addEventListener('resize', resizeAmbient, { passive: true });

        for (let i = 0; i < 35; i++) {
            ambParticles.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                r: Math.random() * 1.6 + 0.6,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                alpha: Math.random() * 0.35 + 0.1
            });
        }
    }

    function renderHeroFrame() {
        // Smoothly interpolate scroll progress
        heroScrollProgress += (targetScrollProgress - heroScrollProgress) * 0.14;
        const p = heroScrollProgress;

        if (heroVideoStage) {
            // Full-bleed clean video smoothly zooms in with subtle 3D parallax on scroll
            const scale = 1.0 + p * 0.16;
            const transY = -p * 30;
            const rotX = mouseTiltX * 0.3;
            const rotY = mouseTiltY * 0.3;
            heroVideoStage.style.transform = `scale(${scale.toFixed(3)}) translateY(${transY.toFixed(1)}px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
        }

        if (heroVideoOverlay) {
            // Very light overlay when idle for maximum video clarity; smoothly darkens on scroll towards Industrial Experience
            const overlayDim = 0.25 + p * 0.75;
            heroVideoOverlay.style.opacity = Math.min(overlayDim, 1).toFixed(2);
        }

        if (heroHeaderBlock) {
            // Central text moves up with parallax and softly dissolves
            const headerY = -p * 80;
            const headerOpacity = Math.max(1 - p * 1.5, 0);
            heroHeaderBlock.style.transform = `translateY(${headerY.toFixed(1)}px)`;
            heroHeaderBlock.style.opacity = headerOpacity.toFixed(2);
        }

        if (heroSideBadge) {
            // Side badge glides up and dissolves smoothly on scroll
            const badgeY = -p * 60;
            const badgeOpacity = Math.max(1 - p * 2.2, 0);
            heroSideBadge.style.transform = `translateY(${badgeY.toFixed(1)}px)`;
            heroSideBadge.style.opacity = badgeOpacity.toFixed(2);
        }

        if (heroScrollCue) {
            // Scroll cue fades out immediately upon scroll
            const cueOpacity = Math.max(1 - p * 3, 0);
            heroScrollCue.style.opacity = cueOpacity.toFixed(2);
            heroScrollCue.style.transform = `translateY(${(-p * 20).toFixed(1)}px)`;
        }

        // Render Ambient Particles
        if (ambCtx && ambientCanvas) {
            ambCtx.clearRect(0, 0, ambientCanvas.width, ambientCanvas.height);
            for (let i = 0; i < ambParticles.length; i++) {
                const pt = ambParticles[i];
                pt.x += pt.vx;
                pt.y += pt.vy;
                if (pt.x < 0) pt.x = ambientCanvas.width;
                if (pt.x > ambientCanvas.width) pt.x = 0;
                if (pt.y < 0) pt.y = ambientCanvas.height;
                if (pt.y > ambientCanvas.height) pt.y = 0;

                ambCtx.beginPath();
                ambCtx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
                ambCtx.fillStyle = (i % 2 === 0) ? `rgba(0, 240, 255, ${pt.alpha})` : `rgba(255, 42, 109, ${pt.alpha})`;
                ambCtx.fill();
            }
        }

        requestAnimationFrame(renderHeroFrame);
    }

    requestAnimationFrame(renderHeroFrame);

    // --------------------------------------------------------------------------
    // 9. BACK TO TOP BUTTON
    // --------------------------------------------------------------------------
    const backToTopBtn = document.getElementById('backToTopBtn');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('is-visible');
        } else {
            backToTopBtn.classList.remove('is-visible');
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --------------------------------------------------------------------------
    // 10. CONTACT FORM CLIENT VALIDATION & FEEDBACK
    // --------------------------------------------------------------------------
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');
    const nameInput = document.getElementById('nameInput');
    const emailInput = document.getElementById('emailInput');
    const typeSelect = document.getElementById('projectTypeSelect');
    const messageInput = document.getElementById('messageInput');

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            // Reset errors
            document.querySelectorAll('.form-group').forEach(fg => fg.classList.remove('has-error'));
            formFeedback.className = 'form-feedback';
            formFeedback.style.display = 'none';

            // Validate Name
            if (!nameInput.value.trim()) {
                nameInput.parentElement.classList.add('has-error');
                isValid = false;
            }

            // Validate Email
            if (!validateEmail(emailInput.value.trim())) {
                emailInput.parentElement.classList.add('has-error');
                isValid = false;
            }

            // Validate Select
            if (!typeSelect.value) {
                typeSelect.parentElement.classList.add('has-error');
                isValid = false;
            }

            // Validate Message
            if (messageInput.value.trim().length < 10) {
                messageInput.parentElement.classList.add('has-error');
                isValid = false;
            }

            if (isValid) {
                // Simulate message dispatch
                const submitBtn = document.getElementById('submitBtn');
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span>TRANSMITTING MESSAGE...</span>';

                setTimeout(() => {
                    formFeedback.innerHTML = `✓ Thank you, <strong>${nameInput.value.trim()}</strong>! Your message regarding <em>${typeSelect.value}</em> has been prepared. We'll connect shortly.`;
                    formFeedback.classList.add('success');
                    formFeedback.style.display = 'block';

                    contactForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<span>SEND MESSAGE →</span>';
                }, 1000);
            }
        });
    }

    // --------------------------------------------------------------------------
    // 11. PROJECT DETAILS MODAL SYSTEM
    // --------------------------------------------------------------------------
    const projectData = {
        teyzix: {
            category: "FINANCE / MOBILE APPLICATION",
            title: "TEYZIX CORE",
            description: "A comprehensive finance management application crafted to empower users in tracking expenses, incomes, custom recurring budgets, and financial health analytics through an intuitive cross-platform mobile interface.",
            features: [
                "Real-time expense & income ledger",
                "Dynamic budget categorization with alerts",
                "Interactive visual expenditure graphs",
                "Full offline support with local synchronization",
                "Secure data encryption via Firebase backend"
            ],
            tech: ["Flutter", "Dart", "Firebase", "Firestore", "State Management"]
        },
        technician: {
            category: "FIELD SERVICE / MOBILE APPLICATION",
            title: "FIELD TECHNICIAN MANAGEMENT APP",
            description: "An enterprise-grade mobile application developed around mission-critical field-service workflows, enabling technicians to view dispatched jobs, accept or reschedule tasks, and report on-site service updates.",
            features: [
                "JWT-based role authentication & secure profile",
                "Interactive dashboard with job status filters",
                "Assigned, pending, and completed service queues",
                "Accept / reject job assignment triggers",
                "Detailed digital service reports with photo attachments & notes"
            ],
            tech: ["React Native", "TypeScript", "REST APIs", "Mobile UI", "AsyncStorage"]
        },
        property: {
            category: "FULL-STACK WEB APPLICATION",
            title: "PROPERTY LISTING PLATFORM",
            description: "A property-focused web platform designed for displaying real estate listings and managing listings, inquiries, and agent profiles through a robust administrative control panel.",
            features: [
                "High-performance property catalog with faceted filtering",
                "Secure administrative dashboard for CRUD operations",
                "Relational schema modeling for properties, amenities, and inquiries",
                "Server-side rendered pages for SEO and speed"
            ],
            tech: ["Next.js", "NestJS", "PostgreSQL", "TypeScript", "REST APIs"]
        },
        chatbot: {
            category: "AI / APPLICATION",
            title: "HEALTH CHATBOT",
            description: "A health-focused conversational AI project structured around answering common health inquiries, parsing user queries, and providing reliable structured health information.",
            features: [
                "Natural language query parsing",
                "Domain-specific health knowledge database",
                "Real-time conversational interface with typing indicators",
                "Clean responsive chat viewport"
            ],
            tech: ["Python", "AI Integration", "JavaScript", "HTML5", "CSS3"]
        },
        expense: {
            category: "FINANCE / MOBILE APPLICATION",
            title: "EXPENSE TRACKER",
            description: "A lightweight, streamlined mobile application designed for frictionless tracking of daily personal expenses and rapid financial log analysis.",
            features: [
                "Instant single-tap transaction logging",
                "Visual monthly expense breakdowns",
                "Custom category icons and tags",
                "Local cache persistence for snappy offline use"
            ],
            tech: ["Flutter", "Dart", "Local Storage", "Reactive UI"]
        },
        interior: {
            category: "DESIGN / APPLICATION",
            title: "VIRTUAL INTERIOR DESIGNER",
            description: "A concept application focused on assisting interior designers and homeowners to explore spatial layouts, color palettes, and furniture arrangements dynamically.",
            features: [
                "Interactive spatial layout mockup views",
                "Aesthetic color palette and texture suggestions",
                "Modern high-contrast cyber-chic UI",
                "Fluid gesture controls for touch screens"
            ],
            tech: ["Flutter", "UI Development", "Dart", "Custom Canvas"]
        }
    };

    const projectModal = document.getElementById('projectModal');
    const modalBody = document.getElementById('modalBody');
    const modalCloseBtn = document.getElementById('modalCloseBtn');

    window.openProjectModal = function(projectId) {
        const data = projectData[projectId];
        if (!data || !modalBody || !projectModal) return;

        const featureItems = data.features.map(f => `<li>${f}</li>`).join('');
        const techTags = data.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');

        modalBody.innerHTML = `
            <div class="modal-proj-tag">${data.category}</div>
            <h3 class="modal-proj-title">${data.title}</h3>
            <p class="modal-proj-desc">${data.description}</p>
            <h4 class="modal-sec-head">KEY CAPABILITIES &amp; FEATURES</h4>
            <ul class="modal-feat-list">
                ${featureItems}
            </ul>
            <h4 class="modal-sec-head">TECHNOLOGY STACK</h4>
            <div class="modal-tech-pills">
                ${techTags}
            </div>
        `;

        projectModal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    };

    function closeModal() {
        if (projectModal) {
            projectModal.classList.remove('is-open');
            document.body.style.overflow = '';
        }
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    if (projectModal) {
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) {
                closeModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectModal && projectModal.classList.contains('is-open')) {
            closeModal();
        }
    });

});
