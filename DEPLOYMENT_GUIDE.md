# Production Deployment Guide: MedAuth Backend

This guide outlines the steps to deploy the MedAuth backend as a **Web Service** on [Render.com](https://render.com), using **Supabase** (PostgreSQL) and **Redis Cloud**.

---

## 1. Prerequisites

1.  **PostgreSQL**: A connection string from [Supabase](https://supabase.com).
2.  **Redis**: A connection string from [Redis Cloud](https://app.redislabs.com) or Render's Managed Redis.
3.  **SMTP**: A Gmail App Password or SendGrid/Postmark credentials.
4.  **GitHub**: Repository containing the MedAuth source code.

---

## 2. Render.com Configuration

### Service Type
*   **Service Type**: Web Service
*   **Runtime**: Node

### Build & Start Commands
*   **Build Command**: `npm install && npm run build`
*   **Start Command**: `npm start`

### Environment Variables
Add these via the Render Dashboard (**Environment** tab):

| Key | Value (Example) | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Set to production mode |
| `DATABASE_URL` | `postgresql://...` | Supabase connection string |
| `REDIS_URL` | `redis://...` | Redis Cloud connection string |
| `JWT_ACCESS_SECRET` | `(32+ character random string)` | For Access tokens |
| `JWT_REFRESH_SECRET` | `(32+ character random string)` | For Refresh tokens |
| `JWT_ACCESS_EXPIRATION` | `15m` | Token validity |
| `JWT_REFRESH_EXPIRATION` | `7d` | Session validity |
| `EMAIL_USER` | `you@gmail.com` | SMTP User |
| `EMAIL_PASS` | `xxxx xxxx xxxx xxxx` | Gmail App Password |
| `FRONTEND_URL` | `https://your-frontend.onrender.com` | Production Frontend URL |
| `PORT` | `10000` | Render usually sets this automatically |

---

## 3. Database Management (Prisma)

### Initial Migration
To sync your Supabase database with the code for the first time:
```bash
npx prisma migrate deploy
```
*Note: Run this locally with your production `DATABASE_URL` or via Render's "Shell" after the first build.*

### Generating Prisma Client
The `postinstall` script in `package.json` ensures that `npx prisma generate` runs automatically on Render during the build process.

---

## 4. Production Security Hardening

The system includes the following built-in production features:
*   **Helmet.js**: Implemented in `app.ts` for secure HTTP headers.
*   **Rate Limiting**: Configured in `rateLimiter.ts` (100 req/min).
*   **CORS**: Dynamically allows your `FRONTEND_URL`.
*   **Audit Logging**: Continuous logging to `AuditLog` table and Winston.
*   **Argon2**: High-entropy password hashing.

---

## 5. Health Checks

Render uses the health check endpoint to determine if the deploy was successful.
*   **Health Check Path**: `/api/health`
*   **Expectation**: Returns `200 OK` with `status: "UP"`.

---

## 6. Troubleshooting

1.  **Build Fails**: Check the logs for TypeScript errors. Ensure `node_modules` are not committed and `package-lock.json` is present.
2.  **Database Connection Error**: Ensure the Supabase IP addresses are allowed (or "Allow access from anywhere" is temporarily enabled in Supabase settings).
3.  **401 Unauthorized in Prod**: Ensure your `JWT_ACCESS_SECRET` on Render matches exactly what you expect. Clear browser cache to remove old tokens.
4.  **CORS Errors**: Verify that `FRONTEND_URL` on Render exactly matches the URL in your browser address bar (including `https://` but NO trailing slash).

---

**Deployed with ❤️ for the TetherX Hackathon.**
