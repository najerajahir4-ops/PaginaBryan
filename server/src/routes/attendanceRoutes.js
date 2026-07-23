const express = require('express');
const router = express.Router();
const {
  getAttendanceByDate,
  upsertAttendance,
  bulkUpsertAttendance,
  deleteAttendance,
  getAttendanceHistory,
  getStudentAttendanceReport,
} = require('../controllers/attendanceController');
const authMiddleware = require('../middleware/authMiddleware');

// Todas las rutas de asistencia están protegidas por autenticación
router.get('/', authMiddleware, getAttendanceByDate);
router.post('/', authMiddleware, upsertAttendance);
router.post('/bulk', authMiddleware, bulkUpsertAttendance);
router.delete('/', authMiddleware, deleteAttendance);

// Nuevas rutas para historia y reportes
router.get('/history', authMiddleware, getAttendanceHistory);
router.get('/report', authMiddleware, getStudentAttendanceReport);

module.exports = router;
