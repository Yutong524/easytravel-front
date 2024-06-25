import React, { useEffect, useState } from 'react';
import { Button, List, Empty, message, Card, Tag } from 'antd';
import './TravelPlan.css';
import axios from 'axios';
import CreateTravelPlan from './CreateTravelPlan';
import TravelPlanDetails from './TravelPlanDetail';

function TravelPlan({ userId }) {
  const customerId = localStorage.getItem("customer");
  const [travelPlans, setTravelPlans] = useState([]);
  const [createPlanModalVisible, setCreatePlanModalVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

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

  const viewRoutes = (plan) => {
    setSelectedPlan(plan);
    setShowDetails(true);
  };

  const fetchTravelPlans = () => {
    //if (!userId) return;
    const customerId = localStorage.getItem("customer");

    axios.get(`http://localhost:8080/api/travelPlans/${customerId}`)
      .then(response => {
        setTravelPlans(response.data);
      })
      .catch(error => {
        message.error('Failed to fetch travel plans.');
        console.error(error);
      });
  };
  
  useEffect(() => {
    fetchTravelPlans();
  }, [userId, createPlanModalVisible]);


  const renderItem = (plan) => {
    return (
      <List.Item className="plan-item">
        <Card bordered={true} style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <h4>{plan.name}</h4>
              <p>{plan.description}</p>
              {plan.tags && plan.tags.map(tag => (
                <Tag color="black" key={tag}>{tag}</Tag>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <a onClick={() => viewRoutes(plan)}>See All Route &gt;</a>
            </div>
          </div>
        </Card>
      </List.Item>
    );
  };

  return (
    showDetails ? (<TravelPlanDetails plan={selectedPlan} setShowDetails={setShowDetails}/>) :
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
