let isDragging = false;
let currentCategory = null;
let highestZ = 9000;

// --- BASE DE DATOS DE PROYECTOS ---
const content = {
    tipo: [
        { name: 'Fuentes_2026.otf', img: 'https://picsum.photos/100/100?random=1' },
        { name: 'Typography_Book.pdf', img: 'https://picsum.photos/100/100?random=2' }
    ],
    branding: [
        { name: 'Logo_CEVEDE.png', img: 'https://picsum.photos/100/100?random=3' },
        { name: 'Verboten_ID.jpg', img: 'https://picsum.photos/100/100?random=4' }
    ],
    editorial: [
        { name: 'Revista_Final.pdf', img: 'https://picsum.photos/100/100?random=5' }
    ],
    packaging: [
        { name: 'Chronos_Box.mockup', img: 'https://picsum.photos/100/100?random=6' }
    ]
};

window.onload = () => {
    const items = document.querySelectorAll('.folder, .app-icon');
    const positions = [];
    const margin = 0.15;

    items.forEach(item => {
        let x, y, collision;
        let attempts = 0;
        do {
            collision = false;
            x = (window.innerWidth * margin) + Math.random() * (window.innerWidth * (1 - margin * 2) - 100);
            y = (window.innerHeight * margin) + Math.random() * (window.innerHeight * (1 - margin * 2) - 120);
            for (let pos of positions) {
                const dist = Math.hypot(x - pos.x, y - pos.y);
                if (dist < 130) { collision = true; break; }
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

// --- FUNCIÓN PARA ABRIR CARPETAS COMO VENTANAS ---
function toggleProject(category, element) {
    if (isDragging) return;
    
    const win = document.getElementById('about-window');
    const winTitle = win.querySelector('.window-title');
    const winContent = win.querySelector('.window-content');

    // Cambiar título de la ventana
    winTitle.innerText = `C:\\Proyectos\\${category.toUpperCase()}`;
    
    // Generar el grid de iconos dentro de la ventana
    let gridHtml = `<div class="folder-grid">`;
    content[category].forEach(file => {
        gridHtml += `
            <div class="file-item" onclick="openFullscreen({img: '${file.img}'})">
                <div class="file-icon" style="background-image: url('${file.img}')"></div>
                <span class="file-label">${file.name}</span>
            </div>
        `;
    });
    gridHtml += `</div>`;
    
    winContent.innerHTML = gridHtml;
    
    // Mostrar ventana
    win.style.display = 'flex';
    win.setAttribute('data-x', 0);
    win.setAttribute('data-y', 0);
    win.style.transform = 'translate(0px, 0px)';
    
    highestZ++;
    win.style.zIndex = highestZ + 9000;
}

function openAbout(event) {
    if (event) event.stopPropagation();
    if (isDragging) return;
    const win = document.getElementById('about-window');
    const winContent = win.querySelector('.window-content');
    win.querySelector('.window-title').innerText = "Biografía.exe";
    
    winContent.innerHTML = `
        <div class="bio-layout">
            <img src="user_icon.png" class="bio-photo">
            <div class="bio-text">
                <h2>¡Hola! Soy Bautox!</h2>
                <p>Soy diseñador gráfico profesional y estudiante universitario.</p>
            </div>
        </div>`;
    
    win.style.display = 'flex';
    win.setAttribute('data-x', 0);
    win.setAttribute('data-y', 0);
    win.style.transform = 'translate(0px, 0px)';
    highestZ++;
    win.style.zIndex = highestZ + 9000;
}

function closeAbout() { document.getElementById('about-window').style.display = 'none'; }

function closeFromOutside(event) {
    if (event.target.id === 'desktop') { closeAbout(); }
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
            highestZ++;
            event.target.style.zIndex = highestZ + 9000;
        },
        move(event) {
            const target = event.target;
            const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
            const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
            target.style.transform = `translate(${x}px, ${y}px)`;
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        },
        end() { setTimeout(() => { isDragging = false; }, 50); }
    }
});
