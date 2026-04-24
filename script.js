let isDragging = false;
let currentCategory = null;
let highestZ = 10000;

// --- BASE DE DATOS DE PROYECTOS (Solo URLs de imágenes) ---
// Aquí definís qué fotos 'vuelan' por el escritorio para cada proyecto.
const content = {
    branding: [
        { 
            name: 'Logo_CEVEDE.png', 
            thumb: 'cevede_thumb.jpg', // Icono que se ve en la ventana
            gallery: ['cevede_1.jpg', 'cevede_2.jpg', 'cevede_3.jpg'] // Fotos que flotan
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
    editorial: [], // Completar siguiendo el mismo formato
    packaging: []
};

// --- POSICIONAMIENTO INICIAL DE ICONOS EN EL ESCRITORIO (110px) ---
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

// --- FUNCIÓN PARA ABRIR CARPETAS (Explorador de Proyectos) ---
function toggleProject(category, element) {
    if (isDragging) return;
    
    // Al abrir una carpeta, limpiamos cualquier foto flotante de un proyecto anterior
    const gallery = document.getElementById('floating-gallery');
    gallery.innerHTML = '';
    
    const win = document.getElementById('about-window');
    const winTitle = win.querySelector('.window-title');
    const winContent = win.querySelector('.window-content');

    winTitle.innerText = `C:\\Proyectos\\${category.toUpperCase()}`;
    
    let gridHtml = `<div class="folder-grid">`;
    if (content[category] && content[category].length > 0) {
        content[category].forEach(file => {
            // Pasamos los datos del proyecto a la nueva función de "volado"
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

// --- FUNCIÓN QUE HACE FLOTAR LAS IMÁGENES SOBRE EL ESCRITORIO ---
function flyProjectImages(project) {
    if (isDragging) return;
    
    const gallery = document.getElementById('floating-gallery');
    // Limpiamos fotos de proyectos anteriores si las hubiera
    gallery.innerHTML = ''; 
    
    // Generamos cada imagen flotante (project-card)
    project.gallery.forEach(imgUrl => {
        const card = document.createElement('div');
        // Usamos la clase '.project-card draggable' para recuperar la estética original
        card.className = 'project-card draggable aero-blur'; 
        
        // Posicionamiento aleatorio en el escritorio (reutilizando tu lógica original)
        const margin = 0.1;
        const x = (window.innerWidth * margin) + (Math.random() * (window.innerWidth * 0.5));
        const y = (window.innerHeight * margin) + (Math.random() * (window.innerHeight * 0.4));
        
        highestZ++;
        card.style.left = x + 'px'; 
        card.style.top = y + 'px'; 
        card.style.zIndex = highestZ;
        
        // Insertamos la imagen y configuramos el fullscreen al clickear
        card.innerHTML = `<img src="${imgUrl}">`;
        card.onclick = (e) => { 
            e.stopPropagation(); // Evita que se cierre al tocar la imagen
            if (!isDragging) openFullscreen({img: imgUrl}); 
        };
        
        // Hacemos que sea arrastrable por interact.js (se activa por la clase .draggable)
        card.setAttribute('data-x', 0);
        card.setAttribute('data-y', 0);
        
        gallery.appendChild(card);
    });
}

// --- FUNCIÓN PARA LA BIOGRAFÍA (SCROLLEABLE) ---
function openAbout(event) {
    if (event) event.stopPropagation();
    if (isDragging) return;
    
    // Al abrir 'Sobre Mí', también limpiamos fotos flotantes
    document.getElementById('floating-gallery').innerHTML = '';
    
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

function closeAbout() { document.getElementById('about-window').style.display = 'none'; }

// Cerrar al tocar el escritorio
function closeFromOutside(event) {
    if (event.target.id === 'desktop') { 
        closeAbout(); 
        // También limpiamos las fotos flotantes al tocar el fondo
        document.getElementById('floating-gallery').innerHTML = '';
    }
}

// Fullscreen (para la vista de una sola imagen)
function openFullscreen(proj) {
    const fs = document.getElementById('project-fullscreen');
    fs.style.display = 'flex';
    document.getElementById('project-content').innerHTML = `<img src="${proj.img}">`;
}
function closeFullscreen() { document.getElementById('project-fullscreen').style.display = 'none'; }

// --- CONFIGURACIÓN DE ARRASTRE (INTERACT.JS) ---
interact('.draggable').draggable({
    listeners: {
        start(event) {
            isDragging = true;
            highestZ++;
            // Traer al frente al arrastrar
            if (event.target.classList.contains('project-card')) {
                event.target.style.zIndex = highestZ + 9500; // Fotos arriba
            } else {
                event.target.style.zIndex = highestZ + 9000; // Ventanas arriba
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
