import React, { useState } from 'react';
import { List, Card, Rate, Button, Row, Col, Input, Skeleton } from 'antd';
import { HeartOutlined, HeartFilled, ShoppingOutlined } from '@ant-design/icons';

// 自定义标签样式
const tagStyle = {
  display: 'flex',             // 使用 Flexbox 布局
  justifyContent: 'center',    // 水平居中
  alignItems: 'center',        // 垂直居中
  width: '100px',              // 设置宽度
  height: '20px',              // 设置高度
  border: '1px solid black',   // 添加边框
  borderRadius: '10px',        // 添加圆角
  backgroundColor: 'lightblue',// 设置背景颜色
  textAlign: 'center',         // 文字水平居中
};

// 搜索面板组件
const SearchPanel = ({ isLoading, listofPOI, onSearch }) => {
  // 本地状态管理
  const [searchText, setSearchText] = useState(''); // 搜索文本状态
  const [showResults, setShowResults] = useState(false); // 显示搜索结果状态
  const [likedItems, setLikedItems] = useState([]); // 喜欢的项目状态

  // 处理搜索按钮点击事件
  const handleButtonClick = () => {
    setShowResults(true); // 显示搜索结果
    onSearch(); // 调用传入的搜索函数
  };

  // 处理搜索文本变化事件
  const handleChange = (e) => {
    setSearchText(e.target.value);
  };

  // 处理喜欢按钮点击事件
  const toggleLike = (name) => {
    setLikedItems(prev =>
      prev.includes(name) ? prev.filter(item => item !== name) : [...prev, name]
    );
  };

  return (
    <div style={{ position: 'absolute', top: '100px', right: '40px', width: '300px', zIndex: 1, border: '1px solid #ccc', backgroundColor: '#fff', borderRadius: '5px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      {/* 搜索输入框和按钮 */}
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
      {/* 搜索结果列表 */}
      {showResults && (
        <div style={{ padding: '5px' }}>
          {isLoading ? (
            // 显示加载骨架屏
            <Skeleton active />
          ) : (
            // 显示POI列表
            <List
              style={{ maxHeight: '700px', maxWidth: '300px', overflowY: 'auto', overflowX: 'hidden' }}
              grid={{ gutter: 16, column: 1 }}
              dataSource={listofPOI}
              renderItem={item => (
                <List.Item>
                  <Card>
                    {/* POI名称 */}
                    <Row justify="space-between" align="middle">
                      <h3>{item.name}</h3>
                    </Row>
                    {/* POI地址 */}
                    <Row justify="space-between" align="middle">
                      <span>{item.address}</span>
                    </Row>
                    {/* POI评分 */}
                    <Row justify="space-between" align="middle">
                      <Rate disabled defaultValue={item.rating} />
                    </Row>
                    {/* POI类别、喜欢按钮和详情按钮 */}
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
