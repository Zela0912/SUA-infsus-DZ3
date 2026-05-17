import { describe, expect, it, vi } from 'vitest';
import { createCategoryController } from '../../../src/server/controllers/categoryController.js';
import { AppError } from '../../../src/server/errors/AppError.js';

function response() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
    send() {
      return this;
    }
  };
}

describe('CategoryController', () => {
  it('returns categories from the service', async () => {
    const controller = createCategoryController({ list: vi.fn(async () => [{ id: 1, oznaka: 'B' }]) });
    const res = response();

    await controller.list({ query: { search: 'b' } }, res, vi.fn());

    expect(res.body).toEqual([{ id: 1, oznaka: 'B' }]);
  });

  it('uses 201 for successful create', async () => {
    const controller = createCategoryController({ create: vi.fn(async () => ({ id: 2, oznaka: 'A' })) });
    const res = response();

    await controller.create({ body: { oznaka: 'A' } }, res, vi.fn());

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ id: 2, oznaka: 'A' });
  });

  it('passes validation errors to error middleware', async () => {
    const next = vi.fn();
    const controller = createCategoryController({ create: vi.fn(async () => { throw new AppError('Neispravno.'); }) });

    await controller.create({ body: {} }, response(), next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: 'Neispravno.' }));
  });
});
