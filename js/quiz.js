/* =========================================================
   BaccaCode — Module 3 (Quiz)
   Sections: config → data → state → helpers → render → timer
             → navigation → submit/result → init
   Integration points (search for "INTEGRATION"):
     1. loadQuiz()      — swap the local sample for an API/JSON call
     2. saveResult()    — send the result to your backend
     3. 'quiz:submitted' event — other modules can listen to it
   ========================================================= */
(() => {
  'use strict';

  /* ---------- 1. Config ---------- */
  const CONFIG = {
    passingPercent: 60,
    warnAtSeconds: 30,
    defaultLang: 'ar',
    langStorageKey: 'lang', // reuse the key your header switcher uses
  };

  /* ---------- 2. Data (sample) ----------
     Shape: { id, title, topic, timeLimitSeconds, questions[] }
     Every text field is bilingual: { ar, en }.
     `correct` is the index of the right option. */
  const SAMPLE_QUIZ = {
    id: 'cf-basics-01',
    title: { ar: 'أساسيات حل المسائل', en: 'Problem-Solving Basics' },
    topic: { ar: 'مقدمة في Codeforces', en: 'Intro to Codeforces' },
    timeLimitSeconds: 300,
    questions: [
      {
        id: 'q1',
        text: { ar: 'ما تعقيد البحث الثنائي (Binary Search) على مصفوفة مرتبة حجمها n؟', en: 'What is the time complexity of binary search on a sorted array of size n?' },
        options: [{ ar: 'O(n)', en: 'O(n)' }, { ar: 'O(log n)', en: 'O(log n)' }, { ar: 'O(n log n)', en: 'O(n log n)' }, { ar: 'O(1)', en: 'O(1)' }],
        correct: 1,
        explanation: { ar: 'يقسم البحث الثنائي المدى إلى النصف في كل خطوة.', en: 'Binary search halves the search range at every step.' },
      },
      {
        id: 'q2',
        text: { ar: 'أي نوع بيانات أنسب لتخزين ناتج جمع 10^5 أعداد كل منها حتى 10^9؟', en: 'Which type is safest for the sum of 10^5 numbers, each up to 10^9?' },
        options: [{ ar: 'int', en: 'int' }, { ar: 'short', en: 'short' }, { ar: 'long long', en: 'long long' }, { ar: 'float', en: 'float' }],
        correct: 2,
        explanation: { ar: 'المجموع قد يصل إلى 10^14 وهو أكبر من حدود int.', en: 'The sum can reach 10^14, far beyond the int range.' },
      },
      {
        id: 'q3',
        text: { ar: 'ماذا يعني الحكم "Time Limit Exceeded" على Codeforces؟', en: 'What does the verdict "Time Limit Exceeded" mean on Codeforces?' },
        options: [
          { ar: 'الحل أعطى إجابة خاطئة', en: 'The answer was wrong' },
          { ar: 'الحل استغرق وقتاً أطول من المسموح', en: 'The solution ran longer than allowed' },
          { ar: 'الحل استخدم ذاكرة أكثر من المسموح', en: 'The solution used too much memory' },
          { ar: 'الكود لا يُترجم', en: 'The code did not compile' },
        ],
        correct: 1,
        explanation: { ar: 'التنفيذ تجاوز الحد الزمني للمسألة على أحد الاختبارات.', en: 'Execution passed the problem’s time limit on some test.' },
      },
      {
        id: 'q4',
        text: { ar: 'أي بنية بيانات تُستخدم عادةً في خوارزمية BFS؟', en: 'Which data structure is typically used in BFS?' },
        options: [{ ar: 'Stack', en: 'Stack' }, { ar: 'Queue', en: 'Queue' }, { ar: 'Heap', en: 'Heap' }, { ar: 'Set', en: 'Set' }],
        correct: 1,
        explanation: { ar: 'الطابور يضمن زيارة العقد بالترتيب حسب المسافة.', en: 'A queue visits nodes in order of distance from the source.' },
      },
      {
        id: 'q5',
        text: { ar: 'إذا كان n = 10^5 ، أي تعقيد يُتوقع أن يمر في ثانية واحدة؟', en: 'With n = 10^5, which complexity should pass within one second?' },
        options: [{ ar: 'O(n²)', en: 'O(n²)' }, { ar: 'O(n³)', en: 'O(n³)' }, { ar: 'O(2ⁿ)', en: 'O(2ⁿ)' }, { ar: 'O(n log n)', en: 'O(n log n)' }],
        correct: 3,
        explanation: { ar: 'نحو 1.7×10^6 عملية، بينما n² يعطي 10^10.', en: 'About 1.7×10^6 operations, while n² would be 10^10.' },
      },
    ],
  };

  // INTEGRATION 1: replace with e.g. `const res = await fetch('/api/quizzes/' + id); return res.json();`
  async function loadQuiz() {
    return SAMPLE_QUIZ;
  }

  // INTEGRATION 2: persist the result
  async function saveResult(result) {
    // await fetch('/api/quiz-results', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(result) });
    document.dispatchEvent(new CustomEvent('quiz:submitted', { detail: result }));
  }

  /* ---------- 3. State ---------- */
  const state = {
    quiz: null,
    lang: localStorage.getItem(CONFIG.langStorageKey) || CONFIG.defaultLang,
    index: 0,
    answers: [],
    endAt: 0,
    timerId: null,
    view: 'quiz', // 'quiz' | 'result'
    result: null,
  };

  /* ---------- 4. Helpers ---------- */
  const $ = (id) => document.getElementById(id);
  const el = {};
  const t = (obj) => (obj && (obj[state.lang] ?? obj.ar)) || '';
  const num = (n) => Number(n).toLocaleString(state.lang === 'ar' ? 'ar-EG' : 'en-US');
  const letters = { ar: ['أ', 'ب', 'ج', 'د', 'هـ', 'و'], en: ['A', 'B', 'C', 'D', 'E', 'F'] };
  const mmss = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const answeredCount = () => state.answers.filter((a) => a !== null).length;

  function applyLang() {
    document.documentElement.lang = state.lang;
    document.documentElement.dir = state.lang === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-ar][data-en]').forEach((n) => { n.textContent = n.dataset[state.lang]; });
    document.querySelectorAll('#langSwitch [data-lang]').forEach((n) => n.classList.toggle('active', n.dataset.lang === state.lang));
    if (!state.quiz) return;
    el.title.textContent = t(state.quiz.title);
    el.topic.textContent = t(state.quiz.topic);
    renderTimer();
    state.view === 'quiz' ? renderQuestion() : renderResult();
  }

  /* ---------- 5. Render ---------- */
  function renderQuestion() {
    const { questions } = state.quiz;
    const q = questions[state.index];
    const total = questions.length;

    el.count.textContent = state.lang === 'ar'
      ? `السؤال ${num(state.index + 1)} من ${num(total)}`
      : `Question ${state.index + 1} of ${total}`;
    el.progress.style.width = `${((state.index + 1) / total) * 100}%`;
    el.qText.textContent = t(q.text);

    el.options.replaceChildren(...q.options.map((opt, i) => {
      const label = document.createElement('label');
      label.className = 'option' + (state.answers[state.index] === i ? ' selected' : '');
      label.innerHTML = '<input type="radio" name="answer"><span class="option-key"></span><span class="option-text"></span>';
      const input = label.querySelector('input');
      input.value = i;
      input.checked = state.answers[state.index] === i;
      input.addEventListener('change', () => selectAnswer(i));
      label.querySelector('.option-key').textContent = letters[state.lang][i] || i + 1;
      label.querySelector('.option-text').textContent = t(opt);
      return label;
    }));

    const last = state.index === total - 1;
    el.prev.disabled = state.index === 0;
    el.next.hidden = last;
    el.submit.hidden = !last;
    renderDots();
  }

  function renderDots() {
    el.dots.replaceChildren(...state.quiz.questions.map((_, i) => {
      const li = document.createElement('li');
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = num(i + 1);
      b.className = (i === state.index ? 'current ' : '') + (state.answers[i] !== null ? 'answered' : '');
      b.setAttribute('aria-label', `${i + 1}`);
      b.addEventListener('click', () => goTo(i));
      li.appendChild(b);
      return li;
    }));
  }

  function renderResult() {
    const r = state.result;
    el.ring.style.setProperty('--pct', r.percent);
    el.ring.classList.toggle('pass', r.passed);
    el.percent.textContent = `${num(r.percent)}%`;
    el.fraction.textContent = state.lang === 'ar'
      ? `${num(r.score)} من ${num(r.total)}`
      : `${r.score} / ${r.total}`;
    el.status.className = 'result-status ' + (r.passed ? 'pass' : 'fail');
    el.status.textContent = r.passed
      ? (state.lang === 'ar' ? 'ناجح — أحسنت!' : 'Passed — well done!')
      : (state.lang === 'ar' ? 'لم تجتز الاختبار' : 'Not passed yet');
    el.note.textContent = state.lang === 'ar'
      ? `درجة النجاح ${num(CONFIG.passingPercent)}%${r.timedOut ? ' — انتهى الوقت' : ''}`
      : `Passing score: ${CONFIG.passingPercent}%${r.timedOut ? ' — time ran out' : ''}`;

    const none = state.lang === 'ar' ? 'لم تُجب' : 'No answer';
    const yours = state.lang === 'ar' ? 'إجابتك' : 'Your answer';
    const right = state.lang === 'ar' ? 'الإجابة الصحيحة' : 'Correct answer';

    el.review.replaceChildren(...state.quiz.questions.map((q, i) => {
      const a = state.answers[i];
      const ok = a === q.correct;
      const li = document.createElement('li');
      li.className = ok ? 'correct' : 'wrong';
      const rows = [`<p class="rq"></p>`, `<p class="ra"><b>${yours}:</b> <span class="y"></span></p>`];
      if (!ok) rows.push(`<p class="ra"><b>${right}:</b> <span class="c"></span></p>`);
      if (q.explanation) rows.push('<p class="rx"></p>');
      li.innerHTML = rows.join('');
      li.querySelector('.rq').textContent = `${num(i + 1)}. ${t(q.text)}`;
      li.querySelector('.y').textContent = a === null ? none : t(q.options[a]);
      if (!ok) li.querySelector('.c').textContent = t(q.options[q.correct]);
      if (q.explanation) li.querySelector('.rx').textContent = t(q.explanation);
      return li;
    }));
  }

  /* ---------- 6. Timer ---------- */
  function remainingSeconds() {
    return Math.max(0, Math.ceil((state.endAt - Date.now()) / 1000));
  }

  function renderTimer() {
    const s = remainingSeconds();
    el.timerValue.textContent = mmss(s);
    el.timer.classList.toggle('warning', s <= CONFIG.warnAtSeconds && state.view === 'quiz');
  }

  function startTimer() {
    stopTimer();
    state.endAt = Date.now() + state.quiz.timeLimitSeconds * 1000;
    renderTimer();
    state.timerId = setInterval(() => {
      renderTimer();
      if (remainingSeconds() === 0) submitQuiz(true);
    }, 250);
  }

  function stopTimer() {
    clearInterval(state.timerId);
    state.timerId = null;
  }

  /* ---------- 7. Navigation ---------- */
  function selectAnswer(i) {
    state.answers[state.index] = i;
    renderQuestion();
  }

  function goTo(i) {
    state.index = Math.min(Math.max(i, 0), state.quiz.questions.length - 1);
    renderQuestion();
  }

  /* ---------- 8. Submit & result ---------- */
  function requestSubmit() {
    const left = state.quiz.questions.length - answeredCount();
    if (left === 0) return submitQuiz(false);
    el.confirmText.textContent = state.lang === 'ar'
      ? `لديك ${num(left)} سؤال بدون إجابة. هل تريد إنهاء الاختبار؟`
      : `You have ${left} unanswered question${left > 1 ? 's' : ''}. Submit anyway?`;
    el.confirm.showModal();
  }

  function submitQuiz(timedOut) {
    if (state.view === 'result') return;
    stopTimer();
    if (el.confirm.open) el.confirm.close();

    const total = state.quiz.questions.length;
    const score = state.quiz.questions.filter((q, i) => state.answers[i] === q.correct).length;
    const percent = Math.round((score / total) * 100);

    state.result = {
      quizId: state.quiz.id,
      score,
      total,
      percent,
      passed: percent >= CONFIG.passingPercent,
      timedOut: !!timedOut,
      answers: [...state.answers],
      secondsUsed: state.quiz.timeLimitSeconds - remainingSeconds(),
      submittedAt: new Date().toISOString(),
    };
    state.view = 'result';
    el.quizView.hidden = true;
    el.resultView.hidden = false;
    el.timer.classList.remove('warning');
    renderResult();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    saveResult(state.result).catch((e) => console.error('Saving quiz result failed:', e));
  }

  function resetQuiz() {
    state.index = 0;
    state.answers = Array(state.quiz.questions.length).fill(null);
    state.result = null;
    state.view = 'quiz';
    el.resultView.hidden = true;
    el.quizView.hidden = false;
    renderQuestion();
    startTimer();
  }

  /* ---------- 9. Init ---------- */
  function bindEvents() {
    el.prev.addEventListener('click', () => goTo(state.index - 1));
    el.next.addEventListener('click', () => goTo(state.index + 1));
    el.submit.addEventListener('click', requestSubmit);
    el.retry.addEventListener('click', resetQuiz);
    $('confirmYes').addEventListener('click', () => submitQuiz(false));
    $('confirmNo').addEventListener('click', () => el.confirm.close());

    const switchLang = (lang) => {
      state.lang = lang;
      localStorage.setItem(CONFIG.langStorageKey, lang);
      applyLang();
    };
    document.querySelectorAll('#langSwitch [data-lang]').forEach((n) => {
      n.addEventListener('click', () => switchLang(n.dataset.lang));
      n.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); switchLang(n.dataset.lang); } });
    });

    document.addEventListener('keydown', (e) => {
      if (state.view !== 'quiz' || el.confirm.open) return;
      if (e.key === 'ArrowRight') goTo(state.index + (state.lang === 'ar' ? -1 : 1));
      if (e.key === 'ArrowLeft') goTo(state.index + (state.lang === 'ar' ? 1 : -1));
    });
  }

  async function init() {
    Object.assign(el, {
      title: $('quizTitle'), topic: $('quizTopic'), timer: $('quizTimer'), timerValue: $('timerValue'),
      quizView: $('quizView'), resultView: $('resultView'), progress: $('progressBar'), count: $('questionCount'),
      qText: $('questionText'), options: $('options'), dots: $('qDots'),
      prev: $('prevBtn'), next: $('nextBtn'), submit: $('submitBtn'), retry: $('retryBtn'),
      ring: $('scoreRing'), percent: $('scorePercent'), fraction: $('scoreFraction'),
      status: $('resultStatus'), note: $('resultNote'), review: $('reviewList'),
      confirm: $('confirmDialog'), confirmText: $('confirmText'),
    });
    bindEvents();
    try {
      state.quiz = await loadQuiz();
    } catch (e) {
      console.error('Could not load quiz:', e);
      el.qText.textContent = state.lang === 'ar' ? 'تعذّر تحميل الاختبار.' : 'Could not load the quiz.';
      return;
    }
    state.answers = Array(state.quiz.questions.length).fill(null);
    applyLang();
    startTimer();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
