import React, { useEffect, useState } from 'react';
import { Button, List, Empty, message, Card, Tag } from 'antd';
import './TravelPlan.css';
import axios from 'axios';
import CreateTravelPlan from './CreateTravelPlan';
import TravelPlanDetails from './TravelPlanDetail';

function TravelPlan({ userId }) {
  userId = localStorage.getItem("customer");
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

  const viewPlanDetail = (plan) => {
    if (plan.routes.length === 0) {
      return <div>This plan has 0 route. See All Route</div>
    } else{
      return <button onClick={() => viewRoutes(plan)}>Edit</button>
    }
  }

  const viewRoutes = (plan) => {
    setSelectedPlan(plan);
    setShowDetails(true);
  };

  const tempRenderItem = (plan) => {
    return (
      <List.Item className="plan-item" extra={viewPlanDetail(plan)}>
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

  const fetchTravelPlans = () => {
    //if (!userId) return;

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

    axios.get(`http://localhost:8080/api/travelPlans/1`)
      .then(response => {
        setTravelPlans(response.data);
      })
      .catch(error => {
        message.error('Failed to fetch travel plans.');
        console.error(error);
      });
    
      setTravelPlans([...travelPlans, plans])
  };
  
  useEffect(() => {
    fetchTravelPlans();
  }, [userId]);


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
              <a href={`/routes/${plan.id}`}>See All Route &gt;</a>
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
