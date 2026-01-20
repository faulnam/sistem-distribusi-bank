/**
 * API ROUTES - Mutasi Rekening
 */
import { Router } from 'express';
import { TransactionService } from '../services/transactionService.js';
import { successResponse } from '../core/utils.js';

const router = Router();

/**
 * GET /api/mutasi/:account
 * Get account mutations
 */
router.get('/:account', async (req, res, next) => {
    try {
        const { account } = req.params;
        const { start_date, end_date } = req.query;
        
        const mutasi = await TransactionService.getMutasi(account, {
            start_date,
            end_date
        });
        
        return successResponse(res, { mutasi }, 'Berhasil mengambil mutasi');
    } catch (error) {
        next(error);
    }
});

export default router;
