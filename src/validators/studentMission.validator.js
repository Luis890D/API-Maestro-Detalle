const { z } = require('zod');

// Esquema individual de una misión en el detalle
const missionItemSchema = z.object({
  idMision: z.preprocess(
    (val) => Number(val),
    z.number({ invalid_type_error: 'El ID de la misión debe ser un número entero' }).int().positive()
  ),
  estado: z.preprocess(
    (val) => {
      if (typeof val === 'boolean') return val;
      if (val === 1 || val === '1' || val === 'true') return true;
      if (val === 0 || val === '0' || val === 'false') return false;
      return Boolean(val);
    },
    z.boolean()
  ),
});

// Normalizador flexible de payload (soporta "estudiante" anidado o atributos planos)
function normalizePayload(body) {
  if (!body || typeof body !== 'object') {
    throw new Error('El cuerpo de la petición debe ser un objeto JSON válido');
  }

  const estudianteRaw = body.estudiante || body.Estudiante || body;
  const carnet = (estudianteRaw.carnet || estudianteRaw.Carnet || '').toString().trim();
  const nombre = (estudianteRaw.nombre || estudianteRaw.Nombre || '').toString().trim();
  const correo = (estudianteRaw.correo || estudianteRaw.Correo || estudianteRaw.email || estudianteRaw.Email || '').toString().trim();

  const rawMisiones = body.misiones || body.Misiones || body.detalles || body.Detalles || [];

  if (!Array.isArray(rawMisiones)) {
    throw new Error('El campo "misiones" debe ser un arreglo de misiones');
  }

  const misiones = rawMisiones.map((m) => {
    const id = m.idMision ?? m.id_mision ?? m.misionId ?? m.MisionID ?? m.id ?? m.ID;
    const estado = m.estado ?? m.Estado ?? m.completada ?? m.Completada;
    return {
      idMision: id,
      estado: estado,
    };
  });

  return {
    estudiante: { carnet, nombre, correo },
    misiones,
  };
}

// Esquema Zod completo
const studentMasterDetailSchema = z.object({
  estudiante: z.object({
    carnet: z.string().min(1, 'El carnet del estudiante es requerido'),
    nombre: z.string().min(1, 'El nombre del estudiante es requerido'),
    correo: z.string().email('El correo electrónico no tiene un formato válido'),
  }),
  misiones: z.array(missionItemSchema).min(1, 'Debe incluir al menos una misión en el detalle'),
});

function validateStudentMasterDetail(body) {
  const normalized = normalizePayload(body);
  const parsed = studentMasterDetailSchema.parse(normalized);
  return parsed;
}

module.exports = {
  validateStudentMasterDetail,
  normalizePayload,
  studentMasterDetailSchema,
};
