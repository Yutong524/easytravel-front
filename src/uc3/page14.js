import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select, Button } from 'antd';
import './page12.css';

const { Option } = Select;

const CreateNewRouteStep4 = ({ prevPlan, routeName, startDate, endDate, selectedPlaces, isOrdered, onNext, onBack, onCancel }) => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(prevPlan || null);
  const customerId = localStorage.getItem("customer");

  useEffect(() => {
    if (!prevPlan) {
      fetchPlans();
    }
  }, [prevPlan]);

  const fetchPlans = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/travelPlans/${customerId}`);
      setPlans(response.data);
    } catch (error) {
      console.error('Failed to fetch travel plans:', error);
    }
  };

  const handlePlanChange = (value) => {
    const selected = plans.find(plan => plan.id === value);
    setSelectedPlan(selected);
  };

  const handleNextClick = () => {
    onNext(routeName, startDate, endDate, selectedPlaces, isOrdered, selectedPlan);
  };

  return (
    <div className="create-new-route-step">
      <h2>Create New Route</h2>
      {prevPlan ? (
        <>
          <p>This route will be created under the plan: <strong>{prevPlan.name}</strong></p>
          <div className="buttons">
            <Button onClick={onBack}>Back</Button>
            <Button type="primary" onClick={handleNextClick}>Next</Button>
            <Button onClick={onCancel}>Cancel</Button>
          </div>
        </>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default CreateNewRouteStep4;

