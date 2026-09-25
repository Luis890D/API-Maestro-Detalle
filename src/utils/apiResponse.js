/**
 * Helper para estandarizar respuestas HTTP de la API
 */
class ApiResponse {
  static success(res, data = null, message = 'Operación exitosa', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static error(res, message = 'Ocurrió un error en el servidor', statusCode = 500, details = null) {
    const payload = {
      success: false,
      error: message,
    };
    if (details) {
      payload.detalles = details;
    }
    return res.status(statusCode).json(payload);
  }
}

module.exports = ApiResponse;
