import React, { useState, useEffect, useReducer } from 'react';
import GoogleMapReact from 'google-map-react';
import styled, { createGlobalStyle } from 'styled-components';
import Modal from 'react-modal';
import jwtDecode from 'jwt-decode';

import { Marker, Navbar, LeftPane } from './components';
import {
  reducer,
  LOADING,
  SUCCESS,
  INITIAL_DATA,
  ERROR,
  UPDATE_DATA,
  DELETE_DATA
} from './reducer';
import { Typography } from './helpers/globalStyles';
import { makeApiRequest, geoCode } from './helpers/utils';
import { validateFields } from '../server/helpers/validator';

import './App.css';

Modal.setAppElement('#root');

const GlobalStyle = createGlobalStyle`
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  h2 {
    margin: 0;
  }
`;

const Input = styled.input`
  height: 100%;
  width: 100%; 
  font-size: 16px;
  outline: 0;
  border: 0;
  ::placeholder {
    color: #000;
    opacity: 1;
    font-weight: 300;
    font-size: 16px;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 1rem 0;
  border-radius: 3px;
  border: 0;
  background-color: #2d3747;
  cursor: pointer;
`;

const Header = styled.h2`
  margin: 0 0 1rem 0;
`;

const FormWrapper = styled.div`
  min-width: 25rem;
  @media(max-width: 460px) {
    width: 100%;
    min-width: 100%;
  }
`;

const ModalWrapper = styled.div`
  @media(max-width: 460px) {
    width: 15rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const NotifMsg = styled.div`
  margin-bottom: 1rem;
  font-size: 0.7rem;
  color: ${({ color }) => color || 'red'};
`;

const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.3)'
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

const initialInputState = {
  name: '',
  location: '',
  description: '',
  images: '',
  category: ''
};

const initialLoginState = {
  email: '',
  password: '',
};

let geoCoder;
function App() {
  const [inputValues, setInput] = useState(initialInputState);
  const [activeTab, setTab] = useState('Markets');
  const [isEdit, setEdit] = useState(false);
  const [selectedMarketId, setMarketId] = useState('');
  const [mapCenter] = useState([6.5243793, 3.3792057]);
  const [loginInputValues, setLogin] = useState(initialLoginState);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [{ loading: marketLoading, data: markets, initialData }, dispatch] = useReducer(
    reducer, { loading: false, errorMessage: '', data: [], initialData: [] }
  );
  const [
    {
      loading: loginLoading,
      data: currentUser,
      errorMessage: loginError
    },
    loginDispatch] = useReducer(reducer, { loading: false, errorMessage: '', data: [] });
  const isAdmin = currentUser && currentUser.role === 'admin';

  const fetchMarkets = async () => {
    try {
      dispatch({
        type: LOADING
      });

      const response = await makeApiRequest('market', 'GET');

      if (response && response.success) {
        const updatedMarket = await Promise.all(
          response.data.map(async (market) => {
            const splittedLocation = market.location.split(',');
            const geoResults = await geoCode(geoCoder, {
              location: {
                lat: parseFloat(splittedLocation[0]),
                lng: parseFloat(splittedLocation[1])
              }
            });

            const marketObj = {
              ...market,
              marketName: market.name,
              show: false,
              formattedAddress: geoResults.formattedAddress,
              location: geoResults.location
            };

            return marketObj;
          })
        );

        dispatch({
          type: SUCCESS,
          data: updatedMarket,
        });
        dispatch({
          type: INITIAL_DATA,
          data: updatedMarket,
        });
      } else {
        dispatch({
          type: ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      dispatch({
        type: ERROR,
        errorMessage: 'Failed to get markets',
      });
    }
  };

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedUser = jwtDecode(token);
        if (decodedUser) {
          loginDispatch({
            type: SUCCESS,
            data: decodedUser
          });
        }
      }

      fetchMarkets();
    } catch (error) {
      loginDispatch({
        type: ERROR,
      });
    }
  }, []);

  const onChildClickCallback = (key) => {
    const updatedMarket = markets.map(({ show, ...rest }) => {
      return {
        ...rest,
        show: rest.id === key ? !show : false
      };
    });

    dispatch({
      type: UPDATE_DATA,
      data: updatedMarket
    });
  };

  const handleApiLoaded = (map, maps) => {
    geoCoder = new maps.Geocoder();
  };

  const handleInputLogin = (event) => {
    const { name, value } = event.target;

    setLogin(state => ({ ...state, [name]: value }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const validateResult = validateFields(
        loginInputValues,
        ['email', 'password', 'validEmail', 'passwordLength']
      );

      if (Object.keys(validateResult).length) {
        loginDispatch({
          type: ERROR,
          message: validateResult
        });
      } else {
        loginDispatch({
          type: ERROR,
          message: {}
        });
        loginDispatch({
          type: LOADING
        });

        const response = await makeApiRequest(
          'login',
          'POST',
          loginInputValues
        );

        if (response && response.success) {
          localStorage.setItem('token', response.token);
          loginDispatch({
            type: SUCCESS,
            data: response.data
          });
          setIsOpen(false);
        } else {
          loginDispatch({
            type: ERROR,
            message: {
              error: response.message
            },
          });
        }
      }
    } catch (error) {
      loginDispatch({
        type: ERROR,
        errorMessage: error,
      });
    }
  };

  const toggleModal = () => {
    setIsOpen(state => !state);
  };

  const logOut = () => {
    localStorage.removeItem('token');
    loginDispatch({
      type: SUCCESS,
      data: {}
    });
  };

  const handleMouseEnter = (market) => {
    // setMapCenter(market.location);
    onChildClickCallback(market.id);
  };

  const handleEdit = (id) => {
    const market = markets.find(currentMarket => currentMarket.id === id);
    if (market) {
      setInput({
        name: market.marketName,
        location: market.formattedAddress,
        description: market.description,
        category: market.category
      });
      setTab('Add Market');
      setEdit(true);
      setMarketId(id);
      onChildClickCallback(id);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await makeApiRequest('market', 'DELETE', { id });

      if (response && response.success) {
        dispatch({
          type: DELETE_DATA,
          data: markets.filter(market => market.id !== id)
        });
      } else {
        dispatch({
          type: ERROR,
          message: response.message || response.errors || response.error,
        });
      }
    } catch (error) {
      dispatch({
        type: ERROR,
        message: error
      });
    }
  };

  return (
    <div style={{ height: '100vh', width: '100%', }}>
      <GlobalStyle />
      <Navbar
        isAdmin={isAdmin}
        currentUser={currentUser}
        logOut={logOut}
        setIsOpen={setIsOpen}
      />
      <div style={{ height: '100%', width: '100%', backgroundColor: '#dadcdb' }}>
        <div style={{ height: '100%', maxWidth: '1280px', width: '100%', padding: '5rem 2rem', margin: 'auto', }}>
          <div style={{ height: '100%', width: '100%', /* minHeight: '50rem', */ display: 'flex', alignItems: 'center', boxShadow: '0px 2px 4px rgba(0,0,0,0.18)' }}>
            <LeftPane
              markets={markets}
              handleMouseEnter={handleMouseEnter}
              isAdmin={isAdmin}
              geoCoder={geoCoder}
              dispatch={dispatch}
              setInput={setInput}
              setTab={setTab}
              activeTab={activeTab}
              inputValues={inputValues}
              setEdit={setEdit}
              isEdit={isEdit}
              selectedMarketId={selectedMarketId}
              initialData={initialData}
              marketLoading={marketLoading}
            />
            <div style={{ width: 'calc(100% - 22rem)', height: '100%' }}>
              <GoogleMapReact
                bootstrapURLKeys={{ key: process.env.REACT_APP_MAP_KEY }}
                // bootstrapURLKeys={{ key: 'AIzaSyCnFPqjeZvEpoyhlH-HxDqhduidbwO4sUk' }}
                center={mapCenter}
                defaultZoom={10}
                onChildClick={(key) => onChildClickCallback(key)}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
              >
                {markets.map(market => {
                  return (
                    <Marker
                      key={market.id}
                      lat={market.location[0]}
                      lng={market.location[1]}
                      show={market.show}
                      market={market}
                      handleDelete={handleDelete}
                      handleEdit={handleEdit}
                      isAdmin={isAdmin}
                    />
                  );
                })}
              </GoogleMapReact>
            </div>
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={toggleModal}
              style={customStyles}
            >
              <ModalWrapper>
                <FormWrapper>
                  <Header style={{ textAlign: 'center' }}>Login</Header>
                  {loginError.error ? (
                    <NotifMsg>{loginError.error}</NotifMsg>
                  ) : null}
                  <form onSubmit={handleLogin}>
                    <div style={{ height: '2.8rem', width: '100%', backgroundColor: 'rgb(246, 246, 246)', borderRadius: 4, marginBottom: loginError.email ? '0.2rem' : '1rem' }}>
                      <Input
                        type="text"
                        name="email"
                        required
                        placeholder="Email"
                        onChange={handleInputLogin}
                        value={loginInputValues.email}
                        style={{ backgroundColor: 'rgb(246, 246, 246)', padding: '0 0.8rem' }}
                      />
                    </div>
                    {loginError.email ? (
                      <NotifMsg>{loginError.email}</NotifMsg>
                    ) : null}
                    <div style={{ height: '2.8rem', width: '100%', backgroundColor: 'rgb(246, 246, 246)', borderRadius: 4, marginBottom: loginError.password ? '0.2rem' : '1rem' }}>
                      <Input
                        type="password"
                        name="password"
                        required
                        placeholder="Password"
                        onChange={handleInputLogin}
                        value={loginInputValues.password}
                        style={{ backgroundColor: 'rgb(246, 246, 246)', padding: '0 0.8rem' }}
                      />
                    </div>
                    {loginError.password ? (
                      <NotifMsg>{loginError.password}</NotifMsg>
                    ) : null}
                    <Button disabled={loginLoading}>
                      <Typography fontSize="1rem" color="#f8f8f9">LOGIN</Typography>
                    </Button>
                  </form>
                </FormWrapper>
              </ModalWrapper>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
