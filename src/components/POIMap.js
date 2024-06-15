import React, { useState } from 'react';
import SearchResults from './SearchResults';
import MapContainer from './mapContainer';
import SearchPanel from './searchBar';

const POIMap = () => {
    
  
  const [showResults, setShowResults] = useState(false);

  const handleButtonClick = () => {
    setShowResults(true);
  };
    return (
      <div style={{ height: '100vh', position: 'relative' }}>
      <SearchPanel />
      <MapContainer />
    </div>
    );
  
}

export default POIMap;
