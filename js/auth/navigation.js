// =====================================
// navigation.js
// Navigation & Dashboard Protection
// =====================================

import { getStudent, getLoginStatus } from '../state/state.js';

export function checkLogin() {
    const user = getStudent();
    const isLoggedIn = getLoginStatus() === 'true';
    
    if (user && isLoggedIn) {
        return true;
    }
    return false;
}

export function protectDashboard() {
    const status = getLoginStatus();
    const isDashboardRoute = window.location.pathname.includes('dashboard');

    if (isDashboardRoute && status !== 'true') {
        alert('Please Login First');
        window.location.href = '/login';
    }
}