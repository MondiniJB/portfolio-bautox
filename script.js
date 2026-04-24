let isDragging = false;
let currentCategory = null;
let highestZ = 10000; 

// --- BASE DE DATOS DE PROYECTOS (Con descripciones) ---
const content = {
    branding: [
        { 
            name: 'Logo_CEVEDE.png', 
            desc: 'Rebranding completo para Centro Veterinario de Derivación.',
            thumb: 'cevede_thumb.jpg', 
            img: 'cevede_full.jpg' 
        },
        { 
            name: 'Verboten_ID.jpg', 
            desc: 'Identidad visual urbana para cápsula de indumentaria Verboten.',
            thumb: 'verboten_thumb.jpg', 
            img: 'verboten_full.jpg' 
        }
    ],
    tipo: [
        { 
            name: 'Typography_Book.pdf', 
            desc: 'Desarrollo editorial sobre la historia y grilla tipográfica.',
            thumb: 'book_thumb.jpg', 
            img: 'book_full.jpg' 
        }
    ],
    editorial: [],
    packaging: []
};

// --- POSICIONAMIENTO INICIAL ---
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

// --- FUNCIÓN PARA ABRIR CARPETAS COMO GALERÍAS VERTICALES ---
function toggleProject(category, element) {
    if (isDragging) return;
    
    const win = document.getElementById('about-window');
    const winTitle = win.querySelector('.window-title');
    const winContent = win.querySelector('.window-content');

    winTitle.innerText = `C:\\Proyectos\\${category.toUpperCase()}`;
    
    // Generar layout vertical de proyectos
    let galleryHtml = `<div class="project-gallery-container">`;
    if (content[category] && content[category].length > 0) {
        content[category].forEach(file => {
            const projectData = JSON.stringify(file).replace(/"/g, '&quot;');
            galleryHtml += `
                <div class="project-file-item" onclick="openFullscreen(${projectData})">
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

// --- FUNCIÓN PARA LA BIOGRAFÍA (RELLENA Y CORREGIDA) ---
function openAbout(event) {
    if (event) event.stopPropagation();
    if (isDragging) return;
    
    const win = document.getElementById('about-window');
    const winContent = win.querySelector('.window-content');
    
    win.querySelector('.window-title').innerText = "Biografía.exe";
    
    // HTML Completo de la biografía, calcando el diseño de referencia
    winContent.innerHTML = `
        <div class="bio-container-scrolleable">
            <img src="user_icon.png" class="bio-photo-large">
            
            <h1 class="bio-title-ref">¡Hola! Soy Bautox!</h1>
            <p class="bio-intro-ref">Soy diseñador gráfico profesional y estudiante universitario. Este espacio es mi escritorio interactivo donde conviven la semiótica visual y mi pasión por el hardware.</p>
            
            <div class="bio-divider"></div>
            
            <div class="bio-section-ref">
                <h2>Perfil Profesional</h2>
                <p>Me especializo en crear identidades visuales con fundamentos teóricos sólidos, aplicando grillas tipográficas y sistemas de signos funcionales.</p>
                <p>Mi enfoque combina la precisión técnica con la creatividad visual, buscando siempre soluciones que comuniquen con claridad y eficiencia.</p>
            </div>
            
            <div class="bio-section-ref">
                <h2>Experiencia y Pasiones</h2>
                <p>A lo largo de mi carrera universitaria, he explorado diversas ramas del diseño, desde el packaging funcional hasta la maquetación editorial compleja.</p>
                <p>Mi portfolio refleja esa dualidad: la atención al detalle del diseño de hardware y la expresividad del Branding contemporáneo.</p>
                <p>¡Explorá las carpetas en el escritorio para conocer mis trabajos en Branding, Editorial y Packaging!</p>
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
    if (event.target.id === 'desktop') { 
        closeAbout(); 
    }
}

function openFullscreen(proj) {
    const fs = document.getElementById('project-fullscreen');
    fs.style.display = 'flex';
    document.getElementById('project-content').innerHTML = `<img src="${proj.img}">`;
}
function closeFullscreen() { document.getElementById('project-fullscreen').style.display = 'none'; }

// --- ARRASTRE ---
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
