# Documentación de Mejoras y Nuevas Funcionalidades (Julio 2026)

Este archivo contiene el historial completo de los cambios y nuevas características agregadas al sistema de **Najera's Team Central** para asegurar la continuidad y comprensión en futuras sesiones de desarrollo.

---

## 1. Módulo de Control de Asistencia (Backend & Frontend)

Se ha diseñado un módulo completo para llevar el control diario de la asistencia de los alumnos activos de la academia.

### Base de Datos (Prisma & SQLite)
* **Archivo:** `server/prisma/schema.prisma`
* **Modelo Creado:** `Attendance`
  * `id`: Identificador único (autoincrementable).
  * `studentId`: Relación de clave foránea con el modelo `Student` (elimina en cascada).
  * `fecha`: String en formato `YYYY-MM-DD` (facilita filtrados).
  * `estado`: Estado de asistencia (`PRESENTE`, `AUSENTE`, `TARDE`, `JUSTIFICADO`).
  * `createdAt`: Fecha de creación.
  * **Índice Único Compuesto:** `@@unique([studentId, fecha])` para evitar registros de asistencia duplicados del mismo estudiante en una sola fecha.

### API Backend (Express)
* **Rutas:** `server/src/routes/attendanceRoutes.js`
* **Controlador:** `server/src/controllers/attendanceController.js`
* **Endpoints:**
  * `GET /api/attendance?fecha=YYYY-MM-DD` - Retorna los alumnos activos y adjunta su estado de asistencia del día.
  * `POST /api/attendance` - Crea o actualiza en tiempo real la asistencia de un alumno (`upsert`).
  * `POST /api/attendance/bulk` - Permite registrar asistencias en lote (ej. marcar a todos como presentes) en una transacción.
  * `DELETE /api/attendance` - Borra el registro de asistencia de un estudiante para la fecha dada.
  * `GET /api/attendance/history` - Retorna la lista de fechas registradas con sus respectivas estadísticas agrupadas (total presentes, ausentes, etc.).
  * `GET /api/attendance/report` - Retorna las métricas acumuladas por estudiante (clases totales, inasistencias desglosadas y porcentaje de presentismo promedio).

### Interfaz del Panel de Administración (React)
* **Archivo:** `client/src/pages/admin/AsistenciaAdmin.jsx`
* **Pestañas Implementadas:**
  1. **Registrar Día:** Selector de fecha con estadísticas interactivas del día. Permite marcar asistencia por estudiante con autoguardado inmediato y ofrece el botón rápido de "Marcar todos presentes".
  2. **Historial por Fechas:** Historial cronológico que lista los días con asistencia tomada y un botón para cargar/editar esa fecha de inmediato.
  3. **Reporte por Alumno:** Listado de alumnos con su % acumulado y una barra de progreso de color (Verde >80%, Amarillo >=50%, Rojo <50%).

---

## 2. Eliminación del Apartado de Estadísticas (Dashboard)

A petición del usuario, se ha removido el Dashboard de estadísticas generales y reajustado los redireccionamientos:
* **Navbar Público:** El botón "PANEL ADMIN" redirige a `/admin/estudiantes`.
* **Login de Administración:** Al autenticarse, navega directamente a `/admin/estudiantes`.
* **Navbar Admin:** Se quitó la pestaña "Estadísticas".
* **Rutas:** Se eliminó la ruta `/admin/dashboard` y su importación asociada en `App.jsx`.

---

## 3. Optimización de la Ficha de Estudiante (EstudiantesAdmin.jsx)

Se realizaron mejoras clave para evitar confusión y agilizar el registro:

### Cinturones / Grados Dinámicos por Disciplina
* Se agregaron listas estáticas y limpias para los cinturones de cada modalidad:
  * **Taekwondo:** Desde `Cinturón Blanco (10° Kup)` hasta `Cinturón Negro (1° Dan)` (sin descripciones largas).
  * **Kickboxing:** `Cinturón blanco`, `Cinturón blanco amarillo`, `Cinturón naranja`, `Cinturón verde`, `Cinturón violeta`, `Cinturón café` y `Cinturón negro 1 dan`.
* El campo de **Grado** en el formulario se convirtió en un `<select>` interactivo. Al alternar la modalidad (Taekwondo o Kickboxing), la lista de cinturones cambia automáticamente y selecciona el primer grado de la disciplina.

### Separación del Contacto de Emergencia
* **Problema:** Un único campo de texto para nombre y celular resultaba confuso de registrar.
* **Solución:** Se dividió en el frontend en dos campos específicos:
  * `contactoEmergenciaNombre` (Nombre del contacto)
  * `contactoEmergenciaCelular` (Número móvil)
* **Compatibilidad de Base de Datos:** Para evitar costosas migraciones y pérdida de datos existentes en SQLite, el cliente concatena ambos campos como `"Nombre - Celular"` antes de enviarlos a la base de datos, y los separa mediante `.split(' - ')` al cargar los datos en el modal de edición.

### Remoción de Secciones Innecesarias
* Se eliminaron por completo del modal de la Ficha de Inscripción y del formato imprimible en PDF:
  * La sección **5. Autorización de Imagen** (con su respectiva casilla de verificación y textos legales).
  * La línea y marcador de **Firma del Alumno o Representante** (dejando únicamente la firma del Director Técnico en la versión PDF por coherencia administrativa).
  * El campo **Día de Cobro** (removido del listado principal de estudiantes en el panel, del formulario modal de edición y de la ficha imprimible en PDF).

---

## 4. Visualización y Gestión de Grados de Alumnos (Grados.jsx)

Se implementó el cuadro de honor público para alumnos activos con un editor directo in-situ para administradores.
* **Acceso Rápido:** Se reajustó la tarjeta **Grados** de la página de inicio (`Home.jsx`) para dirigir a `/grados` en vez de `/quienes-somos`.
* **Vista Pública:** [Grados.jsx](file:///c:/Users/najer/OneDrive/Desktop/PAGINABRYAN/client/src/pages/Grados.jsx)
  * Muestra una galería interactiva con la foto del alumno, su nombre, cédula y el cinturón/grado en el que se encuentra.
  * Cuenta con filtros rápidos para disciplinas (Taekwondo / Kickboxing) y un motor de búsqueda por nombre/cédula.
  * Si el alumno no cuenta con foto, renderiza un avatar genérico por defecto de forma elegante.
* **Edición Directa para Admin:**
  * Si un administrador tiene sesión activa (`isAuthenticated === true`), se habilita un botón flotante de edición en la tarjeta del alumno.
  * Abre un modal liviano para ingresar la **URL de la Foto** y seleccionar el **Grado / Cinturón** correspondiente según su modalidad.
  * Actualiza la información enviando los datos directamente a la API (`PUT /api/students/:id`).

---

## 5. Integración con WhatsApp en Formulario de Contacto (Contactos.jsx)

Se modificó el comportamiento del botón del formulario de contactos públicos:
* **Redirección Directa:** En vez de una alerta simple, al presionar **Enviar Mensaje**, el formulario recopila los campos ingresados por el visitante.
* **Número de Destino:** Redirige al número oficial `+593 98 324 4247` en WhatsApp.
* **Mensaje Personalizado y Con Formato:** Genera de forma dinámica un mensaje con formato de negritas (`*`) e información estructurada (Nombre, Email, Teléfono, Asunto y Mensaje original).
  * **Compatibilidad de Emojis:** Se eliminaron los emojis gráficos originales de la cadena de texto y se reemplazaron por viñetas convencionales (`-`) para evitar errores de renderizado de caracteres rotos (rombos con signo de interrogación ``) en ciertos navegadores o sistemas operativos Windows sin soporte Unicode nativo en URLs de WhatsApp.
  * Abre automáticamente una ventana/pestaña nueva en WhatsApp Web o la App oficial pre-cargando este texto.

---

## 6. Actualización de Credenciales del Administrador

Se actualizaron los datos de acceso para el panel administrativo de Najera's Team:
* **Usuario Nuevo:** `arturo321` (anteriormente `admin`)
* **Contraseña Nueva:** `1999` (anteriormente `admin123`)
* **Actualización en Base de Datos:** Se ejecutó un script personalizado de Prisma para encriptar la nueva contraseña con `bcrypt` (10 rounds) y actualizar la fila correspondiente en la base de datos SQLite sin comprometer la información existente de los alumnos o pagos.
* **Formulario de Acceso:** Se modificaron los valores iniciales y la ayuda visual en la pantalla de inicio de sesión (`AdminLogin.jsx`) para que autocomplete y muestre el usuario y contraseña nuevos.
* **Seguridad para Producción:** Con el inicio del uso real de la plataforma, se removió el autocompletado automático de credenciales en el estado del componente React y se eliminó por completo el bloque informativo de credenciales de prueba al pie del formulario. Adicionalmente, se quitaron las sugerencias visuales de los atributos `placeholder` de los campos de texto, dejándolos totalmente en blanco para evitar cualquier fuga involuntaria del usuario administrador en la interfaz.
* **Semillero de Datos:** Se actualizó `seed.js` para asegurar que las nuevas credenciales se utilicen en caso de reinicializar la base de datos en el futuro.

---

## 7. Ocultación del Acceso Administrativo (Acceso Secreto)

Para evitar la curiosidad de los usuarios generales y mantener el panel de administración privado y de uso exclusivo para el jefe:
* **Remoción del Botón Público:** Se eliminó por completo el botón rojo de **"INGRESAR"** y **"INGRESAR ADMIN"** de la barra de navegación superior (tanto en la vista de escritorio como en el menú desplegable móvil de `Navbar.jsx`).
* **Estado de Sesión Activo:** Si el administrador está autenticado, la barra de navegación seguirá mostrando el botón **"PANEL ADMIN"** y **"Salir"** de manera normal para facilitar su navegación.
* **Enlace Discreto en Footer:** Se agregó un enlace de navegación estándar llamado **"ÁREA TÉCNICA"** en la sección de enlaces de navegación de [Footer.jsx](file:///c:/Users/najer/OneDrive/Desktop/PAGINABRYAN/client/src/components/Footer.jsx).
  * Tiene la misma tipografía, tamaño y color que los otros enlaces del menú (como "Inicio" o "Contactos"), por lo que se integra estéticamente con el sitio web público.
  * Al hacer clic, redirige al inicio de sesión `/admin/login`.
  * Se removió la idea inicial del punto oculto en el copyright por ser demasiado imperceptible.

---

## 8. Simplificación de Contactos de Responsables (Contactos.jsx)

Se simplificó la presentación del personal directivo en la página de contactos públicos:
* **Contactos Removidos:** Se eliminaron las tarjetas de "Prof. Santiago Ramírez" (Coordinador Técnico de Kickboxing) y "Lic. Elena Castro" (Directora de Eventos & Admisiones).
* **Contacto Central:** Se mantuvo únicamente al "Mtro. Bryan Nájera" como Director General y Head Coach.
* **Diseño Centrado:** Se reestructuró la grilla para que la única tarjeta de contacto aparezca perfectamente centrada con un ancho máximo de `max-w-md` y alineación `flex justify-center`, optimizando el balance visual del sitio.

---

## 9. Reordenamiento Interactivo Drag & Drop (FeaturedStudent y Content)

Se implementó una solución robusta para ordenar interactivamente las tarjetas en las páginas públicas y persistir el orden en base de datos.
* **Modelo e Infraestructura:**
  * Se añadió el campo `orden Int @default(0)` a los modelos `FeaturedStudent` (Alumnos Destacados) y `Content` (Artículos de Biblioteca/Contenido) en SQLite.
  * Se ejecutó un script de backfill (`backfill_order.js`) para asignarles un orden inicial incremental basado en su fecha de creación.
* **API (Backend):**
  * Se crearon los endpoints `PATCH /api/featured-students/reorder` y `PATCH /api/content/reorder` protegidos con middleware de sesión de administrador.
  * Estos endpoints procesan el nuevo orden de IDs en una transacción de base de datos (`prisma.$transaction`).
  * Se actualizaron los controladores `getFeaturedStudents` y `getAllContent` para ordenar por `orden asc` por defecto.
* **Interfaz (Frontend):**
  * Integración de `@dnd-kit/core` y `@dnd-kit/sortable` para la manipulación visual suave de arrastre.
  * **Modo Edición Inline:** Un botón flotante de lápiz (✏️) en la esquina inferior derecha aparece únicamente cuando el administrador está logueado.
  * Al activarlo, cada tarjeta muestra un handle (☰) en la esquina superior derecha que permite arrastrar y reposicionar las tarjetas.
  * **Validación de Filtros:** Se bloquea el modo edición si el usuario tiene aplicados filtros de categoría o disciplina, mostrando un aviso descriptivo para guiar al usuario a seleccionar "TODOS" antes de ordenar.
  * **Notificaciones Toast:** Notifica de forma inmediata ("Orden guardado con éxito" o error correspondiente) tras soltar y actualizar el orden en el servidor.

---

## 10. Mejoras de Usabilidad del Panel Admin (Paso 1)

### Simplificación de Acciones en Fichas & Pagos (`EstudiantesAdmin.jsx`)
* **Acciones Principales:** Se redujo la columna de acciones en la tabla de alumnos a solo 2 botones visibles: `Registrar Pago` (verde) y `Ver / Editar Ficha` (amarillo).
* **Acciones Secundarias (Kebab):** Se creó un menú desplegable tipo kebab de tres puntos (`⋮`) que agrupa:
  * Historial de Asistencia
  * Descargar Ficha PDF
  * Eliminar Alumno (manteniendo confirmación nativa).
* **Robustez UX:** Se implementó detección de clic externo (`click outside`) a nivel de ventana para cerrar automáticamente cualquier menú kebab abierto.

### Corrección de Nombre Vacío en Alumnos Destacados (`AlumnosDestacadosAdmin.jsx`)
* **Diagnóstico del Bug:** El frontend buscaba `student.nombreCompleto`, pero la base de datos y la API solo retornan `nombres` y `apellidos`. Esto provocaba que el nombre apareciera en blanco en la tabla y en el select del modal.
* **Solución Aplicada:**
  * Se modificó la tabla para concatenar `{student.nombres} {student.apellidos}`.
  * Se actualizó el select en el modal para listar a los estudiantes concatenando sus nombres y apellidos junto con la cédula.
  * Se configuró la opción por defecto en el select como vacía (`""`) e incorporó el atributo `required` para asegurar la validación interactiva nativa del HTML5 antes de enviar el formulario.

### Agregar Avatares a la Tabla de Alumnos Destacados (`AlumnosDestacadosAdmin.jsx`)
* **Diseño e Integración:** Se añadió una miniatura redonda (avatar) con la foto de perfil del estudiante (`student.foto`) al lado de su nombre y apellido en cada fila de la tabla.
* **Mecanismo de Fallback:** Si el alumno no cuenta con una URL de foto asignada, se despliega un círculo con las iniciales de sus nombres y apellidos sobre un fondo azul y letras doradas, conservando exactamente el mismo estilo estético que en la pantalla de Asistencia.

---

## 11. Corrección de Políticas CORS para Producción

Se solucionó un bloqueo de seguridad (CORS) que impedía al frontend comunicarse con el backend en el entorno de producción de Vercel.
* **Configuración del Servidor (`server/src/index.js`):** Se agregó explícitamente el dominio de producción `https://paginabryan-db.vercel.app` a la lista de `allowedOrigins`, permitiendo que las peticiones del panel de administración fluyan correctamente hacia la base de datos sin ser bloqueadas por el navegador.

---

## 12. Simplificación del Formulario de Contacto (Contactos.jsx)

A petición del usuario, se eliminaron los campos de recolección de correo electrónico y teléfono para agilizar el proceso de contacto.
* **Interfaz:** Se removieron los campos **"Email"** y **"Teléfono"** del formulario visual público.
* **Mensaje de WhatsApp:** Se actualizó la estructura del texto generado que se envía por WhatsApp para que ya no incluya las variables de correo electrónico ni teléfono, manteniendo un formato aún más limpio y directo.














