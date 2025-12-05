const nodemailer = require('nodemailer');
require('dotenv').config();

const testEmail = async () => {
    console.log('--- START TEST ---');
    try {
        const user = process.env.EMAIL_USER;
        const pass = process.env.EMAIL_PASSWORD;

        console.log(`User: ${user}`);
        console.log(`Pass length: ${pass ? pass.length : 0}`);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: user,
                pass: pass,
            },
        });

        const mailOptions = {
            from: user,
            to: user,
            subject: 'Test Email 2',
            text: 'Test email body.',
        };

        console.log('Attempting to send...');
        const info = await transporter.sendMail(mailOptions);
        console.log('SUCCESS: Email sent.');
        console.log('Message ID:', info.messageId);
    } catch (error) {
        console.error('ERROR: Failed to send email.');
        console.error(error);
    }
    console.log('--- END TEST ---');
};

testEmail().then(() => console.log('Done.'));
