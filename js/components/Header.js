// =====================================
// Header.js
// Header Component
// =====================================

import { getStudent, getLoginStatus } from '../state/state.js';

class Header {
    render() {
        const student = getStudent();
        const isLoggedIn = getLoginStatus() === 'true';
        const isDashboard = window.location.pathname.includes('dashboard');

        const navLinks = `
            <a href="/">🏠 Home</a>
            ${!isLoggedIn ? `<a href="/login">🔑 Login</a>` : ''}
            ${!isLoggedIn ? `<a href="/register">📝 Register</a>` : ''}
            ${isLoggedIn ? `<a href="/dashboard" ${isDashboard ? 'class="active"' : ''}>📊 Dashboard</a>` : ''}
            ${isLoggedIn ? `<a href="#courses">📚 Courses</a>` : ''}
            ${isLoggedIn ? `<a href="#profile">👤 Profile</a>` : ''}
            ${isLoggedIn ? `<a href="#" id="logoutLink" class="logout">🚪 Logout</a>` : ''}
        `;

        if (isDashboard) {
            return `
                <header class="dashboard-header">
                    <div class="logo">🎓 Student Portal</div>
                    <nav class="navbar">
                        ${navLinks}
                    </nav>
                </header>
            `;
        }

        return `
            <header>
                <h1>Student Course Registration & Learning Progress Tracker</h1>
                <nav>
                    ${navLinks}
                </nav>
            </header>
        `;
    }
}

export default Header;