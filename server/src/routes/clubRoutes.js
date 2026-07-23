const express = require('express');
const router = express.Router();
const {
  getClubs,
  createClub,
  updateClub,
  deleteClub,
  getModules,
  createModule,
  updateModule,
  deleteModule,
} = require('../controllers/clubController');
const authMiddleware = require('../middleware/authMiddleware');

// Rutas de Clubes
router.get('/', getClubs);
router.post('/', authMiddleware, createClub);
router.put('/:id', authMiddleware, updateClub);
router.delete('/:id', authMiddleware, deleteClub);

// Rutas de Módulos Auxiliares
router.get('/modules', getModules);
router.post('/modules', authMiddleware, createModule);
router.put('/modules/:id', authMiddleware, updateModule);
router.delete('/modules/:id', authMiddleware, deleteModule);

module.exports = router;
