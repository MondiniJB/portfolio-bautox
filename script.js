let isDragging = false;
let currentCategory = null;
let highestZ = 10000; 

const content = {
    branding: [
        { 
            name: 'Logo_CEVEDE.png', 
            thumb: 'cevede_thumb.jpg', 
            gallery: ['cevede_1.jpg', 'cevede_2.jpg', 'cevede_3.jpg'] 
        },
        { 
            name: 'Verboten_ID.jpg', 
            thumb: 'verboten_thumb.jpg', 
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

// --- FUNCIÓN PARA ABRIR CARPETAS ---
function toggleProject(category, element) {
    if (isDragging) return;
    
    // Limpiar imágenes previas al cambiar de carpeta
    clearImages();
    
    const win = document.getElementById('about-window');
    const winTitle = win.querySelector('.window-title');
    const winContent = win.querySelector('.window-content');

    winTitle.innerText = `C:\\Proyectos\\${category.toUpperCase()}`;
    
    let gridHtml = `<div class="folder-grid">`;
    if (content[category] && content[category].length > 0) {
        content[category].forEach(file => {
            const projectData = JSON.stringify(file).replace(/"/g, '&quot;');
            gridHtml += `
                <div class="file-item" onclick="flyProjectImages(${projectData})">
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

// --- FUNCIÓN DE EXPLOSIÓN DE IMÁGENES (PRIORIDAD ALTA) ---
function flyProjectImages(project) {
    if (isDragging) return;
    
    const gallery = document.getElementById('floating-gallery');
    // Mantenemos las fotos anteriores o limpiamos según prefieras. 
    // Aquí limpio para que no se saturen:
    gallery.innerHTML = ''; 
    
    project.gallery.forEach(imgUrl => {
        const card = document.createElement('div');
        card.className = 'project-card draggable aero-blur'; 
        
        const x = (window.innerWidth * 0.2) + (Math.random() * (window.innerWidth * 0.4));
        const y = (window.innerHeight * 0.2) + (Math.random() * (window.innerHeight * 0.3));
        
        // Z-INDEX CRÍTICO: 50.000 para que nada las tape
        highestZ += 10;
        card.style.left = x + 'px'; 
        card.style.top = y + 'px'; 
        card.style.zIndex = 50000 + highestZ; 
        
        card.innerHTML = `<img src="${imgUrl}">`;
        card.onclick = (e) => { 
            e.stopPropagation();
            if (!isDragging) openFullscreen({img: imgUrl}); 
        };
        
        card.setAttribute('data-x', 0);
        card.setAttribute('data-y', 0);
        gallery.appendChild(card);
    });
}

// --- FUNCIONES DE CIERRE SINCRONIZADO ---
function closeAbout() { 
    document.getElementById('about-window').style.display = 'none'; 
    clearImages(); // Al cerrar la ventana, se van las fotos
}

function clearImages() {
    document.getElementById('floating-gallery').innerHTML = '';
}

function closeFromOutside(event) {
    if (event.target.id === 'desktop') { 
        closeAbout(); 
    }
}

// --- BIOGRAFÍA ---
function openAbout(event) {
    if (event) event.stopPropagation();
    if (isDragging) return;
    
    clearImages();
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
                    <p>Soy diseñador gráfico profesional y estudiante universitario.</p>
                </section>
            </div>
        </div>`;
    
    win.style.display = 'flex';
    win.setAttribute('data-x', 0);
    win.setAttribute('data-y', 0);
    win.style.transform = 'translate(0px, 0px)';
    
    highestZ++;
    win.style.zIndex = highestZ;
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
            // Si es una foto, mantenemos el rango de 50k, si es ventana el de 10k
            if (event.target.classList.contains('project-card')) {
                event.target.style.zIndex = 50000 + highestZ;
            } else {
                event.target.style.zIndex = highestZ;
            }
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
