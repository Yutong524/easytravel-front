import React, { useState } from 'react';
import SearchResults from './SearchResults';
import MapContainer from './mapContainer';
import SearchPanel from './searchBar';

const POIMap = () => {
    
  const addresses = [
    "1600 Amphitheatre Parkway, Mountain View, CA",
    "One Apple Park Way, Cupertino, CA",
    "1 Infinite Loop, Cupertino, CA"
  ];
  const [showResults, setShowResults] = useState(false);

  const handleButtonClick = () => {
    setShowResults(true);
  };
    return (
      <div style={{ height: '100vh', position: 'relative' }}>
      <SearchPanel />
      <MapContainer addresses={addresses} />
    </div>
    );
  
}

export default POIMap;
