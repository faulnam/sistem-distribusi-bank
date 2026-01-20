/**
 * MAIN SERVER - Mini Bank API
 * Express.js Backend Server
 */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import config
import { Config } from './core/config.js';
import { testConnection } from './config/database.js';

// Import middleware
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Import routes
import authRoutes from './routes/auth.js';
import saldoRoutes from './routes/saldo.js';
import transferRoutes from './routes/transfer.js';
import historiRoutes from './routes/histori.js';
import mutasiRoutes from './routes/mutasi.js';

// Create Express app
const app = express();

// ============================================
// MIDDLEWARE
// ============================================

// CORS - Allow all origins for development
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Parse JSON body
app.use(express.json());

// Parse URL-encoded body
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.url}`);
    next();
});

// ============================================
// ROUTES
// ============================================

// Health check
app.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'Mini Bank API Server',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            saldo: '/api/saldo/:account',
            transfer: '/api/transfer',
            histori: '/api/histori/:account',
            mutasi: '/api/mutasi/:account'
        }
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/saldo', saldoRoutes);
app.use('/api/transfer', transferRoutes);
app.use('/api/histori', historiRoutes);
app.use('/api/mutasi', mutasiRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 Handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// ============================================
// START SERVER
// ============================================

const PORT = Config.PORT;

async function startServer() {
    // Test database connection
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
        console.error('❌ Tidak dapat connect ke database. Pastikan MySQL berjalan.');
        console.log('💡 Jalankan schema.sql di MySQL untuk membuat database dan tabel.');
        process.exit(1);
    }
    
    app.listen(PORT, () => {
        console.log('');
        console.log('🏦 ================================');
        console.log('   MINI BANK API SERVER');
        console.log('🏦 ================================');
        console.log(`✅ Server running on port ${PORT}`);
        console.log(`📍 http://localhost:${PORT}`);
        console.log(`🔧 Environment: ${Config.NODE_ENV}`);
        console.log('');
        console.log('📚 Available Endpoints:');
        console.log('   POST /api/auth/register');
        console.log('   POST /api/auth/login');
        console.log('   GET  /api/saldo/:account');
        console.log('   POST /api/transfer');
        console.log('   GET  /api/histori/:account');
        console.log('   GET  /api/mutasi/:account');
        console.log('🏦 ================================');
        console.log('');
    });
}

startServer();
