const prisma = require('../config/db');

const getFeaturedStudents = async (req, res, next) => {
  try {
    const { categoria, disciplina } = req.query;

    const where = {};
    if (categoria) where.categoria = categoria;
    if (disciplina) where.disciplina = disciplina;

    const list = await prisma.featuredStudent.findMany({
      where,
      include: {
        student: {
          include: { club: true },
        },
      },
      orderBy: { orden: 'asc' },
    });

    return res.json(list);
  } catch (error) {
    next(error);
  }
};

const createFeaturedStudent = async (req, res, next) => {
  try {
    const { studentId, logros, categoria, disciplina, imagenUrl } = req.body;

    if (!studentId || !logros || !categoria || !disciplina) {
      return res.status(400).json({ error: 'Faltan campos para registrar alumno destacado.' });
    }

    // Buscar el máximo orden existente para posicionar al final
    const maxItem = await prisma.featuredStudent.findFirst({
      orderBy: { orden: 'desc' },
      select: { orden: true }
    });
    const nextOrder = (maxItem?.orden || 0) + 1;

    const created = await prisma.featuredStudent.create({
      data: {
        studentId: parseInt(studentId),
        logros,
        categoria,
        disciplina,
        orden: nextOrder,
        imagenUrl: imagenUrl || null,
      },
      include: {
        student: { include: { club: true } },
      },
    });

    return res.status(201).json(created);
  } catch (error) {
    next(error);
  }
};

const updateFeaturedStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { logros, categoria, disciplina, imagenUrl } = req.body;

    const updated = await prisma.featuredStudent.update({
      where: { id: parseInt(id) },
      data: { logros, categoria, disciplina, imagenUrl: imagenUrl || null },
      include: {
        student: { include: { club: true } },
      },
    });

    return res.json(updated);
  } catch (error) {
    next(error);
  }
};

const deleteFeaturedStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.featuredStudent.delete({ where: { id: parseInt(id) } });
    return res.json({ message: 'Alumno destacado eliminado.' });
  } catch (error) {
    next(error);
  }
};

const reorderFeaturedStudents = async (req, res, next) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids)) {
      return res.status(400).json({ error: 'Se requiere un array de IDs para reordenar.' });
    }

    await prisma.$transaction(
      ids.map((id, index) =>
        prisma.featuredStudent.update({
          where: { id: parseInt(id) },
          data: { orden: index + 1 }
        })
      )
    );

    return res.json({ message: 'Orden de alumnos destacados actualizado con éxito.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFeaturedStudents,
  createFeaturedStudent,
  updateFeaturedStudent,
  deleteFeaturedStudent,
  reorderFeaturedStudents,
};
