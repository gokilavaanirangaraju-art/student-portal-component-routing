import { renderRoute } from "./components.js";

export function navigate(url, replace = false) {
    const nextUrl = new URL(url, window.location.href);
    const method = replace ? "replaceState" : "pushState";

    window.history[method]({}, "", `${nextUrl.pathname}${nextUrl.hash}`);
    renderCurrentRoute();
}

export function renderCurrentRoute() {
    const route = renderRoute(window.location.pathname);
    window.dispatchEvent(new CustomEvent("routechange", { detail: route }));

    if (window.location.hash) {
        requestAnimationFrame(() => {
            document.querySelector(window.location.hash)?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    }

    return route;
}

export function startRouter() {
    renderCurrentRoute();

    document.addEventListener("click", function (event) {
        const link = event.target.closest("a[href]");

        if (!link || link.target === "_blank" || event.defaultPrevented) {
            return;
        }

        const url = new URL(link.href, window.location.href);

        if (url.origin !== window.location.origin || !url.pathname.endsWith(".html")) {
            return;
        }

        if (url.pathname.endsWith(".html")) {
            event.preventDefault();
            navigate(`${url.pathname}${url.hash}`);
        }
    });

    window.addEventListener("popstate", renderCurrentRoute);
}
