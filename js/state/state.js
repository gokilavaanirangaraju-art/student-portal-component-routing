// =====================================
// state.js
// Application State Management
// =====================================

export function getStudent() {
    const student = localStorage.getItem('student');
    return student ? JSON.parse(student) : null;
}

export function saveStudent(student) {
    localStorage.setItem('student', JSON.stringify(student));
}

export function getLoginStatus() {
    return localStorage.getItem('loginStatus');
}

export function setLoginStatus(status) {
    localStorage.setItem('loginStatus', status);
}

export function removeLoginStatus() {
    localStorage.removeItem('loginStatus');
}

export function getCourses() {
    const courses = localStorage.getItem('courses');
    return courses ? JSON.parse(courses) : [];
}

export function saveCourses(courses) {
    localStorage.setItem('courses', JSON.stringify(courses));
}

export function getEnrollments() {
    const enrollments = localStorage.getItem('enrollments');
    return enrollments ? JSON.parse(enrollments) : {};
}

export function saveEnrollments(enrollments) {
    localStorage.setItem('enrollments', JSON.stringify(enrollments));
}