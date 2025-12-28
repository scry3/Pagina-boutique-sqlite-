const db = require('../db/sqlite');
const fs = require('fs');
const path = require('path');

// Obtener todos los posts
exports.getAll = (req, res) => {
    db.all(`SELECT * FROM foro_posts ORDER BY fecha_creacion DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Error al obtener foro' });
        res.json(rows);
    });
};

// Crear post
exports.createForoPost = (req, res) => {
    let imagen_url = null;

    if (req.file) {
        imagen_url = '/uploads/' + req.file.filename;
    } else if (req.body.imagenUrl) {
        imagen_url = req.body.imagenUrl;
    }

    const { titulo, contenido, tipo } = req.body;

    db.run(
        `INSERT INTO foro_posts (titulo, contenido, tipo, imagen_url) VALUES (?, ?, ?, ?)`,
        [titulo, contenido, tipo || 'imagen-texto', imagen_url],
        (err) => {
            if (err) return res.status(500).json({ error: 'Error al crear post' });
            res.json({ ok: true });
        }
    );
};

// Borrar post
exports.deleteForoPost = (req, res) => {
    const { id } = req.params;

    db.get(`SELECT imagen_url FROM foro_posts WHERE id = ?`, [id], (err, row) => {
        if (row && row.imagen_url && row.imagen_url.startsWith('/uploads/')) {
            fs.unlinkSync(path.join(__dirname, '../public', row.imagen_url));
        }
        db.run(`DELETE FROM foro_posts WHERE id = ?`, [id], () => res.json({ ok: true }));
    });
};
