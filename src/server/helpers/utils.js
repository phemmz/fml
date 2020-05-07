const sendResponse = (response, status, data) => {
  response.status(status).json(data);
};

const convertImagesToArray = (data) =>
  data.map(({ images, ...rest }) => ({
    ...rest.dataValues,
    images: images ? images.split(',') : []
  }));

export {
  sendResponse,
  convertImagesToArray
};
