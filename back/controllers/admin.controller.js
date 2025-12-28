const db = require('../db/sqlite');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

// --- LOGIN ADMIN ---
exports.login = (req, res) => {
    const { username, password } = req.body;

    db.get(
        `SELECT * FROM admin WHERE username = ?`,
        [username],
        async (err, admin) => {
            if (err) return res.status(500).json({ error: 'Error de servidor' });
            if (!admin) return res.status(401).json({ error: 'Credenciales inválidas' });

            const ok = await bcrypt.compare(password, admin.password_hash);
            if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });

            // Guardar sesión
            req.session.admin = { id: admin.id, username: admin.username };
            res.json({ ok: true });
        }
    );
};

// --- LOGOUT ADMIN ---
exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.json({ ok: true });
    });
};

// --- CREAR NOTICIA ---
exports.createNoticia = (req, res) => {
    console.log(req.file);
    console.log(req.body);
    let imagen_url = null;

    if (req.file) {
        imagen_url = '/uploads/' + req.file.filename; // ruta pública
    } else if (req.body.imagenUrl) {
        imagen_url = req.body.imagenUrl;
    }

    const { titulo, contenido } = req.body;
    
    console.log('Datos recibidos para crear noticia:', { titulo, contenido, imagen_url });

    db.run(
        `INSERT INTO noticias (titulo, contenido, imagen_url) VALUES (?, ?, ?)`,
        [titulo, contenido, imagen_url],
        (err) => {
            if (err) return res.status(500).json({ error: 'Error al crear noticia' });
            res.json({ ok: true });
        }
    );
};

// --- CREAR POST FORO ---
exports.createForoPost = (req, res) => {
    let imagen_url = null;

    if (req.file) {
        imagen_url = '/uploads/' + req.file.filename;
    } else if (req.body.imagenUrl) {
        imagen_url = req.body.imagenUrl;
    }

    const { titulo, contenido } = req.body;

    db.run(
        `INSERT INTO foro_posts (titulo, contenido, imagen_url) VALUES (?, ?, ?)`,
        [titulo, contenido, imagen_url],
        (err) => {
            if (err) return res.status(500).json({ error: 'Error al crear post' });
            res.json({ ok: true });
        }
    );
};

// --- ELIMINAR NOTICIA ---
exports.deleteNoticia = (req, res) => {
    const { id } = req.params;
    db.get(`SELECT imagen_url FROM noticias WHERE id = ?`, [id], (err, row) => {
        if (row && row.imagen_url && row.imagen_url.startsWith('/uploads/')) {
            fs.unlinkSync(path.join(__dirname, '../public', row.imagen_url));
        }
        db.run(`DELETE FROM noticias WHERE id = ?`, [id], () => res.json({ ok: true }));
    });
};

// --- ELIMINAR POST FORO ---
exports.deleteForoPost = (req, res) => {
    const { id } = req.params;
    db.get(`SELECT imagen_url FROM foro_posts WHERE id = ?`, [id], (err, row) => {
        if (row && row.imagen_url && row.imagen_url.startsWith('/uploads/')) {
            fs.unlinkSync(path.join(__dirname, '../public', row.imagen_url));
        }
        db.run(`DELETE FROM foro_posts WHERE id = ?`, [id], () => res.json({ ok: true }));
    });
};
