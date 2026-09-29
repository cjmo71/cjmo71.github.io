/* Live top three of the music-services poll: counts only, straight from the forms worker, so the
   bars move the moment someone answers. Used by polls.html and (after voting) music-services.html.
   somosPollTop(barsEl, totalEl, onShow) fills the bars and calls onShow() if there is anything to
   show; stays silent if the worker is unreachable. */
function somosPollTop(barsEl, totalEl, onShow) {
  fetch('https://somos-forms.somos-poll.workers.dev/tally?form=music-services')
    .then(function (r) { return r.json() })
    .then(function (d) {
      if (!d.names || !d.names.length) return;
      var max = d.names[0].n;
      d.names.forEach(function (x) {
        var row = document.createElement('div'); row.className = 'poll-bar';
        var label = document.createElement('div'); label.className = 'poll-bar-label';
        var name = document.createElement('span'); name.textContent = x.name;
        var n = document.createElement('span'); n.textContent = x.n + (x.n === 1 ? ' vote' : ' votes');
        label.appendChild(name); label.appendChild(n);
        var track = document.createElement('div'); track.className = 'poll-bar-track';
        var fill = document.createElement('div'); fill.className = 'poll-bar-fill';
        fill.style.width = Math.round(100 * x.n / max) + '%';
        track.appendChild(fill); row.appendChild(label); row.appendChild(track); barsEl.appendChild(row);
      });
      totalEl.textContent = d.total_submissions + ' people have answered. Ties at third place are all shown.';
      if (onShow) onShow();
    })
    .catch(function () {});
}
