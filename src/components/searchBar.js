import React, { useState } from 'react';
import { Input, Button, Card, List } from 'antd';

const searchResults = [
  {
    title: 'Shopping Mall',
    address: '530 Lawerence St.',
    rating: 3.5
  },
  {
    title: 'Lancer Shopping Center',
    address: '75 Brooklance Dr.',
    rating: 4.0
  },
  {
    title: 'ShopVale',
    address: '1002 William St.',
    rating: 2.6
  }
];

const SearchPanel = () => {
  const [searchText, setSearchText] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleButtonClick = () => {
    setShowResults(true);
  };

  const handleChange = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <div style={{ position: 'absolute', top: '100px', right: '40px', width: '300px', zIndex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <Button type="primary" style={{ marginRight: '10px' }} >Advance</Button>
        <Input
          placeholder="shop"
          value={searchText}
          onChange={handleChange}
          style={{ width: 200 }}
        />
        <Button type="primary" style={{ marginLeft: '10px' }} onClick={handleButtonClick}>GO</Button>
      </div>
      {showResults && (
        <div style={{ backgroundColor: 'white', borderRadius: '5px', padding: '10px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
          <List
            itemLayout="vertical"
            dataSource={searchResults}
            renderItem={item => (
              <List.Item>
                <Card title={item.title}>
                  <p>{item.address}</p>
                  <p>Rating: {item.rating}</p>
                </Card>
              </List.Item>
            )}
          />
        </div>
      )}
    </div>
  );
};

export default SearchPanel;
