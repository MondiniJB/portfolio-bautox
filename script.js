let isDragging = false;
let currentCategory = null;

// (Mantener objeto content y randomize inicial igual)
const content = {
    tipo: [{title: 'T1', img: 'https://picsum.photos/600/800?random=1'}, {title: 'T2', img: 'https://picsum.photos/600/800?random=11'}],
    branding: [{title: 'B1', img: 'https://picsum.photos/600/800?random=2'}, {title: 'B2', img: 'https://picsum.photos/600/800?random=22'}],
    editorial: [{title: 'E1', img: 'https://picsum.photos/600/800?random=3'}],
    packaging: [{title: 'P1', img: 'https://picsum.photos/600/800?random=4'}],
    social: [{title: 'S1', img: 'https://picsum.photos/600/800?random=5'}]
};

window.onload = () => {
    document.querySelectorAll('.folder, .app-icon').forEach(f => {
        const x = Math.random() * (window.innerWidth - 150) + 50;
        const y = Math.random() * (window.innerHeight - 150) + 50;
        f.style.left = x + 'px';
        f.style.top = y + 'px';
        f.setAttribute('data-x', 0);
        f.setAttribute('data-y', 0);
    });
};

// --- LÓGICA DE BIOGRAFÍA ---
function openAbout(event) {
    event.stopPropagation(); // Evita que el escritorio detecte el clic
    if (isDragging) return;
    document.getElementById('about-window').style.display = 'flex';
}

function closeAbout() {
    document.getElementById('about-window').style.display = 'none';
}

// Cierra si tocas el escritorio (fondo)
function closeFromOutside(event) {
    if (event.target.id === 'desktop') {
        closeAbout();
        // También cerramos las fotos si querés que el escritorio limpie todo
        document.getElementById('floating-gallery').innerHTML = '';
        currentCategory = null;
    }
}

// (Mantener funciones toggleProject, openFullscreen y el Interact draggable igual)
function toggleProject(category, element) {
    if (isDragging) return;
    const gallery = document.getElementById('floating-gallery');
    if (currentCategory === category) { gallery.innerHTML = ''; currentCategory = null; return; }
    gallery.innerHTML = ''; currentCategory = category;
    content[category].forEach((proj) => {
        const card = document.createElement('div'); card.className = 'project-card draggable';
        const margin = 0.10; const cardWidth = window.innerHeight * 0.45; const cardHeight = window.innerHeight * 0.60;
        const x = (window.innerWidth * margin) + (Math.random() * (window.innerWidth * (1 - margin*2) - cardWidth));
        const y = (window.innerHeight * margin) + (Math.random() * (window.innerHeight * (1 - margin*2) - cardHeight));
        card.style.left = x + 'px'; card.style.top = y + 'px'; card.style.zIndex = "9000";
        card.innerHTML = `<img src="${proj.img}">`;
        card.onclick = (e) => { e.stopPropagation(); if (!isDragging) openFullscreen(proj); };
        gallery.appendChild(card);
    });
}

function openFullscreen(proj) {
    const fs = document.getElementById('project-fullscreen'); fs.style.display = 'flex';
    document.getElementById('project-content').innerHTML = `<img src="${proj.img}" style="height:85vh; border-radius:20px; border: 4px solid white;">`;
}
function closeFullscreen() { document.getElementById('project-fullscreen').style.display = 'none'; }

interact('.draggable').draggable({
    listeners: {
        start(event) { isDragging = true; event.target.style.zIndex = "9001"; },
        move(event) {
            const target = event.target;
            const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
            const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
            target.style.transform = `translate(${x}px, ${y}px)`;
            target.setAttribute('data-x', x); target.setAttribute('data-y', y);
        },
        end() { setTimeout(() => { isDragging = false; }, 50); }
    }
});
