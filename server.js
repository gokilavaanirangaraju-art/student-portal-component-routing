const http = require("node:http");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const PORT = Number(process.env.PORT) || 5500;
const ROOT = path.resolve(__dirname, "..");
const DATA_FILE = path.join(__dirname, "data.json");
const sessions = new Map();

const MIME_TYPES = {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg"
};

function readData() {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2) + "\n");
}

function sendJson(response, status, payload) {
    response.writeHead(status, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store"
    });
    response.end(JSON.stringify(payload));
}

function publicUser(user) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
    };
}

function readBody(request) {
    return new Promise((resolve, reject) => {
        let body = "";

        request.on("data", (chunk) => {
            body += chunk;

            if (body.length > 1_000_000) {
                reject(new Error("Request body is too large."));
                request.destroy();
            }
        });

        request.on("end", () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch {
                reject(new Error("Request body must be valid JSON."));
            }
        });

        request.on("error", reject);
    });
}

function getSessionUser(request, data) {
    const header = request.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";
    const userId = sessions.get(token);

    if (!userId) {
        return null;
    }

    return data.users.find((user) => user.id === userId) || null;
}

function requireUser(request, response, data) {
    const user = getSessionUser(request, data);

    if (!user) {
        sendJson(response, 401, { error: "Login required." });
        return null;
    }

    return user;
}

async function handleApi(request, response, url) {
    const data = readData();

    if (request.method === "GET" && url.pathname === "/api/health") {
        sendJson(response, 200, { status: "ok", service: "student-course-registration-api" });
        return true;
    }

    if (request.method === "POST" && url.pathname === "/api/auth/register") {
        const body = await readBody(request);
        const email = String(body.email || "").trim().toLowerCase();

        if (!body.name || !email || !body.password) {
            sendJson(response, 400, { error: "Name, email, and password are required." });
            return true;
        }

        if (data.users.some((user) => user.email.toLowerCase() === email)) {
            sendJson(response, 409, { error: "This email is already registered." });
            return true;
        }

        const user = {
            id: Date.now(),
            name: String(body.name).trim(),
            email,
            password: String(body.password),
            role: "student",
            department: body.department || "General"
        };

        data.users.push(user);
        writeData(data);
        sendJson(response, 201, { user: publicUser(user) });
        return true;
    }

    if (request.method === "POST" && url.pathname === "/api/auth/login") {
        const body = await readBody(request);
        const email = String(body.email || "").trim().toLowerCase();
        const user = data.users.find(
            (entry) => entry.email.toLowerCase() === email && entry.password === body.password
        );

        if (!user) {
            sendJson(response, 401, { error: "Invalid email or password." });
            return true;
        }

        const token = crypto.randomBytes(32).toString("hex");
        sessions.set(token, user.id);
        sendJson(response, 200, { token, user: publicUser(user) });
        return true;
    }

    if (request.method === "GET" && url.pathname === "/api/courses") {
        sendJson(response, 200, { courses: data.courses });
        return true;
    }

    const courseMatch = url.pathname.match(/^\/api\/courses\/([^/]+)\/(enroll|study)$/);

    if (courseMatch && request.method === "POST") {
        const user = requireUser(request, response, data);

        if (!user) {
            return true;
        }

        const courseId = decodeURIComponent(courseMatch[1]);
        const action = courseMatch[2];
        const course = data.courses.find((item) => item.id === courseId);

        if (!course) {
            sendJson(response, 404, { error: "Course not found." });
            return true;
        }

        const userEnrollments = data.enrollments[user.id] || {};

        if (action === "enroll" && userEnrollments[courseId] === undefined) {
            userEnrollments[courseId] = 0;
        }

        if (action === "study" && userEnrollments[courseId] !== undefined) {
            userEnrollments[courseId] = Math.min(100, userEnrollments[courseId] + 10);
        }

        data.enrollments[user.id] = userEnrollments;
        writeData(data);
        sendJson(response, 200, { enrollments: userEnrollments });
        return true;
    }

    if (request.method === "GET" && url.pathname === "/api/me/enrollments") {
        const user = requireUser(request, response, data);

        if (!user) {
            return true;
        }

        sendJson(response, 200, { enrollments: data.enrollments[user.id] || {} });
        return true;
    }

    sendJson(response, 404, { error: "API route not found." });
    return true;
}

function serveStatic(request, response, url) {
    const requestedPath = url.pathname === "/" ? "/index.html" : url.pathname;
    const filePath = path.resolve(ROOT, "." + requestedPath);

    if (!filePath.startsWith(ROOT) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        response.end("Not found");
        return;
    }

    response.writeHead(200, {
        "Content-Type": MIME_TYPES[path.extname(filePath)] || "application/octet-stream"
    });
    fs.createReadStream(filePath).pipe(response);
}

const server = http.createServer(async (request, response) => {
    const url = new URL(request.url, `http://${request.headers.host}`);

    try {
        if (url.pathname.startsWith("/api/")) {
            await handleApi(request, response, url);
            return;
        }

        serveStatic(request, response, url);
    } catch (error) {
        sendJson(response, 500, { error: error.message || "Internal server error." });
    }
});

server.listen(PORT, () => {
    console.log(`Student course app running at http://localhost:${PORT}`);
    console.log(`API health check: http://localhost:${PORT}/api/health`);
});
