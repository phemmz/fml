import { validateMiddleware } from '../helpers/validator';

const validateMarket = (request, response, next) => {
  validateMiddleware(request.body, response, next, ['name', 'category', 'location']);
};

export {
  validateMarket,
};
