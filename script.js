// Application State stored in localStorage
let courseData = JSON.parse(localStorage.getItem('mycourses_tracker')) || {
    courseName: "MGIS 130",
    categories: [
        { id: "cat1", name: "Homework", weight: 30 },
        { id: "cat2", name: "Quizzes", weight: 30 },
        { id: "cat3", name: "Exams", weight: 40 }
    ],
    assignments: []
};

// DOM Elements
const courseNameInput = document.getElementById('course-name-input');
const saveCourseBtn = document.getElementById('save-course-btn');
const categoryForm = document.getElementById('category-form');
const catNameInput = document.getElementById('cat-name');
const catWeightInput = document.getElementById('cat-weight');
const categoryListContainer = document.getElementById('category-list-container');
const weightWarning = document.getElementById('weight-warning');
const assignmentForm = document.getElementById('assignment-form');
const assignNameInput = document.getElementById('assign-name');
const assignCategorySelect = document.getElementById('assign-category');
const assignEarnedInput = document.getElementById('assign-earned');
const assignPossibleInput = document.getElementById('assign-possible');
const assignmentsTableBody = document.getElementById('assignments-table-body');
const overallPercentageEl = document.getElementById('overall-percentage');
const overallLetterEl = document.getElementById('overall-letter');
const clearDataBtn = document.getElementById('clear-data-btn');

document.addEventListener('DOMContentLoaded', () => {
    courseNameInput.value = courseData.courseName;
    renderApp();
});

// Update Course Name
saveCourseBtn.addEventListener('click', () => {
    const name = courseNameInput.value.trim();
    if (name) {
        courseData.courseName = name;
        saveAndRender();
    }
});

// Add Category
categoryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = catNameInput.value.trim();
    const weight = parseFloat(catWeightInput.value);

    if (!name || isNaN(weight)) return;

    const newCat = {
        id: 'cat_' + Date.now(),
        name,
        weight
    };

    courseData.categories.push(newCat);
    catNameInput.value = '';
    catWeightInput.value = '';
    saveAndRender();
});

// Delete Category
window.deleteCategory = function(id) {
    courseData.categories = courseData.categories.filter(c => c.id !== id);
    // Also remove assignments tied to this category
    courseData.assignments = courseData.assignments.filter(a => a.categoryId !== id);
    saveAndRender();
};

// Add Assignment
assignmentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = assignNameInput.value.trim();
    const categoryId = assignCategorySelect.value;
    const earned = parseFloat(assignEarnedInput.value);
    const possible = parseFloat(assignPossibleInput.value);

    if (!name || !categoryId || isNaN(earned) || isNaN(possible) || possible <= 0) return;

    const newAssign = {
        id: 'assign_' + Date.now(),
        name,
        categoryId,
        earned,
        possible
    };

    courseData.assignments.push(newAssign);
    assignmentForm.reset();
    saveAndRender();
});

// Delete Assignment
window.deleteAssignment = function(id) {
    courseData.assignments = courseData.assignments.filter(a => a.id !== id);
    saveAndRender();
};

// Reset All Data
clearDataBtn.addEventListener('click', () => {
    if (confirm("Are you sure you want to reset all categories and assignments?")) {
        courseData.categories = [];
        courseData.assignments = [];
        saveAndRender();
    }
});

// Save and Render Pipeline
function saveAndRender() {
    localStorage.setItem('mycourses_tracker', JSON.stringify(courseData));
    renderApp();
}

// Main Render & Calculation Logic
function renderApp() {
    // 1. Render Categories & Check Total Weight
    categoryListContainer.innerHTML = '';
    assignCategorySelect.innerHTML = '<option value="" disabled selected>Select category</option>';

    let totalWeight = 0;
    courseData.categories.forEach(cat => {
        totalWeight += cat.weight;

        // Badge pill
        const badge = document.createElement('div');
        badge.className = 'category-badge';
        badge.innerHTML = `<span><strong>${escapeHtml(cat.name)}</strong>: ${cat.weight}%</span> <button onclick="deleteCategory('${cat.id}')">&times;</button>`;
        categoryListContainer.appendChild(badge);

        // Dropdown option
        const opt = document.createElement('option');
        opt.value = cat.id;
        opt.textContent = `${cat.name} (${cat.weight}%)`;
        assignCategorySelect.appendChild(opt);
    });

    if (totalWeight !== 100) {
        weightWarning.textContent = `⚠️ Total category weight is ${totalWeight}%. It should equal 100% for accurate calculations!`;
    } else {
        weightWarning.textContent = '';
    }

    // 2. Render Assignments Table & Calculate Grades
    assignmentsTableBody.innerHTML = '';
    if (courseData.assignments.length === 0) {
        assignmentsTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-message">No assignments logged yet. Add your scores above!</td>
            </tr>
        `;
        overallPercentageEl.textContent = '0.00%';
        overallLetterEl.textContent = '-';
        return;
    }

    // Processing Logic: Group by Category
    let categoryScores = {};
    courseData.categories.forEach(cat => {
        categoryScores[cat.id] = { earned: 0, possible: 0, weight: cat.weight };
    });

    courseData.assignments.forEach(assign => {
        const cat = courseData.categories.find(c => c.id === assign.categoryId);
        const catName = cat ? cat.name : 'Unassigned';

        const assignPct = (assign.earned / assign.possible) * 100;

        if (categoryScores[assign.categoryId]) {
            categoryScores[assign.categoryId].earned += assign.earned;
            categoryScores[assign.categoryId].possible += assign.possible;
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${escapeHtml(assign.name)}</strong></td>
            <td>${escapeHtml(catName)}</td>
            <td>${assign.earned} / ${assign.possible}</td>
            <td>${assignPct.toFixed(2)}%</td>
            <td><button class="btn-secondary" onclick="deleteAssignment('${assign.id}')">Delete</button></td>
        `;
        assignmentsTableBody.appendChild(tr);
    });

    // Calculate Overall Weighted Percentage
    let finalWeightedSum = 0;
    let activeWeightsTotal = 0;

    Object.keys(categoryScores).forEach(catId => {
        let catData = categoryScores[catId];
        if (catData.possible > 0) {
            let catPercentage = (catData.earned / catData.possible);
            finalWeightedSum += catPercentage * catData.weight;
            activeWeightsTotal += catData.weight;
        }
    });

    let overallPercentage = activeWeightsTotal > 0 ? (finalWeightedSum / (activeWeightsTotal / 100)) : 0;

    overallPercentageEl.textContent = overallPercentage.toFixed(2) + '%';
    overallLetterEl.textContent = getLetterGrade(overallPercentage);
}

// Letter Grade Conversion Helper (Standard RIT Scale)
function getLetterGrade(pct) {
    if (pct >= 93) return 'A';
    if (pct >= 90) return 'A-';
    if (pct >= 87) return 'B+';
    if (pct >= 83) return 'B';
    if (pct >= 80) return 'B-';
    if (pct >= 77) return 'C+';
    if (pct >= 73) return 'C';
    if (pct >= 70) return 'C-';
    if (pct >= 65) return 'D';
    return 'F';
}

// XSS Sanitizer Helper
function escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, m => map[m]);
}
