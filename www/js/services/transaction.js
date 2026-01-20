/**
 * SERVICE - Transaction Service
 * Menangani histori transaksi dan mutasi rekening
 */
const TransactionService = {
    /**
     * Get histori transaksi
     * @param {Object} filters - Filter options (startDate, endDate, type)
     * @returns {Promise<Object>}
     */
    async getHistori(filters = {}) {
        try {
            AppState.setLoading(true);
            
            const endpoint = `${Config.ENDPOINTS.HISTORI}/${AppState.user.accountNumber}`;
            const params = {};
            
            if (filters.startDate) params.start_date = filters.startDate;
            if (filters.endDate) params.end_date = filters.endDate;
            if (filters.type && filters.type !== 'all') params.type = filters.type;
            
            const response = await HttpClient.get(endpoint, params);
            const transactions = ResponseHandler.handleHistoriResponse(response);
            
            AppState.setTransactions(transactions);
            
            return {
                success: true,
                data: transactions
            };
            
        } catch (error) {
            Utils.logError('TransactionService', 'getHistori error:', error);
            return {
                success: false,
                message: error.message || 'Gagal mengambil histori transaksi',
                data: []
            };
        } finally {
            AppState.setLoading(false);
        }
    },
    
    /**
     * Get mutasi rekening
     * @param {Object} filters - Filter options (startDate, endDate)
     * @returns {Promise<Object>}
     */
    async getMutasi(filters = {}) {
        try {
            AppState.setLoading(true);
            
            const endpoint = `${Config.ENDPOINTS.MUTASI}/${AppState.user.accountNumber}`;
            const params = {};
            
            if (filters.startDate) params.start_date = filters.startDate;
            if (filters.endDate) params.end_date = filters.endDate;
            
            const response = await HttpClient.get(endpoint, params);
            const mutasi = ResponseHandler.handleMutasiResponse(response);
            
            AppState.setMutasi(mutasi);
            
            return {
                success: true,
                data: mutasi
            };
            
        } catch (error) {
            Utils.logError('TransactionService', 'getMutasi error:', error);
            return {
                success: false,
                message: error.message || 'Gagal mengambil mutasi rekening',
                data: []
            };
        } finally {
            AppState.setLoading(false);
        }
    },
    
    /**
     * Get recent transactions (untuk dashboard)
     * @param {number} limit - Jumlah transaksi terakhir
     * @returns {Promise<Object>}
     */
    async getRecentTransactions(limit = 5) {
        const result = await this.getHistori({});
        
        if (result.success && result.data.length > 0) {
            return {
                success: true,
                data: result.data.slice(0, limit)
            };
        }
        
        return result;
    }
};
