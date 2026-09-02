import * as http from 'node:http';

export interface App {
  listen: (port: number, callback: () => void) => void;
}

export function createApp(): App {
  const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    if (url.pathname === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', service: 'order-service' }));
      return;
    }
    res.writeHead(404);
    res.end('Not Found');
  });

  return {
    listen: (port: number, callback: () => void) => {
      server.listen(port, callback);
    },
  };
}
