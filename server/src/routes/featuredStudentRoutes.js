const express = require('express');
const router = express.Router();
const {
  getFeaturedStudents,
  createFeaturedStudent,
  updateFeaturedStudent,
  deleteFeaturedStudent,
  reorderFeaturedStudents,
} = require('../controllers/featuredStudentController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', getFeaturedStudents);
router.patch('/reorder', authMiddleware, reorderFeaturedStudents);
router.post('/', authMiddleware, createFeaturedStudent);
router.put('/:id', authMiddleware, updateFeaturedStudent);
router.delete('/:id', authMiddleware, deleteFeaturedStudent);

module.exports = router;
