// 1. BLOQUEO DE FUGAS DE MEMORIA EN CONSOLA
console.log = console.info = console.debug = console.warn = console.error = function() {};

// 2. BLOQUEO DE TELEMETRÍA
navigator.sendBeacon = function() { return true; };

// 3. LIMITAR REDIBUJADO DE LA PÁGINA (~30fps)
const originalRequestAnimationFrame = window.requestAnimationFrame;
window.requestAnimationFrame = function(callback) {
    return setTimeout(() => {
        originalRequestAnimationFrame(callback);
    }, 30);
};

// 4. NUEVA OPTIMIZACIÓN: ESTRANGULAMIENTO DEL RATÓN (Mouse Throttling)
// Gemini lee la posición de tu cursor cientos de veces por segundo para
// efectos visuales sutiles. Esto bloquea el 80% de esos cálculos inútiles.
let lastMouseMove = 0;
window.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastMouseMove < 50) { // Solo permite registrar el ratón cada 50ms
        e.stopPropagation();
    } else {
        lastMouseMove = now;
    }
}, { capture: true });

// 5. REPARACIÓN DE IMÁGENES ROTAS (Aplica el CSS del cuadro negro)
function handleBrokenImage(img) {
    if (!img.classList.contains('opt-img-broken')) {
        img.classList.add('opt-img-broken');
        img.removeAttribute('src');
        img.removeAttribute('alt');
    }
}

// Escanea imágenes preexistentes
document.querySelectorAll('img').forEach(img => {
    if (img.complete && img.naturalHeight === 0) {
        handleBrokenImage(img);
    } else {
        img.addEventListener('error', () => handleBrokenImage(img));
    }
});

// Escanea imágenes nuevas que aparezcan mientras usas el chat
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
                if (node.tagName === 'IMG') {
                    node.addEventListener('error', () => handleBrokenImage(node));
                } else if (node.querySelectorAll) {
                    node.querySelectorAll('img').forEach(img => {
                        img.addEventListener('error', () => handleBrokenImage(img));
                    });
                }
            });
        }
    });
});
observer.observe(document.body, { childList: true, subtree: true });
