// ---------------------------------------------------------------------------
// רכיב נגישות: גודל טקסט, ניגודיות גבוהה, עצירת אנימציות, הדגשת קישורים, גופן קריא.
// ההגדרות נשמרות ב-localStorage של הגולש בלבד (לא נשלחות לשום מקום).
// ---------------------------------------------------------------------------
(function () {
  var root = document.documentElement;
  var KEY = 'a11y-prefs';
  var prefs = { size: 0, contrast: false, still: false, links: false, font: false };
  try {
    var saved = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (saved && typeof saved === 'object') {
      prefs.size = Math.min(3, Math.max(0, parseInt(saved.size, 10) || 0));
      ['contrast', 'still', 'links', 'font'].forEach(function (k) { prefs[k] = !!saved[k]; });
    }
  } catch (e) {}

  function apply() {
    root.dataset.textSize = prefs.size;
    ['contrast', 'still', 'links', 'font'].forEach(function (k) { root.classList.toggle('a11y-' + k, !!prefs[k]); });
    document.querySelectorAll('[data-a11y-toggle]').forEach(function (b) { b.setAttribute('aria-pressed', prefs[b.dataset.a11yToggle] ? 'true' : 'false'); });
  }
  // שומרים בדפדפן רק כשהגולש משנה הגדרה
  function save() { try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch (e) {} }
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
  tool.addEventListener('focusout', function (e) {
    if (!panel.hidden && e.relatedTarget && !tool.contains(e.relatedTarget)) setOpen(false);
  });

  tool.querySelectorAll('[data-a11y-size]').forEach(function (b) {
    b.addEventListener('click', function () {
      prefs.size = Math.min(3, Math.max(0, prefs.size + (+b.dataset.a11ySize)));
      apply(); save();
    });
  });
  tool.querySelectorAll('[data-a11y-toggle]').forEach(function (b) {
    b.addEventListener('click', function () {
      var k = b.dataset.a11yToggle;
      prefs[k] = !prefs[k];
      apply(); save();
      if (k === 'still' && prefs.still) document.dispatchEvent(new CustomEvent('a11y:still'));
    });
  });
  tool.querySelector('[data-a11y-reset]').addEventListener('click', function () {
    prefs = { size: 0, contrast: false, still: false, links: false, font: false };
    apply();
    try { localStorage.removeItem(KEY); } catch (e) {}
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
// לא מוצגת עם "הפחתת תנועה"/"עצירת אנימציות", אם כבר נפתחה בביקור הזה (sessionStorage),
// או למי שהגיע מאתר אחר (למשל מתוצאות החיפוש בגוגל).
// ---------------------------------------------------------------------------
(function () {
  var intro = document.querySelector('[data-intro]');
  if (!intro) return;
  var root = document.documentElement;
  var seen = false;
  try { seen = sessionStorage.getItem('intro-seen') === '1'; } catch (e) {}
  // מי שמגיע מגוגל או מאתר אחר נכנס ישר לתוכן (גוגל רואה בשכבה חוסמת אות שלילי).
  // מי שמגיע מקישור בוואטסאפ, הקלדה ישירה או מתוך האתר עצמו רואה את הפרוכת.
  var external = false;
  try { external = !!document.referrer && new URL(document.referrer).origin !== location.origin; } catch (e) {}
  if (!motionOK() || seen || external) { intro.remove(); return; }

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
    curtain.classList.remove('is-idle', 'is-dragging', 'is-settling', 'is-wheeling');
    curtain.classList.add('is-opening');
    // ממשיכים מהמקום שאליו הפרוכת כבר נגררה/נגללה, בלי לחזור להתחלה
    void curtain.offsetWidth;
    setDx(window.innerWidth * 1.15);
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
    if (dx > window.innerWidth * 0.25 || v > 0.6) { open(); }
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
    curtain.classList.add('is-wheeling');
    acc = Math.max(0, acc + Math.abs(e.deltaY) + Math.abs(e.deltaX));
    setDx(Math.min(acc, window.innerWidth));
    if (acc > window.innerWidth * 0.25) { open(); return; }
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(function () { if (!opened) { acc = 0; curtain.classList.remove('is-wheeling'); curtain.classList.add('is-settling'); setDx(0); } }, 400);
  }, { passive: false });

  // מקלדת
  openBtn.addEventListener('click', open);
  function onKey(e) {
    if (opened) { document.removeEventListener('keydown', onKey); return; }
    if (e.key === 'Tab') { e.preventDefault(); openBtn.focus(); return; }   // הפוקוס נשאר בתוך הפרוכת
    if (['ArrowRight', 'Escape', 'Enter', 'PageDown', ' '].indexOf(e.key) !== -1 && e.target !== openBtn) { e.preventDefault(); open(); }
  }
  document.addEventListener('keydown', onKey);
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
  // מי שנכנס לאזור ההודעות במקלדת כדי לקרוא: עוצרים, כדי שהשיחה לא תגלול לו מתחת לידיים
  body.addEventListener('focusin', function () { if (state === 'playing') pause(); });
  // במחשב (עכבר): כשהעכבר מעל הטלפון השיחה עוצרת כדי שאפשר יהיה לקרוא, וממשיכה כשהוא יוצא.
  // במובייל אין ריחוף, ולכן ההתנהגות שם לא משתנה.
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var hoverPaused = false;
    phone.addEventListener('mouseenter', function () { if (state === 'playing') { pause(); hoverPaused = true; } });
    phone.addEventListener('mouseleave', function () { if (hoverPaused && state === 'paused') play(); hoverPaused = false; });
    toggle.addEventListener('click', function () { hoverPaused = false; });
  }

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
  var root = document.documentElement;
  var current = 0;

  function setStage(n) {
    if (n === current) return;
    current = n;
    layers.forEach(function (l) { l.classList.toggle('is-on', +l.dataset.layer === n); });
    modes.forEach(function (m) { m.classList.toggle('is-on', +m.dataset.mode === n); });
    steps.forEach(function (s, i) { s.classList.toggle('is-active', i === n - 1); s.classList.toggle('is-past', i < n - 1); });
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
  new MutationObserver(update).observe(root, { attributes: true, attributeFilter: ['class'] });
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

// ---------------------------------------------------------------------------
// הדר: תפריט במובייל, סימון החלק שבו נמצאים, וצל קטן כשגוללים.
// ---------------------------------------------------------------------------
(function () {
  var header = document.querySelector('[data-site-header]');
  var nav = document.querySelector('[data-site-nav]');
  var toggle = document.querySelector('[data-nav-toggle]');
  if (!header || !nav) return;

  function setOpen(v) {
    if (!toggle) return;
    nav.classList.toggle('is-open', v);
    toggle.setAttribute('aria-expanded', v ? 'true' : 'false');
    if (v) { var first = nav.querySelector('a'); if (first) first.focus(); }
  }
  if (toggle) {
    toggle.addEventListener('click', function () { setOpen(!nav.classList.contains('is-open')); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    header.addEventListener('focusout', function (e) {
      if (nav.classList.contains('is-open') && e.relatedTarget && !header.contains(e.relatedTarget)) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false); toggle.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('is-open') && !header.contains(e.target)) setOpen(false);
    });
  }

  // סימון הקישור של החלק שנמצא כרגע במרכז המסך
  var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
  var sections = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function mark() {
    var line = window.innerHeight * 0.4, current = -1;
    sections.forEach(function (sec, i) { if (sec && sec.getBoundingClientRect().top < line) current = i; });
    links.forEach(function (a, i) {
      if (i === current) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
    });
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  // אחרי לחיצה על קישור בניווט: הפוקוס עובר לכותרת החלק, כדי שמקלדת וקורא מסך ימשיכו משם
  links.forEach(function (a, i) {
    a.addEventListener('click', function () {
      var sec = sections[i]; if (!sec) return;
      var h = sec.querySelector('h2[tabindex="-1"]') || sec;
      setTimeout(function () { h.focus({ preventScroll: true }); }, 60);
    });
  });

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(function () { ticking = false; mark(); }); }
  }, { passive: true });
  mark();
})();


// ---------------------------------------------------------------------------
// הדבקה ופייד:
// - התמונה בהירו "נדבקת" עם העטרה חצי שנייה אחרי שהאתר עולה (או אחרי שהפרוכת נפתחת).
// - התמונה שאחרי ההמלצות נדבקת חצי שנייה אחרי שמגיעים אליה.
// - אורן באודות נכנס בפייד של חצי שנייה כשמגיעים לסקשן.
// בלי JS, עם "הפחתת תנועה" או "עצירת אנימציות": הכול מוצג במצב הסופי.
// ---------------------------------------------------------------------------
(function () {
  if (!motionOK()) return;
  var root = document.documentElement;
  var onLoad = document.querySelectorAll('[data-glue="load"]');
  var onView = document.querySelectorAll('[data-glue="view"]');
  var fades = document.querySelectorAll('[data-fade]');
  if (!onLoad.length && !onView.length && !fades.length) return;
  root.classList.add('glue-on');
  var DELAY = 500;

  function glueLoad() { setTimeout(function () { onLoad.forEach(function (el) { el.classList.add('is-glued'); }); }, DELAY); }
  if (!root.classList.contains('intro-on')) glueLoad();
  else new MutationObserver(function (m, obs) {
    if (!root.classList.contains('intro-on')) { obs.disconnect(); glueLoad(); }
  }).observe(root, { attributes: true, attributeFilter: ['class'] });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        if (e.target.hasAttribute('data-fade')) e.target.classList.add('is-faded');
        else setTimeout(function () { e.target.classList.add('is-glued'); }, DELAY);
      });
    }, { threshold: 0.35 });
    onView.forEach(function (el) { io.observe(el); });
    fades.forEach(function (el) { io.observe(el); });
  } else {
    root.classList.remove('glue-on');
  }

  document.addEventListener('a11y:still', function () { root.classList.remove('glue-on'); });
})();
