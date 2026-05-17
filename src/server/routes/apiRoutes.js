import express from 'express';
import { createCategoryController } from '../controllers/categoryController.js';
import { createLookupController } from '../controllers/lookupController.js';
import { createTerminController } from '../controllers/terminController.js';

export function createApiRoutes({ categoryService, terminService, lookupRepository }) {
  const router = express.Router();
  const categories = createCategoryController(categoryService);
  const termini = createTerminController(terminService);
  const lookups = createLookupController(lookupRepository);

  router.get('/termini', termini.list);
  router.get('/termini/:id', termini.getById);
  router.post('/termini', termini.create);
  router.put('/termini/:id', termini.update);
  router.delete('/termini/:id', termini.delete);

  router.get('/kategorije', categories.list);
  router.get('/kategorije/:id', categories.getById);
  router.post('/kategorije', categories.create);
  router.put('/kategorije/:id', categories.update);
  router.delete('/kategorije/:id', categories.delete);

  router.get('/lookups/kandidati', lookups.kandidati);
  router.get('/lookups/instruktori', lookups.instruktori);
  router.get('/lookups/vozila', lookups.vozila);

  return router;
}
