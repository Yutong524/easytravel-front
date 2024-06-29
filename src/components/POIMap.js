import React, { useState } from 'react';
import MapContainer from './mapContainer';
import SearchPanel from './searchBar';
import moment from 'moment';

let addresses = [];

const POIMap = () => {
  const fakePOIJson = `[
    { 
      "_id": { "$oid": "666b143477966d35d3e306aa" },
      "name": "Joe's Pizza",
      "address": "123 Main St, San Francisco, CA",
      "category": "Food",
      "description": "Famous for its delicious New York-style pizza.",
      "openTime": [
        { "day": "MONDAY", "startTime": "11:00:00", "endTime": "22:00:00" },
        { "day": "TUESDAY", "startTime": "11:00:00", "endTime": "22:00:00" },
        { "day": "WEDNESDAY", "startTime": "11:00:00", "endTime": "22:00:00" },
        { "day": "THURSDAY", "startTime": "11:00:00", "endTime": "22:00:00" },
        { "day": "FRIDAY", "startTime": "11:00:00", "endTime": "23:00:00" },
        { "day": "SATURDAY", "startTime": "11:00:00", "endTime": "23:00:00" },
        { "day": "SUNDAY", "startTime": "11:00:00", "endTime": "21:00:00" }
      ],
      "rating": 2,
      "comments": [
        { "time": "2024-06-13 12:31:21", "publisher": "testUser1", "content": "Great pizza!", "rating": 5 },
        { "time": "2024-06-13 14:12:21", "publisher": "testUser2", "content": "Best in town.", "rating": 4 }
      ],
      "services": ["Delivery", "Takeout"],
      "wi-fi": true,
      "parking": false,
      "id": 1
    },
    { 
      "_id": { "$oid": "666b143477966d35d3e306ab" },
      "name": "Tech Mall",
      "address": "456 Market St, San Francisco, CA",
      "category": "Shopping",
      "description": "A popular mall for all tech gadgets.",
      "openTime": [
        { "day": "MONDAY", "startTime": "10:00:00", "endTime": "21:00:00" },
        { "day": "TUESDAY", "startTime": "10:00:00", "endTime": "21:00:00" },
        { "day": "WEDNESDAY", "startTime": "10:00:00", "endTime": "21:00:00" },
        { "day": "THURSDAY", "startTime": "10:00:00", "endTime": "21:00:00" },
        { "day": "FRIDAY", "startTime": "10:00:00", "endTime": "22:00:00" },
        { "day": "SATURDAY", "startTime": "10:00:00", "endTime": "22:00:00" },
        { "day": "SUNDAY", "startTime": "11:00:00", "endTime": "20:00:00" }
      ],
      "rating": 4,
      "comments": [
        { "time": "2024-06-13 15:31:21", "publisher": "testUser3", "content": "Good variety of tech products.", "rating": 4 }
      ],
      "services": ["Free Wi-Fi", "Parking"],
      "wi-fi": true,
      "parking": true,
      "id": 2
    },
    { 
      "_id": { "$oid": "666b143477966d35d3e306ac" },
      "name": "Golden Gate Theater",
      "address": "789 Broadway St, San Francisco, CA",
      "category": "Entertainment",
      "description": "Historic theater with live performances and shows.",
      "openTime": [
        { "day": "MONDAY", "startTime": "12:00:00", "endTime": "23:00:00" },
        { "day": "TUESDAY", "startTime": "12:00:00", "endTime": "23:00:00" },
        { "day": "WEDNESDAY", "startTime": "12:00:00", "endTime": "23:00:00" },
        { "day": "THURSDAY", "startTime": "12:00:00", "endTime": "23:00:00" },
        { "day": "FRIDAY", "startTime": "12:00:00", "endTime": "23:00:00" },
        { "day": "SATURDAY", "startTime": "12:00:00", "endTime": "23:00:00" },
        { "day": "SUNDAY", "startTime": "12:00:00", "endTime": "23:00:00" }
      ],
      "rating": 2,
      "comments": [
        { "time": "2024-06-13 16:31:21", "publisher": "testUser4", "content": "Amazing performances!", "rating": 5 },
        { "time": "2024-06-13 17:12:21", "publisher": "testUser5", "content": "Loved the show.", "rating": 4 }
      ],
      "services": ["Live Shows", "Concessions"],
      "wi-fi": false,
      "parking": true,
      "id": 3
    },
    { 
      "_id": { "$oid": "666b143477966d35d3e306ad" },
      "name": "Burger King",
      "address": "321 King St, San Francisco, CA",
      "category": "Food",
      "description": "Fast food chain known for its burgers.",
      "openTime": [
        { "day": "MONDAY", "startTime": "07:00:00", "endTime": "23:00:00" },
        { "day": "TUESDAY", "startTime": "07:00:00", "endTime": "23:00:00" },
        { "day": "WEDNESDAY", "startTime": "07:00:00", "endTime": "23:00:00" },
        { "day": "THURSDAY", "startTime": "07:00:00", "endTime": "23:00:00" },
        { "day": "FRIDAY", "startTime": "07:00:00", "endTime": "23:00:00" },
        { "day": "SATURDAY", "startTime": "07:00:00", "endTime": "23:00:00" },
        { "day": "SUNDAY", "startTime": "07:00:00", "endTime": "23:00:00" }
      ],
      "rating": 3,
      "comments": [
        { "time": "2024-06-13 18:31:21", "publisher": "testUser6", "content": "Quick service.", "rating": 4 }
      ],
      "services": ["Drive-Thru", "Takeout"],
      "wi-fi": false,
      "parking": true,
      "id": 4
    },
    { 
      "_id": { "$oid": "666b143477966d35d3e306ae" },
      "name": "Fashion Plaza",
      "address": "654 Fashion Ave, San Francisco, CA",
      "category": "Shopping",
      "description": "A large plaza with various fashion brands.",
      "openTime": [
        { "day": "MONDAY", "startTime": "10:00:00", "endTime": "21:00:00" },
        { "day": "TUESDAY", "startTime": "10:00:00", "endTime": "21:00:00" },
        { "day": "WEDNESDAY", "startTime": "10:00:00", "endTime": "21:00:00" },
        { "day": "THURSDAY", "startTime": "10:00:00", "endTime": "21:00:00" },
        { "day": "FRIDAY", "startTime": "10:00:00", "endTime": "22:00:00" },
        { "day": "SATURDAY", "startTime": "10:00:00", "endTime": "22:00:00" },
        { "day": "SUNDAY", "startTime": "11:00:00", "endTime": "20:00:00" }
      ],
      "rating": 5,
      "comments": [
        { "time": "2024-06-13 19:31:21", "publisher": "testUser7", "content": "Great shopping experience.", "rating": 5 }
      ],
      "services": ["Free Wi-Fi", "Parking"],
      "wi-fi": true,
      "parking": true,
      "id": 5
    },
    { 
      "_id": { "$oid": "666b143477966d35d3e306af" },
      "name": "City Park",
      "address": "987 Park Lane, San Francisco, CA",
      "category": "Entertainment",
      "description": "A beautiful park with lots of outdoor activities.",
      "openTime": [
        { "day": "MONDAY", "startTime": "06:00:00", "endTime": "20:00:00" },
        { "day": "TUESDAY", "startTime": "06:00:00", "endTime": "20:00:00" },
        { "day": "WEDNESDAY", "startTime": "06:00:00", "endTime": "20:00:00" },
        { "day": "THURSDAY", "startTime": "06:00:00", "endTime": "20:00:00" },
        { "day": "FRIDAY", "startTime": "06:00:00", "endTime": "20:00:00" },
        { "day": "SATURDAY", "startTime": "06:00:00", "endTime": "20:00:00" },
        { "day": "SUNDAY", "startTime": "06:00:00", "endTime": "20:00:00" }
      ],
      "rating": 1,
      "comments": [
        { "time": "2024-06-13 20:31:21", "publisher": "testUser8", "content": "Wonderful place to relax.", "rating": 5 },
        { "time": "2024-06-13 21:12:21", "publisher": "testUser9", "content": "Loved the greenery.", "rating": 4 }
      ],
      "services": ["Picnic Areas", "Playground"],
      "wi-fi": false,
      "parking": true,
      "id": 6
    },
    { 
      "_id": { "$oid": "666b143477966d35d3e306b0" },
      "name": "Joey's Pizza",
      "address": "124 Main St, San Francisco, CA",
      "category": "Food",
      "description": "Known for its cheesy pizzas and great service.",
      "openTime": [
        { "day": "MONDAY", "startTime": "10:00:00", "endTime": "21:00:00" },
        { "day": "TUESDAY", "startTime": "10:00:00", "endTime": "21:00:00" },
        { "day": "WEDNESDAY", "startTime": "10:00:00", "endTime": "21:00:00" },
        { "day": "THURSDAY", "startTime": "10:00:00", "endTime": "21:00:00" },
        { "day": "FRIDAY", "startTime": "10:00:00", "endTime": "22:00:00" },
        { "day": "SATURDAY", "startTime": "10:00:00", "endTime": "22:00:00" },
        { "day": "SUNDAY", "startTime": "11:00:00", "endTime": "20:00:00" }
      ],
      "rating": 4,
      "comments": [
        { "time": "2024-06-13 11:31:21", "publisher": "testUser10", "content": "Amazing pizza!", "rating": 5 },
        { "time": "2024-06-13 13:12:21", "publisher": "testUser11", "content": "Best pizza in town.", "rating": 5 }
      ],
      "services": ["Delivery", "Takeout"],
      "wi-fi": true,
      "parking": false,
      "id": 7
    },
    { 
      "_id": { "$oid": "666b143477966d35d3e306b1" },
      "name": "Joe's Burger",
      "address": "125 Main St, San Francisco, CA",
      "category": "Food",
      "description": "Best burgers in the city.",
      "openTime": [
        { "day": "MONDAY", "startTime": "11:00:00", "endTime": "22:00:00" },
        { "day": "TUESDAY", "startTime": "11:00:00", "endTime": "22:00:00" },
        { "day": "WEDNESDAY", "startTime": "11:00:00", "endTime": "22:00:00" },
        { "day": "THURSDAY", "startTime": "11:00:00", "endTime": "22:00:00" },
        { "day": "FRIDAY", "startTime": "11:00:00", "endTime": "23:00:00" },
        { "day": "SATURDAY", "startTime": "11:00:00", "endTime": "23:00:00" },
        { "day": "SUNDAY", "startTime": "11:00:00", "endTime": "21:00:00" }
      ],
      "rating": 4,
      "comments": [
        { "time": "2024-06-13 12:31:21", "publisher": "testUser12", "content": "Delicious burgers!", "rating": 5 },
        { "time": "2024-06-13 14:12:21", "publisher": "testUser13", "content": "Amazing taste.", "rating": 4 }
      ],
      "services": ["Delivery", "Takeout"],
      "wi-fi": true,
      "parking": false,
      "id": 8
    },
    { 
      "_id": { "$oid": "666b143477966d35d3e306b2" },
      "name": "Joanne's Cafe",
      "address": "126 Main St, San Francisco, CA",
      "category": "Food",
      "description": "A cozy place for coffee and snacks.",
      "openTime": [
        { "day": "MONDAY", "startTime": "08:00:00", "endTime": "18:00:00" },
        { "day": "TUESDAY", "startTime": "08:00:00", "endTime": "18:00:00" },
        { "day": "WEDNESDAY", "startTime": "08:00:00", "endTime": "18:00:00" },
        { "day": "THURSDAY", "startTime": "08:00:00", "endTime": "18:00:00" },
        { "day": "FRIDAY", "startTime": "08:00:00", "endTime": "18:00:00" },
        { "day": "SATURDAY", "startTime": "09:00:00", "endTime": "17:00:00" },
        { "day": "SUNDAY", "startTime": "09:00:00", "endTime": "17:00:00" }
      ],
      "rating": 3,
      "comments": [
        { "time": "2024-06-13 10:31:21", "publisher": "testUser14", "content": "Lovely atmosphere.", "rating": 4 },
        { "time": "2024-06-13 11:12:21", "publisher": "testUser15", "content": "Great coffee.", "rating": 3 }
      ],
      "services": ["Wi-Fi", "Takeout"],
      "wi-fi": true,
      "parking": true,
      "id": 9
    },
    { 
      "_id": { "$oid": "666b143477966d35d3e306b3" },
      "name": "Joe's Deli",
      "address": "127 Main St, San Francisco, CA",
      "category": "Food",
      "description": "Tasty sandwiches and salads.",
      "openTime": [
        { "day": "MONDAY", "startTime": "09:00:00", "endTime": "19:00:00" },
        { "day": "TUESDAY", "startTime": "09:00:00", "endTime": "19:00:00" },
        { "day": "WEDNESDAY", "startTime": "09:00:00", "endTime": "19:00:00" },
        { "day": "THURSDAY", "startTime": "09:00:00", "endTime": "19:00:00" },
        { "day": "FRIDAY", "startTime": "09:00:00", "endTime": "20:00:00" },
        { "day": "SATURDAY", "startTime": "09:00:00", "endTime": "20:00:00" },
        { "day": "SUNDAY", "startTime": "10:00:00", "endTime": "18:00:00" }
      ],
      "rating": 5,
      "comments": [
        { "time": "2024-06-13 09:31:21", "publisher": "testUser16", "content": "Best deli in town!", "rating": 5 },
        { "time": "2024-06-13 10:12:21", "publisher": "testUser17", "content": "Fresh and delicious.", "rating": 5 }
      ],
      "services": ["Takeout", "Delivery"],
      "wi-fi": true,
      "parking": false,
      "id": 10
    },
    { 
      "_id": { "$oid": "666b143477966d35d3e306b4" },
      "name": "Jolie's Bistro",
      "address": "128 Main St, San Francisco, CA",
      "category": "Food",
      "description": "French cuisine with a modern twist.",
      "openTime": [
        { "day": "MONDAY", "startTime": "11:00:00", "endTime": "21:00:00" },
        { "day": "TUESDAY", "startTime": "11:00:00", "endTime": "21:00:00" },
        { "day": "WEDNESDAY", "startTime": "11:00:00", "endTime": "21:00:00" },
        { "day": "THURSDAY", "startTime": "11:00:00", "endTime": "21:00:00" },
        { "day": "FRIDAY", "startTime": "11:00:00", "endTime": "22:00:00" },
        { "day": "SATURDAY", "startTime": "11:00:00", "endTime": "22:00:00" },
        { "day": "SUNDAY", "startTime": "12:00:00", "endTime": "20:00:00" }
      ],
      "rating": 4,
      "comments": [
        { "time": "2024-06-13 09:31:21", "publisher": "testUser18", "content": "Delightful experience.", "rating": 4 },
        { "time": "2024-06-13 10:12:21", "publisher": "testUser19", "content": "Exquisite dishes.", "rating": 5 }
      ],
      "services": ["Dine-In", "Takeout"],
      "wi-fi": true,
      "parking": true,
      "id": 11
    }
  ]`;

  const [isLoading, setIsLoading] = useState(false); 
  const [pois, setPois] = useState([]); 

  const fetchPOIs = (filters, searchQuery) => {
    setIsLoading(true);
    setTimeout(() => {
      const fakePOI = JSON.parse(fakePOIJson);
  
      let filteredPOI = fakePOI;
     
  
      if (searchQuery) {//default sort with query
        const lowercasedQuery = searchQuery.toLowerCase();
        
       
        filteredPOI = filteredPOI.map(poi => {
          const nameMatches = (poi.name.toLowerCase().match(new RegExp(lowercasedQuery, 'g')) || []).length;
          const descriptionMatches = (poi.description.toLowerCase().match(new RegExp(lowercasedQuery, 'g')) || []).length;
          const addressMatches = (poi.address.toLowerCase().match(new RegExp(lowercasedQuery, 'g')) || []).length;
          const relevanceScore = nameMatches * 3 + descriptionMatches * 2 + addressMatches;
          
          return {
            ...poi,
            relevanceScore,
          };
        }).filter(poi => poi.relevanceScore > 0);
  
        
        filteredPOI = filteredPOI.sort((a, b) => b.relevanceScore - a.relevanceScore);
      }
  
      if (filters.ratingFrom !== null) {
        filteredPOI = filteredPOI.filter(poi => poi.rating >= filters.ratingFrom);
      }
  
      if (filters.ratingTo !== null) {
        filteredPOI = filteredPOI.filter(poi => poi.rating <= filters.ratingTo);
      }
  
      if (filters.category) {
        filteredPOI = filteredPOI.filter(poi => poi.category === filters.category);
      }
  
      if (filters.openDay) {
        filteredPOI = filteredPOI.filter(poi =>
          poi.openTime.some(time => time.day.toLowerCase() === filters.openDay.toLowerCase() && (
            (!filters.openTimeFrom || moment(time.startTime, 'HH:mm:ss').isSameOrAfter(moment(filters.openTimeFrom, 'HH:mm'))) &&
            (!filters.openTimeTo || moment(time.endTime, 'HH:mm:ss').isSameOrBefore(moment(filters.openTimeTo, 'HH:mm')))
          ))
        );
      }
  
      if (filters.sortBy) {
        filteredPOI = filteredPOI.sort((a, b) => {
          if (filters.sortBy === 'rating') {
            return b.rating - a.rating;
          }
          if (filters.sortBy === 'name') {
            return a.name.localeCompare(b.name);
          }
          return 0;
        });
      }
  
      setPois(filteredPOI);
      addresses = filteredPOI.map(poi => poi.address);
      setIsLoading(false);
    }, 1000);
  };
  

  const handleSearch = (searchQuery, filters) => {
    fetchPOIs(searchQuery, filters);
  };

  const handleFavorite = (likedItems) => {
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
        onSearch={handleSearch}
        onFavorite={handleFavorite}
        onPostComment={handlePostComment}
      />
      <MapContainer addresses={addresses} />
    </div>
  );
};

export default POIMap;
