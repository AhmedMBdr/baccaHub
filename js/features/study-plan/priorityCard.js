//    عملت الفايل ده عشان ميمبر 5 لسه معملهوش موقتا

/**
 *
 * عملت النسخة دي موقتا عشان اشغل الداش بورد
 */
export async function renderPriorityCard(container) {
    // حالة التحميل (Empty / Loading State)
    container.innerHTML = `<div class="text-center p-3"><div class="spinner-border text-primary spinner-border-sm"></div></div>`;
    
    // محاكاة تأخير الشبكة
    await new Promise(resolve => setTimeout(resolve, 400));

    // تصميم الكارت بناءً على الـ Spec
    container.innerHTML = `
        <div class="card h-100 border-warning shadow-sm">
            <div class="card-header bg-warning text-dark fw-bold">
                <i class="bi bi-star-fill me-2"></i>Priority Topic
            </div>
            <div class="card-body">
                <h5 class="card-title">Loops <span class="badge bg-danger float-end">42%</span></h5>
                <p class="card-text text-muted small mt-3"><strong>Reason:</strong> Low mastery and 3 repeated mistakes.</p>
                <button class="btn btn-warning w-100 mt-2">Review Now</button>
            </div>
        </div>
    `;
}