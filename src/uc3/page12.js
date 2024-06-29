import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Collapse, Button, Input } from 'antd';
import './page12.css';

const { Panel } = Collapse;
const { Search } = Input;

const CreateNewRouteStep3 = ({ routeName, startDate, endDate, onNext, onBack, onCancel }) => {
  const [favoritePlaces, setFavoritePlaces] = useState([]);
  const [allPlaces, setAllPlaces] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [isOrdered, setIsOrdered] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const customerId = localStorage.getItem("customer");

  useEffect(() => {
    fetchFavoritePlaces();
    fetchAllPlaces();
  }, []);

  const fetchFavoritePlaces = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/pois/favorite/${customerId}`);
      setFavoritePlaces(response.data);
    } catch (error) {
      console.error('Failed to fetch favorite places:', error);
    }
  };

  const fetchAllPlaces = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/pois/');
      setAllPlaces(response.data);
    } catch (error) {
      console.error('Failed to fetch all places:', error);
    }
  };

  const handlePlaceClick = (place) => {
    if (!selectedPlaces.some(selectedPlace => selectedPlace.poiId === place.poiId)) {
      setSelectedPlaces([...selectedPlaces, place]);
    }
  };

  const handleRemovePlaceClick = (place) => {
    setSelectedPlaces(selectedPlaces.filter(selectedPlace => selectedPlace.poiId !== place.poiId));
  };

  const handleNextClick = () => {
    if (selectedPlaces.length === 0) {
      alert('Please select at least one place to visit.');
      return;
    }
    onNext(routeName, startDate, endDate, selectedPlaces, isOrdered);
  };

  return (
    <div className="create-new-route-step">
      <h2>Create New Route</h2>
      <p>Add Places to visit:</p>
      <div className="selected-places">
        {selectedPlaces.length === 0 ? (
          <p>You don't have places to visit yet!</p>
        ) : (
          <ul>
            {selectedPlaces.map((place, index) => (
              <li key={index} className="selected-place">
                {place.name}
                <button className="remove-btn" onClick={() => handleRemovePlaceClick(place)}>Remove</button>
              </li>
            ))}
          </ul>
        )}
        <button onClick={() => setIsOrdered(!isOrdered)}>
          {isOrdered ? 'Make it unordered' : 'Make it ordered'}
        </button>
      </div>
      <Collapse>
        <Panel header="Add from your favourite list" key="1">
          <ul className="favourite-list scrollable-list">
            {favoritePlaces.map((place, index) => (
              <li key={index} onClick={() => handlePlaceClick(place)}>
                {place.name}
              </li>
            ))}
          </ul>
        </Panel>
        <Panel header="Search and add POIs" key="2">
          <Search
            placeholder="Search POIs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginBottom: 10 }}
          />
          <ul className="all-places-list scrollable-list">
            {allPlaces
              .filter(place => place.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((place, index) => (
                <li key={index} onClick={() => handlePlaceClick(place)}>
                  {place.name}
                </li>
              ))}
          </ul>
        </Panel>
      </Collapse>
      <div className="buttons">
        <Button onClick={onBack}>Back</Button>
        <Button type="primary" onClick={handleNextClick}>Next</Button>
        <Button onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
};

export default CreateNewRouteStep3;
