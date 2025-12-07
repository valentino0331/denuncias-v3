const pool = require('./src/config/database');

const addColumn = async () => {
    try {
        console.log('Adding "imagenes" column to reports table...');
        await pool.query(`
            ALTER TABLE reports 
            ADD COLUMN IF NOT EXISTS imagenes JSONB;
        `);
        console.log('Column "imagenes" added successfully!');
    } catch (error) {
        console.error('Error adding column:', error);
    } finally {
        // Close the pool to allow the script to exit
        // Note: pool.end() might not be available depending on how pool is exported, 
        // but usually pg pool has it. If not, the script might hang, which is fine for a one-off.
        process.exit();
    }
};

addColumn();
