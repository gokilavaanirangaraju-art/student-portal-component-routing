// =====================================
// course.js
// Course Catalog, Enrollment & Management
// =====================================

import {
    getCourses,
    saveCourses,
    getEnrollments,
    saveEnrollments,
    getUsers,
    getStudent,
    fetchMockCourses,
    enrollCourseApi,
    studyCourseApi,
    DEFAULT_COURSES
} from "./js/state.js";

let editingCourseId = null;

export async function initCourses() {
    ensureDefaultCourses();
    const courses = await fetchMockCourses();
    saveCourses(courses);
    renderAvailableCourses();
    renderMyCourses();
    renderProgress();
    renderAdminPanel();
    bindAddCourseForm();
}

function ensureDefaultCourses() {
    const existing = getCourses();
    const existingIds = new Set(existing.map((course) => course.id));
    const missingDefaults = DEFAULT_COURSES.filter(
        (course) => !existingIds.has(course.id)
    );

    if (missingDefaults.length > 0) {
        saveCourses([...existing, ...missingDefaults]);
    }
}

function bindAddCourseForm() {
    const addCourseForm = document.getElementById("addCourseForm");

    if (!addCourseForm) {
        return;
    }

    addCourseForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const nameInput = document.getElementById("newCourseName");
        const instructorInput = document.getElementById("newCourseInstructor");
        const durationInput = document.getElementById("newCourseDuration");
        const categoryInput = document.getElementById("newCourseCategory");
        const descriptionInput = document.getElementById("newCourseDescription");

        const name = nameInput.value.trim();
        const instructor = instructorInput.value.trim();
        const duration = durationInput.value.trim();
        const category = categoryInput.value.trim();
        const description = descriptionInput.value.trim();

        if (!name) {
            alert("Please enter a course name");
            return;
        }

        const courses = getCourses();

        if (editingCourseId) {
            const index = courses.findIndex((course) => course.id === editingCourseId);

            if (index >= 0) {
                courses[index] = {
                    ...courses[index],
                    name: name,
                    title: name,
                    instructor: instructor || courses[index].instructor,
                    duration: duration || courses[index].duration,
                    category: category || courses[index].category,
                    description: description || courses[index].description,
                    icon: courses[index].icon || "📘"
                };
            }
        } else {
            const courseId = name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
            courses.push({
                id: courseId,
                icon: "📘",
                name: name,
                title: name,
                instructor: instructor || "TBA",
                duration: duration || "8 weeks",
                category: category || "General",
                description: description || "Course details will be updated soon."
            });
        }

        saveCourses(courses);

        editingCourseId = null;
        addCourseForm.reset();
        const submitButton = document.getElementById("courseSubmitButton");
        if (submitButton) {
            submitButton.textContent = "Add Course";
        }

        renderAvailableCourses();
        renderAdminPanel();
    });
}

function renderAvailableCourses() {
    const courseList = document.getElementById("courseList");

    if (!courseList) {
        return;
    }

    const courses = getCourses();
    const enrollments = getEnrollments();

    courseList.innerHTML = "";

    if (courses.length === 0) {
        const li = document.createElement("li");
        li.textContent = "No courses yet. Add one below!";
        courseList.appendChild(li);
        return;
    }

    courses.forEach(function (course) {
        const alreadyEnrolled = Object.prototype.hasOwnProperty.call(enrollments, course.id);
        const li = document.createElement("li");

        const span = document.createElement("span");
        span.textContent = (course.icon || "📘") + " " + course.name;

        const button = document.createElement("button");
        button.textContent = alreadyEnrolled ? "Enrolled ✓" : "Enroll";
        button.disabled = alreadyEnrolled;

        button.addEventListener("click", function () {
            enrollInCourse(course.id);
        });

        li.appendChild(span);
        li.appendChild(button);

        courseList.appendChild(li);
    });
}

async function enrollInCourse(courseId) {
    const enrollments = getEnrollments();

    if (Object.prototype.hasOwnProperty.call(enrollments, courseId)) {
        return;
    }

    const updatedEnrollments = await enrollCourseApi(courseId);
    saveEnrollments(updatedEnrollments);

    renderAvailableCourses();
    renderMyCourses();
    renderProgress();
}

function renderMyCourses() {
    const myCourseList = document.getElementById("myCourseList");

    if (!myCourseList) {
        return;
    }

    const courses = getCourses();
    const enrollments = getEnrollments();
    myCourseList.innerHTML = "";

    const enrolledIds = Object.keys(enrollments);

    if (enrolledIds.length === 0) {
        const li = document.createElement("li");
        li.textContent = "You haven't enrolled in any courses yet.";
        myCourseList.appendChild(li);
        return;
    }

    enrolledIds.forEach(function (id) {
        const course = courses.find((item) => item.id === id);

        if (!course) {
            return;
        }

        const progress = enrollments[id];
        const li = document.createElement("li");

        const infoDiv = document.createElement("div");
        const strong = document.createElement("strong");
        strong.textContent = (course.icon || "📘") + " " + course.name;

        const small = document.createElement("small");
        small.textContent = progress + "% completed";

        infoDiv.appendChild(strong);
        infoDiv.appendChild(small);

        const controls = document.createElement("div");
        controls.className = "my-course-controls";

        const statusSpan = document.createElement("span");
        statusSpan.className = "status " + (progress >= 100 ? "completed" : "progress-status");
        statusSpan.textContent = progress + "%";

        const studyButton = document.createElement("button");
        studyButton.className = "study-button";
        studyButton.textContent = progress >= 100 ? "Completed 🎉" : "Study";
        studyButton.disabled = progress >= 100;

        studyButton.addEventListener("click", function () {
            studyCourse(id);
        });

        controls.appendChild(statusSpan);
        controls.appendChild(studyButton);

        li.appendChild(infoDiv);
        li.appendChild(controls);
        myCourseList.appendChild(li);
    });
}

async function studyCourse(courseId) {
    const enrollments = getEnrollments();
    const current = enrollments[courseId] || 0;
    const next = Math.min(100, current + 10);

    const updatedEnrollments = await studyCourseApi(courseId);
    saveEnrollments(updatedEnrollments);

    renderMyCourses();
    renderProgress();

    if (next >= 100) {
        alert("🎉 Course completed!");
    }
}

function renderProgress() {
    const progressList = document.getElementById("progressList");

    if (!progressList) {
        return;
    }

    const courses = getCourses();
    const enrollments = getEnrollments();
    progressList.innerHTML = "";

    const enrolledIds = Object.keys(enrollments);

    if (enrolledIds.length === 0) {
        const p = document.createElement("p");
        p.className = "card-description";
        p.textContent = "Enroll in a course to start tracking progress.";
        progressList.appendChild(p);
        return;
    }

    enrolledIds.forEach(function (id) {
        const course = courses.find((item) => item.id === id);

        if (!course) {
            return;
        }

        const progress = enrollments[id];
        const item = document.createElement("div");
        item.className = "progress-item";

        const title = document.createElement("div");
        title.className = "progress-title";

        const span = document.createElement("span");
        span.textContent = (course.icon || "📘") + " " + course.name;

        const strong = document.createElement("strong");
        strong.textContent = progress + "%";

        title.appendChild(span);
        title.appendChild(strong);

        const bar = document.createElement("progress");
        bar.setAttribute("value", progress);
        bar.setAttribute("max", "100");

        item.appendChild(title);
        item.appendChild(bar);
        progressList.appendChild(item);
    });
}

function renderAdminPanel() {
    const currentStudent = getStudent();
    const adminView = document.getElementById("adminDashboardView");
    const studentView = document.getElementById("studentDashboardView");

    if (adminView) {
        const isAdmin = currentStudent && currentStudent.role === "admin";
        adminView.hidden = !isAdmin;
    }

    if (studentView) {
        const isStudent = currentStudent && currentStudent.role === "student";
        studentView.hidden = !isStudent;
    }

    const courseTable = document.getElementById("adminCourseTable");
    const studentTable = document.getElementById("studentTable");
    const reportSummary = document.getElementById("reportSummary");

    if (!courseTable || !studentTable || !reportSummary) {
        return;
    }

    const courses = getCourses();
    const users = getUsers();
    const enrollments = getEnrollments();

    courseTable.innerHTML = "";
    studentTable.innerHTML = "";

    courses.forEach((course) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${course.name}</td>
            <td>${course.instructor || "TBA"}</td>
            <td>${course.duration || "8 weeks"}</td>
            <td>${course.category || "General"}</td>
            <td>
                <button data-action="edit" data-id="${course.id}">Edit</button>
                <button data-action="delete" data-id="${course.id}">Delete</button>
            </td>
        `;

        row.querySelector("[data-action='edit']").addEventListener("click", function () {
            populateCourseForm(course);
        });

        row.querySelector("[data-action='delete']").addEventListener("click", function () {
            deleteCourse(course.id);
        });

        courseTable.appendChild(row);
    });

    const studentUsers = users.filter((user) => user.role === "student");
    studentUsers.forEach((user) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.department || "General"}</td>
        `;
        studentTable.appendChild(row);
    });

    const totalStudents = studentUsers.length;
    const totalEnrollments = Object.keys(enrollments).length;
    const completionRate = totalEnrollments > 0
        ? Math.round((Object.values(enrollments).reduce((sum, value) => sum + Number(value), 0) / (totalEnrollments * 100)) * 100)
        : 0;

    reportSummary.innerHTML = `
        <p><strong>Total Courses:</strong> ${courses.length}</p>
        <p><strong>Students:</strong> ${totalStudents}</p>
        <p><strong>Enrollments:</strong> ${totalEnrollments}</p>
        <p><strong>Avg Completion:</strong> ${completionRate}%</p>
    `;
}

function populateCourseForm(course) {
    const nameInput = document.getElementById("newCourseName");
    const instructorInput = document.getElementById("newCourseInstructor");
    const durationInput = document.getElementById("newCourseDuration");
    const categoryInput = document.getElementById("newCourseCategory");
    const descriptionInput = document.getElementById("newCourseDescription");
    const submitButton = document.getElementById("courseSubmitButton");

    if (!nameInput || !instructorInput || !durationInput || !categoryInput || !descriptionInput || !submitButton) {
        return;
    }

    editingCourseId = course.id;
    nameInput.value = course.name || "";
    instructorInput.value = course.instructor || "";
    durationInput.value = course.duration || "";
    categoryInput.value = course.category || "";
    descriptionInput.value = course.description || "";
    submitButton.textContent = "Update Course";
}

function deleteCourse(courseId) {
    const courses = getCourses();
    const updatedCourses = courses.filter((course) => course.id !== courseId);
    saveCourses(updatedCourses);

    const enrollments = getEnrollments();
    delete enrollments[courseId];
    saveEnrollments(enrollments);

    renderAvailableCourses();
    renderMyCourses();
    renderProgress();
    renderAdminPanel();
}

export { editingCourseId };