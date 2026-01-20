/**
 * SERVER MIDDLEWARE - Authentication
 */
import jwt from 'jsonwebtoken';
import { Config } from '../core/config.js';
import { errorResponse } from '../core/utils.js';

export function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return errorResponse(res, 'Token tidak ditemukan', 401);
        }
        
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, Config.JWT.SECRET);
        
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return errorResponse(res, 'Token sudah expired', 401);
        }
        return errorResponse(res, 'Token tidak valid', 401);
    }
}

// Optional auth - tidak wajib login
export function optionalAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, Config.JWT.SECRET);
            req.user = decoded;
        }
        
        next();
    } catch (error) {
        next();
    }
}

export default authMiddleware;
