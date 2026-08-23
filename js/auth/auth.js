// =====================================
// auth.js
// Authentication Logic
// =====================================

import { getStudent, saveStudent, setLoginStatus } from '../state/state.js';
import {
    validateName,
    validateEmail,
    validatePassword,
    validateConfirmPassword
} from '../validation/validation.js';

export function registerStudent(name, email, password, confirmPassword) {
    if (!validateName(name)) return;
    if (!validateEmail(email)) return;
    if (!validatePassword(password)) return;
    if (!validateConfirmPassword(password, confirmPassword)) return;

    const student = { name, email, password };
    saveStudent(student);
    
    alert('Registration Successful');
    window.location.href = '/login';
}

export function loginStudent(email, password) {
    const storedUser = getStudent();

    if (!storedUser) {
        alert('Please register first');
        return;
    }

    if (email === storedUser.email && password === storedUser.password) {
        setLoginStatus('true');
        alert('Login Successful');
        window.location.href = '/dashboard';
    } else {
        alert('Invalid Email or Password');
    }
}

export function logout() {
    localStorage.removeItem('loginStatus');
    alert('Logout Successful');
    window.location.href = '/login';
}