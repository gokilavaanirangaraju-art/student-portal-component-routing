// =====================================
// Login.js
// Login Page Component
// =====================================

import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import { loginStudent } from '../auth/auth.js';

class Login {
    render() {
        const header = new Header();
        const footer = new Footer();

        return `
            ${header.render()}
            <div class="container">
                <h2>Student Login</h2>
                <form id="loginForm">
                    <label for="email">Email</label>
                    <input type="email" id="email" placeholder="Enter your email" required>
                    
                    <label for="password">Password</label>
                    <input type="password" id="password" placeholder="Enter password" required>
                    
                    <button type="submit">Login</button>
                </form>
                <p>
                    New Student?
                    <a href="/register">Register</a>
                </p>
            </div>
            ${footer.render()}
        `;
    }

    mount() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                
                loginStudent(email, password);
            });
        }
    }
}

export default Login;