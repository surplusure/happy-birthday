/* Runs directly in the browser after the Vue app mounts. No build tools. */
(() => {
  'use strict';
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hero = document.getElementById('hero');
  const progress = document.querySelector('.reading-progress');
  const atmosphere = document.querySelector('.page-atmosphere');
  const sections = [...document.querySelectorAll('main section[id]')];
  // Purple, pink and gold weights blend between section centers, never at edges.
  const palettes = [[.6, .4, 0], [.35, .65, 0], [.8, .2, 0], [.7, .3, 0],
    [.3, .3, .4], [.25, .7, .05], [.25, .55, .2], [.2, .25, .55], [.4, .5, .1]];
  let anchors = [];
  let pageDistance = 0;
  const items = [];
  let observer = null;
  let frame = null;
  let lastScroll = window.scrollY;
  let fastScrollUntil = 0;

  function reveal(element, delay = 0, instant = false) {
    element.style.setProperty('--scroll-delay', `${delay}ms`);
    if (instant) element.dataset.instant = 'true';
    element.dataset.visible = 'true';
    observer?.unobserve(element);
  }

  function updateScroll() {
    frame = null;
    const position = window.scrollY;
    if (Math.abs(position - lastScroll) > window.innerHeight * .65) {
      fastScrollUntil = performance.now() + 250;
      // Fast jumps and anchor navigation must never leave visible content blank.
      const visibleItems = items.filter(element =>
        element.dataset.visible === 'false' && element.getBoundingClientRect().top < window.innerHeight);
      visibleItems.forEach(element => reveal(element, 0, true));
    }
    lastScroll = position;
    progress?.style.setProperty('--reading-progress', pageDistance > 0 ? Math.min(1, Math.max(0, position / pageDistance)) : 0);
    hero?.style.setProperty('--hero-drift', motionPreference.matches ? '0px' : `${Math.min(position * .055, 36)}px`);
    if (atmosphere && !motionPreference.matches && anchors.length) {
      const center = position + window.innerHeight * .45;
      let index = 0;
      while (index < anchors.length - 2 && center > anchors[index + 1]) index++;
      const blend = Math.min(1, Math.max(0, (center - anchors[index]) / Math.max(1, anchors[index + 1] - anchors[index])));
      const eased = blend * blend * (3 - 2 * blend);
      ['purple', 'pink', 'gold'].forEach((color, channel) => {
        const weight = palettes[index][channel] * (1 - eased) + palettes[index + 1][channel] * eased;
        atmosphere.style.setProperty(`--${color}-weight`, weight.toFixed(4));
      });
    }
  }

  function measureLayout() {
    anchors = sections.map(section => {
      const bounds = section.getBoundingClientRect();
      return bounds.top + window.scrollY + bounds.height * .42;
    });
    pageDistance = document.documentElement.scrollHeight - window.innerHeight;
    requestUpdate();
  }

  function requestUpdate() {
    if (frame === null) frame = requestAnimationFrame(updateScroll);
  }

  function prepareAnimations() {
    observer?.disconnect();
    observer = null;
    if (motionPreference.matches || !('IntersectionObserver' in window)) {
      items.forEach(element => reveal(element, 0, true));
      requestUpdate();
      return;
    }
    observer = new IntersectionObserver(entries => {
      let order = 0;
      entries.filter(entry => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        .forEach(entry => {
          const instant = performance.now() < fastScrollUntil || entry.boundingClientRect.top < 0;
          reveal(entry.target, instant ? 0 : Math.min(order++ * 65, 195), instant);
        });
    }, { threshold: 0, rootMargin: '0px 0px -32px 0px' });
    const positions = items.map(element => element.getBoundingClientRect().top);
    items.forEach((element, index) => {
      // Preserve everything already read, including after preference changes.
      if (element.dataset.visible === 'true') return;
      if (positions[index] < window.innerHeight - 32) {
        reveal(element, 0, true);
      } else {
        element.dataset.visible = 'false';
        observer.observe(element);
      }
    });
    requestUpdate();
  }

  function onFocus(event) {
    // A keyboard user can reach a control before it enters the viewport.
    const element = event.target.closest?.('[data-scroll]');
    if (element) reveal(element, 0, true);
  }

  function addItems(selector, type) {
    document.querySelectorAll(selector).forEach((element, index) => {
      element.dataset.scroll = type;
      if (type === 'card') element.dataset.side = index % 2 ? 'right' : 'left';
      items.push(element);
    });
  }

  addItems('.section-title', 'title');
  addItems('.section-subtitle, .section-intro, .letter-greeting, .letter-body p, .letter-signature, .cake-instruction, .plan-progress', 'text');
  addItems('.profile-card, .teen-card, .wish-card, .birthday-note, .birthday-plan, .cake-container, .closing-card', 'card');
  measureLayout();
  prepareAnimations();
  // Recalculate after fonts load and notes expand, outside the scroll loop.
  if ('ResizeObserver' in window) {
    const layoutObserver = new ResizeObserver(measureLayout);
    layoutObserver.observe(document.querySelector('main'));
  }
  document.fonts?.ready.then(measureLayout);
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', measureLayout, { passive: true });
  window.addEventListener('pageshow', measureLayout);
  window.addEventListener('pagehide', () => {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
  });
  document.addEventListener('focusin', onFocus);
  motionPreference.addEventListener('change', prepareAnimations);
})();
