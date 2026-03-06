import { z } from 'zod';

const blockedDomains = ['example.com', 'test.com', 'demo.com'];

const emailSchema = z.string().email().refine(
    (email) => {
        const domain = email.split('@')[1].toLowerCase();
        return !blockedDomains.includes(domain);
    },
    { message: 'Please use a real email address (test domains are not allowed)' }
);

export const registerSchema = z.object({
    body: z.object({
        email: emailSchema,
        password: z.string().min(8),
        name: z.string().min(2),
        role: z.enum(['ADMIN', 'DOCTOR', 'NURSE', 'PATIENT']),
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string().min(1),
    }),
});

export const refreshSchema = z.object({
    body: z.object({
        token: z.string().min(10),
    }),
});

export const verifyOtpSchema = z.object({
    body: z.object({
        email: emailSchema,
        otp: z.string().min(6),
    }),
});

export const resendOtpSchema = z.object({
    body: z.object({
        email: emailSchema,
    }),
});

export const forgotPasswordSchema = z.object({
    body: z.object({
        email: emailSchema,
    }),
});

<<<<<<< HEAD
export const resetPasswordSchema = z.object({
    body: z.object({
        email: emailSchema,
        otp: z.string().min(6),
        newPassword: z.string().min(8),
=======
export const verifyResetOtpSchema = z.object({
    body: z.object({
        email: emailSchema,
        otp: z.string().length(6),
    }),
});

export const resetPasswordSchema = z.object({
    body: z.object({
        email: emailSchema,
        token: z.string().min(10),
        newPassword: z.string().min(8).regex(/[A-Z]/, "Password must contain an uppercase letter").regex(/[0-9]/, "Password must contain a number"),
>>>>>>> 3b5969d318a5ab0380d1a8d5df4c76d8197bf107
    }),
});

export const magicLinkSchema = z.object({
    body: z.object({
        email: emailSchema,
    }),
});

export const magicLoginSchema = z.object({
    query: z.object({
        token: z.string().min(10),
    }),
});
