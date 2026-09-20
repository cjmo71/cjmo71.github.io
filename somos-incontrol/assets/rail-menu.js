/* rail-menu.js — the side rail becomes a Menu button on phones.
   Chris, 2026-09-06: the rail stacks its whole list above the page on a phone, so the
   content he wants starts two screens down. Desktop is untouched — his rule from this
   morning stands there: "No hamburger menu. Have it exposed all the time."
   Chris, 2026-09-20 03:20: "make the side menu on the mobile site stay on screen so they
   don't have to scroll all the way up" — the Menu button now lives in a slim bar that is
   position: sticky at the top of the phone viewport, and the rail opens as a drawer over
   the page (closes on a tap outside, on a link, on Escape, or on the × in the drawer).
   No dependencies, no build step; every page just loads this file. */
(function () {
  var rail = document.querySelector('.sh-rail, .rail');
  if (!rail) return;

  var phone = window.matchMedia('(max-width: 999px)');
  rail.id = rail.id || 'site-rail';

  /* The slim sticky bar: Menu on the left, the page's own beta CTA on the right so the
     one link the header used to keep on screen is still one tap away. */
  var bar = document.createElement('div');
  bar.className = 'rail-bar';

  var btn = document.createElement('button');
  btn.className = 'rail-toggle';
  btn.type = 'button';
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', rail.id);
  btn.innerHTML = '<span class="rail-bars" aria-hidden="true"></span>Menu';
  bar.appendChild(btn);

  var railCta = rail.querySelector('a.btn.primary, a.sh-cta');
  if (railCta) {
    var cta = document.createElement('a');
    cta.className = 'rail-bar-cta';
    cta.href = railCta.href;
    if (railCta.target) cta.target = railCta.target;
    if (railCta.rel) cta.rel = railCta.rel;
    cta.textContent = railCta.textContent.trim();
    bar.appendChild(cta);
    /* Only once the page header (which carries the same button) has scrolled away —
       otherwise the top of the page shows the CTA twice, one under the other. */
    var header = document.querySelector('.top, .sh-top');
    if (header && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        bar.classList.toggle('rail-bar-stuck', !entries[0].isIntersecting);
      }).observe(header);
    } else {
      bar.classList.add('rail-bar-stuck');
    }
  }

  /* Dimmed page behind the open drawer; a tap on it closes the menu. */
  var backdrop = document.createElement('div');
  backdrop.className = 'rail-backdrop';
  backdrop.setAttribute('aria-hidden', 'true');

  /* An explicit × inside the drawer, phones only (CSS hides it on desktop). */
  var close = document.createElement('button');
  close.className = 'rail-close';
  close.type = 'button';
  close.setAttribute('aria-label', 'Close menu');
  close.innerHTML = '&times;';

  rail.parentNode.insertBefore(bar, rail);
  rail.parentNode.insertBefore(backdrop, rail);
  rail.insertBefore(close, rail.firstChild);

  function setOpen(open) {
    rail.classList.toggle('rail-open', open);
    backdrop.classList.toggle('rail-open', open);
    document.documentElement.classList.toggle('rail-locked', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) rail.scrollTop = 0;
  }

  btn.addEventListener('click', function () {
    setOpen(!rail.classList.contains('rail-open'));
  });
  backdrop.addEventListener('click', function () { setOpen(false); });
  close.addEventListener('click', function () { setOpen(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && rail.classList.contains('rail-open')) setOpen(false);
  });

  /* Tapping a link closes it, so the page he asked for is what he sees next. */
  rail.addEventListener('click', function (e) {
    if (e.target.closest('a') && phone.matches) setOpen(false);
  });

  /* Rotating a tablet past the breakpoint must not leave a drawer state on the desktop rail. */
  var onChange = function (m) { if (!m.matches) setOpen(false); };
  if (phone.addEventListener) phone.addEventListener('change', onChange);
  else if (phone.addListener) phone.addListener(onChange);
})();
