let isDragging = false;
let currentCategory = null;
let highestZ = 9000;

// --- PERSONALIZAR ELEMENTOS DE LAS CARPETAS ---
// Solo cambiá las URLs por tus fotos o GIFs
const content = {
    tipo: [
        {img: 'https://picsum.photos/600/800?random=10'}, 
        {img: 'tufoto.gif'} 
    ],
    branding: [
        {img: 'proyecto1.jpg'}, 
        {img: 'logo.png'}
    ],
    editorial: [{img: 'https://picsum.photos/600/800?random=30'}],
    packaging: [{img: 'https://picsum.photos/600/800?random=40'}]
};

window.onload = () => {
    const items = document.querySelectorAll('.folder, .app-icon');
    const positions = [];
    const margin = 0.10; // 10% de margen de pantalla
    const minDistance = 150; // Distancia mínima entre carpetas

    items.forEach(item => {
        let x, y, collision;
        let attempts = 0;

        do {
            collision = false;
            x = (window.innerWidth * margin) + Math.random() * (window.innerWidth * (1 - margin * 2) - 100);
            y = (window.innerHeight * margin) + Math.random() * (window.innerHeight * (1 - margin * 2) - 120);

            // Verificar si choca con una posición anterior
            for (let pos of positions) {
                const dist = Math.hypot(x - pos.x, y - pos.y);
                if (dist < minDistance) {
                    collision = true;
                    break;
                }
            }
            attempts++;
        } while (collision && attempts < 100);

        positions.push({ x, y });
        item.style.left = x + 'px';
        item.style.top = y + 'px';
        item.setAttribute('data-x', 0);
        item.setAttribute('data-y', 0);
    });
};

function toggleProject(category, element) {
    if (isDragging) return;
    const gallery = document.getElementById('floating-gallery');
    if (currentCategory === category) { gallery.innerHTML = ''; currentCategory = null; return; }
    gallery.innerHTML = ''; currentCategory = category;
    
    content[category].forEach((proj) => {
        const card = document.createElement('div');
        card.className = 'project-card draggable';
        const margin = 0.1;
        const x = (window.innerWidth * margin) + (Math.random() * (window.innerWidth * 0.5));
        const y = (window.innerHeight * margin) + (Math.random() * (window.innerHeight * 0.4));
        highestZ++;
        card.style.left = x + 'px'; card.style.top = y + 'px'; card.style.zIndex = highestZ;
        card.innerHTML = `<img src="${proj.img}">`;
        card.onclick = (e) => { e.stopPropagation(); if (!isDragging) openFullscreen(proj); };
        gallery.appendChild(card);
    });
}

function openAbout(event) {
    if (event) event.stopPropagation();
    if (isDragging) return;
    const win = document.getElementById('about-window');
    win.style.display = 'flex';
    
    // Resetear posición de arrastre para que interact.js no se confunda
    win.setAttribute('data-x', 0);
    win.setAttribute('data-y', 0);
    win.style.transform = 'translate(0px, 0px)';
    
    highestZ++;
    win.style.zIndex = highestZ + 9000;
}

function closeAbout() { document.getElementById('about-window').style.display = 'none'; }

function closeFromOutside(event) {
    if (event.target.id === 'desktop') {
        closeAbout();
        document.getElementById('floating-gallery').innerHTML = '';
        currentCategory = null;
    }
}

function openFullscreen(proj) {
    const fs = document.getElementById('project-fullscreen');
    fs.style.display = 'flex';
    document.getElementById('project-content').innerHTML = `<img src="${proj.img}">`;
}
function closeFullscreen() { document.getElementById('project-fullscreen').style.display = 'none'; }

interact('.draggable').draggable({
    listeners: {
        start(event) {
            isDragging = true;
            const target = event.target;
            
            if (target.classList.contains('project-card') || target.classList.contains('aero-window')) {
                highestZ++;
                target.style.zIndex = highestZ + 9000;
            } else {
                target.style.zIndex = 500;
            }
        },
        move(event) {
            const target = event.target;
            const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
            const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

            // Aplicamos el movimiento sin romper el margen negativo del CSS
            target.style.transform = `translate(${x}px, ${y}px)`;
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        },
        end() {
            setTimeout(() => { isDragging = false; }, 50);
        }
    }
});
