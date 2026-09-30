(function () {
    const mount = document.querySelector("[data-shared-sidebar]");
    const root = mount && mount.closest(".app, .app-layout");

    if (!mount || !root) return;

    const currentPage = window.location.pathname.split("/").pop().toLowerCase();
    const activePage = {
        "dashboard.html": "dashboard",
        "plan.html": "plan",
        "excercise.html": "exercise"
    }[currentPage];
    const links = [
        ["dashboard", "dashboard.html", "home", "Home"],
        ["plan", "plan.html", "calendar", "Learning Plan"],
        ["exercise", "excercise.html", "book-open", "Exercises"],
        ["progress", "#", "line-chart", "Progress"],
        ["coaching", "#", "message-circle", "Coaching"],
        ["settings", "#", "settings", "Settings"]
    ];
    const navigation = links.map(([key, href, icon, label]) => `
        <a href="${href}" class="nav-item${key === activePage ? " active" : ""}"${key === activePage ? ' aria-current="page"' : ""}>
            <i data-lucide="${icon}"></i>
            <span>${label}</span>
        </a>
    `).join("");

    const template = document.createElement("template");
    template.innerHTML = `
        <aside class="sidebar" id="sidebar">
            <div class="sidebar-inner">
                <div>
                    <div class="logo">
                        <div class="brand-logo-frame">
                            <img class="brand-logo" src="logo.png" alt="Commio" width="285" height="65">
                        </div>
                    </div>
                    <nav class="navigation" aria-label="Main navigation">${navigation}</nav>
                </div>
                <div class="profile-area">
                    <div class="profile">
                        <div class="avatar">RM</div>
                        <div class="profile-info">
                            <span class="profile-name">Reem Mousa</span>
                            <span class="profile-type">Personal</span>
                        </div>
                        <button class="profile-more" type="button" aria-label="More profile options">
                            <i data-lucide="more-horizontal"></i>
                        </button>
                    </div>
                </div>
            </div>
        </aside>
        <button class="sidebar-toggle" id="sidebar-toggle" type="button" aria-label="Hide sidebar" aria-expanded="true" title="Hide sidebar">
            <i data-lucide="panel-left-close"></i>
        </button>
    `;

    const sidebar = template.content.querySelector("#sidebar");
    const toggle = template.content.querySelector("#sidebar-toggle");
    toggle.id = "sidebarToggle";

    if (currentPage === "dashboard.html" || currentPage === "plan.html") {
        toggle.setAttribute("onclick", "toggleSidebar()");
    }

    template.content.querySelector(".navigation").addEventListener("click", event => {
        const link = event.target.closest('a[href="#"]');
        if (!link) return;

        event.preventDefault();
        sidebar.querySelectorAll(".nav-item").forEach(item => {
            item.classList.remove("active");
            item.removeAttribute("aria-current");
        });
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
    });

    mount.replaceWith(template.content);

    if (window.lucide) window.lucide.createIcons();
})();