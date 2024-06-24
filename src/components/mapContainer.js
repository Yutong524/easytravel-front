import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';


const libraries = ['places'];

const mapContainerStyle = {
  height: '100vh',
  width: '100vw',
};


const defaultCenter = {
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
    if (addresses.length > 0) {
      geocodeAddresses(addresses); 
    } else {
      mapRef.current.panTo(defaultCenter); 
      mapRef.current.setZoom(2); 
    }
  }, [addresses]);


  const geocodeAddresses = useCallback((addresses) => {
    const geocoder = new window.google.maps.Geocoder(); 
    const promises = addresses.map(address =>
      new Promise((resolve, reject) => {
        geocoder.geocode({ address }, (results, status) => {
          if (status === 'OK') {
            resolve(results[0].geometry.location);
          } else {
            console.error('Geocode was not successful for the following reason: ' + status);
            resolve(null); 
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
      } else {
        mapRef.current.panTo(defaultCenter); 
        mapRef.current.setZoom(2); 
      }
    });
  }, []);


  useEffect(() => {
    if (addresses.length > 0) {
      geocodeAddresses(addresses); 
    } else {
      setMarkerPositions([]);
    }
  }, [addresses, geocodeAddresses]);

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} libraries={libraries}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle} 
        zoom={8} 
        center={defaultCenter}
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
