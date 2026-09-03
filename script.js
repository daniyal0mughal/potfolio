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
    // 0. FULL-SCREEN DEVELOPER PRELOADER
    // --------------------------------------------------------------------------
    const preloader = document.getElementById('preloader');
    const preloaderFill = document.getElementById('preloaderFill');
    const preloaderPercent = document.getElementById('preloaderPercent');
    const preloaderStatus = document.getElementById('preloaderStatus');
    const preloaderLog = document.getElementById('preloaderLog');

    if (preloader) {
        let progress = 0;
        const telemetryLogs = [
            { threshold: 15, status: 'INITIALIZING MODULES...', log: '> Connecting runtime environment...' },
            { threshold: 40, status: 'LOADING ASSETS...', log: '> Bundling TypeScript & Flutter packages...' },
            { threshold: 70, status: 'MOUNTING COMPONENTS...', log: '> Compiling system architecture...' },
            { threshold: 90, status: 'FINALIZING SETUP...', log: '> Verifying API & database schemas...' },
            { threshold: 100, status: 'SYSTEM READY', log: '> Workspace online. Welcome.' }
        ];

        const updateProgress = (targetValue) => {
            progress = targetValue;
            if (preloaderFill) preloaderFill.style.width = `${progress}%`;
            if (preloaderPercent) preloaderPercent.textContent = `${Math.round(progress)}%`;

            const currentStage = telemetryLogs.slice().reverse().find(s => progress >= s.threshold);
            if (currentStage) {
                if (preloaderStatus) preloaderStatus.textContent = currentStage.status;
                if (preloaderLog) preloaderLog.textContent = currentStage.log;
            }
        };

        const progressInterval = setInterval(() => {
            if (progress < 90) {
                const increment = Math.random() * 14 + 6;
                updateProgress(Math.min(progress + increment, 90));
            }
        }, 80);

        const dismissPreloader = () => {
            clearInterval(progressInterval);
            updateProgress(100);

            setTimeout(() => {
                preloader.classList.add('preloader-hidden');
                document.body.classList.remove('is-loading');

                setTimeout(() => {
                    if (preloader.parentNode) {
                        preloader.parentNode.removeChild(preloader);
                    }
                }, 700);
            }, 300);
        };

        // Complete loading on window load or after safety threshold
        if (document.readyState === 'complete') {
            setTimeout(dismissPreloader, 700);
        } else {
            window.addEventListener('load', () => {
                setTimeout(dismissPreloader, 500);
            });
            // Fallback maximum timeout
            setTimeout(dismissPreloader, 2000);
        }
    }

    // --------------------------------------------------------------------------
    // 1. MOBILE SIDEBAR DRAWER TOGGLE
    // --------------------------------------------------------------------------
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const sidebar = document.getElementById('sidebar');
    const navOverlay = document.getElementById('navOverlay');
    const navLinks = document.querySelectorAll('.nav-link');

    function toggleMobileDrawer(openState) {
        const isOpen = openState !== undefined ? openState : !sidebar.classList.contains('is-drawer-open');
        
        if (isOpen) {
            sidebar.classList.add('is-drawer-open');
            navOverlay.classList.add('is-active');
            hamburgerBtn.classList.add('is-active');
            hamburgerBtn.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden'; // Prevent body scroll when drawer is open
        } else {
            sidebar.classList.remove('is-drawer-open');
            navOverlay.classList.remove('is-active');
            hamburgerBtn.classList.remove('is-active');
            hamburgerBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    }

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', () => toggleMobileDrawer());
    }

    if (navOverlay) {
        navOverlay.addEventListener('click', () => toggleMobileDrawer(false));
    }

    // Close mobile drawer when clicking any nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                toggleMobileDrawer(false);
            }
        });
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('is-drawer-open')) {
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
    // 7. HERO 3D CARD TILT & PARALLAX EFFECT
    // --------------------------------------------------------------------------
    const terminalTilt = document.getElementById('terminalTilt');
    const heroVisual = document.getElementById('heroInteractiveVisual');

    if (heroVisual && terminalTilt && window.innerWidth > 768) {
        heroVisual.addEventListener('mousemove', (e) => {
            const rect = heroVisual.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const rotateX = (-y / rect.height) * 16;
            const rotateY = (x / rect.width) * 16;

            terminalTilt.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        heroVisual.addEventListener('mouseleave', () => {
            terminalTilt.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    }

    // --------------------------------------------------------------------------
    // 8. HERO TERMINAL TYPING ROTATION
    // --------------------------------------------------------------------------
    const typingEl = document.getElementById('typingHeroCode');
    if (typingEl) {
        const phrases = [
            'Ready to engineer solutions',
            'Building scalable systems',
            'Cross-platform mobile apps',
            'Full-stack architecture'
        ];
        let phraseIdx = 0;
        let charIdx = 0;
        let isDeleting = false;

        function typeLoop() {
            const currentPhrase = phrases[phraseIdx];

            if (isDeleting) {
                typingEl.textContent = currentPhrase.substring(0, charIdx - 1);
                charIdx--;
            } else {
                typingEl.textContent = currentPhrase.substring(0, charIdx + 1);
                charIdx++;
            }

            let typeSpeed = isDeleting ? 40 : 80;

            if (!isDeleting && charIdx === currentPhrase.length) {
                typeSpeed = 2200; // Pause at end of phrase
                isDeleting = true;
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                typeSpeed = 400;
            }

            setTimeout(typeLoop, typeSpeed);
        }

        setTimeout(typeLoop, 1000);
    }

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
