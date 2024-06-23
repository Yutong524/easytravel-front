import React from 'react';

const TravelPlanDetails = ({plan, setShowDetails}) => {
  const toggleView = () => {
    setShowDetails(false);
  };

  return (
    <div className="travel-plan-detail">
      <div>
        <button onClick={toggleView}>go back</button>
      </div>
      <div className="">
        {plan.routes}
      </div>
    </div>
  )
};

export default TravelPlanDetails;