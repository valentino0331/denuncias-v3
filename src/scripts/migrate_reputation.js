const pool = require('../config/database');

const migrate = async () => {
    try {
        console.log('Starting migration...');

        // Add reputation column to users if it doesn't exist
        await pool.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'reputation') THEN
                    ALTER TABLE users ADD COLUMN reputation INTEGER DEFAULT 100;
                    RAISE NOTICE 'Added reputation column to users table';
                END IF;
            END $$;
        `);

        // Add status column to reports if it doesn't exist
        await pool.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reports' AND column_name = 'status') THEN
                    ALTER TABLE reports ADD COLUMN status VARCHAR(20) DEFAULT 'pending';
                    RAISE NOTICE 'Added status column to reports table';
                END IF;
            END $$;
        `);

        console.log('Migration completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrate();
