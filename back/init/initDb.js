const db = require('../db/sqlite');
const bcrypt = require('bcrypt');

const initDb = () => {
    db.serialize(() => {

        db.run(`
            CREATE TABLE IF NOT EXISTS admin (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL
            )
        `);

        db.run(`
        CREATE TABLE IF NOT EXISTS noticias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        contenido TEXT NOT NULL,
        tipo TEXT NOT NULL DEFAULT 'imagen-texto',
        imagen_url TEXT,
        fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);


        db.run(`
            CREATE TABLE IF NOT EXISTS foro_posts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                titulo TEXT NOT NULL,
                contenido TEXT NOT NULL,
                tipo TEXT NOT NULL DEFAULT 'imagen-texto',
                imagen_url TEXT,
                fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // crear admin si no existe
        db.get(
            `SELECT * FROM admin WHERE username = ?`,
            ['admin'],
            async (err, row) => {
                if (!row) {
                    const hash = await bcrypt.hash('admin123', 10);

                    db.run(
                        `INSERT INTO admin (username, password_hash) VALUES (?, ?)`,
                        ['admin', hash]
                    );

                    console.log('Admin creado: admin / admin123');
                }
            }
        );

    });
};

module.exports = initDb;
