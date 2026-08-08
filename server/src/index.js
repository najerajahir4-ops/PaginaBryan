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

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Global Rate Limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 200, // Límite de 200 peticiones por IP cada 15 minutos
  message: { error: 'Demasiadas peticiones desde esta IP, por favor intenta de nuevo después de 15 minutos.' }
});
app.use('/api', limiter);

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173', 
  'http://127.0.0.1:5173',
  'https://paginabryan-db.vercel.app'
];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir peticiones sin origen (como Postman) o si está en la lista de permitidos
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Bloqueado por políticas de CORS'));
      }
    },
    credentials: true,
  })
);

// Ruta de comprobación de salud
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor de Taekwondo & Kickboxing en funcionamiento 🥋' });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
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
