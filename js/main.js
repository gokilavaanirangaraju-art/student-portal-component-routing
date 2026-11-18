// =====================================
// main.js
// Application Entry Point
// =====================================

import Router from './router/Router.js';
import { checkLogin, protectDashboard } from './auth/navigation.js';
import { getStudent } from './state/state.js';

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Check login status and update navigation
    checkLogin();
    
    // Initialize router
    const app = document.getElementById('app');
    const router = new Router(app);
    
    // Start routing
    router.init();
    
    // Protect dashboard route
    protectDashboard();
    
    // Populate profile if on dashboard
    const student = getStudent();
    if (student) {
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');
        
        if (profileName) profileName.textContent = student.name;
        if (profileEmail) profileEmail.textContent = student.email;
    }
});