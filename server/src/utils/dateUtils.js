/**
 * Función auxiliar para calcular estado de pago usando la fecha próxima de pago real
 * Retorna: VERDE (Al día), AMARILLO (Próximo a vencer en 7 días o menos), ROJO (Vencido)
 */
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

/**
 * Calcula la próxima fecha de pago basada en una fecha base y un periodo
 * @param {string|Date} baseDateInput Fecha inicial (YYYY-MM-DD o instancia Date)
 * @param {string} period 'MENSUAL', 'TRIMESTRAL', 'ANUAL'
 * @returns {string} Fecha calculada en formato YYYY-MM-DD
 */
const calculateNextPaymentDate = (baseDateInput, period = 'MENSUAL') => {
  const baseDate = new Date(baseDateInput);
  const nextDate = new Date(baseDate);

  if (period === 'TRIMESTRAL') {
    nextDate.setMonth(nextDate.getMonth() + 3);
  } else if (period === 'ANUAL') {
    nextDate.setFullYear(nextDate.getFullYear() + 1);
  } else {
    nextDate.setMonth(nextDate.getMonth() + 1); // Default Mensual
  }

  return nextDate.toISOString().split('T')[0];
};

module.exports = {
  calculatePaymentStatus,
  calculateNextPaymentDate,
};
