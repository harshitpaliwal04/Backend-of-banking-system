const nodemailer = require('nodemailer');

// src/UTILS/sendEmail.js
const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS    // 👈 app password
        }
});

// Verify connection once on startup
transporter.verify((error, success) => {
        if (error) {
                console.error('Email server error →', error.message);
        } else {
                console.log('Email server ready ✅');
        }
});

// Base send function
const sendEmail = async (to, subject, html) => {
        try {
                const info = await transporter.sendMail({
                        from: `VaultX <${process.env.EMAIL_USER}>`,
                        to,
                        subject,
                        html
                });
                console.log('Email sent →', info.messageId);
                return info;
        } catch (err) {
                console.error('Email error →', err.message);
                throw err;  // 👈 throw so caller knows it failed
        }
};

// Registration email
const sendRegistrationEmail = async (email, name) => {
        const subject = `Welcome to VaultX ${name}`;
        const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Welcome to VaultX 🏦</h2>
            <p>Hey <strong>${name}</strong>,</p>
            <p>Thank you for registering at VaultX. 
               We are excited to have you on board.</p>
            <br/>
            <p>Best regards,</p>
            <p><strong>VaultX Team</strong></p>
        </div>
    `;
        await sendEmail(email, subject, html);
};

// Transaction email
const sendTransactionEmail = async (email, name, amount, to) => {
        const subject = 'Transaction Alert 🔔';
        const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Transaction Alert 🔔</h2>
            <p>Hey <strong>${name}</strong>,</p>
            <p>Your transaction of <strong>${amount}</strong> 
               has been processed to <strong>${to}</strong>.</p>
            <br/>
            <p>Best regards,</p>
            <p><strong>VaultX Team</strong></p>
        </div>
    `;
        await sendEmail(email, subject, html);
};

// Password reset email
const sendPasswordResetEmail = async (email, name, resetLink) => {
        const subject = 'Password Reset Request 🔒';
        const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Password Reset 🔒</h2>
            <p>Hey <strong>${name}</strong>,</p>
            <p>Click the link below to reset your password:</p>
            <a href="${resetLink}" 
               style="background:#4CAF50; color:white; 
                      padding:10px 20px; text-decoration:none; 
                      border-radius:5px;">
                Reset Password
            </a>
            <p>This link expires in 1 hour.</p>
            <br/>
            <p>Best regards,</p>
            <p><strong>VaultX Team</strong></p>
        </div>
    `;
        await sendEmail(email, subject, html);
};

module.exports = {
        sendRegistrationEmail,
        sendTransactionEmail,
        sendPasswordResetEmail
};


// const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//                 type: 'OAuth2',
//                 user: process.env.EMAIL_USER,
//                 // pass : process.env.EMAIL_PASS,
//                 clientId: process.env.CLIENT_ID,
//                 clientSecret: process.env.CLIENT_SECRET,
//                 refreshToken: process.env.REFRESH_TOKEN,
//         },
// });

// // Verify the connection configuration
// transporter.verify((error, success) => {
//         if (error) {
//                 console.error('Error connecting to email server:', error);
//         }
//         else {
//                 console.log('Email server is ready to send messages');
//         }
// });

// // Function to send email
// const sendEmail = async (to, subject, text, html) => {
//         try {
//                 const info = await transporter.sendMail({
//                         from: `VaultX <${process.env.EMAIL_USER}>`, // sender address
//                         to, // list of receivers
//                         subject, // Subject line
//                         text, // plain text body
//                         html, // html body
//                 });

//                 console.log(info);

//                 console.log('Message sent: %s', info.messageId);
//                 console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
//         } catch (error) {
//                 console.error('Error sending email:', error);
//         }
// };

// async function sendRegistrationEmail(userEmail, name) {
//         const subject = 'Welcome to VaultX';
//         const text = `Hello ${name}. Thank you for registering at VaultX.`;
//         const html = `<p>Hello ${name}.<br><br>Thank you for registering at VaultX.
//         We are excited to have you on board.<br><br>Best regards,<br>VaultX Team.`;

//         console.log(userEmail);
//         console.log(subject);
//         console.log(text);
//         console.log(html);

//         await sendEmail(userEmail, subject, text, html);
// }

// async function sendTransactionEmail(userEmail, name, amount, to) {
//         const subject = 'Transaction Alert';
//         const text = `Hello ${name}. Your transaction of ${amount} has been processed.`;
//         const html = `<p>Hello ${name}.<br><br>Your transaction of ${amount} has been processed to ${to}.<br><br>Best regards,<br>VaultX Team`;

//         await sendEmail(userEmail, subject, text, html);
// }


// module.exports = {
//         sendRegistrationEmail,
//         sendTransactionEmail
// };