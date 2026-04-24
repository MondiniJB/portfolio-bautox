let isDragging = false;
let isDraggingCarousel = false;
let highestZ = 10000;
let scrollPos = 0;
let autoScrollSpeed = 0.6;
let animationId;

// --- BASE DE DATOS CON IMÁGENES DE STOCK PARA PRUEBAS ---
const content = {
    branding: [
        { 
            name: 'Logo_CEVEDE.png', 
            desc: 'Rebranding Centro Veterinario.',
            thumb: 'https://picsum.photos/200/200?random=1', 
            gallery: [
                'https://picsum.photos/800/600?random=11', 'https://picsum.photos/800/1000?random=12',
                'https://picsum.photos/1000/800?random=13', 'https://picsum.photos/800/800?random=14',
                'https://picsum.photos/600/800?random=15', 'https://picsum.photos/900/600?random=16'
            ] 
        },
        { 
            name: 'Verboten_ID.jpg', 
            desc: 'Cápsula Verboten Urban.',
            thumb: 'https://picsum.photos/200/200?random=2', 
            gallery: [
                'https://picsum.photos/700/1000?random=21', 'https://picsum.photos/1000/700?random=22',
                'https://picsum.photos/800/800?random=23', 'https://picsum.photos/600/900?random=24'
            ] 
        }
    ],
    tipo: [
        { 
            name: 'Typography_Book.pdf', 
            desc: 'Diseño Editorial.',
            thumb: 'https://picsum.photos/200/200?random=3', 
            gallery: ['https://picsum.photos/800/1200?random=31', 'https://picsum.photos/1200/800?random=32'] 
        }
    ],
    editorial: [], packaging: []
};

// --- POSICIONAMIENTO INICIAL ---
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

// --- ABRIR CARPETAS ---
function toggleProject(category) {
    if (isDragging) return;
    const win = document.getElementById('about-window');
    const winContent = win.querySelector('.window-content');
    win.querySelector('.window-title').innerText = `C:\\Proyectos\\${category.toUpperCase()}`;
    
    let gridHtml = `<div class="project-gallery-container">`;
    if (content[category] && content[category].length > 0) {
        content[category].forEach(file => {
            const projectData = JSON.stringify(file).replace(/"/g, '&quot;');
            gridHtml += `
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
        gridHtml += `<p style="opacity:0.3; text-align:center; padding: 40px;">Carpeta vacía</p>`;
    }
    gridHtml += `</div>`;
    winContent.innerHTML = gridHtml;
    win.style.display = 'flex';
    highestZ++;
    win.style.zIndex = highestZ; 
}

// --- LÓGICA DEL CARRUSEL INFINITO (2 FILAS) ---
function openInfiniteGallery(project) {
    const fs = document.getElementById('project-fullscreen');
    const contentArea = document.getElementById('project-content');
    
    const track = document.createElement('div');
    track.className = 'carousel-track draggable-carousel';
    
    // Triplicamos para efecto loop
    const fullGallery = [...project.gallery, ...project.gallery, ...project.gallery];
    
    // Agrupar de a 2 para las dos filas
    let itemsHtml = '';
    for (let i = 0; i < fullGallery.length; i += 2) {
        itemsHtml += `
            <div class="carousel-item">
                <img src="${fullGallery[i]}">
                ${fullGallery[i+1] ? `<img src="${fullGallery[i+1]}">` : ''}
            </div>
        `;
    }
    
    track.innerHTML = itemsHtml;
    contentArea.innerHTML = '';
    contentArea.appendChild(track);
    fs.style.display = 'block';

    scrollPos = 0;
    isDraggingCarousel = false;
    startAutoScroll(track);

    interact('.draggable-carousel').draggable({
        listeners: {
            start() { isDraggingCarousel = true; },
            move(event) {
                scrollPos += event.dx;
                track.style.transform = `translateX(${scrollPos}px)`;
            },
            end() { 
                setTimeout(() => { isDraggingCarousel = false; }, 150); 
            }
        }
    });
}

function startAutoScroll(track) {
    function step() {
        if (!isDraggingCarousel) {
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

// --- MANEJO DE CIERRE ---
function handleFullscreenClick(event) {
    // Si el usuario estaba arrastrando, NO cerramos la ventana
    if (isDraggingCarousel) return;
    closeFullscreen();
}

function closeFullscreen() {
    cancelAnimationFrame(animationId);
    document.getElementById('project-fullscreen').style.display = 'none';
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
            <p class="bio-intro-ref">Diseñador Gráfico | Estudiante | Tech Enthusiast</p>
            <div class="bio-divider"></div>
            <div class="bio-section-ref">
                <h2>Perfil</h2>
                <p>Me especializo en Identidad Visual y Diseño Editorial.</p>
            </div>
        </div>`;
    win.style.display = 'flex';
    highestZ++;
    win.style.zIndex = highestZ;
}

function closeAbout() { document.getElementById('about-window').style.display = 'none'; }
function closeFromOutside(event) { if (event.target.id === 'desktop') { closeAbout(); } }

// --- ARRASTRE DE VENTANAS E ICONOS ---
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
