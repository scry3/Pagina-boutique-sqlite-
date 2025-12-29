const express = require('express');
const router = express.Router();
const foroController = require('../controllers/foro.controller');
const adminAuth = require('../middlewares/adminAuth');
const multer = require('multer');

// Multer temporal solo para procesar archivos en memoria antes de subirlos a Cloudinary
const upload = multer({ storage: multer.memoryStorage() });

// Rutas públicas
router.get('/', foroController.getAll);

// Rutas protegidas (admin)
router.post('/', adminAuth, upload.single('imagenFile'), foroController.createForoPost);
router.delete('/:id', adminAuth, foroController.deleteForoPost);

module.exports = router;
