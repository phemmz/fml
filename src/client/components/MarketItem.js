import React from 'react';
import styled from 'styled-components';

import { FlexContainer, Typography } from '../helpers/globalStyles';

const MarketItemContainer = styled.div`
  padding: 1rem 1.2rem;
  cursor: pointer;
  & h3 {
    color: #334459;
    letter-spacing: -0.025em;
  }
  &:hover {
    background-color: #ecf5fd;
  }
`;

const Pill = styled(FlexContainer)`
  justify-content: center;
  padding: 0.3rem 1rem;
  border-radius: 1rem;
  background-color: #d2f0cd;
`;

const MarketItem = ({ marketName, category, formattedAddress, handleMouseEnter, handleClick }) => {
  return (
    <MarketItemContainer
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
    >
      <FlexContainer>
        <h3>{marketName}</h3>
        <Pill>
          <Typography
            color = "#466441"
            fontSize="0.8rem"
            fontWeight="500"
          >{category}</Typography>
        </Pill>
      </FlexContainer>
      <div>
        <Typography
          color = "#727477"
          fontSize="0.775rem"
          letterSpacing="0.07em"
        >{formattedAddress}</Typography>
      </div>
    </MarketItemContainer>
  );
};

export default MarketItem;
