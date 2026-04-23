let isDragging = false;
let currentCategory = null;

const content = {
    tipo: [{img: 'https://picsum.photos/800/200?random=1'}],
    branding: [{img: 'https://picsum.photos/800/200?random=2'}],
    editorial: [{img: 'https://picsum.photos/800/200?random=3'}],
    packaging: [{img: 'https://picsum.photos/800/200?random=4'}],
    social: [{img: 'https://picsum.photos/800/200?random=5'}]
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

function openAbout(event) {
    if (event) event.stopPropagation();
    if (isDragging) return;
    const win = document.getElementById('about-window');
    win.style.display = 'flex';
    // Limpiamos transforms previos para que abra siempre pura
    win.style.transform = 'scale(1)';
    win.setAttribute('data-x', 0);
    win.setAttribute('data-y', 0);
}

function closeAbout() { document.getElementById('about-window').style.display = 'none'; }

function closeFromOutside(event) {
    if (event.target.id === 'desktop') {
        closeAbout();
        document.getElementById('floating-gallery').innerHTML = '';
        currentCategory = null;
    }
}

function toggleProject(category, element) {
    if (isDragging) return;
    const gallery = document.getElementById('floating-gallery');
    if (currentCategory === category) { gallery.innerHTML = ''; currentCategory = null; return; }
    gallery.innerHTML = ''; currentCategory = category;
    content[category].forEach((proj) => {
        const card = document.createElement('div');
        card.className = 'project-card draggable';
        const margin = 0.10;
        const x = (window.innerWidth * margin) + (Math.random() * (window.innerWidth * 0.5));
        const y = (window.innerHeight * margin) + (Math.random() * (window.innerHeight * 0.4));
        card.style.left = x + 'px'; card.style.top = y + 'px'; card.style.zIndex = "9000";
        card.innerHTML = `<img src="${proj.img}">`;
        card.onclick = (e) => { e.stopPropagation(); if (!isDragging) openFullscreen(proj); };
        gallery.appendChild(card);
    });
}

function openFullscreen(proj) {
    const fs = document.getElementById('project-fullscreen');
    fs.style.display = 'flex';
    document.getElementById('project-content').innerHTML = `<img src="${proj.img}">`;
}

function closeFullscreen() { document.getElementById('project-fullscreen').style.display = 'none'; }

// DRAG AND DROP FINAL
interact('.draggable').draggable({
    listeners: {
        start(event) { 
            isDragging = true; 
            event.target.style.zIndex = "9001"; 
        },
        move(event) {
            const target = event.target;
            // Recuperamos la posición actual
            const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
            const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

            // Aplicamos el movimiento puro
            target.style.transform = `translate(${x}px, ${y}px)`;

            // Guardamos para el siguiente frame
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        },
        end() { setTimeout(() => { isDragging = false; }, 50); }
    }
});
