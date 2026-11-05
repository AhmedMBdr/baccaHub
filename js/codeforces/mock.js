// In-memory fake API so the pages run before the backend exists. Remove with USE_MOCK.
const ok = (v) => new Promise((r) => setTimeout(() => r(v === undefined ? null : structuredClone(v)), 200));
const fail = (code, message, status = 400) => Promise.reject(Object.assign(new Error(message), { code, status }));
const U = (c, i) => `https://codeforces.com/problemset/problem/${c}/${i}`;
let nextId = 4, acct = null;
const problems = [
  { id: 1, contestId: 4, problemIndex: "A", name: "Watermelon", url: U(4, "A"), rating: 800, tags: ["math", "brute force"], isActive: true, role: "Practice" },
  { id: 2, contestId: 71, problemIndex: "A", name: "Way Too Long Words", url: U(71, "A"), rating: 800, tags: ["strings"], isActive: true, role: "Practice" },
  { id: 3, contestId: 231, problemIndex: "A", name: "Team", url: U(231, "A"), rating: 800, tags: ["greedy"], isActive: true, role: "Required" },
];
const solvedKeys = new Set(["4A"]);

export function mockApi(path, method, body) {
  const [p, qs] = path.split("?");
  const q = new URLSearchParams(qs || "");
  if (p === "/auth/me" && method === "GET") return ok({ name: "Ahmed", email: "ahmed@example.com", preferredLanguage: "ar", isAdmin: true });
  if (p === "/auth/me") return ok({});
  if (p === "/codeforces/status") return ok(acct ? { connected: true, ...acct } : { connected: false });
  if (p === "/codeforces/connect" && method === "POST") {
    const h = (body?.handle || "").trim();
    if (h.toLowerCase() === "invalid") return fail("CF_HANDLE_INVALID", "Handle not found", 422);
    acct = { handle: h, rating: 1200, maxRating: 1310, rank: "pupil", lastSyncedAt: null, isValid: true };
    return ok({});
  }
  if (p === "/codeforces/connect") { acct = null; return ok(); }
  if (p === "/codeforces/sync") { if (acct) acct.lastSyncedAt = new Date().toISOString(); return ok({}); }
  if (/^\/topics\/\d+\/problems$/.test(p))
    return ok(problems.filter((x) => x.isActive).map((x) => ({ ...x, solved: acct ? solvedKeys.has(x.contestId + x.problemIndex) : null })));
  if (p === "/admin/codeforces-problems" && method === "GET") {
    const page = +q.get("page") || 1, size = +q.get("pageSize") || 10;
    return ok({ items: problems.slice((page - 1) * size, page * size), total: problems.length, page, pageSize: size });
  }
  if (p === "/admin/codeforces-problems" && method === "POST") { problems.push({ ...body, id: nextId++, role: "Practice" }); return ok({}); }
  const m = p.match(/^\/admin\/codeforces-problems\/(\d+)$/);
  if (m) {
    const i = problems.findIndex((x) => x.id === +m[1]);
    if (i < 0) return fail("NOT_FOUND", "Not found", 404);
    if (method === "PUT") Object.assign(problems[i], body); else problems.splice(i, 1);
    return ok();
  }
  return fail("NOT_FOUND", "Unknown mock route " + path, 404);
}
