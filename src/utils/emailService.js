const sgMail = require('@sendgrid/mail');
require('dotenv').config();

// Configurar SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendVerificationEmail = async (email, code, nombres) => {
    const msg = {
        to: email,
        from: process.env.EMAIL_USER || 'sisdenunciasdg@gmail.com',
        subject: 'Verificación de Cuenta - Denuncias Digitales',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4F46E5;">Bienvenido a Denuncias Digitales</h2>
            <p>Hola <strong>${nombres}</strong>,</p>
            <p>Gracias por registrarte. Tu código de verificación es:</p>
            <div style="background-color: #EEF2FF; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                <h1 style="color: #4F46E5; font-size: 36px; letter-spacing: 8px; margin: 0;">${code}</h1>
            </div>
            <p>Este código expirará en 15 minutos.</p>
            <p>Si no solicitaste este registro, por favor ignora este mensaje.</p>
            <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">
            <p style="color: #6B7280; font-size: 12px;">Este es un mensaje automático, por favor no respondas a este correo.</p>
        </div>
        `,
    };

    try {
        await sgMail.send(msg);
        console.log('Email enviado a:', email);
        return true;
    } catch (error) {
        console.error('Error enviando email:', error);
        if (error.response) {
            console.error('SendGrid error details:', error.response.body);
        }
        return false;
    }
};

const sendPasswordResetEmail = async (email, code) => {
    const msg = {
        to: email,
        from: process.env.EMAIL_USER || 'sisdenunciasdg@gmail.com',
        subject: 'Recuperación de Contraseña - Denuncias Digitales',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4F46E5;">Recuperación de Contraseña</h2>
            <p>Hola,</p>
            <p>Has solicitado restablecer tu contraseña. Tu código de verificación es:</p>
            <div style="background-color: #EEF2FF; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                <h1 style="color: #4F46E5; font-size: 36px; letter-spacing: 8px; margin: 0;">${code}</h1>
            </div>
            <p>Este código expirará en 15 minutos.</p>
            <p>Si no solicitaste este cambio, por favor ignora este mensaje.</p>
            <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">
            <p style="color: #6B7280; font-size: 12px;">Este es un mensaje automático, por favor no respondas a este correo.</p>
        </div>
        `,
    };

    try {
        await sgMail.send(msg);
        console.log('Email de recuperación enviado a:', email);
        return true;
    } catch (error) {
        console.error('Error enviando email:', error);
        return false;
    }
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail };