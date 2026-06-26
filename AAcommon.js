/* ═══════════════════════════════════════
   আল আজিজ বুকশপ — Common JavaScript
   সব page এ shared হয় এই JS
═══════════════════════════════════════ */

/* ═══ DARK MODE ═══ */
function toggleDark() {
    const h = document.documentElement;
    const isDark = h.getAttribute('data-theme') === 'dark';
    h.setAttribute('data-theme', isDark ? 'light' : 'dark');
    const btn = document.getElementById('darkBtn');
    if (btn) btn.innerText = isDark ? '🌙' : '☀️';
    localStorage.setItem('alaziz_theme', isDark ? 'light' : 'dark');
}

/* Dark theme auto-apply on page load */
(function () {
    const saved = localStorage.getItem('alaziz_theme');
    if (saved) document.documentElement.setAttribute('data-theme', saved);
    const btn = document.getElementById('darkBtn');
    if (btn && saved === 'dark') btn.innerText = '☀️';
})();

/* ═══ TOAST NOTIFICATION ═══ */
function showToast(msg, color) {
    const t = document.createElement('div');
    t.style.cssText = `position:fixed;bottom:82px;left:50%;transform:translateX(-50%);background:${color||'#1a2e1b'};color:#fff;padding:10px 22px;border-radius:4px;font-size:13px;font-weight:600;z-index:9999;box-shadow:0 4px 14px rgba(0,0,0,0.25);font-family:'Hind Siliguri',Arial,sans-serif;border:1px solid rgba(255,255,255,0.15);`;
    t.innerText = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2200);
}

/* ═══ PAGE NAVIGATION (smooth fade) ═══ */
function navigateTo(url) {
    document.body.style.animation = 'pageOut 0.25s ease forwards';
    setTimeout(() => window.location.href = url, 240);
}

/* ═══ FIX: browser Back করলে যেন blank/সাদা না থাকে ═══ */
/* fade-out এর পর page cache থেকে ফিরলে opacity 0 আটকে থাকত — এখানে reset করা হলো */
window.addEventListener('pageshow', function () {
    document.body.style.animation = 'none';
    document.body.style.opacity = '1';
});

/* ═══ SCROLL TO TOP ═══ */
window.addEventListener('scroll', () => {
    const btn = document.getElementById('scrollTopBtn');
    if (btn) btn.classList.toggle('show', window.scrollY > 300);
});

/* ═══ CART COUNT (shared across pages) ═══ */
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('alaziz_cart') || '[]');
    const el = document.getElementById('cartCount');
    if (el) el.innerText = cart.length;
}

/* ═══ BACK NAVIGATION ═══ */
/* Homepage filename — change to 'al_azliz_index.html' if you keep that name */
const HOME_URL = 'al_azliz_index.html';
function goBack() {
    // In-site history thakle normal back
    if (window.history.length > 1 &&
        document.referrer && document.referrer.includes(location.hostname)) {
        window.history.back();
    } else {
        // Direct visit / no history → homepage e fallback
        window.location.href = HOME_URL;
    }
}

/* ═══ SIDEBAR TOGGLE ═══ */
function toggleSidebar() {
    document.getElementById('sidebar')?.classList.toggle('active');
    document.getElementById('overlay')?.classList.toggle('active');
}
function closeSidebars() {
    document.getElementById('sidebar')?.classList.remove('active');
    document.getElementById('overlay')?.classList.remove('active');
}

/* ═══ READING PROGRESS BAR ═══ */
(function () {
    const bar = document.getElementById('readProg');
    if (!bar) return;
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        bar.style.width = scrollHeight > 0 ? (scrollTop / scrollHeight * 100) + '%' : '0%';
    }, { passive: true });
})();

/* Auto-run on load */
document.addEventListener('DOMContentLoaded', updateCartCount);
