import { Op } from 'sequelize';

import { Market, User } from '../models';
import { sendResponse, convertImagesToArray } from '../helpers/utils';

const addMarket = async (request, response) => {
  const { name, address, images = [], ...marketData } = request.body;
  try {
    const [data, created] = await Market.findOrCreate({
      where: { name, address },
      defaults: { ...marketData, images: images.join(','), userId: request.userId }
    });

    if (created) {
      const plainMarket = data.get({ plain: true });

      sendResponse(response, 201, {
        data: {
          ...plainMarket,
          images: plainMarket.images && plainMarket.images.split(',')
        },
        success: true,
        message: 'Market created successfully',
      });
    } else {
      sendResponse(response, 409, {
        success: false,
        message: 'Market already exist',
      });
    }
  } catch (error) {
    sendResponse(response, 500, {
      success: false,
      message: 'Failed to add market, please try again!',
      error
    });
  }
};

const getMarkets = async (request, response) => {
  try {
    let data;
    const { name = '', category = '', address = '' } = request.query;
    if (request.userId) {
      data = await User.findAll({
        where: {
          id: request.userId,
        },
        attributes: {
          exclude: ['password', 'createdAt', 'updatedAt']
        },
        include: [{
          model: Market,
          as: 'markets',
          where: {
            [Op.or]: [
              {
                name: {
                  [Op.iLike]: `%${name}%`
                },
                category: {
                  [Op.iLike]: `%${category}%`
                },
                address: {
                  [Op.iLike]: `%${address}%`
                },
              }
            ]
          }
        }]
      });
    } else {
      data = await Market.findAll({
        where: {
          [Op.or]: [
            {
              name: {
                [Op.iLike]: `%${name}%`
              },
              category: {
                [Op.iLike]: `%${category}%`
              },
              address: {
                [Op.iLike]: `%${address}%`
              },
            }
          ]
        }
      });
    }

    if (!data) {
      sendResponse(response, 404, {
        success: false,
        message: 'Market not found',
      });
    } else {
      sendResponse(response, 200, {
        data: request.userId ? data : convertImagesToArray(data),
        success: true,
        message: 'Successful',
      });
    }
  } catch (error) {
    sendResponse(response, 500, {
      success: false,
      message: 'Failed to get market, please try again!'
    });
  }
};

const updateMarket = async (request, response) => {
  try {
    const { id = '' } = request.body;
    if (!id) {
      sendResponse(response, 422, {
        success: false,
        message: 'Market id field is required',
      });
    } else {
      const market = await Market.findOne({
        where: {
          id,
          userId: request.userId
        }
      });

      if (!market) {
        sendResponse(response, 404, {
          success: false,
          message: 'Market not found',
        });
      } else {
        const updatedMarket = await market.update(request.body);
        sendResponse(response, 201, {
          data: updatedMarket,
          success: true,
          message: 'Market updated successfully',
        });
      }
    }
  } catch (error) {
    sendResponse(response, 500, {
      success: false,
      message: 'Failed to get market, please try again!'
    });
  }
};

const deleteMarket = async (request, response) => {
  try {
    const { id = '' } = request.body;
    if (!id) {
      sendResponse(response, 422, {
        success: false,
        message: 'Market id field is required',
      });
    } else {
      const market = await Market.findOne({
        where: {
          id,
          userId: request.userId
        }
      });

      if (!market) {
        sendResponse(response, 404, {
          success: false,
          message: 'Market not found',
        });
      } else {
        await market.destroy();
        sendResponse(response, 200, {
          success: true,
          message: 'Market deleted successfully',
        });
      }
    }
  } catch (error) {
    sendResponse(response, 500, {
      success: false,
      message: 'Failed to get market, please try again!'
    });
  }
};

export {
  addMarket,
  getMarkets,
  updateMarket,
  deleteMarket
};
