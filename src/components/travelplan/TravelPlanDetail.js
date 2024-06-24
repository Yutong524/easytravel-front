import React from 'react';
import { Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons'
import './TravelPlanDetail.css'


const TravelPlanDetails = ({ plan, setShowDetails }) => {
  const toggleView = () => {
    setShowDetails(false);
  };

  return (
    <div className="travel-plan-detail">
      <div className="page-navs-container">
        <Button type="default" className="nav-back-button" onClick={toggleView} icon={<LeftOutlined />}>
          Go Back
        </Button>
        <Button type="primary" className="create-route-button">
            Create New Route
        </Button>
      </div>
      <div className="">
        {plan.routes}
      </div>
    </div>
  )
};

export default TravelPlanDetails;