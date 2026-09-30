/* =========================================================
   COMMIO — INTERACTIVE BIRD
========================================================= */

const bird = document.getElementById("birdCharacter");
const heroVisual = document.querySelector(".hero-visual");

const MAX_ROTATION = 13;
const MAX_MOVEMENT = 7;
const HOVER_SCALE = 1.035;
const SPEED = 6; // higher = snappier, lower = floatier

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const current = { x: 0, y: 0, rot: 0, scale: 1 };
const target = { x: 0, y: 0, rot: 0, scale: 1 };

let running = false;
let lastTime = 0;


/* ---------------------------------------------------------
   Pointer tracking
--------------------------------------------------------- */

function onPointerMove(event) {
    if (reduceMotion || window.innerWidth <= 950) return;

    // Use the (untransformed) container's center so the bird's own
    // movement never feeds back into the calculation.
    const rect = heroVisual.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);

    const nx = Math.max(-1, Math.min(1, dx / 450));
    const ny = Math.max(-1, Math.min(1, dy / 450));

    target.rot = nx * MAX_ROTATION;
    target.x = nx * MAX_MOVEMENT;
    target.y = ny * MAX_MOVEMENT;

    start();
}

function resetTarget() {
    target.x = target.y = target.rot = 0;
    start();
}

document.addEventListener("pointermove", onPointerMove);
document.documentElement.addEventListener("pointerleave", resetTarget);
window.addEventListener("blur", resetTarget);

bird.addEventListener("pointerenter", () => {
    target.scale = HOVER_SCALE;
    start();
});

bird.addEventListener("pointerleave", () => {
    target.scale = 1;
    start();
});


/* ---------------------------------------------------------
   Animation loop (runs only while the bird is still moving)
--------------------------------------------------------- */

function start() {
    if (running) return;
    running = true;
    lastTime = performance.now();
    requestAnimationFrame(tick);
}

function tick(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.05); // clamp after tab switches
    lastTime = now;

    // Frame-rate independent exponential smoothing
    const k = 1 - Math.exp(-SPEED * dt);

    current.x += (target.x - current.x) * k;
    current.y += (target.y - current.y) * k;
    current.rot += (target.rot - current.rot) * k;
    current.scale += (target.scale - current.scale) * k;

    bird.style.transform =
        `translate(-50%, -50%) ` +
        `translate3d(${current.x.toFixed(2)}px, ${current.y.toFixed(2)}px, 0) ` +
        `rotate(${current.rot.toFixed(2)}deg) ` +
        `scale(${current.scale.toFixed(4)})`;

    const settled =
        Math.abs(target.x - current.x) < 0.01 &&
        Math.abs(target.y - current.y) < 0.01 &&
        Math.abs(target.rot - current.rot) < 0.01 &&
        Math.abs(target.scale - current.scale) < 0.0005;

    if (settled) {
        running = false;
    } else {
        requestAnimationFrame(tick);
    }
}


/* =========================================================
   BIRD BLINK
========================================================= */

const lid = document.querySelector(".bird-lid");
let blinkTimer = null;

function blink(double = false) {
    if (!lid) return;

    lid.classList.remove("blink");
    void lid.offsetWidth; // forces a reflow so the animation restarts
    lid.classList.add("blink");

    if (double) setTimeout(() => blink(false), 650);
}

function scheduleBlink() {
    clearTimeout(blinkTimer);
    blinkTimer = setTimeout(() => {
        blink(Math.random() < 0.2); // roughly 1 in 5 blinks is a double
        scheduleBlink();
    }, 2500 + Math.random() * 3500); // every 2.5 to 6 seconds
}

if (lid) {
    bird.addEventListener("pointerenter", () => blink());
    bird.addEventListener("click", () => blink(true));
}

if (lid && !reduceMotion) {
    scheduleBlink();

    // stop the timer while the tab is hidden
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) clearTimeout(blinkTimer);
        else scheduleBlink();
    });
}


/* =========================================================
   WATCH BUTTON
========================================================= */

const watchButton = document.getElementById("watchButton");

if (watchButton) {
    watchButton.addEventListener("click", function () {
        alert("The product walkthrough would open here.");
    });
}


/* =========================================================
   MOBILE MENU
========================================================= */

const mobileMenu = document.getElementById("mobileMenu");
const navCenter = document.querySelector(".nav-center");

if (mobileMenu && navCenter) {
    mobileMenu.addEventListener("click", function () {
        navCenter.classList.toggle("mobile-open");
    });
}


/* =========================================================
   NAVBAR SCROLL DIRECTION
========================================================= */

const navbar = document.querySelector(".navbar");

if (navbar) {
    let previousScrollY = window.scrollY;

    window.addEventListener("scroll", () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY <= 0 || currentScrollY < previousScrollY) {
            navbar.classList.remove("navbar-hidden");
        } else if (currentScrollY > previousScrollY) {
            navbar.classList.add("navbar-hidden");
        }

        previousScrollY = currentScrollY;
    }, { passive: true });
}