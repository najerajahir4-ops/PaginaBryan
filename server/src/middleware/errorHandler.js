const { ZodError } = require('zod');

const errorHandler = (err, req, res, next) => {
  console.error('🔥 Error en el servidor:', err.stack || err);

  if (err instanceof ZodError) {
    const errorMessages = err.errors.map(e => e.message).join(', ');
    return res.status(400).json({ error: `Error de validación: ${errorMessages}` });
  }

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    error: err.message || 'Error interno del servidor',
  });
};

module.exports = errorHandler;
