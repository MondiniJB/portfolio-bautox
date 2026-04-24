let isDragging = false;
let currentCategory = null;
let highestZ = 9000;

// --- BASE DE DATOS DE PROYECTOS ---
const content = {
    branding: [
        {
            title: 'CEVEDE',
            thumb: 'thumb_cevede.png', // Imagen que se ve dentro de la carpeta
            content: `
                <h2>CEVEDE - Identidad Corporativa</h2>
                <p>Centro de derivación veterinaria. Proyecto universitario de marca premium.</p>
                <img src="cevede_full1.jpg" style="width:100%; margin-bottom:15px;">
                <img src="cevede_full2.jpg" style="width:100%;">
            `
        },
        {
            title: 'VERBOTEN',
            thumb: 'carpeta_raw.png', 
            content: `
                <h2>VERBOTEN - Urban Wear</h2>
                <p>Cápsula inspirada en los 7 pecados capitales. Estética grunge y tipografía pesada.</p>
                <img src="verboten_1.jpg" style="width:100%;">
            `
        }
    ],
    tipo: [
        {
            title: 'Libro Tipografía',
            thumb: 'carpeta_peludo.png',
            content: `<h2>Historia de la Tipografía</h2><p>Diseño editorial realizado en InDesign.</p>`
        }
    ],
    editorial: [], // Completar igual que los anteriores
    packaging: []
};

window.onload = () => {
    const items = document.querySelectorAll('.folder, .app-icon');
    const positions = [];
    const margin = 0.10;
    const minDistance = 150;

    items.forEach(item => {
        let x, y, collision;
        let attempts = 0;
        do {
            collision = false;
            x = (window.innerWidth * margin) + Math.random() * (window.innerWidth * (1 - margin * 2) - 100);
            y = (window.innerHeight * margin) + Math.random() * (window.innerHeight * (1 - margin * 2) - 120);
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

// --- FUNCIÓN PARA ABRIR CARPETA (Muestra proyectos) ---
function toggleProject(category, element) {
    if (isDragging) return;
    const gallery = document.getElementById('floating-gallery');
    
    if (currentCategory === category) { 
        gallery.innerHTML = ''; 
        currentCategory = null; 
        return; 
    }
    
    gallery.innerHTML = ''; 
    currentCategory = category;
    
    // Si la categoría no tiene proyectos cargados aún
    if (!content[category] || content[category].length === 0) return;

    content[category].forEach((proj) => {
        const card = document.createElement('div');
        card.className = 'project-card draggable';
        
        const x = (window.innerWidth * 0.2) + (Math.random() * (window.innerWidth * 0.4));
        const y = (window.innerHeight * 0.2) + (Math.random() * (window.innerHeight * 0.3));
        
        highestZ++;
        card.style.left = x + 'px'; 
        card.style.top = y + 'px'; 
        card.style.zIndex = highestZ;
        
        // Estética de "archivo" o "miniatura" de proyecto
        card.innerHTML = `
            <img src="${proj.thumb}">
            <span class="label" style="position:relative; top:5px;">${proj.title}</span>
        `;

        card.onclick = (e) => { 
            e.stopPropagation(); 
            if (!isDragging) openProjectWindow(proj); 
        };
        gallery.appendChild(card);
    });
}

// --- FUNCIÓN PARA ABRIR VENTANA DE PROYECTO ---
function openProjectWindow(proj) {
    const win = document.getElementById('about-window');
    const winTitle = win.querySelector('.window-title');
    const winContent = win.querySelector('.window-content');

    // Cambiamos el contenido de la ventana "About" por el del proyecto
    winTitle.innerText = `${proj.title}.exe`;
    winContent.innerHTML = proj.content;
    
    win.style.display = 'flex';
    win.setAttribute('data-x', 0);
    win.
