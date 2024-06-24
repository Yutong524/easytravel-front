import React, { useState } from 'react';
import { List, Card, Rate, Button, Row, Col, Input, Skeleton } from 'antd';
import { HeartOutlined, HeartFilled, ShoppingOutlined } from '@ant-design/icons';


const tagStyle = {
  display: 'flex',            
  justifyContent: 'center',   
  alignItems: 'center',       
  width: '100px',            
  height: '20px',             
  border: '1px solid black', 
  borderRadius: '10px',        
  backgroundColor: 'lightblue',
  textAlign: 'center',         
};


const SearchPanel = ({ isLoading, listofPOI, onSearch ,onFavorite}) => {

  const [searchText, setSearchText] = useState(''); 
  const [showResults, setShowResults] = useState(false); 
  const [likedItems, setLikedItems] = useState([]); 


  const handleButtonClick = () => {
    setShowResults(true); 
    onSearch(); 
  };


  const handleChange = (e) => {
    setSearchText(e.target.value);
  };

 
  const toggleLike = (name) => {
    const updatedLikedItems = likedItems.includes(name)
      ? likedItems.filter(item => item !== name)
      : [...likedItems, name];

    setLikedItems(updatedLikedItems);
    onFavorite(updatedLikedItems); 
  };

  return (
    <div style={{ position: 'absolute', top: '100px', right: '40px', width: '300px', zIndex: 1, border: '1px solid #ccc', backgroundColor: '#fff', borderRadius: '5px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
    
      <div style={{ display: 'flex', alignItems: 'center', padding: '10px', borderBottom: '1px solid #f0f0f0' }}>
        <Button type="primary" style={{ marginRight: '10px' }}>Advance</Button>
        <Input
          placeholder="search"
          value={searchText}
          onChange={handleChange}
          style={{ width: 200 }}
        />
        <Button type="primary" style={{ marginLeft: '10px' }} onClick={handleButtonClick}>GO</Button>
      </div>
    
      {showResults && (
        <div style={{ padding: '5px' }}>
          {isLoading ? (
           
            <Skeleton active />
          ) : (
            
            <List
              style={{ maxHeight: '700px', maxWidth: '300px', overflowY: 'auto', overflowX: 'hidden' }}
              grid={{ gutter: 16, column: 1 }}
              dataSource={listofPOI}
              renderItem={item => (
                <List.Item>
                  <Card>
                
                    <Row justify="space-between" align="middle">
                      <h3>{item.name}</h3>
                    </Row>
                
                    <Row justify="space-between" align="middle">
                      <span>{item.address}</span>
                    </Row>
                
                    <Row justify="space-between" align="middle">
                      <Rate disabled defaultValue={item.rating} />
                    </Row>
                 
                    <Row justify="space-between" align="middle" style={{ marginTop: '10px' }}>
                      <Col>
                        <span style={tagStyle}>{item.category}</span>
                      </Col>
                      <Col>
                        <Button
                          icon={likedItems.includes(item.name) ? <HeartFilled style={{ color: 'red' }} /> : <HeartOutlined style={{ color: 'red' }} />}
                          size="middle"
                          style={{ marginLeft: '10px' }}
                          onClick={() => toggleLike(item.name)}
                        />
                      </Col>
                      <Col>
                        <Button type="link">detail {'>'}</Button>
                      </Col>
                    </Row>
                  </Card>
                </List.Item>
              )}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPanel;
