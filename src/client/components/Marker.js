import React from 'react';
import PropTypes from 'prop-types';

import InfoWindowCard from './InfoWindowCard';

const Marker = ({ market: { show, ...props }, isAdmin, handleDelete, handleEdit }) => {
  const markerStyle = {
    border: '1px solid white',
    borderRadius: '50%',
    height: show ? 12 : 10,
    width: show ? 12 : 10,
    backgroundColor: show ? 'red' : 'blue',
    cursor: 'pointer',
    zIndex: 10,
  };

  return (
    <>
      <div style={markerStyle} />
      {show &&
        <InfoWindowCard
          {...props}
          isAdmin={isAdmin}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
        />
      }
    </>
  );
};

Marker.propTypes = {
  show: PropTypes.bool.isRequired,
  market: PropTypes.any.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired
};


export default Marker;
