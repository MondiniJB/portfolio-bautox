let isDragging = false;
let openFolderId = null;

const projects = {
    tipo: [{id: 1, img: 'https://picsum.photos/400/500?random=1'}],
    branding: [{id: 2, img: 'https://picsum.photos/400/500?random=2'}],
    editorial: [{id: 3, img: 'https://picsum.photos/400/500?random=3'}],
    packaging: [{id: 4, img: 'https://picsum.photos/400/500?random=4'}],
    social: [{id: 5, img: 'https://picsum.photos/400/500?random=5'}]
};

function toggleProject(category, element) {
    if (isDragging) return;

    const gallery = document.getElementById('floating-gallery');
    
    // Si la carpeta ya está abierta, cerramos todo
    if (openFolderId === category) {
        closeAllCards(element);
        return;
    }

    // Si hay otra abierta, la cerramos antes
    if (openFolderId) {
        const prevFolder = document.querySelector('.folder.is-open');
        closeAllCards(prevFolder);
    }

    openFolderId = category;
    element.classList.add('is-open');

    // Posición de la carpeta para que las fotos salgan de ahí
    const rect = element.getBoundingClientRect();

    projects[category].forEach((proj, index) => {
        const card = document.createElement('div');
        card.className = 'project-card draggable card-entering';
        
        // Posición inicial (exactamente donde está la carpeta)
        card.style.left = rect.left + 'px';
        card.style.top = rect.top + 'px';

        card.innerHTML = `<img src="${proj.img}">`;
        card.onclick = () => { if (!isDragging) openFullscreen(proj); };
        
        gallery.appendChild(card);

        // Dispersión aleatoria (Margen 15%) después de un mini delay
        setTimeout(() => {
            const margin = 0.15;
            const randomX = (window.innerWidth * margin) + (Math.random() * (window.innerWidth * (1 - margin * 2) - 200));
            const randomY = (window.innerHeight * margin) + (Math.random() * (window.innerHeight * (1 - margin * 2) - 300));
            
            card.classList.remove('card-entering');
            card.style.left = randomX + 'px';
            card.style.top = randomY + 'px';
        }, 50);
    });
}

function closeAllCards(folderElement) {
    const cards = document.querySelectorAll('.project-card');
    const rect = folderElement.getBoundingClientRect();

    cards.forEach(card => {
        // Vuelven a la carpeta
        card.style.left = rect.left + 'px';
        card.style.top = rect.top + 'px';
        card.style.transform = 'scale(0)';
        card.style.opacity = '0';
    });

    setTimeout(() => {
        document.getElementById('floating-gallery').innerHTML = '';
        folderElement.classList.remove('is-open');
        openFolderId = null;
    }, 600); // Mismo tiempo que la transición de CSS
}

function openFullscreen(proj) {
    const fs = document.getElementById('project-fullscreen');
    fs.style.display = 'flex';
    document.getElementById('project-content').innerHTML = `<img src="${proj.img}" style="height:80vh; border-radius:20px;">`;
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
            target.style.transform = `translate(${x}px, ${y}px)`;
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        },
        end() { setTimeout(() => { isDragging = false; }, 100); }
    }
});
