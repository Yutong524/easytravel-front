import React, { useState } from 'react';
import { List, Card, Rate, Button, Row, Col, Input, Skeleton, Form } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import moment from 'moment';

const tagStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '80px',
  height: '25px',
  border: '1px solid black',
  borderRadius: '5px',
  backgroundColor: '#f0f0f0',
  textAlign: 'center',
};

const detailStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '5px 0',
};

const commentStyle = {
  display: 'flex',
  flexDirection: 'column',
  padding: '10px',
  border: '1px solid #f0f0f0',
  borderRadius: '5px',
  marginBottom: '10px',
  backgroundColor: '#fafafa',
};

const SearchPanel = ({ isLoading, listofPOI, onSearch, onFavorite, onPostComment }) => {
  const [searchText, setSearchText] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [likedItems, setLikedItems] = useState([]);
  const [selectedPOI, setSelectedPOI] = useState(null);
  const [expandedSection, setExpandedSection] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [form] = Form.useForm();

  const handleButtonClick = () => {
    setSelectedPOI(null); // Reset selected POI
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

  const handleDetailClick = (poi) => {
    setSelectedPOI(poi);
    setExpandedSection('');
  };

  const handleBackClick = () => {
    setSelectedPOI(null);
  };

  const handleSectionToggle = (section) => {
    setExpandedSection(expandedSection === section ? '' : section);
  };

  const handleCommentSubmit = (poiId) => {
    if (newComment && newRating) {
      const comment = {
        time: moment().format('YYYY-MM-DD HH:mm:ss'),
        publisher: 'testUser', // Replace with actual user
        content: newComment,
        rating: newRating,
      };

      onPostComment(poiId, comment);

      // Update the local selectedPOI comments list
      setSelectedPOI({
        ...selectedPOI,
        comments: [...selectedPOI.comments, comment],
      });
      setNewComment('');
      setNewRating(0);
      form.resetFields();
    }
  };

  const CustomComment = ({ author, content, datetime, rating }) => (
    <div style={commentStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
        <strong>{author}</strong>
        <span>{datetime}</span>
      </div>
      <div>{content}</div>
      <Rate disabled defaultValue={rating} style={{ marginTop: '5px' }} />
    </div>
  );

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
            <>
              {selectedPOI ? (
                <div style={{ maxHeight: '700px', maxWidth: '300px', overflowY: 'auto', overflowX: 'hidden' }}>
                  <Card>
                    <Button onClick={handleBackClick}>Back to results</Button>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3>{selectedPOI.name}</h3>
                      <Button
                        icon={likedItems.includes(selectedPOI.name) ? <HeartFilled style={{ color: 'red' }} /> : <HeartOutlined style={{ color: 'red' }} />}
                        size="middle"
                        onClick={() => toggleLike(selectedPOI.name)}
                      />
                    </div>
                    <div style={detailStyle}>
                      <span style={tagStyle}>{selectedPOI.category}</span>
                      <Rate disabled defaultValue={selectedPOI.rating} />
                    </div>
                    <p>{selectedPOI.address}</p>
                    <div style={detailStyle}>
                      <Button type="link" onClick={() => handleSectionToggle('openHours')}>Open Hour {'>'}</Button>
                    </div>
                    {expandedSection === 'openHours' && (
                      <div>
                        {selectedPOI.openTime.map((time, index) => (
                          <p key={index}>{`${time.day}: ${time.startTime} - ${time.endTime}`}</p>
                        ))}
                      </div>
                    )}
                    <div style={detailStyle}>
                      <Button type="link" onClick={() => handleSectionToggle('description')}>Description {'>'}</Button>
                    </div>
                    {expandedSection === 'description' && (
                      <p>{selectedPOI.description}</p>
                    )}
                    <div style={detailStyle}>
                      <Button type="link" onClick={() => handleSectionToggle('comments')}>Comment {'>'}</Button>
                    </div>
                    {expandedSection === 'comments' && (
                      <div>
                        {selectedPOI.comments.map((comment, index) => (
                          <CustomComment
                            key={index}
                            author={comment.publisher}
                            content={comment.content}
                            datetime={moment(comment.time).fromNow()}
                            rating={comment.rating}
                          />
                        ))}
                        <Form
                          form={form}
                          style={{ marginTop: '10px' }}
                          onFinish={() => handleCommentSubmit(selectedPOI._id.$oid)}
                        >
                          <Form.Item name="comment" rules={[{ required: true, message: 'Please input your comment!' }]}>
                            <Input.TextArea
                              rows={2}
                              placeholder="Comment..."
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                            />
                          </Form.Item>
                          <Form.Item name="rating" rules={[{ required: true, message: 'Please rate this POI!' }]}>
                            <Rate onChange={setNewRating} value={newRating} />
                          </Form.Item>
                          <Form.Item>
                            <Button type="primary" htmlType="submit">Post</Button>
                          </Form.Item>
                        </Form>
                      </div>
                    )}
                  </Card>
                </div>
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
                            <Button type="link" onClick={() => handleDetailClick(item)}>detail {'>'}</Button>
                          </Col>
                        </Row>
                      </Card>
                    </List.Item>
                  )}
                />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPanel;
