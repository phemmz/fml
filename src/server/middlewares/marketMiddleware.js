import { validateMiddleware } from '../helpers/validator';

const validateMarket = (request, response, next) => {
  validateMiddleware(request.body, response, next, ['name', 'category', 'address']);
};

export {
  validateMarket,
};
