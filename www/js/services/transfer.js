/**
 * SERVICE - Transfer Service
 * Menangani operasi transfer (Online & Overbooking)
 */
const TransferService = {
    /**
     * Execute transfer
     * @param {Object} transferData - Data transfer
     * @returns {Promise<Object>}
     */
    async executeTransfer(transferData) {
        try {
            AppState.setLoading(true);
            
            // Build payload sesuai format API Laravel
            const payload = {
                from_account: AppState.user.accountNumber,
                to_account: transferData.rekening,
                amount: transferData.jumlah,
                layanan_transaksi: transferData.layanan,
                keterangan: transferData.keterangan || '-'
            };
            
            Utils.log('TransferService', 'Executing transfer:', payload);
            
            const response = await HttpClient.post(Config.ENDPOINTS.TRANSFER, payload);
            const result = ResponseHandler.handleTransferResponse(response);
            
            if (result.success) {
                // Update saldo lokal jika dikembalikan
                if (result.newBalance !== null) {
                    AppState.setUser({ balance: result.newBalance });
                }
                
                // Clear pending transfer
                AppState.clearPendingTransfer();
            }
            
            return result;
            
        } catch (error) {
            Utils.logError('TransferService', 'Transfer error:', error);
            return {
                success: false,
                message: error.message || 'Gagal melakukan transfer'
            };
        } finally {
            AppState.setLoading(false);
        }
    },
    
    /**
     * Prepare transfer online (antar bank)
     * @param {Object} formData - Form data
     * @returns {Object} - Prepared transfer data
     */
    prepareTransferOnline(formData) {
        return {
            type: 'online',
            bank: formData.bank,
            rekening: Validator.sanitize(formData.rekening),
            jumlah: Validator.parseAmount(formData.jumlah),
            keterangan: Validator.sanitize(formData.keterangan) || '-',
            layanan: Config.LAYANAN.ANTAR_BANK,
            biayaAdmin: 6500 // Biaya admin antar bank
        };
    },
    
    /**
     * Prepare transfer overbooking (sesama bank)
     * @param {Object} formData - Form data
     * @returns {Object} - Prepared transfer data
     */
    prepareTransferOverbooking(formData) {
        return {
            type: 'overbooking',
            rekening: Validator.sanitize(formData.rekening),
            jumlah: Validator.parseAmount(formData.jumlah),
            keterangan: Validator.sanitize(formData.keterangan) || '-',
            layanan: Config.LAYANAN.SESAMA_BANK,
            biayaAdmin: 0 // GRATIS sesama bank
        };
    }
};
