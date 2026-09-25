const { ZodError } = require('zod');
const ApiResponse = require('../utils/apiResponse');

function errorHandler(err, req, res, next) {
  // Error de validación Zod
  if (err instanceof ZodError) {
    const list = err.issues || err.errors || [];
    const errorMessages = list.map((e) => ({
      campo: e.path.join('.'),
      mensaje: e.message,
    }));
    return ApiResponse.error(res, 'Error de validación en los datos enviados', 400, {
      errores: errorMessages,
    });
  }

  // Error de negocio con código específico (ej. 422 para error de catálogo/referencia, 404)
  if (err.statusCode) {
    return ApiResponse.error(res, err.message, err.statusCode, err.details || null);
  }

  // Errores de MySQL
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return ApiResponse.error(
      res,
      'Error de integridad referencial: el ID de misión no existe en el catálogo.',
      422
    );
  }

  if (err.code === 'ECONNREFUSED') {
    return ApiResponse.error(
      res,
      'No se pudo establecer conexión con la base de datos MySQL. Verifica que el servicio esté activo y las credenciales en el archivo .env sean correctas.',
      503
    );
  }

  // Error genérico no controlado
  console.error('[SERVER ERROR]:', err);
  return ApiResponse.error(
    res,
    process.env.NODE_ENV === 'production'
      ? 'Ocurrió un error interno en el servidor'
      : err.message || 'Error interno del servidor',
    500
  );
}

module.exports = errorHandler;
