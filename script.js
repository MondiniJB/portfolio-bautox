// script.js - Reemplazá todo

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

function openProject(category) {
    if (isDragging) return;

    const gallery = document.getElementById('floating-gallery');

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

    projects[category].forEach((proj, index) => {
        const card = document.createElement('div');
        card.className = 'project-card draggable';
        
        // --- CÁLCULO DE RESTRICCIÓN DE PANTALLA ---
        // Definimos un margen seguro del 10% por lado
        const marginX = w * 0.10;
        const marginY = h * 0.10;

        // Definimos el área útil (el 80% central)
        const usefulWidth = w * 0.80;
        const usefulHeight = h * 0.80;

        // Calculamos posición aleatoria dentro del área útil, restando el tamaño estimado de la card
        // Asumimos un ancho aprox de card de 400px y alto de 300px (basado en aspect-ratio 4:3 y 60vh)
        const estimatedCardW = 400; 
        const estimatedCardH = 300; 

        // Aseguramos que el punto inicial (randomX) nunca esté muy a la derecha
        // y el punto final (randomX + estimatedCardW) nunca pise el margen derecho.
        const maxX = usefulWidth - estimatedCardW;
        const maxY = usefulHeight - estimatedCardH;
        
        // Usamos Math.max(0, ...) para evitar números negativos en pantallas muy chicas
        const randomX = marginX + Math.max(0, Math.random() * maxX);
        const randomY = marginY + Math.max(0, Math.random() * maxY);

        card.style.left = randomX + 'px';
        card.style.top = randomY + 'px';
        
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
            target.style.transform = `translate(${x}px, ${y}px)`;
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        },
        end() { setTimeout(() => { isDragging = false; }, 100); }
    }
});
