// =====================================
// Register.js
// Register Page Component
// =====================================

import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import { registerStudent } from '../auth/auth.js';

class Register {
    render() {
        const header = new Header();
        const footer = new Footer();

        return `
            ${header.render()}
            <div class="container">
                <h2>Student Registration</h2>
                <form id="registerForm">
                    <label for="name">Full Name</label>
                    <input type="text" id="name" placeholder="Enter your full name" required>
                    
                    <label for="email">Email</label>
                    <input type="email" id="email" placeholder="Enter your email" required>
                    
                    <label for="password">Password</label>
                    <input type="password" id="password" placeholder="Enter password" required>
                    
                    <label for="confirmPassword">Confirm Password</label>
                    <input type="password" id="confirmPassword" placeholder="Confirm password" required>
                    
                    <button type="submit">Register</button>
                </form>
                <p>
                    Already have an account?
                    <a href="/login">Login</a>
                </p>
            </div>
            ${footer.render()}
        `;
    }

    mount() {
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const confirmPassword = document.getElementById('confirmPassword').value;
                
                registerStudent(name, email, password, confirmPassword);
            });
        }
    }
}

export default Register;