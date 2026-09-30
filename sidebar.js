(function () {
    const mount = document.querySelector("[data-shared-sidebar]");
    const root = mount && mount.closest(".app, .app-layout");

    if (!mount || !root) return;

    const currentPage = window.location.pathname.split("/").pop().toLowerCase();
    const isProfilePage = currentPage === "profile.html";
    const isSettingsPage = currentPage === "settings.html";
    const activePage = {
        "dashboard.html": "dashboard",
        "plan.html": "plan",
        "excercise.html": "exercise",
        "profile.html": "profile",
        "settings.html": "settings"
    }[currentPage];
    const links = [
        ["dashboard", "dashboard.html", "home", "Home"],
        ["plan", "plan.html", "calendar", "Learning Plan"],
        ["exercise", "excercise.html", "book-open", "Exercises"],
        ["progress", "#", "line-chart", "Progress"],
        ["coaching", "#", "message-circle", "Coaching"],
        ["settings", "settings.html", "settings", "Settings"]
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
                    <div class="profile-actions">
                        <a href="profile.html" class="profile profile-link"${isProfilePage ? ' aria-current="page"' : ""}>
                            <div class="avatar" aria-hidden="true"><i data-lucide="user-round"></i></div>
                            <span class="profile-info">
                                <span class="profile-name">Reem Mousa</span>
                                <span class="profile-type">Personal</span>
                            </span>
                        </a>
                        <a class="profile-logout" href="index.html" aria-label="Sign out" title="Sign out">
                            <i data-lucide="log-out"></i>
                        </a>
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
    const signOut = template.content.querySelector(".profile-logout");
    const profileName = template.content.querySelector(".profile-name");
    toggle.id = "sidebarToggle";

    try {
        const savedProfile = JSON.parse(window.sessionStorage.getItem("commioProfile") || "{}");
        if (typeof savedProfile.fullName === "string" && savedProfile.fullName.trim()) {
            profileName.textContent = savedProfile.fullName.trim();
        }
    } catch {
        // Ignore invalid profile data and keep the default display name.
    }

    signOut.addEventListener("click", event => {
        event.preventDefault();
        window.sessionStorage.removeItem("commioUser");
        window.sessionStorage.removeItem("commioProfile");
        window.location.href = signOut.href;
    });

    if (currentPage === "dashboard.html" || currentPage === "plan.html") {
        toggle.setAttribute("onclick", "toggleSidebar()");
    }

    if (isProfilePage || isSettingsPage) {
        toggle.addEventListener("click", () => {
            const mobile = window.matchMedia("(max-width: 470px)").matches;
            const isOpen = root.classList.toggle(mobile ? "sidebar-open" : "sidebar-collapsed");
            if (mobile) root.classList.remove("sidebar-collapsed");
            else root.classList.remove("sidebar-open");

            const expanded = mobile ? isOpen : !isOpen;
            toggle.setAttribute("aria-expanded", String(expanded));
            toggle.setAttribute("aria-label", expanded ? "Hide sidebar" : "Show sidebar");
            toggle.title = expanded ? "Hide sidebar" : "Show sidebar";
            toggle.innerHTML = expanded
                ? '<i data-lucide="panel-left-close"></i>'
                : '<i data-lucide="panel-left-open"></i>';
            if (window.lucide) window.lucide.createIcons();
        });
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