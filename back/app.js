const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sesiones
app.use(session({
    secret: 'libreria_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 2 * 60 * 60 * 1000 } // 2 horas
}));

// Servir FRONT (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../front')));

// Servir uploads e imágenes(localmente)
//app.use(express.static(path.join(__dirname, 'public')));

// Ruta raíz → index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../front/index.html'));
});

// Rutas API
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/noticias', require('./routes/noticias.routes'));
app.use('/api/foro', require('./routes/foro.routes'));

module.exports = app;
