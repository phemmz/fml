import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { FlexContainer, Typography } from '../helpers/globalStyles';

const Container = styled.div`
  height: 5rem;
  width: 100%;
  background-color: #000;
`;

const MainWrapper = styled(FlexContainer)`
  max-width: 1280px;
  height: 100%;
  width: 100%;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  & h1 {
    color: #fff;
  }
  @media(max-width: 1280px) {
    padding: 0 15px;
  }
`;

const Button = styled.button`
  margin-left: 1rem;
  border: 0;
  cursor: pointer;
  background-color: transparent;
`;

const Navbar = ({ isAdmin, currentUser, logOut, setIsOpen }) => {
  return (
    <Container>
      <MainWrapper>
        <h1>Food Market App</h1>
        {isAdmin ? (
          <FlexContainer>
            <Typography fontSize="1rem" fontWeight="500" color="#fff">
              {currentUser.name}
            </Typography>
            <Button onClick={logOut}>
              <Typography fontSize="1rem" fontWeight="500" color="#fff">Logout</Typography>
            </Button>
          </FlexContainer>
        ) : (
          <Button onClick={() => setIsOpen(true)}>
            <Typography fontSize="1rem" fontWeight="500" color="#fff">Login</Typography>
          </Button>
        )}
      </MainWrapper>
    </Container>
  );
};

Navbar.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  currentUser: PropTypes.any.isRequired,
  logOut: PropTypes.func.isRequired,
  setIsOpen: PropTypes.func.isRequired
};

export default Navbar;
