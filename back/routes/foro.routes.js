const express = require('express');
const router = express.Router();
const foroController = require('../controllers/foro.controller');
const adminAuth = require('../middlewares/adminAuth');
const multer = require('multer');

const upload = multer({ dest: 'public/uploads/' });

// Rutas públicas
router.get('/', foroController.getAll);

// Rutas protegidas (admin)
router.post('/', adminAuth, upload.single('imagenFile'), foroController.createForoPost);
router.delete('/:id', adminAuth, foroController.deleteForoPost);

module.exports = router;
