// Middleware simple para validar que el admin esté logueado
module.exports = (req, res, next) => {
    if (req.session && req.session.admin) {
        next();
    } else {
        res.status(401).json({ error: 'No autorizado' });
    }
};
