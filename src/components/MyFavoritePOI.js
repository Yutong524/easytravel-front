import React, { useEffect, useState } from 'react';
import { List, Card, Tag, Button, message, Empty } from 'antd';
import axios from 'axios';
import './FavoritePOI.css';

function MyFavoritePOI({ userId }) {
  const customerId = localStorage.getItem("customer");
  const [favoritePOIs, setFavoritePOIs] = useState([]);

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

  const fetchFavoritePOIs = () => {
    axios.get(`http://localhost:8080/api/pois/favorite/${customerId}`)
      .then(response => {
        setFavoritePOIs(response.data);
      })
      .catch(error => {
        message.error('Failed to fetch favorite POIs.');
        console.error(error);
      });
  };

  useEffect(() => {
    fetchFavoritePOIs();
  }, [userId]);

  const renderItem = (poi) => {
    return (
      <List.Item className="poi-item">
        <Card bordered={true} style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <h4>{poi.name}</h4>
              <p>{poi.address}</p>
              {poi.category ? <CategoryTag category={poi.category} /> : <CategoryTag />}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <Button type="default" onClick={() => viewOnMap(poi.address)}>View On Map</Button>
            </div>
          </div>
        </Card>
      </List.Item>
    );
  };

  const viewOnMap = (location) => {
    // empty
  };

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
    </div>
  );
}

export default MyFavoritePOI;