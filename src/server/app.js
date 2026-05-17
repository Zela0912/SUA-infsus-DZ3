import cors from 'cors';
import express from 'express';
import { AppError } from './errors/AppError.js';
import { CategoryRepository } from './repositories/categoryRepository.js';
import { LookupRepository } from './repositories/lookupRepository.js';
import { TerminRepository } from './repositories/terminRepository.js';
import { createApiRoutes } from './routes/apiRoutes.js';
import { CategoryService } from './services/categoryService.js';
import { TerminService } from './services/terminService.js';

export function createApp(pool) {
  const app = express();
  const categoryRepository = new CategoryRepository(pool);
  const terminRepository = new TerminRepository(pool);
  const lookupRepository = new LookupRepository(pool);
  const categoryService = new CategoryService(categoryRepository);
  const terminService = new TerminService(terminRepository);

  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
  app.use('/api', createApiRoutes({ categoryService, terminService, lookupRepository }));

  app.use((req, res) => {
    res.status(404).json({ error: 'Ruta nije pronadena.' });
  });

  app.use((error, req, res, next) => {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }

    if (error.code === '23505') {
      res.status(409).json({ error: 'Zapis s istom jedinstvenom vrijednosti vec postoji.' });
      return;
    }

    console.error(error);
    res.status(500).json({ error: 'Interna greska posluzitelja.' });
  });

  return app;
}
