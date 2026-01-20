/**
 * SERVER SERVICES - Account Service
 * Handle saldo operations
 */
import pool from '../config/database.js';

export const AccountService = {
    /**
     * Get saldo by account number
     */
    async getSaldo(accountNumber) {
        const [users] = await pool.query(
            'SELECT account_number, name, balance FROM users WHERE account_number = ? AND status = "active"',
            [accountNumber]
        );
        
        if (users.length === 0) {
            throw { message: 'Rekening tidak ditemukan', statusCode: 404 };
        }
        
        const user = users[0];
        return {
            account_number: user.account_number,
            account: user.name,
            name: user.name,
            balance: parseFloat(user.balance)
        };
    },
    
    /**
     * Update saldo
     */
    async updateBalance(accountNumber, newBalance, connection = null) {
        const conn = connection || pool;
        
        await conn.query(
            'UPDATE users SET balance = ? WHERE account_number = ?',
            [newBalance, accountNumber]
        );
        
        return true;
    },
    
    /**
     * Get balance
     */
    async getBalance(accountNumber) {
        const [users] = await pool.query(
            'SELECT balance FROM users WHERE account_number = ?',
            [accountNumber]
        );
        
        if (users.length === 0) {
            return null;
        }
        
        return parseFloat(users[0].balance);
    }
};

export default AccountService;
