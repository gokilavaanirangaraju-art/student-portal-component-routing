// =====================================
// state.js
// Redux-style store with backend API support
// =====================================

import {
    apiRequest,
    saveAuthToken,
    clearAuthToken
} from "./api.js";

const STORAGE_KEY = "student-course-registration-state";
const USERS_KEY = "student-course-registration-users";

const DEFAULT_COURSES = [
    {
        id: "html-css",
        icon: "🌐",
        name: "HTML & CSS",
        title: "HTML & CSS",
        instructor: "Ms. Nisha",
        duration: "6 weeks",
        description: "Build responsive web pages and style interfaces.",
        category: "Web"
    },
    {
        id: "javascript",
        icon: "💻",
        name: "JavaScript",
        title: "JavaScript",
        instructor: "Mr. Daniel",
        duration: "8 weeks",
        description: "Learn dynamic programming and browser logic.",
        category: "Programming"
    },
    {
        id: "python",
        icon: "🐍",
        name: "Python",
        title: "Python",
        instructor: "Ms. Ananya",
        duration: "8 weeks",
        description: "Master scripting, data handling, and automation.",
        category: "Programming"
    },
    {
        id: "java",
        icon: "☕",
        name: "Java Programming",
        title: "Java Programming",
        instructor: "Mr. Ravi",
        duration: "10 weeks",
        description: "Develop robust object-oriented software with Java.",
        category: "Programming"
    },
    {
        id: "sql",
        icon: "🗄️",
        name: "SQL & Databases",
        title: "SQL & Databases",
        instructor: "Ms. Priya",
        duration: "5 weeks",
        description: "Understand queries, schema design, and database optimization.",
        category: "Database"
    },
    {
        id: "react",
        icon: "⚛️",
        name: "React",
        title: "React",
        instructor: "Mr. Adarsh",
        duration: "7 weeks",
        description: "Create modern frontend interfaces with components and hooks.",
        category: "Web"
    },
    {
        id: "data-structures",
        icon: "🌳",
        name: "Data Structures",
        title: "Data Structures",
        instructor: "Dr. Meera",
        duration: "8 weeks",
        description: "Organize data efficiently with arrays, trees, graphs, and more.",
        category: "Computer Science"
    },
    {
        id: "c-programming",
        icon: "⚙️",
        name: "C Programming",
        title: "C Programming",
        instructor: "Mr. Karthik",
        duration: "7 weeks",
        description: "Learn programming fundamentals, memory, and problem solving in C.",
        category: "Programming"
    },
    {
        id: "git-github",
        icon: "🔧",
        name: "Git & GitHub",
        title: "Git & GitHub",
        instructor: "Ms. Divya",
        duration: "4 weeks",
        description: "Track changes, collaborate, and manage projects with Git and GitHub.",
        category: "Tools"
    },
    {
        id: "ui-ux-design",
        icon: "🎨",
        name: "UI/UX Design",
        title: "UI/UX Design",
        instructor: "Ms. Kavya",
        duration: "6 weeks",
        description: "Design clear, accessible, and user-friendly digital experiences.",
        category: "Design"
    }
];

const DEFAULT_ADMIN = {
    id: 1,
    name: "System Administrator",
    email: "admin@college.com",
    password: "admin123",
    role: "admin"
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

const store = {
    ...initialState,
    ...loadState()
};

const listeners = [];

function ensureDefaultUsers() {
    const users = getUsers(false);
    const hasAdmin = users.some((user) => user.email.toLowerCase() === DEFAULT_ADMIN.email.toLowerCase());

    if (!hasAdmin) {
        users.push(DEFAULT_ADMIN);
        saveUsers(users);
    }
}

function loadState() {
    try {
        const savedState = localStorage.getItem(STORAGE_KEY);
        const legacyStudent = localStorage.getItem("student");
        const legacyLoginStatus = localStorage.getItem("loginStatus");

        const parsedState = savedState ? JSON.parse(savedState) : {};
        const student = parsedState.student || (legacyStudent ? JSON.parse(legacyStudent) : null);
        const loginStatus = parsedState.loginStatus !== undefined
            ? Boolean(parsedState.loginStatus)
            : legacyLoginStatus === "true";

        return {
            student: student || null,
            loginStatus: loginStatus,
            courses: Array.isArray(parsedState.courses) && parsedState.courses.length > 0
                ? parsedState.courses
                : DEFAULT_COURSES,
            enrollments: parsedState.enrollments && typeof parsedState.enrollments === "object"
                ? parsedState.enrollments
                : {},
            notifications: Array.isArray(parsedState.notifications) && parsedState.notifications.length > 0
                ? parsedState.notifications
                : initialState.notifications
        };
    } catch (error) {
        return initialState;
    }
}

function persistState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    localStorage.setItem("student", JSON.stringify(store.student));
    localStorage.setItem("loginStatus", String(Boolean(store.loginStatus)));
}

function reducer(currentState, action) {
    switch (action.type) {
        case "SET_STUDENT":
            return {
                ...currentState,
                student: action.payload
            };

        case "SET_LOGIN_STATUS":
            return {
                ...currentState,
                loginStatus: Boolean(action.payload)
            };

        case "CLEAR_SESSION":
            return {
                ...currentState,
                student: null,
                loginStatus: false
            };

        case "SET_COURSES":
            return {
                ...currentState,
                courses: action.payload
            };

        case "SET_ENROLLMENTS":
            return {
                ...currentState,
                enrollments: action.payload
            };

        case "ENROLL_COURSE": {
            const nextEnrollments = {
                ...currentState.enrollments,
                [action.payload.courseId]: 0
            };

            return {
                ...currentState,
                enrollments: nextEnrollments
            };
        }

        case "STUDY_COURSE": {
            const currentProgress = currentState.enrollments[action.payload.courseId] || 0;
            const nextProgress = Math.min(100, currentProgress + 10);

            return {
                ...currentState,
                enrollments: {
                    ...currentState.enrollments,
                    [action.payload.courseId]: nextProgress
                }
            };
        }

        case "SET_NOTIFICATIONS":
            return {
                ...currentState,
                notifications: action.payload
            };

        default:
            return currentState;
    }
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

    const nextState = reducer(store, action);

    Object.assign(store, nextState);
    persistState();

    listeners.forEach((listener) => listener(store));

    return store;
}

export function getStudent() {
    if (store.student) {
        return store.student;
    }

    try {
        const savedStudent = localStorage.getItem("student");
        return savedStudent ? JSON.parse(savedStudent) : null;
    } catch (error) {
        return null;
    }
}

export function saveStudent(student) {
    dispatch({ type: "SET_STUDENT", payload: student });
    return student;
}

export function getLoginStatus() {
    if (store.loginStatus) {
        return true;
    }

    return localStorage.getItem("loginStatus") === "true";
}

export function setLoginStatus(status) {
    const normalizedStatus = Boolean(status === true || status === "true");
    dispatch({ type: "SET_LOGIN_STATUS", payload: normalizedStatus });
    return normalizedStatus;
}

export function removeLoginStatus() {
    dispatch({ type: "CLEAR_SESSION" });
    localStorage.removeItem("loginStatus");
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

        if (!savedUsers) {
            const defaultUsers = includeFallback ? [DEFAULT_ADMIN] : [];
            localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
            return defaultUsers;
        }

        const parsed = JSON.parse(savedUsers);
        if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
        }

        return includeFallback ? [DEFAULT_ADMIN] : [];

        const response = await apiRequest("/auth/register", {
            method: "POST",
            body: JSON.stringify(studentData)
        });

        return response.user;
        email: studentData.email,
        password: studentData.password,
        role: "student",
        const response = await apiRequest("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password })
        });

        saveAuthToken(response.token);
        return response.user;
        (entry) =>
            entry.email.toLowerCase() === String(email).toLowerCase() &&
            entry.password === password
        const response = await apiRequest("/courses");
        return response.courses;
    if (!user) {
        throw new Error("Invalid email or password.");
    }
        const response = await apiRequest(`/courses/${encodeURIComponent(courseId)}/enroll`, {
            method: "POST"
        });

        return response.enrollments;

export async function enrollCourseApi(courseId) {
    await wait();
        const response = await apiRequest(`/courses/${encodeURIComponent(courseId)}/study`, {
            method: "POST"
        });

        return response.enrollments;
    }

    dispatch({ type: "ENROLL_COURSE", payload: { courseId } });
    return store.enrollments;
}

export async function studyCourseApi(courseId) {
    await wait();
    dispatch({ type: "STUDY_COURSE", payload: { courseId } });
    return store.enrollments;
}

export { DEFAULT_COURSES, DEFAULT_ADMIN };
