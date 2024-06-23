import React, { useEffect, useState } from 'react';
import { Button, List, Empty, message, Card, Tag } from 'antd';
import './TravelPlan.css';
import axios from 'axios';
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


  const fetchTravelPlans = () => {
    //if (!userId) return;

    axios.get(`http://localhost:8080/api/travelPlans/1`)
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
              <span>This plan has {plan.routesCount} route{plan.routesCount !== 1 ? 's' : ''}. <a href={`/routes/${plan.id}`}>See All Route &gt;</a></span>
              <Button type="primary" style={{ marginTop: '8px' }}>history</Button>
            </div>
          </div>
        </Card>
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
