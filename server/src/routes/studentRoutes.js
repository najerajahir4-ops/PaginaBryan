const express = require('express');
const router = express.Router();
const {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getDashboardStats,
} = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');

// Rutas protegidas para administración
router.get('/stats', authMiddleware, getDashboardStats);
router.get('/', getStudents); // Público / Admin con filtros
router.get('/:id', getStudentById);
router.post('/', authMiddleware, createStudent);
router.put('/:id', authMiddleware, updateStudent);
router.delete('/:id', authMiddleware, deleteStudent);

module.exports = router;
