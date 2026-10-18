// frontend/baccacode-web/js/features/mistakes/mistakesPage.js

/**
 * صفحة أخطائي (My Mistakes)
 * مسؤولة عن جلب الأخطاء مجمعة حسب الموضوع وعرض تفاصيل كل خطأ.
 * يُعتمد على نصوص الـ (Snapshot) المخزنة وقت الإجابة لضمان الدقة (وفقاً للـ Spec).
 */

// استيراد الدوال الأساسية (بافتراض أن m1 قد وفرها، أو سنقوم بإنشاء نسخ بسيطة منها)
import { apiFetch } from '../../core/api.js';
export async function renderMistakesPage(container) {
    container.innerHTML = `
        <div class="container mt-4">
            <h2 class="mb-4">My Mistakes <span class="badge bg-danger fs-6" id="totalMistakesBadge">0</span></h2>
            
            <!-- حاوية عرض الأخطاء المجمعة -->
            <div id="mistakesListContainer" class="row g-4">
                <div class="col-12 text-center py-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>

            <!-- Modal لعرض تفاصيل الخطأ (بناءً على الـ Snapshot) -->
            <div class="modal fade" id="mistakeDetailModal" tabindex="-1" aria-labelledby="mistakeDetailModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-light">
                            <h5 class="modal-title" id="mistakeDetailModalLabel">Mistake Analysis</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body" id="mistakeDetailBody">
                            <!-- محتوى الخطأ سيتم حقنه هنا -->
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" id="btnReviewTopic">Review Topic</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    await loadMistakes(container);
}

async function loadMistakes(container) {
    const listContainer = container.querySelector('#mistakesListContainer');
    const badge = container.querySelector('#totalMistakesBadge');

    try {
        // سيتم استبدال هذا لاحقاً بـ API حقيقي (GET /api/v1/students/me/mistakes)
        const mistakesData = await fetchMockMistakesData();

        if (!mistakesData || mistakesData.length === 0) {
            listContainer.innerHTML = `
                <div class="col-12 text-center py-5 text-success">
                    <i class="bi bi-check-circle display-4"></i>
                    <p class="mt-3 lead">Great job! You have no unresolved mistakes.</p>
                </div>
            `;
            badge.textContent = '0';
            return;
        }

        let totalUnresolved = 0;
        listContainer.innerHTML = ''; // تنظيف حالة التحميل

        // تجميع الأخطاء حسب الموضوع (كما هو مطلوب في الـ Spec)
        mistakesData.forEach(topicGroup => {
            totalUnresolved += topicGroup.mistakes.length;

            const cardHtml = `
                <div class="col-md-6 col-lg-4">
                    <div class="card h-100 border-danger shadow-sm">
                        <div class="card-header bg-danger text-white d-flex justify-content-between align-items-center">
                            <h5 class="card-title mb-0">${topicGroup.topicName}</h5>
                            <span class="badge bg-light text-danger rounded-pill">${topicGroup.mistakes.length} mistakes</span>
                        </div>
                        <ul class="list-group list-group-flush" style="max-height: 250px; overflow-y: auto;">
                            ${topicGroup.mistakes.map((mistake, index) => `
                                <button type="button" 
                                        class="list-group-item list-group-item-action mistake-item-btn"
                                        data-mistake='${JSON.stringify(mistake).replace(/'/g, "&#39;")}'>
                                    <div class="d-flex w-100 justify-content-between">
                                        <h6 class="mb-1 text-truncate" style="max-width: 80%;">${mistake.questionTextSnapshot}</h6>
                                    </div>
                                    <small class="text-muted">Missed ${mistake.timesMissed} time(s)</small>
                                </button>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            `;
            listContainer.insertAdjacentHTML('beforeend', cardHtml);
        });

        badge.textContent = totalUnresolved;

        // تفعيل أزرار فتح تفاصيل الأخطاء
        attachMistakeClickEvents(container);

    } catch (error) {
        console.error("Error loading mistakes:", error);
        listContainer.innerHTML = `
            <div class="col-12 text-center text-danger py-4">
                <p>Error loading mistakes data. Please try again later.</p>
            </div>
        `;
    }
}

function attachMistakeClickEvents(container) {
    const buttons = container.querySelectorAll('.mistake-item-btn');
    
    // التأكد من وجود Bootstrap في الصفحة لفتح المودال (سيتم تحميله من Index.html)
    const modalElement = document.getElementById('mistakeDetailModal');
    let bsModal;
    if (window.bootstrap) {
        bsModal = new bootstrap.Modal(modalElement);
    }

    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const mistake = JSON.parse(btn.getAttribute('data-mistake'));
            showMistakeDetails(mistake);
            if (bsModal) bsModal.show();
        });
    });
}

function showMistakeDetails(mistake) {
    const detailBody = document.getElementById('mistakeDetailBody');
    const reviewBtn = document.getElementById('btnReviewTopic');

    detailBody.innerHTML = `
        <div class="mb-3">
            <span class="badge bg-warning text-dark mb-2">Repeated: ${mistake.timesMissed} times</span>
            <span class="badge bg-secondary mb-2">Status: Unresolved</span>
            <h5 class="fw-bold mt-2">Question:</h5>
            <p class="p-3 bg-light border rounded">${mistake.questionTextSnapshot}</p>
        </div>
        
        <div class="row mb-3">
            <div class="col-md-6">
                <h6 class="text-danger"><i class="bi bi-x-circle me-1"></i>You answered:</h6>
                <div class="p-2 border border-danger rounded bg-danger bg-opacity-10 text-danger">
                    ${mistake.selectedOptionTextSnapshot || "<em>Skipped / No answer</em>"}
                </div>
            </div>
            <div class="col-md-6 mt-3 mt-md-0">
                <h6 class="text-success"><i class="bi bi-check-circle me-1"></i>Correct answer:</h6>
                <div class="p-2 border border-success rounded bg-success bg-opacity-10 text-success">
                    ${mistake.correctOptionTextSnapshot}
                </div>
            </div>
        </div>

        <div class="mt-4 border-top pt-3">
            <h6>Explanation:</h6>
            <p class="text-muted">${mistake.explanation || "No specific explanation provided for this question."}</p>
            <div class="alert alert-info mt-3 mb-0" role="alert">
                <i class="bi bi-info-circle-fill me-2"></i>
                <strong>Recommended action:</strong> Review the "${mistake.topicName}" topic before retaking the quiz.
            </div>
        </div>
    `;

    // توجيه الطالب لصفحة مراجعة الموضوع
    reviewBtn.onclick = () => {
        if (window.bootstrap) {
            bootstrap.Modal.getInstance(document.getElementById('mistakeDetailModal')).hide();
        }
        // افتراض وجود نظام توجيه (Router) بناه m1
        window.location.hash = `#/topics/${mistake.topicId}`;
    };
}

/**
 * Mock Data for Mistakes (للتجربة بدون الباك إيند)
 * مبنية على متطلبات الـ Snapshots (spec 13.2.1 و 21.15)
 */
async function fetchMockMistakesData() {
    await new Promise(resolve => setTimeout(resolve, 600));

    return [
        {
            topicId: 2,
            topicName: "Variables and Data Types",
            mistakes: [
                {
                    questionId: 101,
                    topicId: 2,
                    topicName: "Variables and Data Types",
                    questionTextSnapshot: "What is the correct way to assign the number 5 to a variable named x in Python?",
                    selectedOptionTextSnapshot: "int x = 5;",
                    correctOptionTextSnapshot: "x = 5",
                    explanation: "Python is dynamically typed, so you do not need to declare the type (int) before the variable name.",
                    timesMissed: 2,
                    isUnresolved: true
                },
                {
                    questionId: 102,
                    topicId: 2,
                    topicName: "Variables and Data Types",
                    questionTextSnapshot: "Which of these data types is used for True/False values?",
                    selectedOptionTextSnapshot: "String",
                    correctOptionTextSnapshot: "Boolean",
                    explanation: "Boolean (bool) in Python represents truth values: True or False.",
                    timesMissed: 1,
                    isUnresolved: true
                }
            ]
        },
        {
            topicId: 5,
            topicName: "Loops",
            mistakes: [
                {
                    questionId: 205,
                    topicId: 5,
                    topicName: "Loops",
                    questionTextSnapshot: "Which loop is best when you know exactly how many times you want to iterate?",
                    selectedOptionTextSnapshot: "while loop",
                    correctOptionTextSnapshot: "for loop",
                    explanation: "A 'for' loop is specifically designed to iterate over a known sequence or a specific number of times (using range).",
                    timesMissed: 3,
                    isUnresolved: true
                }
            ]
        }
    ];
}