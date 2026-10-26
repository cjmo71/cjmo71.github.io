/* spotlight.js — a soft glow that follows the mouse on every page.
   Chris, 2026-10-26 15:36: "can you add the spotlight effect to every page on our website?
   ... I would want it to be a little tighter of a spotlight though. same brightness."
   His reference (another site, screen recording) is a white radial glow about +7/255 over a
   near-black card, fading to nothing ~150 CSS px from the cursor. This one keeps that peak
   and fades out at 105 px (30% tighter). Light theme: white is invisible on a white page, so
   it uses the accent blue at the same faintness.
   Mouse/trackpad only; off on touch and under reduced motion. One fixed circle moved with a
   transform, so it never repaints or shifts layout, and it never takes a click.
   No dependencies; every page just loads this file. */
(function () {
  var mq = window.matchMedia;
  if (!mq || !mq('(hover: hover) and (pointer: fine)').matches) return;
  if (mq('(prefers-reduced-motion: reduce)').matches) return;

  var R = 105;     // glow radius in CSS px (reference ~150)
  var EASE = 0.35; // share of the remaining distance covered per frame; the reference trails a touch on fast moves

  var css = document.createElement('style');
  css.textContent =
    '.somos-spotlight{position:fixed;left:0;top:0;width:' + 2 * R + 'px;height:' + 2 * R + 'px;' +
    'pointer-events:none;z-index:2147483000;opacity:0;transition:opacity .25s ease;will-change:transform;' +
    'background:radial-gradient(circle closest-side,rgba(255,255,255,.04),rgba(255,255,255,0));}' +
    '.somos-spotlight.on{opacity:1}' +
    '@media (prefers-color-scheme: light){.somos-spotlight{' +
    'background:radial-gradient(circle closest-side,rgba(37,99,235,.06),rgba(37,99,235,0));}}' +
    '@media not all and (hover: hover) and (pointer: fine){.somos-spotlight{display:none}}' +
    '@media (prefers-reduced-motion: reduce){.somos-spotlight{display:none}}';
  document.head.appendChild(css);

  var dot = document.createElement('div');
  dot.className = 'somos-spotlight';
  dot.setAttribute('aria-hidden', 'true');
  document.body.appendChild(dot);

  var tx = 0, ty = 0, x = 0, y = 0, raf = 0, seen = false;

  function frame() {
    x += (tx - x) * EASE;
    y += (ty - y) * EASE;
    if (Math.abs(tx - x) < 0.5 && Math.abs(ty - y) < 0.5) { x = tx; y = ty; raf = 0; }
    else raf = requestAnimationFrame(frame);
    dot.style.transform = 'translate3d(' + (x - R) + 'px,' + (y - R) + 'px,0)';
  }

  document.addEventListener('pointermove', function (e) {
    if (e.pointerType && e.pointerType !== 'mouse') { dot.classList.remove('on'); return; }
    tx = e.clientX; ty = e.clientY;
    if (!seen) { seen = true; x = tx; y = ty; }  // first move: appear under the cursor, don't fly in from the corner
    dot.classList.add('on');
    if (!raf) raf = requestAnimationFrame(frame);
  }, { passive: true });

  document.documentElement.addEventListener('mouseleave', function () { dot.classList.remove('on'); });
})();
