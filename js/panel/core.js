import { dict } from "./lang.js";
import { mockApi } from "../codeforces/mock.js";

// Set USE_MOCK to false once the backend runs. BASE and the token key are assumptions: align them with Member 1's core/api.js.
export const USE_MOCK = true;
const BASE = "/api/v1";

export const getLang = () => localStorage.getItem("selectedLang") || "ar";
export const t = (k) => (dict[getLang()] || dict.en)[k] ?? k;
export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
export const errText = (e) => (e && dict.en[e.code] ? t(e.code) : e?.message || t("loadErr"));

export function applyLang() {
  const l = getLang(), h = document.documentElement;
  h.lang = l; h.dir = l === "ar" ? "rtl" : "ltr";
  h.style.setProperty("--direction", h.dir);
  document.querySelectorAll(".lng").forEach((e) => (e.textContent = t(e.dataset.lng)));
  document.querySelectorAll("[data-ph]").forEach((e) => (e.placeholder = t(e.dataset.ph)));
  document.querySelectorAll(".lang span").forEach((s) => s.classList.toggle("active", s.classList.contains(l)));
}
export function initLang(onChange = () => {}) {
  applyLang();
  document.querySelectorAll(".lang span").forEach((s) =>
    s.addEventListener("click", () => {
      localStorage.setItem("selectedLang", s.classList.contains("ar") ? "ar" : "en");
      applyLang(); onChange();
    }));
}

export async function api(path, { method = "GET", body } = {}) {
  if (USE_MOCK) return mockApi(path, method, body);
  const r = await fetch(BASE + path, {
    method,
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + (localStorage.getItem("accessToken") || "") },
    body: body && JSON.stringify(body),
  });
  const j = r.status === 204 ? null : await r.json().catch(() => null);
  if (!r.ok) throw Object.assign(new Error(j?.message || r.statusText), { code: j?.code, status: r.status });
  return j;
}

export function toast(msg, type = "ok") {
  const d = document.createElement("div");
  d.className = "toast " + (type === "err" ? "err" : "");
  d.setAttribute("role", "status"); d.textContent = msg;
  document.body.append(d); setTimeout(() => d.remove(), 3500);
}
export function ensureCss() {
  if (document.getElementById("panel-css")) return;
  const l = document.createElement("link");
  l.id = "panel-css"; l.rel = "stylesheet"; l.href = new URL("../../css/panel.css", import.meta.url);
  document.head.append(l);
}
