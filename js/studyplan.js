import { checkLang } from "./index/functions.js";

const translations = {
  en: {
    dashboard: "Dashboard", topics: "Topics", progress: "My progress", mistakes: "My mistakes", plan: "Study plan", profile: "Profile", navigation: "Learning menu", openMenu: "Open menu",
    logout: "Back home", eyebrow: "YOUR NEXT BEST STEP", title: "A study plan that moves with you.",
    intro: "Start with the topic that needs attention, practise it, then prove what you know. Your quiz history will refine this plan over time.",
    now: "Start here", next: "Then practise", after: "After that", step1Title: "Review Loops", step1Text: "Your current mastery is 42%, so a short review will give you the strongest improvement.",
    step2Title: "Solve two guided problems", step2Text: "Apply the idea with a worked example and curated Codeforces problems.",
    step3Title: "Take the Loops quiz", step3Text: "Check your understanding and let the next recommendation update automatically.",
    review: "Review the topic", practice: "Open practice", quiz: "Take the quiz", whyEyebrow: "WHY THIS TOPIC", whyTitle: "Loops is your priority.", whyText: "Low mastery and repeated mistakes make this the highest-value place to continue.", mastery: "Current mastery", dashboard: "View your profile", footer: "Recommendations become sharper after every quiz."
  },
  ar: {
    dashboard: "لوحة التحكم", topics: "الموضوعات", progress: "تقدمي", mistakes: "أخطائي", plan: "خطة المذاكرة", profile: "الملف الشخصي", navigation: "قائمة التعلم", openMenu: "فتح القائمة",
    logout: "العودة للرئيسية", eyebrow: "خطوتك الأفضل التالية", title: "خطة مذاكرة تتحرك معك.",
    intro: "ابدأ بالموضوع الذي يحتاج إلى اهتمام، طبّقه، ثم أثبت ما فهمته. ستتحسن الخطة مع كل اختبار جديد.",
    now: "ابدأ هنا", next: "ثم طبّق", after: "بعد ذلك", step1Title: "راجع الحلقات التكرارية", step1Text: "إتقانك الحالي 42%، لذلك ستمنحك مراجعة قصيرة أكبر تحسن ممكن.",
    step2Title: "حل مسألتين موجهتين", step2Text: "طبّق الفكرة من خلال مثال محلول ومسائل مختارة من Codeforces.",
    step3Title: "اختبر نفسك في الحلقات", step3Text: "تحقق من فهمك ودع التوصية التالية تتحدث تلقائيًا.", review: "راجع الموضوع", practice: "افتح التدريب", quiz: "ابدأ الاختبار", whyEyebrow: "لماذا هذا الموضوع؟", whyTitle: "الحلقات هي أولويتك.", whyText: "ضعف الإتقان وتكرار الأخطاء يجعلان هذا الموضوع أفضل مكان للاستمرار.", mastery: "الإتقان الحالي", dashboard: "شاهد ملفك الشخصي", footer: "تصبح التوصيات أدق بعد كل اختبار."
  }
};

const ar = document.querySelector(".ar");
const en = document.querySelector(".en");
const setLanguage = (language) => {
  const direction = language === "ar" ? "rtl" : "ltr";
  const selected = translations[language];
  document.documentElement.lang = language;
  document.documentElement.dir = direction;
  document.documentElement.style.setProperty("--direction", direction);
  document.documentElement.style.setProperty("--flex-direction", language === "ar" ? "row-reverse" : "row");
  document.querySelectorAll(".lng").forEach((element) => { element.textContent = selected[element.dataset.lng] || element.textContent; });
  localStorage.setItem("selectedLang", language);
};

const bind = (element, other, language) => {
  element.addEventListener("click", () => { checkLang(element, other, language === "ar" ? "rtl" : "ltr", language === "ar" ? "row-reverse" : "row"); setLanguage(language); });
  element.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") element.click(); });
};
const menuButton = document.querySelector(".mobile-menu");
const sidebar = document.querySelector(".app-sidebar");
menuButton?.addEventListener("click", () => {
  const open = sidebar.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(open));
});
bind(ar, en, "ar");
bind(en, ar, "en");
const initial = localStorage.getItem("selectedLang") === "ar" ? "ar" : "en";
checkLang(initial === "ar" ? ar : en, initial === "ar" ? en : ar, initial === "ar" ? "rtl" : "ltr", initial === "ar" ? "row-reverse" : "row");
setLanguage(initial);
