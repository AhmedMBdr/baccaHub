import { language } from "./demo-data.js";

const translations = {
  en: { dashboard: "Dashboard", topics: "Topics", progress: "My progress", mistakes: "My mistakes", plan: "Study plan", profile: "Profile", logout: "Log out", navigation: "Learning menu", openMenu: "Open menu" },
  ar: { dashboard: "لوحة التحكم", topics: "الموضوعات", progress: "تقدمي", mistakes: "أخطائي", plan: "خطة المذاكرة", profile: "الملف الشخصي", logout: "تسجيل الخروج", navigation: "قائمة التعلم", openMenu: "فتح القائمة" }
};

export function shell({ active = "dashboard", content, title = "BaccaHub" }) {
  const lang = language(), t = translations[lang];
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.title = `${title} | BaccaHub`;
  document.body.className = "app-page page-pattern";
  document.body.innerHTML = `
    <header class="site-header"><div class="wrap">
      <a class="logo" href="../Index.html">Bacca<span>Hub</span></a>
      <div class="head-buttons">
        <button class="mobile-menu" type="button" aria-controls="app-navigation" aria-expanded="false">${t.openMenu}</button>
        <div class="lang" role="group" aria-label="Language"><span class="en" role="button" tabindex="0">English</span><span class="ar" role="button" tabindex="0">العربية</span></div>
        <a class="prim-btn" href="../Index.html">${t.logout}</a>
      </div>
    </div></header>
    <div class="app-shell">
      <aside class="app-sidebar" id="app-navigation"><div class="sidebar-label">${t.navigation}</div><nav class="app-nav">
        ${navLink("01", t.dashboard, "dashboard.html", active)}
        ${navLink("02", t.topics, "topics.html", active)}
        ${navLink("03", t.progress, "progress.html", active)}
        ${navLink("04", t.mistakes, "mistakes.html", active)}
        ${navLink("05", t.plan, "studyplan.html", active)}
        ${navLink("06", t.profile, "profile/profile.html", active)}
      </nav></aside>
      <main class="app-content"><div class="content-width">${content}</div></main>
    </div>`;
  bindLanguage();
  const menuButton = document.querySelector(".mobile-menu");
  const sidebar = document.querySelector(".app-sidebar");
  menuButton?.addEventListener("click", () => {
    const open = sidebar.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(open));
  });
}

function navLink(icon, label, href, active) {
  const key = href.replace(".html", "").split("/").pop();
  return `<a href="${href}" ${active === key ? 'aria-current="page"' : ""}><span class="nav-icon">${icon}</span>${label}</a>`;
}

function bindLanguage() {
  document.querySelectorAll(".lang span").forEach((el) => {
    el.classList.toggle("active", el.classList.contains(language()));
    el.addEventListener("click", () => { localStorage.setItem("selectedLang", el.classList.contains("ar") ? "ar" : "en"); location.reload(); });
    el.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); el.click(); } });
  });
}

export const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
