// =====================================
// Home.js
// Home Page Component
// =====================================

import Header from '../components/Header.js';
import Footer from '../components/Footer.js';

class Home {
    render() {
        const header = new Header();
        const footer = new Footer();

        return `
            ${header.render()}
            <section class="hero">
                <h2>Welcome Students</h2>
                <p>
                    Register yourself, enroll in available courses,
                    view course details and monitor your learning progress.
                </p>
                <a href="/register" class="btn">Get Started</a>
            </section>
            <section class="cards">
                <div class="card">
                    <h3>Register</h3>
                    <p>Create a student account.</p>
                </div>
                <div class="card">
                    <h3>Enroll Courses</h3>
                    <p>Choose available courses.</p>
                </div>
                <div class="card">
                    <h3>Track Progress</h3>
                    <p>View course completion percentage.</p>
                </div>
            </section>
            ${footer.render()}
        `;
    }
}

export default Home;