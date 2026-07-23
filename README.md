# Academia de Taekwondo & Kickboxing - Proyecto Full-Stack

Aplicación web completa construida desde cero con arquitectura desacoplada en `/client` y `/server`. Cuenta con un portal público informativo y un panel de administración privado con autenticación JWT y gestión de cobros automatizada.

---

## 🛠️ Stack Tecnológico

- **Frontend (`/client`)**: React 18, Vite, TailwindCSS, Lucide-React, React Router DOM v6, Recharts, Axios.
- **Backend (`/server`)**: Node.js, Express.js, Prisma ORM, JWT (JSON Web Tokens), Bcrypt.js, CORS, Cookie Parser.
- **Base de Datos**: PostgreSQL / SQLite (configurado por defecto con SQLite para pruebas locales inmediatas de cero configuración).

---

## 📁 Estructura del Proyecto

```
PAGINABRYAN/
├── client/                 # Aplicación Frontend React + Vite + Tailwind
│   ├── src/
│   │   ├── components/     # Navbar, Footer, StatusBadge, Modal, ProtectedRoute
│   │   ├── context/        # AuthContext (Estado de autenticación JWT)
│   │   ├── pages/          # Home, QuienesSomos, Campeonatos, AlumnosDestacados, Contenido, etc.
│   │   │   └── admin/      # Dashboard, EstudiantesAdmin, ContenidoAdmin, ModulosAdmin
│   │   ├── services/       # Instancia de API Axios
│   │   ├── App.jsx         # Enrutador principal
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── package.json
├── server/                 # Servidor Backend Node.js + Express + Prisma
│   ├── prisma/
│   │   ├── schema.prisma   # Modelo de datos Prisma (Student, Payment, Club, etc.)
│   │   └── seed.js         # Script de siembra de datos de prueba
│   ├── src/
│   │   ├── controllers/    # Controladores de lógica de negocio y cálculo de pagos
│   │   ├── middleware/     # Autenticación JWT y manejador de errores
│   │   ├── routes/         # Rutas de la API (/api/auth, /api/students, etc.)
│   │   └── index.js        # Punto de entrada Express
│   ├── .env.example
│   └── package.json
└── README.md
```

---

## 🚀 Instrucciones de Instalación y Ejecución

### 1. Servidor Backend (`/server`)

```bash
# Navegar a la carpeta del servidor
cd server

# Instalar dependencias
npm install

# Generar cliente de Prisma y crear la base de datos local
npm run prisma:push

# Sembrar datos de prueba (Crea usuario admin y estudiantes de ejemplo)
npm run seed

# Iniciar servidor de desarrollo (Puerto 5000)
npm run dev
```

### 2. Cliente Frontend (`/client`)

Abrir una nueva terminal:

```bash
# Navegar a la carpeta del cliente
cd client

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo Vite (Puerto 5173)
npm run dev
```

Abrir la aplicación en el navegador: **`http://localhost:5173`**

---

## 🔐 Credenciales del Panel de Administración

- **Ruta de Login**: `http://localhost:5173/admin/login`
- **Usuario**: `admin`
- **Contraseña**: `admin123`

---

## 💡 Funcionalidades Clave

1. **Indicadores de Pago Automáticos (Colores)**:
   - 🟢 **VERDE (Al Día)**: Próxima fecha de pago a más de 7 días.
   - 🟡 **AMARILLO (Próximo a Vencer)**: Quedan 7 días o menos para el vencimiento.
   - 🔴 **ROJO (Pago Vencido)**: La fecha de pago ha expirado.
2. **Recálculo Automático**: Al registrar un nuevo pago en el modal del estudiante, el sistema calcula automáticamente la nueva fecha de pago según su periodicidad (Mensual, Trimestral o Anual).
3. **Filtros Avanzados y Exportación**: Filtrado por estado de cobranza, club y búsqueda por nombre/cédula + exportación instantánea a CSV.
4. **Sección de Contenido y Reproductor**: Soporte para insertar artículos técnicos con video embebido de YouTube.
