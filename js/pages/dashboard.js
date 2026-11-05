import { shell, esc } from "../core/app-shell.js";
import { topics, recentQuizzes, text } from "../core/demo-data.js";

const priority = topics.find((topic) => topic.id === 4);
shell({
  active: "dashboard",
  title: text({ en: "Dashboard", ar: "لوحة التحكم" }),
  content: `
    <header class="page-heading"><div><p class="eyebrow">${text({ en: "YOUR LEARNING SNAPSHOT", ar: "ملخص رحلتك التعليمية" })}</p><h1>${text({ en: "Welcome back, Ahmed.", ar: "مرحبًا بعودتك يا أحمد." })}</h1><p>${text({ en: "Keep your momentum. Your next best step is ready.", ar: "حافظ على تقدمك. خطوتك التالية جاهزة." })}</p></div><a class="sec-btn" href="studyplan.html">${text({ en: "Open study plan", ar: "افتح خطة المذاكرة" })}</a></header>
    <section class="stats-grid" aria-label="Learning statistics">
      ${stat(text({ en: "Overall mastery", ar: "الإتقان العام" }), "67%")}${stat(text({ en: "Topics completed", ar: "الموضوعات المكتملة" }), "2 / 6")}${stat(text({ en: "Average quiz score", ar: "متوسط الاختبارات" }), "72%")}${stat(text({ en: "Problems solved", ar: "المسائل المحلولة" }), "18")}
    </section>
    <div class="dashboard-grid">
      <section class="surface surface-pad"><h2 class="section-title">${text({ en: "Recent quizzes", ar: "الاختبارات الأخيرة" })}<a href="quiz-history.html">${text({ en: "View history", ar: "عرض السجل" })}</a></h2><ul class="list">${recentQuizzes.map((quiz) => `<li class="list-item"><span><strong>${esc(quiz.topic)}</strong><small class="muted"> · ${quiz.date}</small></span><span class="score">${quiz.score}%</span></li>`).join("")}</ul></section>
      <section class="surface surface-pad priority-card"><p class="eyebrow">${text({ en: "PRIORITY TOPIC", ar: "الموضوع ذو الأولوية" })}</p><h2>${esc(text(priority.title))}</h2><p class="muted">${esc(text(priority.reason))}</p><div class="progress-track priority-progress"><span></span></div><div class="topic-card-footer"><span class="score">${priority.mastery}%</span><a class="sec-btn" href="topic.html?id=${priority.id}">${text({ en: "Review now", ar: "راجع الآن" })}</a></div></section>
    </div>
    <section class="surface surface-pad space-top"><h2 class="section-title">${text({ en: "Recommended today", ar: "المهام المقترحة اليوم" })}</h2><div class="topic-grid">${topics.slice(2, 5).map((topic) => `<a class="topic-card" href="topic.html?id=${topic.id}"><span class="badge ${topic.mastery < 50 ? "danger" : "warning"}">${topic.mastery ?? text({ en: "Not assessed", ar: "لم يتم التقييم" })}${topic.mastery ? "%" : ""}</span><h2>${esc(text(topic.title))}</h2><p>${esc(text(topic.description))}</p><div class="topic-card-footer"><span class="muted">${topic.minutes} min</span><span class="score">→</span></div></a>`).join("")}</div></section>`,
});

function stat(label, value) { return `<article class="surface stat-card"><span>${label}</span><strong>${value}</strong></article>`; }
document.querySelector(".priority-progress span").style.width = `${priority.mastery}%`;
