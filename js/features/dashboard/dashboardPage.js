

import { apiFetch } from '../../core/api.js';
import { renderPriorityCard } from '../study-plan/priorityCard.js';

export async function renderDashboard(container) {
    // 1. بناء الهيكل الأساسي للوحة التحكم (مع حالات فارغة / Loading)
    container.innerHTML = `
        <div class="container mt-4">
            <h2 class="mb-4" id="welcomeMsg">Welcome back, ...</h2>
            
            <!-- الصف الأول: الإحصائيات والكارت المشترك -->
            <div class="row g-4 mb-4">
                <!-- كارت الإحصائيات العامة -->
                <div class="col-md-8">
                    <div class="card h-100 shadow-sm border-0 bg-primary text-white">
                        <div class="card-body d-flex justify-content-around align-items-center text-center">
                            <div>
                                <h6 class="text-white-50">Overall Mastery</h6>
                                <h2 class="fw-bold mb-0" id="overallMastery">--%</h2>
                            </div>
                            <div class="border-start border-white-50 ps-4">
                                <h6 class="text-white-50">Topics Completed</h6>
                                <h2 class="fw-bold mb-0" id="topicsCompleted">-/-</h2>
                            </div>
                            <div class="border-start border-white-50 ps-4">
                                <h6 class="text-white-50">Avg Quiz Score</h6>
                                <h2 class="fw-bold mb-0" id="avgScore">--%</h2>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- حاوية كارت الأولوية (نقطة الربط مع m5) -->
                <div class="col-md-4" id="priorityCardContainer">
                    <!-- سيتم حقن كود زميلك هنا -->
                </div>
            </div>

            <!-- الصف الثاني: الكويزات الأخيرة والإجراءات الموصى بها -->
            <div class="row g-4">
                <div class="col-md-6">
                    <div class="card shadow-sm border-0 h-100">
                        <div class="card-header bg-white fw-bold py-3">Recent Quizzes</div>
                        <ul class="list-group list-group-flush" id="recentQuizzesList">
                            <li class="list-group-item text-center text-muted py-4">Loading history...</li>
                        </ul>
                    </div>
                </div>
                
                <div class="col-md-6">
                    <div class="card shadow-sm border-0 h-100">
                        <div class="card-header bg-white fw-bold py-3">Recommended Today</div>
                        <ol class="list-group list-group-numbered list-group-flush" id="recommendedList">
                            <li class="list-group-item text-center text-muted py-4">Generating plan...</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    `;

    // 2. استدعاء مكون زميلك m5 فوراً
    const priorityContainer = container.querySelector('#priorityCardContainer');
    renderPriorityCard(priorityContainer);

    // 3. جلب بيانات الـ Dashboard الخاصة بك
    await loadDashboardData(container);
}

async function loadDashboardData(container) {
    try {
        // بيانات وهمية لمحاكاة استجابة الـ API
        await new Promise(resolve => setTimeout(resolve, 600));
        const mockData = {
            studentName: "Ahmed",
            overallMastery: 67,
            topicsCompleted: 8,
            totalTopics: 14,
            avgQuizScore: 72,
            recentQuizzes: [
                { topic: "Loops", score: 42 },
                { topic: "Arrays", score: 61 },
                { topic: "Conditions", score: 84 }
            ],
            recommendedActions: [
                "Review Loops explanation",
                "Solve 2 Loops problems",
                "Retake Loops quiz"
            ]
        };

        // تحديث الإحصائيات
        container.querySelector('#welcomeMsg').textContent = `Welcome back, ${mockData.studentName}`;
        container.querySelector('#overallMastery').textContent = `${mockData.overallMastery}%`;
        container.querySelector('#topicsCompleted').textContent = `${mockData.topicsCompleted}/${mockData.totalTopics}`;
        container.querySelector('#avgScore').textContent = `${mockData.avgQuizScore}%`;

        // تحديث الكويزات الأخيرة
        const quizzesList = container.querySelector('#recentQuizzesList');
        if (mockData.recentQuizzes.length === 0) {
            quizzesList.innerHTML = `<li class="list-group-item text-muted">No quizzes taken yet.</li>`;
        } else {
            quizzesList.innerHTML = mockData.recentQuizzes.map(q => `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    ${q.topic}
                    <span class="badge ${q.score >= 50 ? 'bg-success' : 'bg-danger'} rounded-pill">${q.score}%</span>
                </li>
            `).join('');
        }

        // تحديث الإجراءات الموصى بها
        const actionsList = container.querySelector('#recommendedList');
        if (mockData.recommendedActions.length === 0) {
            actionsList.innerHTML = `<li class="list-group-item text-muted">You're all caught up!</li>`;
        } else {
            actionsList.innerHTML = mockData.recommendedActions.map(action => `
                <li class="list-group-item d-flex justify-content-between align-items-start">
                    <div class="ms-2 me-auto">
                        <div class="fw-normal">${action}</div>
                    </div>
                </li>
            `).join('');
        }

    } catch (error) {
        console.error("Dashboard error:", error);
        // التعامل مع الخطأ بشكل لا يكسر الصفحة
    }
}