let isDragging = false;

const projects = {
    tipo: [
        { id: 1, img: 'https://picsum.photos/600/800?random=1', title: 'Libro de Tipografía' },
        { id: 2, img: 'https://picsum.photos/600/800?random=2', title: 'Manual de Estilo' }
    ],
    branding: [
        { id: 3, img: 'https://picsum.photos/600/800?random=3', title: 'Logotipo CEVEDE' },
        { id: 4, img: 'https://picsum.photos/600/800?random=4', title: 'Branding Chronos' }
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

    projects[category].forEach((proj, index) => {
        const card = document.createElement('div');
        card.className = 'project-card draggable';
        
        // --- CÁLCULO PARA EL 80% CENTRAL ---
        
        // 1. Definimos márgenes de seguridad (10% de cada lado = 20% total)
        const marginX = window.innerWidth * 0.1;
        const marginY = window.innerHeight * 0.1;

        // 2. Definimos el área útil (el 80% central)
        const usefulWidth = window.innerWidth * 0.8;
        const usefulHeight = window.innerHeight * 0.8;

        // 3. Calculamos posición aleatoria dentro de esa área útil
        // Restamos un poco (ej: 200px) para compensar el tamaño de la propia card
        const randomX = marginX + (Math.random() * (usefulWidth - 200));
        const randomY = marginY + (Math.random() * (usefulHeight - 300));
        
        // Rotación leve
        const randomRotate = (Math.random() - 0.5) * 15;

        card.style.left = randomX + 'px';
        card.style.top = randomY + 'px';
        card.setAttribute('data-rot', randomRotate);
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
    content.innerHTML = `<h1>${proj.title}</h1><img src="${proj.img}">`;
}

function closeFullscreen() {
    document.getElementById('project-fullscreen').style.display = 'none';
}

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
