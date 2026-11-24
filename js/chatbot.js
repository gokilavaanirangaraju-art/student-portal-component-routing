const CHATBOT_RESPONSES = [
    {
        keywords: ["hello", "hi", "hey"],
        response: "Hello! I’m the Student Portal assistant. You can ask me about courses, enrollment, progress, or account help."
    },
    {
        keywords: ["course", "courses", "enroll", "enrollment"],
        response: "Open the Dashboard and select Enroll on any course under Available Courses. Your enrolled courses will appear under My Courses."
    },
    {
        keywords: ["progress", "study", "completed", "percentage"],
        response: "Your progress is shown in My Courses and Learning Progress. Use the Study button on an enrolled course to add 10%."
    },
    {
        keywords: ["profile", "account", "email", "name"],
        response: "Your name and email are shown on the dashboard profile card. Use the Edit Profile button when profile editing is available."
    },
    {
        keywords: ["login", "log in", "password", "register", "sign up"],
        response: "Use Register to create an account, then Login with your email and password. Use the Logout link when you want to leave the portal."
    },
    {
        keywords: ["help", "support"],
        response: "I can help with course enrollment, learning progress, registration, login, and profiles. What would you like to know?"
    }
];

function getChatbotResponse(message) {
    const normalizedMessage = message.toLowerCase();
    const match = CHATBOT_RESPONSES.find((item) =>
        item.keywords.some((keyword) => normalizedMessage.includes(keyword))
    );

    return match
        ? match.response
        : "I’m not sure about that yet. Try asking about courses, enrollment, progress, login, registration, or your profile.";
}

export function initChatbot() {
    if (document.getElementById("chatbot")) {
        return;
    }

    const chatbot = document.createElement("aside");
    chatbot.id = "chatbot";
    chatbot.className = "chatbot";
    chatbot.setAttribute("aria-label", "Student Portal chatbot");

    chatbot.innerHTML = `
        <button class="chatbot-toggle" id="chatbotToggle" type="button" aria-expanded="false" aria-controls="chatbotPanel" aria-label="Open chatbot">
            <span aria-hidden="true">💬</span>
        </button>
        <section class="chatbot-panel" id="chatbotPanel" aria-label="Chat with Student Portal assistant" hidden>
            <header class="chatbot-header">
                <div>
                    <strong>Student Assistant</strong>
                    <span><i></i> Online</span>
                </div>
                <button class="chatbot-close" id="chatbotClose" type="button" aria-label="Close chatbot">×</button>
            </header>
            <div class="chatbot-messages" id="chatbotMessages" role="log" aria-live="polite" aria-relevant="additions">
                <div class="chatbot-message chatbot-message-bot">
                    Hi! How can I help you today?
                </div>
            </div>
            <div class="chatbot-quick-actions" aria-label="Suggested questions">
                <button type="button" data-message="How do I enroll in a course?">Enroll</button>
                <button type="button" data-message="How do I check my progress?">Progress</button>
                <button type="button" data-message="How do I register?">Register</button>
            </div>
            <form class="chatbot-form" id="chatbotForm">
                <label class="chatbot-visually-hidden" for="chatbotInput">Message</label>
                <input id="chatbotInput" type="text" maxlength="500" placeholder="Ask about the portal..." autocomplete="off" required>
                <button type="submit" aria-label="Send message">➤</button>
            </form>
        </section>
    `;

    document.body.appendChild(chatbot);

    const toggle = chatbot.querySelector("#chatbotToggle");
    const close = chatbot.querySelector("#chatbotClose");
    const panel = chatbot.querySelector("#chatbotPanel");
    const form = chatbot.querySelector("#chatbotForm");
    const input = chatbot.querySelector("#chatbotInput");
    const messages = chatbot.querySelector("#chatbotMessages");

    function setOpen(isOpen) {
        panel.hidden = !isOpen;
        toggle.setAttribute("aria-expanded", String(isOpen));
        toggle.setAttribute("aria-label", isOpen ? "Close chatbot" : "Open chatbot");

        if (isOpen) {
            input.focus();
        }
    }

    function addMessage(text, sender) {
        const message = document.createElement("div");
        message.className = `chatbot-message chatbot-message-${sender}`;
        message.textContent = text;
        messages.appendChild(message);
        messages.scrollTop = messages.scrollHeight;
    }

    function sendMessage(text) {
        const cleanText = text.trim();

        if (!cleanText) {
            return;
        }

        addMessage(cleanText, "user");
        input.value = "";

        window.setTimeout(() => {
            addMessage(getChatbotResponse(cleanText), "bot");
        }, 350);
    }

    toggle.addEventListener("click", () => setOpen(panel.hidden));
    close.addEventListener("click", () => setOpen(false));

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        sendMessage(input.value);
    });

    chatbot.querySelectorAll("[data-message]").forEach((button) => {
        button.addEventListener("click", () => sendMessage(button.dataset.message));
    });
}
