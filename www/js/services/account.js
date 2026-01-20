/**
 * SERVICE - Account Service
 * Menangani operasi terkait akun dan saldo
 */
const AccountService = {
    /**
     * Fetch saldo dari server
     * @returns {Promise<Object>} - User data dengan saldo terbaru
     */
    async getSaldo() {
        try {
            AppState.setLoading(true);
            
            const endpoint = `${Config.ENDPOINTS.SALDO}/${AppState.user.accountNumber}`;
            const response = await HttpClient.get(endpoint);
            
            const userData = ResponseHandler.handleSaldoResponse(response);
            AppState.setUser(userData);
            
            return {
                success: true,
                data: userData
            };
            
        } catch (error) {
            Utils.logError('AccountService', 'getSaldo error:', error);
            return {
                success: false,
                message: error.message || 'Gagal mengambil data saldo'
            };
        } finally {
            AppState.setLoading(false);
        }
    },
    
    /**
     * Refresh all account data
     * @returns {Promise<Object>}
     */
    async refreshAccountData() {
        return await this.getSaldo();
    }
};
