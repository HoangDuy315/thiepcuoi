/**
 * Main Script - Wedding Invitation
 * Hoang Duy & Thanh Hang
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const envelopeOverlay = document.getElementById('envelope-overlay');
  const envelope3d = document.getElementById('envelope-3d');
  const burstCanvas = document.getElementById('burst-canvas');
  const waxSealBtn = document.getElementById('wax-seal-btn');
  const openEnvelopeText = document.getElementById('open-envelope-text');
  const weddingAudio = document.getElementById('wedding-audio');
  const audioToggleBtn = document.getElementById('audio-toggle-btn');
  const audioIcon = document.getElementById('audio-icon');
  const toastNotice = document.getElementById('toast-notice');
  const toastMessage = document.getElementById('toast-message');

  // ==========================================
  // 1. INTERACTIVE 3D ENVELOPE OPENING & CELEBRATION
  // ==========================================
  let isOpeningEnvelope = false;

  function burstCelebration(originX, originY) {
    if (!burstCanvas) return;
    const ctx = burstCanvas.getContext('2d');
    burstCanvas.width = window.innerWidth;
    burstCanvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#e62030', '#c71d2b', '#ff6b81', '#f5e7a9', '#d4af37', '#ffffff'];

    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.5,
        size: Math.random() * 11 + 7,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        alpha: 1,
        decay: Math.random() * 0.015 + 0.012
      });
    }

    function drawHeart(x, y, size, color, alpha, rotation) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(size / 2, -size / 2, size, 0, 0, size * 1.3);
      ctx.bezierCurveTo(-size, 0, -size / 2, -size / 2, 0, 0);
      ctx.fill();
      ctx.restore();
    }

    let animId;
    function render() {
      ctx.clearRect(0, 0, burstCanvas.width, burstCanvas.height);
      let hasAlive = false;

      for (let p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.14; // gentle gravity
        p.vx *= 0.97;
        p.rotation += p.rotSpeed;
        p.alpha -= p.decay;

        if (p.alpha > 0) {
          hasAlive = true;
          drawHeart(p.x, p.y, p.size, p.color, p.alpha, p.rotation);
        }
      }

      if (hasAlive) {
        animId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, burstCanvas.width, burstCanvas.height);
        cancelAnimationFrame(animId);
      }
    }
    render();
  }

  function openEnvelope() {
    if (!envelopeOverlay || isOpeningEnvelope) return;
    isOpeningEnvelope = true;

    // Calculate center coordinates of wax seal
    let sealX = window.innerWidth / 2;
    let sealY = window.innerHeight / 2;
    if (waxSealBtn) {
      const rect = waxSealBtn.getBoundingClientRect();
      sealX = rect.left + rect.width / 2;
      sealY = rect.top + rect.height / 2;
    }

    // Trigger celebration hearts burst
    burstCelebration(sealX, sealY);

    // Trigger 3D Flap opening and card rising
    if (envelope3d) {
      envelope3d.classList.add('is-opening');
    }

    // Play music immediately
    playMusic();

    // After realistic 3D transition, dissolve overlay smoothly
    setTimeout(() => {
      envelopeOverlay.classList.add('opened');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1100);
  }

  if (waxSealBtn) waxSealBtn.addEventListener('click', openEnvelope);
  if (openEnvelopeText) openEnvelopeText.addEventListener('click', openEnvelope);

  // Music Play / Pause handler
  let isPlaying = false;

  function playMusic() {
    if (!weddingAudio) return;
    weddingAudio.play().then(() => {
      isPlaying = true;
      if (audioToggleBtn) audioToggleBtn.classList.add('playing');
      if (audioIcon) audioIcon.className = 'fa-solid fa-compact-disc';
    }).catch(err => {
      console.log('Autoplay deferred until explicit click:', err);
      isPlaying = false;
    });
  }

  function pauseMusic() {
    if (!weddingAudio) return;
    weddingAudio.pause();
    isPlaying = false;
    if (audioToggleBtn) audioToggleBtn.classList.remove('playing');
    if (audioIcon) audioIcon.className = 'fa-solid fa-volume-xmark';
  }

  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      if (isPlaying) {
        pauseMusic();
        showToast('Đã tạm dừng nhạc nền');
      } else {
        playMusic();
        showToast('Đang phát nhạc cưới');
      }
    });
  }

  // ==========================================
  // 2. REAL-TIME COUNTDOWN TIMER
  // Target: 10:00 AM, Saturday, March 27, 2027 (+07:00 Vietnam Time)
  // ==========================================
  const targetDate = new Date('2027-03-27T10:00:00+07:00').getTime();

  const daysEl = document.getElementById('count-days');
  const hoursEl = document.getElementById('count-hours');
  const minutesEl = document.getElementById('count-minutes');
  const secondsEl = document.getElementById('count-seconds');

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      if (daysEl) daysEl.innerText = '00';
      if (hoursEl) hoursEl.innerText = '00';
      if (minutesEl) minutesEl.innerText = '00';
      if (secondsEl) secondsEl.innerText = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.innerText = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.innerText = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.innerText = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.innerText = String(seconds).padStart(2, '0');
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // ==========================================
  // 3. TOAST NOTIFICATION UTILITY
  // ==========================================
  let toastTimeout;
  function showToast(msg) {
    if (!toastNotice || !toastMessage) return;
    toastMessage.innerText = msg;
    toastNotice.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 2800);
  }

  // ==========================================
  // 4. COPY ADDRESS TO CLIPBOARD
  // ==========================================
  const copyAddressBtn = document.getElementById('copy-address-btn');
  if (copyAddressBtn) {
    copyAddressBtn.addEventListener('click', () => {
      const addressText = 'Nhà hàng Văn Quý, xã Đăk Ơ, Đồng Nai';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(addressText).then(() => {
          showToast('Đã sao chép địa chỉ tiệc cưới!');
        }).catch(() => {
          fallbackCopyText(addressText);
        });
      } else {
        fallbackCopyText(addressText);
      }
    });
  }

  function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      showToast('Đã sao chép địa chỉ tiệc cưới!');
    } catch (err) {
      showToast('Không thể sao chép, vui lòng thử lại.');
    }
    document.body.removeChild(textArea);
  }

  // ==========================================
  // 5. CALENDAR INTEGRATION (GOOGLE & .ICS)
  // ==========================================
  const addToCalendarBtn = document.getElementById('add-calendar-btn');
  if (addToCalendarBtn) {
    addToCalendarBtn.addEventListener('click', () => {
      const title = encodeURIComponent('Lễ Thành Hôn - Hoàng Duy & Thanh Hằng');
      const details = encodeURIComponent('Trân trọng kính mời quý khách đến dự buổi tiệc rượu chung vui cùng gia đình chúng tôi tại Nhà hàng Văn Quý, xã Đăk Ơ, Đồng Nai.');
      const location = encodeURIComponent('Nhà hàng Văn Quý, xã Đăk Ơ, Đồng Nai');
      
      // 2027-03-27 10:00 AM VN Time (UTC: 20270327T030000Z to 20270327T070000Z)
      const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20270327T030000Z/20270327T070000Z&details=${details}&location=${location}`;

      // Detection: on mobile or desktop, open Google Calendar or provide .ics
      const isApple = /iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent);
      if (isApple) {
        downloadIcsFile();
      } else {
        window.open(googleCalUrl, '_blank');
      }
      showToast('Đang thêm sự kiện vào lịch...');
    });
  }

  function downloadIcsFile() {
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//HoangDuy ThanhHang//Wedding Invitation//VI',
      'BEGIN:VEVENT',
      'UID:wedding-hoangduy-thanhhang-2027',
      'DTSTAMP:20261018T000000Z',
      'DTSTART:20270327T030000Z',
      'DTEND:20270327T070000Z',
      'SUMMARY:Lễ Thành Hôn - Hoàng Duy & Thanh Hằng',
      'DESCRIPTION:Buổi tiệc rượu chung vui cùng gia đình tại Nhà hàng Văn Quý, xã Đăk Ơ, Đồng Nai.',
      'LOCATION:Nhà hàng Văn Quý, xã Đăk Ơ, Đồng Nai',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'DamCuoi_HoangDuy_ThanhHang.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // ==========================================
  // 6. PHOTO GALLERY & LIGHTBOX MODAL
  // ==========================================
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let currentGalleryIndex = 0;
  const galleryImages = [];

  galleryItems.forEach((item, index) => {
    const fullSrc = item.getAttribute('data-full');
    galleryImages.push(fullSrc);

    item.addEventListener('click', () => {
      openLightbox(index);
    });
  });

  function openLightbox(index) {
    if (!lightboxModal || !lightboxImg) return;
    currentGalleryIndex = index;
    lightboxImg.src = galleryImages[currentGalleryIndex];
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showNextImage() {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
    lightboxImg.src = galleryImages[currentGalleryIndex];
  }

  function showPrevImage() {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
    lightboxImg.src = galleryImages[currentGalleryIndex];
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', showNextImage);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImage);

  // Close lightbox on clicking backdrop
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'ArrowLeft') showPrevImage();
  });

  // Touch Swipe for Mobile Lightbox
  let touchStartX = 0;
  let touchEndX = 0;

  if (lightboxModal) {
    lightboxModal.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightboxModal.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleGesture();
    }, { passive: true });
  }

  function handleGesture() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      showNextImage(); // Swiped left
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      showPrevImage(); // Swiped right
    }
  }



  // ==========================================
  // 9. SHARE INVITATION LINK
  // ==========================================
  const shareBtn = document.getElementById('share-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      const shareData = {
        title: 'Thiệp Cưới - Hoàng Duy & Thanh Hằng',
        text: 'Trân trọng kính mời bạn đến dự lễ thành hôn của Hoàng Duy & Thanh Hằng vào ngày 27/03/2027!',
        url: window.location.href
      };

      if (navigator.share) {
        navigator.share(shareData).catch(() => {});
      } else {
        fallbackCopyText(window.location.href);
        showToast('Đã sao chép liên kết thiệp cưới!');
      }
    });
  }
});
