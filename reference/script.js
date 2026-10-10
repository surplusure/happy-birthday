// ========== Preloader ==========
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('preloader').classList.add('hidden');
    }, 2000);
});

// ========== Particles Background ==========
const particlesCanvas = document.getElementById('particles-canvas');
const pCtx = particlesCanvas.getContext('2d');
let particles = [];

function resizeParticlesCanvas() {
    particlesCanvas.width = window.innerWidth;
    particlesCanvas.height = window.innerHeight;
}
resizeParticlesCanvas();
window.addEventListener('resize', resizeParticlesCanvas);

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * particlesCanvas.width;
        this.y = Math.random() * particlesCanvas.height;
        this.size = Math.random() * 3 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.color = ['#e91e8c', '#7c3aed', '#fbbf24', '#f59e0b', '#ec4899', '#a855f7'][Math.floor(Math.random() * 6)];
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > particlesCanvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > particlesCanvas.height) this.speedY *= -1;
    }
    draw() {
        pCtx.beginPath();
        pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        pCtx.fillStyle = this.color;
        pCtx.globalAlpha = this.opacity;
        pCtx.fill();
        pCtx.globalAlpha = 1;
    }
}

// Create particles
for (let i = 0; i < 80; i++) {
    particles.push(new Particle());
}

function animateParticles() {
    pCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                pCtx.beginPath();
                pCtx.strokeStyle = `rgba(233, 30, 140, ${0.05 * (1 - dist / 120)})`;
                pCtx.lineWidth = 0.5;
                pCtx.moveTo(particles[i].x, particles[i].y);
                pCtx.lineTo(particles[j].x, particles[j].y);
                pCtx.stroke();
            }
        }
    }
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ========== Confetti System ==========
const confettiCanvas = document.getElementById('confetti-canvas');
const cCtx = confettiCanvas.getContext('2d');
let confettiPieces = [];
let confettiActive = false;

function resizeConfettiCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}
resizeConfettiCanvas();
window.addEventListener('resize', resizeConfettiCanvas);

class Confetti {
    constructor(x, y) {
        this.x = x || Math.random() * confettiCanvas.width;
        this.y = y || -10;
        this.size = Math.random() * 8 + 4;
        this.speedY = Math.random() * 3 + 2;
        this.speedX = (Math.random() - 0.5) * 4;
        this.rotation = Math.random() * 360;
        this.rotSpeed = (Math.random() - 0.5) * 10;
        this.color = ['#e91e8c', '#7c3aed', '#fbbf24', '#f59e0b', '#ec4899',
                      '#a855f7', '#ff0000', '#ffffff', '#60a5fa', '#34d399'][Math.floor(Math.random() * 10)];
        this.shape = Math.random() > 0.5 ? 'rect' : 'circle';
        this.opacity = 1;
    }
    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotSpeed;
        this.speedY += 0.05;
        this.opacity -= 0.003;
        return this.y < confettiCanvas.height && this.opacity > 0;
    }
    draw() {
        cCtx.save();
        cCtx.translate(this.x, this.y);
        cCtx.rotate((this.rotation * Math.PI) / 180);
        cCtx.globalAlpha = this.opacity;
        cCtx.fillStyle = this.color;
        if (this.shape === 'rect') {
            cCtx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
        } else {
            cCtx.beginPath();
            cCtx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
            cCtx.fill();
        }
        cCtx.restore();
    }
}

function launchConfetti(count = 150) {
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            confettiPieces.push(new Confetti());
        }, Math.random() * 1500);
    }
    if (!confettiActive) {
        confettiActive = true;
        animateConfetti();
    }
}

function launchConfettiFromPoint(x, y, count = 60) {
    for (let i = 0; i < count; i++) {
        const c = new Confetti(x, y);
        c.speedY = -(Math.random() * 8 + 3);
        c.speedX = (Math.random() - 0.5) * 12;
        confettiPieces.push(c);
    }
    if (!confettiActive) {
        confettiActive = true;
        animateConfetti();
    }
}

function animateConfetti() {
    cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiPieces = confettiPieces.filter(c => {
        c.draw();
        return c.update();
    });
    if (confettiPieces.length > 0) {
        requestAnimationFrame(animateConfetti);
    } else {
        confettiActive = false;
    }
}

// ========== Start Celebration ==========
function startCelebration() {
    launchConfetti(200);
    playPopSound();

    // Create firework bursts
    setTimeout(() => createFireworkBurst(), 300);
    setTimeout(() => createFireworkBurst(), 700);
    setTimeout(() => createFireworkBurst(), 1100);

    // Scroll to about section
    setTimeout(() => {
        scrollToSection('about');
    }, 2500);
}

// ========== Cake Interaction ==========
let candlesBlown = false;

function blowCandles() {
    if (candlesBlown) return;
    candlesBlown = true;

    // Blow out flames
    document.getElementById('flame-1').classList.add('blown-out');
    setTimeout(() => document.getElementById('flame-2').classList.add('blown-out'), 200);
    setTimeout(() => document.getElementById('flame-3').classList.add('blown-out'), 400);

    // Show smoke
    setTimeout(() => {
        document.getElementById('smoke-1').classList.add('visible');
        document.getElementById('smoke-2').classList.add('visible');
        document.getElementById('smoke-3').classList.add('visible');
    }, 300);

    // Hide instruction, show message
    document.getElementById('cake-instruction').style.display = 'none';
    setTimeout(() => {
        document.getElementById('cake-message').classList.add('visible');
        launchConfetti(250);
        playPopSound();

        // Multiple firework bursts
        setTimeout(() => createFireworkBurst(), 200);
        setTimeout(() => createFireworkBurst(), 600);
        setTimeout(() => createFireworkBurst(), 1000);
        setTimeout(() => createFireworkBurst(), 1400);
    }, 600);
}

// ========== Firework Burst Effect ==========
function createFireworkBurst() {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * (window.innerHeight * 0.5);
    launchConfettiFromPoint(x, y, 40);
}

// ========== Audio System ==========
let audioContext;
let audioPlaying = false;

function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playPopSound() {
    try {
        initAudio();
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.frequency.setValueAtTime(800, audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.15);
        gain.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.15);
        osc.start(audioContext.currentTime);
        osc.stop(audioContext.currentTime + 0.15);
    } catch (e) {}
}

// Simple melody generator for "Happy Birthday"
const happyBirthdayNotes = [
    { freq: 264, dur: 0.3 }, { freq: 264, dur: 0.15 }, { freq: 297, dur: 0.45 },
    { freq: 264, dur: 0.45 }, { freq: 352, dur: 0.45 }, { freq: 330, dur: 0.9 },
    { freq: 264, dur: 0.3 }, { freq: 264, dur: 0.15 }, { freq: 297, dur: 0.45 },
    { freq: 264, dur: 0.45 }, { freq: 396, dur: 0.45 }, { freq: 352, dur: 0.9 },
    { freq: 264, dur: 0.3 }, { freq: 264, dur: 0.15 }, { freq: 528, dur: 0.45 },
    { freq: 440, dur: 0.45 }, { freq: 352, dur: 0.45 }, { freq: 330, dur: 0.45 }, { freq: 297, dur: 0.9 },
    { freq: 470, dur: 0.3 }, { freq: 470, dur: 0.15 }, { freq: 440, dur: 0.45 },
    { freq: 352, dur: 0.45 }, { freq: 396, dur: 0.45 }, { freq: 352, dur: 0.9 },
];

let melodyTimeout = null;
let melodyPlaying = false;

function playMelody() {
    initAudio();
    if (melodyPlaying) {
        stopMelody();
        return;
    }
    melodyPlaying = true;
    audioPlaying = true;
    document.getElementById('audio-toggle').textContent = '🔊';

    function playLoop() {
        let time = audioContext.currentTime;
        happyBirthdayNotes.forEach(note => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(note.freq, time);
            gain.gain.setValueAtTime(0.15, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + note.dur - 0.02);
            osc.start(time);
            osc.stop(time + note.dur);
            time += note.dur;
        });
        if (melodyPlaying) {
            const totalDur = happyBirthdayNotes.reduce((sum, n) => sum + n.dur, 0);
            melodyTimeout = setTimeout(playLoop, totalDur * 1000 + 500);
        }
    }
    playLoop();
}

function stopMelody() {
    melodyPlaying = false;
    audioPlaying = false;
    document.getElementById('audio-toggle').textContent = '🎵';
    if (melodyTimeout) {
        clearTimeout(melodyTimeout);
        melodyTimeout = null;
    }
}

document.getElementById('audio-toggle').addEventListener('click', () => {
    if (audioPlaying) {
        stopMelody();
    } else {
        playMelody();
    }
});

// ========== Guestbook ==========
const defaultMessages = [
    { name: 'Ibu ❤️', text: 'Selamat ulang tahun anakku sayang! Semoga selalu menjadi anak yang sholehah dan berbakti. Mama sayang kamu! 💕' },
    { name: 'Sahabat Terbaik 👯', text: 'Happy birthday bestie! Terima kasih sudah selalu ada di saat suka maupun duka. Love you so much! 🌸' },
    { name: 'Teman Kantor 🏢', text: 'Selamat ulang tahun Andini! Semoga karirnya semakin cemerlang dan selalu happy di kantor! 🎉' },
];

function renderMessages() {
    const container = document.getElementById('messages-container');
    const stored = JSON.parse(localStorage.getItem('andini-messages') || '[]');
    const allMessages = [...defaultMessages, ...stored];

    container.innerHTML = allMessages.map((m, i) => `
        <div class="message-card" style="animation-delay:${i * 0.1}s">
            <div class="message-sender">💌 ${m.name}</div>
            <div class="message-text">${m.text}</div>
        </div>
    `).join('');
}

function submitMessage(e) {
    e.preventDefault();
    const name = document.getElementById('guest-name').value.trim();
    const message = document.getElementById('guest-message').value.trim();
    if (!name || !message) return;

    const stored = JSON.parse(localStorage.getItem('andini-messages') || '[]');
    stored.push({ name, text: message });
    localStorage.setItem('andini-messages', JSON.stringify(stored));

    // Reset form
    document.getElementById('guest-name').value = '';
    document.getElementById('guest-message').value = '';

    renderMessages();
    playPopSound();

    // Mini celebration for submitting
    const rect = e.target.getBoundingClientRect();
    launchConfettiFromPoint(rect.left + rect.width / 2, rect.top, 30);
}

renderMessages();

// ========== Countdown ==========
function updateCountdown() {
    const now = new Date();
    // Set birthday to October 9 (today's date based on context)
    let birthday = new Date(now.getFullYear(), 9, 9); // Month is 0-indexed, so 9 = October

    // If birthday has passed this year, count to next year
    if (now > birthday) {
        birthday = new Date(now.getFullYear() + 1, 9, 9);
    }

    const diff = birthday - now;

    if (diff <= 0) {
        // It's the birthday!
        document.getElementById('countdown-label').textContent = '🎉 Hari Ini Ulang Tahunmu! 🎉';
        document.getElementById('cd-days').textContent = '🎂';
        document.getElementById('cd-hours').textContent = '🎉';
        document.getElementById('cd-minutes').textContent = '🎊';
        document.getElementById('cd-seconds').textContent = '💖';
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('cd-days').textContent = String(days).padStart(3, '0');
    document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('cd-minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('cd-seconds').textContent = String(seconds).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ========== Scroll Reveal ==========
function handleScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(el => {
        const top = el.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (top < windowHeight - 80) {
            el.classList.add('active');
        }
    });
}
window.addEventListener('scroll', handleScrollReveal);
handleScrollReveal();

// ========== Navigation Dots ==========
function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

function updateNavDots() {
    const sections = document.querySelectorAll('section[id]');
    const dots = document.querySelectorAll('.nav-dot');
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 300) {
            current = section.getAttribute('id');
        }
    });

    dots.forEach(dot => {
        dot.classList.remove('active');
        if (dot.getAttribute('data-section') === current) {
            dot.classList.add('active');
        }
    });
}
window.addEventListener('scroll', updateNavDots);

// ========== Sparkle Cursor Trail ==========
let lastSparkle = 0;
document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastSparkle < 80) return;
    lastSparkle = now;

    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = e.clientX + 'px';
    sparkle.style.top = e.clientY + 'px';
    sparkle.textContent = ['✨', '⭐', '💫', '🌟', '💖'][Math.floor(Math.random() * 5)];
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 800);
});

// ========== Easter Egg: Konami Code ==========
let konamiSequence = [];
const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // up up down down left right left right b a

document.addEventListener('keydown', (e) => {
    konamiSequence.push(e.keyCode);
    if (konamiSequence.length > konamiCode.length) {
        konamiSequence.shift();
    }
    if (konamiSequence.join(',') === konamiCode.join(',')) {
        // Super celebration!
        launchConfetti(500);
        setTimeout(() => createFireworkBurst(), 100);
        setTimeout(() => createFireworkBurst(), 300);
        setTimeout(() => createFireworkBurst(), 500);
        setTimeout(() => createFireworkBurst(), 700);
        setTimeout(() => createFireworkBurst(), 900);
        playMelody();
        konamiSequence = [];
    }
});

// ========== Initial auto confetti after preloader ==========
setTimeout(() => {
    launchConfetti(50);
}, 2500);

// ========== Click anywhere for mini confetti ==========
document.addEventListener('click', (e) => {
    if (e.target.closest('#cake-interactive') || e.target.closest('.btn-celebrate') ||
        e.target.closest('.btn-submit') || e.target.closest('#audio-toggle') ||
        e.target.closest('.nav-dot')) return;

    // Small confetti burst on click
    launchConfettiFromPoint(e.clientX, e.clientY, 8);
});

// ========== Hero name glow animation ==========
const heroName = document.querySelector('.hero-name');
if (heroName) {
    setInterval(() => {
        heroName.style.filter = `drop-shadow(0 0 ${30 + Math.random() * 20}px rgba(233, 30, 140, ${0.3 + Math.random() * 0.2}))`;
    }, 2000);
}
