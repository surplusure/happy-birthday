/* Vue 3 浏览器全局版本；直接打开 index.html，无需 Node.js 或构建工具。 */
(() => {
  'use strict';

  const { createApp, ref, nextTick, onMounted, onUnmounted } = Vue;

  createApp({
    setup() {
      // ref 状态由 HTML 中的插值、:class、:aria-pressed 自动同步。
      const hasWished = ref(false);
      const blowingCandles = ref(false);
      const candlesOut = ref(0);
      const selectedWish = ref('Bahagia');
      const wishChoices = ['Bahagia', 'Sehat', 'Mimpi kecil'];
      const surpriseOpened = ref(false);
      const pickedTulips = ref([]);
      const tulipMessages = ['Dede layak mendapat hari yang hangat.', 'Istirahat juga bagian dari tumbuh.', 'Kak ikut mendukung mimpi kecil dede.', 'Semoga banyak tawa menemani tahun ini.', 'Tetap jadi diri dede sendiri, ya.'];
      let wishTimers = [];
      function openSurprise() { surpriseOpened.value = true; celebrate(); }
      function pickTulip(index) {
        if (pickedTulips.value.includes(index)) return;
        pickedTulips.value = [...pickedTulips.value, index];
        if (pickedTulips.value.length === 5) celebrate();
      }
      const giftOpened = ref(false);
      const giftOpening = ref(false);
      let openingTimer = null;
      const musicPlaying = ref(false);
      const musicUnavailable = ref(false);
      const musicLabel = ref('Putar musik');
      const activeSection = ref('hero');
      const particlesCanvas = ref(null);
      const confettiCanvas = ref(null);
      const clickParticlesCanvas = ref(null);
      const openedNotes = ref([1]);
      const completedPlans = ref([]);
      const navigation = [
        { id: 'hero', label: 'Awal' }, { id: 'letter', label: 'Surat dari Kak' },
        { id: 'about', label: 'Dede Andini' }, { id: 'teen-years', label: 'Masa Remaja' },
        { id: 'wishes', label: 'Doa & Harapan' }, { id: 'little-notes', label: '17 Pesan dari Kak' },
        { id: 'cake', label: 'Kue Ulang Tahun' }, { id: 'birthday-plans', label: 'Hari Istimewa' },
        { id: 'birthday-music', label: 'Musik dari Kak' },
        { id: 'little-surprise', label: 'Hadiah Kecil' }, { id: 'closing', label: 'Penutup' }
      ];
      const birthdayNotes = [
        { id: 1, icon: '🌟', title: 'Dede berharga', text: 'Nilai rapor dan pencapaian bukan ukuran diri dede. Kak menghargai dede apa adanya, termasuk saat dede masih belajar atau sedang kesulitan.' },
        { id: 2, icon: '🌱', title: 'Pelan-pelan juga boleh', text: 'Setiap orang tumbuh dengan kecepatan berbeda. Tidak perlu membandingkan perjalananmu dengan perjalanan orang lain.' },
        { id: 3, icon: '🎨', title: 'Rasa ingin tahumu indah', text: 'Coba warna baru, buku baru, atau hobi kecil yang membuatmu penasaran. Menemukan kesukaanmu sendiri bisa menjadi petualangan yang seru.' },
        { id: 4, icon: '🧸', title: 'Tetap boleh bermain', text: 'Menjadi 17 tidak berarti harus meninggalkan semua hal lucu yang kamu sukai. Tawa dan permainan masih boleh menjadi bagian dari harimu.' },
        { id: 5, icon: '📚', title: 'Belajar, bukan sempurna', text: 'Kesalahan kecil adalah bagian dari belajar. Kamu boleh mencoba lagi, bertanya, dan memahami sesuatu sedikit demi sedikit.' },
        { id: 6, icon: '☀️', title: 'Rayakan hal sederhana', text: 'Lagu yang enak, camilan favorit, atau obrolan yang membuatmu tersenyum. Kebahagiaan tidak selalu harus datang dari hal besar.' },
        { id: 7, icon: '🤝', title: 'Boleh cerita ke kak', text: 'Kalau sesuatu terasa berat, dede boleh cerita ke kak saat siap. Keluarga atau teman yang dipercaya juga bisa membantu. Dede tidak harus memikul semuanya sendirian.' },
        { id: 8, icon: '🦋', title: 'Berani mencoba', text: 'Kamu tidak harus sudah percaya diri sepenuhnya untuk memulai. Kadang keberanian datang setelah satu langkah kecil.' },
        { id: 9, icon: '🌷', title: 'Baik kepada diri sendiri', text: 'Coba berbicara kepada diri dede dengan lembut, seperti kepada sahabat. Kak berharap dede memberi diri sendiri waktu, istirahat, dan pengertian.' },
        { id: 10, icon: '🌙', title: 'Istirahat bukan kalah', text: 'Tidur yang cukup, berhenti sejenak, dan menikmati waktu tenang membantu kamu kembali dengan tenaga baru.' },
        { id: 11, icon: '🎵', title: 'Temukan lagu bahagiamu', text: 'Semoga selalu ada musik, cerita, atau hal kecil yang menemanimu dan membuat hari biasa terasa lebih hangat.' },
        { id: 12, icon: '👭', title: 'Teman yang tulus', text: 'Semoga dede menemukan teman yang mau mendengarkan, menghormati batas dede, dan senang melihat dede menjadi diri sendiri.' },
        { id: 13, icon: '✨', title: 'Mimpimu boleh berubah', text: 'Tidak apa kalau hari ini kamu menyukai sesuatu yang berbeda dari kemarin. Mengenal diri sendiri juga berarti memberi ruang untuk berubah.' },
        { id: 14, icon: '🌈', title: 'Hari buruk akan lewat', text: 'Satu hari yang sulit tidak menentukan seluruh ceritamu. Beri dirimu waktu, cari dukungan, dan mulai lagi saat kamu siap.' },
        { id: 15, icon: '📸', title: 'Simpan momen kecil', text: 'Foto lucu, catatan pendek, atau kenangan bersama keluarga dan teman. Suatu hari, hal sederhana itu mungkin membuat dede tersenyum lagi.' },
        { id: 16, icon: '🎀', title: 'Tidak perlu buru-buru dewasa', text: 'Nikmati masa remajamu. Kamu masih punya ruang untuk bermain, bertanya, belajar, dan menemukan arahmu sendiri.' },
        { id: 17, icon: '🎂', title: 'Hari ini untuk dede', text: 'Selamat ulang tahun, dede! Kak ikut mendoakan usia 17 yang hangat, penuh pengalaman seru, dan banyak cerita yang menyenangkan.' }
      ];
      const birthdayPlans = [
        { id: 'cake', icon: '🍰', title: 'Nikmati sepotong kue', text: 'Atau camilan favoritmu. Yang penting, ada sesuatu yang kamu suka.' },
        { id: 'song', icon: '🎧', title: 'Putar lagu favorit', text: 'Nyanyikan pelan atau ikut menari — nikmati saja momennya.' },
        { id: 'photo', icon: '📸', title: 'Ambil foto yang lucu', text: 'Buat satu kenangan kecil dari ulang tahunmu yang ke-17.' },
        { id: 'together', icon: '🤝', title: 'Luangkan waktu dengan keluarga atau teman', text: 'Obrolan santai, permainan kecil, atau sekadar saling bercerita.' },
        { id: 'dream', icon: '📝', title: 'Tulis satu mimpi kecil', text: 'Sesuatu yang ingin kamu coba atau pelajari, tanpa tekanan harus sempurna.' },
        { id: 'kindness', icon: '🌷', title: 'Ucapkan hal baik untuk dirimu', text: 'Hari ini, beri dirimu satu pujian yang hangat dan jujur.' }
      ];
      function toggleNote(id) {
        openedNotes.value = openedNotes.value.includes(id)
          ? openedNotes.value.filter(noteId => noteId !== id)
          : [...openedNotes.value, id];
      }
      const wishes = [
        { icon: '☀️', title: 'Kebahagiaan', text: 'Kak berharap hari-hari dede dipenuhi tawa yang lepas, kejutan kecil, dan banyak alasan untuk tersenyum.' },
        { icon: '📚', title: 'Mimpi yang Terwujud', text: 'Semoga setiap langkah kecil membawamu semakin dekat pada cita-cita dan hal-hal yang kamu impikan.' },
        { icon: '💪', title: 'Kesehatan', text: 'Semoga kamu selalu sehat, penuh energi, dan punya waktu untuk beristirahat serta merawat diri.' },
        { icon: '🌷', title: 'Dukungan & Persahabatan', text: 'Semoga dede dikelilingi keluarga dan teman yang tulus, mau mendengarkan, dan menghargai dede apa adanya. Kak juga ikut menyemangati.' },
        { icon: '🦋', title: 'Kepercayaan Diri', text: 'Semoga kamu semakin berani mencoba, percaya pada dirimu, dan tumbuh dengan caramu sendiri.' },
        { icon: '🌈', title: 'Petualangan Baru', text: 'Semoga usia 17 membawa pengalaman seru, kesempatan indah, dan kenangan yang ingin kamu simpan selamanya.' }
      ];
      let canvas = null;
      let context = null;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      let confettiFrame = null;
      let audioContext = null;
      let melodyTimer = null;
      let activeNotes = [];
      let musicOperation = 0;
      let sectionObserver = null;
      let backgroundFrame = null;
      let backgroundContext = null;
      let sceneTimer = null;
      let particles = [];
      let lastBackgroundTime = null;
      let clickContext = null;
      let clickFrame = null;
      let clickPieces = [];
      let lastClickTime = null;

      async function finishGiftOpening() {
        if (giftOpened.value) return;
        giftOpened.value = true;
        giftOpening.value = false;
        document.documentElement.classList.remove('gift-locked');
        document.documentElement.classList.add('gift-revealed');
        await nextTick();
        window.scrollTo({ top: 0, behavior: 'instant' });
        document.getElementById('birthday-heading')?.focus({ preventScroll: true });
        window.dispatchEvent(new Event('gift-opened'));
        celebrate();
      }
      function openGift() {
        if (giftOpening.value || giftOpened.value) return;
        giftOpening.value = true;
        openingTimer = window.setTimeout(finishGiftOpening, reducedMotion.matches ? 0 : 1680);
      }
      function onCoverKeyDown(event) {
        if (giftOpened.value) return;
        if (event.key === 'Tab') {
          event.preventDefault();
          document.getElementById('open-gift')?.focus();
        }
        if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End'].includes(event.key)) event.preventDefault();
      }

      // 全页 click 监听：桌面点击、手机点按、控件点击均触发，不拦截原操作。
      function resizeClickCanvas() {
        if (!clickContext) return;
        const scale = Math.min(window.devicePixelRatio || 1, 2);
        clickParticlesCanvas.value.width = Math.round(window.innerWidth * scale);
        clickParticlesCanvas.value.height = Math.round(window.innerHeight * scale);
        clickContext.setTransform(scale, 0, 0, scale, 0, 0);
      }
      function clearClickParticles() {
        if (clickFrame !== null) cancelAnimationFrame(clickFrame);
        clickFrame = null;
        clickPieces = [];
        lastClickTime = null;
        clickContext?.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
      function onPageClick(event) {
        if (!clickContext || reducedMotion.matches) return;
        let x = event.clientX;
        let y = event.clientY;
        // 键盘激活按钮时，粒子从控件中心绽放。
        if (event.detail === 0 && x === 0 && y === 0 && event.target instanceof Element) {
          const bounds = event.target.getBoundingClientRect();
          x = bounds.left + bounds.width / 2;
          y = bounds.top + bounds.height / 2;
        }
        const colors = ['#ff6bc1', '#fbbf24', '#b795ff', '#60a5fa', '#ffffff'];
        const now = performance.now();
        for (let i = 0; i < 28; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 70 + Math.random() * 170;
          clickPieces.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
            born: now, life: 650 + Math.random() * 450, size: 2 + Math.random() * 4,
            color: colors[Math.floor(Math.random() * colors.length)], star: i % 3 === 0,
            rotation: Math.random() * Math.PI, spin: (Math.random() - .5) * 5 });
        }
        // 快速连续点按仍保留多个爆点，同时限制粒子总数。
        clickPieces = clickPieces.slice(-280);
        if (clickFrame === null) {
          lastClickTime = now;
          drawClickParticles(now);
        }
      }
      function drawClickParticles(now) {
        clickFrame = null;
        if (reducedMotion.matches || document.hidden) { clearClickParticles(); return; }
        const delta = Math.min((now - lastClickTime) / 1000, .04);
        lastClickTime = now;
        clickContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
        clickPieces = clickPieces.filter(piece => now - piece.born < piece.life);
        clickPieces.forEach(piece => {
          const progress = (now - piece.born) / piece.life;
          piece.x += piece.vx * delta;
          piece.y += piece.vy * delta;
          piece.vy += 110 * delta;
          piece.rotation += piece.spin * delta;
          const size = piece.size * (1 - progress * .65);
          clickContext.save();
          clickContext.translate(piece.x, piece.y);
          clickContext.rotate(piece.rotation);
          clickContext.globalAlpha = (1 - progress) ** 1.3;
          clickContext.fillStyle = piece.color;
          clickContext.shadowColor = piece.color;
          clickContext.shadowBlur = 7;
          clickContext.beginPath();
          if (piece.star) {
            for (let point = 0; point < 8; point++) {
              const angle = point * Math.PI / 4;
              const radius = point % 2 === 0 ? size * 1.6 : size * .4;
              const px = Math.cos(angle) * radius;
              const py = Math.sin(angle) * radius;
              if (point === 0) clickContext.moveTo(px, py); else clickContext.lineTo(px, py);
            }
            clickContext.closePath();
          } else clickContext.arc(0, 0, size, 0, Math.PI * 2);
          clickContext.fill();
          clickContext.restore();
        });
        if (clickPieces.length) clickFrame = requestAnimationFrame(drawClickParticles);
        else lastClickTime = null;
      }

      // 彩纸只在点击时播放，一次四秒；开启减少动态效果时不播放。
      function celebrate() {
        if (!context || reducedMotion.matches) return;
        if (confettiFrame !== null) cancelAnimationFrame(confettiFrame);
        const width = window.innerWidth;
        const height = window.innerHeight;
        const scale = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(width * scale);
        canvas.height = Math.round(height * scale);
        context.setTransform(scale, 0, 0, scale, 0, 0);
        const colors = ['#e91e8c', '#7c3aed', '#fbbf24', '#ff6bc1', '#60a5fa', '#ffffff'];
        const pieces = Array.from({ length: 130 }, () => ({
          x: Math.random() * width,
          y: -20 - Math.random() * height * .7,
          size: 4 + Math.random() * 5,
          velocity: 100 + Math.random() * 160,
          drift: (Math.random() - .5) * 80,
          rotation: Math.random() * Math.PI,
          spin: (Math.random() - .5) * 7,
          color: colors[Math.floor(Math.random() * colors.length)]
        }));
        let started = null;
        let previous = null;
        function draw(now) {
          if (started === null) started = now;
          const elapsed = now - started;
          const delta = previous === null ? 0 : Math.min((now - previous) / 1000, .04);
          previous = now;
          context.clearRect(0, 0, width, height);
          if (elapsed > 4200 || reducedMotion.matches) {
            confettiFrame = null;
            return;
          }
          context.globalAlpha = Math.min(1, (4200 - elapsed) / 800);
          pieces.forEach(piece => {
            piece.y += piece.velocity * delta;
            piece.x += piece.drift * delta;
            piece.rotation += piece.spin * delta;
            context.save();
            context.translate(piece.x, piece.y);
            context.rotate(piece.rotation);
            context.fillStyle = piece.color;
            context.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * .6);
            context.restore();
          });
          confettiFrame = requestAnimationFrame(draw);
        }
        confettiFrame = requestAnimationFrame(draw);
      }

      function makeWish() {
        if (hasWished.value || blowingCandles.value) return;
        if (reducedMotion.matches) {
          candlesOut.value = 3;
          hasWished.value = true;
          return;
        }
        blowingCandles.value = true;
        [160, 330, 500].forEach((delay, index) => {
          wishTimers.push(window.setTimeout(() => { candlesOut.value = index + 1; }, delay));
        });
        wishTimers.push(window.setTimeout(() => {
          blowingCandles.value = false;
          hasWished.value = true;
          celebrate();
          wishTimers = [];
        }, 850));
      }

      function scrollToSection(id) {
        document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth' });
      }
      function startCelebration() {
        celebrate();
        window.clearTimeout(sceneTimer);
        sceneTimer = window.setTimeout(() => scrollToSection('letter'), reducedMotion.matches ? 0 : 1100);
      }
      function relightCandles() {
        wishTimers.forEach(window.clearTimeout);
        wishTimers = [];
        hasWished.value = false;
        blowingCandles.value = false;
        candlesOut.value = 0;
      }

      // 星空粒子背景：仅绘制点和连接线；隐藏页面时暂停，减少动态时静止。
      function resizeParticles() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const scale = Math.min(window.devicePixelRatio || 1, 2);
        particlesCanvas.value.width = width * scale;
        particlesCanvas.value.height = height * scale;
        backgroundContext.setTransform(scale, 0, 0, scale, 0, 0);
        particles = Array.from({ length: width < 600 ? 20 : 35 }, () => ({
          x: Math.random() * width, y: Math.random() * height,
          size: .7 + Math.random() * 1.8,
          vx: (Math.random() - .5) * 12, vy: (Math.random() - .5) * 12,
          color: ['#cb8ba6', '#d3b8df', '#cfad76', '#eeb5c5'][Math.floor(Math.random() * 4)]
        }));
        if (backgroundFrame === null) drawParticles(performance.now());
      }
      function drawParticles(now) {
        backgroundFrame = null;
        if (!backgroundContext || document.hidden) return;
        const width = window.innerWidth;
        const height = window.innerHeight;
        const delta = lastBackgroundTime === null ? 0 : Math.min((now - lastBackgroundTime) / 1000, .04);
        lastBackgroundTime = now;
        backgroundContext.clearRect(0, 0, width, height);
        particles.forEach(particle => {
          if (!reducedMotion.matches) {
            particle.x += particle.vx * delta;
            particle.y += particle.vy * delta;
            if (particle.x < 0 || particle.x > width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > height) particle.vy *= -1;
          }
          backgroundContext.beginPath();
          backgroundContext.fillStyle = particle.color;
          backgroundContext.globalAlpha = .4;
          backgroundContext.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          backgroundContext.fill();
        });
        backgroundContext.globalAlpha = 1;
        if (!reducedMotion.matches) backgroundFrame = requestAnimationFrame(drawParticles);
      }
      function onMotionChange() {
        if (reducedMotion.matches && blowingCandles.value) {
          wishTimers.forEach(window.clearTimeout);
          wishTimers = [];
          candlesOut.value = 3;
          blowingCandles.value = false;
          hasWished.value = true;
        }
        if (reducedMotion.matches && giftOpening.value) {
          window.clearTimeout(openingTimer);
          finishGiftOpening();
        }
        if (reducedMotion.matches) clearClickParticles();
        if (backgroundFrame !== null) cancelAnimationFrame(backgroundFrame);
        backgroundFrame = null;
        lastBackgroundTime = null;
        drawParticles(performance.now());
      }

      // 本地合成生日旋律。只有主动点击音乐按钮才开始，无外部音频请求。
      // MIDI 音高 + 拍数，可替换为其他旋律。
      const melody = [
        [67, .75], [67, .25], [69, 1], [67, 1], [72, 1], [71, 2],
        [67, .75], [67, .25], [69, 1], [67, 1], [74, 1], [72, 2],
        [67, .75], [67, .25], [79, 1], [76, 1], [72, 1], [71, 1], [69, 2],
        [77, .75], [77, .25], [76, 1], [72, 1], [74, 1], [72, 2]
      ];

      function scheduleMelody() {
        if (!musicPlaying.value || !audioContext) return;
        let time = audioContext.currentTime + .08;
        const beat = .42;
        melody.forEach(([pitch, beats]) => {
          const duration = beats * beat;
          const oscillator = audioContext.createOscillator();
          const gain = audioContext.createGain();
          oscillator.type = 'sine';
          oscillator.frequency.value = 440 * 2 ** ((pitch - 69) / 12);
          gain.gain.setValueAtTime(0, time);
          gain.gain.linearRampToValueAtTime(.12, time + .018);
          gain.gain.exponentialRampToValueAtTime(.001, time + Math.max(.05, duration * .88));
          oscillator.connect(gain);
          gain.connect(audioContext.destination);
          oscillator.start(time);
          oscillator.stop(time + duration);
          activeNotes.push(oscillator);
          oscillator.onended = () => {
            oscillator.disconnect();
            gain.disconnect();
            activeNotes = activeNotes.filter(note => note !== oscillator);
          };
          time += duration;
        });
        melodyTimer = window.setTimeout(scheduleMelody, (time - audioContext.currentTime + 1.5) * 1000);
      }

      function stopMusic() {
        musicOperation += 1;
        musicPlaying.value = false;
        window.clearTimeout(melodyTimer);
        melodyTimer = null;
        activeNotes.forEach(note => { try { note.stop(); } catch { /* 音符可能已经结束。 */ } });
        activeNotes = [];
        musicLabel.value = 'Putar musik';
      }

      async function toggleMusic() {
        if (musicPlaying.value) { stopMusic(); return; }
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) {
          musicLabel.value = 'Musik tidak tersedia';
          musicUnavailable.value = true;
          return;
        }
        const operation = ++musicOperation;
        musicPlaying.value = true;
        musicLabel.value = 'Jeda musik';
        try {
          if (!audioContext) audioContext = new AudioContextClass();
          await audioContext.resume();
          if (!musicPlaying.value || operation !== musicOperation) return;
          scheduleMelody();
        } catch {
          stopMusic();
          musicLabel.value = 'Coba putar lagi';
        }
      }

      function onVisibilityChange() {
        if (document.hidden) {
          stopMusic();
          clearClickParticles();
          if (backgroundFrame !== null) cancelAnimationFrame(backgroundFrame);
          backgroundFrame = null;
        } else if (backgroundFrame === null) {
          lastBackgroundTime = null;
          drawParticles(performance.now());
        }
      }
      onMounted(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
        nextTick(() => document.getElementById('open-gift')?.focus({ preventScroll: true }));
        document.addEventListener('keydown', onCoverKeyDown);
        canvas = confettiCanvas.value;
        context = canvas.getContext('2d');
        clickContext = clickParticlesCanvas.value.getContext('2d');
        resizeClickCanvas();
        backgroundContext = particlesCanvas.value.getContext('2d');
        if (backgroundContext) resizeParticles();
        sectionObserver = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) activeSection.value = entry.target.id;
          });
        }, { rootMargin: '-35% 0px -45% 0px', threshold: 0 });
        document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));
        window.addEventListener('resize', resizeParticles);
        window.addEventListener('resize', resizeClickCanvas);
        document.addEventListener('click', onPageClick, { passive: true });
        reducedMotion.addEventListener('change', onMotionChange);
        document.addEventListener('visibilitychange', onVisibilityChange);
        window.addEventListener('pagehide', stopMusic);
      });
      onUnmounted(() => {
        wishTimers.forEach(window.clearTimeout);
        window.clearTimeout(openingTimer);
        document.documentElement.classList.remove('gift-locked');
        document.removeEventListener('keydown', onCoverKeyDown);
        stopMusic();
        clearClickParticles();
        if (confettiFrame !== null) cancelAnimationFrame(confettiFrame);
        if (backgroundFrame !== null) cancelAnimationFrame(backgroundFrame);
        if (sectionObserver) sectionObserver.disconnect();
        window.clearTimeout(sceneTimer);
        window.removeEventListener('resize', resizeParticles);
        window.removeEventListener('resize', resizeClickCanvas);
        document.removeEventListener('click', onPageClick);
        reducedMotion.removeEventListener('change', onMotionChange);
        if (audioContext) audioContext.close();
        document.removeEventListener('visibilitychange', onVisibilityChange);
        window.removeEventListener('pagehide', stopMusic);
      });

      return {
        blowingCandles, candlesOut, selectedWish, wishChoices,
        surpriseOpened, openSurprise, pickedTulips, pickTulip, tulipMessages,
        giftOpened, giftOpening, openGift,
        hasWished, musicPlaying, musicUnavailable, musicLabel,
        activeSection, navigation, wishes, particlesCanvas, confettiCanvas,
        clickParticlesCanvas, birthdayNotes, openedNotes, toggleNote, birthdayPlans, completedPlans,
        makeWish, relightCandles, scrollToSection, startCelebration, celebrate, toggleMusic
      };
    }
  }).mount('#app');
})();
