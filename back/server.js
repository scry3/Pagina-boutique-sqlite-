const app = require('./app');
const initDb = require('./init/initDb');
const session = require('express-session');

const PORT = process.env.PORT || 3000;

initDb();

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});



app.use(session({
    secret: 'libreria_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 2 * 60 * 60 * 1000 } // 2 horas
}));
