document.addEventListener('DOMContentLoaded', () => {
    // Header background change on scroll
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '1rem 5%';
            header.style.background = 'rgba(5, 5, 5, 0.95)';
        } else {
            header.style.padding = '1.5rem 5%';
            header.style.background = 'rgba(5, 5, 5, 0.8)';
        }
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.card, .section-title').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        observer.observe(el);
    });

    // Smooth scroll for nav links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    targetEl.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            } else {
                window.location.href = targetId;
            }
        });
    });

    // --- Sine Wave Mouse Trailer ---
    const canvas = document.createElement('canvas');
    canvas.id = 'sine-canvas';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let width, height;
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;
    let points = [];
    const numPoints = 25;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    window.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
    });

    // Initialize points
    for (let i = 0; i < numPoints; i++) {
        points.push({ x: targetX, y: targetY });
    }

    function animateSine() {
        ctx.clearRect(0, 0, width, height);

        // Lerp mouse position for smoothness
        mouseX += (targetX - mouseX) * 0.15;
        mouseY += (targetY - mouseY) * 0.15;

        // Update points (tail follows head)
        points[0].x = mouseX;
        points[0].y = mouseY;

        for (let i = 1; i < numPoints; i++) {
            points[i].x += (points[i - 1].x - points[i].x) * 0.35;
            points[i].y += (points[i - 1].y - points[i].y) * 0.35;
        }

        // Draw sine wave line with fading trail
        for (let i = 1; i < numPoints; i++) {
            ctx.beginPath();

            // Fading color and narrowing width
            const ratio = 1 - (i / numPoints);
            const alpha = ratio * 0.8;
            const weight = ratio * 10; // Narrowing towards tail

            ctx.strokeStyle = `rgba(135, 206, 235, ${alpha})`; // Pastel Sky Blue
            ctx.shadowBlur = 15 * ratio;
            ctx.shadowColor = `rgba(135, 206, 235, ${alpha})`;
            ctx.lineWidth = weight;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            const time = Date.now() * 0.005;
            const wave = Math.sin(i * 0.4 + time) * (50 * (i / numPoints));

            const xc = (points[i].x + points[i - 1].x) / 2;
            const yc = (points[i].y + points[i - 1].y) / 2 + wave;

            ctx.moveTo(points[i - 1].x, points[i - 1].y);
            ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
            ctx.stroke();
        }

        requestAnimationFrame(animateSine);
    }

    animateSine();

    // --- AFC Sound Expansion Simulation (The Elastic Room) ---
    const afcSlider = document.getElementById('afc-slider');
    const rtValue = document.getElementById('rt-value');
    const roomMode = document.getElementById('room-mode');
    const demoCanvas = document.getElementById('afc-demo-canvas');
    if (demoCanvas) {
        const dctx = demoCanvas.getContext('2d');
        let dWidth, dHeight;
        let ripples = [];

        function resizeDemo() {
            dWidth = demoCanvas.width = demoCanvas.parentElement.offsetWidth;
            dHeight = demoCanvas.height = demoCanvas.parentElement.offsetHeight;
        }
        window.addEventListener('resize', resizeDemo);
        resizeDemo();

        afcSlider.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            rtValue.textContent = val.toFixed(1) + 's';

            if (val < 1.0) roomMode.textContent = 'DRY / SPEECH MODE';
            else if (val < 2.5) roomMode.textContent = 'CONCERT HALL MODE';
            else roomMode.textContent = 'CATHEDRAL / LARGE HALL MODE';
        });

        function drawSimulation() {
            dctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            dctx.fillRect(0, 0, dWidth, dHeight);

            const rt = parseFloat(afcSlider.value);
            const roomScale = 0.4 + (rt / 6);

            // Draw 3D-like Wireframe Room
            dctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
            dctx.lineWidth = 1;
            const centerX = dWidth / 2;
            const centerY = dHeight / 2;
            const rw = dWidth * 0.7 * roomScale;
            const rh = dHeight * 0.7 * roomScale;

            // Center box
            dctx.strokeRect(centerX - rw / 2, centerY - rh / 2, rw, rh);

            // Perspective lines
            dctx.beginPath();
            dctx.moveTo(0, 0); dctx.lineTo(centerX - rw / 2, centerY - rh / 2);
            dctx.moveTo(dWidth, 0); dctx.lineTo(centerX + rw / 2, centerY - rh / 2);
            dctx.moveTo(0, dHeight); dctx.lineTo(centerX - rw / 2, centerY + rh / 2);
            dctx.moveTo(dWidth, dHeight); dctx.lineTo(centerX + rw / 2, centerY + rh / 2);
            dctx.stroke();

            // Random sound ripples based on RT
            if (Math.random() < rt * 0.05) {
                ripples.push({
                    x: centerX + (Math.random() - 0.5) * rw * 0.3,
                    y: centerY + (Math.random() - 0.5) * rh * 0.3,
                    r: 0,
                    opacity: 0.8
                });
            }

            for (let i = ripples.length - 1; i >= 0; i--) {
                const rip = ripples[i];
                rip.r += 1.5;
                rip.opacity -= (0.005 / rt);

                dctx.beginPath();
                dctx.strokeStyle = `rgba(135, 206, 235, ${rip.opacity})`; // Match pastel sky blue
                dctx.arc(rip.x, rip.y, rip.r, 0, Math.PI * 2);
                dctx.stroke();

                if (rip.opacity <= 0) ripples.splice(i, 1);
            }

            requestAnimationFrame(drawSimulation);
        }
        drawSimulation();
    }

});

// Load YouTube Video Inline
function loadVideo(container, videoId) {
    container.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1" 
        title="YouTube video player" frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        allowfullscreen></iframe>`;
    container.classList.add('playing');
}

function loadLocalVideo(container, videoPath) {
    container.innerHTML = `<video src="${videoPath}" autoplay muted loop playsinline controls style="width: 100%; height: 100%; object-fit: cover;"></video>`;
    container.classList.add('playing');
}

// Product Page Hero Slideshow
if (document.querySelector('.product-hero')) {
    const hero = document.querySelector('.product-hero');
    const images = [
        'url("assets/products/ghost.png")',
        'url("assets/products/ghost1.jpg")',
        'url("assets/products/ghost2.jpg")',
        'url("assets/products/ghost3.jpg")'
    ];
    let currentIndex = 0;

    // Preload images
    images.forEach(imgUrl => {
        const img = new Image();
        img.src = imgUrl.replace('url("', '').replace('")', '');
    });

    setInterval(() => {
        currentIndex = (currentIndex + 1) % images.length;
        hero.style.backgroundImage = `linear-gradient(rgba(5, 5, 5, 0.3), rgba(5, 5, 5, 0.3)), ${images[currentIndex]}`;
    }, 5000);
}
