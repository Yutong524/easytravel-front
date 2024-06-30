import React, { useEffect, useState } from 'react';
import { Modal, List, message } from 'antd';
import axios from 'axios';
import { GoogleMap, Marker, Polyline } from '@react-google-maps/api';
import moment from 'moment';
import useGoogleMaps from './useMap';
import ViewOnMapPOI from './ViewOnMapPOI';
import { getCategoryColor, CategoryTag } from './utils';

const googleMapApiKey = 'AIzaSyCteXk5Mm93MMoKpeBgKMlwr_JnnnsUgcY';

const ViewOnMapRoute = ({ route, isVisible, onCancel }) => {
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
  const [routePOIs, setRoutePOIs] = useState([]);
  const [selectedPOI, setSelectedPOI] = useState(null);
  const [isViewPOIModalVisible, setIsViewPOIModalVisible] = useState(false);
  const isGoogleMapsLoaded = useGoogleMaps(googleMapApiKey);

  useEffect(() => {
    if (route && isVisible) {
      const geocoder = new window.google.maps.Geocoder();
      const poiPromises = route.poiArrangement.map(poi => {
        return new Promise((resolve, reject) => {
          axios.get(`http://localhost:8080/api/pois/${poi.poiId}`)
            .then(response => {
              const poi = response.data;
              geocoder.geocode({ address: poi.address }, (results, status) => {
                if (status === 'OK') {
                  resolve({ ...poi, location: results[0].geometry.location });
                } else {
                  reject(`Failed to geocode address ${poi.address}`);
                }
              });
            })
            .catch(error => {
              reject(`Failed to fetch POI with ID ${poi}: ${error}`);
            });
        });
      });

      Promise.all(poiPromises).then(poisWithLocations => {
        setRoutePOIs(poisWithLocations);
        setMapCenter(poisWithLocations[0].location);
      }).catch(error => {
        message.error(error);
      });
    }
  }, [route, isVisible]);

  const path = routePOIs.map(poi => poi.location);

  const viewPOIOnMap = (poi) => {
    setSelectedPOI(poi);
    setIsViewPOIModalVisible(true);
  };

  const handleViewPOIModalCancel = () => {
    setIsViewPOIModalVisible(false);
  };

  return (
    <>
      <Modal
        title="View Route on Map"
        visible={isVisible}
        onCancel={onCancel}
        footer={null}
        width="80%"
      >
        {isGoogleMapsLoaded && (
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '400px' }}
            center={mapCenter}
            zoom={10}
          >
            {routePOIs.map((poi, index) => (
              <Marker
                key={index}
                position={poi.location}
                label={`${index + 1}`}
                onClick={() => viewPOIOnMap(poi)}
              />
            ))}
            {path.length > 0 && (
              <Polyline
                path={path}
                options={{ strokeColor: '#FF0000', strokeOpacity: 1.0, strokeWeight: 2 }}
              />
            )}
          </GoogleMap>
        )}
        <div style={{ overflowY: 'auto', maxHeight: '400px', marginTop: '20px' }}>
          <List
            dataSource={routePOIs}
            renderItem={(poi, index) => (
              <List.Item key={index}>
                <List.Item.Meta
                  title={
                    <>
                      <span
                        style={{ fontWeight: 'bold', color: 'black', cursor: 'pointer' }}
                        onClick={() => viewPOIOnMap(poi)}
                      >
                        {`${index + 1}. ${poi.name}`}
                      </span>
                      <span style={{ color: 'grey', marginLeft: '10px' }}>
                        {`(From: ${moment(poi.startTime).format('YYYY-MM-DD HH:mm:ss')} To: ${moment(poi.endTime).format('YYYY-MM-DD HH:mm:ss')})`}
                      </span>
                    </>
                  }
                  description={<span style={{ color: 'grey' }}>{poi.address}</span>}
                />
              </List.Item>
            )}
          />
        </div>
      </Modal>

      <ViewOnMapPOI
        poi={selectedPOI}
        isVisible={isViewPOIModalVisible}
        onCancel={handleViewPOIModalCancel}
      />
    </>
  );
};

export default ViewOnMapRoute;
