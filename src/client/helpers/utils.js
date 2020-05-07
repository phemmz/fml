const makeApiRequest = async (url, method, requestBody = {}) => {
  const token = localStorage.getItem('token');

  try {
    const options = {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
    };
    const extendedOptions = method !== 'GET' ? { ...options, body: JSON.stringify(requestBody) } : options;
    const response = await fetch(`http://localhost:5000/api/v1/${url}`, extendedOptions);

    return await response.json();
  } catch (error) {
    return error;
  }
};

const geoCode = (geoCoder, address) => {
  return new Promise((resolve) => {
    geoCoder.geocode(address, (results, status) => {
      if (status === 'OK') {
        // resolves both latlng location and formattedaddress
        const lat = results[0].geometry.location.lat();
        const lng = results[0].geometry.location.lng();
        resolve({
          location: [lat, lng],
          formattedAddress: results[0].formatted_address
        });
      } else {
        resolve();
      }
    });
  });
};

export {
  makeApiRequest,
  geoCode
};
