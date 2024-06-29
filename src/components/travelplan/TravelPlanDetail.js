import React, { useState } from 'react';
import { Button, Empty, Modal, message } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import './TravelPlanDetail.css';
import CreateNewRouteStep1 from '../../uc3/page10';
import CreateNewRouteStep2 from '../../uc3/page11';
import CreateNewRouteStep3 from '../../uc3/page12';
import CreateNewRouteStep4 from '../../uc3/page14';
import CreateNewRouteStep5 from '../../uc3/page16';
import CreateNewRouteStep6 from '../../uc3/page17';

const TravelPlanDetails = ({ plan, setShowDetails }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [routeName, setRouteName] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [isOrdered, setIsOrdered] = useState(true);
  const [priority, setPriority] = useState('NA');

  const handleCreateRouteClick = () => {
    setModalStep(1);
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleNextStep = (name, start, end, places, ordered, plan, priority, schedules) => {
    if (modalStep === 1) {
      setRouteName(name);
      setModalStep(2);
    } else if (modalStep === 2) {
      setStartDate(start);
      setEndDate(end);
      setModalStep(3);
    } else if (modalStep === 3) {
      setSelectedPlaces(places);
      setIsOrdered(ordered);
      setModalStep(4);
    } else if (modalStep === 4) {
      setModalStep(5);
    } else if (modalStep === 5) {
      setPriority(priority);
      setModalStep(6);
    } else {
      console.log('Route Name:', routeName);
      console.log('Start Date:', startDate);
      console.log('End Date:', endDate);
      console.log('Selected Places:', selectedPlaces);
      console.log('Ordered:', isOrdered);
      console.log('Selected Plan:', plan);
      console.log('Priority:', priority);
      console.log('Schedules:', schedules);
      setIsModalVisible(false);
      // Here you can add the logic to actually save the new route to the backend
    }
  };

  const handleBackStep = () => {
    setModalStep(modalStep - 1);
  };

  const toggleView = () => {
    setShowDetails(false);
  };

  return (
    <div className="travel-plan-detail-container">
      <div className="page-navs-container">
        <Button type="default" className="nav-back-button" onClick={toggleView} icon={<LeftOutlined />}>
          Go Back
        </Button>
        <Button type="primary" className="create-route-button" onClick={handleCreateRouteClick}>
          Create New Route
        </Button>
      </div>

      {!plan.routes || plan.routes.length === 0 ? (
        <div className="empty-routes-container">
          <Empty description="You don't have any routes yet!" className="no-route-message" />
        </div>
      ) : (
        <div>{plan.name}</div>
      )}

      <Modal
        title={
          modalStep === 1
            ? "Create New Route"
            : modalStep === 2
            ? "Select Travel Days"
            : modalStep === 3
            ? "Add Places to Visit"
            : modalStep === 4
            ? "Select Plan"
            : modalStep === 5
            ? "Set Priority"
            : "Schedule POIs"
        }
        visible={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        {modalStep === 1 ? (
          <CreateNewRouteStep1 onNext={handleNextStep} onCancel={handleModalCancel} />
        ) : modalStep === 2 ? (
          <CreateNewRouteStep2
            routeName={routeName}
            onBack={handleBackStep}
            onCancel={handleModalCancel}
            onNext={handleNextStep}
          />
        ) : modalStep === 3 ? (
          <CreateNewRouteStep3
            routeName={routeName}
            startDate={startDate}
            endDate={endDate}
            selectedPlaces={selectedPlaces}
            setSelectedPlaces={setSelectedPlaces}
            onBack={handleBackStep}
            onCancel={handleModalCancel}
            onNext={handleNextStep}
          />
        ) : modalStep === 4 ? (
          <CreateNewRouteStep4
            prevPlan={plan}
            routeName={routeName}
            startDate={startDate}
            endDate={endDate}
            selectedPlaces={selectedPlaces}
            isOrdered={isOrdered}
            onBack={handleBackStep}
            onCancel={handleModalCancel}
            onNext={handleNextStep}
            selectedPlan={plan} // Pass the plan directly
          />
        ) : modalStep === 5 ? (
          <CreateNewRouteStep5
            routeName={routeName}
            startDate={startDate}
            endDate={endDate}
            selectedPlaces={selectedPlaces}
            isOrdered={isOrdered}
            selectedPlan={plan}
            onBack={handleBackStep}
            onCancel={handleModalCancel}
            onNext={handleNextStep}
          />
        ) : (
          <CreateNewRouteStep6
            routeName={routeName}
            startDate={startDate}
            endDate={endDate}
            selectedPlaces={selectedPlaces}
            isOrdered={isOrdered}
            selectedPlan={plan}
            priority={priority}
            onBack={handleBackStep}
            onCancel={handleModalCancel}
            onCreate={handleNextStep}
          />
        )}
      </Modal>
    </div>
  );
};

export default TravelPlanDetails;
