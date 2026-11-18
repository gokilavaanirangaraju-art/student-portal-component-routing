// =====================================
// Profile.js
// Profile Component
// =====================================

import { getStudent } from '../../state/state.js';

class Profile {
    render() {
        const student = getStudent();
        const name = student ? student.name : 'Student';
        const email = student ? student.email : 'student@example.com';

        return `
            <div class="card profile-card" id="profile">
                <div class="card-icon">👤</div>
                <h2>My Profile</h2>
                <p class="card-description">Manage your student information.</p>
                <div class="profile-info">
                    <p>
                        <strong>Name:</strong>
                        <span id="profileName">${name}</span>
                    </p>
                    <p>
                        <strong>Email:</strong>
                        <span id="profileEmail">${email}</span>
                    </p>
                    <p>
                        <strong>Status:</strong>
                        <span class="online">● Active</span>
                    </p>
                </div>
                <button class="profile-button">Edit Profile</button>
            </div>
        `;
    }
}

export default Profile;