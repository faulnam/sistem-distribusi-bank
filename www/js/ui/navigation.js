/**
 * UI - Navigation Controller
 * Menangani navigasi antar halaman
 */
const NavigationController = {
    /**
     * Navigate to page
     * @param {string} pageName - Target page name
     */
    async navigateTo(pageName) {
        Utils.log('Navigation', 'Navigating to:', pageName);
        
        // Update UI state
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => page.classList.remove('active'));
        
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => item.classList.remove('active'));
        
        const targetPage = Utils.$(pageName);
        const targetMenu = document.querySelector(`[data-page="${pageName}"]`);
        
        if (targetPage) targetPage.classList.add('active');
        if (targetMenu) targetMenu.classList.add('active');
        
        // Update state
        AppState.setCurrentPage(pageName);
        
        // Load data based on page
        await this.loadPageData(pageName);
    },
    
    /**
     * Load data for specific page
     * @param {string} pageName - Page name
     */
    async loadPageData(pageName) {
        switch (pageName) {
            case 'dashboard':
                await this.loadDashboardData();
                break;
            case 'saldo':
                await this.loadSaldoData();
                break;
            case 'histori':
                await this.loadHistoriData();
                break;
            case 'mutasi':
                await this.loadMutasiData();
                break;
        }
    },
    
    /**
     * Load dashboard data
     */
    async loadDashboardData() {
        UIController.showLoading('dashBalance');
        
        const saldoResult = await AccountService.getSaldo();
        if (saldoResult.success) {
            UIController.updateAllDisplays();
        } else {
            UIController.showBalanceError('Error');
            Utils.showMessage(saldoResult.message, 'error');
        }
        
        // Load recent transactions
        const txResult = await TransactionService.getRecentTransactions(5);
        if (txResult.success) {
            UIController.updateRecentTransactions(txResult.data);
        }
    },
    
    /**
     * Load saldo page data
     */
    async loadSaldoData() {
        const result = await AccountService.getSaldo();
        if (result.success) {
            UIController.updateSaldoPage();
        } else {
            UIController.showBalanceError('Error');
            Utils.showMessage(result.message, 'error');
        }
    },
    
    /**
     * Load histori data
     */
    async loadHistoriData() {
        const startDate = Utils.$('historiStartDate')?.value;
        const endDate = Utils.$('historiEndDate')?.value;
        const type = Utils.$('historiType')?.value;
        
        const result = await TransactionService.getHistori({
            startDate,
            endDate,
            type
        });
        
        UIController.updateHistoriTable(result.data);
        
        if (!result.success) {
            Utils.showMessage(result.message, 'error');
        }
    },
    
    /**
     * Load mutasi data
     */
    async loadMutasiData() {
        const startDate = Utils.$('mutasiStartDate')?.value;
        const endDate = Utils.$('mutasiEndDate')?.value;
        
        const result = await TransactionService.getMutasi({
            startDate,
            endDate
        });
        
        UIController.updateMutasiTable(result.data);
        
        if (!result.success) {
            Utils.showMessage(result.message, 'error');
        }
    }
};

// Expose navigateTo to global scope
window.navigateTo = (pageName) => NavigationController.navigateTo(pageName);
