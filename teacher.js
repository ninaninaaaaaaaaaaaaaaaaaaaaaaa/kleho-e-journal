const subjects = JSON.parse(localStorage.getItem('subjects')) || [];

document.getElementById('addSubjectButton').addEventListener('click', () => {
    document.getElementById('modal').style.display = 'block';
});

document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('modal').style.display = 'none';
});

document.getElementById('createSubjectButton').addEventListener('click', () => {
    const subjectName = document.getElementById('newSubjectName').value;
    const evaluationSystem = document.getElementById('evaluationSystem').value;
    const groupCount = document.getElementById('groupCount').value;

    if (subjectName) {
        const subjects = loadSubjectsFromLocalStorage(); // Завантажуємо предмети з localStorage
        const newSubjects = [];

        // Логіка додавання нового предмета (за підгрупами або без)
        if (groupCount === "2") {
            for (let i = 1; i <= 2; i++) {
                const newSubject = {
                    name: `${subjectName} підгрупа ${i}`,
                    evaluationSystem: evaluationSystem,
                    groupCount: groupCount,
                    students: []
                };

                for (let j = 1; j <= 15; j++) {
                    newSubject.students.push({
                        name: `${subjectName} підгрупа ${i} Студент ${j}`,
                        grades: Array(10).fill('')
                    });
                }

                newSubjects.push(newSubject);
            }
        } else {
            const newSubject = {
                name: subjectName,
                evaluationSystem: evaluationSystem,
                groupCount: groupCount,
                students: []
            };

            for (let i = 1; i <= 30; i++) {
                newSubject.students.push({
                    name: `${subjectName} Студент ${i}`,
                    grades: Array(10).fill('')
                });
            }

            newSubjects.push(newSubject);
        }

        // Додаємо новий предмет до масиву і зберігаємо
        subjects.push(...newSubjects);
        saveSubjectsToLocalStorage(subjects);

        document.getElementById('modal').style.display = 'none';
        document.getElementById('newSubjectName').value = '';
        renderSubjects();
    }
});


document.getElementById('viewSubjectsButton').addEventListener('click', () => {
    renderSubjects();
    document.getElementById('subjectsTable').classList.remove('hidden');
});

function renderSubjects() {
    const subjects = loadSubjectsFromLocalStorage(); // Завантажуємо предмети
    const subjectsBody = document.getElementById('subjectsBody');
    subjectsBody.innerHTML = ''; // Очищаємо таблицю перед рендерингом

    subjects.forEach((subject, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="display: flex; justify-content: space-between; align-items: center;">
                <span style="cursor:pointer;" onclick="showGradeTable(${index})">${subject.name}</span>
                <button class="deleteSubjectButton" onclick="deleteSubject(${index})">Видалити</button>
            </td>
        `;
        subjectsBody.appendChild(row);
    });
}

function updateStudentName(subjectIndex, studentIndex, inputElement) {
    const subjects = loadSubjectsFromLocalStorage(); // Завантажуємо предмети з localStorage
    const newName = inputElement.textContent.trim(); // Отримуємо нове ім'я студента

    // Перевіряємо, чи ім'я змінилось, і оновлюємо
    if (newName !== subjects[subjectIndex].students[studentIndex].name) {
        subjects[subjectIndex].students[studentIndex].name = newName; // Оновлюємо ім'я студента
        saveSubjectsToLocalStorage(subjects); // Зберігаємо оновлені дані в localStorage
    }
}


function showGradeTable(subjectIndex) {
    const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
    const subject = subjects[subjectIndex];
    const studentCount = subject.students.length;

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

    for (let j = 0; j < studentCount; j++) {
        const student = subject.students[j];
        gradeTableHTML += `<tr>
            <td contenteditable="true" class="studentName" onblur="updateStudentName(${subjectIndex}, ${j}, this)">${student.name}</td>`;
        for (let k = 0; k < 10; k++) {
            gradeTableHTML += `<td contenteditable="true" onfocus="this.classList.add('editing')" onblur="updateGrades(this, '${subject.evaluationSystem}', ${subjectIndex}, ${j}, ${k})">${student.grades[k] !== null ? student.grades[k] : ''}</td>`;
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

function updateGrades(cell, evaluationSystem, subjectIndex, studentIndex, gradeIndex) {
    const subjects = loadSubjectsFromLocalStorage();
    const subject = subjects[subjectIndex];
    const grade = cell.textContent.trim() === '' ? null : parseFloat(cell.textContent.trim()); // Перетворення тексту в число
    subject.students[studentIndex].grades[gradeIndex] = grade;
    saveSubjectsToLocalStorage(subjects); // Зберігаємо оновлені дані

    const row = cell.closest('tr');
    if (evaluationSystem === "100") {
        const total = calculateTotalGrade(subject.students[studentIndex].grades); // Загальна оцінка
        row.querySelector('.total-grade').textContent = total;
        row.querySelector('.five-point-scale').textContent = calculateFivePointScore(total); // 5-бальна система
    } else {
        const average = calculateAverageGrade(subject.students[studentIndex].grades); // Середнє значення
        row.querySelector('.average-grade').textContent = average;
    }
}


function calculateTotalGrade(grades) {
    return grades.reduce((sum, grade) => sum + (grade || 0), 0);
}


function calculateAverageGrade(grades) {
    const validGrades = grades.filter(grade => grade !== null && grade !== ''); // фільтруємо тільки дійсні оцінки
    return validGrades.length > 0 ? (validGrades.reduce((sum, grade) => sum + grade, 0) / validGrades.length).toFixed(2) : 0;
}


function calculateFivePointScore(sum) {
    if (sum >= 90) return 5;
    else if (sum >= 74) return 4;
    else if (sum >= 60) return 3;
    else if (sum <= 59) return 2;
}

function closeGradeTable() {
    const gradeModal = document.querySelector('.grade-modal');
    if (gradeModal) {
        gradeModal.remove();
    }
}

function deleteSubject(subjectIndex) {
    const confirmation = confirm('Ви дійсно хочете видалити цей журнал?');
    if (confirmation) {
        const subjects = loadSubjectsFromLocalStorage(); // Завантажуємо предмети з localStorage

        // Видаляємо предмет з масиву
        subjects.splice(subjectIndex, 1);

        // Оновлюємо localStorage після видалення предмета
        saveSubjectsToLocalStorage(subjects);

        renderSubjects(); // Оновлюємо відображення предметів
    }
}



function loadSubjectsFromLocalStorage() {
    return JSON.parse(localStorage.getItem('subjects')) || [];
}


function saveSubjectsToLocalStorage(subjects) {
    localStorage.setItem('subjects', JSON.stringify(subjects));
}


renderSubjects(); // Заповнюємо таблицю предметів при завантаженні
