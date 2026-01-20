/**
 * MIDDLEWARE - Response Handler
 * Memproses dan menormalisasi response dari API
 */
const ResponseHandler = {
    /**
     * Handle saldo response
     * @param {Object} response - Raw API response
     * @returns {Object} - Normalized user data
     */
    handleSaldoResponse(response) {
        const data = response.data;
        
        // API response format dari server:
        // { account: "...", balance: "..." } atau
        // { name: "...", balance: "...", account_number: "..." }
        
        return {
            name: data.name || data.account || data.nama || AppState.user.name,
            accountNumber: data.account_number || data.no_rekening || AppState.user.accountNumber,
            balance: parseFloat(data.balance || data.saldo) || 0
        };
    },
    
    /**
     * Handle transfer response
     * @param {Object} response - Raw API response
     * @returns {Object} - Normalized transfer result
     */
    handleTransferResponse(response) {
        const data = response.data;
        
        return {
            success: data.status === 'success' || data.success === true,
            message: data.message || 'Transfer berhasil',
            newBalance: parseFloat(data.new_balance || data.saldo_baru) || null,
            transactionId: data.transaction_id || data.id || null,
            timestamp: data.timestamp || data.created_at || new Date().toISOString()
        };
    },
    
    /**
     * Handle histori response
     * @param {Object} response - Raw API response
     * @returns {Array} - Normalized transaction list
     */
    handleHistoriResponse(response) {
        const data = response.data;
        
        // Handle jika data adalah array langsung atau ada di property tertentu
        const transactions = Array.isArray(data) ? data : (data.transactions || data.data || []);
        
        return transactions.map(tx => ({
            id: tx.id || tx.transaction_id,
            date: tx.date || tx.tanggal || tx.created_at,
            description: tx.description || tx.keterangan || tx.deskripsi || '-',
            type: this.normalizeTransactionType(tx.type || tx.tipe || tx.jenis),
            amount: parseFloat(tx.amount || tx.jumlah) || 0,
            balance: parseFloat(tx.balance || tx.saldo) || 0
        }));
    },
    
    /**
     * Handle mutasi response
     * @param {Object} response - Raw API response
     * @returns {Array} - Normalized mutasi list
     */
    handleMutasiResponse(response) {
        const data = response.data;
        
        // Handle jika data adalah array langsung atau ada di property tertentu
        const mutasi = Array.isArray(data) ? data : (data.mutasi || data.data || []);
        
        return mutasi.map(m => ({
            id: m.id,
            date: m.date || m.tanggal || m.created_at,
            description: m.description || m.keterangan || '-',
            debit: parseFloat(m.debit || m.debet) || 0,
            credit: parseFloat(m.credit || m.kredit) || 0,
            balance: parseFloat(m.balance || m.saldo) || 0
        }));
    },
    
    /**
     * Normalize transaction type
     * @param {string} type - Raw type from API
     * @returns {string} - 'credit' or 'debit'
     */
    normalizeTransactionType(type) {
        if (!type) return 'debit';
        const t = type.toLowerCase();
        if (t.includes('credit') || t.includes('kredit') || t.includes('masuk') || t === 'cr') {
            return 'credit';
        }
        return 'debit';
    }
};
