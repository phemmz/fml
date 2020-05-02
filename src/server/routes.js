import express from 'express';

import {
  signup,
  login
} from './controllers/user';
import {
  addMarket,
  getMarkets,
  updateMarket,
  deleteMarket
} from './controllers/market';

import {
  validateSignup,
  validateLogin,
  authenticate,
} from './middlewares/userMiddleware';
import {
  validateMarket
} from './middlewares/marketMiddleware';

const router = express.Router();

router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);
router.get('/market', getMarkets);
router.get('/admin/market', authenticate, getMarkets);
router.post('/market', validateMarket, authenticate, addMarket);
router.patch('/market', authenticate, updateMarket);
router.delete('/market', authenticate, deleteMarket);

export default router;
