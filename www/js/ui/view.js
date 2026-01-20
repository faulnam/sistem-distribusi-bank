/**
 * UI - View Controller
 * Menangani update tampilan UI
 */
const UIController = {
    /**
     * Update semua tampilan dengan data terbaru
     */
    updateAllDisplays() {
        this.updateDashboard();
        this.updateHeader();
        this.updateSaldoPage();
    },
    
    /**
     * Update Dashboard display
     */
    updateDashboard() {
        Utils.setText('dashAccountNumber', AppState.user.accountNumber);
        Utils.setText('dashBalance', Utils.formatCurrency(AppState.user.balance));
        Utils.setText('dashUserName', AppState.user.name);
        Utils.setText('dashAccountNum', AppState.user.accountNumber);
    },
    
    /**
     * Update Header display
     */
    updateHeader() {
        Utils.setText('userName', AppState.user.name);
        Utils.setText('profileName', AppState.user.name);
        Utils.setText('profileAccount', `Rek: ${AppState.user.accountNumber}`);
    },
    
    /**
     * Update Saldo page display
     */
    updateSaldoPage() {
        Utils.setText('saldoAccountNumber', AppState.user.accountNumber);
        Utils.setText('saldoUserName', AppState.user.name);
        Utils.setText('saldoBalance', Utils.formatCurrency(AppState.user.balance));
    },
    
    /**
     * Update histori table
     * @param {Array} transactions - List of transactions
     */
    updateHistoriTable(transactions) {
        const tbody = Utils.$('historiTableBody');
        if (!tbody) return;
        
        if (!transactions || transactions.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-state">
                        <i class="fas fa-inbox"></i>
                        <p>Tidak ada data transaksi</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = transactions.map(tx => `
            <tr>
                <td>${Utils.formatDateShort(tx.date)}</td>
                <td>${tx.description}</td>
                <td><span class="badge badge-${tx.type}">${tx.type === 'credit' ? 'Kredit' : 'Debit'}</span></td>
                <td class="${tx.type === 'credit' ? 'text-success' : 'text-danger'}">
                    ${tx.type === 'credit' ? '+' : '-'}${Utils.formatCurrency(tx.amount)}
                </td>
                <td>${Utils.formatCurrency(tx.balance)}</td>
            </tr>
        `).join('');
    },
    
    /**
     * Update mutasi table
     * @param {Array} mutasi - List of mutasi
     */
    updateMutasiTable(mutasi) {
        const tbody = Utils.$('mutasiTableBody');
        if (!tbody) return;
        
        if (!mutasi || mutasi.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-state">
                        <i class="fas fa-inbox"></i>
                        <p>Tidak ada data mutasi</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = mutasi.map(m => `
            <tr>
                <td>${Utils.formatDateShort(m.date)}</td>
                <td>${m.description}</td>
                <td class="text-danger">${m.debit > 0 ? Utils.formatCurrency(m.debit) : '-'}</td>
                <td class="text-success">${m.credit > 0 ? Utils.formatCurrency(m.credit) : '-'}</td>
                <td>${Utils.formatCurrency(m.balance)}</td>
            </tr>
        `).join('');
    },
    
    /**
     * Update recent transactions on dashboard
     * @param {Array} transactions - List of recent transactions
     */
    updateRecentTransactions(transactions) {
        const container = Utils.$('recentTransactions');
        if (!container) return;
        
        if (!transactions || transactions.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clock"></i>
                    <p>Belum ada transaksi</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = transactions.slice(0, 5).map(tx => `
            <div class="recent-item">
                <div class="recent-icon ${tx.type}">
                    <i class="fas ${tx.type === 'credit' ? 'fa-arrow-down' : 'fa-arrow-up'}"></i>
                </div>
                <div class="recent-info">
                    <div class="recent-desc">${tx.description}</div>
                    <div class="recent-date">${Utils.formatDateShort(tx.date)}</div>
                </div>
                <div class="recent-amount ${tx.type === 'credit' ? 'text-success' : 'text-danger'}">
                    ${tx.type === 'credit' ? '+' : '-'}${Utils.formatCurrency(tx.amount)}
                </div>
            </div>
        `).join('');
    },
    
    /**
     * Show loading state on element
     * @param {string} elementId - Element ID
     */
    showLoading(elementId) {
        Utils.setLoadingState(elementId, true);
    },
    
    /**
     * Hide loading state on element
     * @param {string} elementId - Element ID
     */
    hideLoading(elementId) {
        Utils.setLoadingState(elementId, false);
    },
    
    /**
     * Show error state on balance
     * @param {string} message - Error message
     */
    showBalanceError(message = 'Error') {
        Utils.setText('dashBalance', message);
        Utils.setText('saldoBalance', message);
    },
    
    /**
     * Reset transfer form
     * @param {string} formId - Form ID
     */
    resetForm(formId) {
        const form = Utils.$(formId);
        if (form) form.reset();
    }
};
