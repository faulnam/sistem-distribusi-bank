/**
 * MAIN APPLICATION CONTROLLER
 * Entry point dan controller utama aplikasi Mini Bank
 */

// ============================================
// INITIALIZATION
// ============================================

// Cordova device ready event
document.addEventListener('deviceready', onDeviceReady, false);

// Fallback untuk browser
if (typeof cordova === 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        Utils.log('App', 'Running in browser mode');
        AppState.isCordovaApp = false;
        initializeApp();
    });
}

/**
 * Cordova device ready handler
 */
function onDeviceReady() {
    Utils.log('App', 'Cordova device ready');
    AppState.isCordovaApp = true;
    
    // Register back button handler
    document.addEventListener('backbutton', onBackKeyDown, false);
    
    initializeApp();
}

/**
 * Initialize application
 */
async function initializeApp() {
    Utils.log('App', 'Initializing application...');
    
    try {
        // Check if user is logged in
        const savedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (!savedUser || !token) {
            // Redirect to login if not logged in
            Utils.log('App', 'User not logged in, redirecting...');
            window.location.href = 'login.html';
            return;
        }
        
        // Parse saved user
        const user = JSON.parse(savedUser);
        
        // Initialize state with saved user
        AppState.init();
        AppState.setUser({
            name: user.name,
            accountNumber: user.account_number,
            balance: user.balance || 0
        });
        
        // Setup event listeners
        setupEventListeners();
        
        // Start clock
        updateClock();
        setInterval(updateClock, 1000);
        
        // Load initial data
        await loadInitialData();
        
        Utils.log('App', 'Application initialized successfully');
        
    } catch (error) {
        Utils.logError('App', 'Initialization error:', error);
        Utils.showMessage('Gagal memuat aplikasi. Silakan coba lagi.', 'error');
    }
}

/**
 * Load initial data from server
 */
async function loadInitialData() {
    UIController.showLoading('dashBalance');
    
    const result = await AccountService.getSaldo();
    
    if (result.success) {
        UIController.updateAllDisplays();
        
        // Load recent transactions
        const txResult = await TransactionService.getRecentTransactions(5);
        if (txResult.success) {
            UIController.updateRecentTransactions(txResult.data);
        }
    } else {
        UIController.showBalanceError('Error Koneksi');
        Utils.showMessage(result.message, 'error');
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Menu navigation
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const pageName = item.getAttribute('data-page');
            NavigationController.navigateTo(pageName);
        });
    });
    
    // Transfer Online Form
    const tfOnlineForm = Utils.$('transferOnlineForm');
    if (tfOnlineForm) {
        tfOnlineForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleTransferOnline();
        });
    }
    
    // Transfer Overbooking Form
    const tfOverForm = Utils.$('transferOverbookingForm');
    if (tfOverForm) {
        tfOverForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleTransferOverbooking();
        });
    }
    
    // Close modal when clicking outside
    const modal = Utils.$('confirmModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                ModalController.closeModal();
            }
        });
    }
    
    // Close profile dropdown when clicking outside
    document.addEventListener('click', (e) => {
        const profileDropdown = document.querySelector('.profile-dropdown');
        const profileMenu = Utils.$('profileMenu');
        if (profileDropdown && profileMenu && !profileDropdown.contains(e.target)) {
            profileMenu.classList.remove('active');
        }
    });
}

// ============================================
// TRANSFER HANDLERS
// ============================================

/**
 * Handle Transfer Online submission
 */
function handleTransferOnline() {
    const formData = {
        rekening: Utils.$('rekeningTujuan')?.value,
        jumlah: Utils.$('jumlahTransfer')?.value,
        keterangan: Utils.$('keteranganTransfer')?.value || '-'
    };
    
    const transferData = TransferService.prepareTransferOnline(formData);
    
    // Validate
    const validation = Validator.validateTransfer(transferData);
    if (!validation.valid) {
        Utils.showMessage(validation.errors.join('\n'), 'error');
        return;
    }
    
    // Set pending transfer and show confirmation
    AppState.setPendingTransfer(transferData);
    ModalController.showConfirmationModal();
}

/**
 * Handle Transfer Overbooking submission
 */
function handleTransferOverbooking() {
    const formData = {
        rekening: Utils.$('rekeningOverbooking')?.value,
        jumlah: Utils.$('jumlahOverbooking')?.value,
        keterangan: Utils.$('keteranganOverbooking')?.value || '-'
    };
    
    const transferData = TransferService.prepareTransferOverbooking(formData);
    
    // Validate
    const validation = Validator.validateTransfer(transferData);
    if (!validation.valid) {
        Utils.showMessage(validation.errors.join('\n'), 'error');
        return;
    }
    
    // Set pending transfer and show confirmation
    AppState.setPendingTransfer(transferData);
    ModalController.showConfirmationModal();
}

/**
 * Confirm and execute transfer
 */
async function confirmTransfer() {
    if (!AppState.pendingTransfer) {
        Utils.showMessage('Tidak ada transaksi yang pending', 'error');
        return;
    }
    
    // Close modal first
    ModalController.closeModal();
    
    // Show processing message
    Utils.showMessage('Sedang memproses transaksi...');
    
    // Execute transfer
    const result = await TransferService.executeTransfer(AppState.pendingTransfer);
    
    if (result.success) {
        Utils.showMessage(`Transfer Berhasil!\n${result.message}`, 'success');
        
        // Reset forms
        UIController.resetForm('transferOnlineForm');
        UIController.resetForm('transferOverbookingForm');
        
        // Refresh saldo
        await AccountService.getSaldo();
        UIController.updateAllDisplays();
        
        // Navigate to dashboard
        NavigationController.navigateTo('dashboard');
    } else {
        Utils.showMessage(`Transfer Gagal!\n${result.message}`, 'error');
    }
}

// ============================================
// FILTER HANDLERS
// ============================================

/**
 * Filter histori transaksi
 */
async function filterHistori() {
    const startDate = Utils.$('historiStartDate')?.value;
    const endDate = Utils.$('historiEndDate')?.value;
    const type = Utils.$('historiType')?.value;
    
    // Validate date range
    const validation = Validator.validateDateRange(startDate, endDate);
    if (!validation.valid) {
        Utils.showMessage(validation.errors.join('\n'), 'error');
        return;
    }
    
    const result = await TransactionService.getHistori({
        startDate,
        endDate,
        type
    });
    
    UIController.updateHistoriTable(result.data);
    
    if (!result.success) {
        Utils.showMessage(result.message, 'error');
    }
}

/**
 * Filter mutasi rekening
 */
async function filterMutasi() {
    const startDate = Utils.$('mutasiStartDate')?.value;
    const endDate = Utils.$('mutasiEndDate')?.value;
    
    // Validate date range
    const validation = Validator.validateDateRange(startDate, endDate);
    if (!validation.valid) {
        Utils.showMessage(validation.errors.join('\n'), 'error');
        return;
    }
    
    const result = await TransactionService.getMutasi({
        startDate,
        endDate
    });
    
    UIController.updateMutasiTable(result.data);
    
    if (!result.success) {
        Utils.showMessage(result.message, 'error');
    }
}

// ============================================
// UTILITY HANDLERS
// ============================================

/**
 * Update clock display
 */
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    Utils.setText('clock', timeString);
}

/**
 * Toggle profile dropdown
 */
function toggleProfileDropdown() {
    const menu = Utils.$('profileMenu');
    if (menu) {
        menu.classList.toggle('active');
    }
}

/**
 * Handle back button (Android)
 */
function onBackKeyDown(e) {
    e.preventDefault();
    
    // Close modal if open
    const modal = Utils.$('confirmModal');
    if (modal && modal.classList.contains('active')) {
        ModalController.closeModal();
        return;
    }
    
    // Close profile menu if open
    const profileMenu = Utils.$('profileMenu');
    if (profileMenu && profileMenu.classList.contains('active')) {
        profileMenu.classList.remove('active');
        return;
    }
    
    // Navigate to dashboard if not already there
    if (AppState.currentPage !== 'dashboard') {
        NavigationController.navigateTo('dashboard');
        return;
    }
    
    // Confirm exit
    Utils.showConfirm('Apakah Anda ingin keluar dari aplikasi?', () => {
        if (navigator.app && navigator.app.exitApp) {
            navigator.app.exitApp();
        }
    });
}

/**
 * Logout handler
 */
function logout() {
    Utils.showConfirm('Apakah Anda ingin keluar?', () => {
        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Reset state
        AppState.init();
        
        // Redirect to login
        window.location.href = 'login.html';
    });
}

// ============================================
// EXPOSE GLOBAL FUNCTIONS (untuk onclick handlers di HTML)
// ============================================
window.confirmTransfer = confirmTransfer;
window.filterHistori = filterHistori;
window.filterMutasi = filterMutasi;
window.toggleProfileDropdown = toggleProfileDropdown;
window.logout = logout;
