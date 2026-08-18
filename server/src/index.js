const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const contentRoutes = require('./routes/contentRoutes');
const featuredStudentRoutes = require('./routes/featuredStudentRoutes');
const clubRoutes = require('./routes/clubRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const generalPhotoRoutes = require('./routes/generalPhotoRoutes');
const errorHandler = require('./middleware/errorHandler');
const csrfMiddleware = require('./middleware/csrfMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Configurar confianza en el proxy de Vercel/reverse proxy para rate-limiting y cookies precisas
app.set('trust proxy', 1);

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Global Rate Limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 200, // Límite de 200 peticiones por IP cada 15 minutos
  message: { error: 'Demasiadas peticiones desde esta IP, por favor intenta de nuevo después de 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Whitelist explícita de dominios autorizados para CORS
const allowedOrigins = [
  'http://localhost:5173', 
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'https://paginabryan-db.vercel.app'
];

if (process.env.FRONTEND_URL) {
  const envUrl = process.env.FRONTEND_URL.trim().replace(/\/$/, '');
  if (envUrl && !allowedOrigins.includes(envUrl)) {
    allowedOrigins.push(envUrl);
  }
}

if (process.env.VERCEL_URL) {
  const vercelUrl = `https://${process.env.VERCEL_URL.trim().replace(/\/$/, '')}`;
  if (!allowedOrigins.includes(vercelUrl)) {
    allowedOrigins.push(vercelUrl);
  }
}

if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
  const prodUrl = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.trim().replace(/\/$/, '')}`;
  if (!allowedOrigins.includes(prodUrl)) {
    allowedOrigins.push(prodUrl);
  }
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir peticiones sin cabecera origin (server-to-server / curl)
      if (!origin) {
        return callback(null, true);
      }

      // Validar contra lista blanca estricta
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Permitir subdominios de preview específicos de este proyecto en Vercel
      if (/^https:\/\/paginabryan[a-z0-9-]*\.vercel\.app$/i.test(origin)) {
        return callback(null, true);
      }

      const corsErr = new Error(`Bloqueado por políticas de CORS: Origen '${origin}' no autorizado.`);
      corsErr.status = 403;
      return callback(corsErr);
    },
    credentials: true,
  })
);

// Ruta de comprobación de salud
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor de Taekwondo & Kickboxing en funcionamiento 🥋' });
});

// Rutas de la API (Públicas o que manejan su propio middleware específico primero)
app.use('/api/auth', authRoutes); // login/logout

// Middleware de protección CSRF para el resto de rutas (que incluyen endpoints mutantes)
app.use('/api', csrfMiddleware);

app.use('/api/students', studentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/featured-students', featuredStudentRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/general-photos', generalPhotoRoutes);

// Error Handler Middleware
app.use(errorHandler);

// Modo serverless (Vercel) o servidor local
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en el puerto ${PORT}`);
    console.log(`📡 URL API: http://localhost:${PORT}/api`);
  });
}

module.exports = app;
