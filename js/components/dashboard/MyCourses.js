// =====================================
// MyCourses.js
// My Courses Component
// =====================================

import { getCourses, getEnrollments, saveEnrollments } from '../../state/state.js';

class MyCourses {
    render() {
        const courses = getCourses();
        const enrollments = getEnrollments();
        const enrolledIds = Object.keys(enrollments);

        let courseListHTML = '';

        if (enrolledIds.length === 0) {
            courseListHTML = '<li>You haven\'t enrolled in any courses yet.</li>';
        } else {
            courseListHTML = enrolledIds.map(id => {
                const course = courses.find(c => c.id === id);
                if (!course) return '';
                const progress = enrollments[id];
                const isCompleted = progress >= 100;

                return `
                    <li>
                        <div>
                            <strong>${course.icon} ${course.name}</strong>
                            <small>${progress}% completed</small>
                        </div>
                        <div class="my-course-controls">
                            <span class="status ${isCompleted ? 'completed' : 'progress-status'}">${progress}%</span>
                            <button class="study-button" data-course-id="${course.id}" ${isCompleted ? 'disabled' : ''}>
                                ${isCompleted ? 'Completed 🎉' : 'Study'}
                            </button>
                        </div>
                    </li>
                `;
            }).join('');
        }

        return `
            <div class="card my-course-card">
                <div class="card-icon">⭐</div>
                <h2>My Courses</h2>
                <p class="card-description">Courses you are currently learning.</p>
                <ul class="my-courses">
                    ${courseListHTML}
                </ul>
            </div>
        `;
    }

    mount() {
        document.querySelectorAll('.study-button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const courseId = e.target.getAttribute('data-course-id');
                this.studyCourse(courseId);
            });
        });
    }

    studyCourse(courseId) {
        const enrollments = getEnrollments();
        const current = enrollments[courseId] || 0;
        const next = Math.min(100, current + 10);

        enrollments[courseId] = next;
        saveEnrollments(enrollments);

        if (next >= 100) {
            alert('🎉 Course completed!');
        }

        location.reload();
    }
}

export default MyCourses;