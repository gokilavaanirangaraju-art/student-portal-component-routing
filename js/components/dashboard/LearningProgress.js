// =====================================
// LearningProgress.js
// Learning Progress Component
// =====================================

import { getCourses, getEnrollments } from '../../state/state.js';

class LearningProgress {
    render() {
        const courses = getCourses();
        const enrollments = getEnrollments();
        const enrolledIds = Object.keys(enrollments);

        let progressHTML = '';

        if (enrolledIds.length === 0) {
            progressHTML = '<p class="card-description">Enroll in a course to start tracking progress.</p>';
        } else {
            progressHTML = enrolledIds.map(id => {
                const course = courses.find(c => c.id === id);
                if (!course) return '';
                const progress = enrollments[id];

                return `
                    <div class="progress-item">
                        <div class="progress-title">
                            <span>${course.icon} ${course.name}</span>
                            <strong>${progress}%</strong>
                        </div>
                        <progress value="${progress}" max="100"></progress>
                    </div>
                `;
            }).join('');
        }

        return `
            <div class="card progress-card">
                <div class="card-icon">📈</div>
                <h2>Learning Progress</h2>
                <p class="card-description">Track your learning progress.</p>
                <div id="progressList">
                    ${progressHTML}
                </div>
            </div>
        `;
    }
}

export default LearningProgress;