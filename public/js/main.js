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
// פתיחה: פרוכת על כל המסך. גוררים ימינה (מגע/עכבר), גוללים, או לוחצים על הכפתור.
// כשהיא נפתחת, האור שמאחוריה מתפשט והאתר עולה דרכו.
// לא מוצגת עם "הפחתת תנועה"/"עצירת אנימציות", או אם כבר נפתחה בביקור הזה (sessionStorage).
// ---------------------------------------------------------------------------
(function () {
  var intro = document.querySelector('[data-intro]');
  if (!intro) return;
  var root = document.documentElement;
  var seen = false;
  try { seen = sessionStorage.getItem('intro-seen') === '1'; } catch (e) {}
  if (!motionOK() || seen) { intro.remove(); return; }

  var curtain = intro.querySelector('[data-intro-curtain]');
  var openBtn = intro.querySelector('[data-intro-open]');
  var others = Array.prototype.filter.call(document.body.children, function (el) { return el !== intro && el.tagName !== 'SCRIPT'; });

  root.classList.add('intro-on');
  others.forEach(function (el) { el.inert = true; });
  curtain.classList.add('is-idle');
  setTimeout(function () { openBtn.focus({ preventScroll: true }); }, 50);

  var opened = false;
  function setDx(px) {
    curtain.style.setProperty('--dx', px + 'px');
    var p = Math.min(px / window.innerWidth, 1);
    intro.style.setProperty('--light', (0.35 + p * 0.65).toFixed(3));
    intro.style.setProperty('--light-scale', (1 + p * 0.5).toFixed(3));
  }

  function open() {
    if (opened) return;
    opened = true;
    curtain.classList.remove('is-idle', 'is-dragging', 'is-settling');
    curtain.classList.add('is-opening');
    setTimeout(function () { intro.classList.add('is-bright'); }, 350);
    setTimeout(function () {
      intro.classList.add('is-done');
      root.classList.remove('intro-on');
      others.forEach(function (el) { el.inert = false; });
      var main = document.getElementById('main');
      if (main) main.focus({ preventScroll: true });
    }, 1150);
    setTimeout(function () { intro.remove(); }, 2400);
    try { sessionStorage.setItem('intro-seen', '1'); } catch (e) {}
  }

  // גרירה
  var startX = 0, dx = 0, dragging = false, lastX = 0, lastT = 0, v = 0;
  curtain.addEventListener('pointerdown', function (e) {
    if (opened || e.target === openBtn) return;
    dragging = true; startX = lastX = e.clientX; lastT = e.timeStamp; dx = 0; v = 0;
    curtain.classList.remove('is-idle', 'is-settling');
    curtain.classList.add('is-dragging');
    curtain.setPointerCapture(e.pointerId);
  });
  curtain.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    dx = Math.max(0, e.clientX - startX);
    var dt = e.timeStamp - lastT;
    if (dt > 0) v = (e.clientX - lastX) / dt;
    lastX = e.clientX; lastT = e.timeStamp;
    setDx(dx);
  });
  function release() {
    if (!dragging) return;
    dragging = false;
    curtain.classList.remove('is-dragging');
    if (dx > window.innerWidth * 0.25 || v > 0.6) { setDx(0); open(); }
    else { curtain.classList.add('is-settling'); setDx(0); }
  }
  curtain.addEventListener('pointerup', release);
  curtain.addEventListener('pointercancel', release);

  // גלילה בגלגלת או במשטח מגע
  var acc = 0, wheelTimer = null;
  intro.addEventListener('wheel', function (e) {
    if (opened) return;
    e.preventDefault();
    curtain.classList.remove('is-idle', 'is-settling');
    acc = Math.max(0, acc + Math.abs(e.deltaY) + Math.abs(e.deltaX));
    setDx(Math.min(acc, window.innerWidth));
    if (acc > window.innerWidth * 0.25) { setDx(0); open(); return; }
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(function () { if (!opened) { acc = 0; curtain.classList.add('is-settling'); setDx(0); } }, 400);
  }, { passive: false });

  // מקלדת
  openBtn.addEventListener('click', open);
  document.addEventListener('keydown', function (e) {
    if (opened) return;
    if (e.key === 'ArrowRight' || e.key === 'Escape' || e.key === 'PageDown' || e.key === ' ' && e.target !== openBtn) { e.preventDefault(); open(); }
  });
})();

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
// שיחת ההמלצות בטלפון של אורן:
// מקליד מיד (שנייה) -> הודעה (2.5) -> מקליד (2) -> הודעה (2.5) -> מקליד (1.5) -> הודעה (2.5) ...
// וכשההודעות נגמרות, השיחה ממשיכה
// ושולחת שוב את אותן הודעות, בלולאה. העותקים החוזרים מוסתרים מקוראי מסך.
// כפתור השהיה/המשך (WCAG 2.2.2). בלי JS או עם "הפחתת תנועה": כל ההודעות מוצגות בלי תנועה.
// ---------------------------------------------------------------------------
(function () {
  var body = document.querySelector('[data-chat-body]');
  var toggle = document.querySelector('[data-chat-toggle]');
  if (!body || !toggle || !('IntersectionObserver' in window)) return;
  if (!motionOK()) return;

  var MSG_HOLD = 2500;     // כל הודעה נשארת שתיים וחצי שניות לפני ההקלדה הבאה
  // משך ההקלדה: הראשונה שנייה, השנייה שתי שניות, ומהשלישית והלאה שנייה וחצי
  function typingFor(n) { return n === 0 ? 1000 : n === 1 ? 2000 : 1500; }
  var MAX_REPEATS = 8;     // כמה עותקים חוזרים נשארים בשיחה לכל היותר

  var list = body.querySelector('.chat-list');
  var msgs = Array.prototype.slice.call(body.querySelectorAll('[data-msg]'));
  var typing = body.querySelector('.chat-typing');
  var label = toggle.querySelector('[data-chat-toggle-label]');
  var phone = body.closest('.phone');

  phone.classList.add('chat-live');
  toggle.hidden = false;

  var i = 0, timer = null, state = 'idle', phase = 'type', repeats = [];

  var LABELS = { idle: 'הפעלת ההודעות', playing: 'השהיית ההודעות', paused: 'המשך ההודעות' };
  function setState(s) {
    state = s;
    toggle.dataset.state = s === 'idle' ? 'paused' : s;
    label.textContent = LABELS[s] || '';
  }

  function toBottom() { body.scrollTo({ top: body.scrollHeight, behavior: 'smooth' }); }

  // ההודעה הבאה: קודם המקוריות, ואחר כך עותקים חוזרים שלהן
  function nextMessage() {
    var n = msgs.length;
    if (i < n) return msgs[i];
    var copy = msgs[i % n].cloneNode(true);
    copy.classList.remove('is-shown');
    copy.removeAttribute('data-msg');
    copy.setAttribute('aria-hidden', 'true');
    list.appendChild(copy);
    repeats.push(copy);
    if (repeats.length > MAX_REPEATS) repeats.shift().remove();
    return copy;
  }

  function tick() {
    if (state !== 'playing') return;
    if (phase === 'type') {     // הקלדה
      typing.classList.add('is-on');
      toBottom();
      phase = 'show';
      timer = setTimeout(tick, typingFor(i));
    } else {                           // הודעה
      typing.classList.remove('is-on');
      var m = nextMessage();
      // מכריחים חישוב כדי שהמעבר יתחיל מהמצב הסגור גם בעותק חדש
      void m.offsetHeight;
      m.classList.add('is-shown');
      setTimeout(toBottom, 60);
      i++;
      phase = 'type';
      timer = setTimeout(tick, MSG_HOLD);
    }
  }

  function play() { setState('playing'); clearTimeout(timer); tick(); }
  function pause() { clearTimeout(timer); typing.classList.remove('is-on'); if (phase === 'show') phase = 'type'; setState('paused'); }

  toggle.addEventListener('click', function () {
    if (state === 'playing') pause(); else play();
  });

  // "עצירת אנימציות" באמצע השיחה: מורידים את העותקים, מציגים את ההודעות המקוריות ועוצרים
  document.addEventListener('a11y:still', function () {
    clearTimeout(timer);
    typing.classList.remove('is-on');
    repeats.forEach(function (r) { r.remove(); });
    msgs.forEach(function (m) { m.classList.add('is-shown'); });
    phone.classList.remove('chat-live');
    toggle.hidden = true;
    state = 'stopped';
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

// ---------------------------------------------------------------------------
// יד לקריאה בתורה בטקסטים הרציפים: מצביעה מלמטה על מילה אחרי מילה, לפי קצב הגלילה.
// היד נמצאת מתחת למילה ולא מכסה אותה. בלי JS, או עם "הפחתת תנועה"/"עצירת אנימציות": אין יד.
// ---------------------------------------------------------------------------
(function () {
  var targets = Array.prototype.slice.call(document.querySelectorAll('[data-yad-text]'));
  if (!targets.length || !motionOK()) return;
  var SVGNS = 'http://www.w3.org/2000/svg';

  function wrapWords(el) {
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) {
      var parts = node.nodeValue.split(/(\s+)/);
      if (parts.length < 2 && !parts[0].trim()) return;
      var frag = document.createDocumentFragment();
      parts.forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
        var span = document.createElement('span');
        span.className = 'yw';
        span.textContent = part;
        frag.appendChild(span);
      });
      node.parentNode.replaceChild(frag, node);
    });
    return Array.prototype.slice.call(el.querySelectorAll('.yw'));
  }

  var items = targets.map(function (el) {
    var words = wrapWords(el);
    el.classList.add('yad-text');
    var svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('class', 'yad-word');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    var use = document.createElementNS(SVGNS, 'use');
    use.setAttribute('href', '#yad-up');
    svg.appendChild(use);
    el.appendChild(svg);
    return { el: el, words: words, svg: svg, idx: -1 };
  });

  function place(item, i) {
    if (item.idx === i) return;
    if (item.idx >= 0) item.words[item.idx].classList.remove('is-cur');
    item.idx = i;
    var w = item.words[i];
    w.classList.add('is-cur');
    var tr = item.el.getBoundingClientRect();
    var wr = w.getBoundingClientRect();
    var x = wr.left + wr.width / 2 - tr.left;
    var y = wr.bottom - tr.top + 1;
    item.svg.style.setProperty('--x', x.toFixed(1) + 'px');
    item.svg.style.setProperty('--y', y.toFixed(1) + 'px');
  }

  function update() {
    var line = window.innerHeight * 0.6;
    // רק פסקה אחת פעילה: זו שקו הקריאה עובר בה כרגע (או האחרונה שהתחילה מעליו)
    var active = null;
    items.forEach(function (item) {
      var r = item.el.getBoundingClientRect();
      if (r.top < line && r.bottom > line - 40) active = item;
    });
    items.forEach(function (item) {
      var on = item === active;
      item.svg.classList.toggle('is-on', on);
      if (!on) { if (item.idx >= 0) { item.words[item.idx].classList.remove('is-cur'); item.idx = -1; } return; }
      var r = item.el.getBoundingClientRect();
      var p = Math.min(Math.max((line - r.top) / (r.height + 20), 0), 0.9999);
      place(item, Math.floor(p * item.words.length));
    });
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(function () { ticking = false; update(); }); }
  }, { passive: true });
  window.addEventListener('resize', function () { items.forEach(function (it) { it.idx = -1; }); update(); });
  document.addEventListener('a11y:still', function () { items.forEach(function (it) { it.svg.remove(); }); });
  update();
})();
