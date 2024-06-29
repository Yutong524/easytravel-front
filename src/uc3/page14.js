import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select, Button } from 'antd';
import './page12.css';

const { Option } = Select;

const CreateNewRouteStep4 = ({ routeName, startDate, endDate, selectedPlaces, isOrdered, onNext, onBack, onCancel }) => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/travelPlans/');
      setPlans(response.data);
    } catch (error) {
      console.error('Failed to fetch travel plans:', error);
    }
  };

  const handlePlanChange = (value) => {
    setSelectedPlan(value === "no_plan" ? null : value);
  };

  const handleNextClick = () => {
    onNext(routeName, startDate, endDate, selectedPlaces, isOrdered, selectedPlan);
  };

  return (
    <div className="create-new-route-step">
      <h2>Create New Route</h2>
      <p>Select a plan for this route:</p>
      <Select
        style={{ width: '100%' }}
        placeholder="Select a plan"
        onChange={handlePlanChange}
      >
        {plans.map((plan) => (
          <Option key={plan.id} value={plan.id}>{plan.name}</Option>
        ))}
        <Option value="no_plan">No plan</Option>
      </Select>
      <div className="buttons">
        <Button onClick={onBack}>Back</Button>
        <Button type="primary" onClick={handleNextClick}>Next</Button>
        <Button onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
};

export default CreateNewRouteStep4;

