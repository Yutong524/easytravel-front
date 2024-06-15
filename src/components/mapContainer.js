import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const libraries = ['places'];

const mapContainerStyle = {
  height: '100vh',
  width: '100vw',
};

const center = {
  lat: -34.397,
  lng: 150.644,
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

const MapContainer = ({ addresses }) => {
  const [markerPositions, setMarkerPositions] = useState([]);
  const mapRef = useRef();

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    geocodeAddresses(addresses);
  }, [addresses]);

  const geocodeAddresses = (addresses) => {
    const geocoder = new window.google.maps.Geocoder();
    const promises = addresses.map(address => 
      new Promise((resolve, reject) => {
        geocoder.geocode({ address }, (results, status) => {
          if (status === 'OK') {
            resolve(results[0].geometry.location);
          } else {
            console.error('Geocode was not successful for the following reason: ' + status);
            resolve(null); // Resolve with null to maintain positions array length
          }
        });
      })
    );

    Promise.all(promises).then(locations => {
      const validLocations = locations.filter(location => location !== null);
      setMarkerPositions(validLocations);
      if (validLocations.length > 0) {
        mapRef.current.panTo(validLocations[0]);
        mapRef.current.setZoom(8);
      }
    });
  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} libraries={libraries}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={center}
        options={options}
        onLoad={onMapLoad}
      >
        {markerPositions.map((position, index) => (
          <Marker key={index} position={position} />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};


export default MapContainer;
