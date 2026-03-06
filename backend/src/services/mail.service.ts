import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function sendOTPEmail(to: string, otp: string) {
<<<<<<< HEAD
=======
    if (to.endsWith('@medauth.test')) {
        console.log(`[TEST_MAIL_BYPASS] OTP for ${to}: ${otp}`);
        return;
    }
>>>>>>> 3b5969d318a5ab0380d1a8d5df4c76d8197bf107
    try {
        await transporter.sendMail({
            from: `"MedAuth" <${process.env.EMAIL_USER}>`,
            to,
            subject: "Verify your MedAuth account",
            html: `
        <h2>Verify your MedAuth account</h2>
        <p>Your verification code:</p>
        <h1>${otp}</h1>
        <p>Valid for 5 minutes.</p>
      `,
        });
    } catch (err) {
        console.error("Error sending OTP email: ", err);
    }
}

export async function sendPasswordResetEmail(to: string, otp: string) {
<<<<<<< HEAD
=======
    if (to.endsWith('@medauth.test')) {
        console.log(`[TEST_MAIL_BYPASS] Password Reset OTP for ${to}: ${otp}`);
        return;
    }
>>>>>>> 3b5969d318a5ab0380d1a8d5df4c76d8197bf107
    try {
        await transporter.sendMail({
            from: `"MedAuth" <${process.env.EMAIL_USER}>`,
            to,
            subject: "Reset your password",
            html: `
        <h2>Reset your password</h2>
        <p>Your reset code:</p>
        <h1>${otp}</h1>
        <p>If you did not request this, ignore.</p>
      `,
        });
    } catch (err) {
        console.error("Error sending password reset email: ", err);
    }
}

export async function sendMagicLinkEmail(to: string, url: string) {
<<<<<<< HEAD
=======
    if (to.endsWith('@medauth.test')) {
        console.log(`[TEST_MAIL_BYPASS] Magic Link for ${to}: ${url}`);
        return;
    }
>>>>>>> 3b5969d318a5ab0380d1a8d5df4c76d8197bf107
    try {
        await transporter.sendMail({
            from: `"MedAuth" <${process.env.EMAIL_USER}>`,
            to,
            subject: "Login to MedAuth",
            html: `
        <h2>Login to MedAuth</h2>
        <p>Click the secure link below to log in:</p>
        <a href="${url}" style="display:inline-block;padding:10px 20px;background:#007bff;color:#fff;text-decoration:none;border-radius:5px;">Login Securely</a>
        <p>Link expires in 10 minutes.</p>
      `,
        });
    } catch (err) {
        console.error("Error sending magic link email: ", err);
    }
}
<<<<<<< HEAD
=======
export async function sendPasswordChangedEmail(to: string) {
    if (to.endsWith('@medauth.test')) {
        console.log(`[TEST_MAIL_BYPASS] Password Changed Confirmation for ${to}`);
        return;
    }
    try {
        await transporter.sendMail({
            from: `"MedAuth" <${process.env.EMAIL_USER}>`,
            to,
            subject: "Your password has been changed",
            html: `
        <h2>Password Changed</h2>
        <p>Your MedAuth password has been successfully changed.</p>
        <p>If you did not perform this action, please contact support immediately.</p>
        <p>Timestamp: ${new Date().toLocaleString()}</p>
      `,
        });
    } catch (err) {
        console.error("Error sending password change confirmation email: ", err);
    }
}
>>>>>>> 3b5969d318a5ab0380d1a8d5df4c76d8197bf107
