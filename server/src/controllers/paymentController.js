const prisma = require('../config/db');

const registerPayment = async (req, res, next) => {
  try {
    const { studentId, monto, fechaPago, metodoPago, periodoCubierto } = req.body;

    if (!studentId || !monto || !fechaPago || !metodoPago) {
      return res.status(400).json({ error: 'Faltan datos requeridos para registrar el pago.' });
    }

    const student = await prisma.student.findUnique({
      where: { id: parseInt(studentId) },
    });

    if (!student) {
      return res.status(404).json({ error: 'Estudiante no encontrado.' });
    }

    // 1. Crear registro de pago
    const payment = await prisma.payment.create({
      data: {
        studentId: parseInt(studentId),
        monto: parseFloat(monto),
        fechaPago,
        metodoPago,
        periodoCubierto: periodoCubierto || 'Cuota regular',
      },
    });

    // 2. Recalcular fechaProximoPago basada en la fecha del pago realizado
    const baseDate = new Date(fechaPago);
    const nextDate = new Date(baseDate);

    const period = student.periodicidadPago || 'MENSUAL';
    if (period === 'TRIMESTRAL') {
      nextDate.setMonth(nextDate.getMonth() + 3);
    } else if (period === 'ANUAL') {
      nextDate.setFullYear(nextDate.getFullYear() + 1);
    } else {
      nextDate.setMonth(nextDate.getMonth() + 1);
    }

    const updatedStudent = await prisma.student.update({
      where: { id: parseInt(studentId) },
      data: {
        fechaUltimoPago: fechaPago,
        fechaProximoPago: nextDate.toISOString().split('T')[0],
      },
    });

    return res.status(201).json({
      payment,
      updatedStudent,
    });
  } catch (error) {
    next(error);
  }
};

const getStudentPayments = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const payments = await prisma.payment.findMany({
      where: { studentId: parseInt(studentId) },
      orderBy: { fechaPago: 'desc' },
    });
    return res.json(payments);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerPayment,
  getStudentPayments,
};
