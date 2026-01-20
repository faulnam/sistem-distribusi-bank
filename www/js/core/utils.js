/**
 * CORE - Utilities
 * Helper functions yang digunakan di seluruh aplikasi
 */
const Utils = {
    /**
     * Format angka ke format mata uang Indonesia
     * @param {number} amount - Jumlah uang
     * @returns {string} - Format Rp XX.XXX
     */
    formatCurrency(amount) {
        const num = parseFloat(amount) || 0;
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(num);
    },
    
    /**
     * Format tanggal ke format Indonesia
     * @param {string|Date} date - Tanggal
     * @returns {string} - Format DD/MM/YYYY HH:mm
     */
    formatDate(date) {
        if (!date) return '-';
        const d = new Date(date);
        if (isNaN(d.getTime())) return '-';
        
        return d.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },
    
    /**
     * Format tanggal pendek
     * @param {string|Date} date - Tanggal
     * @returns {string} - Format DD/MM/YYYY
     */
    formatDateShort(date) {
        if (!date) return '-';
        const d = new Date(date);
        if (isNaN(d.getTime())) return '-';
        
        return d.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    },
    
    /**
     * Get current date in YYYY-MM-DD format
     * @returns {string}
     */
    getCurrentDate() {
        return new Date().toISOString().split('T')[0];
    },
    
    /**
     * Get date X days ago in YYYY-MM-DD format
     * @param {number} days - Jumlah hari ke belakang
     * @returns {string}
     */
    getDateDaysAgo(days) {
        const date = new Date();
        date.setDate(date.getDate() - days);
        return date.toISOString().split('T')[0];
    },
    
    /**
     * Safely get DOM element by ID
     * @param {string} id - Element ID
     * @returns {HTMLElement|null}
     */
    $(id) {
        return document.getElementById(id);
    },
    
    /**
     * Safely set text content
     * @param {string} id - Element ID
     * @param {string} text - Text content
     */
    setText(id, text) {
        const el = this.$(id);
        if (el) el.textContent = text;
    },
    
    /**
     * Safely set inner HTML
     * @param {string} id - Element ID
     * @param {string} html - HTML content
     */
    setHTML(id, html) {
        const el = this.$(id);
        if (el) el.innerHTML = html;
    },
    
    /**
     * Add/Remove loading class
     * @param {string} id - Element ID
     * @param {boolean} isLoading - Loading state
     */
    setLoadingState(id, isLoading) {
        const el = this.$(id);
        if (el) {
            if (isLoading) {
                el.classList.add('loading');
                el.textContent = 'Loading...';
            } else {
                el.classList.remove('loading');
            }
        }
    },
    
    /**
     * Show toast/alert message
     * @param {string} message - Message to show
     * @param {string} type - 'success', 'error', 'info'
     */
    showMessage(message, type = 'info') {
        // Gunakan Cordova Dialog jika tersedia
        if (window.navigator && navigator.notification && navigator.notification.alert) {
            const title = type === 'error' ? 'Error' : type === 'success' ? 'Sukses' : 'Info';
            navigator.notification.alert(message, null, title, 'OK');
        } else {
            alert(message);
        }
    },
    
    /**
     * Show confirmation dialog
     * @param {string} message - Confirmation message
     * @param {Function} onConfirm - Callback if confirmed
     * @param {Function} onCancel - Callback if cancelled
     */
    showConfirm(message, onConfirm, onCancel) {
        if (window.navigator && navigator.notification && navigator.notification.confirm) {
            navigator.notification.confirm(
                message,
                (buttonIndex) => {
                    if (buttonIndex === 1) {
                        onConfirm && onConfirm();
                    } else {
                        onCancel && onCancel();
                    }
                },
                'Konfirmasi',
                ['Ya', 'Tidak']
            );
        } else {
            if (confirm(message)) {
                onConfirm && onConfirm();
            } else {
                onCancel && onCancel();
            }
        }
    },
    
    /**
     * Validate account number
     * @param {string} accountNumber 
     * @returns {boolean}
     */
    isValidAccountNumber(accountNumber) {
        return /^\d{4,20}$/.test(accountNumber);
    },
    
    /**
     * Validate transfer amount
     * @param {number} amount 
     * @returns {boolean}
     */
    isValidAmount(amount) {
        return amount >= Config.MIN_TRANSFER;
    },
    
    /**
     * Log debug message
     * @param {string} tag - Log tag
     * @param {any} message - Message to log
     */
    log(tag, ...message) {
        if (Config.DEBUG) {
            console.log(`[${tag}]`, ...message);
        }
    },
    
    /**
     * Log error message
     * @param {string} tag - Log tag
     * @param {any} error - Error to log
     */
    logError(tag, ...error) {
        console.error(`[${tag}]`, ...error);
    }
};
