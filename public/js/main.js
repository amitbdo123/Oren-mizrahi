// ---------------------------------------------------------------------------
// כפתור וואטסאפ קבוע: פס תחתון במובייל, פס עליון במחשב.
// מופיעים כשכפתור ההירו כבר מעל המסך, ונעלמים כשמגיעים לאזור data-hide-sticky.
// ---------------------------------------------------------------------------
(function () {
  var bars = document.querySelectorAll('[data-sticky-cta], [data-topbar]');
  var heroCta = document.getElementById('hero-cta');
  if (!bars.length || !heroCta || !('IntersectionObserver' in window)) return;

  bars.forEach(function (bar) { bar.hidden = false; bar.inert = true; });

  var heroPassed = false;
  var endVisible = false;

  function update() {
    var show = heroPassed && !endVisible;
    bars.forEach(function (bar) {
      bar.classList.toggle('is-visible', show);
      bar.inert = !show;
    });
  }

  new IntersectionObserver(function (entries) {
    var e = entries[0];
    heroPassed = !e.isIntersecting && e.boundingClientRect.top < 0;
    update();
  }).observe(heroCta);

  var ends = document.querySelectorAll('[data-hide-sticky]');
  var visible = new Set();
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) visible.add(e.target); else visible.delete(e.target);
    });
    endVisible = visible.size > 0;
    update();
  });
  ends.forEach(function (el) { io.observe(el); });
})();

// ---------------------------------------------------------------------------
// שיחת ההמלצות: ההודעות נכנסות לפי הסדר, עם "מקליד..." קצר רק לשתי הראשונות.
// אף פעם לא נשאר חלל ריק: הודעה שכבר נכנסה עמוק למסך (או שגללו מעבר לה) מוצגת מיד.
// בלי JS, או עם "הפחתת תנועה", כל ההודעות מוצגות מההתחלה. הטקסט תמיד זמין לקורא מסך.
// ---------------------------------------------------------------------------
(function () {
  var chat = document.querySelector('.chat');
  if (!chat || !('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var msgs = Array.prototype.slice.call(chat.querySelectorAll('[data-msg]'));
  chat.classList.add('chat-live');

  var started = false;
  var cursor = 0;      // ההודעה הבאה בתור
  var timer = null;

  function show(m) {
    m.classList.remove('is-typing');
    m.classList.add('is-shown');
  }

  function step() {
    if (cursor >= msgs.length) return;
    var m = msgs[cursor];
    if (m.classList.contains('is-shown')) { cursor++; step(); return; }
    var typing = cursor < 2;
    if (typing) m.classList.add('is-typing');
    timer = setTimeout(function () {
      show(m);
      cursor++;
      timer = setTimeout(step, typing ? 180 : 140);
    }, typing ? 520 : 220);
  }

  // רשת ביטחון: כל מה שכבר עמוק במסך או מעליו מוצג מיד, לפי הסדר
  function catchUp() {
    var limit = window.innerHeight * 0.75;
    for (var i = 0; i < msgs.length; i++) {
      var r = msgs[i].getBoundingClientRect();
      if (r.top < limit) {
        for (var j = 0; j <= i; j++) show(msgs[j]);
        if (cursor <= i) { cursor = i + 1; clearTimeout(timer); step(); }
      }
    }
  }

  new IntersectionObserver(function (entries, obs) {
    if (!entries[0].isIntersecting || started) return;
    started = true;
    obs.disconnect();
    step();
    catchUp();
  }, { rootMargin: '0px 0px 15% 0px' }).observe(chat);

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking || !started) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; catchUp(); });
  }, { passive: true });
  window.addEventListener('pageshow', function () { if (started) catchUp(); });
})();
