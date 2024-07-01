import React, { useEffect, useState } from 'react';
import { List, Card, Tag, Button, message, Empty, Modal, Tabs, Rate, Divider, Tooltip } from 'antd';
import axios from 'axios';
import { GoogleMap, Marker } from '@react-google-maps/api';
import useGoogleMaps from './useMap';
import moment from 'moment';
import { DeleteOutlined, EnvironmentOutlined } from '@ant-design/icons';
import './FavoritePOI.css';

const googleMapApiKey = 'AIzaSyCteXk5Mm93MMoKpeBgKMlwr_JnnnsUgcY';

const { TabPane } = Tabs;

const getCategoryColor = (category) => {
  switch (category) {
    case 'history':
      return 'red';
    case 'landscape':
      return 'green';
    case 'recreation':
      return 'orange';
    case 'shopping':
      return 'blue';
    default:
      return 'grey';
  }
};

const CategoryTag = ({ category }) => (
  <Tag color={getCategoryColor(category)}>{category || 'Not Categorized'}</Tag>
);

const MyFavoritePOI = ({ userId }) => {
  const customerId = localStorage.getItem('customer');
  const [favoritePOIs, setFavoritePOIs] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPOI, setSelectedPOI] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });

  const isGoogleMapsLoaded = useGoogleMaps(googleMapApiKey);

  useEffect(() => {
    fetchFavoritePOIs();
  }, [userId]);

  const fetchFavoritePOIs = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/pois/favorite/${customerId}`);
      setFavoritePOIs(response.data);
    } catch (error) {
      message.error('Failed to fetch favorite POIs.');
      console.error(error);
    }
  };

  const viewOnMap = (poi) => {
    if (!isGoogleMapsLoaded) {
      message.error('Google Maps API not loaded.');
      return;
    }
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: poi.address }, (results, status) => {
      if (status === 'OK') {
        const location = results[0].geometry.location;
        setMapCenter({ lat: location.lat(), lng: location.lng() });
        setSelectedPOI(poi);
        setIsModalVisible(true);
      } else {
        message.error('Failed to locate the address on the map.');
      }
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const toggleFavoritePOI = async (poiId) => {
    try {
      await axios.patch(`http://localhost:8080/api/pois/favorite/${customerId}/${poiId}`);
      message.success('Favorite status toggled successfully');
      fetchFavoritePOIs();
    } catch (error) {
      message.error('Failed to toggle favorite status');
      console.error(error);
    }
  };

  const renderItem = (poi) => (
    <List.Item className="poi-item">
      <Card bordered={true} style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <h4>{poi.name}</h4>
            <p>{poi.address}</p>
            {poi.category ? <CategoryTag category={poi.category} /> : <CategoryTag />}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <Tooltip title="View On Map">
              <Button type="default" onClick={() => viewOnMap(poi)} icon={<EnvironmentOutlined />}></Button>
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                className="custom-delete-button"
                onClick={() => toggleFavoritePOI(poi.poiId)}
                icon={<DeleteOutlined />}
                style={{ marginTop: '10px' }}
              />
            </Tooltip>
          </div>
        </div>
      </Card>
    </List.Item>
  );

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
    <div className="favorite-poi-container">
      <div className="favorite-poi-list-container">
        {favoritePOIs.length > 0 ? (
          <List
            className="poi-list"
            dataSource={favoritePOIs}
            renderItem={renderItem}
            itemLayout="vertical"
            bordered
          />
        ) : (
          <Empty description="You don't have any favorite POIs yet!" className="no-poi-message" />
        )}
      </div>

      <Modal
        title="POI Location"
        visible={isModalVisible}
        onCancel={handleModalCancel}
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
                {selectedPOI && (
                  <Marker position={mapCenter} />
                )}
              </GoogleMap>
            )}
          </div>
          <div style={{ width: '35%', paddingLeft: '10px' }}>
            <Tabs defaultActiveKey="1">
              <TabPane tab="Basic Information" key="1" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {selectedPOI && renderBasicInfo(selectedPOI)}
              </TabPane>
              <TabPane tab="Open Time and Category Info" key="2" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {selectedPOI && renderOpenTimeAndCategoryInfo(selectedPOI)}
              </TabPane>
              <TabPane tab="Comments and Ratings" key="3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {selectedPOI && renderComments(selectedPOI)}
              </TabPane>
            </Tabs>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyFavoritePOI;
