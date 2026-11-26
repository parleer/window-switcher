// Small behaviours for the website: the hero's switcher demo.
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- hero demo ---------------------------------------------------------------------------
  // Plays the main job on a loop: in Mail, ⌥⇥ opens the switcher, T focuses Terminal (the
  // view stays put, the rest dims), B picks its second window, and you land on that window's
  // desktop. With reduced motion it shows the open switcher and stops.
  var demo = document.querySelector('[data-demo]');
  if (!demo) return;
  var $ = function (s) { return demo.querySelector(s); };
  var panel = $('[data-panel]'), k1 = $('[data-k]'), k2 = $('[data-k2]');
  var mail = $('[data-front="mail"]'), term = $('[data-front="term"]');
  var hint = $('[data-hint]'), caption = $('[data-caption]');
  var barApp = $('[data-bar-app]'), barSpace = $('[data-bar-space]');
  var groups = demo.querySelectorAll('.sw-group');
  var hintStart = hint.textContent;

  var select = function (key) {
    demo.querySelectorAll('.sel').forEach(function (el) { el.classList.remove('sel'); });
    if (key) $('[data-sel="' + key + '"]').classList.add('sel');
  };
  var focus = function (app) {
    groups.forEach(function (g) {
      var on = g.getAttribute('data-app') === app;
      g.classList.toggle('dim', !!app && !on);
      g.classList.toggle('focus', on);
    });
    hint.textContent = app ? 'Terminal: press a window\'s letter · arrows and ↩ to choose · esc back' : hintStart;
  };
  var press = function (a, b) {
    k1.textContent = a || ''; k1.classList.toggle('off', !a);
    k2.textContent = b || ''; k2.classList.toggle('off', !b);
  };

  var reset = function () {
    panel.classList.add('off'); mail.classList.remove('off'); term.classList.add('off');
    focus(null); select('code'); press(null, null);
    barApp.textContent = 'Mail'; barSpace.textContent = 'Desktop 1 · Tue 9:41';
    caption.textContent = 'You\'re reading mail. The server is on another desktop.';
  };

  if (reduce) {
    panel.classList.remove('off');
    caption.textContent = '';
    return;
  }

  var steps = [
    [900, function () { press('⌥⇥'); }],
    [1150, function () { panel.classList.remove('off'); caption.textContent = 'Press ⌥⇥ and let go. Every window, every desktop.'; }],
    [2600, function () { press('T'); focus('term'); select('term-a'); caption.textContent = 'T for Terminal. Its windows get letters.'; }],
    [3900, function () { press('T', 'B'); select('term-b'); }],
    [4350, function () {
      panel.classList.add('off'); mail.classList.add('off'); term.classList.remove('off');
      barApp.textContent = 'Terminal'; barSpace.textContent = 'Desktop 2 · Tue 9:41';
      caption.textContent = 'B for the server. You\'re there, on Desktop 2.';
    }],
    [5200, function () { press(null, null); }],
    [8200, reset]
  ];
  var run = function () {
    steps.forEach(function (s) { setTimeout(s[1], s[0]); });
    setTimeout(run, 8600);
  };
  reset();
  run();
})();
