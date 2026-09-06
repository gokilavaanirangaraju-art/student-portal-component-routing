const API_BASE = "/api";
const TOKEN_KEY = "student-course-registration-token";

export async function apiRequest(path, options = {}) {
    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };
    const token = localStorage.getItem(TOKEN_KEY);

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers
    });
    const payload = await response.json();

    if (!response.ok) {
        throw new Error(payload.error || "API request failed.");
    }

    return payload;
}

export function saveAuthToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken() {
    localStorage.removeItem(TOKEN_KEY);
}
