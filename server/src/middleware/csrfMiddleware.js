const csrfMiddleware = (req, res, next) => {
  // Solo aplicar a métodos que mutan el estado
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    const csrfCookie = req.cookies.csrfToken;
    const csrfHeader = req.headers['x-csrf-token'];

    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
      return res.status(403).json({ error: 'Token CSRF inválido o faltante.' });
    }
  }
  next();
};

module.exports = csrfMiddleware;
