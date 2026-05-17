import { createApp } from './app.js';
import { config } from './config/env.js';
import { pool } from './db/pool.js';

const app = createApp(pool);

const server = app.listen(config.port, () => {
  console.log(`SUA API listening on http://127.0.0.1:${config.port}`);
});

server.on('error', (error) => {
  console.error(error);
  process.exitCode = 1;
});
