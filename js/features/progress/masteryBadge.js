// frontend/baccacode-web/js/features/progress/masteryBadge.js

/**
 * دالة مشتركة يتم تصديرها لزميلك (m2) ليعرض نسبة الإتقان أو حالة عدم التقييم.
 * يتم الاعتماد على Vanilla JS و Bootstrap Classes فقط.
 */
export async function renderMasteryBadge(container, topicId) {
    // 1. تنظيف الحاوية ووضع حالة تحميل مبدئية
    container.innerHTML = `<span class="badge bg-secondary">Loading...</span>`;

    try {
        // 2. جلب البيانات (مؤقتاً سنستخدم دالة وهمية بدلاً من fetch الحقيقي)
        const progressData = await fetchMockProgress(topicId);

        // 3. بناء الشارة (Badge) بناءً على حالة الإتقان
        if (!progressData || progressData.masteryScore === null) {
            // حالة: لم يتم التقييم بعد (Not assessed)
            container.innerHTML = `<span class="badge bg-light text-dark border">Not assessed</span>`;
        } else {
            // حالة: يوجد تقييم، نغير اللون بناءً على النسبة
            const score = progressData.masteryScore;
            let badgeClass = "bg-danger"; // ضعيف
            
            if (score >= 85) {
                badgeClass = "bg-success"; // ممتاز (Completed)
            } else if (score >= 70) {
                badgeClass = "bg-primary"; // جيد جداً
            } else if (score >= 40) {
                badgeClass = "bg-warning text-dark"; // متوسط
            }

            container.innerHTML = `<span class="badge ${badgeClass}">${score}% Mastery</span>`;
        }
    } catch (error) {
        console.error(`Error rendering mastery badge for topic ${topicId}:`, error);
        container.innerHTML = `<span class="badge bg-danger">Error</span>`;
    }
}

/**
 * دالة وهمية لمحاكاة استجابة الباك إيند (سيتم استبدالها بـ fetch لاحقاً)
 */
async function fetchMockProgress(topicId) {
    // محاكاة تأخير الشبكة
    await new Promise(resolve => setTimeout(resolve, 300));

    // بيانات وهمية لاختبار الحالات المختلفة
    const mockDatabase = {
        1: { topicId: 1, masteryScore: 90 }, // Completed
        2: { topicId: 2, masteryScore: 75 }, // Good
        3: { topicId: 3, masteryScore: 45 }, // Needs review
        4: { topicId: 4, masteryScore: null } // Not assessed
    };

    return mockDatabase[topicId] || { topicId: topicId, masteryScore: null };
}