import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

import { User } from '../models';
import { sendResponse } from '../helpers/utils';

const signup = async (request, response) => {
  const { email, ...signupData } = request.body;
  try {
    const [data, created] = await User.findOrCreate({
      where: { email },
      defaults: { ...signupData, id: uuidv4() }
    });

    if (created) {
      const plainUser = data.get({ plain: true });

      sendResponse(response, 201, {
        data: {
          id: plainUser.id,
          role: plainUser.role,
          email: plainUser.email,
          name: plainUser.name,
        },
        success: true,
        message: 'User created successfully',
      });
    } else {
      sendResponse(response, 409, {
        success: false,
        message: 'User already exist',
      });
    }
  } catch (error) {
    sendResponse(response, 500, {
      success: false,
      message: 'Failed to create user, please try again!',
      error
    });
  }
};

const login = async (request, response) => {
  const { email, password } = request.body;
  try {
    const data = await User.findOne({
      where: { email },
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    });

    if (data) {
      const plainData = data.get({ plain: true });
      const { password: hashedPassword, ...userObj } = plainData;
      const isUser = bcrypt.compareSync(password, hashedPassword);

      if (isUser) {
        const token = jwt.sign({
          id: userObj.id,
          name: userObj.name,
          role: userObj.role
        }, process.env.JWTSECRET, { expiresIn: 60 * 60 });

        sendResponse(response, 200, {
          data: userObj,
          success: true,
          token,
          message: 'User logged in successfully',
        });
      } else {
        sendResponse(response, 401, {
          success: false,
          message: 'Invalid email or password',
        });
      }
    } else {
      sendResponse(response, 401, {
        success: false,
        message: 'Invalid email or password',
      });
    }
  } catch (error) {
    sendResponse(response, 500, {
      success: false,
      message: 'Failed to create user, please try again!'
    });
  }
};

export {
  signup,
  login
};
