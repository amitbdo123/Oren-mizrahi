// ---------------------------------------------------------------------------
// רכיב נגישות: גודל טקסט, ניגודיות גבוהה, עצירת אנימציות, הדגשת קישורים, גופן קריא.
// ההגדרות נשמרות ב-localStorage של הגולש בלבד (לא נשלחות לשום מקום).
// ---------------------------------------------------------------------------
(function () {
  var root = document.documentElement;
  var KEY = 'a11y-prefs';
  var prefs = { size: 0, contrast: false, still: false, links: false, font: false };
  try { var saved = JSON.parse(localStorage.getItem(KEY) || 'null'); if (saved) for (var k in prefs) if (k in saved) prefs[k] = saved[k]; } catch (e) {}

  function apply() {
    root.dataset.textSize = prefs.size;
    ['contrast', 'still', 'links', 'font'].forEach(function (k) { root.classList.toggle('a11y-' + k, !!prefs[k]); });
    document.querySelectorAll('[data-a11y-toggle]').forEach(function (b) { b.setAttribute('aria-pressed', prefs[b.dataset.a11yToggle] ? 'true' : 'false'); });
    try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch (e) {}
  }
  apply();

  var tool = document.querySelector('[data-a11y-tool]');
  if (!tool) return;
  var open = tool.querySelector('[data-a11y-open]');
  var panel = tool.querySelector('.a11y-panel');

  function setOpen(v) {
    panel.hidden = !v;
    open.setAttribute('aria-expanded', v ? 'true' : 'false');
    if (v) { var first = panel.querySelector('button'); if (first) first.focus(); }
  }
  open.addEventListener('click', function () { setOpen(panel.hidden); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !panel.hidden) { setOpen(false); open.focus(); }
  });
  document.addEventListener('click', function (e) {
    if (!panel.hidden && !tool.contains(e.target)) setOpen(false);
  });

  tool.querySelectorAll('[data-a11y-size]').forEach(function (b) {
    b.addEventListener('click', function () {
      prefs.size = Math.min(3, Math.max(0, prefs.size + (+b.dataset.a11ySize)));
      apply();
    });
  });
  tool.querySelectorAll('[data-a11y-toggle]').forEach(function (b) {
    b.addEventListener('click', function () {
      var k = b.dataset.a11yToggle;
      prefs[k] = !prefs[k];
      apply();
      if (k === 'still' && prefs.still) document.dispatchEvent(new CustomEvent('a11y:still'));
    });
  });
  tool.querySelector('[data-a11y-reset]').addEventListener('click', function () {
    prefs = { size: 0, contrast: false, still: false, links: false, font: false };
    apply();
  });
})();

// תנועה מותרת? (הגדרת המכשיר + "עצירת אנימציות" ברכיב הנגישות)
function motionOK() {
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
         !document.documentElement.classList.contains('a11y-still');
}

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
// שיחת ההמלצות בטלפון של אורן: "מקליד...", הודעה נכנסת, והשיחה גוללת אליה.
// זמן ההמתנה לכל הודעה לפי האורך שלה, כדי שיהיה זמן לקרוא.
// כפתור השהיה/המשך/שוב (WCAG 2.2.2). גלילה מעל הטלפון לא עוצרת את השיחה.
// בלי JS או עם "הפחתת תנועה": כל ההודעות מוצגות, ואפשר לגלול בתוך הטלפון.
// ---------------------------------------------------------------------------
(function () {
  var body = document.querySelector('[data-chat-body]');
  var toggle = document.querySelector('[data-chat-toggle]');
  if (!body || !toggle || !('IntersectionObserver' in window)) return;
  if (!motionOK()) return;

  var msgs = Array.prototype.slice.call(body.querySelectorAll('[data-msg]'));
  var typing = body.querySelector('.chat-typing');
  var label = toggle.querySelector('[data-chat-toggle-label]');
  var phone = body.closest('.phone');

  phone.classList.add('chat-live');
  toggle.hidden = false;

  var i = 0, timer = null, state = 'idle', phase = 'type';

  var LABELS = { idle: 'הפעלת ההודעות', playing: 'השהיית ההודעות', paused: 'המשך ההודעות', done: 'הצגת ההודעות מההתחלה' };
  function setState(s) {
    state = s;
    toggle.dataset.state = s;
    label.textContent = LABELS[s] || '';
  }

  // כמו בוואטסאפ: גוללים לתחתית. הודעה ארוכה מהמסך? גוללים לתחילתה כדי לקרוא מההתחלה.
  function scrollToEl(el) {
    var bottom = body.scrollHeight - body.clientHeight;
    var top = el.offsetTop - body.offsetTop - 12;
    body.scrollTo({ top: Math.max(Math.min(bottom, top), 0), behavior: 'smooth' });
  }

  function holdFor(m) {
    var n = m.textContent.trim().length;
    return Math.min(Math.max(n * 28, 3200), 7500);
  }

  function tick() {
    if (state !== 'playing') return;
    if (i >= msgs.length) { typing.classList.remove('is-on'); setState('done'); return; }
    if (phase === 'type') {
      typing.classList.add('is-on');
      body.scrollTo({ top: body.scrollHeight, behavior: 'smooth' });
      phase = 'show';
      timer = setTimeout(tick, i === 0 ? 900 : 1300);
    } else {
      typing.classList.remove('is-on');
      var m = msgs[i];
      m.classList.add('is-shown');
      setTimeout(function () { scrollToEl(m); }, 80);
      i++;
      phase = 'type';
      timer = setTimeout(tick, holdFor(m));
    }
  }

  function play() { setState('playing'); clearTimeout(timer); tick(); }
  function pause() { clearTimeout(timer); typing.classList.remove('is-on'); if (phase === 'show') phase = 'type'; setState('paused'); }
  function restart() {
    msgs.forEach(function (m) { m.classList.remove('is-shown'); });
    i = 0; phase = 'type';
    body.scrollTo({ top: 0 });
    play();
  }
  function showAll() { msgs.forEach(function (m) { m.classList.add('is-shown'); }); i = msgs.length; }

  toggle.addEventListener('click', function () {
    if (state === 'idle') play();
    else if (state === 'playing') pause();
    else if (state === 'paused') play();
    else restart();
  });

  // "עצירת אנימציות" באמצע השיחה: מציגים הכול ועוצרים
  document.addEventListener('a11y:still', function () {
    clearTimeout(timer);
    typing.classList.remove('is-on');
    showAll();
    phone.classList.remove('chat-live');
    toggle.hidden = true;
    state = 'done';
  });

  setState('idle');
  new IntersectionObserver(function (entries, obs) {
    if (!entries[0].isIntersecting) return;
    obs.disconnect();
    if (state === 'idle') play();
  }, { threshold: 0.45 }).observe(phone);
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

// ---------------------------------------------------------------------------
// היד לקריאה בתורה: יורדת לאורך השוליים לפי ההתקדמות בדף (מחשב רחב בלבד, ב-CSS).
// ---------------------------------------------------------------------------
(function () {
  var rail = document.querySelector('.yad-rail');
  if (!rail) return;
  var ticking = false;
  function update() {
    ticking = false;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
    rail.style.setProperty('--p', p.toFixed(4));
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
