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

// ---------------------------------------------------------------------------
// מהתיקון לספר התורה: לפי ההתקדמות בגלילה בתוך "איך זה עובד", הפסוק מאבד קודם את
// הטעמים ואחר כך את הניקוד, והצעד המתאים נדלק.
// ---------------------------------------------------------------------------
(function () {
  var section = document.getElementById('how');
  var verse = document.querySelector('[data-verse]');
  if (!section || !verse) return;
  var layers = verse.querySelectorAll('[data-layer]');
  var modes = verse.querySelectorAll('[data-mode]');
  var steps = section.querySelectorAll('.step');
  var current = 0;

  function setStage(n) {
    if (n === current) return;
    current = n;
    layers.forEach(function (l) { l.classList.toggle('is-on', +l.dataset.layer === n); });
    modes.forEach(function (m) { m.classList.toggle('is-on', +m.dataset.mode === n); });
    steps.forEach(function (s, i) { s.classList.toggle('is-active', i === n - 1); });
  }

  function update() {
    var vh = window.innerHeight;
    var vertical = steps.length > 1 && steps[1].getBoundingClientRect().top > steps[0].getBoundingClientRect().bottom - 1;
    if (vertical) {
      // מובייל: הצעד שנמצא כרגע מתחת לפסוק הדביק קובע את השלב
      var line = vh * 0.5;
      var n = 1;
      steps.forEach(function (s, i) { if (s.getBoundingClientRect().top < line) n = i + 1; });
      setStage(n);
    } else {
      // מחשב: הצעדים בשורה אחת, אז השלב נקבע לפי ההתקדמות בגלילה בסקשן
      var r = section.getBoundingClientRect();
      var p = (vh * 0.55 - r.top) / Math.max(r.height - vh * 0.1, 1);
      setStage(p < 0.4 ? 1 : p < 0.68 ? 2 : 3);
    }
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; update(); });
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
