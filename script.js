document.addEventListener("DOMContentLoaded", () => {
    // 1. Scroll Reveal Animations
    const reveals = document.querySelectorAll(".reveal");

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                revealObserver.unobserve(entry.target); // Reveal only once
            }
        });
    }, { 
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px" 
    });

    reveals.forEach((reveal) => {
        revealObserver.observe(reveal);
    });

    // 2. Skill Progress Bar Animation
    const skillBars = document.querySelectorAll('.progress-fill');
    
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const percent = bar.getAttribute('data-percent');
                bar.style.width = percent + '%';
                skillsObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => {
        skillsObserver.observe(bar);
    });

    // 3. Project Card Tilt Hover Effect (Vanilla JS)
    const cards = document.querySelectorAll('.project-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Limit the tilt angle
            const rotateX = ((y - centerY) / centerY) * -4;
            const rotateY = ((x - centerX) / centerX) * 4;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.transition = 'none'; // Disable transition during smooth mousemove
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            card.style.transition = 'transform 0.5s ease'; // Re-enable for smooth reset
        });
        
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.1s ease'; // Smooth entry
        });
    });

    // 4. Button Ripple Effect
    const buttons = document.querySelectorAll('.ripple');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;

            let rippleSpan = document.createElement('span');
            rippleSpan.classList.add('ripple-span');
            rippleSpan.style.left = x + 'px';
            rippleSpan.style.top = y + 'px';
            this.appendChild(rippleSpan);

            setTimeout(() => {
                rippleSpan.remove();
            }, 600);
        });
    });

    // 5. Parallax effect for blobs in Background
    const blobs = document.querySelectorAll('.blob');
    
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        blobs.forEach((blob, index) => {
            // Different speed per blob
            const speed = (index + 1) * 30;
            const xOffset = (window.innerWidth / 2 - e.clientX) / speed;
            const yOffset = (window.innerHeight / 2 - e.clientY) / speed;
            blob.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        });
    });
});
