/**
 * API ROUTES - Authentication
 */
import { Router } from 'express';
import { UserService } from '../services/userService.js';
import { validateRegister, validateLogin } from '../middleware/validator.js';
import { successResponse, errorResponse } from '../core/utils.js';

const router = Router();

/**
 * POST /api/auth/register
 * Register new user
 */
router.post('/register', validateRegister, async (req, res, next) => {
    try {
        const { name, email, password, phone, address } = req.body;
        
        const user = await UserService.register({
            name, email, password, phone, address
        });
        
        return successResponse(res, { user }, 'Registrasi berhasil', 201);
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', validateLogin, async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        const result = await UserService.login(email, password);
        
        return successResponse(res, result, 'Login berhasil');
    } catch (error) {
        next(error);
    }
});

export default router;
