const prisma = require('../config/db');

// Obtener asistencia de estudiantes para una fecha determinada
const getAttendanceByDate = async (req, res, next) => {
  try {
    const { fecha, search, clubId, modalidad } = req.query;

    if (!fecha) {
      return res.status(400).json({ error: 'El parámetro fecha es requerido (formato YYYY-MM-DD).' });
    }

    const where = { estado: 'ACTIVO' };

    // Filtros de búsqueda
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

    if (modalidad) {
      where.modalidad = modalidad.toUpperCase();
    }

    // Obtener estudiantes activos con su asistencia para la fecha seleccionada
    const students = await prisma.student.findMany({
      where,
      include: {
        club: true,
        attendances: {
          where: {
            fecha: fecha,
          },
        },
      },
      orderBy: { nombres: 'asc' },
    });

    // Mapear el resultado para que el frontend reciba una propiedad attendance limpia
    const processed = students.map((s) => ({
      id: s.id,
      nombres: s.nombres,
      apellidos: s.apellidos,
      nombreCompleto: `${s.nombres} ${s.apellidos}`,
      cedula: s.cedula,
      grado: s.grado,
      modalidad: s.modalidad,
      foto: s.foto,
      club: s.club,
      attendance: s.attendances.length > 0 ? s.attendances[0] : null,
    }));

    return res.json(processed);
  } catch (error) {
    next(error);
  }
};

// Guardar o actualizar la asistencia de un solo estudiante (Upsert)
const upsertAttendance = async (req, res, next) => {
  try {
    const { studentId, fecha, estado } = req.body;

    if (!studentId || !fecha || !estado) {
      return res.status(400).json({ error: 'Faltan campos obligatorios: studentId, fecha, estado.' });
    }

    const record = await prisma.attendance.upsert({
      where: {
        studentId_fecha: {
          studentId: parseInt(studentId),
          fecha: fecha,
        },
      },
      update: {
        estado: estado,
      },
      create: {
        studentId: parseInt(studentId),
        fecha: fecha,
        estado: estado,
      },
    });

    return res.json(record);
  } catch (error) {
    next(error);
  }
};

// Guardar o actualizar asistencia en lote (Bulk)
const bulkUpsertAttendance = async (req, res, next) => {
  try {
    const { fecha, records } = req.body;

    if (!fecha || !Array.isArray(records)) {
      return res.status(400).json({ error: 'Faltan campos obligatorios o formato incorrecto.' });
    }

    const upserts = records.map((rec) => {
      return prisma.attendance.upsert({
        where: {
          studentId_fecha: {
            studentId: parseInt(rec.studentId),
            fecha: fecha,
          },
        },
        update: {
          estado: rec.estado,
        },
        create: {
          studentId: parseInt(rec.studentId),
          fecha: fecha,
          estado: rec.estado,
        },
      });
    });

    const results = await prisma.$transaction(upserts);
    return res.json({ message: 'Asistencias guardadas masivamente.', count: results.length });
  } catch (error) {
    next(error);
  }
};

// Eliminar un registro de asistencia (restablecer a sin registrar)
const deleteAttendance = async (req, res, next) => {
  try {
    const { studentId, fecha } = req.query;

    if (!studentId || !fecha) {
      return res.status(400).json({ error: 'Faltan parámetros obligatorios: studentId, fecha.' });
    }

    await prisma.attendance.deleteMany({
      where: {
        studentId: parseInt(studentId),
        fecha: fecha,
      },
    });

    return res.json({ message: 'Registro de asistencia eliminado.' });
  } catch (error) {
    next(error);
  }
};

// Obtener historial agrupado por fechas
const getAttendanceHistory = async (req, res, next) => {
  try {
    const attendances = await prisma.attendance.findMany({
      include: {
        student: true,
      },
      orderBy: { fecha: 'desc' },
    });

    const grouped = {};
    attendances.forEach((a) => {
      if (!a.student || a.student.estado !== 'ACTIVO') return;

      const dateStr = a.fecha;
      if (!grouped[dateStr]) {
        grouped[dateStr] = {
          fecha: dateStr,
          presentes: 0,
          ausentes: 0,
          tardes: 0,
          justificados: 0,
          total: 0,
        };
      }

      grouped[dateStr].total++;
      switch (a.estado) {
        case 'PRESENTE':
          grouped[dateStr].presentes++;
          break;
        case 'AUSENTE':
          grouped[dateStr].ausentes++;
          break;
        case 'TARDE':
          grouped[dateStr].tardes++;
          break;
        case 'JUSTIFICADO':
          grouped[dateStr].justificados++;
          break;
      }
    });

    const list = Object.values(grouped).sort((a, b) => b.fecha.localeCompare(a.fecha));
    return res.json(list);
  } catch (error) {
    next(error);
  }
};

// Obtener reporte estadístico por alumno
const getStudentAttendanceReport = async (req, res, next) => {
  try {
    const { search, clubId, modalidad } = req.query;

    const where = { estado: 'ACTIVO' };

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

    if (modalidad) {
      where.modalidad = modalidad.toUpperCase();
    }

    const students = await prisma.student.findMany({
      where,
      include: {
        club: true,
        attendances: true,
      },
      orderBy: { nombres: 'asc' },
    });

    const report = students.map((s) => {
      const total = s.attendances.length;
      const presentes = s.attendances.filter((a) => a.estado === 'PRESENTE').length;
      const ausentes = s.attendances.filter((a) => a.estado === 'AUSENTE').length;
      const tardes = s.attendances.filter((a) => a.estado === 'TARDE').length;
      const justificados = s.attendances.filter((a) => a.estado === 'JUSTIFICADO').length;
      const porcentaje = total > 0 ? Math.round((presentes / total) * 100) : 0;

      return {
        id: s.id,
        nombreCompleto: `${s.nombres} ${s.apellidos}`,
        cedula: s.cedula,
        modalidad: s.modalidad,
        club: s.club ? s.club.nombre : 'Sin Club',
        grado: s.grado,
        foto: s.foto,
        presentes,
        ausentes,
        tardes,
        justificados,
        total,
        porcentaje,
      };
    });

    return res.json(report);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAttendanceByDate,
  upsertAttendance,
  bulkUpsertAttendance,
  deleteAttendance,
  getAttendanceHistory,
  getStudentAttendanceReport,
};
