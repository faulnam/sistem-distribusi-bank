/**
 * API ROUTES - Transfer
 */
import { Router } from 'express';
import { TransactionService } from '../services/transactionService.js';
import { validateTransfer } from '../middleware/validator.js';
import { successResponse, errorResponse } from '../core/utils.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

/**
 * POST /api/transfer
 * Transfer money
 */
router.post('/', validateTransfer, async (req, res, next) => {
    try {
        const { from_account, to_account, amount, layanan_transaksi, keterangan } = req.body;
        
        const result = await TransactionService.transfer(
            from_account,
            to_account,
            parseFloat(amount),
            layanan_transaksi || 'LAYANANA',
            keterangan
        );
        
        return successResponse(res, result, 'Transfer berhasil');
    } catch (error) {
        next(error);
    }
});

export default router;
