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

---

## 📅 Registro de Mejoras (Actualización Reciente)

Se ha realizado una revisión integral del sistema empleando **Skills avanzadas de IA** para pulir la interfaz, la legibilidad y asegurar el proyecto.

### Mejoras de Interfaz (UI/UX)
- **Corrección de Bugs Visuales:** Eliminación de bordes residuales y problemas de *overflow* que rompían el layout.
- **Panel Administrativo (Fichas & Pagos):** Refinamiento tipográfico eliminando la pesada fuente *Anton* para datos crudos, reemplazándola por *Manrope* en grosores medianos, aumentando enormemente la legibilidad de las tablas.
- **Rediseño Premium del Inicio (Hero Section):** Transformación del diseño estático 50/50. El logo se integró como una marca de agua texturizada en el fondo (con un degradado suave para evitar cortes abruptos), se ajustaron las jerarquías de texto, el ritmo espacial entre secciones y se creó un botón moderno.
- **Etiquetas Editoriales:** Se reemplazaron los "badges" genéricos encajonados (ej. en la sección de Contactos) por subtítulos de lujo con líneas finas, aportando un look de revista.
- **Motor de Artículos (Markdown):** Se eliminó el antiguo e inflexible *ContentCard*. Ahora la sección de Contenido utiliza `react-markdown` y el plugin oficial de lectura `@tailwindcss/typography` (con un estilo personalizado `prose-dorado`), permitiendo anchos de lectura más generosos y asegurando que ninguna palabra enviada desde el panel se pierda.
- **Automatización de Contenido (Admin):** Se incluyó un botón de "+ Insertar Plantilla Base" en el creador de publicaciones para facilitar el formateo perfecto vía Markdown de forma automática.
### Auditoría de Seguridad
- Se verificó la robustez de la arquitectura backend: el uso correcto de `bcryptjs` para contraseñas, la inyección SQL prevenida gracias a `Prisma`, y la sesión asegurada vía `JWT` con cookies `httpOnly`.
- Se parcharon de forma segura vulnerabilidades en dependencias NPM de terceros tanto en el frontend (`nanoid`, `react-router`, `postcss`) como en el backend (`ip-address`), manteniendo la estabilidad del código.

### 🤖 Skills de IA Integradas en el Proyecto (`.agents/skills`)
El agente ha sido potenciado con las siguientes habilidades instaladas localmente en el repositorio:
1. **`interface-design`**: Empleada para elevar el estándar visual del diseño, aplicar jerarquía y ritmo espacial en las vistas principales.
2. **`impeccable`**: Utilizada para pulir detalles de legibilidad, tipografía y experiencia de usuario en las tablas de datos.
3. **`security-and-hardening`**: Aplicada para auditar y aplicar prácticas de endurecimiento de código, rate limits, y auditoría de vulnerabilidades NPM.
4. **`find-skills`**: Usada como motor de descubrimiento para instalar las herramientas anteriores de manera autónoma.
5. **`vercel-react-best-practices`**: Para asegurar lineamientos de rendimiento y optimización.
