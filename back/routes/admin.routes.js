const express = require('express');
const router = express.Router();

const controller = require('../controllers/admin.controller');
const adminAuth = require('../middlewares/adminAuth');

const multer = require('multer');
const upload = multer({ dest: 'public/uploads/' });

/* =========================
   AUTH
   ========================= */

// Login (no protegido)
router.post('/login', controller.login);

// Logout (requiere sesión)
router.post('/logout', adminAuth, controller.logout);

// Check sesión (para proteger admin.html)
router.get('/check', adminAuth, (req, res) => {
    res.json({ ok: true });
});

/* =========================
   NOTICIAS (PROTEGIDO)
   ========================= */
router.post(
    '/noticias',
    adminAuth,
    upload.single('imagenFile'),
    controller.createNoticia
);

router.delete(
    '/noticias/:id',
    adminAuth,
    controller.deleteNoticia
);

/* =========================
   FORO (PROTEGIDO)
   ========================= */
router.post(
    '/foro',
    adminAuth,
    upload.single('imagenFile'),
    controller.createForoPost
);

router.delete(
    '/foro/:id',
    adminAuth,
    controller.deleteForoPost
);

module.exports = router;
