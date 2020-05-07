import React, { useReducer } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { makeApiRequest, geoCode } from '../helpers/utils';
import { FlexContainer, Typography } from '../helpers/globalStyles';
import {
  reducer,
  LOADING,
  SUCCESS,
  DONE,
  ADD_DATA,
  ERROR,
  UPDATE_DATA,
} from '../reducer';

const Form = styled.form`
  height: calc(100% - 8rem);
  width: 100%; 
  overflow-y: auto;
`;

const FileContainer = styled(FlexContainer)`
  width: 100%;
  height: 5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  background-color: #f6f6f6;
`;

const Wrapper = styled.div`
  padding: 1.4rem 1.2rem;
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

const InputContainer = styled.div`
  padding: 1.4rem 1.2rem;
  border-bottom: 1px solid rgb(238, 237, 236);
`;

const FormInput = styled(Input)`
  background-color: #fff;
  margin-top: 10px;
`;

const NotifMsg = styled.div`
  margin-bottom: 1rem;
  padding-left: 1.4rem;
  font-size: 0.7rem;
  color: ${({ color }) => color || 'red'};
`;

const Button = styled.button`
  width: 100%;
  padding: 1rem 0;
  border-radius: 3px;
  border: 0;
  background-color: #2d3747;
  cursor: pointer;
`;

const inputFields = [
  {
    name: 'name',
    label: 'Name',
    placeholder: 'What is the name of the Market?'
  },
  {
    name: 'description',
    label: 'Description',
    placeholder: 'Give a brief description of the market...',
  },
  {
    name: 'location',
    label: 'Address',
    placeholder: 'Where is this market located?'
  },
  {
    name: 'category',
    label: 'Category',
    placeholder: 'What category does this market belong to?'
  }
];

const initialInputState = {
  name: '',
  location: '',
  description: '',
  images: '',
  category: ''
};

const AddMarketTab = React.memo(({
  geoCoder,
  markets,
  dispatch,
  setInput,
  inputValues,
  setTab,
  setEdit,
  isEdit,
  selectedMarketId
}) => {
  const [{ loading, message, errorMessage }, addMarketDispatch] = useReducer(
    reducer, { loading: false, errorMessage: '', message: '', data: [] }
  );

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setInput(state => ({ ...state, [name]: value }));
  };

  const handleMarketSubmit = async (event) => {
    event.preventDefault();
    try {
      const { name, location, category } = inputValues;

      if (name && name.trim() && location && location.trim() && category && category.trim()) {
        const geoResults = await geoCode(geoCoder, { address: location });
        addMarketDispatch({
          type: LOADING
        });

        const response = await makeApiRequest(
          'market',
          isEdit ? 'PATCH' : 'POST',
          {
            ...inputValues,
            location: geoResults.location.join(','),
            ...(isEdit ? { id: selectedMarketId } : {})
          }
        );

        if (response && response.success) {
          addMarketDispatch({
            type: SUCCESS,
            message: response.message,
          });

          if (isEdit) {
            dispatch({
              type: UPDATE_DATA,
              data: markets.map(market => {
                if (market.id === `${response.data.id}`) {
                  return {
                    ...response.data,
                    location: geoResults.location,
                    marketName: response.data.name,
                    show: false,
                    formattedAddress: geoResults.formattedAddress
                  };
                }

                return market;
              })
            });
            setEdit(false);
          } else {
            dispatch({
              type: ADD_DATA,
              data: {
                ...response.data,
                location: geoResults.location,
                marketName: response.data.name,
                show: false,
                formattedAddress: geoResults.formattedAddress
              }
            });
          }
          setTab('Markets');
          setInput(initialInputState);
        } else {
          addMarketDispatch({
            type: ERROR,
            message: response.message || response.errors || response.error,
          });
        }
      }
    } catch (error) {
      addMarketDispatch({
        type: ERROR,
        errorMessage: 'Failed to add market',
      });
    }
  };

  const handleImageUpload = async (event) => {
    try {
      const selectedFiles = [];
      for (let iterator = 0; iterator < 3; iterator++) {
        selectedFiles.push(event.target.files[iterator]);
      }

      addMarketDispatch({
        type: LOADING
      });
      const uploadUrl = 'https://api.cloudinary.com/v1_1/do9avfka1/image/upload';

      const fetchResults = await Promise.all(selectedFiles.map(async (file) => {
        if (file) {
          const formdata = new FormData();
          formdata.append('file', file);
          formdata.append('upload_preset', 'msmssk5z');
          formdata.append('folder', 'market_photos');

          const fetchResult = await fetch(uploadUrl, {
            method: 'POST',
            body: formdata
          });

          return fetchResult.json();
        }
      }));

      addMarketDispatch({
        type: DONE,
        message: '',
      });
      setInput(state => ({
        ...state,
        images: fetchResults.map(fetchResult => fetchResult && fetchResult.url && fetchResult.url).join(','),
      }));
    } catch (error) {
      addMarketDispatch({
        type: ERROR,
        errorMessage: error,
      });
    }
  };

  return (
    <Form onSubmit={handleMarketSubmit}>
      {inputFields.map(field => {
        return (
          <InputContainer key={field.name}>
            <span style={{ fontSize: '0.7rem', color: 'rgb(51, 68, 89)' }}>{field.label}</span>
            <FormInput
              autoFocus
              type="text"
              name={field.name}
              required
              placeholder={field.placeholder}
              onChange={handleInputChange}
              value={inputValues[field.name]}
            />
          </InputContainer>
        );
      })}
      <Wrapper>
        <Typography fontSize="0.7rem" color="rgb(51, 68, 89)">Market image</Typography>
        <FileContainer>
          <input type="file" onChange={handleImageUpload} accept="image/*" multiple />
        </FileContainer>
        <Typography fontSize="0.7rem" color="#000">Maximum of 3 images allowed</Typography>
      </Wrapper>
      {message ? (
        <NotifMsg color="green">{message}</NotifMsg>
      ) : null}
      {errorMessage ? (
        <NotifMsg color="red">{errorMessage}</NotifMsg>
      ) : null}
      <Wrapper>
        <Button disabled={loading}>
          <span style={{ fontSize: '1rem', color: '#f8f8f9' }}>{isEdit ? 'Edit' : 'Add'} Market</span>
        </Button>
      </Wrapper>
    </Form>
  );
});

AddMarketTab.propTypes = {
  geoCoder: PropTypes.any.isRequired,
  markets: PropTypes.any.isRequired,
  dispatch: PropTypes.func.isRequired,
  setInput: PropTypes.func.isRequired,
  inputValues: PropTypes.any.isRequired,
  setTab: PropTypes.func.isRequired,
  setEdit: PropTypes.func.isRequired,
  isEdit: PropTypes.bool.isRequired,
  selectedMarketId: PropTypes.string.isRequired
};

export default AddMarketTab;
