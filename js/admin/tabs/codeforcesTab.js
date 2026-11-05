import { api, t, esc, errText, toast } from "../../panel/core.js";
import { registerAdminTab } from "../registry.js";

const PAGE = 10;
let page = 1, root;

async function load() {
  root.innerHTML = '<div class="skel"></div><div class="skel"></div>';
  try {
    const r = await api(`/admin/codeforces-problems?page=${page}&pageSize=${PAGE}`);
    const pages = Math.max(1, Math.ceil(r.total / PAGE));
    root.innerHTML = `<div class="row" style="justify-content:space-between"><h2>${t("cfProblems")}</h2><button class="btn sec" id="add" type="button">${t("addProblem")}</button></div>
      ${r.items.length ? `<div class="tbl-wrap"><table><thead><tr><th>ID</th><th>${t("pName")}</th><th>${t("rating")}</th><th>${t("tags")}</th><th></th><th></th></tr></thead><tbody>
      ${r.items.map((x) => `<tr><td dir="ltr">${esc(x.contestId + x.problemIndex)}</td><td><a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${esc(x.name)}</a></td>
        <td>${esc(x.rating ?? "-")}</td><td>${(x.tags || []).map((g) => `<span class="chip">${esc(g)}</span>`).join(" ")}</td>
        <td>${x.isActive ? `<span class="chip rate">${t("active")}</span>` : `<span class="chip off">${t("inactive")}</span>`}</td>
        <td class="row"><button class="btn" data-edit="${x.id}" type="button">${t("edit")}</button><button class="btn danger" data-del="${x.id}" type="button">${t("del")}</button></td></tr>`).join("")}
      </tbody></table></div>` : `<p class="empty">${t("noProblems")}</p>`}
      <div class="row"><button class="btn" id="prev" type="button" ${page <= 1 ? "disabled" : ""}>${t("prev")}</button><span>${t("page")} ${page} / ${pages}</span><button class="btn" id="next" type="button" ${page >= pages ? "disabled" : ""}>${t("next")}</button></div>`;
    root.querySelector("#add").onclick = () => form(null);
    root.querySelector("#prev").onclick = () => { page--; load(); };
    root.querySelector("#next").onclick = () => { page++; load(); };
    root.querySelectorAll("[data-edit]").forEach((b) => (b.onclick = () => form(r.items.find((x) => x.id == b.dataset.edit))));
    root.querySelectorAll("[data-del]").forEach((b) => (b.onclick = async () => {
      if (!confirm(t("confirmDel"))) return;
      try { await api(`/admin/codeforces-problems/${b.dataset.del}`, { method: "DELETE" }); toast(t("deleted")); load(); } catch (e) { toast(errText(e), "err"); }
    }));
  } catch (e) {
    root.innerHTML = `<div class="banner" role="alert"><span>${esc(errText(e))}</span><button class="btn" type="button">${t("retry")}</button></div>`;
    root.querySelector("button").onclick = load;
  }
}

function form(p) {
  const d = document.createElement("dialog");
  const f = (id, label, v = "", extra = "") => `<label>${label}<input id="${id}" value="${esc(v)}" ${extra}><span class="fld-err"></span></label>`;
  d.innerHTML = `<form novalidate>${f("contestId", t("contestId"), p?.contestId, 'inputmode="numeric" dir="ltr"')}${f("problemIndex", t("problemIndex"), p?.problemIndex, 'dir="ltr" maxlength="3"')}
    ${f("name", t("pName"), p?.name)}${f("url", t("url"), p?.url, 'dir="ltr"')}${f("rating", t("rating"), p?.rating, 'inputmode="numeric"')}${f("tags", t("tags"), (p?.tags || []).join(", "), 'dir="ltr"')}
    <label style="display:flex;gap:8px;align-items:center"><input type="checkbox" id="isActive" style="width:auto" ${p?.isActive ?? true ? "checked" : ""}>${t("active")}</label>
    <div class="row"><button class="btn sec" type="submit">${t("save")}</button><button class="btn" type="button" id="cancel">${t("cancel")}</button></div></form>`;
  document.body.append(d); d.showModal();
  const $ = (id) => d.querySelector("#" + id);
  const close = () => { d.close(); d.remove(); };
  $("cancel").onclick = close; d.addEventListener("cancel", close);
  d.querySelector("form").onsubmit = async (ev) => {
    ev.preventDefault();
    const rules = { contestId: (v) => (/^\d+$/.test(v) ? "" : t("numOnly")), problemIndex: (v) => (v ? "" : t("needField")), name: (v) => (v ? "" : t("needField")),
      url: (v) => (v.startsWith("https://codeforces.com/") ? "" : t("badUrl")), rating: (v) => (!v || /^\d+$/.test(v) ? "" : t("numOnly")) };
    let bad = false;
    for (const k in rules) { const el = $(k), m = rules[k](el.value.trim()); el.nextElementSibling.textContent = m; el.classList.toggle("error", !!m); bad ||= !!m; }
    if (bad) return;
    const body = { contestId: +$("contestId").value, problemIndex: $("problemIndex").value.trim().toUpperCase(), name: $("name").value.trim(), url: $("url").value.trim(),
      rating: $("rating").value ? +$("rating").value : null, tags: $("tags").value.split(",").map((s) => s.trim()).filter(Boolean), isActive: $("isActive").checked };
    try {
      await api(p ? `/admin/codeforces-problems/${p.id}` : "/admin/codeforces-problems", { method: p ? "PUT" : "POST", body });
      toast(t("saved")); close(); load();
    } catch (e) { toast(errText(e), "err"); }
  };
}

registerAdminTab({ id: "codeforces", label: () => t("cfProblems"), render(el) { root = el; load(); } });
