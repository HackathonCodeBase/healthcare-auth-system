import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
    PORT: z.string().default('3000'),
    DATABASE_URL: z.string().url(),
    REDIS_URL: z.string().url(),
    JWT_ACCESS_SECRET: z.string().min(10),
    JWT_REFRESH_SECRET: z.string().min(10),
    JWT_ACCESS_EXPIRATION: z.string().default('15m'),
    JWT_REFRESH_EXPIRATION: z.string().default('7d'),
    EMAIL_USER: z.string().email(),
    EMAIL_PASS: z.string().min(1),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
<<<<<<< HEAD
=======
    FRONTEND_URL: z.string().optional(),
>>>>>>> 3b5969d318a5ab0380d1a8d5df4c76d8197bf107
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error('Invalid environment variables:', parsed.error.format());
    process.exit(1);
}

export const env = parsed.data;
