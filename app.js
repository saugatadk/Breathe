/* Breathe — study-break techniques with honest timing and honest evidence.
   Plain script on purpose: no modules, so this runs straight off the disk. */
(function () {
  'use strict';

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------- data */

  var GROUPS = [
    'When your chest is tight',
    'When your body has seized up',
    'When your eyes and neck ache',
    'When your attention is fried',
    'When your head is loud'
  ];

  /* phase.to is how full the tide column should be at the end of the phase,
     which is what lets the physiological sigh show its second, smaller inhale. */
  var T = [
    {
      id: 'sigh',
      name: 'Physiological sigh',
      group: 0,
      minutes: 1,
      tier: 3,
      time: '1 min',
      blurb: 'The fastest way down. Two inhales, then a long exhale.',
      what: 'Two inhales through the nose, then a long, slow exhale through the mouth.',
      kind: 'breath',
      art: 'tide',
      cycles: 6,
      pattern: [
        { label: 'Inhale through the nose', s: 2.0, to: 0.72, tone: 'in' },
        { label: 'Top it up', s: 1.2, to: 1, tone: 'in' },
        { label: 'Long exhale through the mouth', s: 6.0, to: 0, tone: 'out' }
      ]
    },
    {
      id: 'box',
      name: 'Box breathing',
      group: 0,
      minutes: 4,
      tier: 3,
      time: '4 min',
      blurb: 'Equal counts, four sides. Steadying when your thoughts are racing.',
      what: 'In for four, hold for four, out for four, hold for four.',
      kind: 'breath',
      art: 'square',
      cycles: 15,
      pattern: [
        { label: 'Breathe in', s: 4, to: 1, tone: 'in' },
        { label: 'Hold', s: 4, to: 1, tone: 'hold' },
        { label: 'Breathe out', s: 4, to: 0, tone: 'out' },
        { label: 'Hold', s: 4, to: 0, tone: 'hold' }
      ]
    },
    {
      id: 'coherent',
      name: 'Coherent breathing',
      group: 0,
      minutes: 5,
      tier: 2,
      time: '5 min',
      blurb: 'Five and a half breaths a minute — where heart rate swings hardest.',
      what: 'In for five and a half seconds, out for five and a half. No holds, no effort.',
      kind: 'breath',
      art: 'wave',
      cycles: 27,
      pattern: [
        { label: 'In', s: 5.5, to: 1, tone: 'in' },
        { label: 'Out', s: 5.5, to: 0, tone: 'out' }
      ]
    },
    {
      id: 'weil',
      name: '4-7-8 breathing',
      group: 0,
      minutes: 3,
      tier: 1,
      time: '2.5 min',
      blurb: 'A long hold and a longer exhale. Popular, thinly tested.',
      what: 'In for four, hold for seven, out for eight. Shorten the hold if it feels forced.',
      kind: 'breath',
      art: 'tide',
      cycles: 8,
      pattern: [
        { label: 'Breathe in', s: 4, to: 1, tone: 'in' },
        { label: 'Hold', s: 7, to: 1, tone: 'hold' },
        { label: 'Breathe out slowly', s: 8, to: 0, tone: 'out' }
      ]
    },
    {
      id: 'pmr',
      name: 'Progressive muscle relaxation',
      group: 1,
      minutes: 4,
      tier: 3,
      time: '3 min',
      blurb: 'Tense a muscle group, let it go, notice the difference. Eight groups.',
      what: 'Tense each group hard for five seconds, then release and pay attention for twenty.',
      kind: 'sequence',
      steps: pmrSteps()
    },
    {
      id: 'desk',
      name: 'Desk release',
      group: 1,
      minutes: 3,
      tier: 2,
      time: '3 min',
      blurb: 'Neck, shoulders, wrists, hips — the four places studying collects.',
      what: 'Eight slow stretches you can do beside your chair. Stop short of pain.',
      kind: 'sequence',
      steps: [
        { t: 25, text: 'Ear towards your right shoulder. Let the weight of your head do it.' },
        { t: 25, text: 'Now the left side. Shoulders stay down.' },
        { t: 20, text: 'Chin tucked back, lengthen the back of your neck. Hold, breathe.' },
        { t: 20, text: 'Roll your shoulders backwards, slowly, as far as they go.' },
        { t: 25, text: 'Hands behind your back or on a doorframe. Open your chest.' },
        { t: 25, text: 'Arm out, palm up, gently pull the fingers back. Then the other wrist.' },
        { t: 30, text: 'Sit tall, right ankle on left knee, lean forward from the hips. Swap sides.' },
        { t: 25, text: 'Stand up. Push your hips forward, reach both arms overhead.' }
      ]
    },
    {
      id: 'scan',
      name: 'Body scan',
      group: 1,
      minutes: 5,
      tier: 2,
      time: '5 min',
      blurb: 'Attention moving through the body, feet upward. Nothing to fix.',
      what: 'Rest attention on each area in turn. If it is tense, leave it tense and keep noticing.',
      kind: 'sequence',
      steps: [
        { t: 30, text: 'Your feet. Weight, temperature, whatever is there.' },
        { t: 30, text: 'Calves and shins.' },
        { t: 30, text: 'Thighs, and where they meet the chair.' },
        { t: 30, text: 'Hips and lower back.' },
        { t: 30, text: 'Stomach. Let it move with the breath.' },
        { t: 30, text: 'Chest and upper back.' },
        { t: 30, text: 'Hands and forearms.' },
        { t: 30, text: 'Shoulders and neck.' },
        { t: 30, text: 'Jaw, tongue, the space around your eyes.' },
        { t: 30, text: 'The whole body at once, breathing.' }
      ]
    },
    {
      id: 'look',
      name: 'Look far away',
      group: 2,
      minutes: 1,
      tier: 2,
      time: '20 sec',
      blurb: 'Twenty seconds at something six metres off. The cheapest break there is.',
      what: 'Find something at least six metres away — out a window if you can — and rest your eyes there.',
      kind: 'hold',
      seconds: 20,
      cue: 'Look at the furthest thing you can see'
    },
    {
      id: 'blink',
      name: 'Blink and reset',
      group: 2,
      minutes: 2,
      tier: 2,
      time: '2 min',
      blurb: 'For the gritty, dry-eyed feeling after a long session.',
      what: 'Full blinks, a moment of darkness, then a posture check.',
      kind: 'sequence',
      steps: [
        { t: 20, text: 'Twenty slow, complete blinks. Let the lids fully meet each time.' },
        { t: 25, text: 'Cup your palms over closed eyes. No pressure on the eyeballs. Just dark.' },
        { t: 25, text: 'Focus on your thumb at arm’s length, then something far. Back and forth, five times.' },
        { t: 20, text: 'Press your thumbs along your brow bone and out to the temples.' },
        { t: 25, text: 'Ears over shoulders, screen an arm’s length away, top of the screen at eye level.' }
      ]
    },
    {
      id: 'green',
      name: 'Green break',
      group: 3,
      minutes: 1,
      tier: 3,
      time: '40 sec',
      blurb: 'Forty seconds looking at something alive. Measurably restores attention.',
      what: 'Look at a tree, a plant, a patch of grass — anything growing. Forty seconds is the tested dose.',
      kind: 'hold',
      seconds: 40,
      cue: 'Find something living and look at it'
    },
    {
      id: 'walk',
      name: 'Walk it out',
      group: 3,
      minutes: 5,
      tier: 3,
      time: '5 min',
      blurb: 'For stuck, open-ended problems. Walking measurably loosens ideas.',
      what: 'Five minutes on your feet, away from the desk. Leave the phone behind.',
      kind: 'hold',
      seconds: 300,
      cue: 'Walking',
      notes: [
        'Get out of the room you have been sitting in.',
        'No phone, no podcast. Let it be boring.',
        'If you are stuck on something open-ended, hold the question loosely and let it wander.',
        'Outside beats a corridor, but a corridor still counts.'
      ]
    },
    {
      id: 'still',
      name: 'Stillness',
      group: 3,
      minutes: 10,
      tier: 1,
      time: '10 min',
      blurb: 'Lie back, eyes closed, stay awake. Restful — and heavily over-claimed.',
      what: 'On your back if you can. Eyes closed, body still, awake. Let attention drift.',
      kind: 'hold',
      seconds: 600,
      cue: 'Still, eyes closed, awake'
    },
    {
      id: 'write',
      name: 'Write the worry down',
      group: 4,
      minutes: 10,
      tier: 3,
      time: '10 min',
      blurb: 'Ten minutes of writing out what you are dreading. Best evidence for exams.',
      what: 'Write about what is worrying you, as bluntly as you like. Nobody reads this, including me.',
      kind: 'write',
      seconds: 600,
      cue: 'Keep writing'
    },
    {
      id: 'senses',
      name: 'Five senses',
      group: 4,
      minutes: 2,
      tier: 1,
      time: '2 min',
      blurb: 'Name what is around you until your attention comes back to the room.',
      what: 'Name them out loud or silently. Move on when you have found them all.',
      kind: 'prompts',
      prompts: [
        { n: '5', text: 'things you can see' },
        { n: '4', text: 'things you can hear' },
        { n: '3', text: 'things you can feel touching you' },
        { n: '2', text: 'things you can smell' },
        { n: '1', text: 'thing you can taste' }
      ]
    }
  ];
  var EV = {
    sigh:
      '<p><strong>The best-supported technique on this page.</strong> In a randomised trial of 108 adults ' +
      '(Balban and colleagues, <em>Cell Reports Medicine</em>, 2023), five minutes a day of cyclic sighing ' +
      'improved mood more than mindfulness meditation, box breathing or cyclic hyperventilation, and lowered ' +
      'resting breathing rate the most.</p>' +
      '<p>The active ingredient is the exhale. Making the out-breath longer than the in-breath increases vagal ' +
      'influence on the heart, which is why one deliberate sigh already takes the edge off.</p>',
    box:
      '<p>Box breathing was one of the comparison arms in that same 2023 trial. It helped — just less than ' +
      'cyclic sighing. Its broader support comes from slow breathing in general: a meta-analysis of breathwork ' +
      'trials (Fincham and colleagues, <em>Scientific Reports</em>, 2023) found a small-to-medium reduction in ' +
      'stress, around g = 0.35.</p>' +
      '<p>What it is genuinely good at is structure. Four equal counts give your attention something to hold, ' +
      'which is why it gets used before high-pressure tasks. The Navy SEAL framing is marketing, not evidence.</p>',
    coherent:
      '<p>Around six breaths a minute you hit the resonance frequency of the cardiovascular system, near 0.1 Hz, ' +
      'where heart rate swings hardest with each breath (Lehrer and Gevirtz, <em>Frontiers in Psychology</em>, 2014). ' +
      'That part is solid and shows up within a minute on any heart-rate monitor.</p>' +
      '<p><strong>The honest caveat:</strong> tested against a well-designed sham breathwork condition in a ' +
      'placebo-controlled trial (Fincham and colleagues, 2023), coherent breathing produced no extra benefit for ' +
      'wellbeing. The physiology moves. How much of the calm belongs to this specific pattern is unsettled.</p>',
    weil:
      '<p>4-7-8 is Andrew Weil’s protocol and it has <strong>no direct controlled trials</strong> behind it. ' +
      'What supports it is the principle it borrows: a slow rate and an exhale twice the length of the inhale, ' +
      'the same mechanism as the physiological sigh.</p>' +
      '<p>The seven-count hold is the part to watch. If it leaves you lightheaded or air-hungry, shorten it. ' +
      'Four cycles is plenty when you are starting out.</p>',
    pmr:
      '<p>Jacobson’s method, and one of the better-evidenced relaxation techniques. A review of ten years of ' +
      'relaxation trials (Manzoni and colleagues, <em>BMC Psychiatry</em>, 2008) found consistent, significant ' +
      'reductions in anxiety, and later reviews of progressive muscle relaxation specifically report benefits ' +
      'for stress and anxiety.</p>' +
      '<p>The tensing is not the point — the contrast is. You are learning what your shoulders feel like when ' +
      'they are not braced, which is information you can use for the rest of the session.</p>',
    desk:
      '<p>These particular stretches have not been trialled one by one. What is supported is interrupting the ' +
      'position: a meta-analysis of micro-breaks (Albulescu and colleagues, <em>PLOS ONE</em>, 2022) found short ' +
      'breaks reduce fatigue and raise vigour.</p>' +
      '<p>That same review found <strong>no overall improvement in task performance</strong> from short breaks — ' +
      'longer ones did better on that count. So do this for your neck, not because it will make you sharper.</p>',
    scan:
      '<p>A short body scan shifts state anxiety a modest amount. A meta-analysis of brief mindfulness inductions ' +
      'in high-anxiety adults found a moderate effect on state anxiety, but across only three studies and ' +
      'about a hundred people. In a head-to-head test, ten minutes did as much as twenty (Palmer and colleagues, ' +
      '<em>Scientific Reports</em>, 2023).</p>' +
      '<p>The impressive mindfulness findings come from eight-week programmes, not single sits. Treat this as a ' +
      'way to stop scrolling, not as treatment.</p>',
    look:
      '<p>Every twenty minutes, look twenty feet away for twenty seconds. The American Optometric Association ' +
      'recommends it; the numbers themselves are a convention rather than a tested dose.</p>' +
      '<p>What the trials show: reminders to take these breaks do change behaviour and do reduce reported eye ' +
      'strain and dry-eye symptoms (Talens-Estarelles and colleagues, 2022), and a 2025 trial found less eye ' +
      'irritation with scheduled breaks than with none. Objective measures of focusing and alignment mostly do ' +
      'not budge. Blink rate dropping during screen work, though, is well documented — and that is the part you ' +
      'actually feel.</p>',
    blink:
      '<p>Near work suppresses blinking, and incomplete blinks leave the tear film thin. That is the gritty, ' +
      'dry feeling after a long session, and deliberate full blinks address it directly.</p>' +
      '<p>The posture cue is tacked on the end because neck and eye complaints travel together in the digital ' +
      'eye strain literature — though the ergonomic advice itself is consensus rather than trial-proven.</p>',
    green:
      '<p>Forty seconds. In a study by Lee and colleagues (<em>Journal of Environmental Psychology</em>, 2015), ' +
      'people who looked at a flowering green roof for forty seconds mid-task sustained attention better and made ' +
      'fewer omission errors than those who looked at a bare concrete roof.</p>' +
      '<p>Attention restoration theory is the frame: greenery holds attention softly, which lets the effortful, ' +
      'directed kind recover. A window with a tree in it is enough.</p>',
    walk:
      '<p>Walking reliably loosens divergent thinking — the idea-generating kind. Across four experiments ' +
      '(Oppezzo and Schwartz, <em>Journal of Experimental Psychology: Learning, Memory, and Cognition</em>, 2014), ' +
      '81% of people scored higher on an alternate-uses task while walking, and walking outdoors produced the most ' +
      'novel ideas. Convergent, single-answer thinking barely moved.</p>' +
      '<p>So this is the break for when you are stuck on something open-ended, and the wrong break when you need ' +
      'to grind through a problem set.</p>',
    still:
      '<p><strong>The thinnest evidence here, and the most over-claimed elsewhere.</strong> The dopamine figure ' +
      'attached to non-sleep deep rest comes from a single PET study of eight experienced practitioners during ' +
      'yoga nidra (Kjaer and colleagues, <em>Cognitive Brain Research</em>, 2002). Eight people.</p>' +
      '<p>Lying still with your eyes closed for ten minutes is restful and harmless, and the early sleep-lab work ' +
      'on yoga nidra is interesting. It just does not yet support what the podcasts claim for it.</p>',
    write:
      '<p>Ten minutes of writing about what you are dreading, immediately before a test, raised exam scores — ' +
      'most of all for students who are habitually test-anxious (Ramirez and Beilock, <em>Science</em>, 2011). ' +
      'The proposed mechanism is offloading: worry occupies working memory, and putting it into words hands that ' +
      'capacity back.</p>' +
      '<p>Nothing you type here is stored or sent anywhere. Close the tab and it is gone.</p>',
    senses:
      '<p>Naming what you can see, hear and feel is standard practice for acute anxiety, and the mechanism is ' +
      'plausible: it competes for the attention that rumination is using. <strong>The specific 5-4-3-2-1 script ' +
      'has not been tested in controlled trials.</strong></p>' +
      '<p>One warning, since you might go looking: searching for research on grounding turns up a separate ' +
      'literature about electrical contact with the earth. That is unrelated and not credible. This is an ' +
      'attention exercise, nothing more.</p>'
  };
  /* ------------------------------------------------------------- helpers */

  function pmrSteps() {
    var g = [
      'hands and forearms — make fists',
      'upper arms — bend your elbows and squeeze',
      'shoulders and neck — shrug up towards your ears',
      'face — screw your eyes shut, clench your jaw',
      'chest and upper back — breathe in, squeeze your shoulder blades together',
      'stomach — brace as if for a punch',
      'thighs — press your knees together',
      'calves and feet — pull your toes up towards you'
    ];
    var out = [], i;
    for (i = 0; i < g.length; i++) {
      out.push({ t: 5, text: 'Tense your ' + g[i] });
      out.push({ t: 20, text: 'Let go completely. Notice how different that feels.' });
    }
    return out;
  }

  function $(id) { return document.getElementById(id); }

  var el = {
    name: $('t-name'), what: $('t-what'), pacer: $('pacer'), art: $('pacer-art'),
    count: $('count'), cue: $('cue'), start: $('start'), step: $('step'),
    reset: $('reset'), progress: $('progress'), extra: $('extra'),
    evidence: $('evidence'), list: $('list'), empty: $('empty'),
    sound: $('sound'), theme: $('theme')
  };

  function clock(s) {
    s = Math.max(0, Math.ceil(s));
    var m = Math.floor(s / 60);
    var r = s % 60;
    return m + ':' + (r < 10 ? '0' : '') + r;
  }

  function totalOf(t) {
    var n = 0, i;
    if (t.kind === 'breath') {
      for (i = 0; i < t.pattern.length; i++) { n += t.pattern[i].s; }
      return n * t.cycles;
    }
    if (t.kind === 'sequence') {
      for (i = 0; i < t.steps.length; i++) { n += t.steps[i].t; }
      return n;
    }
    return t.seconds || 0;
  }
  /* --------------------------------------------------------------- sound */

  var ac = null, soundOn = false;
  var TONE = { in: 392, hold: 294, out: 233, step: 349, done: 466 };

  function beep(kind) {
    if (!soundOn) { return; }
    try {
      if (!ac) { ac = new (window.AudioContext || window.webkitAudioContext)(); }
      if (ac.state === 'suspended') { ac.resume(); }
      var o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime;
      o.type = 'sine';
      o.frequency.value = TONE[kind] || 349;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.07, t + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
      o.connect(g);
      g.connect(ac.destination);
      o.start(t);
      o.stop(t + 0.65);
    } catch (e) {
      soundOn = false;
      el.sound.setAttribute('aria-pressed', 'false');
      el.sound.textContent = 'Sound unavailable';
    }
  }

  /* ------------------------------------------------------------------ art
     Four geometries, because the shape of the exercise is different in each:
     a square for equal counts, a filling column for uneven ones, a scrolling
     trace for continuous breathing, a depleting ring for plain waiting. */

  var SVG_OPEN = '<svg viewBox="0 0 220 220" aria-hidden="true" focusable="false">';

  function artSquare() {
    var pad = 28, side = 220 - pad * 2, per = side * 4;
    el.art.innerHTML = SVG_OPEN +
      '<rect class="trace-base" x="' + pad + '" y="' + pad + '" width="' + side + '" height="' + side + '"/>' +
      '<path class="trace-live" d="M' + pad + ',' + pad + ' H' + (pad + side) +
      ' V' + (pad + side) + ' H' + pad + ' Z" stroke-dasharray="' + per + '" stroke-dashoffset="' + per + '"/>' +
      '<circle class="trace-dot" r="4.5" cx="' + pad + '" cy="' + pad + '"/></svg>';
    var live = el.art.querySelector('.trace-live');
    var dot = el.art.querySelector('.trace-dot');
    return { update: function (st) {
      var p = per * st.cycleProg, x, y;
      live.setAttribute('stroke-dashoffset', per - p);
      if (p < side) { x = pad + p; y = pad; }
      else if (p < side * 2) { x = pad + side; y = pad + (p - side); }
      else if (p < side * 3) { x = pad + side - (p - side * 2); y = pad + side; }
      else { x = pad; y = pad + side - (p - side * 3); }
      dot.setAttribute('cx', x);
      dot.setAttribute('cy', y);
    } };
  }
  function artTide(demo) {
    el.art.innerHTML = '<div class="tide"' + (demo ? ' data-demo' : '') +
      '><div class="tide-fill"></div></div>';
    var box = el.art.querySelector('.tide');
    var fill = el.art.querySelector('.tide-fill');
    return {
      /* the idle demo breath is a CSS animation; it has to be taken off the
         element before inline heights can drive anything. */
      live: function () { box.removeAttribute('data-demo'); },
      phase: function (ph) {
        fill.style.transitionDuration = (REDUCED ? 0 : ph.s) + 's';
        fill.style.height = Math.round(ph.to * 100) + '%';
      },
      clear: function () {
        fill.style.transitionDuration = '0.4s';
        fill.style.height = '0%';
      },
      update: function () {}
    };
  }

  function artWave() {
    var W = 300, H = 150, mid = H / 2, amp = 96, win = 22;
    var grid = '', x;
    for (x = 0; x <= W; x += 75) {
      grid += '<line class="trace-grid" x1="' + x + '" y1="14" x2="' + x + '" y2="' + (H - 14) + '"/>';
    }
    el.art.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" aria-hidden="true" focusable="false">' +
      grid + '<line class="trace-grid" x1="0" y1="' + mid + '" x2="' + W + '" y2="' + mid + '"/>' +
      '<polyline class="trace-live" points=""/><circle class="trace-dot" r="4" cx="' + W + '" cy="' + mid + '"/></svg>';
    var line = el.art.querySelector('.trace-live');
    var dot = el.art.querySelector('.trace-dot');
    var pts = [];
    if (REDUCED) {
      var s = '', i;
      for (i = 0; i <= W; i += 5) {
        s += i + ',' + (mid + (amp / 2) * Math.cos(2 * Math.PI * (i / W) * 2)).toFixed(1) + ' ';
      }
      line.setAttribute('points', s);
      return { update: function () {} };
    }
    return { update: function (st) {
      var y = mid + (amp / 2) * Math.cos(2 * Math.PI * st.cycleProg);
      if (!pts.length || st.elapsed - pts[pts.length - 1].t > 0.05) { pts.push({ t: st.elapsed, y: y }); }
      while (pts.length && st.elapsed - pts[0].t > win) { pts.shift(); }
      var out = '', i;
      for (i = 0; i < pts.length; i++) {
        out += (W - (st.elapsed - pts[i].t) / win * W).toFixed(1) + ',' + pts[i].y.toFixed(1) + ' ';
      }
      line.setAttribute('points', out);
      dot.setAttribute('cy', y.toFixed(1));
    } };
  }
  function artDial() {
    var r = 92, c = 2 * Math.PI * r;
    el.art.innerHTML = SVG_OPEN +
      '<circle class="trace-base" cx="110" cy="110" r="' + r + '"/>' +
      '<circle class="trace-live" cx="110" cy="110" r="' + r + '" transform="rotate(-90 110 110)" ' +
      'stroke-dasharray="' + c + '" stroke-dashoffset="0"/></svg>';
    var live = el.art.querySelector('.trace-live');
    return { update: function (st) {
      var left = st.total ? st.remaining / st.total : 1;
      live.setAttribute('stroke-dashoffset', (c * (1 - left)).toFixed(1));
    } };
  }

  /* -------------------------------------------------------------- running */

  var cur = null, art = null, running = false, done = false;
  var startedAt = 0, accrued = 0, raf = 0, marker = -1, promptIdx = 0;

  function paint(tone) {
    el.pacer.style.setProperty('--now',
      'var(--' + (tone === 'in' ? 'inhale' : tone === 'out' ? 'exhale' : tone === 'hold' ? 'hold' : 'inhale') + ')');
  }

  function elapsed(now) {
    return accrued + (running ? (now - startedAt) / 1000 : 0);
  }

  function markSteps(i) {
    var lis = el.extra.querySelectorAll('.steps li'), k;
    for (k = 0; k < lis.length; k++) {
      lis[k].className = k === i ? 'is-now' : (k < i ? 'is-done' : '');
    }
  }

  function finish() {
    running = false;
    done = true;
    cancelAnimationFrame(raf);
    beep('done');
    el.count.textContent = '';
    el.cue.textContent = 'Done. Back to it.';
    el.start.textContent = 'Start again';
    el.step.hidden = true;
    focusMode(false);
    if (art && art.clear) { art.clear(); }
  }
  function frame(now) {
    if (!running) { return; }
    var t = elapsed(now), total = totalOf(cur), i, changed;

    if (cur.kind === 'breath') {
      var len = 0;
      for (i = 0; i < cur.pattern.length; i++) { len += cur.pattern[i].s; }
      if (t >= total) { finish(); return; }
      var cyc = Math.floor(t / len), within = t - cyc * len, acc = 0, pi = 0, ph = cur.pattern[0];
      for (i = 0; i < cur.pattern.length; i++) {
        if (within < acc + cur.pattern[i].s) { ph = cur.pattern[i]; pi = i; break; }
        acc += cur.pattern[i].s;
      }
      var rem = acc + ph.s - within;
      changed = (cyc * cur.pattern.length + pi) !== marker;
      if (changed) {
        marker = cyc * cur.pattern.length + pi;
        paint(ph.tone);
        beep(ph.tone);
        if (art.phase) { art.phase(ph); }
        el.cue.textContent = ph.label;
        el.progress.textContent = 'Cycle ' + (cyc + 1) + ' of ' + cur.cycles;
      }
      el.count.textContent = Math.max(1, Math.ceil(rem));
      if (!REDUCED) { art.update({ cycleProg: within / len, elapsed: t, remaining: rem, total: ph.s }); }
      else if (changed) { art.update({ cycleProg: (pi + 1) / cur.pattern.length, elapsed: t, remaining: rem, total: ph.s }); }

    } else if (cur.kind === 'sequence') {
      if (t >= total) { finish(); return; }
      var accS = 0, si = 0, sp = cur.steps[0];
      for (i = 0; i < cur.steps.length; i++) {
        if (t < accS + cur.steps[i].t) { sp = cur.steps[i]; si = i; break; }
        accS += cur.steps[i].t;
      }
      var remS = accS + sp.t - t;
      if (si !== marker) {
        marker = si;
        beep('step');
        el.cue.textContent = sp.text;
        el.progress.textContent = 'Step ' + (si + 1) + ' of ' + cur.steps.length;
        markSteps(si);
      }
      el.count.textContent = Math.max(1, Math.ceil(remS));
      art.update({ remaining: remS, total: sp.t, cycleProg: 0, elapsed: t });

    } else {
      var remH = total - t;
      if (remH <= 0) { finish(); return; }
      el.count.textContent = clock(remH);
      el.cue.textContent = cur.cue;
      art.update({ remaining: remH, total: total, cycleProg: 0, elapsed: t });
    }
    raf = requestAnimationFrame(frame);
  }

  /* ------------------------------------------------------- stage assembly */

  var extraFor = '';

  function makeArt(demo) {
    var k = cur.kind === 'breath' ? cur.art : (cur.kind === 'prompts' ? 'none' : 'dial');
    el.pacer.setAttribute('data-art', k);
    if (k === 'none') { el.art.innerHTML = ''; return { update: function () {} }; }
    if (k === 'square') { return artSquare(); }
    if (k === 'wave') { return artWave(); }
    if (k === 'tide') { return artTide(demo); }
    return artDial();
  }

  function renderExtra() {
    if (extraFor === cur.id) { return; }
    extraFor = cur.id;
    var html = '', i, items = cur.steps || cur.notes;
    if (cur.kind === 'write') {
      html = '<textarea class="scratch" aria-label="Write about what is on your mind" ' +
        'placeholder="Start anywhere. Sentences do not have to be good."></textarea>' +
        '<p class="scratch-note">Nothing you type here is stored or sent anywhere. ' +
        'Close the tab and it is gone.</p>';
    } else if (items) {
      html = '<ol class="steps">';
      for (i = 0; i < items.length; i++) {
        html += '<li>' + (items[i].text || items[i]) + '</li>';
      }
      html += '</ol>';
    }
    el.extra.innerHTML = html;
  }

  function showPrompt() {
    var p = cur.prompts[promptIdx];
    el.count.textContent = p.n;
    el.cue.textContent = p.text;
    el.progress.textContent = 'Prompt ' + (promptIdx + 1) + ' of ' + cur.prompts.length;
  }
  var firstPaint = true;

  function prime() {
    running = false;
    done = false;
    accrued = 0;
    marker = -1;
    promptIdx = 0;
    cancelAnimationFrame(raf);
    focusMode(false);
    var total = totalOf(cur);
    el.start.textContent = 'Start';
    el.step.hidden = cur.kind !== 'sequence';
    el.step.textContent = cur.kind === 'prompts' ? 'Next' : 'Skip step';
    el.progress.textContent = '';
    if (cur.kind === 'sequence' || cur.kind === 'prompts') { el.pacer.setAttribute('data-wide', ''); }
    else { el.pacer.removeAttribute('data-wide'); }
    paint(cur.kind === 'breath' ? cur.pattern[0].tone : 'in');
    art = makeArt(firstPaint);
    firstPaint = false;
    el.count.textContent = cur.kind === 'prompts' ? String(cur.prompts.length) : clock(total);
    el.cue.textContent = 'Press start when you’re ready';
    markSteps(-1);
    art.update({ remaining: total, total: total, cycleProg: 0, elapsed: 0 });
  }

  function markRows() {
    var rows = el.list.querySelectorAll('.row'), i;
    for (i = 0; i < rows.length; i++) {
      if (rows[i].getAttribute('data-id') === cur.id) { rows[i].setAttribute('aria-current', 'true'); }
      else { rows[i].removeAttribute('aria-current'); }
    }
  }

  function select(id, fromClick) {
    var i;
    for (i = 0; i < T.length; i++) { if (T[i].id === id) { cur = T[i]; } }
    el.name.textContent = cur.name;
    el.what.textContent = cur.what;
    el.evidence.innerHTML = EV[cur.id] || '';
    renderExtra();
    prime();
    markRows();
    if (fromClick && window.matchMedia('(max-width: 62rem)').matches) {
      document.querySelector('.stage').scrollIntoView({
        behavior: REDUCED ? 'auto' : 'smooth', block: 'start'
      });
    }
  }
  /* ------------------------------------------------------------- controls */

  /* While a session runs, the rest of the page leaves. Entering focus scrolls
     to the top because the stage is the only thing left to look at. */
  function focusMode(on) {
    if (on) {
      document.body.classList.add('is-focus');
      window.scrollTo(0, 0);
    } else {
      document.body.classList.remove('is-focus');
    }
  }

  function begin() {
    running = true;
    done = false;
    startedAt = performance.now();
    marker = -1;
    if (art.live) { art.live(); }
    /* open the audio context inside the click, while the gesture still counts */
    if (soundOn) {
      try {
        if (!ac) { ac = new (window.AudioContext || window.webkitAudioContext)(); }
        if (ac.state === 'suspended') { ac.resume(); }
      } catch (e) { /* beep() will report it */ }
    }
    el.start.textContent = 'Pause';
    focusMode(true);
    raf = requestAnimationFrame(frame);
  }

  function pause() {
    accrued = elapsed(performance.now());
    running = false;
    cancelAnimationFrame(raf);
    el.start.textContent = 'Resume';
    el.cue.textContent = 'Paused';
    focusMode(false);
  }

  el.start.addEventListener('click', function () {
    if (cur.kind === 'prompts') {
      promptIdx = 0;
      done = false;
      el.step.hidden = false;
      el.start.textContent = 'Start over';
      focusMode(true);
      showPrompt();
      beep('step');
      return;
    }
    if (done) { prime(); begin(); return; }
    if (running) { pause(); } else { begin(); }
  });

  el.reset.addEventListener('click', function () { prime(); });

  /* Esc is the way out of focus mode without hunting for the button. */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') { return; }
    if (running) { pause(); }
    else if (document.body.classList.contains('is-focus')) { prime(); }
  });
  el.step.addEventListener('click', function () {
    if (cur.kind === 'prompts') {
      if (promptIdx >= cur.prompts.length - 1) { finish(); return; }
      promptIdx++;
      showPrompt();
      beep('step');
      return;
    }
    var t = elapsed(performance.now()), acc = 0, si = -1, i;
    for (i = 0; i < cur.steps.length; i++) {
      if (t < acc + cur.steps[i].t) { si = i; break; }
      acc += cur.steps[i].t;
    }
    if (si < 0 || si >= cur.steps.length - 1) { finish(); return; }
    accrued = acc + cur.steps[si].t;
    marker = -1;
    if (running) { startedAt = performance.now(); } else { begin(); }
  });

  /* ------------------------------------------------------------- the index */

  function bars(tier) {
    var s = '', i;
    for (i = 1; i <= 3; i++) { s += i <= tier ? '<i class="on"></i>' : '<i></i>'; }
    return s;
  }

  function renderList(max) {
    var html = '', shown = 0, g, i, t, rows;
    for (g = 0; g < GROUPS.length; g++) {
      rows = '';
      for (i = 0; i < T.length; i++) {
        t = T[i];
        if (t.group !== g || t.minutes > max) { continue; }
        rows += '<button type="button" class="row" data-id="' + t.id + '">' +
          '<span class="row-name">' + t.name + '</span>' +
          '<span class="row-time">' + t.time + '</span>' +
          '<span class="row-what">' + t.blurb + '</span>' +
          '<span class="tier" aria-hidden="true">' + bars(t.tier) + '</span></button>';
        shown++;
      }
      if (rows) { html += '<h3 class="group">' + GROUPS[g] + '</h3>' + rows; }
    }
    el.list.innerHTML = html;
    el.empty.hidden = shown > 0;
    if (cur) { markRows(); }
  }
  el.list.addEventListener('click', function (e) {
    var row = e.target.closest ? e.target.closest('.row') : null;
    if (row) { select(row.getAttribute('data-id'), true); }
  });

  var chips = document.querySelectorAll('.chip'), ci;
  for (ci = 0; ci < chips.length; ci++) {
    chips[ci].addEventListener('click', function () {
      var k;
      for (k = 0; k < chips.length; k++) {
        if (chips[k] === this) {
          chips[k].className = 'chip is-on';
          chips[k].setAttribute('aria-pressed', 'true');
        } else {
          chips[k].className = 'chip';
          chips[k].setAttribute('aria-pressed', 'false');
        }
      }
      renderList(Number(this.getAttribute('data-max')));
    });
  }

  /* ------------------------------------------------------- prefs and start */

  function pref(k, v) {
    try {
      if (v === undefined) { return localStorage.getItem('breathe.' + k); }
      localStorage.setItem('breathe.' + k, v);
    } catch (e) { /* file:// or private mode; preferences just won't persist */ }
    return null;
  }

  function setTheme(v) {
    document.documentElement.setAttribute('data-theme', v);
    el.theme.textContent = v === 'bright' ? 'Dim' : 'Brighten';
  }

  el.theme.addEventListener('click', function () {
    var next = document.documentElement.getAttribute('data-theme') === 'bright' ? 'dim' : 'bright';
    setTheme(next);
    pref('theme', next);
  });

  el.sound.addEventListener('click', function () {
    soundOn = !soundOn;
    el.sound.setAttribute('aria-pressed', soundOn ? 'true' : 'false');
    el.sound.textContent = soundOn ? 'Sound cues on' : 'Sound cues off';
    pref('sound', soundOn ? '1' : '0');
    if (soundOn) { beep('step'); }
  });
  var savedTheme = pref('theme');
  if (savedTheme === 'bright' ||
      (!savedTheme && window.matchMedia('(prefers-color-scheme: light)').matches)) {
    setTheme('bright');
  }
  if (pref('sound') === '1') {
    soundOn = true;
    el.sound.setAttribute('aria-pressed', 'true');
    el.sound.textContent = 'Sound cues on';
  }

  renderList(99);
  select('sigh', false);
})();
