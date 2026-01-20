-- ============================================
-- DATABASE SCHEMA - Mini Bank
-- ============================================

-- Buat database jika belum ada
CREATE DATABASE IF NOT EXISTS db_mbanking;
USE db_mbanking;

-- ============================================
-- Tabel Users (Nasabah)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    account_number VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    balance DECIMAL(15, 2) DEFAULT 0.00,
    pin VARCHAR(6),
    status ENUM('active', 'inactive', 'blocked') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- Tabel Transactions (Transaksi)
-- ============================================
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_id VARCHAR(50) UNIQUE NOT NULL,
    from_account VARCHAR(20) NOT NULL,
    to_account VARCHAR(20),
    type ENUM('credit', 'debit', 'transfer_in', 'transfer_out') NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    balance_before DECIMAL(15, 2) NOT NULL,
    balance_after DECIMAL(15, 2) NOT NULL,
    description VARCHAR(255),
    layanan VARCHAR(50),
    status ENUM('pending', 'success', 'failed') DEFAULT 'success',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk performa query
CREATE INDEX idx_transactions_from_account ON transactions(from_account);
CREATE INDEX idx_transactions_to_account ON transactions(to_account);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);

-- ============================================
-- Data Dummy untuk Testing
-- ============================================

-- Password: 123456 (hashed dengan bcrypt)
INSERT INTO users (account_number, name, email, password, phone, balance) VALUES
('1001', 'Syifaul Fuadi', 'syifaul@email.com', '$2b$10$rQZ9QdSJFh1vXqz5O5Yw5uvYxHqXGqYbXfXMFGvU6YXFJ8XHT5mHi', '081234567890', 5000000.00),
('1002', 'Ahmad Rizki', 'ahmad@email.com', '$2b$10$rQZ9QdSJFh1vXqz5O5Yw5uvYxHqXGqYbXfXMFGvU6YXFJ8XHT5mHi', '081234567891', 3500000.00),
('1003', 'Budi Santoso', 'budi@email.com', '$2b$10$rQZ9QdSJFh1vXqz5O5Yw5uvYxHqXGqYbXfXMFGvU6YXFJ8XHT5mHi', '081234567892', 2000000.00),
('1004', 'Dewi Lestari', 'dewi@email.com', '$2b$10$rQZ9QdSJFh1vXqz5O5Yw5uvYxHqXGqYbXfXMFGvU6YXFJ8XHT5mHi', '081234567893', 7500000.00),
('1005', 'Eko Prasetyo', 'eko@email.com', '$2b$10$rQZ9QdSJFh1vXqz5O5Yw5uvYxHqXGqYbXfXMFGvU6YXFJ8XHT5mHi', '081234567894', 1500000.00)
ON DUPLICATE KEY UPDATE name=name;

-- Transaksi dummy
INSERT INTO transactions (transaction_id, from_account, to_account, type, amount, balance_before, balance_after, description, layanan) VALUES
('TRX001', '1001', '1002', 'transfer_out', 500000.00, 5500000.00, 5000000.00, 'Transfer ke Ahmad Rizki', 'LAYANANA'),
('TRX002', '1002', '1001', 'transfer_in', 500000.00, 3000000.00, 3500000.00, 'Transfer dari Syifaul Fuadi', 'LAYANANA'),
('TRX003', '1001', NULL, 'debit', 250000.00, 5250000.00, 5000000.00, 'Pembayaran PLN', 'LAYANANB'),
('TRX004', '1001', NULL, 'credit', 1000000.00, 4000000.00, 5000000.00, 'Setoran Tunai', 'LAYANANA'),
('TRX005', '1003', '1001', 'transfer_in', 300000.00, 4700000.00, 5000000.00, 'Transfer dari Budi Santoso', 'LAYANANA')
ON DUPLICATE KEY UPDATE transaction_id=transaction_id;
