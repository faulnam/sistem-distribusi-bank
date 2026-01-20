/**
 * SERVER MIDDLEWARE - Error Handler
 */
import { errorResponse } from '../core/utils.js';

export function errorHandler(err, req, res, next) {
    console.error('❌ Error:', err);
    
    // MySQL errors
    if (err.code === 'ER_DUP_ENTRY') {
        return errorResponse(res, 'Data sudah ada', 400);
    }
    
    if (err.code === 'ECONNREFUSED') {
        return errorResponse(res, 'Database tidak dapat dihubungi', 500);
    }
    
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return errorResponse(res, 'Token tidak valid', 401);
    }
    
    // Default error
    return errorResponse(
        res, 
        err.message || 'Internal Server Error', 
        err.statusCode || 500
    );
}

// Not found handler
export function notFoundHandler(req, res) {
    return errorResponse(res, `Route ${req.method} ${req.url} tidak ditemukan`, 404);
}

export default { errorHandler, notFoundHandler };
