import React, { useEffect, useState } from 'react';
import { Button, List, Empty, message, Card, Tag, Tooltip } from 'antd';
import './TravelPlan.css';
import axios from 'axios';
import CreateTravelPlan from './CreateTravelPlan';
import TravelPlanDetails from './TravelPlanDetail';
import EditTravelPlan from './EditTravelPlan';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

function TravelPlan({ userId }) {
  const [travelPlans, setTravelPlans] = useState([]);
  const [createPlanModalVisible, setCreatePlanModalVisible] = useState(false);
  const [editPlanModalVisible, setEditPlanModalVisible] = useState(false);
  const [deletedPlan, setDeletedPlan] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleCreatePlanClick = () => {
    setCreatePlanModalVisible(true);
  };

  const handleEditPlanClick = () => {
    setEditPlanModalVisible(true);
  }

  const handleCloseEditPlanModal = () => {
    setEditPlanModalVisible(false);
  }

  const handleEditPlan = () => {
    handleCloseEditPlanModal()
  }

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

  const deleteTravelPlan = (planId) => {
    axios.delete(`http://localhost:8080/api/travelPlans/${planId}`)
      .then(_ => {
        setDeletedPlan(true);
        message.success("Successfully deleted a travel plan");
      })
      .catch(error => {
        message.error('Failed to delete travel plans.');
        console.error(error);
      });
  }

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
    setDeletedPlan(false);
    fetchTravelPlans();
  }, [userId, createPlanModalVisible, deletedPlan]);


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
              <div style={{ paddingTop: "60px",display: 'flex', flexDirection: 'row' }}>
                <Tooltip title="edit">
                  <Button type="default" onClick={handleEditPlanClick} icon={<EditOutlined />} />
                  <EditTravelPlan
                    visible={editPlanModalVisible}
                    onClose={handleCloseEditPlanModal}
                    onEdit={handleEditPlan}
                    plan={plan}
                  />
                </Tooltip>
                <Tooltip title="edit">
                  <Button onClick={() => deleteTravelPlan(plan.planId)} danger icon={<DeleteOutlined />} />
                </Tooltip>
              </div>
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
