export function createCategoryController(categoryService) {
  return {
    async list(req, res, next) {
      try {
        res.json(await categoryService.list(req.query.search || ''));
      } catch (error) {
        next(error);
      }
    },

    async getById(req, res, next) {
      try {
        res.json(await categoryService.getById(req.params.id));
      } catch (error) {
        next(error);
      }
    },

    async create(req, res, next) {
      try {
        res.status(201).json(await categoryService.create(req.body));
      } catch (error) {
        next(error);
      }
    },

    async update(req, res, next) {
      try {
        res.json(await categoryService.update(req.params.id, req.body));
      } catch (error) {
        next(error);
      }
    },

    async delete(req, res, next) {
      try {
        await categoryService.delete(req.params.id);
        res.status(204).send();
      } catch (error) {
        next(error);
      }
    }
  };
}
