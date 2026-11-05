// Other members add their own tab: import { registerAdminTab } from "../registry.js"; registerAdminTab({ id, label, render })
// label is a function so it follows the current language. render(container) draws into the tab body.
const tabs = [];
export function registerAdminTab({ id, label, render }) { if (!tabs.some((x) => x.id === id)) tabs.push({ id, label, render }); }
export const getTabs = () => tabs;
