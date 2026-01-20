/**
 * SERVER SERVICES - User Service
 * Handle user registration, login, profile
 */
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';
import { Config } from '../core/config.js';
import { generateAccountNumber } from '../core/utils.js';

export const UserService = {
    /**
     * Register new user
     */
    async register(userData) {
        const { name, email, password, phone, address } = userData;
        
        // Check if email already exists
        const [existing] = await pool.query(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );
        
        if (existing.length > 0) {
            throw { message: 'Email sudah terdaftar', statusCode: 400 };
        }
        
        // Generate unique account number
        let accountNumber;
        let isUnique = false;
        
        while (!isUnique) {
            accountNumber = generateAccountNumber();
            const [check] = await pool.query(
                'SELECT id FROM users WHERE account_number = ?',
                [accountNumber]
            );
            if (check.length === 0) isUnique = true;
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert user
        const [result] = await pool.query(
            `INSERT INTO users (account_number, name, email, password, phone, address, balance) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [accountNumber, name, email, hashedPassword, phone || null, address || null, 0]
        );
        
        return {
            id: result.insertId,
            account_number: accountNumber,
            name,
            email
        };
    },
    
    /**
     * Login user
     */
    async login(email, password) {
        // Find user
        const [users] = await pool.query(
            'SELECT * FROM users WHERE email = ? AND status = "active"',
            [email]
        );
        
        if (users.length === 0) {
            throw { message: 'Email atau password salah', statusCode: 401 };
        }
        
        const user = users[0];
        
        // Verify password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            throw { message: 'Email atau password salah', statusCode: 401 };
        }
        
        // Generate JWT
        const token = jwt.sign(
            {
                id: user.id,
                account_number: user.account_number,
                name: user.name,
                email: user.email
            },
            Config.JWT.SECRET,
            { expiresIn: Config.JWT.EXPIRES_IN }
        );
        
        return {
            token,
            user: {
                id: user.id,
                account_number: user.account_number,
                name: user.name,
                email: user.email,
                phone: user.phone,
                balance: parseFloat(user.balance)
            }
        };
    },
    
    /**
     * Get user profile
     */
    async getProfile(accountNumber) {
        const [users] = await pool.query(
            'SELECT id, account_number, name, email, phone, address, balance, status, created_at FROM users WHERE account_number = ?',
            [accountNumber]
        );
        
        if (users.length === 0) {
            throw { message: 'User tidak ditemukan', statusCode: 404 };
        }
        
        const user = users[0];
        return {
            ...user,
            balance: parseFloat(user.balance)
        };
    },
    
    /**
     * Find user by account number
     */
    async findByAccountNumber(accountNumber) {
        const [users] = await pool.query(
            'SELECT id, account_number, name, balance FROM users WHERE account_number = ? AND status = "active"',
            [accountNumber]
        );
        
        return users.length > 0 ? users[0] : null;
    }
};

export default UserService;
