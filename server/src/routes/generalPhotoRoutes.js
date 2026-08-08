const express = require('express');
const router = express.Router();
const { getGeneralPhotos, addGeneralPhoto, deleteGeneralPhoto } = require('../controllers/generalPhotoController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', getGeneralPhotos);
router.post('/', authMiddleware, addGeneralPhoto);
router.delete('/:id', authMiddleware, deleteGeneralPhoto);

module.exports = router;
