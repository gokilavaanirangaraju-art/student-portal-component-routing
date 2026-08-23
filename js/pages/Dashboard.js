// =====================================
// Dashboard.js
// Dashboard Page Component
// =====================================

import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import AvailableCourses from '../components/dashboard/AvailableCourses.js';
import MyCourses from '../components/dashboard/MyCourses.js';
import LearningProgress from '../components/dashboard/LearningProgress.js';
import Profile from '../components/dashboard/Profile.js';
import { logout } from '../auth/auth.js';

class Dashboard {
    render() {
        const header = new Header();
        const footer = new Footer();
        const availableCourses = new AvailableCourses();
        const myCourses = new MyCourses();
        const learningProgress = new LearningProgress();
        const profile = new Profile();

        return `
            ${header.render()}
            <section class="welcome">
                <div>
                    <h1>Welcome to Your Dashboard 👋</h1>
                    <p>Continue your learning journey and explore new courses.</p>
                </div>
                <div class="student-icon">🎓</div>
            </section>
            <main class="dashboard">
                ${availableCourses.render()}
                ${myCourses.render()}
                ${learningProgress.render()}
                ${profile.render()}
            </main>
            ${footer.render()}
        `;
    }

    mount() {
        const logoutLink = document.getElementById('logoutLink');
        if (logoutLink) {
            logoutLink.addEventListener('click', (e) => {
                e.preventDefault();
                logout();
            });
        }

        const availableCourses = new (require('../components/dashboard/AvailableCourses.js').default)();
        const myCourses = new (require('../components/dashboard/MyCourses.js').default)();

        availableCourses.mount();
        myCourses.mount();
    }
}

export default Dashboard;