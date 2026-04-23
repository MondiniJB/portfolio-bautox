let isDragging = false;
let currentCategory = null;

const projects = {
    tipo: [
        { id: 1, img: 'https://picsum.photos/600/800?random=1', title: 'Libro de Tipografía' },
        { id: 2, img: 'https://picsum.photos/600/800?random=2', title: 'Afiche Bauhaus' },
        { id: 3, img: 'https://picsum.photos/600/800?random=3', title: 'Sistema de Signos' }
    ],
    branding: [
        { id: 4, img: 'https://picsum.photos/600/800?random=4', title: 'Logotipo CEVEDE' },
        { id: 5, img: 'https://picsum.photos/600/800?random=5', title: 'Branding Chronos' }
    ]
};

function openProject(category) {
    if (isDragging) return;

    const gallery = document.getElementById('floating-gallery');

    // Si ya está abierta la misma categoría, la cerramos
    if (currentCategory === category) {
        gallery.innerHTML = '';
        currentCategory = null;
        return;
    }

    // Si hay otra abierta, la limpiamos y marcamos la nueva
    gallery.innerHTML = '';
    currentCategory = category;

    projects[category].forEach((proj, index) => {
        const card = document.createElement('div');
        card.className = 'project-card draggable';
        
        // Posiciones aleatorias dispersas
        const randomX = Math.random() * (window.innerWidth - 300) + 50;
        const randomY = Math.random() * (window.innerHeight - 400) + 50;
        const randomRotate = (Math.random() - 0.5) * 20;

        card.style.left = randomX + 'px';
        card.style.top = randomY + 'px';
        card.style.transform = `rotate(${randomRotate}deg)`;
        
        card.innerHTML = `<img src="${proj.img}" alt="${proj.title}">`;
        
        card.onclick = () => {
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
        <h1>${proj.title}</h1>
        <img src="${proj.img}">
    `;
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
            
            // Mantenemos la rotación original mientras arrastramos
            const style = window.getComputedStyle(target);
            const matrix = new WebKitCSSMatrix(style.transform);
            const rotate = Math.round(Math.atan2(matrix.b, matrix.a) * (180/Math.PI));

            target.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg)`;
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        },
        end() {
            setTimeout(() => { isDragging = false; }, 100);
        }
    }
});
