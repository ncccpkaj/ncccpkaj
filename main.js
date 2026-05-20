/**
 * Fully Synchronized Portfolio Engine
 * Optimized for Preloader Clearances, ScrollSpy, and Lenis Lifecycle
 */

document.addEventListener("DOMContentLoaded", () => {
    // Register GSAP System Plugins immediately
    gsap.registerPlugin(ScrollTrigger);

    // Cache Global Layout Element Nodes
    const stickyHeader = document.getElementById("sticky-header");
    const menuBtn = document.getElementById("menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    const menuIconOpen = document.getElementById("menu-icon-open");
    const menuIconClose = document.getElementById("menu-icon-close");
    const motionToggleBtn = document.getElementById("motion-toggle");
    const pageLoader = document.getElementById("page-loader");
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("section");

    let lenisEngine = null;
    let prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /**
     * Initialize Smooth Scrolling Engine
     */
    function initLenisScroll() {
        if (prefersReducedMotion) return;

        lenisEngine = new Lenis({
            duration: 1.2, 
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1.0, 
            touchMultiplier: 1.2,
            infinite: false
        });

        lenisEngine.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            if (lenisEngine) lenisEngine.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
    }

    // Unmount and fade out preloader smoothly
    window.addEventListener("load", () => {
        setTimeout(() => {
            gsap.to(pageLoader, {
                opacity: 0,
                duration: 0.5,
                ease: "power2.out",
                onComplete: () => {
                    pageLoader.style.display = "none";
                    initLenisScroll();
                    applyMotionConfigurations(prefersReducedMotion);
                    // Force a layout recalculation after animations initialize
                    ScrollTrigger.refresh();
                }
            });
        }, 300);
    });

    /**
     * Automated Scroll Spy Mapping Engine
     */
    window.addEventListener("scroll", () => {
        let activeId = "";
        const scrollPosition = window.scrollY + 240;

        sections.forEach(section => {
            if (scrollPosition >= section.offsetTop) {
                activeId = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("text-neonCyan", "active");
            link.classList.add("text-gray-400");
            if (link.getAttribute("href") === `#${activeId}`) {
                link.classList.remove("text-gray-400");
                link.classList.add("text-neonCyan", "active");
            }
        });

        // Dynamic Header Transformations
        if (window.scrollY > 50) {
            stickyHeader.classList.add("bg-matte/90", "backdrop-blur-md", "border-borderGray", "h-16");
            stickyHeader.querySelector("div").classList.replace("h-20", "h-16");
        } else {
            stickyHeader.classList.remove("bg-matte/90", "backdrop-blur-md", "border-borderGray", "h-16");
            stickyHeader.querySelector("div").classList.replace("h-16", "h-20");
        }
    });

    // Intercept navigation link click behaviors for Lenis handling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const element = document.querySelector(targetId);
            if (element) {
                e.preventDefault();
                toggleMobileMenu(false);
                if (lenisEngine) {
                    lenisEngine.scrollTo(element, { offset: -70 });
                } else {
                    window.scrollTo({ top: element.offsetTop - 70, behavior: 'smooth' });
                }
            }
        });
    });

    /**
     * Orchestrate Structural Scroll Animation Triggers
     */
    function initializeAnimationSequences() {
        // Clear old triggers to prevent double-firing bugs on resize
        ScrollTrigger.getAll().forEach(t => t.kill());

        // Hero Content Cascades
        gsap.timeline()
            .fromTo(".hero-text-container > *", 
                { y: 30, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" }
            )
            .fromTo(".hero-visual-container", 
                { scale: 0.97, opacity: 0 }, 
                { scale: 1, opacity: 1, duration: 0.7, ease: "power2.out" }, 
                "-=0.4"
            );

        // Ultra-Smooth Dual-Axis Weightless Floating Loop for Code Mockup
        gsap.timeline({ repeat: -1 })
            .to("#floating-mockup", { y: -18, x: 4, rotationZ: 0.8, duration: 3.8, ease: "sine.inOut" })
            .to("#floating-mockup", { y: 0, x: 0, rotationZ: 0, duration: 3.8, ease: "sine.inOut" });

        // Parallax Light Streak Offsets
        gsap.to(".streak-orange", { y: "15vh", scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: 1.2 } });
        gsap.to(".streak-cyan", { y: "-15vh", scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: 1.2 } });

        // Cascading Grid Triggers (FIXED: Using fromTo to prevent opacity getting stuck)
        const triggers = [
            { select: ".services-grid > div", triggerEl: ".services-grid" },
            { select: ".clients-grid > div", triggerEl: ".clients-grid" },
            { select: ".projects-grid > div", triggerEl: ".projects-grid" },
            { select: ".testimonials-grid > div", triggerEl: ".testimonials-grid" },
            { select: ".stats-grid > div", triggerEl: ".stats-grid" },
            { select: ".contact-info-matrix > a", triggerEl: ".contact-info-matrix" }
        ];

        triggers.forEach(cfg => {
            const targets = gsap.utils.toArray(cfg.select);
            const container = document.querySelector(cfg.triggerEl);
            
            if (targets.length === 0 || !container) return;
            
            // Force strict START and END values
            gsap.fromTo(targets, 
                { 
                    y: 40, 
                    opacity: 0 
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: "power2.out",
                    scrollTrigger: { 
                        trigger: container, 
                        start: "top 85%", // Triggers right as the grid enters the viewport
                        toggleActions: "play none none none" 
                    }
                }
            );
        });
    }

    function applyMotionConfigurations(isReduced) {
        if (isReduced) {
            motionToggleBtn.textContent = "SYS.MOTION: MUTED";
            ScrollTrigger.getAll().forEach(t => t.kill());
            gsap.globalTimeline.clear();
            if (lenisEngine) { lenisEngine.destroy(); lenisEngine = null; }
            
            // Safety fallback: if motion is disabled, forcefully reveal everything
            gsap.set(".services-grid > div, .contact-info-matrix > a, .clients-grid > div, .projects-grid > div", { opacity: 1, y: 0 });
        } else {
            motionToggleBtn.textContent = "SYS.MOTION: ACTIVE";
            initializeAnimationSequences();
        }
    }

    motionToggleBtn.addEventListener("click", () => {
        prefersReducedMotion = !prefersReducedMotion;
        applyMotionConfigurations(prefersReducedMotion);
    });

    /**
     * Mobile Menu Layout Controls
     */
    let isMenuOpen = false;
    function toggleMobileMenu(forceState) {
        isMenuOpen = typeof forceState === "boolean" ? forceState : !isMenuOpen;
        menuBtn.setAttribute("aria-expanded", isMenuOpen.toString());
        mobileMenu.setAttribute("aria-hidden", (!isMenuOpen).toString());

        if (isMenuOpen) {
            mobileMenu.classList.remove("hidden");
            menuIconOpen.classList.add("hidden");
            menuIconClose.classList.remove("hidden");
        } else {
            mobileMenu.classList.add("hidden");
            menuIconOpen.classList.remove("hidden");
            menuIconClose.classList.add("hidden");
        }
    }
    menuBtn.addEventListener("click", () => toggleMobileMenu());
    document.querySelectorAll(".mobile-nav-link").forEach(l => l.addEventListener("click", () => toggleMobileMenu(false)));

    /**
     * Modal Interface Handler Rules
     */
    const modal = document.getElementById("project-modal");
    const modalClose = document.getElementById("modal-close");

    document.querySelectorAll(".project-card").forEach(card => {
        card.addEventListener("click", () => {
            document.getElementById("modal-title").textContent = card.getAttribute("data-title");
            document.getElementById("modal-category").textContent = card.querySelector("p").textContent;
            document.getElementById("modal-desc").textContent = card.getAttribute("data-desc");

            const featuresContainer = document.getElementById("modal-features");
            featuresContainer.innerHTML = "";
            card.getAttribute("data-features").split(",").forEach(f => {
                const li = document.createElement("li");
                li.textContent = f.trim();
                featuresContainer.appendChild(li);
            });

            const stackContainer = document.getElementById("modal-stack");
            stackContainer.innerHTML = "";
            card.getAttribute("data-stack").split(",").forEach(s => {
                const span = document.createElement("span");
                span.className = "bg-white/5 border border-borderGray text-gray-400 text-[11px] px-2.5 py-1 rounded font-mono";
                span.textContent = s.trim();
                stackContainer.appendChild(span);
            });

            document.body.classList.add("overflow-hidden-freeze");
            modal.classList.remove("hidden");
            gsap.to(modal, { opacity: 1, duration: 0.2 });
        });
    });

    modalClose.addEventListener("click", () => {
        document.body.classList.remove("overflow-hidden-freeze");
        gsap.to(modal, { opacity: 0, duration: 0.15, onComplete: () => modal.classList.add("hidden") });
    });
});
