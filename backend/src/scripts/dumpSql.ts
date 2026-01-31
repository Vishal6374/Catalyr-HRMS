import { sequelize } from '../config/database';
import '../models';

const dump = async () => {
    try {
        // Run sync with logging and capture it
        // We use force: true to get the CREATE TABLE statements, 
        // but it doesn't matter if it's logging.
        await sequelize.sync({
            force: true, logging: (sql) => {
                if (sql.includes('CREATE TABLE')) {
                    console.log(sql + ';');
                }
            }
        });

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

dump();
