import nodemailer from 'nodemailer';

let transporter: any; // We will assign the actual transporter object after we create the Ethereal account

// Build the switch logic
if (process.env.NODE_ENV === 'production') {
    //  PRODUCTION MODE: Use your real email provider (SendGrid, Gmail, etc.)
    transporter = nodemailer.createTransport({
        service: 'gmail', // Or whatever you eventually use
        auth: {
            user: process.env.PROD_EMAIL_USER,
            pass: process.env.PROD_EMAIL_PASS,
        },
    });
    console.log('Production Email transporter is ready!');
} else {
    // DEVELOPMENT MODE: Use the fake Ethereal sandbox
    transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: process.env.ETHEREAL_USER, // Pulled safely from .env!
            pass: process.env.ETHEREAL_PASS,
        },
    });
    console.log('Local Testing (Ethereal) transporter is ready!');
}

export const sendVerificationEmail = async (
    userEmail: string,
    token: string
) => {
    try {
        const verificationLink = `${process.env.CLIENT_ORIGIN}/verify?token=${token}`;

        const info = await transporter.sendMail({
            from: `"Pantry Tracker" <${process.env.ETHEREAL_USER}>`,
            to: userEmail,
            subject: 'Verify your account',
            html: `
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
            `,
        });

        console.log(`Verification email successfully sent to ${userEmail}`);

        // THE ETHEREAL MAGIC 
        // This generates a clickable link in your terminal to view the fake email!
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        console.log('----------------------------------------\n');
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Failed to send verification email');
    }
};
