let isDragging = false;
let currentCategory = null;

const content = {
    tipo: [{title: 'Tipo 1', img: 'https://picsum.photos/600/800?random=1'}, {title: 'Tipo 2', img: 'https://picsum.photos/600/800?random=11'}],
    branding: [{title: 'Brand 1', img: 'https://picsum.photos/600/800?random=2'}, {title: 'Brand 2', img: 'https://picsum.photos/600/800?random=22'}],
    editorial: [{title: 'Edi 1', img: 'https://picsum.photos/600/800?random=3'}],
    packaging: [{title: 'Pack 1', img: 'https://picsum.photos/600/800?random=4'}],
    social: [{title: 'Social 1', img: 'https://picsum.photos/600/800?random=5'}]
};

window.onload = () => {
    document.querySelectorAll('.folder').forEach(f => {
        // Carpetas dispersas con margen
        const x = Math.random() * (window.innerWidth - 150) + 50;
        const y = Math.random() * (window.innerHeight - 150) + 50;
        f.style.left = x + 'px';
        f.style.top = y + 'px';
        f.setAttribute('data-x', 0);
        f.setAttribute('data-y', 0);
    });
};

function toggleProject(category, element) {
    if (isDragging) return;
    const gallery = document.getElementById('floating-gallery');

    if (currentCategory === category) {
        gallery.innerHTML = '';
        currentCategory = null;
        return;
    }

    gallery.innerHTML = '';
    currentCategory = category;

    content[category].forEach((proj) => {
        const card = document.createElement('div');
        card.className = 'project-card draggable';
        
        // --- LÓGICA DE MÁRGENES 10% ---
        const margin = 0.10;
        const cardWidth = window.innerHeight * 0.45; // Estimación del ancho basado en 60vh
        const cardHeight = window.innerHeight * 0.60;

        const minX = window.innerWidth * margin;
        const maxX = window.innerWidth * (1 - margin) - cardWidth;
        const minY = window.innerHeight * margin;
        const maxY = window.innerHeight * (1 - margin) - cardHeight;

        const x = Math.max(minX, Math.min(maxX, Math.random() * maxX + minX));
        const y = Math.max(minY, Math.min(maxY, Math.random() * maxY + minY));
        
        card.style.left = x + 'px';
        card.style.top = y + 'px';
        card.innerHTML = `<img src="${proj.img}">`;
        
        card.onclick = (e) => { 
            e.stopPropagation(); 
            if (!isDragging) openFullscreen(proj); 
        };
        
        gallery.appendChild(card);
    });
}

function openFullscreen(proj) {
    const fs = document.getElementById('project-fullscreen');
    fs.style.display = 'flex';
    document.getElementById('project-content').innerHTML = `<img src="${proj.img}" style="height:85vh; border-radius:20px; border: 4px solid white;">`;
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
        end() { setTimeout(() => { isDragging = false; }, 50); }
    }
});
