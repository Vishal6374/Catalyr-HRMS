import { Sequelize } from 'sequelize';
import { config } from './index';

export const sequelize = new Sequelize(
    config.database.name,
    config.database.user,
    config.database.password,
    {
        host: config.database.host,
        port: config.database.port,
        dialect: 'mysql',
        logging: config.env === 'development' ? console.log : false,
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
        define: {
            timestamps: true,
            underscored: true,
            freezeTableName: true,
        },
    }
);

export const testConnection = async (): Promise<void> => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully.');
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
        throw error;
    }
};

export const syncDatabase = async (force = false, alter = false): Promise<void> => {
    try {
        // force: drops and recreates tables (data loss)
        // alter: updates existing tables to match models (safer)
        await sequelize.sync({ force, alter });
        const mode = force ? '(force mode - tables recreated)' : alter ? '(alter mode - tables updated)' : '(safe mode)';
        console.log(`✅ Database synchronized ${mode}.`);
    } catch (error) {
        console.error('❌ Database synchronization failed:', error);
        throw error;
    }
};
