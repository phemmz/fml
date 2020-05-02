import jwt from 'jsonwebtoken';

import { User } from '../models';
import { validateMiddleware } from '../helpers/validator';
import { sendResponse } from '../helpers/utils';

const validateSignup = (request, response, next) => {
  validateMiddleware(
    request.body,
    response,
    next,
    ['name', 'email', 'password', 'validEmail', 'passwordLength']
  );
};

const validateLogin = (request, response, next) => {
  validateMiddleware(
    request.body,
    response,
    next,
    ['email', 'password', 'validEmail', 'passwordLength']
  );
};

const authenticate = (request, response, next) => {
  try {
    const authorizationHeader = request.headers.authorization;
    let token;
    if (authorizationHeader) {
      token = authorizationHeader.split(' ')[1];
    }

    if (token) {
      jwt.verify(token, process.env.JWTSECRET, async (error, decoded) => {
        if (error) {
          sendResponse(response, 403, {
            success: false,
            error: "You don't have permission to access this route!"
          });
        } else {
          const data = await User.findOne({
            where: { id: decoded.id },
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            }
          });

          if (data) {
            request.userId = decoded.id;
            next();
          } else {
            sendResponse(response, 403, {
              success: false,
              error: "You don't have permission to access this route!"
            });
          }
        }
      });
    } else {
      sendResponse(response, 403, {
        success: false,
        error: "You don't have permission to access this route!"
      });
    }
  } catch (error) {
    sendResponse(response, 500, {
      success: false,
      error: 'Server failed, please try again!'
    });
  }
};

export {
  validateSignup,
  validateLogin,
  authenticate
};
