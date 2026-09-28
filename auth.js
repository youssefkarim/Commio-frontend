/* =========================================================
   COMMIO — AUTH PAGES
   Shared by signin.html and register.html.
   Forms are front-end only: replace simulateRequest() with a
   real call to your backend when it exists.
========================================================= */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const notice = document.getElementById("notice");
const submitBtn = document.getElementById("submitBtn");
const submitText = document.getElementById("submitText");


/* ---------------------------------------------------------
   Helpers
--------------------------------------------------------- */

function showNotice(message) {
    if (!notice) return;
    notice.textContent = message;
    notice.classList.add("show");
}

function hideNotice() {
    if (notice) notice.classList.remove("show");
}

function setInvalid(field, invalid) {
    field.classList.toggle("invalid", invalid);
    const input = field.querySelector("input");
    if (input) input.setAttribute("aria-invalid", String(invalid));
}

function simulateRequest(loadingLabel, doneLabel, message, onDone) {
    const original = submitText.textContent;
    submitBtn.classList.add("loading");
    submitText.textContent = loadingLabel;

    setTimeout(() => {
        // If there's somewhere to go next, keep the loading state while the page changes
        if (onDone) return onDone();

        submitBtn.classList.remove("loading");
        submitText.textContent = doneLabel || original;
        showNotice(message);
    }, 1800);
}


/* ---------------------------------------------------------
   Show / hide password
--------------------------------------------------------- */

document.querySelectorAll("[data-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
        const input = document.getElementById(btn.dataset.toggle);
        const show = input.type === "password";
        input.type = show ? "text" : "password";
        btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
    });
});


/* =========================================================
   SIGN-IN PAGE
========================================================= */

const signinForm = document.getElementById("signinForm");

if (signinForm) {
    const tabs = document.querySelectorAll(".tab");
    const emailLabel = document.getElementById("emailLabel");
    const footText = document.getElementById("footText");
    const footLink = document.getElementById("footLink");
    const emailField = document.getElementById("emailField");
    const pwField = document.getElementById("pwField");
    const email = document.getElementById("email");
    const password = document.getElementById("password");

    const COPY = {
        personal: {
            label: "Authorized Email Address",
            foot: "New to Commio?",
            link: "Create account",
            href: "register.html"
        },
        org: {
            label: "Organization Email Address",
            foot: "Setting up your team?",
            link: "Register organization",
            href: "register.html"
        }
    };

    let activeTab = "personal";

    function selectTab(name) {
        activeTab = name;
        tabs.forEach((tab) => {
            tab.setAttribute("aria-selected", String(tab.dataset.tab === name));
        });

        const c = COPY[name];
        emailLabel.textContent = c.label;
        footText.textContent = c.foot;
        footLink.textContent = c.link;
        footLink.href = c.href;

        setInvalid(emailField, false);
        setInvalid(pwField, false);
        hideNotice();
    }

    tabs.forEach((tab) => tab.addEventListener("click", () => selectTab(tab.dataset.tab)));

    // signin.html#organization opens the Organization Portal tab
    if (location.hash === "#organization") selectTab("org");

    document.getElementById("forgot").addEventListener("click", (e) => {
        e.preventDefault();
        showNotice("Password reset isn't connected yet.");
    });

    signinForm.addEventListener("submit", (e) => {
        e.preventDefault();
        hideNotice();

        const emailBad = !EMAIL_RE.test(email.value.trim());
        const pwBad = password.value.length === 0;

        setInvalid(emailField, emailBad);
        setInvalid(pwField, pwBad);

        if (emailBad) return email.focus();
        if (pwBad) return password.focus();

        // Personal accounts go to the dashboard.
        // NOTE: there's no backend yet, so any valid-looking email + password works.
        if (activeTab === "personal") {
            simulateRequest("Processing Secure Session...", "Sign In", "", () => {
                try {
                    sessionStorage.setItem("commioUser", email.value.trim());
                } catch (err) { /* storage unavailable: ignore */ }

                window.location.href = "dashboard.html";
            });
            return;
        }

        simulateRequest(
            "Processing Secure Session...",
            "Sign In",
            "Organization sign-in isn't connected yet."
        );
    });
}


/* =========================================================
   REGISTER PAGE
========================================================= */

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    const pw = document.getElementById("pw");
    const pw2 = document.getElementById("pw2");
    const consent = document.getElementById("consent");

    function validateField(field) {
        const input = field.querySelector("input");
        const rule = field.dataset.rule;
        let bad = false;

        if (rule === "required") bad = input.value.trim() === "";
        if (rule === "email") bad = !EMAIL_RE.test(input.value.trim());
        if (rule === "password") bad = input.value.length < 8;
        if (rule === "match") bad = input.value === "" || input.value !== pw.value;

        setInvalid(field, bad);
        return !bad;
    }

    const fields = registerForm.querySelectorAll(".field[data-rule]");

    fields.forEach((field) => {
        const input = field.querySelector("input");

        // Validate when leaving a field, then re-check live once it's been flagged
        input.addEventListener("blur", () => {
            if (input.value !== "") validateField(field);
        });

        input.addEventListener("input", () => {
            if (field.classList.contains("invalid")) validateField(field);
            if (input === pw && pw2.value) validateField(pw2.closest(".field"));
        });
    });

    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        hideNotice();

        let firstBad = null;

        fields.forEach((field) => {
            if (!validateField(field) && !firstBad) firstBad = field.querySelector("input");
        });

        if (firstBad) return firstBad.focus();

        if (!consent.checked) {
            showNotice("Please confirm you have administrative rights to continue.");
            return consent.focus();
        }

        simulateRequest(
            "Creating Portal...",
            "Create Organization Portal",
            "Demo only: connect this form to your registration backend."
        );
    });

    document.getElementById("ssoBtn").addEventListener("click", () => {
        showNotice("Google SSO isn't connected yet.");
    });
}