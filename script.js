let isDragging = false;
let currentCategory = null;

// Tus proyectos (Placeholder por ahora)
const projects = {
    tipo: [
        { id: 1, img: 'https://via.placeholder.com/600x800', title: 'Libro de Tipografía' },
        { id: 2, img: 'https://via.placeholder.com/600x800', title: 'Manual de Estilo' }
    ],
    branding: [
        { id: 3, img: 'https://via.placeholder.com/600x800', title: 'Identidad CEVEDE' },
        { id: 4, img: 'https://via.placeholder.com/600x800', title: 'Branding Chronos' }
    ]
};

function openProject(category, event) {
    if (isDragging) return;

    const gallery = document.getElementById('floating-gallery');

    // Cerrar si ya está abierta la misma carpeta
    if (currentCategory === category) {
        gallery.innerHTML = '';
        currentCategory = null;
        return;
    }

    gallery.innerHTML = '';
    currentCategory = category;

    // Medidas de la pantalla
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Posición de la carpeta clicada (para el efecto de vuelo inicial)
    const folder = event.currentTarget;
    const folderRect = folder.getBoundingClientRect();

    projects[category].forEach((proj, index) => {
        const card = document.createElement('div');
        card.className = 'project-card draggable';
        
        // --- CÁLCULO DE POSICIÓN CENTRADA (DERECHAS) ---
        // Desfase para que no se encimen totalmente (como abanico)
        const offset = index * 40; 
        
        // Posición final centrada en la pantalla
        const centerX = (w / 2) - 300 + offset; // Asumimos un ancho aprox de card de 600px
        const centerY = (h / 2) - 400 + offset; // Asumimos un alto aprox de 800px

        // Posicionamos en el centro de la pantalla, sin rotación
        card.style.left = centerX + 'px';
        card.style.top = centerY + 'px';
        
        card.innerHTML = `<img src="${proj.img}" alt="${proj.title}">`;
        
        card.onclick = () => { if (!isDragging) openFullscreen(proj); };
        
        gallery.appendChild(card);
    });
}

function openFullscreen(proj) {
    const fs = document.getElementById('project-fullscreen');
    const content = document.getElementById('project-content');
    fs.style.display = 'block';
    content.innerHTML = `<h1>${proj.title}</h1><img src="${proj.img}">`;
}

function closeFullscreen() {
    document.getElementById('project-fullscreen').style.display = 'none';
}

// Drag and Drop
interact('.draggable').draggable({
    listeners: {
        start() { isDragging = true; },
        move(event) {
            const target = event.target;
            const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
            const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
            
            // SIN ROTACIÓN AL MOVER
            target.style.transform = `translate(${x}px, ${y}px)`;
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        },
        end() { setTimeout(() => { isDragging = false; }, 100); }
    }
});
