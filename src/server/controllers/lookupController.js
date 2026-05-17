export function createLookupController(lookupRepository) {
  return {
    async kandidati(req, res, next) {
      try {
        res.json(await lookupRepository.kandidati());
      } catch (error) {
        next(error);
      }
    },

    async instruktori(req, res, next) {
      try {
        res.json(await lookupRepository.instruktori());
      } catch (error) {
        next(error);
      }
    },

    async vozila(req, res, next) {
      try {
        res.json(await lookupRepository.vozila());
      } catch (error) {
        next(error);
      }
    }
  };
}
