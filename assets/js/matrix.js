const canvas = document.getElementById('matrix-bg');
const ctx = canvas.getContext('2d');

// Make canvas full screen
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Katakana characters + latin + numbers
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';
const charArray = characters.split('');

const fontSize = 16;
let columns = canvas.width / fontSize;
let drops = [];

function initDrops() {
    columns = canvas.width / fontSize;
    drops = [];
    for (let x = 0; x < columns; x++) {
        drops[x] = Math.random() * canvas.height / fontSize; // random start height
    }
}
initDrops();
window.addEventListener('resize', initDrops);

// Handle reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let frameRate = prefersReducedMotion.matches ? 150 : 50; // Slower if reduced motion

prefersReducedMotion.addEventListener('change', (e) => {
    frameRate = e.matches ? 150 : 50;
});

let lastDrawTime = 0;

function draw(time) {
    requestAnimationFrame(draw);

    if (time - lastDrawTime < frameRate) return;
    lastDrawTime = time;

    // Black background with slight opacity for trail effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0F0'; // Classic Matrix Green
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Reset drop to top randomly
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        
        drops[i]++;
    }
}

requestAnimationFrame(draw);
