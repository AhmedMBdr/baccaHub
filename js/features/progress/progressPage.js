// مسار الملف: js/features/progress/progressPage.js

import { apiFetch } from '../../core/api.js';

export async function renderProgressPage(container) {
    container.innerHTML = `
        <div class="container mt-4">
            <h2 class="mb-4">My Progress <i class="bi bi-bar-chart-fill text-primary"></i></h2>
            
            <div id="progressListContainer" class="row g-4">
                <div class="col-12 text-center py-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>

            <!-- Modal لعرض تفاصيل المحاولات (Attempt Trend) -->
            <div class="modal fade" id="progressDetailModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header bg-light">
                            <h5 class="modal-title" id="progressModalTitle">Topic Details</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body" id="progressModalBody">
                            <!-- تفاصيل المحاولات ستظهر هنا -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    await loadProgressData(container);
}

async function loadProgressData(container) {
    const listContainer = container.querySelector('#progressListContainer');

    try {
        // سيتم الاستبدال بـ API حقيقي (GET /api/v1/students/me/progress/topics)
        const progressData = await fetchMockProgressData();

        listContainer.innerHTML = ''; // تنظيف حالة التحميل

        if (!progressData || progressData.length === 0) {
            listContainer.innerHTML = `<div class="alert alert-info">No progress data available yet. Take a quiz to get started!</div>`;
            return;
        }

        progressData.forEach(topic => {
            // تحديد لون شريط التقدم بناءً على النسبة
            let barColor = "bg-danger"; // أقل من 40%
            if (topic.masteryScore >= 85) barColor = "bg-success"; // مكتمل
            else if (topic.masteryScore >= 70) barColor = "bg-primary"; // جيد
            else if (topic.masteryScore >= 40) barColor = "bg-warning text-dark"; // متوسط

            const isCompleted = topic.masteryScore >= 85 ? `<span class="badge bg-success ms-2">Completed</span>` : '';

            const cardHtml = `
                <div class="col-md-6 col-lg-6">
                    <div class="card h-100 shadow-sm border-0 border-start border-4 ${barColor.split(' ')[0].replace('bg-', 'border-')}">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <h5 class="card-title mb-0">${topic.topicName} ${isCompleted}</h5>
                                <h4 class="mb-0 fw-bold">${topic.masteryScore}%</h4>
                            </div>
                            <div class="progress mb-3" style="height: 10px;">
                                <div class="progress-bar ${barColor}" role="progressbar" style="width: ${topic.masteryScore}%" aria-valuenow="${topic.masteryScore}" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                            <div class="d-flex justify-content-between text-muted small">
                                <span>Quizzes Taken: ${topic.attemptsCount}</span>
                                <span>Last Reviewed: ${topic.lastReviewedAt || 'Never'}</span>
                            </div>
                            <button class="btn btn-sm btn-outline-secondary w-100 mt-3 btn-view-trend" data-topic='${JSON.stringify(topic).replace(/'/g, "&#39;")}'>
                                View Attempt History
                            </button>
                        </div>
                    </div>
                </div>
            `;
            listContainer.insertAdjacentHTML('beforeend', cardHtml);
        });

        attachTrendClickEvents(container);

    } catch (error) {
        console.error("Error loading progress:", error);
        listContainer.innerHTML = `<div class="alert alert-danger">Error loading progress data.</div>`;
    }
}

function attachTrendClickEvents(container) {
    const buttons = container.querySelectorAll('.btn-view-trend');
    const modalElement = document.getElementById('progressDetailModal');
    let bsModal;
    if (window.bootstrap) {
        bsModal = new bootstrap.Modal(modalElement);
    }

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const topic = JSON.parse(btn.getAttribute('data-topic'));
            showTrendDetails(topic);
            if (bsModal) bsModal.show();
        });
    });
}

function showTrendDetails(topic) {
    document.getElementById('progressModalTitle').textContent = `${topic.topicName} - History`;
    const body = document.getElementById('progressModalBody');
    
    if (!topic.history || topic.history.length === 0) {
        body.innerHTML = `<p class="text-muted">No quiz history available for this topic.</p>`;
        return;
    }

    // عرض مسار المحاولات (Attempt Trend) كما هو مطلوب في الـ Spec
    let historyHtml = `<ul class="list-group list-group-flush">`;
    topic.history.forEach((attempt, index) => {
        historyHtml += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <span>Attempt ${index + 1} <small class="text-muted ms-2">(${attempt.date})</small></span>
                <span class="badge bg-primary rounded-pill">${attempt.score}%</span>
            </li>
        `;
    });
    historyHtml += `</ul>`;
    
    body.innerHTML = `
        <div class="mb-3 text-center">
            <h1 class="display-4 fw-bold text-primary">${topic.masteryScore}%</h1>
            <p class="text-muted">Current Mastery Score</p>
        </div>
        <h6>Attempt Trend:</h6>
        ${historyHtml}
    `;
}

/**
 * بيانات وهمية لمحاكاة API التقدم
 */
async function fetchMockProgressData() {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
        {
            topicId: 2,
            topicName: "Variables and Data Types",
            masteryScore: 88,
            attemptsCount: 3,
            lastReviewedAt: "2026-10-15",
            history: [
                { score: 40, date: "2026-10-01" },
                { score: 65, date: "2026-10-10" },
                { score: 90, date: "2026-10-15" }
            ]
        },
        {
            topicId: 5,
            topicName: "Loops",
            masteryScore: 48,
            attemptsCount: 2,
            lastReviewedAt: "2026-10-16",
            history: [
                { score: 30, date: "2026-10-12" },
                { score: 60, date: "2026-10-16" }
            ]
        }
    ];
}