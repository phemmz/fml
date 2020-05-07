import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import MarketItem from './MarketItem';
import AddMarketTab from './AddMarketTab';
import SearchFilter from './SearchFilter';
import {
  SUCCESS,
  ERROR,
  UPDATE_DATA,
} from '../reducer';
import { makeApiRequest, geoCode } from '../helpers/utils';
import { FlexContainer, Typography } from '../helpers/globalStyles';

const Container = styled.div`
  width: 22rem;
  height: 100%;
  background-color: #fff;
`;

const TabHeader = styled(FlexContainer)`
  height: 7rem;
  justify-content: flex-start;
  padding: 0rem 1.2rem;
  border-bottom: 1px solid #eeedec;
`;

const TabItemContainer = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  & > div:first-child {
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0rem 1.2rem;
    & span {
      fontSize: 1rem;
      font-weight: 500;
    }
  }
`;

const TabLine = styled.div`
  position: absolute;
  bottom: 0;
  height: 4px;
  width: 100%;
  background-color: #000;
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

const FilterContainer = styled(FlexContainer)`
  width: 100%;
  justify-content: flex-start;
  margin-top: 1rem;
  flex-wrap: wrap;
  & > div:not(:last-child) {
    margin-right: 0.8rem;
  }
`;

const TabItem = ({ title, isActive, handleClick }) => {
  return (
    <TabItemContainer onClick={() => handleClick(title)}>
      <div>
        <span>{title}</span>
      </div>
      <div />
      {isActive ? <TabLine /> : null}
    </TabItemContainer>
  );
};

const LeftPane = ({
  isAdmin,
  geoCoder,
  handleMouseEnter,
  markets,
  initialData,
  dispatch,
  setInput,
  inputValues,
  setTab,
  activeTab,
  setEdit,
  isEdit,
  selectedMarketId,
  marketLoading
}) => {
  const [activeFilter, setFilter] = useState('name');
  const [searchValue, setSearch] = useState('');

  const handleTabChange = (tab) => {
    setTab(tab);
  };

  const handleFilterClick = (filter) => {
    setFilter(filter);
  };

  const handleSearch = async (event) => {
    try {
      const { value } = event.target;
      setSearch(value);

      if (value.length) {
        const isNearestMarket = activeFilter === 'nearestMarket';
        let marketSearchLocation;
        if (isNearestMarket) {
          marketSearchLocation = await geoCode(geoCoder, { address: value });
        }
        const url = `market?${activeFilter}=${isNearestMarket ? marketSearchLocation.location.join(',') : value}`;
        const response = await makeApiRequest(url, 'GET');

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
        } else {
          dispatch({
            type: ERROR,
            errorMessage: response.message,
          });
        }
      } else {
        dispatch({
          type: UPDATE_DATA,
          data: initialData,
        });
      }
    } catch (error) {
      dispatch({
        type: ERROR,
        errorMessage: 'Failed to get markets',
      });
    }
  };

  return (
    <Container>
      <TabHeader>
        <TabItem title="Markets" handleClick={handleTabChange} isActive={activeTab === 'Markets'} />
        {isAdmin ? (
          <TabItem title="Add Market" handleClick={handleTabChange} isActive={activeTab === 'Add Market'} />
        ) : null}
      </TabHeader>
      {activeTab === 'Markets' ? (
        <>
          <div style={{ padding: '1.4rem 1.2rem' }}>
            <div style={{ height: '2.8rem', width: '100%', backgroundColor: 'rgb(246, 246, 246)', borderRadius: 4 }}>
              <Input
                type="text"
                name="search"
                placeholder="Search Market"
                onChange={handleSearch}
                style={{ backgroundColor: 'rgb(246, 246, 246)', padding: '0 0.8rem' }}
                value={searchValue}
              />
            </div>
            <FilterContainer>
              {['name', 'category', 'nearestMarket'].map(filter => {
                return (
                  <SearchFilter
                    key={filter}
                    onClick={() => handleFilterClick(filter)}
                    label={filter === 'nearestMarket' ? 'Nearest Market' : filter}
                    activeFilter={activeFilter === filter}
                  />
                );
              })}
            </FilterContainer>
          </div>
          <div style={{ height: '60%', width: '100%', overflowY: 'auto' }}>
            {marketLoading ? (
              <FlexContainer style={{ height: '100%', justifyContent: 'center' }}>
                <Typography>Loading...</Typography>
              </FlexContainer>
            ) : markets.map((market) => {
              return (
                <MarketItem
                  key={market.id}
                  {...market}
                  handleMouseEnter={() => handleMouseEnter(market)}
                />
              );
            })}
          </div>
        </>
      ) : null}
      {activeTab === 'Add Market' ? (
        <AddMarketTab
          geoCoder={geoCoder}
          markets={markets}
          dispatch={dispatch}
          setInput={setInput}
          inputValues={inputValues}
          setTab={setTab}
          setEdit={setEdit}
          isEdit={isEdit}
          selectedMarketId={selectedMarketId}
        />
      ) : null}
    </Container>
  );
};

LeftPane.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  geoCoder: PropTypes.any.isRequired,
  handleMouseEnter: PropTypes.func.isRequired,
  markets: PropTypes.any.isRequired,
  dispatch: PropTypes.func.isRequired,
  setInput: PropTypes.func.isRequired,
  inputValues: PropTypes.any.isRequired,
  setTab: PropTypes.func.isRequired,
  activeTab: PropTypes.string.isRequired,
  setEdit: PropTypes.func.isRequired,
  isEdit: PropTypes.bool.isRequired,
  selectedMarketId: PropTypes.string.isRequired,
  initialData: PropTypes.any.isRequired,
  marketLoading: PropTypes.bool.isRequired
};

export default LeftPane;
