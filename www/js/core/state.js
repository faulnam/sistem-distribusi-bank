/**
 * CORE - State Management
 * Mengelola state/data aplikasi secara terpusat
 */
const AppState = {
    // Current User Data
    user: {
        name: '',
        accountNumber: '',
        balance: 0
    },
    
    // Pending Transfer Data
    pendingTransfer: null,
    
    // Transaction History Cache
    transactions: [],
    mutasi: [],
    
    // App Status
    isInitialized: false,
    isCordovaApp: false,
    isLoading: false,
    currentPage: 'dashboard',
    
    // Initialize state with default values
    init() {
        this.user.accountNumber = Config.DEFAULT_USER.accountNumber;
        this.user.name = Config.DEFAULT_USER.name;
        this.user.balance = 0;
        this.pendingTransfer = null;
        this.transactions = [];
        this.mutasi = [];
        this.isInitialized = true;
        
        if (Config.DEBUG) {
            console.log('[AppState] Initialized:', this.user);
        }
    },
    
    // Update user data
    setUser(userData) {
        if (userData.name) this.user.name = userData.name;
        if (userData.accountNumber) this.user.accountNumber = userData.accountNumber;
        if (userData.balance !== undefined) this.user.balance = parseFloat(userData.balance) || 0;
        
        if (Config.DEBUG) {
            console.log('[AppState] User updated:', this.user);
        }
    },
    
    // Set pending transfer
    setPendingTransfer(transferData) {
        this.pendingTransfer = transferData;
        if (Config.DEBUG) {
            console.log('[AppState] Pending transfer set:', transferData);
        }
    },
    
    // Clear pending transfer
    clearPendingTransfer() {
        this.pendingTransfer = null;
    },
    
    // Set transactions
    setTransactions(data) {
        this.transactions = data || [];
    },
    
    // Set mutasi
    setMutasi(data) {
        this.mutasi = data || [];
    },
    
    // Set loading state
    setLoading(status) {
        this.isLoading = status;
    },
    
    // Set current page
    setCurrentPage(page) {
        this.currentPage = page;
    }
};
