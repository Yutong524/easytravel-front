import React from 'react';
import { Card, List } from 'antd';

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

const SearchResults = () => {
  return (
    <div style={{  }}>
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
  );
};

export default SearchResults;
