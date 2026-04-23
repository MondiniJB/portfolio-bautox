let isDragging = false;
let currentCategory = null;

const content = {
    tipo: [{title: 'T1', img: 'https://picsum.photos/600/800?random=1'}, {title: 'T2', img: 'https://picsum.photos/600/800?random=11'}],
    branding: [{title: 'B1', img: 'https://picsum.photos/600/800?random=2'}, {title: 'B2', img: 'https://picsum.photos/600/800?random=22'}],
    editorial: [{title: 'E1', img: 'https://picsum.photos/600/800?random=3'}],
    packaging: [{title: 'P1', img: 'https://picsum.photos/600/800?random=4'}],
    social: [{title: 'S1', img: 'https://picsum.photos/600/800?random=5'}]
};

window.onload = () => {
    document.querySelectorAll('.folder').forEach(f => {
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
        
        // MÁRGENES 10%
        const margin = 0.10;
        const cardWidth = window.innerHeight * 0.45; 
        const cardHeight = window.innerHeight * 0.60;

        const minX = window.innerWidth * margin;
        const maxX = window.innerWidth * (1 - margin) - cardWidth;
        const minY = window.innerHeight * margin;
        const maxY = window.innerHeight * (1 - margin) - cardHeight;

        const x = Math.max(minX, Math.min(maxX, Math.random() * maxX + minX));
        const y = Math.max(minY, Math.min(maxY, Math.random() * maxY + minY));
        
        card.style.left = x + 'px';
        card.style.top = y + 'px';
        
        // Forzamos el frente en el estilo directo
        card.style.zIndex = "9000";

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
        start(event) { 
            isDragging = true;
            // Al empezar a mover, lo mandamos al frente de todo
            event.target.style.zIndex = "9001";
        },
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
