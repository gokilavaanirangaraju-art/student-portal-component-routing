# Student Portal - Component-Based Architecture with Routing

A modern single-page application (SPA) built with vanilla JavaScript using a component-based architecture and client-side routing.

## 🎯 Features

- **Component-Based Architecture**: Modular, reusable components
- **Client-Side Routing**: Navigate between pages without page reload
- **Authentication**: Register, Login, and Logout functionality
- **Course Management**: Enroll, view progress, and track learning
- **Dashboard**: Personalized student dashboard with analytics
- **State Management**: LocalStorage-based state persistence
- **Responsive Design**: Mobile-friendly UI

## 📁 Project Structure

```
student-portal-component-routing/
├── index.html                          # Main entry point
├─��� style.css                           # Global styles
├── README.md                           # Documentation
│
└── js/
    ├── main.js                        # Application entry point
    ├── router/
    │   └── Router.js                  # Client-side router
    ├── pages/
    │   ├── Home.js
    │   ├── Register.js
    │   ├── Login.js
    │   ├── Dashboard.js
    │   └── NotFound.js
    ├── components/
    │   ├── Header.js
    │   ├── Footer.js
    │   └── dashboard/
    │       ├── AvailableCourses.js
    │       ├── MyCourses.js
    │       ├── LearningProgress.js
    │       └── Profile.js
    ├── auth/
    │   ├── auth.js
    │   └── navigation.js
    ├── state/
    │   └── state.js
    ├── validation/
    │   └── validation.js
    └── constants/
        └── courses.js
```

## 🏗️ Architecture Overview

### Component System
Each component is a class with:
- `render()` - Returns HTML string
- `mount()` - Called after render for interactivity
- `cleanup()` - Called before removal

### Router
Handles client-side navigation:
- Intercepts link clicks
- Updates browser history
- Re-renders components based on URL
- Supports back/forward navigation

### State Management
Data persisted in LocalStorage:
- Student data
- Login status
- Enrolled courses
- Learning progress

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/gokilavaanirangaraju-art/student-portal-component-routing.git
cd student-portal-component-routing
```

2. Start a local server:
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx http-server
```

3. Open your browser:
```
http://localhost:8000
```

## 📖 Usage

### Navigation
```javascript
// Automatic through link clicks
<a href="/dashboard">Go to Dashboard</a>

// Programmatic
router.navigate('/dashboard');
```

### Creating Components

1. Create file in appropriate directory
2. Define component class
3. Implement `render()` method
4. Implement `mount()` if needed
5. Export component

## 🔐 Authentication Flow

1. **Register** → Save to LocalStorage
2. **Login** → Verify credentials
3. **Dashboard** → Protected route
4. **Logout** → Clear login status

## 📚 Course Management

- **Default Courses**: Auto-loaded on first visit
- **Enrollment**: Click "Enroll" button
- **Progress**: Click "Study" to add 10%
- **Completion**: Alert at 100%

## 🎨 Styling

- CSS Grid for layout
- Gradient backgrounds
- Flexbox for alignment
- Media queries for responsive design

## ✅ Testing

1. Register new account
2. Login with credentials
3. Enroll in courses
4. Increase progress
5. Test navigation
6. Logout

## 🌐 Browser Support

- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Mobile browsers

## 🚀 Future Enhancements

- [ ] Backend API integration
- [ ] User profile editing
- [ ] Course content/lessons
- [ ] Quiz/assessments
- [ ] Discussion forums
- [ ] Dark mode
- [ ] Internationalization (i18n)
- [ ] Certificate generation

## 📄 License

MIT License - Open source project

## 🤝 Contributing

Contributions welcome! Submit issues or pull requests.

## 📧 Support

Create an issue in the repository for support.
