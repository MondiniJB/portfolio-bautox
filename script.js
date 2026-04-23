let isDragging = false;
let currentCategory = null;
let highestZ = 9000;

const content = {
    tipo: [{img: 'https://picsum.photos/600/800?random=101'}, {img: 'https://picsum.photos/600/800?random=102'}],
    branding: [{img: 'https://picsum.photos/600/800?random=201'}, {img: 'https://picsum.photos/600/800?random=202'}],
    editorial: [{img: 'https://picsum.photos/600/800?random=301'}],
    packaging: [{img: 'https://picsum.photos/600/800?random=401'}],
    social: [{img: 'https://picsum.photos/600/800?random=501'}]
};

window.onload = () => {
    document.querySelectorAll('.folder, .app-icon').forEach(f => {
        const x = Math.random() * (window.innerWidth - 150) + 50;
        const y = Math.random() * (window.innerHeight - 150) + 50;
        f.style.left = x + 'px';
        f.style.top = y + 'px';
        f.setAttribute('data-x', 0);
        f.setAttribute('data-y', 0);
    });
};

function toggleProject(category, element) {
    if (isDragging) return;
    const gallery = document.getElementById('floating-gallery');
    if (currentCategory === category) { gallery.innerHTML = ''; currentCategory = null; return; }
    gallery.innerHTML = ''; currentCategory = category;
    
    content[category].forEach((proj) => {
        const card = document.createElement('div');
        card.className = 'project-card draggable';
        
        const x = (window.innerWidth * 0.1) + (Math.random() * (window.innerWidth * 0.5));
        const y = (window.innerHeight * 0.1) + (Math.random() * (window.innerHeight * 0.4));
        
        highestZ++;
        card.style.left = x + 'px'; 
        card.style.top = y + 'px'; 
        card.style.zIndex = highestZ;

        card.innerHTML = `<img src="${proj.img}">`;
        card.onclick = (e) => { e.stopPropagation(); if (!isDragging) openFullscreen(proj); };
        gallery.appendChild(card);
    });
}

function openAbout(event) {
    if (event) event.stopPropagation();
    if (isDragging) return;
    const win = document.getElementById('about-window');
    win.style.display = 'flex';
    highestZ++;
    win.style.zIndex = highestZ + 100;
}

function closeAbout() { document.getElementById('about-window').style.display = 'none'; }

function closeFromOutside(event) {
    if (event.target.id === 'desktop') {
        closeAbout();
        document.getElementById('floating-gallery').innerHTML = '';
        currentCategory = null;
    }
}

function openFullscreen(proj) {
    const fs = document.getElementById('project-fullscreen');
    fs.style.display = 'flex';
    document.getElementById('project-content').innerHTML = `<img src="${proj.img}">`;
}
function closeFullscreen() { document.getElementById('project-fullscreen').style.display = 'none'; }

interact('.draggable').draggable({
    listeners: {
        start(event) { 
            isDragging = true; 
            highestZ++;
            event.target.style.zIndex = highestZ + 500;
        },
        move(event) {
            const target = event.target;
            const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
            const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
            
            if (target.classList.contains('aero-window')) {
                target.style.transform = `translate(${x}px, ${y}px)`;
            } else {
                target.style.transform = `translate(${x}px, ${y}px)`;
            }
            
            target.setAttribute('data-x', x); 
            target.setAttribute('data-y', y);
        },
        end() { setTimeout(() => { isDragging = false; }, 50); }
    }
});
