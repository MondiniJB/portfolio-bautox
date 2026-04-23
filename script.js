let isDragging = false;
let openFolderId = null;

const projects = {
    tipo: [{id: 1, img: 'https://picsum.photos/400/500?random=11'}, {id: 12, img: 'https://picsum.photos/400/500?random=12'}],
    branding: [{id: 2, img: 'https://picsum.photos/400/500?random=21'}, {id: 22, img: 'https://picsum.photos/400/500?random=22'}],
    editorial: [{id: 3, img: 'https://picsum.photos/400/500?random=31'}],
    packaging: [{id: 4, img: 'https://picsum.photos/400/500?random=41'}],
    social: [{id: 5, img: 'https://picsum.photos/400/500?random=51'}]
};

// 1. DESORDENAR CARPETAS AL CARGAR
function randomizeFolders() {
    const folders = document.querySelectorAll('.folder');
    folders.forEach(folder => {
        const margin = 0.15; // 15% de margen para que no se peguen a los bordes
        const x = (window.innerWidth * margin) + (Math.random() * (window.innerWidth * (1 - margin * 2) - 100));
        const y = (window.innerHeight * margin) + (Math.random() * (window.innerHeight * (1 - margin * 2) - 110));
        
        folder.style.left = x + 'px';
        folder.style.top = y + 'px';
    });
}

// Ejecutar al cargar la página
window.onload = randomizeFolders;

function toggleProject(category, element) {
    if (isDragging) return;

    const gallery = document.getElementById('floating-gallery');
    
    if (openFolderId === category) {
        closeAllCards(element);
        return;
    }

    if (openFolderId) {
        const prevFolder = document.querySelector('.folder.is-open');
        if (prevFolder) closeAllCards(prevFolder);
    }

    openFolderId = category;
    element.classList.add('is-open');

    const rect = element.getBoundingClientRect();

    projects[category].forEach((proj, index) => {
        const card = document.createElement('div');
        card.className = 'project-card draggable';
        
        // Nacen desde la carpeta (escondidas)
        card.style.left = rect.left + 'px';
        card.style.top = rect.top + 'px';
        card.style.transform = 'scale(0)';
        card.style.opacity = '0';

        card.innerHTML = `<img src="${proj.img}">`;
        card.onclick = () => { if (!isDragging) openFullscreen(proj); };
        
        gallery.appendChild(card);

        // DISPERSIÓN CON MARGEN DEL 10%
        setTimeout(() => {
            const margin = 0.10; // 10% de margen
            const availableW = window.innerWidth * (1 - margin * 2);
            const availableH = window.innerHeight * (1 - margin * 2);
            
            // Calculamos posición aleatoria dentro del área central
            const randomX = (window.innerWidth * margin) + (Math.random() * (availableW - 300));
            const randomY = (window.innerHeight * margin) + (Math.random() * (availableH - 400));
            
            card.style.transform = 'scale(1)';
            card.style.opacity = '1';
            card.style.left = randomX + 'px';
            card.style.top = randomY + 'px';
        }, 50);
    });
}

function closeAllCards(folderElement) {
    const cards = document.querySelectorAll('.project-card');
    const rect = folderElement.getBoundingClientRect();

    cards.forEach(card => {
        card.style.left = rect.left + 'px';
        card.style.top = rect.top + 'px';
        card.style.transform = 'scale(0)';
        card.style.opacity = '0';
    });

    setTimeout(() => {
        document.getElementById('floating-gallery').innerHTML = '';
        folderElement.classList.remove('is-open');
        openFolderId = null;
    }, 600);
}

function openFullscreen(proj) {
    const fs = document.getElementById('project-fullscreen');
    fs.style.display = 'flex';
    document.getElementById('project-content').innerHTML = `<img src="${proj.img}" style="height:85vh; border: 5px solid white; border-radius:30px; box-shadow: 0 0 50px rgba(255,255,255,0.5);">`;
}

function closeFullscreen() {
    document.getElementById('project-fullscreen').style.display = 'none';
}

// Drag and Drop (para carpetas y cards)
interact('.draggable').draggable({
    listeners: {
        start() { isDragging = true; },
        move(event) {
            const target = event.target;
            const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
            const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
            target.style.transform += ` translate(${event.dx}px, ${event.dy}px)`;
            // Guardamos la posición para no perderla
            target.style.left = (parseFloat(target.style.left) + event.dx) + 'px';
            target.style.top = (parseFloat(target.style.top) + event.dy) + 'px';
        },
        end() { setTimeout(() => { isDragging = false; }, 100); }
    }
});
