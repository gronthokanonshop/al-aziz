/* ═══════════════════════════════════════
   আল আজিজ বুকশপ — Firebase Config
═══════════════════════════════════════ */

const firebaseConfig = {
    apiKey: "AIzaSyBM6yhwowHUiroYeQvgq86s1CkWLg5vX3M",
    authDomain: "screenshot-2db71.firebaseapp.com",
    databaseURL: "https://screenshot-2db71-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "screenshot-2db71",
    storageBucket: "screenshot-2db71.firebasestorage.app",
    messagingSenderId: "365113172403",
    appId: "1:365113172403:web:05f9bebd3adf6f341aebc6",
    measurementId: "G-LCDCFSFJV8"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db   = firebase.database();

// Firestore — শুধু book.html এ load হবে
if (typeof firebase.firestore === 'function') {
    window.fsdb = firebase.firestore();
}