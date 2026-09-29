/* Starts the page's autoplay videos when they scroll into view.
   Why: Safari (iPhone and Mac) can leave an autoplay video as a blank box with a play button even
   when the tag has autoplay + muted + playsinline. Calling play() ourselves once the video is on
   screen starts it. If play() is refused we try once more, then wait for the first tap.
   Visitors who ask for reduced motion get no autoplay: the video stays on its poster with controls. */
(function () {
  var videos = Array.prototype.slice.call(document.querySelectorAll('video[autoplay]'));
  if (!videos.length) return;

  var reduce = false;
  try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  if (reduce) {
    videos.forEach(function (v) {
      v.removeAttribute('autoplay');
      v.autoplay = false;
      v.controls = true;
      try { v.pause(); } catch (e) {}
    });
    return;
  }

  function begin(v) {
    v.muted = true;                       // Safari wants the property, not just the attribute
    v.setAttribute('playsinline', '');
    var p;
    try { p = v.play(); } catch (e) {}
    return p && typeof p.then === 'function' ? p : Promise.resolve();
  }

  function start(v) {
    begin(v).catch(function () {
      // one retry after a short pause, then give up until the visitor touches the page
      setTimeout(function () {
        begin(v).catch(function () {
          var kick = function () { begin(v).catch(function () {}); };
          window.addEventListener('touchstart', kick, { once: true, passive: true });
          window.addEventListener('click', kick, { once: true });
        });
      }, 400);
    });
  }

  if (!('IntersectionObserver' in window)) { videos.forEach(start); return; }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      io.unobserve(en.target);            // once per video, so a manual pause is never overridden
      start(en.target);
    });
  }, { threshold: 0.25 });
  videos.forEach(function (v) { io.observe(v); });
})();
