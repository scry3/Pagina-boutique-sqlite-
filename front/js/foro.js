async function cargarPosts() {
    const contenedor = document.getElementById('foro-posts');
    const posts = await (await fetch('/api/foro')).json();
    contenedor.innerHTML = '';

    posts.forEach(post => {
        const div = document.createElement('div');
        div.classList.add('foro-post');

        // Mostrar imagen si existe
        div.innerHTML = `
            <h2>${post.titulo || ''}</h2>
            <p>${post.contenido}</p>
            ${post.imagen_url ? `<img src="${post.imagen_url}" alt="">` : ''}
            <span class="fecha">${new Date(post.fecha_creacion).toLocaleDateString()}</span>
        `;

        contenedor.appendChild(div);
    });
}

document.addEventListener('DOMContentLoaded', cargarPosts);
