async function cargarNoticias() {
    const container = document.getElementById('noticias-container');
    const noticias = await (await fetch('/api/noticias')).json();
    container.innerHTML = '';

    noticias.forEach(noticia => {
        const bloqueDiv = document.createElement('div');
        bloqueDiv.classList.add(
            'bloque',
            noticia.tipo === 'texto-imagen' ? 'texto-imagen' : 'imagen-texto'
        );

        const tituloHtml = `<h2 class="bloque-titulo">${noticia.titulo}</h2>`;

        if (noticia.tipo === 'imagen-texto') {
            bloqueDiv.innerHTML = `
                <div class="bloque-img">
                    ${noticia.imagen_url ? `<img src="${noticia.imagen_url}" alt="">` : ''}
                </div>
                <div class="bloque-texto">
                    ${tituloHtml}
                    ${noticia.contenido}
                </div>
            `;
        } else {
            bloqueDiv.innerHTML = `
                <div class="bloque-texto">
                    ${tituloHtml}
                    ${noticia.contenido}
                </div>
                <div class="bloque-img">
                    ${noticia.imagen_url ? `<img src="${noticia.imagen_url}" alt="">` : ''}
                </div>
            `;
        }

        container.appendChild(bloqueDiv);
    });
}

document.addEventListener('DOMContentLoaded', cargarNoticias);
