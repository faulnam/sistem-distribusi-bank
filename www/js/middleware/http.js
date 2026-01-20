/**
 * MIDDLEWARE - HTTP Client
 * Menangani semua HTTP request ke API dengan error handling terpusat
 */
const HttpClient = {
    /**
     * Check if should use mock
     */
    shouldUseMock() {
        return Config.USE_MOCK === true && typeof MockAPI !== 'undefined';
    },
    
    /**
     * Base fetch wrapper dengan timeout dan error handling
     * @param {string} url - Full URL
     * @param {Object} options - Fetch options
     * @returns {Promise<Object>}
     */
    async request(url, options = {}) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), Config.REQUEST_TIMEOUT);
        
        const defaultOptions = {
            method: 'GET',
            mode: 'cors',  // Enable CORS
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            signal: controller.signal
        };
        
        const mergedOptions = {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers
            }
        };
        
        Utils.log('HTTP', `${mergedOptions.method || 'GET'} ${url}`);
        if (mergedOptions.body) {
            Utils.log('HTTP', 'Request Body:', JSON.parse(mergedOptions.body));
        }
        
        try {
            const response = await fetch(url, mergedOptions);
            clearTimeout(timeout);
            
            // Parse response
            const data = await response.json();
            
            Utils.log('HTTP', 'Response:', data);
            
            if (!response.ok) {
                throw {
                    status: response.status,
                    message: data.message || `HTTP Error ${response.status}`,
                    data: data
                };
            }
            
            return {
                success: true,
                status: response.status,
                data: data
            };
            
        } catch (error) {
            clearTimeout(timeout);
            
            if (error.name === 'AbortError') {
                Utils.logError('HTTP', 'Request timeout');
                throw {
                    success: false,
                    message: 'Koneksi timeout. Periksa jaringan internet Anda.',
                    isTimeout: true
                };
            }
            
            if (error.message === 'Failed to fetch') {
                Utils.logError('HTTP', 'Network error');
                throw {
                    success: false,
                    message: 'Tidak dapat terhubung ke server. Periksa koneksi internet.',
                    isNetworkError: true
                };
            }
            
            Utils.logError('HTTP', 'Request error:', error);
            throw {
                success: false,
                message: error.message || 'Terjadi kesalahan pada server',
                data: error.data || null
            };
        }
    },
    
    /**
     * GET request
     * @param {string} endpoint - API endpoint (without base URL)
     * @param {Object} params - Query parameters
     * @returns {Promise<Object>}
     */
    async get(endpoint, params = {}) {
        // Gunakan Mock API jika diaktifkan
        if (this.shouldUseMock()) {
            Utils.log('HTTP', '[MOCK MODE] GET', endpoint);
            return this.mockGet(endpoint, params);
        }
        
        let url = `${Config.API_BASE_URL}${endpoint}`;
        
        // Add query params if any
        const queryString = new URLSearchParams(params).toString();
        if (queryString) {
            url += `?${queryString}`;
        }
        
        return this.request(url, { method: 'GET' });
    },
    
    /**
     * POST request
     * @param {string} endpoint - API endpoint (without base URL)
     * @param {Object} body - Request body
     * @returns {Promise<Object>}
     */
    async post(endpoint, body = {}) {
        // Gunakan Mock API jika diaktifkan
        if (this.shouldUseMock()) {
            Utils.log('HTTP', '[MOCK MODE] POST', endpoint);
            return this.mockPost(endpoint, body);
        }
        
        const url = `${Config.API_BASE_URL}${endpoint}`;
        
        return this.request(url, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    },
    
    /**
     * Mock GET request handler
     */
    async mockGet(endpoint, params) {
        Utils.log('HTTP', '[MOCK] GET', endpoint, params);
        
        // Parse endpoint untuk mendapatkan account number
        const parts = endpoint.split('/');
        const accountNumber = parts[parts.length - 1];
        
        if (endpoint.includes('/api/saldo/')) {
            return MockAPI.getSaldo(accountNumber);
        }
        if (endpoint.includes('/api/histori/')) {
            return MockAPI.getHistori(accountNumber, params);
        }
        if (endpoint.includes('/api/mutasi/')) {
            return MockAPI.getMutasi(accountNumber, params);
        }
        
        throw { message: 'Mock endpoint not found: ' + endpoint };
    },
    
    /**
     * Mock POST request handler
     */
    async mockPost(endpoint, body) {
        Utils.log('HTTP', '[MOCK] POST', endpoint, body);
        
        if (endpoint.includes('/api/transfer')) {
            return MockAPI.transfer(body);
        }
        
        throw { message: 'Mock endpoint not found: ' + endpoint };
    }
};
