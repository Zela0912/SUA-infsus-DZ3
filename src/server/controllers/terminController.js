export function createTerminController(terminService) {
  return {
    async list(req, res, next) {
      try {
        res.json(await terminService.list(req.query.search || ''));
      } catch (error) {
        next(error);
      }
    },

    async getById(req, res, next) {
      try {
        res.json(await terminService.getById(req.params.id));
      } catch (error) {
        next(error);
      }
    },

    async create(req, res, next) {
      try {
        res.status(201).json(await terminService.create(req.body));
      } catch (error) {
        next(error);
      }
    },

    async update(req, res, next) {
      try {
        res.json(await terminService.update(req.params.id, req.body));
      } catch (error) {
        next(error);
      }
    },

    async delete(req, res, next) {
      try {
        await terminService.delete(req.params.id);
        res.status(204).send();
      } catch (error) {
        next(error);
      }
    }
  };
}
