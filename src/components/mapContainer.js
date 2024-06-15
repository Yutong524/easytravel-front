import React from 'react';
import { GoogleMap, LoadScript, Polygon } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100vh'
};

const center = {
  lat: 40.748817,
  lng: -73.985428
};

const polygonCoords = [
  { lat: 40.748817, lng: -73.985428 },
  { lat: 40.748217, lng: -73.985428 },
  { lat: 40.748217, lng: -73.984428 },
  { lat: 40.748817, lng: -73.984428 }
];

const MapContainer = () => {
  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
      >
        <Polygon
          paths={polygonCoords}
          options={{
            fillColor: "green",
            fillOpacity: 0.5,
            strokeColor: "yellow",
            strokeOpacity: 1,
            strokeWeight: 2
          }}
        />
      </GoogleMap>
    </LoadScript>
  );
};

export default MapContainer;
