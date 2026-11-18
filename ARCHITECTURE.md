# Application Architecture

## Runtime

The application is a vanilla JavaScript frontend served by the Node HTTP server in `server.js`. The same server serves static files and exposes JSON API routes, so browser requests stay same-origin.

```text
Browser
  -> Components and router (js/components.js, js/router.js)
  -> Application lifecycle (app.js)
  -> State store (state.js)
  -> API client (api.js)
  -> Node HTTP API (server.js)
  -> MongoDB
```

## Frontend Layers

- `components.js`: reusable Home, Login, Register, and Dashboard components.
- `router.js`: History API navigation and route transitions.
- `app.js`: application entry point and route initialization.
- `api.js`: same-origin HTTP client and auth-token storage.
- `state.js`: state container, local UI cache, and MongoDB API client.
- `course.js`: course catalog, enrollment, and progress UI behavior.
- `js/auth.js`: authentication actions and navigation after auth events.

## Backend Routes

- `GET /api/health`: service health check.
- `POST /api/auth/register`: create a student account.
- `POST /api/auth/login`: authenticate and return a bearer token.
- `GET /api/courses`: return the course catalog.
- `POST /api/courses/:courseId/enroll`: enroll the authenticated user.
- `POST /api/courses/:courseId/study`: advance authenticated user progress by 10 percent.
- `GET /api/me/enrollments`: return the authenticated user's enrollment state.

## Data and Authentication

The backend persists users, courses, and enrollments in MongoDB. On first startup, users and courses are seeded from `data.json`. Login sessions are bearer tokens held in server memory and stored by the frontend in local storage. Passwords are currently stored in plain text; add password hashing and other production protections before deployment.

## Run

```powershell
$env:MONGODB_URI="mongodb://127.0.0.1:27017"
$env:MONGODB_DB="student_course_registration"
npm start
```

Set `MONGODB_URI` to your MongoDB Atlas connection string to use Atlas. Then open `http://localhost:5500/index.html` in a browser. Set `PORT` when another process is already using port 5500:

```powershell
$env:PORT=5501; npm start
```
