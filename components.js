const publicNavigation = `
    <header>
        <h1>Student Course Registration &amp; Learning Progress Tracker</h1>
        <nav aria-label="Main navigation">
            <a href="index.html">Home</a>
            <a href="login.html" id="loginLink">Login</a>
            <a href="register.html" id="registerLink">Register</a>
            <a href="dashboard.html" id="dashboardLink" style="display:none;">Dashboard</a>
            <a href="#" id="logoutLink" class="logout" style="display:none;">Logout</a>
        </nav>
    </header>
`;

const footer = `
    <footer>
        <p>© 2026 Student Course Registration System</p>
    </footer>
`;

export function homePage() {
    return `
        ${publicNavigation}
        <section class="hero">
            <h2>Welcome Students</h2>
            <p>Register yourself, enroll in available courses, view course details and monitor your learning progress.</p>
            <a href="register.html" class="btn">Get Started</a>
        </section>
        <section class="cards">
            <a class="card feature-link" href="register.html">
                <h3>Register</h3>
                <p>Create a student account.</p>
            </a>
            <a class="card feature-link" href="dashboard.html#courses">
                <h3>Enroll Courses</h3>
                <p>Choose available courses.</p>
            </a>
            <a class="card feature-link" href="dashboard.html#progress">
                <h3>Track Progress</h3>
                <p>View course completion percentage.</p>
            </a>
        </section>
        ${footer}
    `;
}

export function loginPage() {
    return `
        ${publicNavigation}
        <div class="container">
            <h2>Student Login</h2>
            <p id="registrationMessage" class="success-message" role="status" hidden></p>
            <form id="loginForm">
                <label for="email">Email</label>
                <input type="email" id="email" placeholder="Enter Email" autocomplete="email" required>
                <label for="password">Password</label>
                <input type="password" id="password" placeholder="Enter Password" autocomplete="current-password" required>
                <button type="submit">Login</button>
                <p>New Student? <a href="register.html">Register</a></p>
            </form>
        </div>
    `;
}

export function registerPage() {
    return `
        ${publicNavigation}
        <div class="container">
            <h2>Student Registration</h2>
            <form id="registerForm">
                <p id="registerStatus" class="form-status" role="status" aria-live="polite"></p>
                <label for="name">Full Name</label>
                <input type="text" id="name" minlength="3" autocomplete="name" required>
                <label for="email">Email</label>
                <input type="email" id="email" autocomplete="email" required>
                <label for="password">Password</label>
                <input type="password" id="password" minlength="6" autocomplete="new-password" required>
                <label for="confirmPassword">Confirm Password</label>
                <input type="password" id="confirmPassword" minlength="6" autocomplete="new-password" required>
                <button type="submit" id="registerButton">Register</button>
            </form>
        </div>
    `;
}

export function dashboardPage() {
    return `
        <header class="dashboard-header">
            <div class="logo">🎓 Student Portal</div>
            <nav class="navbar" aria-label="Main navigation">
                <a href="index.html">🏠 Home</a>
                <a href="login.html" id="loginLink">Login</a>
                <a href="register.html" id="registerLink">Register</a>
                <a href="dashboard.html" class="active" id="dashboardLink">📊 Dashboard</a>
                <a href="#courses">📚 Courses</a>
                <a href="#profile">👤 Profile</a>
                <a href="#" id="logoutLink" class="logout">🚪 Logout</a>
            </nav>
        </header>
        <section class="welcome">
            <div>
                <h1>Welcome to Your Dashboard 👋</h1>
                <p>Continue your learning journey and explore new courses.</p>
            </div>
            <div class="student-icon">🎓</div>
        </section>
        <main class="dashboard">
            <div class="card course-card" id="courses">
                <div class="card-icon">📚</div>
                <h2>Available Courses</h2>
                <p class="card-description">Explore courses and improve your skills.</p>
                <ul class="course-list" id="courseList"></ul>
            </div>
            <div class="card my-course-card">
                <div class="card-icon">⭐</div>
                <h2>My Courses</h2>
                <p class="card-description">Courses you are currently learning.</p>
                <ul class="my-courses" id="myCourseList"></ul>
                <a class="view-button" href="#courses">View More Courses</a>
            </div>
            <div class="card progress-card" id="progress">
                <div class="card-icon">📈</div>
                <h2>Learning Progress</h2>
                <p class="card-description">Track your learning progress.</p>
                <div id="progressList"></div>
            </div>
            <div class="card profile-card" id="profile">
                <div class="card-icon">👤</div>
                <h2>My Profile</h2>
                <p class="card-description">Manage your student information.</p>
                <div class="profile-info">
                    <p><strong>Name:</strong> <span id="profileName">Student</span></p>
                    <p><strong>Email:</strong> <span id="profileEmail">student@example.com</span></p>
                    <p><strong>Status:</strong> <span class="online">● Active</span></p>
                </div>
                <button class="profile-button">Edit Profile</button>
            </div>
        </main>
        <footer>
            <p>© 2026 Student Course Registration System</p>
            <p>Learn • Grow • Succeed 🎓</p>
        </footer>
    `;
}

const routes = {
    home: { title: "Student Course Registration", render: homePage },
    login: { title: "Student Login", render: loginPage },
    register: { title: "Register", render: registerPage },
    dashboard: { title: "Student Dashboard", render: dashboardPage }
};

export function getRoute(pathname) {
    const page = pathname.split("/").pop() || "index.html";

    if (page === "login.html") {
        return routes.login;
    }

    if (page === "register.html") {
        return routes.register;
    }

    if (page === "dashboard.html") {
        return routes.dashboard;
    }

    return routes.home;
}

export function renderRoute(pathname) {
    const route = getRoute(pathname);
    const app = document.getElementById("app");

    if (!app) {
        return route;
    }

    document.title = route.title;
    app.innerHTML = route.render();
    return route;
}
