import React from 'react';
import { Button, Empty, Form, Input } from 'antd';
import { LeftOutlined } from '@ant-design/icons'
import './TravelPlanDetail.css'


const TravelPlanDetails = ({ plan, setShowDetails }) => {
  const toggleView = () => {
    setShowDetails(false);
  };

  return (
    <div className="travel-plan-detail-container">
      <div className="page-navs-container">
        <Button type="default" className="nav-back-button" onClick={toggleView} icon={<LeftOutlined />}>
          Go Back
        </Button>
        <Button type="primary" className="create-route-button">
            Create New Route
        </Button>
      </div>

      {!plan.routes || plan.routes?.length === 0 ? (
        <div className="empty-routes-container">
          <Empty description="You don't have any routes yet!" className="no-route-message" />
          <Button type="default">
            Create New Route
          </Button>
        </div>
      ) : (
        <div className="">
          {plan.name}
        </div>
      )}
      
    </div>
  )
};

export default TravelPlanDetails;