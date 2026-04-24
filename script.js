let isDragging = false;
let currentCategory = null;
let highestZ = 10000; 

// --- BASE DE DATOS DE PROYECTOS (Actualizada para Carrusel) ---
const content = {
    branding: [
        { 
            name: 'Logo_CEVEDE.png', 
            desc: 'Rebranding completo para Centro Veterinario de Derivación.',
            thumb: 'cevede_thumb.jpg', 
            // Poné aquí todas las fotos que quieras que giren en el carrusel
            gallery: ['cevede_1.jpg', 'cevede_2.jpg', 'cevede_3.jpg', 'cevede_4.jpg'] 
        },
        { 
            name: 'Verboten_ID.jpg', 
            desc: 'Identidad visual urbana Verboten.',
            thumb: 'verboten_thumb.jpg', 
            gallery: ['verboten_full.jpg', 'verboten_2.jpg'] 
        }
    ],
    tipo: [
        { 
            name: 'Typography_Book.pdf', 
            desc: 'Desarrollo editorial sobre la historia tipográfica.',
            thumb: 'book_thumb.jpg', 
            gallery: ['book_1.jpg', 'book_2.jpg', 'book_3.jpg'] 
        }
    ],
    editorial: [],
    packaging: []
};

// --- POSICIONAMIENTO INICIAL (Se mantiene igual) ---
window.onload = () => {
    const items = document.querySelectorAll('.folder, .app-icon');
    const positions = [];
    const margin = 0.15;
    const minDistance = 160; 

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

// --- FUNCIÓN PARA ABRIR CARPETAS (Modificada para llamar al Carrusel) ---
function toggleProject(category, element) {
    if (isDragging) return;
    
    const win = document.getElementById('about-window');
    const winTitle = win.querySelector('.window-title');
    const winContent = win.querySelector('.window-content');

    winTitle.innerText = `C:\\Proyectos\\${category.toUpperCase()}`;
    
    let galleryHtml = `<div class="project-gallery-container">`;
    if (content[category] && content[category].length > 0) {
        content[category].forEach(file => {
            const projectData = JSON.stringify(file).replace(/"/g, '&quot;');
            // Ahora al hacer click llamamos a openInfiniteGallery
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
        galleryHtml += `<p style="opacity:0.3; text-align:center; padding: 40px; font-size:14px;">Carpeta vacía</p>`;
    }
    galleryHtml += `</div>`;
    
    winContent.innerHTML = galleryHtml;
    win.style.display = 'flex';
    win.setAttribute('data-x', 0);
    win.setAttribute('data-y', 0);
    win.style.transform = 'translate(0px, 0px)';
    
    highestZ++;
    win.style.zIndex = highestZ; 
}

// --- LÓGICA DEL CARRUSEL INFINITO ---
let scrollPos = 0;
let autoScrollSpeed = 0.6; // Velocidad de giro
let animationId;

function openInfiniteGallery(project) {
    const fs = document.getElementById('project-fullscreen');
    const contentArea = document.getElementById('project-content');
    
    // Creamos el track del carrusel
    const track = document.createElement('div');
    track.className = 'carousel-track draggable';
    
    // Triplicamos las imágenes para el efecto infinito
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

    // Hacer que el carrusel sea arrastrable lateralmente
    interact(track).draggable({
        listeners: {
            move(event) {
                scrollPos += event.dx;
                track.style.transform = `translateX(${scrollPos}px)`;
            }
        }
    });
}

function startAutoScroll(track) {
    function step() {
        scrollPos -= autoScrollSpeed; 
        
        // Si llegamos a un tercio del recorrido, reseteamos al centro para que sea infinito
        if (Math.abs(scrollPos) >= track.scrollWidth / 3) {
            scrollPos = 0;
        }
        
        track.style.transform = `translateX(${scrollPos}px)`;
        animationId = requestAnimationFrame(step);
    }
    animationId = requestAnimationFrame(step);
}

// --- BIOGRAFÍA (Se mantiene igual) ---
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
            <p class="bio-intro-ref">Soy diseñador gráfico profesional y estudiante universitario...</p>
            <div class="bio-divider"></div>
            <div class="bio-section-ref">
                <h2>Perfil Profesional</h2>
                <p>Me especializo en crear identidades visuales con fundamentos teóricos sólidos...</p>
            </div>
            <div class="bio-divider"></div>
            <p style="opacity:0.5; font-size:14px;">Bautox Portfolio OS v1.0 | Lomas de Zamora, Argentina</p>
        </div>
    `;
    win.style.display = 'flex';
    win.setAttribute('data-x', 0);
    win.setAttribute('data-y', 0);
    win.style.transform = 'translate(0px, 0px)';
    highestZ++;
    win.style.zIndex = highestZ;
}

function closeAbout() { document.getElementById('about-window').style.display = 'none'; }

function closeFromOutside(event) {
    if (event.target.id === 'desktop') { closeAbout(); }
}

function closeFullscreen() {
    cancelAnimationFrame(animationId);
    document.getElementById('project-fullscreen').style.display = 'none';
}

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
