import 'dotenv/config';
import { createApp } from './app/create-app.js';

const port = Number(process.env.PORT) || 8000;
const host = process.env.HOST || '0.0.0.0';

const app = createApp();

async function shutdown(signal: string) {
  console.log(`\n${signal} received, shutting down...`);
  try {
    await app.close();
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
  console.log(`API Gateway running on http://${host}:${port}`);
});
