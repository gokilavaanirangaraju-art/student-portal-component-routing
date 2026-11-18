// =====================================
// AvailableCourses.js
// Available Courses Component
// =====================================

import { getCourses, getEnrollments, saveCourses, saveEnrollments } from '../../state/state.js';
import { DEFAULT_COURSES } from '../../constants/courses.js';

class AvailableCourses {
    constructor() {
        this.ensureDefaultCourses();
    }

    ensureDefaultCourses() {
        const existing = getCourses();
        if (!existing || existing.length === 0) {
            saveCourses(DEFAULT_COURSES);
        }
    }

    render() {
        const courses = getCourses();
        const enrollments = getEnrollments();

        let courseListHTML = '';

        if (courses.length === 0) {
            courseListHTML = '<li>No courses yet. Add one below!</li>';
        } else {
            courseListHTML = courses.map(course => {
                const alreadyEnrolled = Object.prototype.hasOwnProperty.call(enrollments, course.id);
                return `
                    <li>
                        <span>${course.icon} ${course.name}</span>
                        <button class="enroll-btn" data-course-id="${course.id}" ${alreadyEnrolled ? 'disabled' : ''}>
                            ${alreadyEnrolled ? 'Enrolled ✓' : 'Enroll'}
                        </button>
                    </li>
                `;
            }).join('');
        }

        return `
            <div class="card course-card" id="courses">
                <div class="card-icon">📚</div>
                <h2>Available Courses</h2>
                <p class="card-description">Explore courses and improve your skills.</p>
                <ul class="course-list">
                    ${courseListHTML}
                </ul>
            </div>
        `;
    }

    mount() {
        document.querySelectorAll('.enroll-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const courseId = e.target.getAttribute('data-course-id');
                this.enrollInCourse(courseId);
            });
        });
    }

    enrollInCourse(courseId) {
        const enrollments = getEnrollments();
        if (Object.prototype.hasOwnProperty.call(enrollments, courseId)) {
            return;
        }

        enrollments[courseId] = 0;
        saveEnrollments(enrollments);
        location.reload();
    }
}

export default AvailableCourses;