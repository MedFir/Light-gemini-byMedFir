// 1. Evitar fugas de memoria en la consola
// Las páginas modernas guardan un historial masivo de logs que consume RAM.
// Esto vacía las funciones de registro de Gemini.
console.log = console.info = console.debug = console.warn = function() {};

// 2. Bloquear balizas de telemetría en segundo plano
// Evita que Gemini envíe pequeños paquetes de datos a Google Analytics
// mientras escribes o mueves el ratón, ahorrando picos de CPU.
navigator.sendBeacon = function() { return true; };

// 3. Interceptar y reducir peticiones de dibujo inútiles
// Limita la frecuencia con la que la página pide a la pantalla que se actualice
// para animaciones menores que no pudimos atrapar con CSS.
const originalRequestAnimationFrame = window.requestAnimationFrame;
window.requestAnimationFrame = function(callback) {
    return setTimeout(() => {
        originalRequestAnimationFrame(callback);
    }, 30); // Limita artificialmente los frames internos a ~30fps
};
