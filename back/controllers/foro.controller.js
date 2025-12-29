const db = require('../db/sqlite');
const cloudinary = require('../cloudinary');

// Obtener todos los posts
exports.getAll = (req, res) => {
    db.all(
        `SELECT * FROM foro_posts ORDER BY fecha_creacion DESC`,
        [],
        (err, rows) => {
            if (err) return res.status(500).json({ error: 'Error al obtener foro' });
            res.json(rows);
        }
    );
};

// Crear post
exports.createForoPost = async (req, res) => {
    let imagen_url = null;

    if (req.file) {
        try {
            const result = await cloudinary.uploader.upload(req.file.path, { folder: "foro" });
            imagen_url = result.secure_url;
        } catch (err) {
            return res.status(500).json({ error: 'Error subiendo la imagen a Cloudinary' });
        }
    } else if (req.body.imagenUrl) {
        imagen_url = req.body.imagenUrl;
    }

    const { titulo, contenido, tipo } = req.body;

    db.run(
        `INSERT INTO foro_posts (titulo, contenido, tipo, imagen_url)
         VALUES (?, ?, ?, ?)`,
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

    db.run(
        `DELETE FROM foro_posts WHERE id = ?`,
        [id],
        (err) => {
            if (err) return res.status(500).json({ error: 'Error al borrar post' });
            res.json({ ok: true });
        }
    );
};
