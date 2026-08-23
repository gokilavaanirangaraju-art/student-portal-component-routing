// =====================================
// Router.js
// Client-Side Router
// =====================================

import Home from '../pages/Home.js';
import Register from '../pages/Register.js';
import Login from '../pages/Login.js';
import Dashboard from '../pages/Dashboard.js';
import NotFound from '../pages/NotFound.js';

class Router {
    constructor(appElement) {
        this.appElement = appElement;
        this.routes = {
            '/': Home,
            '/index.html': Home,
            '/register': Register,
            '/register.html': Register,
            '/login': Login,
            '/login.html': Login,
            '/dashboard': Dashboard,
            '/dashboard.html': Dashboard
        };
        this.currentComponent = null;
    }

    init() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => this.render());
        
        // Handle link clicks
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                const href = e.target.getAttribute('href');
                if (href && !href.startsWith('http') && !href.startsWith('#')) {
                    e.preventDefault();
                    this.navigate(href);
                }
            }
        });
        
        // Initial render
        this.render();
    }

    navigate(path) {
        window.history.pushState(null, '', path);
        this.render();
    }

    render() {
        const path = window.location.pathname;
        let componentClass = this.routes[path];

        // Handle paths with trailing slashes or variations
        if (!componentClass) {
            if (path.includes('register')) {
                componentClass = this.routes['/register'];
            } else if (path.includes('login')) {
                componentClass = this.routes['/login'];
            } else if (path.includes('dashboard')) {
                componentClass = this.routes['/dashboard'];
            } else {
                componentClass = NotFound;
            }
        }

        // Clean up previous component if it exists
        if (this.currentComponent && typeof this.currentComponent.cleanup === 'function') {
            this.currentComponent.cleanup();
        }

        // Render new component
        this.currentComponent = new componentClass();
        this.appElement.innerHTML = this.currentComponent.render();
        
        // Call mount lifecycle if it exists
        if (typeof this.currentComponent.mount === 'function') {
            this.currentComponent.mount();
        }
    }
}

export default Router;