const db = require('../db/sqlite');
const cloudinary = require('../cloudinary');

// Obtener todas las noticias
exports.getAll = (req, res) => {
    db.all(
        `SELECT * FROM noticias ORDER BY fecha_creacion DESC`,
        [],
        (err, rows) => {
            if (err) return res.status(500).json({ error: 'Error al obtener noticias' });
            res.json(rows);
        }
    );
};

// Crear noticia
exports.createNoticia = async (req, res) => {
    let imagen_url = null;

    if (req.file) {
        try {
            const result = await cloudinary.uploader.upload(req.file.path, { folder: "noticias" });
            imagen_url = result.secure_url;
        } catch (err) {
            return res.status(500).json({ error: 'Error subiendo la imagen a Cloudinary' });
        }
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
            if (err) return res.status(500).json({ error: 'Error al crear noticia' });
            res.json({ ok: true });
        }
    );
};

// Borrar noticia
exports.deleteNoticia = (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM noticias WHERE id = ?`, [id], (err) => {
        if (err) return res.status(500).json({ error: 'Error al borrar noticia' });
        res.json({ ok: true });
    });
};
