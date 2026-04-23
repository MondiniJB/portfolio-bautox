let isDragging = false;
let currentCategory = null;

const content = {
    tipo: [{img: 'https://picsum.photos/600/800?random=1'}],
    branding: [{img: 'https://picsum.photos/600/800?random=2'}],
    editorial: [{img: 'https://picsum.photos/600/800?random=3'}],
    packaging: [{img: 'https://picsum.photos/600/800?random=4'}],
    social: [{img: 'https://picsum.photos/600/800?random=5'}]
};

// Desordenar carpetas al inicio sin que se bugeen
window.onload = () => {
    document.querySelectorAll('.folder').forEach(f => {
        const x = Math.random() * (window.innerWidth - 150) + 50;
        const y = Math.random() * (window.innerHeight - 150) + 50;
        f.style.left = x + 'px';
        f.style.top = y + 'px';
        // Inicializamos los atributos para que el drag no las mande a la esquina
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

    content[category].forEach((proj, index) => {
        const card = document.createElement('div');
        card.className = 'project-card draggable';
        
        // Aparecen en el área central (Margen 15%)
        const x = (window.innerWidth * 0.15) + (Math.random() * (window.innerWidth * 0.5));
        const y = (window.innerHeight * 0.15) + (Math.random() * (window.innerHeight * 0.4));
        
        card.style.left = x + 'px';
        card.style.top = y + 'px';
        card.innerHTML = `<img src="${proj.img}">`;
        card.onclick = (e) => { e.stopPropagation(); if (!isDragging) openFullscreen(proj); };
        gallery.appendChild(card);
    });
}

function openFullscreen(proj) {
    const fs = document.getElementById('project-fullscreen');
    fs.style.display = 'flex';
    document.getElementById('project-content').innerHTML = `<img src="${proj.img}" style="height:80vh; border-radius:20px;">`;
}

function closeFullscreen() {
    document.getElementById('project-fullscreen').style.display = 'none';
}

// DRAG AND DROP CORREGIDO (No salta a la esquina)
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
