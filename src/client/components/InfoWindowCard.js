import React, { useState } from 'react';
import styled from 'styled-components';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import Modal from 'react-modal';
import PropTypes from 'prop-types';

import edit from '../assets/edit.svg';
import trash from '../assets/trash.svg';
import { FlexContainer, Typography } from '../helpers/globalStyles';

Modal.setAppElement('#root');
const AutoPlaySwipeableViews = autoPlay(SwipeableViews);


const CarouselContainer = styled.div`
  position: relative;
  height: 8rem;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  & > div:first-child {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
`;

const EditWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  margin: 0.7rem 0.7rem 0 0;
  display: flex;
  align-items: center;
`;

const EditContainer = styled.button`
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  margin-left: ${({ marginLeft }) => marginLeft || 0};
  background-color: #fff;
  outline: 0;
  border: 1px solid #b9b7b6;
  cursor: pointer;
`;

const DotContainer = styled(FlexContainer)`
  width: 100%;
  height: 100%;
  position: absolute;
  bottom: 0;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 5px;
  background-color: rgba(0,0,0,.3);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  & > div {
    width: 8px;
    height: 8px;
    border-radius: 4px;
  }
  & > div:not(:last-child) {
    margin-right: 5px;
  }
`;

const InfoWindowCard = ({
  id,
  marketName,
  category,
  formattedAddress,
  images: marketImages,
  description,
  handleEdit,
  handleDelete,
  isAdmin
}) => {
  const images = marketImages ? marketImages.split(',') : [];
  const infoWindowStyle = {
    position: 'relative',
    left: '-125px',
    top: '-18rem',
    minHeight: '16rem',
    width: 250,
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0px 2px 4px rgba(0,0,0,0.18)',
    fontSize: 14,
    zIndex: 100,
  };
  const [selectedIndex, setImage] = useState(0);
  const filteredImages = images.filter(image => image);

  return (
    <div style={infoWindowStyle}>
      <CarouselContainer>
        <AutoPlaySwipeableViews
          autoplay
          index={selectedIndex}
          interval={6000}
          onChangeIndex={setImage}
        >
          {filteredImages.map(image => {
            return (
              <div
                key={image}
                style={{ height: '8rem', width: '100%', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
              >
                <img src={image} alt={marketName} width="100%" height="100%" />
              </div>
            );
          })}
        </AutoPlaySwipeableViews>
        <DotContainer>
          {filteredImages.map((image, index) =>
            <div
              key={image}
              style={{ backgroundColor: selectedIndex === index ? '#464545' : '#fff' }}
            />
          )}
        </DotContainer>
        {isAdmin ? (
          <EditWrapper>
            <EditContainer onClick={() => handleEdit(id)}>
              <img src={edit} width="14px" height="14px" alt="edit" />
            </EditContainer>
            <EditContainer marginLeft="0.4rem" onClick={() => handleDelete(id)}>
              <img src={trash} width="14px" height="14px" alt="trash" />
            </EditContainer>
          </EditWrapper>
        ) : null}
      </CarouselContainer>
      <div style={{ padding: 10, borderBottom: '1px solid rgb(238, 237, 236)' }}>
        <FlexContainer>
          <h2 style={{ color: '#334459', letterSpacing: '-0.025em' }}>{marketName}</h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.3rem 1rem', borderRadius: '1rem', backgroundColor: '#d2f0cd' }}>
            <Typography fontSize="0.8rem" fontWeight="500" color="#466441">{category}</Typography>
          </div>
        </FlexContainer>
        <Typography color="#727477" fontSize="0.875rem" letterSpacing="0.07em">{formattedAddress}</Typography>
      </div>
      <div style={{ padding: 10, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}>
        <Typography color="#727477" fontSize="0.875rem" lineHeight="1.5">{description}</Typography>
      </div>
    </div>
  );
};

InfoWindowCard.defaultProps = {
  images: ''
};

InfoWindowCard.propTypes = {
  id: PropTypes.string.isRequired,
  marketName: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  formattedAddress: PropTypes.string.isRequired,
  images: PropTypes.any,
  description: PropTypes.string,
  handleEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired
};

export default InfoWindowCard;
