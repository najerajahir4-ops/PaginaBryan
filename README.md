# Academia de Taekwondo & Kickboxing - Proyecto Full-Stack

Aplicación web completa construida desde cero con arquitectura desacoplada en `/client` y `/server`. Cuenta con un portal público informativo y un panel de administración privado con autenticación JWT y gestión de cobros automatizada, control de grados de Taekwondo y Kickboxing, y un sistema integrado para gestionar contenido web, alumnos destacados, imágenes y asitencia.

---

## 🛠️ Stack Tecnológico

- **Frontend (`/client`)**: React 18, Vite, TailwindCSS, Lucide-React, React Router DOM v6, Recharts, Axios.
- **Backend (`/server`)**: Node.js, Express.js, Prisma ORM, JWT (JSON Web Tokens), Bcrypt.js, CORS, Cookie Parser.
- **Base de Datos**: PostgreSQL / SQLite (configurado por defecto con SQLite para pruebas locales inmediatas de cero configuración).
- **Despliegue**: Preparado y configurado en Vercel (monorepo usando `vercel.json`).

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
├── vercel.json             # Configuración de despliegue para Vercel
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

- **Ruta de Login**: `http://localhost:5173/admin/login` (O tu dominio en producción)
- **Usuario**: `admin`
- **Contraseña**: `admin123`

---

## 💡 Funcionalidades Clave

1. **Indicadores de Pago Automáticos (Colores)**:
   - 🟢 **VERDE (Al Día)**: Próxima fecha de pago a más de 7 días.
   - 🟡 **AMARILLO (Próximo a Vencer)**: Quedan 7 días o menos para el vencimiento.
   - 🔴 **ROJO (Pago Vencido)**: La fecha de pago ha expirado.
2. **Recálculo Automático**: Al registrar un nuevo pago en el modal del estudiante, el sistema calcula automáticamente la nueva fecha de pago según su periodicidad (Mensual, Trimestral o Anual).
3. **Filtros Avanzados y Exportación**: Filtrado por estado de cobranza y búsqueda por nombre/cédula + exportación instantánea a CSV.
4. **Gestión de Grados**: Soporte nativo y diferenciado para cinturones en modalidades de **Taekwondo** y **Kickboxing**.
5. **Sección de Contenido y Reproductor**: Soporte para insertar artículos técnicos con video embebido de YouTube.

---

## 🌐 Subir Cambios a Vercel (Despliegue)

Este proyecto está sincronizado con **Vercel** a través de Git. Esto significa que Vercel se encarga automáticamente de compilar y actualizar la página web en vivo cada vez que subes un nuevo cambio al repositorio.

**Cada vez que hagas un cambio en el código, debes seguir estos 3 comandos en tu terminal (en la raíz del proyecto) para que se reflejen en la web:**

```bash
# 1. Agrega todos los archivos modificados
git add .

# 2. Guarda los cambios con un mensaje descriptivo (puedes cambiar el texto entre comillas)
git commit -m "Descripción de los cambios realizados"

# 3. Sube los cambios al repositorio (esto dispara automáticamente la actualización en Vercel)
git push
```

Una vez ejecutado el `git push`, solo debes esperar un par de minutos y recargar tu página web pública para ver los cambios aplicados exitosamente.
