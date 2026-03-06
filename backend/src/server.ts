import app from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { prisma } from './config/database';

async function startServer() {
    try {
        // Check DB connection
        await prisma.$connect();
        logger.info('Connected to Database successfully');

<<<<<<< HEAD
        const port = env.PORT || 3000;
        app.listen(port, () => {
=======
        const port = Number(env.PORT) || 3000;
        app.listen(port, '0.0.0.0', () => {
>>>>>>> 3b5969d318a5ab0380d1a8d5df4c76d8197bf107
            logger.info(`Server is running on port ${port} in ${env.NODE_ENV} mode`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
