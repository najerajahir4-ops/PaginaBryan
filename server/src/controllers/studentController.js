const prisma = require('../config/db');
const { calculatePaymentStatus, calculateNextPaymentDate } = require('../utils/dateUtils');
const { studentCreateSchema, studentUpdateSchema } = require('../utils/validators');

const getStudents = async (req, res, next) => {
  try {
    const { search, clubId, estadoPago } = req.query;

    const where = {};
    if (search) {
      where.OR = [
        { nombres: { contains: search } },
        { apellidos: { contains: search } },
        { cedula: { contains: search } },
      ];
    }
    if (clubId) {
      where.clubId = parseInt(clubId);
    }

    const students = await prisma.student.findMany({
      where,
      include: {
        club: true,
        payments: {
          orderBy: { fechaPago: 'desc' },
        },
      },
      orderBy: { nombres: 'asc' },
    });

    // Mapear con estado calculado
    const processedStudents = students.map((s) => {
      const estadoCalculado = calculatePaymentStatus(s.fechaProximoPago, s.diaDeCobro);
      return {
        ...s,
        nombreCompleto: `${s.nombres} ${s.apellidos}`, // Frontend compatibilidad
        estadoPago: estadoCalculado,
      };
    });

    // Filtrar por estadoPago si fue enviado en la query
    let filtered = processedStudents;
    if (estadoPago) {
      filtered = processedStudents.filter((s) => s.estadoPago === estadoPago.toUpperCase());
    }

    return res.json(filtered);
  } catch (error) {
    next(error);
  }
};

const getStudentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const student = await prisma.student.findUnique({
      where: { id: parseInt(id) },
      include: {
        club: true,
        payments: {
          orderBy: { fechaPago: 'desc' },
        },
        featuredStudents: true,
        gallery: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!student) {
      return res.status(404).json({ error: 'Estudiante no encontrado.' });
    }

    return res.json({
      ...student,
      nombreCompleto: `${student.nombres} ${student.apellidos}`,
      estadoPago: calculatePaymentStatus(student.fechaProximoPago, student.diaDeCobro),
    });
  } catch (error) {
    next(error);
  }
};

const createStudent = async (req, res, next) => {
  try {
    const parsedData = studentCreateSchema.parse(req.body);

    // Calcular fecha del próximo pago inicial
    const ultimoPagoDate = parsedData.fechaUltimoPago ? new Date(parsedData.fechaUltimoPago) : new Date();
    const period = parsedData.periodicidadPago || 'MENSUAL';
    const proximoPagoCalculado = calculateNextPaymentDate(ultimoPagoDate, period);

    const newStudent = await prisma.student.create({
      data: {
        nombres: parsedData.nombres,
        apellidos: parsedData.apellidos,
        cedula: parsedData.cedula,
        fechaNacimiento: parsedData.fechaNacimiento,
        edad: parsedData.edad,
        celular: parsedData.celular,
        direccion: parsedData.direccion,
        correo: parsedData.correo,
        horarioElegido: parsedData.horarioElegido,
        alergias: parsedData.alergias,
        enfermedades: parsedData.enfermedades,
        lesiones: parsedData.lesiones,
        contactoEmergencia: parsedData.contactoEmergencia,
        nombreRepresentante: parsedData.nombreRepresentante,
        cedulaRepresentante: parsedData.cedulaRepresentante,
        celularRepresentante: parsedData.celularRepresentante,
        comoSeEntero: parsedData.comoSeEntero,
        autorizaImagen: parsedData.autorizaImagen,
        diaDeCobro: parsedData.diaDeCobro,
        modalidad: parsedData.modalidad,
        
        clubId: parsedData.clubId,
        grado: parsedData.grado,
        fechaIngreso: parsedData.fechaIngreso || new Date().toISOString().split('T')[0],
        fechaUltimoPago: parsedData.fechaUltimoPago || new Date().toISOString().split('T')[0],
        fechaProximoPago: proximoPagoCalculado,
        periodicidadPago: period,
        foto: parsedData.foto,
      },
      include: { club: true },
    });

    return res.status(201).json({
      ...newStudent,
      nombreCompleto: `${newStudent.nombres} ${newStudent.apellidos}`,
      estadoPago: calculatePaymentStatus(newStudent.fechaProximoPago, newStudent.diaDeCobro),
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Ya existe un estudiante registrado con esa cédula/documento.' });
    }
    next(error);
  }
};

const updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const parsedData = studentUpdateSchema.parse(req.body);

    // Obtener estudiante actual para calcular fechaProximoPago si fechaUltimoPago o periodicidadPago cambian
    const currentStudent = await prisma.student.findUnique({
      where: { id: parseInt(id) }
    });

    if (!currentStudent) {
      return res.status(404).json({ error: 'Estudiante no encontrado.' });
    }

    // Si se especificó una nueva fecha de último pago o una nueva periodicidad, recalculamos la próxima
    let proximoPagoCalculado = undefined;
    if (parsedData.fechaUltimoPago !== undefined || parsedData.periodicidadPago !== undefined) {
      const finalUltimoPago = parsedData.fechaUltimoPago !== undefined ? parsedData.fechaUltimoPago : currentStudent.fechaUltimoPago;
      const finalPeriod = parsedData.periodicidadPago !== undefined ? parsedData.periodicidadPago : currentStudent.periodicidadPago;
      proximoPagoCalculado = calculateNextPaymentDate(finalUltimoPago, finalPeriod);
    }

    const updatedStudent = await prisma.student.update({
      where: { id: parseInt(id) },
      data: {
        nombres: parsedData.nombres,
        apellidos: parsedData.apellidos,
        cedula: parsedData.cedula,
        fechaNacimiento: parsedData.fechaNacimiento,
        edad: parsedData.edad,
        celular: parsedData.celular,
        direccion: parsedData.direccion,
        correo: parsedData.correo,
        horarioElegido: parsedData.horarioElegido,
        alergias: parsedData.alergias,
        enfermedades: parsedData.enfermedades,
        lesiones: parsedData.lesiones,
        contactoEmergencia: parsedData.contactoEmergencia,
        nombreRepresentante: parsedData.nombreRepresentante,
        cedulaRepresentante: parsedData.cedulaRepresentante,
        celularRepresentante: parsedData.celularRepresentante,
        comoSeEntero: parsedData.comoSeEntero,
        autorizaImagen: parsedData.autorizaImagen,
        diaDeCobro: parsedData.diaDeCobro,
        modalidad: parsedData.modalidad,
        
        clubId: parsedData.clubId,
        grado: parsedData.grado,
        fechaIngreso: parsedData.fechaIngreso,
        periodicidadPago: parsedData.periodicidadPago,
        foto: parsedData.foto,
        estado: parsedData.estado,
        fechaUltimoPago: parsedData.fechaUltimoPago,
        fechaProximoPago: proximoPagoCalculado,
      },
      include: { club: true },
    });

    return res.json({
      ...updatedStudent,
      nombreCompleto: `${updatedStudent.nombres} ${updatedStudent.apellidos}`,
      estadoPago: calculatePaymentStatus(updatedStudent.fechaProximoPago, updatedStudent.diaDeCobro),
    });
  } catch (error) {
    next(error);
  }
};

const deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.student.delete({ where: { id: parseInt(id) } });
    return res.json({ message: 'Estudiante eliminado con éxito.' });
  } catch (error) {
    next(error);
  }
};

// Resumen estadístico para Dashboard
const getDashboardStats = async (req, res, next) => {
  try {
    const students = await prisma.student.findMany();

    let alDiaCount = 0;
    let porVencerCount = 0;
    let vencidoCount = 0;

    students.forEach((s) => {
      const status = calculatePaymentStatus(s.fechaProximoPago, s.diaDeCobro);
      if (status === 'VERDE') alDiaCount++;
      if (status === 'AMARILLO') porVencerCount++;
      if (status === 'ROJO') vencidoCount++;
    });

    const payments = await prisma.payment.findMany();
    const totalRevenue = payments.reduce((sum, p) => sum + p.monto, 0);

    return res.json({
      totalActiveStudents: students.filter((s) => s.estado === 'ACTIVO').length,
      alDiaCount,
      porVencerCount,
      vencidoCount,
      totalRevenue,
    });
  } catch (error) {
    next(error);
  }
};

const addGalleryPhoto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { url, descripcion } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'La URL de la foto es requerida.' });
    }

    const photo = await prisma.studentGallery.create({
      data: {
        studentId: parseInt(id),
        url,
        descripcion: descripcion || '',
      },
    });

    return res.status(201).json(photo);
  } catch (error) {
    next(error);
  }
};

const deleteGalleryPhoto = async (req, res, next) => {
  try {
    const { photoId } = req.params;
    await prisma.studentGallery.delete({
      where: { id: parseInt(photoId) },
    });
    return res.json({ message: 'Foto eliminada con éxito.' });
  } catch (error) {
    next(error);
  }
};

const getAllGalleryPhotos = async (req, res, next) => {
  try {
    const photos = await prisma.studentGallery.findMany({
      include: {
        student: {
          select: {
            nombres: true,
            apellidos: true,
            grado: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return res.json(photos);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getDashboardStats,
  addGalleryPhoto,
  deleteGalleryPhoto,
  getAllGalleryPhotos,
};
