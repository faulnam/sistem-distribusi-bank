/**
 * API ROUTES - Histori Transaksi
 */
import { Router } from 'express';
import { TransactionService } from '../services/transactionService.js';
import { successResponse } from '../core/utils.js';

const router = Router();

/**
 * GET /api/histori/:account
 * Get transaction history
 */
router.get('/:account', async (req, res, next) => {
    try {
        const { account } = req.params;
        const { start_date, end_date, type } = req.query;
        
        const transactions = await TransactionService.getHistori(account, {
            start_date,
            end_date,
            type
        });
        
        return successResponse(res, { transactions }, 'Berhasil mengambil histori');
    } catch (error) {
        next(error);
    }
});

export default router;
