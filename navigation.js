// =====================================
// navigation.js
// Navigation & Dashboard Protection
// =====================================

import {
    getStudent,
    getLoginStatus
} from "./state.js";

export function checkLogin() {
    const user = getStudent();
    const isLoggedIn = getLoginStatus();

    const dashboardLink = document.getElementById("dashboardLink");
    const loginLink = document.getElementById("loginLink");
    const registerLink = document.getElementById("registerLink");
    const logoutLink = document.getElementById("logoutLink");

    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const pageLinks = document.querySelectorAll("nav a[href]");

    pageLinks.forEach((link) => {
        const linkPage = link.getAttribute("href");

        if (linkPage === currentPage) {
            link.classList.add("active");
        }
    });

    if (user && isLoggedIn) {
        if (dashboardLink) {
            dashboardLink.style.display = "inline";
        }

        if (logoutLink) {
            logoutLink.style.display = "inline";
        }

        if (loginLink) {
            loginLink.style.display = "none";
        }

        if (registerLink) {
            registerLink.style.display = "none";
        }
    }
}

export function protectDashboard() {
    const status = getLoginStatus();

    if (
        window.location.pathname.includes("dashboard.html") &&
        !status
    ) {
        alert("Please Login First");
        return true;
    }

    return false;
}