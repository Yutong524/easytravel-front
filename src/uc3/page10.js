import React, { useState } from 'react';
import { Button, Input, Typography } from 'antd';
import './page12.css';

const { Title, Paragraph } = Typography;

const CreateNewRouteStep1 = ({ prevPlan, onNext, onCancel }) => {
  const [routeName, setRouteName] = useState('');
  const [error, setError] = useState(false);

  const handleNextClick = () => {
    if (routeName.trim() === '') {
      setError(true);
      return;
    }
    onNext(routeName);
  };

  return (
    <div className="create-new-route-step">
      <Title level={2}>Create New Route</Title>
      <Paragraph>Add a name for your travel route:</Paragraph>
      <Input
        type="text"
        placeholder="Provide a name for your travel route"
        value={routeName}
        onChange={(e) => {
          setRouteName(e.target.value);
          setError(false);
        }}
      />
      {error && <p className="error-message">Please provide a name for your travel route.</p>}
      <div className="buttons">
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="primary" onClick={handleNextClick}>Next</Button>
      </div>
    </div>
  );
};

export default CreateNewRouteStep1;
