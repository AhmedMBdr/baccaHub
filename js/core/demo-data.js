export const topics = [
  { id: 1, title: { en: "Introduction to Programming", ar: "مقدمة في البرمجة" }, description: { en: "The building blocks of Python and computational thinking.", ar: "أساسيات Python والتفكير الحاسوبي." }, minutes: 25, mastery: 78, reason: { en: "Keep your fundamentals fresh.", ar: "حافظ على قوة الأساسيات." } },
  { id: 2, title: { en: "Variables and Data Types", ar: "المتغيرات وأنواع البيانات" }, description: { en: "Store, transform, and reason about data.", ar: "خزّن البيانات وحوّلها وافهمها." }, minutes: 30, mastery: 88, reason: { en: "You are ready for more practice.", ar: "أنت مستعد لمزيد من التدريب." } },
  { id: 3, title: { en: "Conditions", ar: "الشروط" }, description: { en: "Make programs choose the right path.", ar: "اجعل برامجك تختار المسار الصحيح." }, minutes: 35, mastery: 61, reason: { en: "A short quiz can confirm your progress.", ar: "اختبار قصير يمكنه تأكيد تقدمك." } },
  { id: 4, title: { en: "Loops", ar: "الحلقات التكرارية" }, description: { en: "Repeat work with confidence and control.", ar: "كرر الأوامر بثقة وتحكم." }, minutes: 40, mastery: 42, reason: { en: "Low mastery and repeated mistakes.", ar: "ضعف الإتقان وتكرار الأخطاء." } },
  { id: 5, title: { en: "Functions", ar: "الدوال" }, description: { en: "Write reusable, readable pieces of logic.", ar: "اكتب منطقًا قابلًا لإعادة الاستخدام." }, minutes: 35, mastery: null, reason: { en: "Not assessed yet.", ar: "لم يتم تقييمه بعد." } },
  { id: 6, title: { en: "Lists", ar: "القوائم" }, description: { en: "Work with collections of values.", ar: "تعامل مع مجموعات من القيم." }, minutes: 35, mastery: null, reason: { en: "Unlock this after Functions.", ar: "افتح هذا الموضوع بعد الدوال." } }
];

export const recentQuizzes = [
  { topic: "Conditions", score: 84, date: "Today" },
  { topic: "Variables and Data Types", score: 78, date: "Yesterday" },
  { topic: "Loops", score: 42, date: "Oct 30" }
];

export const mistakes = [
  { topic: "Loops", question: "What does range(3) produce?", chosen: "[1, 2, 3]", correct: "[0, 1, 2]", times: 3, explanation: "Python starts range at zero by default." },
  { topic: "Conditions", question: "Which keyword handles the alternative branch?", chosen: "otherwise", correct: "else", times: 1, explanation: "else runs when the if condition is false." }
];

export function language() { return localStorage.getItem("selectedLang") === "ar" ? "ar" : "en"; }
export function text(value) { return value?.[language()] ?? value?.en ?? value ?? ""; }
