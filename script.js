// 1. BLOQUEO DE FUGAS DE MEMORIA Y TELEMETRÍA
console.log = console.info = console.debug = console.warn = console.error = function() {};
navigator.sendBeacon = function() { return true; };

// NUEVO: Bloquear contextos de audio ocultos (Gemini a veces los prepara para el dictado por voz)
window.AudioContext = window.webkitAudioContext = function() { return {} };

// 2. LIMITAR REDIBUJADO DE LA PÁGINA (~30fps)
const originalRequestAnimationFrame = window.requestAnimationFrame;
window.requestAnimationFrame = function(callback) {
    return setTimeout(() => {
        originalRequestAnimationFrame(callback);
    }, 30);
};

// 3. ESTRANGULAMIENTO DEL RATÓN (Ahorro de CPU al mover el cursor)
let lastMouseMove = 0;
window.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastMouseMove < 50) {
        e.stopPropagation();
    } else {
        lastMouseMove = now;
    }
}, { capture: true });

// 4. NUEVA GESTIÓN DE IMÁGENES ROTAS (Sin MutationObserver = Más RAM libre)
function handleBrokenImage(img) {
    if (!img.classList.contains('opt-img-broken')) {
        img.classList.add('opt-img-broken');
        img.removeAttribute('src');
        img.removeAttribute('alt');
    }
}

// Escanea imágenes ya existentes al cargar rápido
document.querySelectorAll('img').forEach(img => {
    if (img.complete && img.naturalHeight === 0) handleBrokenImage(img);
});

// NUEVO: En lugar de vigilar cada cambio en el código (costoso),
// interceptamos pasivamente el error exacto cuando una imagen falla (ultra ligero).
document.addEventListener('error', function(event) {
    if (event.target && event.target.tagName === 'IMG') {
        handleBrokenImage(event.target);
    }
}, true); // El 'true' activa la fase de captura directa
