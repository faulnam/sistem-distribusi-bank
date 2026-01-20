/**
 * SERVICE - Auth Service
 * Menangani login dan register
 */
const AuthService = {
    /**
     * Register new user
     * @param {Object} userData - { name, email, password, phone }
     * @returns {Promise<Object>}
     */
    async register(userData) {
        try {
            const response = await HttpClient.post('/api/auth/register', userData);
            
            if (response.success) {
                return {
                    success: true,
                    user: response.data.user,
                    message: response.data.message || 'Registrasi berhasil'
                };
            }
            
            return response;
        } catch (error) {
            Utils.logError('AuthService', 'Register error:', error);
            return {
                success: false,
                message: error.message || 'Gagal melakukan registrasi'
            };
        }
    },
    
    /**
     * Login user
     * @param {string} email
     * @param {string} password
     * @returns {Promise<Object>}
     */
    async login(email, password) {
        try {
            const response = await HttpClient.post('/api/auth/login', { email, password });
            
            if (response.success && response.data.token) {
                // Save token
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                
                // Update app state
                AppState.setUser({
                    name: response.data.user.name,
                    accountNumber: response.data.user.account_number,
                    balance: response.data.user.balance
                });
                
                return {
                    success: true,
                    user: response.data.user,
                    message: 'Login berhasil'
                };
            }
            
            return {
                success: false,
                message: response.data?.message || 'Login gagal'
            };
        } catch (error) {
            Utils.logError('AuthService', 'Login error:', error);
            return {
                success: false,
                message: error.message || 'Email atau password salah'
            };
        }
    },
    
    /**
     * Logout user
     */
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        AppState.init();
    },
    
    /**
     * Check if user is logged in
     * @returns {boolean}
     */
    isLoggedIn() {
        return !!localStorage.getItem('token');
    },
    
    /**
     * Get saved user from localStorage
     * @returns {Object|null}
     */
    getSavedUser() {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch (e) {
                return null;
            }
        }
        return null;
    },
    
    /**
     * Get auth token
     * @returns {string|null}
     */
    getToken() {
        return localStorage.getItem('token');
    }
};
