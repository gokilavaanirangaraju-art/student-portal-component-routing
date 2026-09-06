# Application Architecture

## Runtime

The application is a vanilla JavaScript frontend served by the Node HTTP server in `server/server.js`. The same server serves static files and exposes JSON API routes, so browser requests stay same-origin.

```text
Browser
  -> Components and router (js/components.js, js/router.js)
  -> Application lifecycle (js/app.js)
  -> Redux-style store (js/state.js)
  -> API client (js/api.js)
  -> Node HTTP API (server/server.js)
  -> JSON persistence (server/data.json)
```

## Frontend Layers

- `js/components.js`: reusable Home, Login, Register, and Dashboard components.
- `js/router.js`: History API navigation and route transitions.
- `js/app.js`: route lifecycle, form binding, profile rendering, and course initialization.
- `js/api.js`: same-origin HTTP client and auth-token storage.
- `js/state.js`: Redux-style state container with reducer, dispatch, subscribe, and local persistence.
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

The demo backend persists users, courses, and enrollments in `server/data.json`. Login sessions are bearer tokens held in server memory and stored by the frontend in local storage. This is suitable for a local demonstration, not production: production deployment should use password hashing, a database, HTTPS, secure cookies or short-lived tokens, validation, and rate limiting.

## Run

```powershell
npm start
```

Then open `http://localhost:5500/index.html` in a browser. Set `PORT` when another process is already using port 5500:

```powershell
$env:PORT=5501; npm start
```
