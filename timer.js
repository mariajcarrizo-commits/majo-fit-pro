/**
 * MAJO-FIT PRO — Timer Module
 * Reusable 30-second countdown timer with audio alert
 */

(function () {
  'use strict';

  const DURATION = 30;
  const CIRCUMFERENCE = 2 * Math.PI * 54; // radius 54 of the SVG circle

  let time = DURATION;
  let interval = null;
  let running = false;

  // DOM elements (cached after DOMContentLoaded)
  let displayEl, ringEl, beepEl, startBtn, resetBtn;

  function init() {
    displayEl = document.getElementById('timer-display');
    ringEl = document.getElementById('timer-ring-progress');
    beepEl = document.getElementById('beep');
    startBtn = document.getElementById('btn-start');
    resetBtn = document.getElementById('btn-reset');

    if (!displayEl || !startBtn) return;

    // Set initial ring
    if (ringEl) {
      ringEl.style.strokeDasharray = CIRCUMFERENCE;
      ringEl.style.strokeDashoffset = '0';
    }

    startBtn.addEventListener('click', toggle);
    if (resetBtn) resetBtn.addEventListener('click', reset);

    render();
  }

  function toggle() {
    if (running) {
      pause();
    } else {
      start();
    }
  }

  function start() {
    if (time <= 0) {
      time = DURATION;
    }
    running = true;
    startBtn.textContent = 'PAUSE';

    // Preload audio on user gesture (required by mobile browsers)
    if (beepEl) {
      beepEl.load();
    }

    clearInterval(interval);
    interval = setInterval(function () {
      time--;
      render();

      if (time <= 0) {
        clearInterval(interval);
        running = false;
        startBtn.textContent = 'START';
        playBeep();
      }
    }, 1000);
  }

  function pause() {
    clearInterval(interval);
    running = false;
    startBtn.textContent = 'START';
  }

  function reset() {
    clearInterval(interval);
    running = false;
    time = DURATION;
    startBtn.textContent = 'START';
    render();
  }

  function render() {
    // Update number
    displayEl.textContent = time;

    // Update ring progress
    if (ringEl) {
      var progress = (DURATION - time) / DURATION;
      ringEl.style.strokeDashoffset = CIRCUMFERENCE * (1 - progress);
    }

    // Color classes
    displayEl.classList.remove('timer__display--warning', 'timer__display--danger');
    if (time <= 5 && time > 0) {
      displayEl.classList.add('timer__display--danger');
    } else if (time <= 10) {
      displayEl.classList.add('timer__display--warning');
    }
  }

  function playBeep() {
    if (!beepEl) return;
    beepEl.currentTime = 0;
    beepEl.play().catch(function () {
      // Silently fail if autoplay is blocked
    });
  }

  // Init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
