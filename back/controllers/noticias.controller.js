const db = require('../db/sqlite');
const fs = require('fs');
const path = require('path');

// Obtener todas las noticias
exports.getAll = (req, res) => {
    db.all(
        `SELECT * FROM noticias ORDER BY fecha_creacion DESC`,
        [],
        (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error al obtener noticias' });
            }
            res.json(rows);
        }
    );
};

// Crear noticia
exports.createNoticia = (req, res) => {
    let imagen_url = null;

    if (req.file) {
        imagen_url = '/uploads/' + req.file.filename;
    } else if (req.body.imagenUrl) {
        imagen_url = req.body.imagenUrl;
    }

    const { titulo, contenido, tipo } = req.body;

    db.run(
        `INSERT INTO noticias (titulo, contenido, tipo, imagen_url)
         VALUES (?, ?, ?, ?)`,
        [
            titulo,
            contenido,
            tipo === 'texto-imagen' ? 'texto-imagen' : 'imagen-texto',
            imagen_url
        ],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error al crear noticia' });
            }
            res.json({ ok: true });
        }
    );
};

// Borrar noticia
exports.deleteNoticia = (req, res) => {
    const { id } = req.params;

    db.get(
        `SELECT imagen_url FROM noticias WHERE id = ?`,
        [id],
        (err, row) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error al borrar noticia' });
            }

            if (row?.imagen_url && row.imagen_url.startsWith('/uploads/')) {
                const imgPath = path.join(__dirname, '../public', row.imagen_url);
                if (fs.existsSync(imgPath)) {
                    fs.unlinkSync(imgPath);
                }
            }

            db.run(
                `DELETE FROM noticias WHERE id = ?`,
                [id],
                () => res.json({ ok: true })
            );
        }
    );
};
