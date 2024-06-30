import React from 'react';
import { Button, List, Typography, Space } from 'antd';
import moment from 'moment';

const { Title, Text } = Typography;

const CreateNewRouteStep7 = ({ routeName, startDate, endDate, selectedPlaces, isOrdered, selectedPlan, priority, poiSchedules, onBack, onCreate, onCancel }) => {
  return (
    <div className="create-new-route-step">
      <Title level={2}>Confirm Route Details</Title>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <Text strong>Route Name:</Text> {routeName}
        </div>
        <div>
          <Text strong>Travel Dates:</Text> {startDate} to {endDate}
        </div>
        <div>
          <Text strong>Ordered:</Text> {isOrdered ? 'Yes' : 'No'}
        </div>
        <div>
          <Text strong>Plan:</Text> {selectedPlan ? selectedPlan.name : 'No Plan'}
        </div>
        <div>
          <Text strong>Priority:</Text> {priority}
        </div>
      </Space>
      <Title level={4}>POI Schedules</Title>
      <List
        bordered
        dataSource={poiSchedules}
        renderItem={poi => (
          <List.Item>
            <div>
              <Text strong>{poi.name}</Text> <br />
              <Text type="secondary">{poi.address}</Text> <br />
              <Text>Date:</Text> {poi.date} <br />
              <Text>Start Time:</Text> {poi.startTime} <br />
              <Text>End Time:</Text> {poi.endTime}
            </div>
          </List.Item>
        )}
      />
      <div className="buttons">
        <Button onClick={onBack}>Back</Button>
        <Button type="primary" onClick={onCreate}>Create</Button>
        <Button onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
};

export default CreateNewRouteStep7;
