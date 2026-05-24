document.addEventListener("DOMContentLoaded", () => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // Initialize systems in order
    initPreloader();
    initWebGLBackground();
    initScrollTriggerAndLenis();
    initCardSpotlightAndTilt();
    initMagneticButtons();
    init3DSkillSphere();
    initSkillBarsAnimation();
    initMobileMenu();
    initParticleBursts();
    initScrollProgressBar();
    initScrollIndicator();
    initSmoothNavLinks();
});

/* ==========================================================================
   0a. Glowing Scroll Progress Bar
   ========================================================================== */
function initScrollProgressBar() {
    const bar = document.getElementById('scroll-progress-bar');
    if (!bar) return;

    function update() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width = pct + '%';
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
}

/* ==========================================================================
   0b. Animated Scroll Indicator (hide after first scroll)
   ========================================================================== */
function initScrollIndicator() {
    const indicator = document.getElementById('scroll-indicator');
    if (!indicator) return;

    let scrolled = false;
    window.addEventListener('scroll', () => {
        if (!scrolled && window.scrollY > 80) {
            scrolled = true;
            indicator.classList.add('hidden');
        }
    }, { passive: true });
}

/* ==========================================================================
   0c. Smooth Anchor Navigation via GSAP ScrollTo
   ========================================================================== */
function initSmoothNavLinks() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const target = document.querySelector(link.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            gsap.to(window, {
                duration: 1.4,
                scrollTo: { y: target, offsetY: 70 },
                ease: "power3.inOut"
            });
        });
    });
}

/* ==========================================================================
   1. Futuristic Preloader & Intro Sequence
   ========================================================================== */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    const progressBar = document.querySelector('.loader-bar');
    const percentEl = document.querySelector('.loader-percentage');
    const termLines = document.querySelectorAll('.term-line');

    if (!preloader) return;

    let progress = 0;
    let lineIndex = 0;

    function showNextTerminalLine() {
        if (lineIndex < termLines.length) {
            termLines[lineIndex].classList.add('active');
            lineIndex++;
            setTimeout(showNextTerminalLine, 400);
        }
    }
    setTimeout(showNextTerminalLine, 150);

    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 8) + 4;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(triggerEntranceAnimation, 300);
        }
        if (progressBar) progressBar.style.width = progress + '%';
        if (percentEl) percentEl.textContent = progress + '%';
    }, 60);
}

function triggerEntranceAnimation() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    gsap.to(preloader, {
        yPercent: -100,
        duration: 1.2,
        ease: "power4.inOut",
        onComplete: () => {
            preloader.style.display = 'none';
            document.body.classList.remove('lenis-stopped');
            ScrollTrigger.refresh();
        }
    });

    gsap.from(".glass-nav", {
        y: -100,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.4
    });

    const tl = gsap.timeline({ delay: 0.6 });
    tl.from("#hero .subtitle", { y: 25, opacity: 0, duration: 0.8, ease: "power3.out" })
      .from("#hero .title", { y: 40, opacity: 0, duration: 1.2, ease: "power3.out" }, "-=0.6")
      .from("#hero .role", { y: 20, opacity: 0, duration: 1, ease: "power2.out" }, "-=0.7")
      .from("#hero .intro", { y: 20, opacity: 0, duration: 1, ease: "power2.out" }, "-=0.8")
      .from("#hero .action-btns .btn", {
          y: 20, opacity: 0, scale: 0.95, duration: 0.8,
          ease: "back.out(1.5)", stagger: 0.15
      }, "-=0.7");

    gsap.from("#hero .profile-pic-container", {
        scale: 0.88, opacity: 0, duration: 1.5, ease: "power3.out", delay: 0.7
    });
}

/* ==========================================================================
   2. Three.js WebGL Interactive Background
   ========================================================================== */
function initWebGLBackground() {
    const canvas = document.querySelector('#webgl-bg');
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020617, 0.018);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 4, 25);

    const particleCount = 1200;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i]     = (Math.random() - 0.5) * 60;
        positions[i + 1] = (Math.random() - 0.5) * 40;
        positions[i + 2] = (Math.random() - 0.5) * 60;
        const isBlue = Math.random() > 0.4;
        colors[i]     = isBlue ? 0.23 : 0.54;
        colors[i + 1] = isBlue ? 0.51 : 0.36;
        colors[i + 2] = isBlue ? 0.96 : 0.96;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
        size: 0.12, vertexColors: true, transparent: true,
        opacity: 0.6, blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    const gridGeo = new THREE.PlaneGeometry(80, 80, 24, 24);
    const gridMat = new THREE.MeshBasicMaterial({
        color: 0x3b82f6, wireframe: true, transparent: true,
        opacity: 0.08, blending: THREE.AdditiveBlending
    });
    const grid = new THREE.Mesh(gridGeo, gridMat);
    grid.rotation.x = -Math.PI / 2;
    grid.position.y = -10;
    scene.add(grid);

    const clock = new THREE.Clock();
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;
    let scrollPercent = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
        mouseY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    });

    window.addEventListener('scroll', () => {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        scrollPercent = docHeight > 0 ? window.scrollY / docHeight : 0;
    });

    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        const posAttr = grid.geometry.attributes.position;
        for (let i = 0; i < posAttr.count; i++) {
            const u = posAttr.getX(i);
            const v = posAttr.getY(i);
            const z = Math.sin(u * 0.12 + elapsedTime * 0.5) * Math.cos(v * 0.12 + elapsedTime * 0.5) * 1.6;
            posAttr.setZ(i, z);
        }
        posAttr.needsUpdate = true;

        particles.rotation.y = elapsedTime * 0.01;
        particles.rotation.x = elapsedTime * 0.003;

        targetX = mouseX * 6;
        targetY = 4 - mouseY * 4;
        camera.position.x += (targetX - camera.position.x) * 0.05;
        camera.position.y += (targetY - camera.position.y) * 0.05;
        camera.position.z = 25 - scrollPercent * 42;

        const colorBlue = new THREE.Color(0x3b82f6);
        const colorViolet = new THREE.Color(0x8b5cf6);
        const lerpColor = new THREE.Color().lerpColors(colorBlue, colorViolet, scrollPercent);
        grid.material.color.copy(lerpColor);

        camera.lookAt(0, -1, -20);
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

/* ==========================================================================
   3. Lenis Smooth Scroll + GSAP ScrollTrigger + Elastic Section Animations
   ========================================================================== */
function initScrollTriggerAndLenis() {

    // ── Lenis smooth scroll setup ──────────────────────────────────────────
    let lenis;
    try {
        lenis = new Lenis({
            duration: 1.4,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true,
            smoothTouch: false
        });

        // Tie Lenis into GSAP's ticker for frame-perfect sync
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);

        // Feed Lenis scroll position into ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);

        ScrollTrigger.scrollerProxy(document.body, {
            scrollTop(value) {
                if (arguments.length) {
                    lenis.scrollTo(value);
                }
                return lenis.scroll;
            },
            getBoundingClientRect() {
                return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
            },
            pinType: document.body.style.transform ? "transform" : "fixed"
        });

    } catch (e) {
        console.warn('Lenis not available, falling back to native scroll.', e);
    }

    // ── Scroll-velocity skew distortion ──────────────────────────────────
    initScrollSkewEffect(lenis);

    // ── Section title elastic pop-in ──────────────────────────────────────
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.fromTo(title,
            { opacity: 0, y: 60, scale: 0.8, skewX: -6 },
            {
                opacity: 1, y: 0, scale: 1, skewX: 0,
                duration: 1.2,
                ease: "elastic.out(1, 0.5)",
                scrollTrigger: {
                    trigger: title,
                    start: "top 88%",
                    toggleActions: "play none none reset"
                }
            }
        );
    });

    // ── Per-section elastic card/element animations ───────────────────────
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const cards = section.querySelectorAll('.glass-card');

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
                toggleActions: "play none none reset",
                onEnter: () => spawnSectionParticles(section),
            }
        });

        if (section.id === 'about') {
            const paragraphs = section.querySelectorAll('.about-card p');

            tl.fromTo(cards,
                { opacity: 0, y: 120, scale: 0.88, rotateX: 12 },
                {
                    opacity: 1, y: 0, scale: 1, rotateX: 0,
                    duration: 1.6, stagger: 0.14,
                    ease: "elastic.out(1, 0.55)"
                }
            );

            if (paragraphs.length > 0) {
                tl.fromTo(paragraphs,
                    { opacity: 0, y: 50, x: -30 },
                    {
                        opacity: 1, y: 0, x: 0,
                        duration: 1.1, stagger: 0.22,
                        ease: "back.out(2.5)"
                    }, "-=1.2"
                );
            }

        } else if (section.id === 'skills') {
            const skillCards = section.querySelectorAll('.skill-card');

            if (skillCards.length > 0) {
                tl.fromTo(skillCards,
                    { opacity: 0, y: 100, scale: 0.85, rotateY: -15 },
                    {
                        opacity: 1, y: 0, scale: 1, rotateY: 0,
                        duration: 1.3, stagger: 0.09,
                        ease: "elastic.out(1.2, 0.5)"
                    }
                );
            }

        } else if (section.id === 'projects') {
            const projCards = section.querySelectorAll('.project-card');

            if (projCards.length > 0) {
                tl.fromTo(projCards,
                    { opacity: 0, y: 160, scale: 0.85, rotateX: 18 },
                    {
                        opacity: 1, y: 0, scale: 1, rotateX: 0,
                        duration: 1.8, stagger: 0.2,
                        ease: "elastic.out(1, 0.42)"
                    }
                );
            }

        } else if (section.id === 'certifications') {
            const certItems = section.querySelectorAll('.cert-item');

            if (certItems.length > 0) {
                tl.fromTo(certItems,
                    { opacity: 0, x: -80, scale: 0.9 },
                    {
                        opacity: 1, x: 0, scale: 1,
                        duration: 1.3, stagger: 0.13,
                        ease: "elastic.out(1, 0.48)"
                    }
                );
            }

        } else if (section.id === 'contact') {
            const contactP = section.querySelector('.contact-card p');
            const socialBtns = section.querySelectorAll('.social-btn');

            tl.fromTo(cards,
                { opacity: 0, y: 120, scale: 0.88 },
                {
                    opacity: 1, y: 0, scale: 1,
                    duration: 1.5,
                    ease: "elastic.out(1, 0.52)"
                }
            );

            if (contactP) {
                tl.fromTo(contactP,
                    { opacity: 0, y: 50 },
                    { opacity: 1, y: 0, duration: 1, ease: "back.out(2.5)" },
                    "-=1.1"
                );
            }

            if (socialBtns.length > 0) {
                tl.fromTo(socialBtns,
                    { opacity: 0, y: 60, scale: 0.75, rotation: -8 },
                    {
                        opacity: 1, y: 0, scale: 1, rotation: 0,
                        duration: 1.1, stagger: 0.13,
                        ease: "elastic.out(1.1, 0.48)"
                    }, "-=0.9"
                );
            }

        } else {
            if (cards.length > 0) {
                tl.fromTo(cards,
                    { opacity: 0, y: 120, scale: 0.9 },
                    {
                        opacity: 1, y: 0, scale: 1,
                        duration: 1.5, stagger: 0.13,
                        ease: "elastic.out(1, 0.5)"
                    }
                );
            }
        }
    });

    // ── Parallax depth for section backgrounds ────────────────────────────
    gsap.utils.toArray('section').forEach((section, i) => {
        const depth = (i % 2 === 0) ? 0.12 : -0.12;
        gsap.to(section, {
            yPercent: depth * 30,
            ease: "none",
            scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.5
            }
        });
    });

    // ── Tech tags pop-in cascade ──────────────────────────────────────────
    gsap.utils.toArray('.tech-tags span').forEach((tag, i) => {
        gsap.fromTo(tag,
            { opacity: 0, scale: 0, rotation: -15 },
            {
                opacity: 1, scale: 1, rotation: 0,
                duration: 0.7,
                ease: "back.out(3)",
                scrollTrigger: {
                    trigger: tag,
                    start: "top 92%",
                    toggleActions: "play none none reset"
                },
                delay: (i % 5) * 0.06
            }
        );
    });

    // ── Certification icon pulse-bounce ───────────────────────────────────
    gsap.utils.toArray('.cert-item i').forEach((icon) => {
        gsap.fromTo(icon,
            { scale: 0, rotation: -30 },
            {
                scale: 1, rotation: 0,
                duration: 0.9,
                ease: "elastic.out(1.4, 0.5)",
                scrollTrigger: {
                    trigger: icon,
                    start: "top 88%",
                    toggleActions: "play none none reset"
                }
            }
        );
    });
}

/* ==========================================================================
   3a. Scroll Velocity Skew Distortion (elastic feel while scrolling)
   ========================================================================== */
function initScrollSkewEffect(lenis) {
    const proxy = { skew: 0 };
    const clamp = gsap.utils.clamp(-12, 12);

    // Create a wrapper around main content
    const mainContent = document.querySelector('body');

    let lastScroll = 0;
    let velocity = 0;

    function onScroll() {
        const currentScroll = window.scrollY;
        velocity = currentScroll - lastScroll;
        lastScroll = currentScroll;

        const skewVal = clamp(velocity * 0.3);

        gsap.to(proxy, {
            skew: skewVal,
            duration: 0.6,
            ease: "power1.out",
            overwrite: true,
            onUpdate: () => {
                // Apply skew to all sections (not body, to avoid layout issues)
                document.querySelectorAll('section, header').forEach(el => {
                    el.style.transform = `skewY(${proxy.skew * 0.18}deg)`;
                });
            }
        });

        // Elastic snap back to 0
        gsap.to(proxy, {
            skew: 0,
            duration: 1.2,
            ease: "elastic.out(1, 0.3)",
            delay: 0.05,
            overwrite: false,
            onUpdate: () => {
                document.querySelectorAll('section, header').forEach(el => {
                    el.style.transform = `skewY(${proxy.skew * 0.18}deg)`;
                });
            }
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // If Lenis is available, use its velocity for smoother effect
    if (lenis) {
        lenis.on('scroll', ({ velocity: v }) => {
            const skewVal = clamp(v * 0.5);
            gsap.to(proxy, {
                skew: skewVal,
                duration: 0.5,
                ease: "power2.out",
                overwrite: true,
                onUpdate: () => {
                    document.querySelectorAll('section, header').forEach(el => {
                        el.style.transform = `skewY(${proxy.skew * 0.15}deg)`;
                    });
                }
            });
            gsap.to(proxy, {
                skew: 0,
                duration: 1.4,
                ease: "elastic.out(1, 0.28)",
                delay: 0.08,
                onUpdate: () => {
                    document.querySelectorAll('section, header').forEach(el => {
                        el.style.transform = `skewY(${proxy.skew * 0.15}deg)`;
                    });
                }
            });
        });
    }
}

/* ==========================================================================
   3b. Particle Burst on Section Entry
   ========================================================================== */
function initParticleBursts() {
    // CSS for burst particles injected once
    const style = document.createElement('style');
    style.textContent = `
        .scroll-particle {
            position: fixed;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            mix-blend-mode: screen;
        }
    `;
    document.head.appendChild(style);
}

function spawnSectionParticles(section) {
    const rect = section.getBoundingClientRect();
    const colors = ['#3b82f6', '#8b5cf6', '#60a5fa', '#a78bfa', '#2dd4bf'];
    const count = 18;

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'scroll-particle';

        // Spawn along the top edge of the section as it enters
        const startX = rect.left + Math.random() * rect.width;
        const startY = window.innerHeight * 0.8;

        particle.style.left = startX + 'px';
        particle.style.top = startY + 'px';
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.width = (4 + Math.random() * 8) + 'px';
        particle.style.height = particle.style.width;

        document.body.appendChild(particle);

        const angle = (Math.random() * 360) * (Math.PI / 180);
        const distance = 80 + Math.random() * 180;

        gsap.fromTo(particle,
            { opacity: 1, scale: 1, x: 0, y: 0 },
            {
                opacity: 0,
                scale: 0,
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance - 60,
                duration: 1.2 + Math.random() * 0.8,
                ease: "power2.out",
                delay: Math.random() * 0.3,
                onComplete: () => particle.remove()
            }
        );
    }
}

/* ==========================================================================
   4. Glassmorphism Card Tilt & Spotlight
   ========================================================================== */
function initCardSpotlightAndTilt() {
    const cards = document.querySelectorAll('.glass-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;

            gsap.to(card, {
                rotateX, rotateY,
                scale: 1.03,
                duration: 0.35,
                ease: "power2.out",
                transformPerspective: 1000,
                overwrite: "auto"
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateX: 0, rotateY: 0, scale: 1,
                duration: 0.8,
                ease: "elastic.out(1, 0.4)",
                transformPerspective: 1000,
                overwrite: "auto"
            });
        });
    });
}

/* ==========================================================================
   5. Interactive Magnetic Buttons
   ========================================================================== */
function initMagneticButtons() {
    const elements = document.querySelectorAll('.btn, .social-btn, .logo, .nav-links a');

    elements.forEach(elem => {
        elem.addEventListener('mousemove', e => {
            const rect = elem.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(elem, {
                x: x * 0.28, y: y * 0.28,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        elem.addEventListener('mouseleave', () => {
            gsap.to(elem, {
                x: 0, y: 0,
                duration: 0.8,
                ease: "elastic.out(1, 0.35)"
            });
        });
    });
}

/* ==========================================================================
   6. Interactive 3D Skill Galaxy (Sphere Tag Cloud)
   ========================================================================== */
function init3DSkillSphere() {
    const canvas = document.getElementById('skills-3d-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    const tags = [
        "Java", "Core Java", "Spring Boot", "JDBC", "Servlets", "JSP", "MySQL",
        "Databases", "HTML5", "CSS3", "JavaScript", "React", "Figma", "UI/UX Design",
        "Prompt Engineering", "LLMs", "AI Tools"
    ];

    let items = [];
    const radius = 135;
    const depth = 300;

    for (let i = 0; i < tags.length; i++) {
        const phi = Math.acos(-1 + (2 * i) / tags.length);
        const theta = Math.sqrt(tags.length * Math.PI) * phi;

        items.push({
            text: tags[i],
            x: radius * Math.cos(theta) * Math.sin(phi),
            y: radius * Math.sin(theta) * Math.sin(phi),
            z: radius * Math.cos(phi),
            color: getSkillColor(tags[i])
        });
    }

    function getSkillColor(name) {
        if (name.includes("Java") || name.includes("Spring") || name.includes("JDBC") || name.includes("Servlet") || name.includes("JSP")) {
            return "rgba(96, 165, 250, ";
        }
        if (name.includes("MySQL") || name.includes("Database") || name.includes("HTML") || name.includes("CSS") || name.includes("JavaScript") || name.includes("React")) {
            return "rgba(45, 212, 191, ";
        }
        return "rgba(167, 139, 250, ";
    }

    let speedX = 0.0035;
    let speedY = 0.0035;
    let isMouseOver = false;

    function resize() {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    resize();
    window.addEventListener('resize', resize);

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left - rect.width / 2;
        const mouseY = e.clientY - rect.top - rect.height / 2;
        speedX = mouseX * 0.00007;
        speedY = -mouseY * 0.00007;
        isMouseOver = true;
    });

    canvas.addEventListener('mouseleave', () => {
        isMouseOver = false;
    });

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const centerX = canvas.width / (2 * window.devicePixelRatio);
        const centerY = canvas.height / (2 * window.devicePixelRatio);

        if (!isMouseOver) {
            speedX += (0.0025 - speedX) * 0.04;
            speedY += (0.0025 - speedY) * 0.04;
        }

        items.forEach(item => {
            const y1 = item.y * Math.cos(speedY) - item.z * Math.sin(speedY);
            const z1 = item.y * Math.sin(speedY) + item.z * Math.cos(speedY);
            const x2 = item.x * Math.cos(speedX) - z1 * Math.sin(speedX);
            const z2 = item.x * Math.sin(speedX) + z1 * Math.cos(speedX);

            item.x = x2;
            item.y = y1;
            item.z = z2;

            const scale = depth / (depth - item.z);
            const sx = item.x * scale + centerX;
            const sy = item.y * scale + centerY;

            const opacity = (item.z + radius) / (2 * radius) * 0.65 + 0.35;
            const size = 11 + scale * 4.5;

            ctx.font = `600 ${size}px 'Outfit', sans-serif`;
            ctx.fillStyle = `${item.color}${opacity})`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            items.forEach(other => {
                if (other !== item) {
                    const dx = item.x - other.x;
                    const dy = item.y - other.y;
                    const dz = item.z - other.z;
                    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                    if (dist < 105) {
                        const lineOpacity = (1 - dist / 105) * 0.06 * opacity;
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(59, 130, 246, ${lineOpacity})`;
                        ctx.lineWidth = 0.5;
                        const osx = other.x * (depth / (depth - other.z)) + centerX;
                        const osy = other.y * (depth / (depth - other.z)) + centerY;
                        ctx.moveTo(sx, sy);
                        ctx.lineTo(osx, osy);
                        ctx.stroke();
                    }
                }
            });

            ctx.fillText(item.text, sx, sy);
        });

        requestAnimationFrame(draw);
    }
    draw();
}

/* ==========================================================================
   7. Skill Energy Bar Loaders
   ========================================================================== */
function initSkillBarsAnimation() {
    const fills = document.querySelectorAll('.progress-fill');

    fills.forEach(fill => {
        const percent = fill.getAttribute('data-percent');

        gsap.fromTo(fill,
            { width: "0%", opacity: 0.5 },
            {
                width: percent + "%",
                opacity: 1,
                duration: 2,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: fill,
                    start: "top 85%",
                    toggleActions: "play none none reset"
                }
            }
        );
    });
}

/* ==========================================================================
   8. Mobile Navigation Toggle
   ========================================================================== */
function initMobileMenu() {
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.querySelector('i').classList.toggle('fa-bars');
            menuToggle.querySelector('i').classList.toggle('fa-xmark');
        });

        document.querySelectorAll('.nav-links li a').forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.querySelector('i').classList.add('fa-bars');
                menuToggle.querySelector('i').classList.remove('fa-xmark');
            });
        });
    }

    initMouseGlow();
}

/* ==========================================================================
   9. Cursor Glow Effect
   ========================================================================== */
function initMouseGlow() {
    const glow = document.createElement('div');
    glow.style.cssText = `
        position: fixed;
        width: 320px;
        height: 320px;
        border-radius: 50%;
        pointer-events: none;
        background: radial-gradient(circle, rgba(59,130,246,0.15), transparent 70%);
        z-index: 0;
        transform: translate(-50%, -50%);
        transition: left 0.08s linear, top 0.08s linear;
        mix-blend-mode: screen;
    `;
    document.body.appendChild(glow);

    document.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });
}
