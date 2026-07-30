const { z } = require('zod');

// Esquema de creación de estudiante
const studentCreateSchema = z.object({
  nombres: z.string().min(1, 'Nombres es requerido'),
  apellidos: z.string().min(1, 'Apellidos es requerido'),
  cedula: z.string().min(1, 'Cédula es requerida'),
  fechaNacimiento: z.string().min(1, 'Fecha de nacimiento es requerida'),
  edad: z.union([z.string(), z.number()]).transform(val => parseInt(val, 10)),
  celular: z.string().optional().default(''),
  direccion: z.string().optional().default(''),
  correo: z.string().optional().default(''),
  horarioElegido: z.string().min(1, 'Horario es requerido'),
  alergias: z.string().optional(),
  enfermedades: z.string().optional(),
  lesiones: z.string().optional(),
  contactoEmergencia: z.string().min(1, 'Contacto de emergencia es requerido'),
  nombreRepresentante: z.string().optional(),
  cedulaRepresentante: z.string().optional(),
  celularRepresentante: z.string().optional(),
  comoSeEntero: z.string().optional(),
  autorizaImagen: z.boolean().optional().default(false),
  diaDeCobro: z.union([z.string(), z.number()]).transform(val => parseInt(val, 10) || 1).optional(),
  modalidad: z.string().optional().default('TAEKWONDO'),
  clubId: z.union([z.string(), z.number()]).transform(val => (val ? parseInt(val, 10) : null)).optional(),
  grado: z.string().min(1, 'Grado es requerido'),
  fechaIngreso: z.string().optional(),
  fechaUltimoPago: z.string().optional(),
  periodicidadPago: z.string().optional().default('MENSUAL'),
  foto: z.string().optional().default(''),
});

// Esquema de actualización de estudiante (algunos campos pueden ser omitidos o null)
const studentUpdateSchema = studentCreateSchema.partial().extend({
  estado: z.string().optional(),
});

module.exports = {
  studentCreateSchema,
  studentUpdateSchema,
};
