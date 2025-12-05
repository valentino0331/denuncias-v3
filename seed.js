const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const seedAdmin = async () => {
    const client = await pool.connect();
    try {
        console.log('Conectado a la base de datos...');

        // Check if admin exists
        const checkAdmin = await client.query('SELECT * FROM users WHERE email = $1', ['policianacional@denuncias.com']);

        if (checkAdmin.rows.length > 0) {
            console.log('El usuario admin ya existe.');
            // Update password just in case
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await client.query('UPDATE users SET password = $1, is_admin = TRUE, email_verified = TRUE WHERE email = $2', [hashedPassword, 'policianacional@denuncias.com']);
            console.log('Contraseña de admin actualizada.');
        } else {
            console.log('Creando usuario admin...');
            const hashedPassword = await bcrypt.hash('admin123', 10);

            await client.query(`
                INSERT INTO users (
                    dni, nombres, apellido_paterno, apellido_materno,
                    fecha_nacimiento, telefono, email, password,
                    direccion, distrito, is_admin, email_verified
                ) VALUES (
                    '00000000', 'Policia', 'Nacional', 'Peru',
                    '1990-01-01', '999999999', 'policianacional@denuncias.com', $1,
                    'Comisaria Central', 'Lima', TRUE, TRUE
                )
            `, [hashedPassword]);
            console.log('Usuario admin creado exitosamente.');
        }

    } catch (error) {
        console.error('Error en el seed:', error);
    } finally {
        client.release();
        pool.end();
    }
};

seedAdmin();
