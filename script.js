let isDragging = false;
let currentCategory = null;
let highestZ = 9000;

// --- BASE DE DATOS DE PROYECTOS ---
// Aquí es donde definís qué hay adentro de cada carpeta y qué se ve en la ventana
const content = {
    branding: [
        {
            title: 'CEVEDE',
            thumb: 'carpeta_raw.png', // Imagen que se ve en el escritorio
            html: `
                <div style="text-align:center;">
                    <h1 style="color:#ff5f56; font-size:40px;">CEVEDE</h1>
                    <p style="font-size:18px; line-height:1.6;">Centro de derivación veterinaria. Identidad visual premium.</p>
                    <img src="cevede_full.jpg" style="width:100%; border-radius:20px; margin:20px 0;">
                    <img src="cevede_mockup.jpg" style="width:100%; border-radius:20px;">
                </div>
            `
        },
        {
            title: 'VERBOTEN',
            thumb: 'user_icon.png',
            html: `<h2>VERBOTEN</h2><p>Cápsula de 7 pecados capitales.</p>`
        }
    ],
    tipo: [],
    editorial: [],
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

// ESTA FUNCIÓN CREA LAS MINIATURAS EN EL ESCRITORIO
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
    
    if (!content[category]) return;

    content[category].forEach((proj) => {
        const card = document.createElement('div');
        card.className = 'project-card draggable';
        
        const x = (window.innerWidth * 0.3) + (Math.random() * (window.innerWidth * 0.3));
        const y = (window.innerHeight * 0.3) + (Math.random() * (window.innerHeight * 0.2));
        
        highestZ++;
        card.style.left = x + 'px'; 
        card.style.top = y + 'px'; 
        card.style.zIndex = highestZ;
        
        card.innerHTML = `
            <img src="${proj.thumb}">
            <span class="label">${proj.title}</span>
        `;

        // AL HACER CLICK EN LA MINIATURA, SE ABRE LA VENTANA
        card.onclick = (e) => { 
            e.stopPropagation(); 
            if (!isDragging) openProjectWindow(proj); 
        };
        gallery.appendChild(card);
    });
}

// ESTA FUNCIÓN LLENA LA VENTANA "SOBRE MI" CON EL CONTENIDO DEL PROYECTO
function openProjectWindow(proj) {
    const win = document.getElementById('about-window');
    const winTitle = win.querySelector('.window-title');
    const winContent = win.querySelector('.window-content');

    winTitle.innerText = proj.title + ".exe";
    winContent.innerHTML = proj.html; // Aquí se inyecta el HTML que definiste arriba
    
    win.style.display = 'flex';
    win.setAttribute('data-x', 0);
    win.setAttribute('data-y', 0);
    win.style.transform = 'translate(0px, 0px)';
    
    highestZ++;
    win.style.zIndex = highestZ + 9000;
}

function openAbout(event) {
    if (event) event.stopPropagation();
    if (isDragging) return;
    
    const win = document.getElementById('about-window');
    // Volvemos a poner el contenido de tu biografía original
    win.querySelector('.window-title').innerText = "Biografía.exe";
    win.querySelector('.window-content').innerHTML = `
        <div class="bio-layout">
            <img src="user_icon.png" class="bio-photo">
            <div class="bio-text">
                <h2>¡Hola! Soy Bautox!</h2>
                <p>Soy diseñador gráfico profesional y estudiante universitario...</p>
            </div>
        </div>`;
    
    win.style.display = 'flex';
    win.setAttribute('data-x', 0);
    win.setAttribute('data-y', 0);
    win.style.transform = 'translate(0px, 0px)';
    
    highestZ++;
    win.style.zIndex = highestZ + 9000;
}

function closeAbout() { document.getElementById('about-window').style.display = 'none'; }

function closeFromOutside(event) {
    if (event.target.id === 'desktop') {
        closeAbout();
        document.getElementById('floating-gallery').innerHTML = '';
        currentCategory = null;
    }
}

// CONFIGURACIÓN DE INTERACT.JS
interact('.draggable').draggable({
    listeners: {
        start(event) {
            isDragging = true;
            highestZ++;
            event.target.style.zIndex = highestZ + 9500;
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
