import { shell, esc } from "../core/app-shell.js";
import { topics, text } from "../core/demo-data.js";

const topic = topics.find((item) => item.id === Number(new URLSearchParams(location.search).get("id"))) ?? topics[3];
shell({
  active: "topics",
  title: text(topic.title),
  content: `<header class="page-heading"><div><a class="muted" href="topics.html">← ${text({ en: "All topics", ar: "كل الموضوعات" })}</a><p class="eyebrow lesson-eyebrow">${text({ en: "TOPIC LESSON", ar: "درس الموضوع" })}</p><h1>${esc(text(topic.title))}</h1><p>${esc(text(topic.description))}</p></div><span class="badge warning">${topic.mastery ?? text({ en: "Not assessed", ar: "لم يتم التقييم" })}${topic.mastery ? "%" : ""}</span></header>
  <div class="detail-grid"><article class="surface surface-pad lesson"><h2>${text({ en: "The idea", ar: "الفكرة" })}</h2><p>${text({ en: "A program becomes useful when it can repeat a reliable action. In Python, loops let you describe that repetition clearly and stop when the work is done.", ar: "يصبح البرنامج مفيدًا عندما يستطيع تكرار إجراء موثوق. في Python تتيح لك الحلقات وصف التكرار بوضوح والتوقف عند انتهاء العمل." })}</p><pre class="code-block"><button class="copy-code" type="button">${text({ en: "Copy", ar: "نسخ" })}</button><code>for number in range(1, 4):
    print(f"Step {number}")</code></pre><h2>${text({ en: "Worked problem", ar: "مسألة محلولة" })}</h2><div class="worked-problem"><details><summary>${text({ en: "Show the solution", ar: "أظهر الحل" })}</summary><p>${text({ en: "Use range to control how many times the action runs, then keep the body of the loop indented.", ar: "استخدم range للتحكم في عدد مرات التنفيذ، وحافظ على إزاحة جسم الحلقة." })}</p></details></div></article>
  <aside class="surface surface-pad"><h2 class="section-title">${text({ en: "Your next actions", ar: "خطواتك التالية" })}</h2><ul class="list"><li class="list-item"><span>${text({ en: "Review the lesson", ar: "راجع الدرس" })}</span><span class="badge">10 min</span></li><li class="list-item"><span>${text({ en: "Solve practice", ar: "حل مسائل تدريبية" })}</span><a class="score" href="codeforces/demo.html">→</a></li><li class="list-item"><span>${text({ en: "Check understanding", ar: "اختبر فهمك" })}</span><a class="score" href="quiz.html">→</a></li></ul></aside></div>`,
});

document.addEventListener("click", async (event) => {
  const button = event.target.closest(".copy-code");
  if (!button) return;
  await navigator.clipboard?.writeText(button.nextElementSibling.textContent);
  button.textContent = text({ en: "Copied", ar: "تم النسخ" });
  setTimeout(() => { button.textContent = text({ en: "Copy", ar: "نسخ" }); }, 1400);
});
