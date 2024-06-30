import React, { useState, useEffect } from 'react';
import { Modal, Tabs, Rate, Divider, Card, message } from 'antd';
import { GoogleMap, Marker } from '@react-google-maps/api';
import moment from 'moment';
import useGoogleMaps from './useMap';
import { getCategoryColor, CategoryTag } from './utils';

const { TabPane } = Tabs;
const googleMapApiKey = 'AIzaSyCteXk5Mm93MMoKpeBgKMlwr_JnnnsUgcY';

const ViewOnMapPOI = ({ poi, isVisible, onCancel }) => {
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
  const isGoogleMapsLoaded = useGoogleMaps(googleMapApiKey);

  useEffect(() => {
    if (poi && isVisible) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: poi.address }, (results, status) => {
        if (status === 'OK') {
          const location = results[0].geometry.location;
          setMapCenter({ lat: location.lat(), lng: location.lng() });
        } else {
          message.error('Failed to locate the address on the map.');
        }
      });
    }
  }, [poi, isVisible]);

  const renderBasicInfo = (poi) => (
    <div>
      <h3>{poi.name}</h3>
      <p><strong>Address:</strong> {poi.address}</p>
      <p><strong>Description:</strong> {poi.description}</p>
      <p><CategoryTag category={poi.category} /></p>
    </div>
  );

  const renderOpenTimeAndCategoryInfo = (poi) => (
    <div>
      <h3>Open Time</h3>
      <Divider />
      <p><strong>Monday:</strong> {poi.openTime[0].startTime} - {poi.openTime[0].endTime}</p>
      <p><strong>Tuesday:</strong> {poi.openTime[1].startTime} - {poi.openTime[1].endTime}</p>
      <p><strong>Wednesday:</strong> {poi.openTime[2].startTime} - {poi.openTime[2].endTime}</p>
      <p><strong>Thursday:</strong> {poi.openTime[3].startTime} - {poi.openTime[3].endTime}</p>
      <p><strong>Friday:</strong> {poi.openTime[4].startTime} - {poi.openTime[4].endTime}</p>
      <p><strong>Saturday:</strong> {poi.openTime[5].startTime} - {poi.openTime[5].endTime}</p>
      <p><strong>Sunday:</strong> {poi.openTime[6].startTime} - {poi.openTime[6].endTime}</p>
      <Divider />
      {poi.category === 'history' && (
        <>
          <p><strong>Architecture Style:</strong> {poi.architectureStyle}</p>
          <Divider />
          <p><strong>Established Year:</strong> {poi.establishedYear}</p>
          <Divider />
          <p><strong>Access:</strong> {poi.access}</p>
        </>
      )}
      {poi.category === 'recreation' && (
        <>
          <p><strong>Services:</strong> {poi.services}</p>
          <Divider />
          <p><strong>Wi-Fi:</strong> {poi.wifi}</p>
          <Divider />
          <p><strong>Parking:</strong> {poi.parking}</p>
        </>
      )}
      {poi.category === 'landscape' && (
        <>
          <p><strong>Features:</strong> {poi.features}</p>
          <Divider />
          <p><strong>Conservation:</strong> {poi.conservation}</p>
          <Divider />
          <p><strong>Fee:</strong> {poi.fee}</p>
        </>
      )}
      {poi.category === 'shopping' && (
        <>
          <p><strong>Services:</strong> {poi.services}</p>
          <Divider />
          <p><strong>Parking:</strong> {poi.parking}</p>
          <Divider />
          <p><strong>Fee:</strong> {poi.fee}</p>
        </>
      )}
    </div>
  );

  const renderComments = (poi) => (
    <div>
      <h3>Comments and Ratings</h3>
      <div style={{ marginBottom: '20px' }}>
        <Rate disabled value={poi.rating} />
        <span style={{ marginLeft: '10px' }}>{poi.rating.toFixed(1)}</span>
      </div>
      {poi.comments && poi.comments.length > 0 ? (
        poi.comments.map((comment, index) => (
          <Card key={index} style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <h4>{comment.publisher}</h4>
              <span>{moment(comment.time).format('YYYY-MM-DD HH:mm:ss')}</span>
            </div>
            <Rate disabled value={comment.rating} />
            <span style={{ marginLeft: '10px' }}>{comment.rating.toFixed(1)}</span>
            <p style={{ marginTop: '10px' }}>{comment.content}</p>
          </Card>
        ))
      ) : (
        <p>No comments available.</p>
      )}
    </div>
  );

  return (
    <Modal
      title="POI Location"
      visible={isVisible}
      onCancel={onCancel}
      footer={null}
      width={1000}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '60%' }}>
          {isGoogleMapsLoaded && (
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '400px' }}
              center={mapCenter}
              zoom={15}
            >
              {poi && (
                <Marker position={mapCenter} />
              )}
            </GoogleMap>
          )}
        </div>
        <div style={{ width: '35%', paddingLeft: '10px' }}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="Basic Information" key="1" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {poi && renderBasicInfo(poi)}
            </TabPane>
            <TabPane tab="Open Time and Category Info" key="2" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {poi && renderOpenTimeAndCategoryInfo(poi)}
            </TabPane>
            <TabPane tab="Comments and Ratings" key="3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {poi && renderComments(poi)}
            </TabPane>
          </Tabs>
        </div>
      </div>
    </Modal>
  );
};

export default ViewOnMapPOI;
