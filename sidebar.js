(function () {
    const mount = document.querySelector("[data-shared-sidebar]");
    const root = (mount && mount.closest(".app, .app-layout")) || document.body;

    if (!mount) return;

    const currentPage = window.location.pathname.split("/").pop().toLowerCase() || "dashboard.html";
    const isProfilePage = currentPage === "profile.html";
    
    const activePage = {
        "": "dashboard",
        "index.html": "dashboard",
        "dashboard.html": "dashboard",
        "plan.html": "plan",
        "excercise.html": "exercise",
        "profile.html": "profile",
        "settings.html": "settings",
        "voice_analysis.html": "dashboard",
        "speech_analys.html": "dashboard",
        "bodylang_analys.html": "dashboard",
        "face_analys.html": "dashboard",
        "content_analys.html": "dashboard"
    }[currentPage] || "dashboard";

    const links = [
        ["dashboard", "dashboard.html", "home", "Home"],
        ["plan", "plan.html", "calendar", "Learning Plan"],
        ["exercise", "excercise.html", "book-open", "Exercises"],
        ["progress", "#", "line-chart", "Progress"],
        ["coaching", "#", "message-circle", "Coaching"],
        ["settings", "settings.html", "settings", "Settings"]
    ];

    const navigation = links.map(([key, href, icon, label]) => `
        <a href="${href}" class="nav-item${key === activePage ? " active" : ""}"${key === activePage ? ' aria-current="page"' : ""} data-label="${label}" title="${label}">
            <i data-lucide="${icon}"></i>
            <span>${label}</span>
        </a>
    `).join("");

    const template = document.createElement("template");
    template.innerHTML = `
        <aside class="sidebar" id="sidebar">
            <div class="sidebar-inner">
                <div>
                    <div class="logo-header">
                        <a href="dashboard.html" class="logo-link" id="sidebarLogoLink" title="Commio - Click to expand sidebar">
                            <div class="brand-logo-frame">
                                <img class="brand-logo" src="logo.png" alt="Commio" width="285" height="65">
                            </div>
                            <div class="brand-logo-collapsed" aria-hidden="true">
                                <div class="logo-mark-icon" title="Expand Sidebar">
                                    <i data-lucide="sparkles"></i>
                                </div>
                            </div>
                        </a>
                        <button class="sidebar-toggle-btn" id="sidebarToggleBtn" type="button" aria-label="Toggle sidebar" title="Collapse sidebar">
                            <i data-lucide="panel-left-close"></i>
                        </button>
                    </div>
                    <nav class="navigation" aria-label="Main navigation">${navigation}</nav>
                </div>
                <div class="profile-area">
                    <div class="profile-actions">
                        <a href="profile.html" class="profile profile-link"${isProfilePage ? ' aria-current="page"' : ""} title="Reem Mousa - Profile">
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
    `;

    const sidebar = template.content.querySelector("#sidebar");
    const toggleBtn = template.content.querySelector("#sidebarToggleBtn");
    const logoLink = template.content.querySelector("#sidebarLogoLink");
    const signOut = template.content.querySelector(".profile-logout");
    const profileName = template.content.querySelector(".profile-name");

    // Also set legacy ID so old page scripts don't throw errors
    toggleBtn.id = "sidebarToggleBtn";
    
    // Load saved profile name if present
    try {
        const savedProfile = JSON.parse(window.sessionStorage.getItem("commioProfile") || "{}");
        if (typeof savedProfile.fullName === "string" && savedProfile.fullName.trim()) {
            profileName.textContent = savedProfile.fullName.trim();
        }
    } catch {
        // keep default
    }

    // Restore saved sidebar collapsed state
    const isCollapsedSaved = localStorage.getItem("commio_sidebar_collapsed") === "true";
    if (isCollapsedSaved && window.innerWidth > 600) {
        root.classList.add("sidebar-collapsed");
        if (document.body !== root) document.body.classList.add("sidebar-collapsed");
    }

    function updateToggleIcon() {
        const collapsed = root.classList.contains("sidebar-collapsed") || document.body.classList.contains("sidebar-collapsed");
        toggleBtn.setAttribute("aria-expanded", String(!collapsed));
        toggleBtn.title = collapsed ? "Expand sidebar" : "Collapse sidebar";
        toggleBtn.innerHTML = collapsed
            ? '<i data-lucide="panel-left-open"></i>'
            : '<i data-lucide="panel-left-close"></i>';
        if (window.lucide) window.lucide.createIcons();
    }

    function toggleSidebarState() {
        const isMobile = window.innerWidth <= 600;
        if (isMobile) {
            const opened = root.classList.toggle("sidebar-open");
            if (document.body !== root) document.body.classList.toggle("sidebar-open");
        } else {
            const collapsed = root.classList.toggle("sidebar-collapsed");
            if (document.body !== root) document.body.classList.toggle("sidebar-collapsed");
            localStorage.setItem("commio_sidebar_collapsed", String(collapsed));
        }
        updateToggleIcon();
    }

    // Expose global function so legacy scripts or inline onclick work seamlessly
    window.toggleSidebar = toggleSidebarState;

    toggleBtn.addEventListener("click", (e) => {
        e.preventDefault();
        toggleSidebarState();
    });

    logoLink.addEventListener("click", (e) => {
        const collapsed = root.classList.contains("sidebar-collapsed") || document.body.classList.contains("sidebar-collapsed");
        if (collapsed) {
            e.preventDefault();
            toggleSidebarState();
        }
    });

    signOut.addEventListener("click", event => {
        event.preventDefault();
        window.sessionStorage.removeItem("commioUser");
        window.sessionStorage.removeItem("commioProfile");
        window.location.href = signOut.href;
    });

    // Handle dummy nav links
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

    updateToggleIcon();
    if (window.lucide) window.lucide.createIcons();
})();