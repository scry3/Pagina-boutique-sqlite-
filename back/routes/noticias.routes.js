const express = require('express');
const router = express.Router();
const noticiasController = require('../controllers/noticias.controller');
const adminAuth = require('../middlewares/adminAuth');
const multer = require('multer');

// Multer temporal solo para procesar archivos en memoria antes de subirlos a Cloudinary
const upload = multer({ storage: multer.memoryStorage() });

// Rutas públicas
router.get('/', noticiasController.getAll);

// Rutas protegidas (admin)
router.post('/', adminAuth, upload.single('imagenFile'), noticiasController.createNoticia);
router.delete('/:id', adminAuth, noticiasController.deleteNoticia);

module.exports = router;
