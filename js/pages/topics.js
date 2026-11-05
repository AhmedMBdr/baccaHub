import { shell, esc } from "../core/app-shell.js";
import { topics, text } from "../core/demo-data.js";

shell({
  active: "topics",
  title: text({ en: "Topics", ar: "الموضوعات" }),
  content: `<header class="page-heading"><div><p class="eyebrow">${text({ en: "CURRICULUM", ar: "المنهج" })}</p><h1>${text({ en: "Choose your next concept.", ar: "اختر مفهومك التالي." })}</h1><p>${text({ en: "Follow the curriculum, practise each idea, and see why a topic is recommended.", ar: "اتبع المنهج وطبّق كل فكرة واعرف سبب ترشيح الموضوع." })}</p></div></header><section class="topic-grid">${topics.map((topic) => `<article class="surface topic-card"><div><span class="badge ${topic.mastery === null ? "" : topic.mastery < 60 ? "danger" : "warning"}">${topic.mastery === null ? text({ en: "Not assessed", ar: "لم يتم التقييم" }) : `${topic.mastery}% mastery`}</span><h2>${esc(text(topic.title))}</h2><p>${esc(text(topic.description))}</p></div><div class="topic-card-footer"><span class="muted">${topic.minutes} min · ${esc(text(topic.reason))}</span><a class="prim-btn" href="topic.html?id=${topic.id}">${text({ en: "Open", ar: "افتح" })}</a></div></article>`).join("")}</section>`,
});
