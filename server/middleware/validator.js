/**
 * SERVER MIDDLEWARE - Validator
 */
import { errorResponse } from '../core/utils.js';
import { Config } from '../core/config.js';

// Validate register input
export function validateRegister(req, res, next) {
    const { name, email, password, phone } = req.body;
    const errors = [];
    
    if (!name || name.trim().length < 3) {
        errors.push('Nama minimal 3 karakter');
    }
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('Email tidak valid');
    }
    
    if (!password || password.length < 6) {
        errors.push('Password minimal 6 karakter');
    }
    
    if (phone && !/^[0-9]{10,15}$/.test(phone)) {
        errors.push('Nomor telepon tidak valid');
    }
    
    if (errors.length > 0) {
        return errorResponse(res, 'Validasi gagal', 400, errors);
    }
    
    next();
}

// Validate login input
export function validateLogin(req, res, next) {
    const { email, password } = req.body;
    const errors = [];
    
    if (!email) {
        errors.push('Email harus diisi');
    }
    
    if (!password) {
        errors.push('Password harus diisi');
    }
    
    if (errors.length > 0) {
        return errorResponse(res, 'Validasi gagal', 400, errors);
    }
    
    next();
}

// Validate transfer input
export function validateTransfer(req, res, next) {
    const { to_account, amount } = req.body;
    const errors = [];
    
    if (!to_account || !/^\d{4,20}$/.test(to_account)) {
        errors.push('Nomor rekening tujuan tidak valid');
    }
    
    const amountNum = parseFloat(amount);
    if (!amount || isNaN(amountNum)) {
        errors.push('Jumlah transfer harus diisi');
    } else if (amountNum < Config.MIN_TRANSFER) {
        errors.push(`Minimal transfer Rp ${Config.MIN_TRANSFER.toLocaleString('id-ID')}`);
    } else if (amountNum > Config.MAX_TRANSFER) {
        errors.push(`Maksimal transfer Rp ${Config.MAX_TRANSFER.toLocaleString('id-ID')}`);
    }
    
    if (errors.length > 0) {
        return errorResponse(res, 'Validasi gagal', 400, errors);
    }
    
    next();
}

export default {
    validateRegister,
    validateLogin,
    validateTransfer
};
