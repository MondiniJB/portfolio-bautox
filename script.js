let isDragging = false;
let currentCategory = null;
let highestZ = 10000;

// --- BASE DE DATOS DE PROYECTOS ---
// Aquí es donde cargas tus trabajos. 
// 'thumb' es el icono que se ve en la ventana.
// 'gallery' es la lista de fotos que se abren en grande (pueden ser varias).
const content = {
    branding: [
        { 
            name: 'Logo_CEVEDE.png', 
            thumb: 'cevede_thumb.jpg', 
            gallery: ['cevede_1.jpg', 'cevede_2.jpg'] 
        },
        { 
            name: 'Verboten_ID.jpg', 
            thumb: 'carpeta_raw.png', 
            gallery: ['verboten_full.jpg'] 
        }
    ],
    tipo: [
        { 
            name: 'Typography_Book.pdf', 
            thumb: 'carpeta_peludo.png', 
            gallery: ['libro_1.jpg', 'libro_2.jpg'] 
        }
    ],
    editorial: [], // Agregar proyectos aquí siguiendo el mismo formato
    packaging: []
};

// --- POSICIONAMIENTO INICIAL DE ICONOS EN EL ESCRITORIO ---
window.onload = () => {
    const items = document.querySelectorAll('.folder, .app-icon');
    const positions = [];
    const margin = 0.15;
    const minDistance = 160; // Distancia de seguridad para iconos de 110px

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

// --- FUNCIÓN PARA ABRIR CARPETAS (Explorador de Proyectos) ---
function toggleProject(category, element) {
    if (isDragging) return;
    
    const win = document.getElementById('about-window');
    const winTitle = win.querySelector('.window-title');
    const winContent = win.querySelector('.window-content');

    winTitle.innerText = `C:\\Proyectos\\${category.toUpperCase()}`;
    
    let gridHtml = `<div class="folder-grid">`;
    if (content[category] && content[category].length > 0) {
        content[category].forEach(file => {
            // Convertimos el objeto a string para pasarlo por la función
            const projectData = JSON.stringify(file).replace(/"/g, '&quot;');
            gridHtml += `
                <div class="file-item" onclick="openProjectGallery(${projectData})">
                    <div class="file-icon" style="background-image: url('${file.thumb}')"></div>
                    <span class="file-label">${file.name}</span>
                </div>
            `;
        });
    } else {
        gridHtml += `<p style="opacity:0.5; grid-column: 1/-1; text-align:center; padding-top:20px;">Carpeta vacía</p>`;
    }
    gridHtml += `</div>`;
    
    winContent.innerHTML = gridHtml;
    
    win.style.display = 'flex';
    win.setAttribute('data-x', 0);
    win.setAttribute('data-y', 0);
    win.style.transform = 'translate(0px, 0px)';
    
    highestZ++;
    win.style.zIndex = highestZ;
}

// --- FUNCIÓN PARA ABRIR LA BIOGRAFÍA (SCROLLEABLE) ---
function openAbout(event) {
    if (event) event.stopPropagation();
    if (isDragging) return;
    
    const win = document.getElementById('about-window');
    const winContent = win.querySelector('.window-content');
    
    win.querySelector('.window-title').innerText = "Biografía.exe";
    
    winContent.innerHTML = `
        <div class="bio-container">
            <div class="bio-header">
                <img src="user_icon.png" class="bio-photo-circle">
                <h1>¡Hola! Soy Bautox!</h1>
            </div>
            <div class="bio-body">
                <section>
                    <h3>Perfil Profesional</h3>
                    <p>Soy diseñador gráfico profesional y estudiante universitario. Este espacio es mi escritorio interactivo donde conviven mis proyectos y mi pasión por el hardware.</p>
                </section>
                <section>
                    <h3>Mi Enfoque</h3>
                    <p>Me especializo en crear identidades visuales con fundamentos teóricos sólidos, aplicando grillas tipográficas y sistemas de signos funcionales.</p>
                </section>
                <section>
                    <h3>Contacto</h3>
                    <p>¡Explorá las carpetas para ver mis trabajos de Branding, Editorial y Packaging!</p>
                </section>
            </div>
        </div>
    `;
    
    win.style.display = 'flex';
    win.setAttribute('data-x', 0);
    win.setAttribute('data-y', 0);
    win.style.transform = 'translate(0px, 0px)';
    
    highestZ++;
    win.style.zIndex = highestZ;
}

// --- FUNCIÓN PARA ABRIR GALERÍA DE IMÁGENES ---
function openProjectGallery(project) {
    const fs = document.getElementById('project-fullscreen');
    const container = document.getElementById('project-content');
    
    container.innerHTML = '';
    let galleryHtml = `<div class="gallery-scroll">`;
    project.gallery.forEach(imgUrl => {
        galleryHtml += `<img src="${imgUrl}" class="gallery-img">`;
    });
    galleryHtml += `</div>`;
    
    container.innerHTML = galleryHtml;
    fs.style.display = 'flex';
}

function closeAbout() { document.getElementById('about-window').style.display = 'none'; }

function closeFromOutside(event) {
    if (event.target.id === 'desktop') { closeAbout(); }
}

function closeFullscreen() { document.getElementById('project-fullscreen').style.display = 'none'; }

// --- CONFIGURACIÓN DE ARRASTRE (INTERACT.JS) ---
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
