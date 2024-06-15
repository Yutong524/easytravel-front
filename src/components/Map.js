
import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';


const containerStyle = {
  width: '400px',
  height: '400px'
};

const center = {
  lat: -3.745,
  lng: -38.523
};

const position = {
  lat: -3.745,
  lng: -38.523
};

function Map() {
  let num=0
  const [isLoaded,setIsLoaded]=useState(false)
  const click=(e)=>{
console.log(e)
  }
  const onMapLoad = (map) => {
    // 在这里可以访问到Map对象
    console.log(map)
    console.log(map.position.lat());
    //setIsLoaded(true)
    num=num+1
    console.log(num)
  };
  return (<div>
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        //onLoad={onMapLoad}
        
      >
        {<Marker
       onLoad={onMapLoad}
          position={position}
          visible={true}
          title="Hello!"
          onClick={click}
        />}
        
      </GoogleMap>
    </LoadScript>
    {isLoaded&&<div>loaded</div>}
    </div>
  );
}

export default Map;
