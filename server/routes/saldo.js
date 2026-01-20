/**
 * API ROUTES - Account (Saldo)
 */
import { Router } from 'express';
import { AccountService } from '../services/accountService.js';
import { successResponse, errorResponse } from '../core/utils.js';
import { authMiddleware, optionalAuth } from '../middleware/auth.js';

const router = Router();

/**
 * GET /api/saldo/:account
 * Get saldo by account number
 */
router.get('/:account', async (req, res, next) => {
    try {
        const { account } = req.params;
        
        const result = await AccountService.getSaldo(account);
        
        return successResponse(res, result, 'Berhasil mengambil saldo');
    } catch (error) {
        next(error);
    }
});

export default router;
