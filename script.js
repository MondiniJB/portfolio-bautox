let isDragging = false;
let openFolderCategory = null;

// BASE DE DATOS ASIGNADA
const content = {
    tipo: [
        {title: 'Tipografía 1', img: 'https://picsum.photos/600/800?random=10'},
        {title: 'Tipografía 2', img: 'https://picsum.photos/600/800?random=11'}
    ],
    branding: [
        {title: 'Branding 1', img: 'https://picsum.photos/600/800?random=20'},
        {title: 'Branding 2', img: 'https://picsum.photos/600/800?random=21'}
    ],
    editorial: [
        {title: 'Editorial 1', img: 'https://picsum.photos/600/800?random=30'}
    ],
    packaging: [
        {title: 'Packaging 1', img: 'https://picsum.photos/600/800?random=40'}
    ],
    social: [
        {title: 'Social 1', img: 'https://picsum.photos/600/800?random=50'}
    ]
};

// 1. Posiciones iniciales aleatorias para las carpetas
window.onload = () => {
    document.querySelectorAll('.folder').forEach(f => {
        f.style.left = (Math.random() * 70 + 10) + '%';
        f.style.top = (Math.random() * 70 + 10) + '%';
    });
};

function toggleProject(category, element) {
    if (isDragging) return;

    const gallery = document.getElementById('floating-gallery');
    
    // Si la carpeta ya estaba abierta, la cerramos
    if (openFolderCategory === category) {
        closeGallery(element);
        return;
    }

    // Si hay otra carpeta abierta, la cerramos antes de abrir la nueva
    if (openFolderCategory) {
        const prevFolder = document.querySelector('.folder.is-open');
        if (prevFolder) closeGallery(prevFolder);
    }

    // Abrimos la nueva
    openFolderCategory = category;
    element.classList.add('is-open');
    const rect = element.getBoundingClientRect();

    content[category].forEach((proj, index) => {
        const card = document.createElement('div');
        card.className = 'project-card draggable';
        
        // Empiezan "dentro" de la carpeta
        card.style.left = rect.left + 'px';
        card.style.top = rect.top + 'px';
        card.style.transform = 'scale(0) rotate(0deg)';
        card.style.opacity = '0';

        card.innerHTML = `<img src="${proj.img}" alt="${proj.title}">`;
        card.onclick = (e) => {
            e.stopPropagation();
            if (!isDragging) openFullscreen(proj);
        };
        
        gallery.appendChild(card);

        // Dispersión con margen de 15%
        setTimeout(() => {
            const margin = 0.15;
            const x = (window.innerWidth * margin) + (Math.random() * (window.innerWidth * (1 - margin * 2) - 250));
            const y = (window.innerHeight * margin) + (Math.random() * (window.innerHeight * (1 - margin * 2) - 350));
            
            card.style.left = x + 'px';
            card.style.top = y + 'px';
            card.style.transform = `scale(1) rotate(${(Math.random() - 0.5) * 10}deg)`;
            card.style.opacity = '1';
        }, 50 + (index * 100));
    });
}

function closeGallery(folderElement) {
    const cards = document.querySelectorAll('.project-card');
    const rect = folderElement.getBoundingClientRect();

    cards.forEach(card => {
        card.style.left = rect.left + 'px';
        card.style.top = rect.top + 'px';
        card.style.transform = 'scale(0) rotate(0deg)';
        card.style.opacity = '0';
    });

    setTimeout(() => {
        document.getElementById('floating-gallery').innerHTML = '';
        folderElement.classList.remove('is-open');
        if (openFolderCategory === folderElement.id.replace('f-', '')) {
            openFolderCategory = null;
        }
    }, 500);
}

function openFullscreen(proj) {
    const fs = document.getElementById('project-fullscreen');
    fs.style.display = 'flex';
    document.getElementById('project-content').innerHTML = `
        <img src="${proj.img}" style="max-height:85vh; border-radius:20px; box-shadow:0 0 50px white;">
        <h2 style="color:white; font-family:sans-serif; margin-top:15px;">${proj.title}</h2>
    `;
}

function closeFullscreen() {
    document.getElementById('project-fullscreen').style.display = 'none';
}

// DRAG AND DROP
interact('.draggable').draggable({
    listeners: {
        start() { isDragging = true; },
        move(event) {
            const target = event.target;
            const x = (parseFloat(target.style.left) || 0) + event.dx;
            const y = (parseFloat(target.style.top) || 0) + event.dy;
            target.style.left = x + 'px';
            target.style.top = y + 'px';
        },
        end() { setTimeout(() => { isDragging = false; }, 100); }
    }
});
