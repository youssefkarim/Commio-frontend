/* =========================================================
   COMMIO GLOBAL THEME — Apply dark-mode from localStorage
   Include this script in <head> of every page (before render)
   to prevent flash of light theme.
========================================================= */
(function () {
    var theme = localStorage.getItem('commio_theme');
    if (theme === 'Dark') {
        document.documentElement.classList.add('dark-mode');
        document.body && document.body.classList.add('dark-mode');
    }

    // Re-apply once body is available (covers the <head> include case)
    document.addEventListener('DOMContentLoaded', function () {
        var t = localStorage.getItem('commio_theme');
        if (t === 'Dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    });
})();
