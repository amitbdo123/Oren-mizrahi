// פס וואטסאפ קבוע במובייל.
// מופיע כשכפתור ההירו כבר מעל המסך, ונעלם כשמגיעים לאזור שמסומן data-hide-sticky (הקריאה לפעולה בסוף הדף).
(function () {
  var bar = document.querySelector('[data-sticky-cta]');
  var heroCta = document.getElementById('hero-cta');
  if (!bar || !heroCta || !('IntersectionObserver' in window)) return;

  bar.hidden = false;
  bar.inert = true;

  var heroPassed = false;
  var endVisible = false;

  function update() {
    var show = heroPassed && !endVisible;
    bar.classList.toggle('is-visible', show);
    bar.inert = !show;
  }

  new IntersectionObserver(function (entries) {
    var e = entries[0];
    heroPassed = !e.isIntersecting && e.boundingClientRect.top < 0;
    update();
  }).observe(heroCta);

  var ends = document.querySelectorAll('[data-hide-sticky]');
  if (ends.length) {
    var visible = new Set();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) visible.add(e.target); else visible.delete(e.target);
      });
      endVisible = visible.size > 0;
      update();
    });
    ends.forEach(function (el) { io.observe(el); });
  }
})();
