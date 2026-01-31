import { sequelize, testConnection, syncDatabase } from '../config/database';
import '../models'; // Import all models and associations

const runMigration = async () => {
    try {
        console.log('🚀 Starting Final Migration...');

        await testConnection();

        console.log('⚠️  Dropping all existing tables and recreating them...');

        // Disable foreign key checks to ensure clean drop
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

        // Sync database with force: true
        await syncDatabase(true);

        // Re-enable foreign key checks
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

        console.log('✅ Final Migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Final Migration failed:', error);
        process.exit(1);
    }
};

runMigration();
