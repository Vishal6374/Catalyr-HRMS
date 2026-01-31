import { sequelize } from './src/config/database';

async function checkColumns() {
    try {
        const [results] = await sequelize.query("DESCRIBE audit_logs");
        const columns = results.map((r: any) => r.Field);
        console.log("AuditLog Columns:", JSON.stringify(columns));
    } catch (error) {
        console.error("Error describing users table:", error);
    } finally {
        await sequelize.close();
    }
}

checkColumns();
