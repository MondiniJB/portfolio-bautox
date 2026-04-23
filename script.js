let isDragging = false;
let currentCategory = null;
let highestZ = 9000; // El contador empieza alto para las fotos/ventanas

const content = {
    tipo: [{img: 'https://picsum.photos/600/800?random=101'}],
    branding: [{img: 'https://picsum.photos/600/800?random=201'}],
    editorial: [{img: 'https://picsum.photos/600/800?random=301'}],
    packaging: [{img: 'https://picsum.photos/600/800?random=401'}]
};

// DISPERSIÓN INICIAL (Asegura que "Sobre Mí" no se bugee)
window.onload = () => {
    document.querySelectorAll('.folder, .app-icon').forEach(f => {
        const x = Math.random() * (window.innerWidth - 200) + 50;
        const y = Math.random() * (window.innerHeight - 200) + 50;
        f.style.left = x + 'px';
        f.style.top = y + 'px';
        f.setAttribute('data-x', 0);
        f.setAttribute('data-y', 0);
        // El z-index de los iconos se mantiene en 100 (CSS)
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
        
        // RESTRICCIÓN 10% (Matemática para que no se escapen)
        const margin = 0.1;
        const cardW = window.innerHeight * 0.45; 
        const cardH = window.innerHeight * 0.55; 
        
        const maxX = window.innerWidth * (1 - margin) - cardW;
        const maxY = window.innerHeight * (1 - margin) - cardH;
        const minX = window.innerWidth * margin;
        const minY = window.innerHeight * margin;

        const x = Math.max(minX, Math.random() * maxX);
        const y = Math.max(minY, Math.random() * maxY);
        
        // Z-index Dinámico: siempre sobre los iconos
        highestZ++;
        card.style.left = x + 'px'; 
        card.style.top = y + 'px'; 
        card.style.zIndex = highestZ;

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
    
    // Z-index Dinámico: PRIORIDAD MÁXIMA
    highestZ++;
    win.style.zIndex = highestZ + 100;
}

function closeAbout() { document.getElementById('about-window').style.display = 'none'; }

function closeFromOutside(event) {
    if (event.target.id === 'desktop') {
        closeAbout();
        document.getElementById('floating-gallery').innerHTML = '';
        currentCategory = null;
    }
}

// Fullscreen
function openFullscreen(proj) {
    const fs = document.getElementById('project-fullscreen');
    fs.style.display = 'flex';
    document.getElementById('project-content').innerHTML = `<img src="${proj.img}">`;
}
function closeFullscreen() { document.getElementById('project-fullscreen').style.display = 'none'; }

// DRAG AND DROP CORREGIDO (Z-index dinámico)
interact('.draggable').draggable({
    listeners: {
        start(event) { 
            isDragging = true;
            // Al arrastrar, lo mandamos al frente de su propia capa
            highestZ++;
            if (event.target.classList.contains('project-card')) {
                event.target.style.zIndex = highestZ; // Capa fotos
            } else if (event.target.classList.contains('aero-window')) {
                event.target.style.zIndex = highestZ + 100; // Capa ventanas
            } else {
                event.target.style.zIndex = highestZ - 8000; // Capa íconos (vuelven a su lugar)
            }
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
