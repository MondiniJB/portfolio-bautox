let isDragging = false;
let highestZ = 10000; 

// --- BASE DE DATOS CON IMÁGENES DE STOCK (Picsum) ---
const content = {
    branding: [
        { 
            name: 'Logo_CEVEDE.png', 
            desc: 'Rebranding completo - Centro Veterinario.',
            thumb: 'https://picsum.photos/200/200?random=1', 
            gallery: [
                'https://picsum.photos/800/600?random=11', // Horizontal
                'https://picsum.photos/400/800?random=12', // Vertical
                'https://picsum.photos/800/800?random=13', // Cuadrada
                'https://picsum.photos/1200/800?random=14' // Wide
            ] 
        },
        { 
            name: 'Verboten_ID.jpg', 
            desc: 'Identidad visual urbana Verboten.',
            thumb: 'https://picsum.photos/200/200?random=2', 
            gallery: [
                'https://picsum.photos/600/800?random=21',
                'https://picsum.photos/900/600?random=22',
                'https://picsum.photos/800/1200?random=23'
            ] 
        }
    ],
    tipo: [
        { 
            name: 'Typography_Book.pdf', 
            desc: 'Desarrollo editorial tipográfico.',
            thumb: 'https://picsum.photos/200/200?random=3', 
            gallery: [
                'https://picsum.photos/1000/700?random=31',
                'https://picsum.photos/700/1000?random=32'
            ] 
        }
    ],
    editorial: [],
    packaging: []
};

window.onload = () => {
    const items = document.querySelectorAll('.folder, .app-icon');
    const positions = [];
    const margin = 0.15;
    const minDistance = 180; 

    items.forEach(item => {
        let x, y, collision;
        let attempts = 0;
        do {
            collision = false;
            x = (window.innerWidth * margin) + Math.random() * (window.innerWidth * (1 - margin * 2) - 110);
            y = (window.innerHeight * margin) + Math.random() * (window.innerHeight * (1 - margin * 2) - 130);
            for (let pos of positions) {
                const dist = Math.hypot(x - pos.x, y - pos.y);
                if (dist < minDistance) { collision = true; break; }
            }
            attempts++;
        } while (collision && attempts < 100);

        positions.push({ x, y });
        item.style.left = x + 'px';
        item.style.top = y + 'px';
        item.setAttribute('data-x', 0);
        item.setAttribute('data-y', 0);
    });
};

function toggleProject(category) {
    if (isDragging) return;
    const win = document.getElementById('about-window');
    const winContent = win.querySelector('.window-content');
    win.querySelector('.window-title').innerText = `C:\\Proyectos\\${category.toUpperCase()}`;
    
    let galleryHtml = `<div class="project-gallery-container">`;
    if (content[category] && content[category].length > 0) {
        content[category].forEach(file => {
            const projectData = JSON.stringify(file).replace(/"/g, '&quot;');
            galleryHtml += `
                <div class="project-file-item" onclick="openInfiniteGallery(${projectData})">
                    <div class="project-file-icon" style="background-image: url('${file.thumb}')"></div>
                    <div class="project-file-info">
                        <div class="project-file-name">${file.name}</div>
                        <div class="project-file-desc">${file.desc}</div>
                    </div>
                </div>
            `;
        });
    } else {
        galleryHtml += `<p style="opacity:0.3; text-align:center; padding: 40px;">Carpeta vacía</p>`;
    }
    galleryHtml += `</div>`;
    winContent.innerHTML = galleryHtml;
    win.style.display = 'flex';
    highestZ++;
    win.style.zIndex = highestZ; 
}

// --- LÓGICA DEL CARRUSEL INFINITO CORREGIDA ---
let scrollPos = 0;
let autoScrollSpeed = 0.6;
let animationId;
let isUserDraggingCarousel = false;

function openInfiniteGallery(project) {
    const fs = document.getElementById('project-fullscreen');
    const contentArea = document.getElementById('project-content');
    
    const track = document.createElement('div');
    track.className = 'carousel-track draggable-carousel'; // Nueva clase específica
    
    const fullGallery = [...project.gallery, ...project.gallery, ...project.gallery];
    
    track.innerHTML = fullGallery.map(img => `
        <div class="carousel-item">
            <img src="${img}">
        </div>
    `).join('');

    contentArea.innerHTML = '';
    contentArea.appendChild(track);
    fs.style.display = 'block';

    scrollPos = 0;
    startAutoScroll(track);

    // --- ARRASTRE DEL CARRUSEL ---
    interact('.draggable-carousel').draggable({
        listeners: {
            start() { 
                isUserDraggingCarousel = true; 
            },
            move(event) {
                scrollPos += event.dx;
                track.style.transform = `translateX(${scrollPos}px)`;
            },
            end() { 
                isUserDraggingCarousel = false; 
            }
        }
    });
}

function startAutoScroll(track) {
    function step() {
        if (!isUserDraggingCarousel) {
            scrollPos -= autoScrollSpeed; 
            if (Math.abs(scrollPos) >= track.scrollWidth / 3) {
                scrollPos = 0;
            }
            track.style.transform = `translateX(${scrollPos}px)`;
        }
        animationId = requestAnimationFrame(step);
    }
    animationId = requestAnimationFrame(step);
}

function openAbout(event) {
    if (event) event.stopPropagation();
    if (isDragging) return;
    const win = document.getElementById('about-window');
    const winContent = win.querySelector('.window-content');
    win.querySelector('.window-title').innerText = "Biografía.exe";
    winContent.innerHTML = `
        <div class="bio-container-scrolleable">
            <img src="user_icon.png" class="bio-photo-large">
            <h1 class="bio-title-ref">¡Hola! Soy Bautox!</h1>
            <p class="bio-intro-ref">Diseñador gráfico y apasionado por el hardware.</p>
        </div>
    `;
    win.style.display = 'flex';
    highestZ++;
    win.style.zIndex = highestZ;
}

function closeAbout() { document.getElementById('about-window').style.display = 'none'; }
function closeFromOutside(event) { if (event.target.id === 'desktop') { closeAbout(); } }

function closeFullscreen() {
    cancelAnimationFrame(animationId);
    document.getElementById('project-fullscreen').style.display = 'none';
}

// --- ARRASTRE DE VENTANAS E ICONOS (Global) ---
interact('.draggable').draggable({
    listeners: {
        start(event) {
            isDragging = true;
            highestZ++;
            event.target.style.zIndex = highestZ;
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
