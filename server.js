const http = require("node:http");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { MongoClient } = require("mongodb");

const PORT = Number(process.env.PORT) || 5500;
const ROOT = __dirname;
const DATA_FILE = path.join(__dirname, "data.json");
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://gokilavaanirangaraju_db_user:Gokila002@cluster0.svzxqtj.mongodb.net/";
const MONGODB_DB = process.env.MONGODB_DB || "student_course_registration";
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

function readSeedData() {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

async function connectDatabase() {
    const client = new MongoClient(MONGODB_URI);

    await client.connect();
    const db = client.db(MONGODB_DB);
    const users = db.collection("users");
    const courses = db.collection("courses");
    const enrollments = db.collection("enrollments");
    const seedData = readSeedData();

    await users.createIndex({ email: 1 }, { unique: true });
    await courses.createIndex({ id: 1 }, { unique: true });

    if (await users.countDocuments() === 0 && seedData.users.length > 0) {
        await users.insertMany(seedData.users.map((user) => ({
            ...user,
            email: user.email.toLowerCase()
        })));
    }

    if (await courses.countDocuments() === 0 && seedData.courses.length > 0) {
        await courses.insertMany(seedData.courses.map((course, index) => ({
            ...course,
            _order: index
        })));
    }

    console.log(`Connected to MongoDB database "${MONGODB_DB}".`);
    return { client, users, courses, enrollments };
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

async function requireUser(request, response, users) {
    const header = request.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";
    const userId = sessions.get(token);
    const user = userId ? await users.findOne({ id: userId }) : null;

    if (!user) {
        sendJson(response, 401, { error: "Login required." });
        return null;
    }

    return user;
}

async function handleApi(request, response, url, database) {
    const { users, courses, enrollments } = database;

    if (request.method === "GET" && url.pathname === "/api/health") {
        sendJson(response, 200, {
            status: "ok",
            service: "student-course-registration-api",
            database: "connected"
        });
        return;
    }

    if (request.method === "POST" && url.pathname === "/api/auth/register") {
        const body = await readBody(request);
        const name = String(body.name || "").trim();
        const email = String(body.email || "").trim().toLowerCase();
        const password = String(body.password || "");

        if (!name || !email || !password) {
            sendJson(response, 400, { error: "Name, email, and password are required." });
            return;
        }

        const user = {
            id: crypto.randomBytes(16).toString("hex"),
            name,
            email,
            password,
            role: "student",
            department: body.department || "General"
        };

        try {
            await users.insertOne(user);
        } catch (error) {
            if (error.code === 11000) {
                sendJson(response, 409, { error: "This email is already registered." });
                return;
            }

            throw error;
        }

        sendJson(response, 201, { user: publicUser(user) });
        return;
    }

    if (request.method === "POST" && url.pathname === "/api/auth/login") {
        const body = await readBody(request);
        const email = String(body.email || "").trim().toLowerCase();
        const user = await users.findOne({
            email,
            password: String(body.password || "")
        });

        if (!user) {
            sendJson(response, 401, { error: "Invalid email or password." });
            return;
        }

        const token = crypto.randomBytes(32).toString("hex");
        sessions.set(token, user.id);
        sendJson(response, 200, { token, user: publicUser(user) });
        return;
    }

    if (request.method === "GET" && url.pathname === "/api/courses") {
        const courseList = await courses.find(
            {},
            { projection: { _id: 0, _order: 0 } }
        ).sort({ _order: 1 }).toArray();
        sendJson(response, 200, { courses: courseList });
        return;
    }

    const courseMatch = url.pathname.match(/^\/api\/courses\/([^/]+)\/(enroll|study)$/);

    if (courseMatch && request.method === "POST") {
        const user = await requireUser(request, response, users);

        if (!user) {
            return;
        }

        const courseId = decodeURIComponent(courseMatch[1]);
        const action = courseMatch[2];
        const course = await courses.findOne({ id: courseId });

        if (!course) {
            sendJson(response, 404, { error: "Course not found." });
            return;
        }

        const enrollment = await enrollments.findOne({ _id: user.id });
        const userEnrollments = { ...(enrollment?.courses || {}) };

        if (action === "enroll" && userEnrollments[courseId] === undefined) {
            userEnrollments[courseId] = 0;
        }

        if (action === "study" && userEnrollments[courseId] !== undefined) {
            userEnrollments[courseId] = Math.min(100, userEnrollments[courseId] + 10);
        }

        await enrollments.updateOne(
            { _id: user.id },
            { $set: { courses: userEnrollments } },
            { upsert: true }
        );
        sendJson(response, 200, { enrollments: userEnrollments });
        return;
    }

    if (request.method === "GET" && url.pathname === "/api/me/enrollments") {
        const user = await requireUser(request, response, users);

        if (!user) {
            return;
        }

        const enrollment = await enrollments.findOne({ _id: user.id });
        sendJson(response, 200, { enrollments: enrollment?.courses || {} });
        return;
    }

    sendJson(response, 404, { error: "API route not found." });
}

function serveStatic(response, url) {
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

async function startServer() {
    const database = await connectDatabase();
    const server = http.createServer(async (request, response) => {
        const url = new URL(request.url, `http://${request.headers.host}`);

        try {
            if (url.pathname.startsWith("/api/")) {
                await handleApi(request, response, url, database);
                return;
            }

            serveStatic(response, url);
        } catch (error) {
            sendJson(response, 500, { error: error.message || "Internal server error." });
        }
    });

    server.listen(PORT, () => {
        console.log(`Student course app running at http://localhost:${PORT}`);
        console.log(`API health check: http://localhost:${PORT}/api/health`);
    });
}

startServer().catch((error) => {
    console.error("Could not start the app. Check MongoDB is running and MONGODB_URI is correct.");
    console.error(error);
    process.exitCode = 1;
});
