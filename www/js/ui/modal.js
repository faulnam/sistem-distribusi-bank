/**
 * UI - Modal Controller
 * Menangani modal dialog
 */
const ModalController = {
    /**
     * Show confirmation modal
     */
    showConfirmationModal() {
        const modal = Utils.$('confirmModal');
        const modalBody = Utils.$('modalBody');
        
        if (!modal || !modalBody || !AppState.pendingTransfer) return;
        
        const transfer = AppState.pendingTransfer;
        const isOnline = transfer.type === 'online';
        const biayaAdmin = transfer.biayaAdmin || 0;
        const totalTransfer = transfer.jumlah + biayaAdmin;
        
        modalBody.innerHTML = `
            <div class="confirm-details">
                <div class="confirm-header">
                    <i class="fas ${isOnline ? 'fa-paper-plane' : 'fa-random'}"></i>
                    <span>${isOnline ? 'Transfer Antar Bank' : 'Transfer Sesama BankKrut'}</span>
                </div>
                
                <div class="confirm-row">
                    <span class="confirm-label">Dari Rekening</span>
                    <span class="confirm-value">${AppState.user.accountNumber}</span>
                </div>
                
                ${isOnline ? `
                <div class="confirm-row">
                    <span class="confirm-label">Bank Tujuan</span>
                    <span class="confirm-value">${transfer.bank || '-'}</span>
                </div>
                ` : ''}
                
                <div class="confirm-row">
                    <span class="confirm-label">Rekening Tujuan</span>
                    <span class="confirm-value">${transfer.rekening}</span>
                </div>
                
                <div class="confirm-row">
                    <span class="confirm-label">Jumlah Transfer</span>
                    <span class="confirm-value amount">${Utils.formatCurrency(transfer.jumlah)}</span>
                </div>
                
                ${biayaAdmin > 0 ? `
                <div class="confirm-row">
                    <span class="confirm-label">Biaya Admin</span>
                    <span class="confirm-value">${Utils.formatCurrency(biayaAdmin)}</span>
                </div>
                ` : ''}
                
                <div class="confirm-row">
                    <span class="confirm-label">Keterangan</span>
                    <span class="confirm-value">${transfer.keterangan || '-'}</span>
                </div>
                
                <div class="confirm-row total">
                    <span class="confirm-label">Total Debit</span>
                    <span class="confirm-value">${Utils.formatCurrency(totalTransfer)}</span>
                </div>
            </div>
        `;
        
        modal.classList.add('active');
    },
    
    /**
     * Close modal
     */
    closeModal() {
        const modal = Utils.$('confirmModal');
        if (modal) {
            modal.classList.remove('active');
        }
    },
    
    /**
     * Show loading modal
     * @param {string} message - Loading message
     */
    showLoadingModal(message = 'Memproses...') {
        // Bisa implementasi loading overlay jika diperlukan
        Utils.log('Modal', 'Loading:', message);
    },
    
    /**
     * Hide loading modal
     */
    hideLoadingModal() {
        // Bisa implementasi loading overlay jika diperlukan
    }
};

// Expose closeModal to global scope for onclick handler
window.closeModal = () => ModalController.closeModal();
