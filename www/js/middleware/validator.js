/**
 * MIDDLEWARE - Validator
 * Validasi input sebelum dikirim ke API
 */
const Validator = {
    /**
     * Validate transfer data
     * @param {Object} data - Transfer form data
     * @returns {Object} - { valid: boolean, errors: string[] }
     */
    validateTransfer(data) {
        const errors = [];
        
        // Validasi rekening tujuan
        if (!data.rekening || data.rekening.trim() === '') {
            errors.push('Nomor rekening tujuan harus diisi');
        } else if (!Utils.isValidAccountNumber(data.rekening)) {
            errors.push('Nomor rekening tidak valid (4-20 digit angka)');
        }
        
        // Validasi jumlah
        if (!data.jumlah || isNaN(data.jumlah)) {
            errors.push('Jumlah transfer harus diisi');
        } else if (data.jumlah < 1000) {
            errors.push('Minimal transfer Rp 1.000');
        } else if (data.jumlah > AppState.user.balance) {
            errors.push('Saldo tidak mencukupi');
        }
        
        // Validasi transfer ke diri sendiri
        if (data.rekening === AppState.user.accountNumber) {
            errors.push('Tidak dapat transfer ke rekening sendiri');
        }
        
        return {
            valid: errors.length === 0,
            errors: errors
        };
    },
    
    /**
     * Validate date range
     * @param {string} startDate - Start date (YYYY-MM-DD)
     * @param {string} endDate - End date (YYYY-MM-DD)
     * @returns {Object} - { valid: boolean, errors: string[] }
     */
    validateDateRange(startDate, endDate) {
        const errors = [];
        
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            
            if (start > end) {
                errors.push('Tanggal mulai tidak boleh lebih besar dari tanggal akhir');
            }
            
            // Maksimal range 90 hari
            const diffDays = (end - start) / (1000 * 60 * 60 * 24);
            if (diffDays > 90) {
                errors.push('Maksimal rentang waktu 90 hari');
            }
        }
        
        return {
            valid: errors.length === 0,
            errors: errors
        };
    },
    
    /**
     * Sanitize string input
     * @param {string} input - Raw input
     * @returns {string} - Sanitized string
     */
    sanitize(input) {
        if (!input) return '';
        return input.toString().trim().replace(/[<>]/g, '');
    },
    
    /**
     * Parse and validate amount
     * @param {string|number} amount - Raw amount
     * @returns {number} - Parsed amount or 0
     */
    parseAmount(amount) {
        const parsed = parseInt(amount, 10);
        return isNaN(parsed) ? 0 : Math.abs(parsed);
    }
};
