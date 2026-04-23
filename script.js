let isDragging = false;
let currentCategory = null;

const projects = {
    tipo: [
        { id: 1, img: 'https://picsum.photos/600/800?random=1', title: 'Historia de la Tipografía' },
        { id: 2, img: 'https://picsum.photos/600/800?random=2', title: 'Manual de Estilo' },
        { id: 3, img: 'https://picsum.photos/600/800?random=5', title: 'Tipografía Experimental' }
    ],
    branding: [
        { id: 4, img: 'https://picsum.photos/600/800?random=3', title: 'Identidad CEVEDE' },
        { id: 5, img: 'https://picsum.photos/600/800?random=4', title: 'Chronos Time Travel' }
    ]
};

function openProject(category) {
    if (isDragging) return;

    const gallery = document.getElementById('floating-gallery');

    // Si tocamos la misma carpeta que ya está abierta, la cerramos
    if (currentCategory === category) {
        closeGallery();
        return;
    }

    // Si hay otra abierta, la cerramos rápido antes de abrir la nueva
    gallery.innerHTML = '';
    currentCategory = category;

    projects[category].forEach((proj, index) => {
        const card = document.createElement('div');
        card.className = 'project-card draggable';
        
        // --- CÁLCULO ALEATORIO ---
        // Definimos un área central (del 20% al 60% de la pantalla)
        const randomX = Math.random() * (window.innerWidth - 400) + 100;
        const randomY = Math.random() * (window.innerHeight - 400) + 100;
        
        // Rotación aleatoria leve para que se vea "desordenado"
        const randomRotate = (Math.random() - 0.5) * 20; // Entre -10 y 10 grados

        card.style.left = randomX + 'px';
        card.style.top = randomY + 'px';
        card.style.transform = `rotate(${randomRotate}deg)`;
        
        card.innerHTML = `<img src="${proj.img}" alt="${proj.title}">`;
        
        card.onclick = (e) => {
            if (!isDragging) openFullscreen(proj);
        };
        
        gallery.appendChild(card);
    });
}

function closeGallery() {
    const gallery = document.getElementById('floating-gallery');
    // Añadimos una clase de salida para la animación si querés, o simplemente limpiamos
    gallery.innerHTML = '';
    currentCategory = null;
}

function openFullscreen(proj) {
    const fs = document.getElementById('project-fullscreen');
    const content = document.getElementById('project-content');
    fs.style.display = 'block';
    content.innerHTML = `
        <h1 style="font-size: 2.5rem; margin-bottom: 10px;">${proj.title}</h1>
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
            
            // Mantener la rotación aleatoria mientras se arrastra
            const currentTransform = target.style.transform;
            const rotateMatch = currentTransform.match(/rotate\((.*?)\)/);
            const rotation = rotateMatch ? rotateMatch[0] : 'rotate(0deg)';

            target.style.transform = `translate(${x}px, ${y}px) ${rotation}`;
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        },
        end() {
            setTimeout(() => { isDragging = false; }, 150);
        }
    }
});
