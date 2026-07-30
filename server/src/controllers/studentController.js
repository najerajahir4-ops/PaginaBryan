const prisma = require('../config/db');

// Función auxiliar para calcular estado de pago usando la fecha próxima de pago real
const calculatePaymentStatus = (fechaProximoPagoStr) => {
  if (!fechaProximoPagoStr) return 'ROJO';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Parsear la fecha YYYY-MM-DD en hora local para evitar desfases de zona horaria
  const [year, month, day] = fechaProximoPagoStr.split('-').map(Number);
  const nextPaymentDate = new Date(year, month - 1, day);
  nextPaymentDate.setHours(0, 0, 0, 0);

  const diffTime = nextPaymentDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return 'ROJO'; // Vencido
  } else if (diffDays <= 7) {
    return 'AMARILLO'; // Próximo a vencer (7 días o menos)
  } else {
    return 'VERDE'; // Al día
  }
};

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
    const {
      nombres,
      apellidos,
      cedula,
      fechaNacimiento,
      edad,
      celular,
      direccion,
      correo,
      horarioElegido,
      alergias,
      enfermedades,
      lesiones,
      contactoEmergencia,
      nombreRepresentante,
      cedulaRepresentante,
      celularRepresentante,
      comoSeEntero,
      autorizaImagen,
      diaDeCobro,
      modalidad,
      
      clubId,
      grado,
      fechaIngreso,
      fechaUltimoPago,
      periodicidadPago,
      foto,
    } = req.body;

    if (!nombres || !apellidos || !cedula || !fechaNacimiento || !edad || !horarioElegido || !contactoEmergencia || !grado) {
      return res.status(400).json({ error: 'Faltan campos obligatorios para registrar al estudiante.' });
    }

    // Calcular fecha del próximo pago inicial
    const ultimoPagoDate = fechaUltimoPago ? new Date(fechaUltimoPago) : new Date();
    const proximoPagoDate = new Date(ultimoPagoDate);

    const period = periodicidadPago || 'MENSUAL';
    if (period === 'TRIMESTRAL') {
      proximoPagoDate.setMonth(proximoPagoDate.getMonth() + 3);
    } else if (period === 'ANUAL') {
      proximoPagoDate.setFullYear(proximoPagoDate.getFullYear() + 1);
    } else {
      proximoPagoDate.setMonth(proximoPagoDate.getMonth() + 1); // Default Mensual
    }

    const newStudent = await prisma.student.create({
      data: {
        nombres,
        apellidos,
        cedula,
        fechaNacimiento,
        edad: parseInt(edad),
        celular,
        direccion,
        correo,
        horarioElegido,
        alergias,
        enfermedades,
        lesiones,
        contactoEmergencia,
        nombreRepresentante,
        cedulaRepresentante,
        celularRepresentante,
        comoSeEntero,
        autorizaImagen: Boolean(autorizaImagen),
        diaDeCobro: parseInt(diaDeCobro) || 1,
        modalidad: modalidad || 'TAEKWONDO',
        
        clubId: clubId ? parseInt(clubId) : null,
        grado,
        fechaIngreso: fechaIngreso || new Date().toISOString().split('T')[0],
        fechaUltimoPago: fechaUltimoPago || new Date().toISOString().split('T')[0],
        fechaProximoPago: proximoPagoDate.toISOString().split('T')[0],
        periodicidadPago: period,
        foto: foto || '',
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
    const {
      nombres,
      apellidos,
      cedula,
      fechaNacimiento,
      edad,
      celular,
      direccion,
      correo,
      horarioElegido,
      alergias,
      enfermedades,
      lesiones,
      contactoEmergencia,
      nombreRepresentante,
      cedulaRepresentante,
      celularRepresentante,
      comoSeEntero,
      autorizaImagen,
      diaDeCobro,
      modalidad,
      
      clubId,
      grado,
      fechaIngreso,
      periodicidadPago,
      foto,
      estado,
      fechaUltimoPago,
    } = req.body;

    // Obtener estudiante actual para calcular fechaProximoPago si fechaUltimoPago o periodicidadPago cambian
    const currentStudent = await prisma.student.findUnique({
      where: { id: parseInt(id) }
    });

    if (!currentStudent) {
      return res.status(404).json({ error: 'Estudiante no encontrado.' });
    }

    // Si se especificó una nueva fecha de último pago o una nueva periodicidad, recalculamos la próxima
    let proximoPagoCalculado = undefined;
    if (fechaUltimoPago !== undefined || periodicidadPago !== undefined) {
      const finalUltimoPago = fechaUltimoPago !== undefined ? fechaUltimoPago : currentStudent.fechaUltimoPago;
      const finalPeriod = periodicidadPago !== undefined ? periodicidadPago : currentStudent.periodicidadPago;
      
      const baseDate = new Date(finalUltimoPago);
      const nextDate = new Date(baseDate);
      
      if (finalPeriod === 'TRIMESTRAL') {
        nextDate.setMonth(nextDate.getMonth() + 3);
      } else if (finalPeriod === 'ANUAL') {
        nextDate.setFullYear(nextDate.getFullYear() + 1);
      } else {
        nextDate.setMonth(nextDate.getMonth() + 1);
      }
      proximoPagoCalculado = nextDate.toISOString().split('T')[0];
    }

    const updatedStudent = await prisma.student.update({
      where: { id: parseInt(id) },
      data: {
        nombres,
        apellidos,
        cedula,
        fechaNacimiento,
        edad: edad ? parseInt(edad) : undefined,
        celular,
        direccion,
        correo,
        horarioElegido,
        alergias,
        enfermedades,
        lesiones,
        contactoEmergencia,
        nombreRepresentante,
        cedulaRepresentante,
        celularRepresentante,
        comoSeEntero,
        autorizaImagen: autorizaImagen !== undefined ? Boolean(autorizaImagen) : undefined,
        diaDeCobro: diaDeCobro ? parseInt(diaDeCobro) : undefined,
        modalidad,
        
        clubId: clubId ? parseInt(clubId) : null,
        grado,
        fechaIngreso,
        periodicidadPago,
        foto,
        estado,
        fechaUltimoPago,
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
