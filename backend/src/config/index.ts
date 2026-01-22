import dotenv from 'dotenv';
import path from 'path';

// Load environment-specific .env file
const envFile = process.env.NODE_ENV === 'production'
    ? '.env.production'
    : '.env.development';

// Load the environment-specific file first, then fall back to .env
dotenv.config({ path: path.resolve(__dirname, '../../', envFile) });
dotenv.config(); // Fallback to .env for any missing variables

export const config = {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '5000', 10),

    database: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306', 10),
        name: process.env.DB_NAME || 'hrm',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
    },

    jwt: {
        secret: process.env.JWT_SECRET || 'change-this-secret',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'change-this-refresh-secret',
        expiresIn: process.env.JWT_EXPIRES_IN || '15m',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    },

    cors: {
        // Support multiple origins separated by comma
        origin: process.env.CORS_ORIGIN
            ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
            : 'http://localhost:8080',
    },

    api: {
        baseUrl: process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 5000}`,
    },

    upload: {
        maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB
        uploadDir: process.env.UPLOAD_DIR || 'uploads',
    },

    email: {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        user: process.env.SMTP_USER,
        password: process.env.SMTP_PASSWORD,
        from: process.env.SMTP_FROM || 'noreply@hrharmony.com',
    },
};
