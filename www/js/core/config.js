/**
 * CORE - Configuration
 * Konfigurasi utama aplikasi Mini Bank
 */
const Config = {
    // ============================================
    // MODE DEVELOPMENT
    // USE_MOCK: true  = Data dummy (testing UI)
    // USE_MOCK: false = API Server asli
    // ============================================
    USE_MOCK: false,  // << Set false untuk pakai server lokal
    
    // API Base URL
    // Development: http://localhost:3001
    // Production: https://mbankingsyifaul.katgamind.or.id
    API_BASE_URL: 'http://localhost:3001',
    
    // API Endpoints
    ENDPOINTS: {
        SALDO: '/api/saldo',           // GET /api/saldo/{account}
        TRANSFER: '/api/transfer',      // POST /api/transfer
        MUTASI: '/api/mutasi',          // GET /api/mutasi/{account}
        HISTORI: '/api/histori',        // GET /api/histori/{account}
    },
    
    // Layanan Transaksi
    LAYANAN: {
        SESAMA_BANK: 'LAYANANA',    // Transfer Overbooking (Sesama Bank/Cluster)
        ANTAR_BANK: 'LAYANANB'      // Transfer Online (Antar Bank/Cluster)
    },
    
    // Default User (untuk demo, nanti bisa diganti dengan login)
    DEFAULT_USER: {
        accountNumber: '1001',
        name: 'Syifaul'
    },
    
    // Minimum Transfer Amount
    MIN_TRANSFER: 1000,
    
    // Request Timeout (ms)
    REQUEST_TIMEOUT: 30000,
    
    // Debug Mode
    DEBUG: true
};

// Freeze config agar tidak bisa diubah
Object.freeze(Config);
Object.freeze(Config.ENDPOINTS);
Object.freeze(Config.LAYANAN);
Object.freeze(Config.DEFAULT_USER);
