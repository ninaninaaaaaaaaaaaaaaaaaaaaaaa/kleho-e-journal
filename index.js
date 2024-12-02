const adminPassword = "admin123";
const teacherPassword = "teacher123";

function showPasswordInput() {
    const role = document.getElementById("role").value;
    document.getElementById("passwordInput").classList.toggle("hidden", role === "student");
    document.getElementById("errorMessage").classList.add("hidden");

    if (role === "student") {
        window.location.href = "student.html";
    }
}

function login() {
    const role = document.getElementById("role").value;
    const password = document.getElementById("password").value;

    if (role === "admin" && password === adminPassword) {
        window.location.href = "admin.html";
    } else if (role === "teacher" && password === teacherPassword) {
        window.location.href = "teacher.html";
    } else {
        const errorMessageElement = document.getElementById("errorMessage");
        errorMessageElement.classList.remove("hidden");

        // Зникнення повідомлення через 7 секунд
        setTimeout(function() {
            errorMessageElement.classList.add("hidden");
        }, 7000);
    }
}

// Функція для обробки натискання клавіші Enter
function handleEnterKey(event) {
    if (event.key === "Enter") {
        login(); // Викликаємо функцію login при натисканні Enter
    }
}

function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.setAttribute('name', 'eye-outline');
    } else {
        passwordInput.type = 'password';
        eyeIcon.setAttribute('name', 'eye-off-outline');
    }
}

// Додаємо обробник події для натискання клавіші в поле вводу пароля
document.getElementById("password").addEventListener("keydown", handleEnterKey);
