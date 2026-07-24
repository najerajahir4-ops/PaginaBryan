const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

const login = async (req, res, next) => {
  try {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
      return res.status(400).json({ error: 'Por favor ingrese usuario y contraseña.' });
    }

    const admin = await prisma.adminUser.findUnique({ where: { usuario: usuario.toLowerCase() } });
    if (!admin) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const isValidPassword = await bcrypt.compare(password, admin.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const token = jwt.sign(
      { id: admin.id, usuario: admin.usuario, rol: admin.rol },
      process.env.JWT_SECRET || 'super_secret_jwt_key_taekwondo_2026',
      { expiresIn: '24h' }
    );

    const isProd = process.env.NODE_ENV === 'production';

    // Guardar token en cookie httpOnly
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: { id: admin.id, usuario: admin.usuario, rol: admin.rol },
    });
  } catch (error) {
    next(error);
  }
};

const verifyToken = async (req, res) => {
  return res.json({ user: req.user });
};

const logout = (req, res) => {
  res.clearCookie('token');
  return res.json({ message: 'Sesión cerrada correctamente.' });
};

module.exports = {
  login,
  verifyToken,
  logout,
};
