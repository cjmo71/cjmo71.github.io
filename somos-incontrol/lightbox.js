// Screenshot lightbox: click a thumbnail (an <a class="shot"> around an <img>) to enlarge it.
// Click anywhere, press Escape, or use the close button to dismiss. With JS off the link just opens the image.
(function () {
  var shots = document.querySelectorAll('a.shot');
  if (!shots.length) return;

  var box = document.createElement('div');
  box.className = 'lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', 'Enlarged screenshot');
  box.hidden = true;

  var close = document.createElement('button');
  close.type = 'button';
  close.className = 'lightbox-close';
  close.setAttribute('aria-label', 'Close');
  close.innerHTML = '&times;';

  var big = document.createElement('img');
  big.alt = '';

  box.appendChild(close);
  box.appendChild(big);
  document.body.appendChild(box);

  var opener = null;

  function open(link) {
    var thumb = link.querySelector('img');
    big.src = link.href;
    big.alt = thumb ? thumb.alt : '';
    opener = link;
    box.hidden = false;
    document.body.style.overflow = 'hidden';
    close.focus();
  }

  function dismiss() {
    if (box.hidden) return;
    box.hidden = true;
    big.src = '';
    document.body.style.overflow = '';
    if (opener) opener.focus();
    opener = null;
  }

  Array.prototype.forEach.call(shots, function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      open(link);
    });
  });

  box.addEventListener('click', dismiss);

  document.addEventListener('keydown', function (e) {
    if (box.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); dismiss(); }
    else if (e.key === 'Tab') { e.preventDefault(); close.focus(); } // only one control inside: keep focus there
  });
})();
