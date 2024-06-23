import React, { useEffect, useState } from 'react';
import { Button, List, Empty, message } from 'antd';
import './TravelPlan.css';
import CreateTravelPlan from './CreateTravelPlan';

function TravelPlan({ userId }) {
  const [travelPlans, setTravelPlans] = useState([]);
  const [createPlanModalVisible, setCreatePlanModalVisible] = useState(false);

  const handleCreatePlanClick = () => {
    setCreatePlanModalVisible(true);
  };

  const handleCloseCreatePlanModal = () => {
    setCreatePlanModalVisible(false);
  };

  const handleCreatePlan = (planData) => {
    setTravelPlans([...travelPlans, planData]);
    handleCloseCreatePlanModal();
  };

  useEffect(() => {
    if (!userId) return;

    fetch(`/api/travel-plans/${userId}`)
      .then(response => response.json())
      .then(data => setTravelPlans(data))
      .catch(error => {
        message.error('Failed to fetch travel plans.');
        console.error(error);
      });
  }, [userId]);

  const renderItem = (plan) => {
    return (
      <List.Item className="plan-item">
        <h4>{plan.name}</h4>
      </List.Item>
    );
  };

  return (
    <div className="travel-plan-container">
      <Button type="primary" className="create-plan-button" onClick={handleCreatePlanClick}>
        Create New Plan
      </Button>
      <CreateTravelPlan
        visible={createPlanModalVisible}
        onClose={handleCloseCreatePlanModal}
        onCreate={handleCreatePlan}
        userId={userId}
      />
      {travelPlans.length > 0 ? (
        <List
          className="plan-list"
          dataSource={travelPlans}
          renderItem={renderItem}
        />
      ) : (
        <Empty description="You don't have any plan yet!" className="no-plan-message" />
      )}
    </div>
  );
}

export default TravelPlan;
