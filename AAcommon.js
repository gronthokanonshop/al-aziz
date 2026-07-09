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
/* Homepage filename */
const HOME_URL = 'index.html';
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

/* ═══ হাদিয়া অফারের টার্গেট (৳) — এখানে বদলালেই সব জায়গায় বদলাবে ═══ */
window.AA_GIFT_THRESHOLD = 1000;

/* কার্ট সাবটোটাল থেকে গিফট-প্রগ্রেস বারের HTML বানায় (index + shared drawer দুটোই ব্যবহার করে) */
window.aaGiftBarHTML = function (subtotal) {
    const TH = window.AA_GIFT_THRESHOLD || 1000;
    if (subtotal <= 0) return '';
    const remain = TH - subtotal;
    if (remain > 0) {
        const pct = Math.min(100, Math.round(subtotal / TH * 100));
        return `<div class="aa-gift">
            <div class="aa-gift-txt">🎁 আর মাত্র <b>৳${remain}</b>-এর বই কিনলেই <b>ফ্রি হাদিয়া সামগ্রী!</b></div>
            <div class="aa-gift-track"><div class="aa-gift-fill" style="width:${pct}%"></div></div>
        </div>`;
    }
    return `<div class="aa-gift done">
        <div class="aa-gift-txt">🎉 অভিনন্দন! আপনার অর্ডারে <b>ফ্রি হাদিয়া সামগ্রী</b> যুক্ত হবে ইন শা আল্লাহ</div>
    </div>`;
};

/* গিফট-বারের CSS — সব পেজে দরকার (index/AAbook এর নিজস্ব ড্রয়ারেও) */
(function () {
    const css = document.createElement('style');
    css.textContent = `
    .aa-gift{background:linear-gradient(135deg,rgba(207,111,51,0.08),rgba(47,117,49,0.06));border:1.5px dashed rgba(207,111,51,0.45);border-radius:10px;padding:10px 12px;margin-bottom:10px;}
    .aa-gift.done{background:linear-gradient(135deg,rgba(47,117,49,0.10),rgba(121,176,123,0.08));border-color:rgba(47,117,49,0.45);}
    .aa-gift-txt{font-size:12px;font-weight:600;color:var(--text,#233023);line-height:1.6;}
    .aa-gift-txt b{color:#a85320;}
    .aa-gift.done .aa-gift-txt b{color:#2f7531;}
    .aa-gift-track{height:7px;background:rgba(0,0,0,0.08);border-radius:20px;margin-top:7px;overflow:hidden;}
    [data-theme="dark"] .aa-gift-track{background:rgba(255,255,255,0.12);}
    .aa-gift-fill{height:100%;background:linear-gradient(90deg,#cf6f33,#2f7531);border-radius:20px;transition:width .4s ease;}`;
    document.head.appendChild(css);
})();

/* ═══════════════════════════════════════
   GLOBAL CART DRAWER
   index.html ও AAbook.html-এর নিজস্ব ড্রয়ার আছে —
   বাকি সব পেজে (filter, track, about ইত্যাদি) এই শেয়ার্ড ড্রয়ারটি বসে।
═══════════════════════════════════════ */
(function () {
    if (document.getElementById('cartBox')) return; // পেজের নিজস্ব ড্রয়ার থাকলে স্কিপ

    const esc = s => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    const readCart = () => { try { return JSON.parse(localStorage.getItem('alaziz_cart')) || []; } catch (e) { return []; } };
    const saveCart = c => localStorage.setItem('alaziz_cart', JSON.stringify(c));

    /* ── CSS ── */
    const css = document.createElement('style');
    css.textContent = `
    #aaCartOverlay{position:fixed;inset:0;background:rgba(0,0,0,.48);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);z-index:99998;opacity:0;pointer-events:none;transition:opacity .3s;}
    #aaCartOverlay.open{opacity:1;pointer-events:auto;}
    #aaCartDrawer{position:fixed;top:0;right:0;height:100%;width:340px;max-width:92vw;background:var(--card-solid,#fff);color:var(--text,#233023);z-index:99999;transform:translateX(105%);transition:transform .35s cubic-bezier(.2,.8,.2,1);display:flex;flex-direction:column;box-shadow:-8px 0 40px rgba(0,0,0,.18);border-radius:20px 0 0 20px;overflow:hidden;font-family:'Hind Siliguri',Arial,sans-serif;}
    #aaCartDrawer.open{transform:translateX(0);}
    .aa-cd-head{padding:15px 18px;background:linear-gradient(135deg,#224f23,#2f7531);color:#fff;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;border-bottom:2px solid #79b07b;}
    .aa-cd-head h3{margin:0;font-size:17px;font-weight:800;display:flex;align-items:center;gap:8px;}
    .aa-cd-count{background:rgba(255,255,255,.22);font-size:11px;font-weight:700;padding:2px 9px;border-radius:20px;}
    .aa-cd-close{cursor:pointer;font-size:24px;line-height:1;opacity:.9;background:none;border:none;color:#fff;padding:0 2px;}
    .aa-cd-items{flex:1;overflow-y:auto;padding:14px 16px;}
    .aa-cd-item{display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--border,#e5e7eb);}
    .aa-cd-item img{width:44px;height:58px;object-fit:cover;border-radius:8px;border:1px solid var(--border,#e5e7eb);flex-shrink:0;background:var(--bg2,#f1ede4);}
    .aa-cd-name{font-size:12.5px;font-weight:700;color:var(--text,#233023);line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
    .aa-cd-price{font-size:12.5px;font-weight:800;color:#dc2626;margin-top:2px;}
    .aa-qty{display:flex;align-items:center;gap:7px;flex-shrink:0;}
    .aa-qty button{width:24px;height:24px;border-radius:7px;border:1.5px solid var(--border2,#d1d5db);background:var(--bg,#f9fafb);color:var(--text,#233023);font-size:14px;font-weight:800;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1;transition:.15s;}
    .aa-qty button:hover{border-color:#2f7531;color:#2f7531;}
    .aa-qty span{font-size:13px;font-weight:800;min-width:14px;text-align:center;color:var(--text,#233023);}
    .aa-cd-empty{text-align:center;padding:60px 20px;color:var(--text2,#6b7280);}
    .aa-cd-empty svg{opacity:.4;margin-bottom:10px;}
    .aa-cd-empty p{font-size:14px;font-weight:600;margin:0 0 16px;}
    .aa-cd-empty button{padding:9px 22px;background:linear-gradient(135deg,#cf6f33,#a85320);color:#fff;border:none;border-radius:10px;font-family:'Hind Siliguri',Arial,sans-serif;font-size:13px;font-weight:700;cursor:pointer;}
    .aa-cd-foot{padding:14px 16px 16px;border-top:1px solid var(--border,#e5e7eb);background:var(--bg,#f9fafb);flex-shrink:0;}
    .aa-cd-row{display:flex;justify-content:space-between;font-size:13px;color:var(--text2,#6b7280);padding:2.5px 0;}
    .aa-cd-row.total{font-size:15.5px;font-weight:800;color:var(--text,#233023);padding-top:6px;}
    .aa-cd-row.total span:last-child{color:#2f7531;}
    [data-theme="dark"] .aa-cd-row.total span:last-child{color:#79b07b;}
    .aa-cd-row.disc span:last-child{color:#dc2626;font-weight:700;}
    .aa-coupon{display:flex;gap:6px;margin-bottom:10px;}
    .aa-coupon input{flex:1;padding:8px 10px;border:1.5px solid var(--border2,#d1d5db);border-radius:9px;background:var(--card-solid,#fff);color:var(--text,#233023);font-family:'Hind Siliguri',Arial,sans-serif;font-size:12.5px;outline:none;min-width:0;}
    .aa-coupon input:focus{border-color:#2f7531;}
    .aa-coupon button{background:linear-gradient(135deg,#cf6f33,#a85320);color:#fff;border:none;padding:0 14px;border-radius:9px;cursor:pointer;font-weight:700;font-size:12.5px;font-family:'Hind Siliguri',Arial,sans-serif;}
    .aa-coupon-on{display:flex;align-items:center;gap:8px;padding:7px 11px;background:rgba(47,117,49,.08);border:1.5px dashed #2f7531;border-radius:9px;margin-bottom:10px;}
    .aa-coupon-on span{flex:1;font-size:12px;font-weight:700;color:#2f7531;}
    [data-theme="dark"] .aa-coupon-on span{color:#79b07b;}
    .aa-coupon-on button{background:#fee2e2;color:#dc2626;border:none;border-radius:7px;padding:4px 9px;font-size:11px;font-weight:700;cursor:pointer;font-family:'Hind Siliguri',Arial,sans-serif;}
    .aa-checkout-btn{width:100%;margin-top:10px;padding:13px;background:linear-gradient(135deg,#224f23,#2f7531);color:#fff;border:none;border-radius:11px;font-family:'Hind Siliguri',Arial,sans-serif;font-size:14.5px;font-weight:800;cursor:pointer;box-shadow:0 3px 12px rgba(47,117,49,.3);transition:.2s;letter-spacing:.3px;}
    .aa-checkout-btn:hover{box-shadow:0 5px 16px rgba(47,117,49,.4);}
    .aa-checkout-btn:active{transform:scale(.98);}
    .aa-cd-note{text-align:center;font-size:10.5px;color:var(--text3,#9ca3af);margin-top:8px;}`;
    document.head.appendChild(css);

    /* ── HTML ── */
    function buildDrawer() {
        const wrap = document.createElement('div');
        wrap.innerHTML = `
        <div id="aaCartOverlay" onclick="closeCart()"></div>
        <div id="aaCartDrawer">
            <div class="aa-cd-head">
                <h3><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg> আপনার ব্যাগ <span class="aa-cd-count" id="aaCdCount">0</span></h3>
                <button class="aa-cd-close" onclick="closeCart()">&times;</button>
            </div>
            <div class="aa-cd-items" id="aaCdItems"></div>
            <div class="aa-cd-foot">
                <div id="aaGiftBarDrawer"></div>
                <div id="aaCouponBox"></div>
                <div class="aa-cd-row"><span>সাবটোটাল</span><span>৳<span id="aaCdSub">0</span></span></div>
                <div class="aa-cd-row disc" id="aaCdDiscRow" style="display:none;"><span>ডিসকাউন্ট (<span id="aaCdCoupon"></span>)</span><span>-৳<span id="aaCdDisc">0</span></span></div>
                <div class="aa-cd-row total"><span>মোট</span><span>৳<span id="aaCdTotal">0</span></span></div>
                <button class="aa-checkout-btn" onclick="aaGoCheckout()">✅ অর্ডার করুন</button>
                <div class="aa-cd-note">🚚 ঢাকায় ডেলিভারি ৳৬০ — ঢাকার বাইরে ৳৯০ (চেকআউটে যোগ হবে)</div>
            </div>
        </div>`;
        document.body.appendChild(wrap);
    }
    if (document.body) buildDrawer();
    else document.addEventListener('DOMContentLoaded', buildDrawer);

    /* ── ব্যাজ আপডেট (পেজভেদে ভিন্ন id) ── */
    function aaBadges(n) {
        ['cartCount', 'floatCount', 'bnavBadge'].forEach(id => {
            const el = document.getElementById(id);
            if (el) { el.innerText = n; el.classList.toggle('show', n > 0); }
        });
    }

    /* ── রেন্ডার ── */
    window.aaRenderCart = function () {
        const cart = readCart();
        const box = document.getElementById('aaCdItems');
        if (!box) return;
        document.getElementById('aaCdCount').innerText = cart.length;
        aaBadges(cart.length);

        if (!cart.length) {
            box.innerHTML = `<div class="aa-cd-empty">
                <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                <p>ব্যাগ এখনও খালি</p>
                <button onclick="closeCart()">📚 বই দেখুন</button>
            </div>`;
        } else {
            const g = {};
            cart.forEach(i => { if (g[i.name]) g[i.name].qty++; else g[i.name] = { price: Number(i.price) || 0, qty: 1, img: i.img || '' }; });
            box.innerHTML = Object.entries(g).map(([name, it]) => `
                <div class="aa-cd-item">
                    <img src="${esc(it.img) || 'book-placeholder.svg'}" alt="" onerror="this.onerror=null;this.src='book-placeholder.svg'">
                    <div style="flex:1;min-width:0;">
                        <div class="aa-cd-name">${esc(name)}</div>
                        <div class="aa-cd-price">৳${it.price}</div>
                    </div>
                    <div class="aa-qty">
                        <button data-name="${esc(name)}" onclick="aaQty(this.dataset.name,-1)">−</button>
                        <span>${it.qty}</span>
                        <button data-name="${esc(name)}" onclick="aaQty(this.dataset.name,1)">+</button>
                    </div>
                </div>`).join('');
        }

        /* কুপন UI */
        const applied = localStorage.getItem('alaziz_coupon');
        const discPct = applied === 'FIRSTORDER' ? 5 : 0;
        const cb = document.getElementById('aaCouponBox');
        if (applied) {
            cb.innerHTML = `<div class="aa-coupon-on"><span>🎉 ${esc(applied)} — ${discPct}% ডিসকাউন্ট</span><button onclick="aaRemoveCoupon()">✕ বাতিল</button></div>`;
        } else {
            cb.innerHTML = `<div class="aa-coupon"><input id="aaCouponInput" placeholder="কুপন কোড লিখুন" onkeydown="if(event.key==='Enter')aaApplyCoupon()"><button onclick="aaApplyCoupon()">Apply</button></div>`;
        }

        /* টোটাল */
        const grouped = {};
        cart.forEach(i => { grouped[i.name] = grouped[i.name] || { p: Number(i.price) || 0, q: 0 }; grouped[i.name].q++; });
        const sub = Object.values(grouped).reduce((s, x) => s + x.p * x.q, 0);
        const disc = applied ? Math.round(sub * discPct / 100) : 0;
        document.getElementById('aaGiftBarDrawer').innerHTML = aaGiftBarHTML(sub);
        document.getElementById('aaCdSub').innerText = sub;
        document.getElementById('aaCdDisc').innerText = disc;
        document.getElementById('aaCdCoupon').innerText = applied || '';
        document.getElementById('aaCdDiscRow').style.display = disc > 0 ? 'flex' : 'none';
        document.getElementById('aaCdTotal').innerText = sub - disc;
    };

    /* ── qty বদলানো ── */
    window.aaQty = function (name, delta) {
        let cart = readCart();
        if (delta === 1) {
            const item = cart.find(i => i.name === name);
            if (item) cart.push({ ...item });
        } else {
            for (let j = cart.length - 1; j >= 0; j--) {
                if (cart[j].name === name) { cart.splice(j, 1); break; }
            }
        }
        saveCart(cart);
        aaRenderCart();
    };

    /* ── কুপন ── */
    window.aaApplyCoupon = function () {
        const code = (document.getElementById('aaCouponInput')?.value || '').trim().toUpperCase();
        if (code === 'FIRSTORDER') {
            localStorage.setItem('alaziz_coupon', code);
            localStorage.setItem('alaziz_discount', '5');
            showToast('🎉 ৫% ডিসকাউন্ট যুক্ত হয়েছে!', '#2f7531');
        } else {
            showToast('❌ ভুল কুপন কোড!', '#dc2626');
        }
        aaRenderCart();
    };
    window.aaRemoveCoupon = function () {
        localStorage.removeItem('alaziz_coupon');
        localStorage.removeItem('alaziz_discount');
        showToast('🗑️ কুপন বাতিল হয়েছে', '#6b7280');
        aaRenderCart();
    };

    /* ── চেকআউট ── */
    window.aaGoCheckout = function () {
        if (!readCart().length) { showToast('⚠️ ব্যাগ খালি!', '#dc2626'); return; }
        window.location.href = 'AAcheckout.html';
    };

    /* ── খোলা/বন্ধ ── */
    window.showCart = function () {
        aaRenderCart();
        document.getElementById('aaCartOverlay').classList.add('open');
        document.getElementById('aaCartDrawer').classList.add('open');
        document.body.style.overflow = 'hidden';
    };
    window.closeCart = function () {
        document.getElementById('aaCartOverlay').classList.remove('open');
        document.getElementById('aaCartDrawer').classList.remove('open');
        document.body.style.overflow = '';
    };
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeCart();
    });

    /* ড্রয়ার বসার পর ব্যাজ ঠিক করা */
    document.addEventListener('DOMContentLoaded', () => aaBadges(readCart().length));
})();

/* Auto-run on load */
document.addEventListener('DOMContentLoaded', updateCartCount);

/* ═══ PWA — service worker রেজিস্টার (ফোনে অ্যাপের মতো ইনস্টল) ═══ */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('sw.js').catch(function () {});
    });
}