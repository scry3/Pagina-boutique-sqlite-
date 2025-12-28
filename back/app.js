const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const app = express();

// Middlewares
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sesiones
app.use(session({
    secret: 'libreria_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 2 * 60 * 60 * 1000 } // 2 horas
}));

// Servir archivos públicos (imagenes)
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Rutas
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/noticias', require('./routes/noticias.routes'));
app.use('/api/foro', require('./routes/foro.routes'));

app.use(express.static(path.join(__dirname, '../front')));


module.exports = app;
