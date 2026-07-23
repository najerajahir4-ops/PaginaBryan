const express = require('express');
const router = express.Router();
const {
  getAllContent,
  getContentById,
  createContent,
  updateContent,
  deleteContent,
  reorderContents,
} = require('../controllers/contentController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', getAllContent);
router.patch('/reorder', authMiddleware, reorderContents);
router.get('/:id', getContentById);
router.post('/', authMiddleware, createContent);
router.put('/:id', authMiddleware, updateContent);
router.delete('/:id', authMiddleware, deleteContent);

module.exports = router;
