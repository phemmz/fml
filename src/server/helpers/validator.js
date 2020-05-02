import { sendResponse } from './utils';

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line

const validateFields = (data, requiredFields = []) => {
  const errors = {};
  requiredFields.forEach(field => {
    if (field === 'validEmail') {
      if (data.email && !emailRegex.test(data.email.trim())) {
        errors.email = 'Please enter a valid email address';
      }
    } else if (field === 'passwordLength') {
      if (data.password && data.password.length < 6) {
        errors.password = 'Password length must not be less than 6 characters';
      }
    } else {
      if (!data[field]) {
        errors[field] = `Please fill in ${field}`;
      }

      if (data[field] && !data[field].trim()) {
        errors[field] = `Please fill in ${field}`;
      }
    }
  });

  return errors;
};

const validateMiddleware = (data, response, next, requiredFields) => {
  try {
    const errors = validateFields(data, requiredFields);

    if (Object.keys(errors).length) {
      sendResponse(response, 422, { errors });
    } else {
      next();
    }
  } catch (error) {
    sendResponse(response, 500, {
      success: false,
      error: 'Server failed, please try again!'
    });
  }
};

export {
  validateFields,
  validateMiddleware
};
