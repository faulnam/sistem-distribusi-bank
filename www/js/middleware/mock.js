/**
 * MIDDLEWARE - Mock API
 * Simulasi response API untuk testing di browser
 * Aktif hanya jika Config.USE_MOCK = true
 */
const MockAPI = {
    // Simulasi delay network
    delay(ms = 500) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    // Data dummy user
    userData: {
        name: 'Syifaul Fuadi',
        accountNumber: '1001',
        balance: 5000000
    },

    // Data dummy transaksi
    transactions: [
        { id: 1, date: '2026-01-20 10:30', description: 'Transfer dari 1002', type: 'credit', amount: 500000, balance: 5000000 },
        { id: 2, date: '2026-01-19 14:22', description: 'Pembayaran PLN', type: 'debit', amount: 250000, balance: 4500000 },
        { id: 3, date: '2026-01-18 09:15', description: 'Transfer ke 1003', type: 'debit', amount: 1000000, balance: 4750000 },
        { id: 4, date: '2026-01-17 16:45', description: 'Transfer dari 1005', type: 'credit', amount: 2000000, balance: 5750000 },
        { id: 5, date: '2026-01-16 11:30', description: 'Pembelian Pulsa', type: 'debit', amount: 50000, balance: 3750000 },
        { id: 6, date: '2026-01-15 08:00', description: 'Gaji Bulanan', type: 'credit', amount: 3500000, balance: 3800000 },
        { id: 7, date: '2026-01-14 13:20', description: 'Transfer ke 1007', type: 'debit', amount: 300000, balance: 300000 },
        { id: 8, date: '2026-01-13 10:00', description: 'Setoran Tunai', type: 'credit', amount: 600000, balance: 600000 },
    ],

    /**
     * Mock: Get Saldo
     */
    async getSaldo(accountNumber) {
        await this.delay(300);
        Utils.log('MockAPI', 'getSaldo called for:', accountNumber);
        
        return {
            success: true,
            status: 200,
            data: {
                account: this.userData.name,
                name: this.userData.name,
                account_number: this.userData.accountNumber,
                balance: this.userData.balance
            }
        };
    },

    /**
     * Mock: Transfer
     */
    async transfer(payload) {
        await this.delay(800);
        Utils.log('MockAPI', 'Transfer called:', payload);

        const amount = parseFloat(payload.amount);
        
        // Simulasi validasi
        if (amount > this.userData.balance) {
            throw {
                success: false,
                message: 'Saldo tidak mencukupi'
            };
        }

        // Update saldo
        this.userData.balance -= amount;

        // Tambah ke histori
        this.transactions.unshift({
            id: Date.now(),
            date: new Date().toISOString().replace('T', ' ').substring(0, 16),
            description: `Transfer ke ${payload.to_account}`,
            type: 'debit',
            amount: amount,
            balance: this.userData.balance
        });

        return {
            success: true,
            status: 200,
            data: {
                status: 'success',
                message: 'Transfer berhasil',
                new_balance: this.userData.balance,
                transaction_id: Date.now()
            }
        };
    },

    /**
     * Mock: Get Histori
     */
    async getHistori(accountNumber, params = {}) {
        await this.delay(400);
        Utils.log('MockAPI', 'getHistori called:', accountNumber, params);

        let filtered = [...this.transactions];

        // Filter by type
        if (params.type && params.type !== 'all') {
            filtered = filtered.filter(tx => tx.type === params.type);
        }

        // Filter by date range
        if (params.start_date) {
            filtered = filtered.filter(tx => tx.date >= params.start_date);
        }
        if (params.end_date) {
            filtered = filtered.filter(tx => tx.date <= params.end_date + ' 23:59');
        }

        return {
            success: true,
            status: 200,
            data: filtered
        };
    },

    /**
     * Mock: Get Mutasi
     */
    async getMutasi(accountNumber, params = {}) {
        await this.delay(400);
        Utils.log('MockAPI', 'getMutasi called:', accountNumber, params);

        let filtered = [...this.transactions];

        // Filter by date range
        if (params.start_date) {
            filtered = filtered.filter(tx => tx.date >= params.start_date);
        }
        if (params.end_date) {
            filtered = filtered.filter(tx => tx.date <= params.end_date + ' 23:59');
        }

        // Convert to mutasi format
        const mutasi = filtered.map(tx => ({
            id: tx.id,
            date: tx.date,
            description: tx.description,
            debit: tx.type === 'debit' ? tx.amount : 0,
            credit: tx.type === 'credit' ? tx.amount : 0,
            balance: tx.balance
        }));

        return {
            success: true,
            status: 200,
            data: mutasi
        };
    }
};
