// =====================================
// auth.js
// Authentication with mock API integration
// =====================================

import {
    getStudent,
    saveStudent,
    setLoginStatus,
    removeLoginStatus,
    registerStudentApi,
    loginStudentApi,
    getUsers,
    getUserRole
} from "./state.js";

import {
    validateName,
    validateEmail,
    validatePassword,
    validateConfirmPassword
} from "./validation.js";

import { navigate } from "./router.js";

export async function registerStudent(
    name,
    email,
    password,
    confirmPassword
) {
    if (!validateName(name)) {
        return false;
    }

    if (!validateEmail(email)) {
        return false;
    }

    if (!validatePassword(password)) {
        return false;
    }

    if (!validateConfirmPassword(password, confirmPassword)) {
        return false;
    }

    try {
        const user = await registerStudentApi({
            name,
            email,
            password,
            department: "General"
        });

        saveStudent({
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
            role: user.role,
            department: user.department || "General"
        });

        sessionStorage.setItem(
            "registrationMessage",
            "Registration successful. Please log in."
        );
        navigate("login.html");
        return true;
    } catch (error) {
        alert(error.message || "Registration failed.");
        return false;
    }
}

export async function loginStudent(email, password) {
    const storedUser = getStudent();
    const users = getUsers();

    if (!storedUser && users.length === 0) {
        alert("Please register first");
        return false;
    }

    try {
        const user = await loginStudentApi(email, password);

        const sessionUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
            role: user.role || "student",
            department: user.department || "General"
        };

        saveStudent(sessionUser);
        setLoginStatus(true);
        alert("Login Successful");
        navigate("dashboard.html");
        return true;
    } catch (error) {
        if (storedUser && storedUser.email === email && storedUser.password === password) {
            setLoginStatus(true);
            alert("Login Successful");
            navigate("dashboard.html");
            return true;
        }

        alert(error.message || "Invalid Email or Password");
        return false;
    }
}

export function getRole() {
    return getUserRole();
}

export function logout() {
    removeLoginStatus();
    alert("Logout Successful");
    navigate("login.html");
}
