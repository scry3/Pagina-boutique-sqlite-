const formNoticia = document.getElementById('form-noticia');
const noticiasContainer = document.getElementById('noticias-admin');

const formForo = document.getElementById('form-foro');
const foroContainer = document.getElementById('foro-admin');

const logoutBtn = document.getElementById('logout-btn');

const API_URL = 'http://localhost:3000/api';

// --- CARGAR NOTICIAS ---
async function cargarNoticias() {
    const res = await fetch(`${API_URL}/noticias`, {
        credentials: 'include'
    });

    if (res.status === 401) {
        window.location.href = '../index.html';
        return;
    }

    const noticias = await res.json();

    noticiasContainer.innerHTML = '';
    noticias.forEach(n => {
        const div = document.createElement('div');
        div.classList.add('bloque-admin');
        div.innerHTML = `
            <span>${n.tipo} - ${n.titulo}</span>
            <div class="actions">
                <button class="danger" data-id="${n.id}" data-tipo="noticia">Borrar</button>
            </div>
        `;
        noticiasContainer.appendChild(div);
    });

    noticiasContainer.querySelectorAll('.danger').forEach(btn => {
        btn.addEventListener('click', async e => {
            if (confirm('¿Borrar esta noticia?')) {
                const id = e.target.dataset.id;
                await fetch(`${API_URL}/noticias/${id}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });
                cargarNoticias();
            }
        });
    });
}

// --- FORM NOTICIA ---
formNoticia.addEventListener('submit', async e => {
    e.preventDefault();
    const formData = new FormData(formNoticia);

    const res = await fetch(`${API_URL}/noticias`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
    });

    if (res.status === 401) {
        window.location.href = '../index.html';
        return;
    }

    formNoticia.reset();
    cargarNoticias();
});

// --- CARGAR FORO ---
async function cargarForo() {
    const res = await fetch(`${API_URL}/foro`, {
        credentials: 'include'
    });

    if (res.status === 401) {
        window.location.href = '../index.html';
        return;
    }

    const posts = await res.json();

    foroContainer.innerHTML = '';
    posts.forEach(p => {
        const div = document.createElement('div');
        div.classList.add('bloque-admin');
        div.innerHTML = `
            <span>${p.tipo} - ${p.titulo}</span>
            <div class="actions">
                <button class="danger" data-id="${p.id}" data-tipo="foro">Borrar</button>
            </div>
        `;
        foroContainer.appendChild(div);
    });

    foroContainer.querySelectorAll('.danger').forEach(btn => {
        btn.addEventListener('click', async e => {
            if (confirm('¿Borrar este post?')) {
                const id = e.target.dataset.id;
                await fetch(`${API_URL}/foro/${id}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });
                cargarForo();
            }
        });
    });
}

// --- FORM FORO ---
formForo.addEventListener('submit', async e => {
    e.preventDefault();
    const formData = new FormData(formForo);

    const res = await fetch(`${API_URL}/foro`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
    });

    if (res.status === 401) {
        window.location.href = '../index.html';
        return;
    }

    formForo.reset();
    cargarForo();
});

// --- LOGOUT ---
logoutBtn.addEventListener('click', async () => {
    await fetch(`${API_URL}/admin/logout`, {
        method: 'POST',
        credentials: 'include'
    });
    window.location.href = '../index.html';
});

// --- CARGAR AL INICIO ---
document.addEventListener('DOMContentLoaded', () => {
    cargarNoticias();
    cargarForo();
});
