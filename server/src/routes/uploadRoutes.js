const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const { verifyToken } = require('../middleware/authMiddleware');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'paginabryan_students',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
  },
});

const upload = multer({ storage: storage });

router.post('/', verifyToken, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ningún archivo' });
    }
    return res.json({ url: req.file.path });
  } catch (error) {
    console.error('Error al subir imagen:', error);
    res.status(500).json({ error: 'Error interno al subir la imagen' });
  }
});

module.exports = router;
