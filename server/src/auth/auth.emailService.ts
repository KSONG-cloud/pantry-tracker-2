import nodemailer from 'nodemailer';
import { Resend } from 'resend';

const isProduction = process.env.NODE_ENV === 'production';

// 1. Initialize our email clients separately to avoid TypeScript 'any' issues
const resend = isProduction ? new Resend(process.env.RESEND_API_KEY) : null;

const nodemailerTransporter = !isProduction
    ? nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
              user: process.env.ETHEREAL_USER,
              pass: process.env.ETHEREAL_PASS,
          },
      })
    : null;

if (process.env.NODE_ENV === 'production') {
    console.log('Production Email transporter is ready!');
} else {
    console.log('Local Testing (Ethereal) transporter is ready!');
}

export const sendVerificationEmail = async (
    userEmail: string,
    token: string
) => {
    try {
        const verificationLink = `${process.env.CLIENT_ORIGIN}/verify?token=${token}`;

        const htmlContent = `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Welcome to the App!</h2>
                <p>Click the button below to verify your email address and activate your account.</p>
                <a href="${verificationLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">
                    Verify My Account
                </a>
                <p style="margin-top: 20px; font-size: 12px; color: gray;">
                    If you didn't request this, please ignore this email.
                </p>
            </div>
        `;

        const subject = 'Verify your account';

        if (isProduction && resend) {
            await resend.emails.send({
                from: `"Pantry Tracker" <${process.env.RESEND_EMAIL_USER}>`,
                to: userEmail,
                subject: subject,
                html: htmlContent,
            });
            console.log(
                `Verification email successfully sent to ${userEmail} via Resend`
            );
        } else if (nodemailerTransporter) {
            const info = await nodemailerTransporter.sendMail({
                from: `"Pantry Tracker" <${process.env.ETHEREAL_USER}>`,
                to: userEmail,
                subject: subject,
                html: htmlContent,
            });
            console.log(
                `Verification email successfully sent to ${userEmail} via Ethereal`
            );

            // THE ETHEREAL MAGIC
            // This generates a clickable link in your terminal to view the fake email!
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        } else {
            throw new Error('No email transporter available');
        }
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Failed to send verification email');
    }
};
