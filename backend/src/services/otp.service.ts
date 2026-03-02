import { redis } from "../config/redis";

export async function storeOTP(email: string, otp: string) {
    await redis.set(`otp:${email}`, otp, "EX", 300); // 5 minutes
}

export async function verifyOTP(email: string, otp: string) {
    const stored = await redis.get(`otp:${email}`);
    if (stored === otp) {
        await redis.del(`otp:${email}`);
        return true;
    }
    return false;
}

export async function storeMagicToken(token: string, userId: string) {
    await redis.set(`magic:${token}`, userId, "EX", 600); // 10 minutes
}

export async function verifyMagicToken(token: string) {
    const userId = await redis.get(`magic:${token}`);
    if (userId) {
        await redis.del(`magic:${token}`);
        return userId;
    }
    return null;
}
export async function storeResetOTP(email: string, otp: string) {
    await redis.set(`reset:otp:${email}`, otp, "EX", 300); // 5 minutes
}

export async function verifyResetOTP(email: string, otp: string) {
    const stored = await redis.get(`reset:otp:${email}`);
    if (stored === otp) {
        await redis.del(`reset:otp:${email}`);
        return true;
    }
    return false;
}

export async function storeResetSession(email: string, token: string) {
    await redis.set(`reset:session:${email}`, token, "EX", 600); // 10 minutes
}

export async function verifyResetSession(email: string, token: string) {
    const stored = await redis.get(`reset:session:${email}`);
    if (stored === token) {
        await redis.del(`reset:session:${email}`);
        return true;
    }
    return false;
}
