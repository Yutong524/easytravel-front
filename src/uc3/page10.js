import React, { useState } from 'react';
import './page12.css';

const CreateNewRouteStep1 = ({ onNext, onCancel }) => {
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
      <h2>Create New Route</h2>
      <input
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
        <button onClick={onCancel}>Cancel</button>
        <button onClick={handleNextClick}>Next</button>
      </div>
    </div>
  );
};

export default CreateNewRouteStep1;
