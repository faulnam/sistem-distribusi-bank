/**
 * SERVER SERVICES - Transaction Service
 * Handle transfer, histori, mutasi
 */
import pool from '../config/database.js';
import { generateTransactionId } from '../core/utils.js';
import { AccountService } from './accountService.js';
import { UserService } from './userService.js';

export const TransactionService = {
    /**
     * Transfer money
     */
    async transfer(fromAccount, toAccount, amount, layanan, keterangan = '') {
        const connection = await pool.getConnection();
        
        try {
            await connection.beginTransaction();
            
            // Get sender
            const [senders] = await connection.query(
                'SELECT * FROM users WHERE account_number = ? AND status = "active" FOR UPDATE',
                [fromAccount]
            );
            
            if (senders.length === 0) {
                throw { message: 'Rekening pengirim tidak ditemukan', statusCode: 404 };
            }
            
            const sender = senders[0];
            const senderBalance = parseFloat(sender.balance);
            
            // Check balance
            if (senderBalance < amount) {
                throw { message: 'Saldo tidak mencukupi', statusCode: 400 };
            }
            
            // Get receiver
            const [receivers] = await connection.query(
                'SELECT * FROM users WHERE account_number = ? AND status = "active" FOR UPDATE',
                [toAccount]
            );
            
            if (receivers.length === 0) {
                throw { message: 'Rekening tujuan tidak ditemukan', statusCode: 404 };
            }
            
            const receiver = receivers[0];
            const receiverBalance = parseFloat(receiver.balance);
            
            // Check self transfer
            if (fromAccount === toAccount) {
                throw { message: 'Tidak dapat transfer ke rekening sendiri', statusCode: 400 };
            }
            
            // Calculate new balances
            const newSenderBalance = senderBalance - amount;
            const newReceiverBalance = receiverBalance + amount;
            
            // Update sender balance
            await connection.query(
                'UPDATE users SET balance = ? WHERE account_number = ?',
                [newSenderBalance, fromAccount]
            );
            
            // Update receiver balance
            await connection.query(
                'UPDATE users SET balance = ? WHERE account_number = ?',
                [newReceiverBalance, toAccount]
            );
            
            // Create transaction records
            const txIdOut = generateTransactionId();
            const txIdIn = generateTransactionId();
            const description = keterangan || `Transfer ke ${receiver.name}`;
            const descriptionIn = `Transfer dari ${sender.name}`;
            
            // Sender transaction (debit)
            await connection.query(
                `INSERT INTO transactions 
                (transaction_id, from_account, to_account, type, amount, balance_before, balance_after, description, layanan)
                VALUES (?, ?, ?, 'transfer_out', ?, ?, ?, ?, ?)`,
                [txIdOut, fromAccount, toAccount, amount, senderBalance, newSenderBalance, description, layanan]
            );
            
            // Receiver transaction (credit)
            await connection.query(
                `INSERT INTO transactions 
                (transaction_id, from_account, to_account, type, amount, balance_before, balance_after, description, layanan)
                VALUES (?, ?, ?, 'transfer_in', ?, ?, ?, ?, ?)`,
                [txIdIn, toAccount, fromAccount, amount, receiverBalance, newReceiverBalance, descriptionIn, layanan]
            );
            
            await connection.commit();
            
            return {
                transaction_id: txIdOut,
                from_account: fromAccount,
                to_account: toAccount,
                to_name: receiver.name,
                amount: amount,
                new_balance: newSenderBalance,
                timestamp: new Date().toISOString()
            };
            
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },
    
    /**
     * Get transaction history
     */
    async getHistori(accountNumber, filters = {}) {
        let query = `
            SELECT 
                id,
                transaction_id,
                from_account,
                to_account,
                type,
                amount,
                balance_after as balance,
                description,
                layanan,
                status,
                created_at as date
            FROM transactions 
            WHERE from_account = ?
        `;
        
        const params = [accountNumber];
        
        // Filter by type
        if (filters.type && filters.type !== 'all') {
            if (filters.type === 'credit') {
                query += ` AND type IN ('credit', 'transfer_in')`;
            } else if (filters.type === 'debit') {
                query += ` AND type IN ('debit', 'transfer_out')`;
            }
        }
        
        // Filter by date
        if (filters.start_date) {
            query += ` AND DATE(created_at) >= ?`;
            params.push(filters.start_date);
        }
        
        if (filters.end_date) {
            query += ` AND DATE(created_at) <= ?`;
            params.push(filters.end_date);
        }
        
        query += ` ORDER BY created_at DESC LIMIT 100`;
        
        const [transactions] = await pool.query(query, params);
        
        return transactions.map(tx => ({
            ...tx,
            amount: parseFloat(tx.amount),
            balance: parseFloat(tx.balance),
            type: tx.type.includes('transfer_in') || tx.type === 'credit' ? 'credit' : 'debit'
        }));
    },
    
    /**
     * Get mutasi rekening
     */
    async getMutasi(accountNumber, filters = {}) {
        let query = `
            SELECT 
                id,
                transaction_id,
                type,
                amount,
                balance_after as balance,
                description,
                created_at as date
            FROM transactions 
            WHERE from_account = ?
        `;
        
        const params = [accountNumber];
        
        // Filter by date
        if (filters.start_date) {
            query += ` AND DATE(created_at) >= ?`;
            params.push(filters.start_date);
        }
        
        if (filters.end_date) {
            query += ` AND DATE(created_at) <= ?`;
            params.push(filters.end_date);
        }
        
        query += ` ORDER BY created_at DESC LIMIT 100`;
        
        const [transactions] = await pool.query(query, params);
        
        return transactions.map(tx => {
            const isCredit = tx.type.includes('transfer_in') || tx.type === 'credit';
            return {
                id: tx.id,
                date: tx.date,
                description: tx.description,
                debit: isCredit ? 0 : parseFloat(tx.amount),
                credit: isCredit ? parseFloat(tx.amount) : 0,
                balance: parseFloat(tx.balance)
            };
        });
    }
};

export default TransactionService;
