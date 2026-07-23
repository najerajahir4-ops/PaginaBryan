const errorHandler = (err, req, res, next) => {
  console.error('🔥 Error en el servidor:', err.stack || err);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    error: err.message || 'Error interno del servidor',
  });
};

module.exports = errorHandler;
