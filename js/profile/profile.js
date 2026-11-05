import { api, t, esc, errText, initLang, toast } from "../panel/core.js";

const $acc = document.getElementById("account"), $cf = document.getElementById("codeforces");
const banner = (el, e, retry) => {
  el.innerHTML = `<div class="banner" role="alert"><span>${esc(errText(e))}</span><button class="btn" type="button">${t("retry")}</button></div>`;
  el.querySelector("button").onclick = retry;
};
let me = null, status = null;

function drawAccount() {
  $acc.innerHTML = `<form id="accForm" style="display:grid;gap:14px" novalidate>
    <label>${t("name")}<input id="name" value="${esc(me.name)}" required minlength="3"><span class="fld-err"></span></label>
    <label>${t("email")}<input value="${esc(me.email)}" readonly></label>
    <label>${t("language")}<select id="plang"><option value="ar">العربية</option><option value="en">English</option></select></label>
    <button class="btn sec" type="submit">${t("save")}</button></form>`;
  $acc.querySelector("#plang").value = me.preferredLanguage;
  $acc.querySelector("form").onsubmit = async (ev) => {
    ev.preventDefault();
    const n = $acc.querySelector("#name"), err = n.nextElementSibling;
    err.textContent = n.value.trim().length < 3 ? t("needField") : "";
    n.classList.toggle("error", !!err.textContent);
    if (err.textContent) return;
    const preferredLanguage = $acc.querySelector("#plang").value;
    try {
      await api("/auth/me", { method: "PATCH", body: { name: n.value.trim(), preferredLanguage } });
      me = { ...me, name: n.value.trim(), preferredLanguage };
      localStorage.setItem("selectedLang", preferredLanguage); initLang(drawAll); drawAll(); toast(t("saved"));
    } catch (e) { toast(errText(e), "err"); }
  };
}

function drawCf() {
  if (!status.connected) {
    $cf.innerHTML = `<p class="lead">${t("cfIntro")}</p><form id="cfForm" style="display:grid;gap:14px" novalidate>
      <label>${t("handle")}<input id="handle" autocomplete="off" dir="ltr"><span class="fld-err"></span></label>
      <button class="btn sec" type="submit">${t("connect")}</button></form>`;
    $cf.querySelector("form").onsubmit = (ev) => act(ev, async () => {
      const i = $cf.querySelector("#handle"), err = i.nextElementSibling, h = i.value.trim();
      err.textContent = h.length < 3 ? t("needHandle") : ""; i.classList.toggle("error", !!err.textContent);
      if (err.textContent) return false;
      try { await api("/codeforces/connect", { method: "POST", body: { handle: h } }); toast(t("linked")); }
      catch (e) { err.textContent = errText(e); i.classList.add("error"); return false; }
    });
    return;
  }
  const s = status, d = s.lastSyncedAt ? new Date(s.lastSyncedAt).toLocaleString(document.documentElement.lang) : t("never");
  $cf.innerHTML = `<dl class="dl">
    <dt>${t("handle")}</dt><dd dir="ltr"><a href="https://codeforces.com/profile/${encodeURIComponent(s.handle)}" target="_blank" rel="noopener noreferrer">${esc(s.handle)}</a> <span class="chip rate">${t("connected")}</span></dd>
    <dt>${t("rating")}</dt><dd>${esc(s.rating ?? "-")}</dd><dt>${t("maxRating")}</dt><dd>${esc(s.maxRating ?? "-")}</dd><dt>${t("rank")}</dt><dd>${esc(s.rank ?? "-")}</dd>
    <dt>${t("valid")}</dt><dd>${s.isValid ? t("validOk") : `<span class="chip off">${t("validBad")}</span>`}</dd><dt>${t("lastSync")}</dt><dd>${esc(d)}</dd></dl>
    <div class="row"><button class="btn sec" id="sync" type="button">${t("syncNow")}</button><button class="btn danger" id="unlink" type="button">${t("disconnect")}</button></div>`;
  $cf.querySelector("#sync").onclick = (ev) => act(ev, async () => { await api("/codeforces/sync", { method: "POST" }); toast(t("synced")); });
  $cf.querySelector("#unlink").onclick = (ev) => act(ev, async () => { await api("/codeforces/connect", { method: "DELETE" }); toast(t("disconnected")); });
}

// Runs an action with the button disabled, then reloads the Codeforces status.
async function act(ev, fn) {
  ev.preventDefault();
  const b = ev.currentTarget.matches("button") ? ev.currentTarget : ev.currentTarget.querySelector("button");
  b.disabled = true;
  try { if ((await fn()) === false) return; await loadCf(); } catch (e) { toast(errText(e), "err"); } finally { b.disabled = false; }
}

async function loadAcc() { try { me = await api("/auth/me"); drawAccount(); } catch (e) { banner($acc, e, loadAcc); } }
async function loadCf() { try { status = await api("/codeforces/status"); drawCf(); } catch (e) { banner($cf, e, loadCf); } }
function drawAll() { if (me) drawAccount(); if (status) drawCf(); }

initLang(drawAll);
document.getElementById("logout").onclick = () => { localStorage.removeItem("accessToken"); location.href = "../auth/login.html"; };
loadAcc(); loadCf();
