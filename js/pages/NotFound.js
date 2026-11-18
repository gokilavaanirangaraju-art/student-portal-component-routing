// =====================================
// NotFound.js
// 404 Not Found Page
// =====================================

import Header from '../components/Header.js';
import Footer from '../components/Footer.js';

class NotFound {
    render() {
        const header = new Header();
        const footer = new Footer();

        return `
            ${header.render()}
            <section class="hero">
                <h2>404 - Page Not Found</h2>
                <p>The page you're looking for doesn't exist.</p>
                <a href="/" class="btn">Go Home</a>
            </section>
            ${footer.render()}
        `;
    }
}

export default NotFound;