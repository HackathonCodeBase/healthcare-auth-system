import { z } from 'zod';

export const registerSchema = z.object({
    body: z.object({
        email: z.string().email(),
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
        email: z.string().email(),
        otp: z.string().min(6),
    }),
});

export const resendOtpSchema = z.object({
    body: z.object({
        email: z.string().email(),
    }),
});

export const forgotPasswordSchema = z.object({
    body: z.object({
        email: z.string().email(),
    }),
});

export const resetPasswordSchema = z.object({
    body: z.object({
        email: z.string().email(),
        otp: z.string().min(6),
        newPassword: z.string().min(8),
    }),
});

export const magicLinkSchema = z.object({
    body: z.object({
        email: z.string().email(),
    }),
});

export const magicLoginSchema = z.object({
    query: z.object({
        token: z.string().min(10),
    }),
});
