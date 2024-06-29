import React, { useEffect, useState } from 'react';
import { List, Card, Button, Collapse, Empty, message, Modal } from 'antd';
import axios from 'axios';
import './MyTravelRoute.css';
import moment from 'moment';
import CreateNewRouteStep1 from '../uc3/page10';
import CreateNewRouteStep2 from '../uc3/page11';
import CreateNewRouteStep3 from '../uc3/page12';
import CreateNewRouteStep4 from '../uc3/page14';
import CreateNewRouteStep5 from '../uc3/page16';
import CreateNewRouteStep6 from '../uc3/page17';

const { Panel } = Collapse;

function MyTravelRoute({ userId }) {
  const customerId = localStorage.getItem("customer");
  const [travelRoutes, setTravelRoutes] = useState([]);
  const [expandedRouteIds, setExpandedRouteIds] = useState([]);
  const [planNames, setPlanNames] = useState({});
  const [poiNames, setPoiNames] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [routeName, setRouteName] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [isOrdered, setIsOrdered] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
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
      setSelectedPlan(plan);
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
      console.log('Selected Plan:', selectedPlan);
      console.log('Priority:', priority);
      console.log('Schedules:', schedules);
      setIsModalVisible(false);
    }
  };

  const handleBackStep = () => {
    setModalStep(modalStep - 1);
  };

  const fetchTravelRoutes = () => {
    axios.get(`http://localhost:8080/api/travelRoutes/routes/${customerId}`)
      .then(response => {
        setTravelRoutes(response.data);
        response.data.forEach(route => {
          fetchPlanName(route.planId);
          route.poiArrangement && route.poiArrangement.forEach(poi => {
            fetchPoiName(poi.poiId);
          });
        });
      })
      .catch(error => {
        message.error('Failed to fetch travel routes.');
        console.error(error);
      });
  };

  const fetchPlanName = async (planId) => {
    if (planId === 0) {
      setPlanNames(prevState => ({ ...prevState, [planId]: 'No related plan' }));
      return;
    }
    try {
      const response = await axios.get(`http://localhost:8080/api/travelPlans/plans/${planId}`);
      setPlanNames(prevState => ({ ...prevState, [planId]: response.data.name }));
    } catch (error) {
      console.error(`Failed to fetch plan name for planId: ${planId}`, error);
      setPlanNames(prevState => ({ ...prevState, [planId]: 'Failed to fetch plan name' }));
    }
  };

  const fetchPoiName = async (poiId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/pois/${poiId}`);
      setPoiNames(prevState => ({ ...prevState, [poiId]: response.data.name }));
    } catch (error) {
      console.error(`Failed to fetch POI name for poiId: ${poiId}`, error);
      setPoiNames(prevState => ({ ...prevState, [poiId]: 'Failed to fetch POI name' }));
    }
  };

  const toggleVisibility = async (routeId, currentVisibility) => {
    try {
      await axios.patch(`http://localhost:8080/api/travelRoutes/routes/${routeId}/visibility`, {
        visibility: !currentVisibility
      });
      fetchTravelRoutes();
    } catch (error) {
      message.error('Failed to toggle visibility.');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTravelRoutes();
  }, [userId]);

  const toggleExpand = (routeId) => {
    setExpandedRouteIds((prevExpandedRouteIds) => {
      if (prevExpandedRouteIds.includes(routeId)) {
        return prevExpandedRouteIds.filter((id) => id !== routeId);
      } else {
        return [...prevExpandedRouteIds, routeId];
      }
    });
  };

  const calculateDuration = (startDate, endDate) => {
    const start = moment(startDate, 'YYYY-MM-DD');
    const end = moment(endDate, 'YYYY-MM-DD');
    const duration = moment.duration(end.diff(start));
    return `${duration.days()} days`;
  };

  const renderPOIDetails = (poiArrangement) => {
    if (!Array.isArray(poiArrangement)) {
      return <p>No POI arrangements available.</p>;
    }
    return poiArrangement.map((poi, index) => (
      <div key={index} className="poi-detail">
        <p><strong>{poiNames[poi.poiId] || 'Loading...'}</strong></p>
        <p className="indented">From: {moment(poi.startTime).format('YYYY-MM-DD HH:mm:ss')}</p>
        <p className="indented">To: {moment(poi.endTime).format('YYYY-MM-DD HH:mm:ss')}</p>
      </div>
    ));
  };

  const renderItem = (route) => (
    <List.Item className="route-item">
      <Card bordered={true} style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <h4>{route.name}</h4>
            <p>{planNames[route.planId] || 'Loading...'}</p>
            <p>Duration: {calculateDuration(route.startDate, route.endDate)}</p>
          </div>
          <div>
            <Button type="default" onClick={() => toggleExpand(route.id)}>
              {expandedRouteIds.includes(route.id) ? 'Collapse' : 'Expand'}
            </Button>
            <Button
              type="default"
              onClick={() => toggleVisibility(route.routeId, route.visibility)}
              style={{ marginLeft: '10px' }}
            >
              {route.visibility ? 'Set Private' : 'Set Public'}
            </Button>
          </div>
        </div>
        {expandedRouteIds.includes(route.id) && (
          <Collapse className="route-details" activeKey="1">
            <Panel header="Route Details" key="1">
              <div>{renderPOIDetails(route.poiArrangement)}</div>
            </Panel>
          </Collapse>
        )}
      </Card>
    </List.Item>
  );

  return (
    <div className="my-travel-route-container">
      <div className="my-travel-route-list-container">
        <Button type="primary" className="create-plan-button" onClick={handleCreateRouteClick}>
          Create New Route
        </Button>
        {travelRoutes.length > 0 ? (
          <List
            className="route-list"
            dataSource={travelRoutes}
            renderItem={renderItem}
            itemLayout="vertical"
            bordered
          />
        ) : (
          <Empty description="No travel routes available!" className="no-route-message" />
        )}
      </div>

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
            prevPlan={""}
            routeName={routeName}
            startDate={startDate}
            endDate={endDate}
            selectedPlaces={selectedPlaces}
            isOrdered={isOrdered}
            onBack={handleBackStep}
            onCancel={handleModalCancel}
            onNext={handleNextStep}
          />
        ) : modalStep === 5 ? (
          <CreateNewRouteStep5
            routeName={routeName}
            startDate={startDate}
            endDate={endDate}
            selectedPlaces={selectedPlaces}
            isOrdered={isOrdered}
            selectedPlan={selectedPlan}
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
            selectedPlan={selectedPlan}
            priority={priority}
            onBack={handleBackStep}
            onCancel={handleModalCancel}
            onCreate={handleNextStep}
          />
        )}
      </Modal>
    </div>
  );
}

export default MyTravelRoute;