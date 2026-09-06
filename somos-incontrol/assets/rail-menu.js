/* rail-menu.js — the side rail becomes a Menu button on phones.
   Chris, 2026-09-06: the rail stacks its whole list above the page on a phone, so the
   content he wants starts two screens down. Desktop is untouched — his rule from this
   morning stands there: "No hamburger menu. Have it exposed all the time."
   No dependencies, no build step; every page just loads this file. */
(function () {
  var rail = document.querySelector('.sh-rail, .rail');
  if (!rail) return;

  var btn = document.createElement('button');
  btn.className = 'rail-toggle';
  btn.type = 'button';
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', rail.id || (rail.id = 'site-rail'));
  btn.innerHTML = '<span class="rail-bars" aria-hidden="true"></span>Menu';
  rail.parentNode.insertBefore(btn, rail);

  btn.addEventListener('click', function () {
    var open = rail.classList.toggle('rail-open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  /* Tapping a link closes it, so the page he asked for is what he sees next. */
  rail.addEventListener('click', function (e) {
    if (e.target.closest('a') && window.matchMedia('(max-width: 999px)').matches) {
      rail.classList.remove('rail-open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
})();
