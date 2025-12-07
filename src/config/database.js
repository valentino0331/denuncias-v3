const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const createTables = async () => {
    const client = await pool.connect();
    try {
        await client.query(`
        CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        dni VARCHAR(8) UNIQUE NOT NULL,
        nombres VARCHAR(100) NOT NULL,
        apellido_paterno VARCHAR(100) NOT NULL,
        apellido_materno VARCHAR(100) NOT NULL,
        fecha_nacimiento DATE NOT NULL,
        telefono VARCHAR(9) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        direccion TEXT NOT NULL,
        distrito VARCHAR(100) NOT NULL,
        nombre_padre VARCHAR(200),
        nombre_madre VARCHAR(200),
        email_verified BOOLEAN DEFAULT FALSE,
        verification_code VARCHAR(6),
        is_admin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `);

        await client.query(`
        CREATE TABLE IF NOT EXISTS reports (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        description TEXT NOT NULL,
        date DATE NOT NULL,
        time TIME NOT NULL,
        testigos TEXT,
        detalles_adicionales TEXT,
        objetos_robados TEXT,
        monto_aproximado DECIMAL(10,2),
        points JSONB NOT NULL,
        exact_location JSONB,
        verified INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `);

        await client.query(`
        CREATE TABLE IF NOT EXISTS password_resets (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            code VARCHAR(6) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            expires_at TIMESTAMP NOT NULL
        );
        `);

        console.log('Tablas creadas exitosamente');
    } catch (error) {
        console.error('Error creando tablas:', error);
    } finally {
        client.release();
    }
};

createTables();

module.exports = pool;