import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { FlexContainer, } from '../helpers/globalStyles';

const Container = styled(FlexContainer)`
  & > div:first-child {
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 0.4rem;
    background-color: ${({ activeFilter }) => activeFilter ? '#000' : '#fff'};
    border:  ${({ activeFilter }) => activeFilter ? '0' : '1px solid #000'};
  }
  & span {
    margin-left: 0.2rem;
    font-size: 0.7rem;
  }
  cursor: pointer;
`;

const SearchFilter = ({ label, activeFilter, onClick }) => {
  return (
    <Container onClick={onClick} activeFilter={activeFilter}>
      <div />
      <span>{label}</span>
    </Container>
  );
};

SearchFilter.propTypes = {
  label: PropTypes.string.isRequired,
  activeFilter: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};

export default SearchFilter;
