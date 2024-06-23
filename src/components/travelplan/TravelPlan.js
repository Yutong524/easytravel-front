import React, { useEffect, useState } from 'react';
import { Button, List, Empty } from 'antd';
import './TravelPlan.css';
import CreateTravelPlan from './CreateTravelPlan';

function TravelPlan({ userId }) {
  const [travelPlans, setTravelPlans] = useState([]);
  const [createPlanModalVisible, setCreatePlanModalVisible] = useState(false);
  const [showRoutes, setShowRoutes] = useState(false);

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

    // fetch(`/api/travel-plans/${userId}`)
    //   .then(response => response.json())
    //   .then(data => setTravelPlans(data))
    //   .catch(error => {
    //     message.error('Failed to fetch travel plans.');
    //     console.error(error);
    //   });
    const plans = [
      {
        "id": 1,
        "planId": 1,
        "name": "New York",
        "description": "Going to new york yay",
        "tags": ["ny", "summer"],
        "routes": [],
      },
      {
        "id": 2,
        "planId": 2,
        "name": "LA",
        "description": "Going to LA yay",
        "tags": ["LA", "summer"],
        "routes": ["Hollywood"]
      }
    ];
    setTravelPlans(plans);
  }, [userId]);

  const viewRoutes = (routes) => {
    if (routes.length === 0) {
      return <div>This plan has 0 route. See All Route</div>
    } else{
      return <button onClick={toggleView}>Edit</button>
    }
  }

  const toggleView = () => {
    setShowRoutes(true)
  };

  const renderItem = (plan) => {
    return (
      <List.Item className="plan-item" extra={viewRoutes(plan.routes)}>
        <List.Item.Meta
          title={plan.name}
          description={plan.description}
        />
        <div className="plan-detail-container">
          <button>History</button>
        </div>
      </List.Item>
    );
  };

  return (
    showRoutes ? (<>Routes</>) :
    <div className="travel-plan-container">
      <div className="create-plan-container">
        <Button type="primary" className="create-plan-button" onClick={handleCreatePlanClick}>
          Create New Plan
        </Button>
        <CreateTravelPlan
          visible={createPlanModalVisible}
          onClose={handleCloseCreatePlanModal}
          onCreate={handleCreatePlan}
          userId={userId}
        />
      </div>
      <div className="travel-plan-list-container">
        {travelPlans.length > 0 ? (
          <List
            className="plan-list"
            dataSource={travelPlans}
            renderItem={renderItem}
            itemLayout="vertical"
            bordered
          />
        ) : (
          <Empty description="You don't have any plan yet!" className="no-plan-message" />
        )}
      </div>
    </div>
  );
}

export default TravelPlan;
