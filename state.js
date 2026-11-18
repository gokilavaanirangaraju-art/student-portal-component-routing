import { apiRequest, saveAuthToken, clearAuthToken } from "./api.js";
import { DEFAULT_COURSES } from "./js/constants/courses.js";

const STORAGE_KEY = "student-course-registration-state";
const USERS_KEY = "student-course-registration-users";

const DEFAULT_ADMIN = {
    id: 1,
    name: "System Administrator",
    email: "admin@college.com",
    password: "admin123",
    role: "admin",
    department: "Administration"
};

const initialState = {
    student: null,
    loginStatus: false,
    courses: DEFAULT_COURSES,
    enrollments: {},
    notifications: [
        "Welcome to the Student Course Portal.",
        "New courses are available this month."
    ]
};

function loadState() {
    try {
        const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
        const legacyStudent = localStorage.getItem("student");

        return {
            ...initialState,
            ...savedState,
            student: savedState.student || (legacyStudent ? JSON.parse(legacyStudent) : null),
            loginStatus: savedState.loginStatus !== undefined
                ? Boolean(savedState.loginStatus)
                : localStorage.getItem("loginStatus") === "true",
            courses: Array.isArray(savedState.courses) && savedState.courses.length > 0
                ? savedState.courses
                : DEFAULT_COURSES,
            enrollments: savedState.enrollments || {}
        };
    } catch (error) {
        console.error("Could not load saved student portal state.", error);
        return { ...initialState };
    }
}

const store = loadState();
const listeners = [];

function persistState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    localStorage.setItem("student", JSON.stringify(store.student));
    localStorage.setItem("loginStatus", String(Boolean(store.loginStatus)));
}

export function subscribe(listener) {
    listeners.push(listener);

    return function unsubscribe() {
        const index = listeners.indexOf(listener);
        if (index >= 0) {
            listeners.splice(index, 1);
        }
    };
}

export function getState() {
    return store;
}

export function dispatch(action) {
    if (!action || !action.type) {
        return store;
    }

    switch (action.type) {
        case "SET_STUDENT":
            store.student = action.payload;
            break;
        case "SET_LOGIN_STATUS":
            store.loginStatus = Boolean(action.payload);
            break;
        case "CLEAR_SESSION":
            store.student = null;
            store.loginStatus = false;
            break;
        case "SET_COURSES":
            store.courses = action.payload;
            break;
        case "SET_ENROLLMENTS":
            store.enrollments = action.payload;
            break;
        case "SET_NOTIFICATIONS":
            store.notifications = action.payload;
            break;
        default:
            return store;
    }

    persistState();
    listeners.forEach((listener) => listener(store));
    return store;
}

export function getStudent() {
    return store.student;
}

export function saveStudent(student) {
    dispatch({ type: "SET_STUDENT", payload: student });
    return student;
}

export function getLoginStatus() {
    return store.loginStatus;
}

export function setLoginStatus(status) {
    const normalizedStatus = status === true || status === "true";
    dispatch({ type: "SET_LOGIN_STATUS", payload: normalizedStatus });
    return normalizedStatus;
}

export function removeLoginStatus() {
    dispatch({ type: "CLEAR_SESSION" });
    clearAuthToken();
}

export function getCourses() {
    return store.courses;
}

export function saveCourses(courses) {
    dispatch({ type: "SET_COURSES", payload: courses });
    return courses;
}

export function getEnrollments() {
    return store.enrollments;
}

export function saveEnrollments(enrollments) {
    dispatch({ type: "SET_ENROLLMENTS", payload: enrollments });
    return enrollments;
}

export function getNotifications() {
    return store.notifications;
}

export function saveNotifications(notifications) {
    dispatch({ type: "SET_NOTIFICATIONS", payload: notifications });
    return notifications;
}

export function getUserRole() {
    return getStudent()?.role || "student";
}

export function getUsers(includeFallback = true) {
    try {
        const savedUsers = localStorage.getItem(USERS_KEY);

        if (savedUsers) {
            const users = JSON.parse(savedUsers);
            if (Array.isArray(users) && users.length > 0) {
                return users;
            }
        }

        return includeFallback ? [DEFAULT_ADMIN] : [];
    } catch (error) {
        console.error("Could not load saved users.", error);
        return includeFallback ? [DEFAULT_ADMIN] : [];
    }
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function registerStudentApi(studentData) {
    const response = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify(studentData)
    });

    const users = getUsers(false);
    users.push(response.user);
    saveUsers(users);
    return response.user;
}

export async function loginStudentApi(email, password) {
    const response = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
    });

    saveAuthToken(response.token);
    return response.user;
}

export async function fetchMockCourses() {
    const response = await apiRequest("/courses");
    return response.courses;
}

export async function enrollCourseApi(courseId) {
    const response = await apiRequest(`/courses/${encodeURIComponent(courseId)}/enroll`, {
        method: "POST"
    });
    return response.enrollments;
}

export async function studyCourseApi(courseId) {
    const response = await apiRequest(`/courses/${encodeURIComponent(courseId)}/study`, {
        method: "POST"
    });
    return response.enrollments;
}

export { DEFAULT_COURSES, DEFAULT_ADMIN };
