/**
 * SERVER CORE - Configuration
 */
import dotenv from "dotenv";
dotenv.config();

export const Config = {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    
    JWT: {
        SECRET: process.env.JWT_SECRET || 'default_secret',
        EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h'
    },
    
    LAYANAN: {
        SESAMA_BANK: 'LAYANANA',
        ANTAR_BANK: 'LAYANANB'
    },
    
    MIN_TRANSFER: 1000,
    MAX_TRANSFER: 50000000
};

export default Config;
