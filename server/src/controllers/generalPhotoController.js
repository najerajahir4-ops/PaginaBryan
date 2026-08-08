const prisma = require('../config/db');

const getGeneralPhotos = async (req, res, next) => {
  try {
    const photos = await prisma.generalPhoto.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return res.json(photos);
  } catch (error) {
    next(error);
  }
};

const addGeneralPhoto = async (req, res, next) => {
  try {
    const { url, descripcion } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'La URL de la foto es requerida.' });
    }

    const photo = await prisma.generalPhoto.create({
      data: {
        url,
        descripcion: descripcion || '',
      },
    });

    return res.status(201).json(photo);
  } catch (error) {
    next(error);
  }
};

const deleteGeneralPhoto = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.generalPhoto.delete({
      where: { id: parseInt(id) },
    });
    return res.json({ message: 'Foto eliminada con éxito.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGeneralPhotos,
  addGeneralPhoto,
  deleteGeneralPhoto,
};
