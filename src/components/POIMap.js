import React, { useState } from 'react';
import MapContainer from './mapContainer';
import SearchPanel from './searchBar';

let addresses = []; 

const POIMap = () => {
  
  const fakePOIJson = '[{ "_id": { "$oid": "666b143477966d35d3e306ac" }, "name": "Golden Gate Bridge", "address": "Golden Gate Brg, San Francisco, CA", "category": "history", "description": "Each year the Golden Gate Bridge attracts more than 10 million visitors to take in its tremendous 746-foot tall towers, sweeping main cables, signature International Orange color and Art Deco styling. It is a sensory experience featuring color, light and sound.", "openTime": [ { "day": "MONDAY", "startTime": "00:00:00", "endTime": "24:00:00" }, { "day": "TUESDAY", "startTime": "00:00:00", "endTime": "24:00:00" }, { "day": "WEDNESDAY", "startTime": "00:00:00", "endTime": "24:00:00" }, { "day": "THURSDAY", "startTime": "00:00:00", "endTime": "24:00:00" }, { "day": "FRIDAY", "startTime": "00:00:00", "endTime": "24:00:00" }, { "day": "SATURDAY", "startTime": "00:00:00", "endTime": "24:00:00" }, { "day": "SUNDAY", "startTime": "00:00:00", "endTime": "24:00:00" } ], "rating": 4.5, "comments": [ { "time": "2024-06-13 12:31:21", "publisher": "testUser1", "content": "a comment for testing.", "rating": 5 }, { "time": "2024-06-13 14:12:21", "publisher": "testUser2", "content": "another comment for testing.", "rating": 4 } ], "architectureStyle": "Art Deco", "establishedYear": 1937, "access": "public", "id": 1 }, { "_id": { "$oid": "666b17e477966d35d3e306ad" }, "name": "Palace of Fine Arts", "address": "3601 Lyon St, San Francisco, CA 94123", "category": "recreation", "description": "Built for the 1915 Panama-Pacific exhibition, the Palace of Fine Arts is now available for corporate, private events, conferences and galas.", "openTime": [ { "day": "MONDAY", "startTime": "00:00:00", "endTime": "00:00:00" }, { "day": "TUESDAY", "startTime": "10:00:00", "endTime": "17:00:00" }, { "day": "WEDNESDAY", "startTime": "10:00:00", "endTime": "17:00:00" }, { "day": "THURSDAY", "startTime": "10:00:00", "endTime": "17:00:00" }, { "day": "FRIDAY", "startTime": "10:00:00", "endTime": "17:00:00" }, { "day": "SATURDAY", "startTime": "10:00:00", "endTime": "17:00:00" }, { "day": "SUNDAY", "startTime": "10:00:00", "endTime": "17:00:00" } ], "rating": 4, "comments": [ { "time": "2024-06-13 12:31:21", "publisher": "testUser3", "content": "a psuedo comment for testing.", "rating": 4 } ], "services": [ "Guided Tours", "Educational Programs", "Wedding", "Private Conferences", "Shows" ], "wi-fi": true, "parking": true, "id": 2 }, { "_id": { "$oid": "666b1a6877966d35d3e306b9" }, "name": "Edie Park", "address": "1051 Edie Rd, San Francisco, CA 94129", "category": "not categorized", "description": "A park in San Fransisco", "openTime": [ { "day": "MONDAY", "startTime": "09:00:00", "endTime": "18:00:00" }, { "day": "TUESDAY", "startTime": "09:00:00", "endTime": "18:00:00" }, { "day": "WEDNESDAY", "startTime": "00:00:00", "endTime": "00:00:00" }, { "day": "THURSDAY", "startTime": "09:00:00", "endTime": "18:00:00" }, { "day": "FRIDAY", "startTime": "09:00:00", "endTime": "16:00:00" }, { "day": "SATURDAY", "startTime": "09:00:00", "endTime": "16:00:00" }, { "day": "SUNDAY", "startTime": "00:00:00", "endTime": "00:00:00" } ], "rating": 0, "comments": [], "id": 3 }]';

  const [isLoading, setIsLoading] = useState(false); 
  const [pois, setPois] = useState([]); 

  const fetchPOIs = () => {
    setIsLoading(true);
    setTimeout(() => {
      const fakePOI = JSON.parse(fakePOIJson); 
      setPois(fakePOI);
      addresses = fakePOI.map(poi => poi.address);
      setIsLoading(false);
    }, 1000);
  };

  const handleButtonClick = () => {
    fetchPOIs();
  };

  const handleFavorite = (likedItems) => {
    // Fake backend
    fetch('/api/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ likedItems }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handlePostComment = (poiId, comment) => {
    // Fake backend
    fetch(`/api/pois/${poiId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(comment),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Comment posted successfully:', data);
     
        setPois(pois.map(poi => poi._id.$oid === poiId ? { ...poi, comments: [...poi.comments, comment] } : poi));
      })
      .catch((error) => {
        console.error('Error posting comment:', error);
      });
  };

  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      <SearchPanel
        isLoading={isLoading}
        listofPOI={pois}
        onSearch={handleButtonClick}
        onFavorite={handleFavorite}
        onPostComment={handlePostComment} // Pass the function to SearchPanel
      />
      <MapContainer addresses={addresses} />
    </div>
  );
};

export default POIMap;
