import React, { useState } from 'react';
import { List, Card, Rate, Button, Row, Col,Input } from 'antd';
import { HeartOutlined, HeartFilled, ShoppingOutlined } from '@ant-design/icons';
const tagStyle = {
  display: 'flex',             // 使用 Flexbox 布局
    justifyContent: 'center',    // 水平居中
    alignItems: 'center',        // 垂直居中
    width: '80px',              // 设置宽度
    height: '20px',              // 设置高度
    border: '1px solid black',   // 添加边框
    borderRadius: '10px',        // 添加圆角
    backgroundColor: 'lightblue',// 设置背景颜色
    textAlign: 'center',         // 文字水平居中
};
const searchResults = [
  {
    name: 'Shopping Mall',
    address: '530 Lawerence St.',
    rating: 3.5
  },
  {
    name: 'Lancer Shopping Center',
    address: '75 Brooklance Dr.',
    rating: 4.0
  },
  {
    name: 'ShopVale',
    address: '1002 William St.',
    rating: 2.6
  }
];

const SearchPanel = (isLoading,listofPOI,onSearch) => {
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
    setLikedItems(prev => 
      prev.includes(name) ? prev.filter(item => item !== name) : [...prev, name]
    );
  };
  return (
    <div style={{ position: 'absolute', top: '100px', right: '40px', width: '300px', zIndex: 1, border: '1px solid #ccc', backgroundColor: '#fff', borderRadius: '5px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '10px', borderBottom: '1px solid #f0f0f0' }}>
        <Button type="primary" style={{ marginRight: '10px' }} >Advance</Button>
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
       <List
       style={{maxHeight: '700px',maxWeight: '250px',overflowY: 'auto',overflowX: 'hidden'}}
         grid={{ gutter: 16, column: 1 }}
         dataSource={searchResults}
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
                   <span style={tagStyle}>shopping</span>
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
     </div>
      )}
    </div>
  );
};

export default SearchPanel;
