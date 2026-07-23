const prisma = require('../config/db');

// --- CLUBES ---
const getClubs = async (req, res, next) => {
  try {
    const clubs = await prisma.club.findMany({
      include: {
        _count: { select: { students: true } },
      },
    });
    return res.json(clubs);
  } catch (error) {
    next(error);
  }
};

const createClub = async (req, res, next) => {
  try {
    const { nombre, descripcion } = req.body;
    if (!nombre) {
      return res.status(400).json({ error: 'El nombre del club es obligatorio.' });
    }
    const club = await prisma.club.create({
      data: { nombre, descripcion: descripcion || '' },
    });
    return res.status(201).json(club);
  } catch (error) {
    next(error);
  }
};

const updateClub = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;
    const updated = await prisma.club.update({
      where: { id: parseInt(id) },
      data: { nombre, descripcion },
    });
    return res.json(updated);
  } catch (error) {
    next(error);
  }
};

const deleteClub = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.club.delete({ where: { id: parseInt(id) } });
    return res.json({ message: 'Club eliminado con éxito.' });
  } catch (error) {
    next(error);
  }
};

// --- MÓDULOS (GRADOS, HISTORIAL, LLAVES, CARNETS, DIPLOMAS) ---
const getModules = async (req, res, next) => {
  try {
    const { modulo } = req.query;
    const where = {};
    if (modulo) where.modulo = modulo.toUpperCase();

    const modules = await prisma.moduleData.findMany({ where });
    return res.json(modules);
  } catch (error) {
    next(error);
  }
};

const createModule = async (req, res, next) => {
  try {
    const { modulo, titulo, descripcion, icono, datosExtra } = req.body;
    if (!modulo || !titulo) {
      return res.status(400).json({ error: 'El módulo y el título son obligatorios.' });
    }
    const created = await prisma.moduleData.create({
      data: {
        modulo: modulo.toUpperCase(),
        titulo,
        descripcion: descripcion || '',
        icono: icono || 'Info',
        datosExtra: datosExtra || '',
      },
    });
    return res.status(201).json(created);
  } catch (error) {
    next(error);
  }
};

const updateModule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, icono, datosExtra } = req.body;
    const updated = await prisma.moduleData.update({
      where: { id: parseInt(id) },
      data: { titulo, descripcion, icono, datosExtra },
    });
    return res.json(updated);
  } catch (error) {
    next(error);
  }
};

const deleteModule = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.moduleData.delete({ where: { id: parseInt(id) } });
    return res.json({ message: 'Elemento de módulo eliminado.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getClubs,
  createClub,
  updateClub,
  deleteClub,
  getModules,
  createModule,
  updateModule,
  deleteModule,
};
