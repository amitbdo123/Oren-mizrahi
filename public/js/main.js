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

// שיחת ההמלצות: ההודעות נכנסות אחת-אחת בגלילה, כל אחת אחרי "מקליד..." קצר.
// בלי JS, או עם "הפחתת תנועה", כל ההודעות מוצגות מיד. הטקסט תמיד זמין לקורא מסך.
(function () {
  var chat = document.querySelector('.chat');
  if (!chat || !('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var msgs = Array.prototype.slice.call(chat.querySelectorAll('[data-msg]'));
  chat.classList.add('chat-live');

  var queue = [];
  var busy = false;

  function next() {
    if (busy || !queue.length) return;
    busy = true;
    var m = queue.shift();
    m.classList.add('is-typing');
    setTimeout(function () {
      m.classList.remove('is-typing');
      m.classList.add('is-shown');
      setTimeout(function () { busy = false; next(); }, 350);
    }, 900);
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      queue.push(e.target);
    });
    queue.sort(function (a, b) { return msgs.indexOf(a) - msgs.indexOf(b); });
    next();
  }, { rootMargin: '0px 0px -12% 0px' });

  msgs.forEach(function (m) { io.observe(m); });
})();
