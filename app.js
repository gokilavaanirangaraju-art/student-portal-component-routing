import {
    registerStudent,
    loginStudent,
    logout
} from "./auth.js";

import {
    checkLogin,
    protectDashboard
} from "./navigation.js";

import {
    getStudent,
    subscribe,
    getUserRole
} from "./state.js";

import { initCourses } from "../course.js";
import { startRouter, navigate } from "./router.js";

let unsubscribeFromState;

function renderProfile() {
    const student = getStudent();
    const profileName = document.getElementById("profileName");
    const profileEmail = document.getElementById("profileEmail");
    const dashboardMeta = document.getElementById("dashboardMeta");

    if (student && profileName) {
        profileName.textContent = student.name;
    }

    if (student && profileEmail) {
        profileEmail.textContent = student.email;
    }

    if (dashboardMeta) {
        const role = getUserRole();
        dashboardMeta.textContent = role === "admin"
            ? "Administrator Dashboard"
            : "Student Dashboard";
    }
}

function bindRegisterForm() {
    const registerForm = document.getElementById("registerForm");

    if (!registerForm) {
        return;
    }

    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const registerButton = document.getElementById("registerButton");
        const registerStatus = document.getElementById("registerStatus");
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (registerButton) {
            registerButton.disabled = true;
        }

        if (registerStatus) {
            registerStatus.textContent = "Creating your account...";
            registerStatus.className = "form-status visible";
        }

        const registered = await registerStudent(name, email, password, confirmPassword);

        if (!registered && registerStatus) {
            registerStatus.textContent = "Registration failed. Check the message and try again.";
            registerStatus.className = "form-status visible error-status";
        }

        if (registerButton) {
            registerButton.disabled = false;
        }
    });
}

function bindLoginForm() {
    const loginForm = document.getElementById("loginForm");

    if (!loginForm) {
        return;
    }

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        await loginStudent(email, password);
    });
}

function showRegistrationMessage() {
    const registrationMessage = document.getElementById("registrationMessage");

    if (!registrationMessage) {
        return;
    }

    const message = sessionStorage.getItem("registrationMessage");

    if (message) {
        registrationMessage.textContent = message;
        registrationMessage.hidden = false;
        sessionStorage.removeItem("registrationMessage");
    }
}

function bindLogout() {
    const logoutLink = document.getElementById("logoutLink");

    if (logoutLink) {
        logoutLink.addEventListener("click", function (event) {
            event.preventDefault();
            logout();
        });
    }
}

function initializeRoute() {
    checkLogin();

    if (protectDashboard()) {
        navigate("login.html");
        return;
    }

    renderProfile();

    if (!unsubscribeFromState) {
        unsubscribeFromState = subscribe(renderProfile);
    }

    if (
        document.getElementById("courseList") ||
        document.getElementById("myCourseList") ||
        document.getElementById("progressList") ||
        document.getElementById("adminCourseTable")
    ) {
        initCourses();
    }

    bindRegisterForm();
    bindLoginForm();
    showRegistrationMessage();
    bindLogout();
}

window.addEventListener("routechange", initializeRoute);

startRouter();
