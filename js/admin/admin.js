import { api, t, esc, initLang } from "../panel/core.js";
import { getTabs } from "./registry.js";
import "./tabs/codeforcesTab.js"; // Members 2 and 3: add your own tab import on the next line.

const nav = document.getElementById("tabs"), body = document.getElementById("tab-body");
let current = location.hash.slice(1);

function show(id) {
  const tab = getTabs().find((x) => x.id === id) || getTabs()[0];
  current = tab.id; history.replaceState(null, "", "#" + tab.id);
  nav.innerHTML = getTabs().map((x) => `<button role="tab" aria-selected="${x.id === tab.id}" data-id="${esc(x.id)}" type="button">${esc(x.label())}</button>`).join("");
  nav.querySelectorAll("button").forEach((b) => (b.onclick = () => show(b.dataset.id)));
  body.innerHTML = ""; tab.render(body);
}

async function boot() {
  try {
    const me = await api("/auth/me");
    if (!me.isAdmin) throw Object.assign(new Error(), { status: 403 });
    show(current);
  } catch (e) {
    // The UI guard is only a convenience; the API enforces the Admin role.
    nav.remove();
    body.innerHTML = `<div class="banner" role="alert"><span>${e.status === 403 || e.status === 401 ? t("forbidden") : t("loadErr")}</span></div>`;
  }
}
initLang(() => nav.isConnected && show(current));
boot();
