import 'dotenv/config';
import { createApp } from './app.js';
import { disconnectPrisma } from './shared/prisma.js';

const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST || '0.0.0.0';

const app = createApp();

async function shutdown(signal: string) {
  console.log(`\n${signal} received, shutting down...`);
  try {
    await app.close();
    await disconnectPrisma();
    console.log('Shutdown complete');
    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
}

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));

app.listen({ port, host }, (err) => {
  if (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
  console.log(`Order Service running on http://${host}:${port}`);
  console.log(`DATABASE_URL set: ${Boolean(process.env.DATABASE_URL)}`);
});
