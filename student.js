const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
console.log('Завантажені предмети:', subjects);


// Функція для рендеру списку предметів
function renderSubjects() {
    const subjectsBody = document.getElementById('subjectsBody');
    subjectsBody.innerHTML = '';

    subjects.forEach((subject, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `<td style="cursor:pointer;" onclick="showGradeTable(${index})">${subject.name}</td>`;
        subjectsBody.appendChild(row);
    });
}

// Функція для відкриття таблиці оцінок
function showGradeTable(subjectIndex) {
    // Закрити попередні відкриті модальні вікна
    const existingModal = document.querySelector('.grade-modal');
    if (existingModal) {
        existingModal.remove();  // Видаляємо старе модальне вікно перед створенням нового
    }

    const subject = subjects[subjectIndex];
    const studentCount = subject.groupCount === "2" ? 15 : 30;

    let gradeTableHTML = `<div class="grade-modal" data-subject-index="${subjectIndex}">
        <div class="grade-modal-content">
            <span class="close" onclick="closeGradeTable()">&times;</span>
            <h3>Таблиця оцінок для предмету "${subject.name}"</h3>
            <table>
                <thead>
                    <tr>
                        <th>Прізвище та ім'я</th>`;

    for (let i = 1; i <= 10; i++) {
        gradeTableHTML += `<th>Оцінка ${i}</th>`;
    }

    if (subject.evaluationSystem === "100") {
        gradeTableHTML += `<th>Всього</th><th>5-бальна система</th>`;
    } else {
        gradeTableHTML += `<th>Середнє</th>`;
    }

    gradeTableHTML += `</tr></thead><tbody>`;

    // Створення рядків для студентів
    for (let j = 0; j < studentCount; j++) {
        const student = subject.students[j] || { name: `Студент ${j + 1}`, grades: Array(10).fill(null) };
        gradeTableHTML += `<tr>
            <td class="studentName">${student.name}</td>`; // Відключено contenteditable
        for (let k = 0; k < 10; k++) {
            gradeTableHTML += `<td>${student.grades[k] !== null ? student.grades[k] : ''}</td>`; // Відключено contenteditable
        }
        if (subject.evaluationSystem === "100") {
            gradeTableHTML += `<td class="total-grade">${calculateTotalGrade(student.grades)}</td><td class="five-point-scale">${calculateFivePointScore(calculateTotalGrade(student.grades))}</td>`;
        } else {
            gradeTableHTML += `<td class="average-grade">${calculateAverageGrade(student.grades)}</td>`;
        }
        gradeTableHTML += `</tr>`;
    }

    gradeTableHTML += `</tbody></table></div></div>`;

    document.body.insertAdjacentHTML('beforeend', gradeTableHTML);
    const gradeModal = document.querySelector('.grade-modal');
    gradeModal.style.display = 'block';
}

// Функція для закриття модального вікна
function closeGradeTable() {
    const gradeModal = document.querySelector('.grade-modal');
    if (gradeModal) {
        gradeModal.remove();
    }
}

// Функції для розрахунку оцінок
function calculateTotalGrade(grades) {
    return grades.reduce((sum, grade) => sum + (parseFloat(grade) || 0), 0);
}

function calculateAverageGrade(grades) {
    // Фільтруємо тільки числа (невірні значення, наприклад, null або порожні рядки, ігноруємо)
    const validGrades = grades.filter(grade => !isNaN(parseFloat(grade)) && grade !== '');
    
    // Якщо є хоча б одне значення, обчислюємо середнє
    if (validGrades.length > 0) {
        return (validGrades.reduce((sum, grade) => sum + parseFloat(grade), 0) / validGrades.length).toFixed(2);
    } else {
        return '0'; // Якщо немає оцінок, повертаємо інше значення
    }
}


function calculateFivePointScore(total) {
    if (total >= 90) return 5;
    else if (total >= 74) return 4;
    else if (total >= 60) return 3;
    else if (total <= 59) return 2;
}

// Ініціалізація сторінки
document.addEventListener('DOMContentLoaded', () => {
    renderSubjects();
});
