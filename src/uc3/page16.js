import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Radio, Button, message } from 'antd';
import './page12.css';

const CreateNewRouteStep5 = ({ prevPlan, routeName, startDate, endDate, selectedPlaces, isOrdered, selectedPlan, onNext, onBack, onCancel }) => {
  const [priority, setPriority] = useState('NA');
  const [routesInPlan, setRoutesInPlan] = useState([]);
  const customerId = localStorage.getItem("customer");

  useEffect(() => {
    if (selectedPlan) {
      fetchRoutesInPlan();
    }
  }, [selectedPlan]);

  const fetchRoutesInPlan = async () => {
    try {
        const planId = selectedPlan.planId;
      const response = await axios.get(`http://localhost:8080/api/travelRoutes/plans/${planId}`);
      setRoutesInPlan(response.data.routes);
    } catch (error) {
      console.error('Failed to fetch routes in plan:', error);
    }
  };

  const handlePriorityChange = (e) => {
    const selectedPriority = e.target.value;
    if (selectedPriority === 'first' || selectedPriority === 'second') {
      const existingRoute = routesInPlan.find(route => route.priority === selectedPriority);
      if (existingRoute) {
        const confirmReplace = window.confirm(`There is already a ${selectedPriority} priority route. Do you want to replace it?`);
        if (confirmReplace) {
          replaceOldPriority(existingRoute.id, selectedPriority);
          setPriority(selectedPriority);
        } else {
          setPriority('');
        }
      } else {
        setPriority(selectedPriority);
      }
    } else {
      setPriority(selectedPriority);
    }
  };

  const replaceOldPriority = async (oldRouteId, newPriority) => {
    try {
      await axios.patch(`http://localhost:8080/api/travelPlans/routes/${selectedPlan}/${oldRouteId}`, { priority: 'none' });
      message.success(`Old ${newPriority} priority route has been replaced.`);
    } catch (error) {
      console.error(`Failed to replace old ${newPriority} priority route:`, error);
    }
  };

  const handleNextClick = () => {
    if (!selectedPlan && priority !== 'NA') {
      message.error('Priority selection is not allowed for routes without a plan.');
      return;
    }
    onNext(routeName, startDate, endDate, selectedPlaces, isOrdered, selectedPlan, priority);
  };

  return (
    <div className="create-new-route-step">
      <h2>Create New Route</h2>
      {selectedPlan ? (
        <>
          <p>Select priority for this route:</p>
          <Radio.Group onChange={handlePriorityChange} value={priority}>
            <Radio value="none">None</Radio>
            <Radio value="first">First</Radio>
            <Radio value="second">Second</Radio>
          </Radio.Group>
        </>
      ) : (
        <p>Priority: NA</p>
      )}
      <div className="buttons">
        <Button onClick={onBack}>Back</Button>
        <Button type="primary" onClick={handleNextClick}>Next</Button>
        <Button onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
};

export default CreateNewRouteStep5;
