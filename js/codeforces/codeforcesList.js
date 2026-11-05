// Contract: renderCodeforcesList(container, topicId). Mount it from the Topic Page (Member 2).
import { api, t, esc, errText, ensureCss } from "../panel/core.js";

export async function renderCodeforcesList(container, topicId) {
  ensureCss();
  container.innerHTML = '<div class="skel"></div><div class="skel"></div>';
  try {
    const items = await api(`/topics/${topicId}/problems`);
    if (!items.length) { container.innerHTML = `<p class="empty">${t("noProblems")}</p>`; return; }
    const noHandle = items.every((x) => x.solved == null);
    const profile = new URL("../../pages/profile/profile.html", import.meta.url);
    container.innerHTML =
      `<ul class="cf-list">${items.map((x) => `
        <li class="cf-item">
          <span class="cf-tick ${x.solved ? "solved" : ""}" role="img" aria-label="${x.solved ? "solved" : "not solved"}">${x.solved ? "✓" : ""}</span>
          <div>
            <a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer" title="${t("openProblem")}">${esc(x.contestId + x.problemIndex)}. ${esc(x.name)}</a>
            <div class="cf-meta">
              ${x.rating ? `<span class="chip rate">${esc(x.rating)}</span>` : ""}
              ${x.role ? `<span class="chip role">${esc(x.role)}</span>` : ""}
              ${(x.tags || []).map((g) => `<span class="chip">${esc(g)}</span>`).join("")}
            </div>
          </div>
        </li>`).join("")}</ul>
      ${noHandle ? `<p class="cf-hint"><a href="${profile}">${t("connectHint")}</a></p>` : ""}`;
  } catch (e) {
    // A failed list must never break the host page.
    container.innerHTML = `<div class="banner" role="alert"><span>${esc(errText(e))}</span><button class="btn" type="button">${t("retry")}</button></div>`;
    container.querySelector("button").onclick = () => renderCodeforcesList(container, topicId);
  }
}
