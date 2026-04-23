let isDragging = false;

// Base de datos de tus proyectos
const projects = {
    tipo: [
        { id: 1, img: 'https://picsum.photos/400/300?random=1', title: 'Historia de la Tipografía' },
        { id: 2, img: 'https://picsum.photos/400/300?random=2', title: 'Manual de Estilo' }
    ],
    branding: [
        { id: 3, img: 'https://picsum.photos/400/300?random=3', title: 'Identidad CEVEDE' },
        { id: 4, img: 'https://picsum.photos/400/300?random=4', title: 'Chronos Time Travel' }
    ]
};

function openProject(category) {
    if (isDragging) return;

    const gallery = document.getElementById('floating-gallery');
    gallery.innerHTML = ''; 

    projects[category].forEach((proj, index) => {
        const card = document.createElement('div');
        card.className = 'project-card draggable';
        
        // Se despliegan en abanico
        const offset = index * 40;
        card.style.left = (150 + offset) + 'px';
        card.style.top = (150 + offset) + 'px';
        
        card.innerHTML = `<img src="${proj.img}" alt="${proj.title}">`;
        
        card.onclick = (e) => {
            if (!isDragging) openFullscreen(proj);
        };
        
        gallery.appendChild(card);
    });
}

function openFullscreen(proj) {
    const fs = document.getElementById('project-fullscreen');
    const content = document.getElementById('project-content');
    fs.style.display = 'block';
    content.innerHTML = `
        <h1 style="font-size: 2.5rem; margin-bottom: 10px;">${proj.title}</h1>
        <p style="color: #ccc;">Diseño Gráfico Profesional</p>
        <img src="${proj.img}" alt="${proj.title}">
    `;
}

function closeFullscreen() {
    document.getElementById('project-fullscreen').style.display = 'none';
}

// Configuración de movimiento
interact('.draggable').draggable({
    listeners: {
        start() { isDragging = true; },
        move(event) {
            const target = event.target;
            const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
            const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
            target.style.transform = `translate(${x}px, ${y}px)`;
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        },
        end() {
            setTimeout(() => { isDragging = false; }, 150);
        }
    }
});
