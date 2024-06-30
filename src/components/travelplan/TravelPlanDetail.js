import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, Card, Button, Collapse, Empty, message, Modal, Tooltip, Select } from 'antd';
import { LeftOutlined, DeleteOutlined } from '@ant-design/icons';
import './TravelPlanDetail.css';
import moment from 'moment';
import CreateNewRouteStep1 from '../../uc3/page10';
import CreateNewRouteStep2 from '../../uc3/page11';
import CreateNewRouteStep3 from '../../uc3/page12';
import CreateNewRouteStep4 from '../../uc3/page14';
import CreateNewRouteStep5 from '../../uc3/page16';
import CreateNewRouteStep6 from '../../uc3/page17';
import CreateNewRouteStep7 from '../../uc3/confirmation';
import ViewOnMapPOI from '../ViewOnMapPOI';
import ViewOnMapRoute from '../ViewOnMapRoute';

const { Panel } = Collapse;
const { Option } = Select;

const TravelPlanDetails = ({ plan, setShowDetails }) => {
  const customerId = localStorage.getItem("customer");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [routeName, setRouteName] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [isOrdered, setIsOrdered] = useState(true);
  const [priority, setPriority] = useState('NA');
  const [routes, setRoutes] = useState([]);
  const [expandedRouteIds, setExpandedRouteIds] = useState([]);
  const [poiNames, setPoiNames] = useState({});
  const [poiSchedules, setPoiSchedules] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedPOI, setSelectedPOI] = useState(null);
  const [isViewMapModalVisible, setIsViewMapModalVisible] = useState(false);
  const [isViewPOIModalVisible, setIsViewPOIModalVisible] = useState(false);

  useEffect(() => {
    if (plan && plan.planId) {
      fetchRoutes(plan.planId);
    }
  }, [plan]);

  const fetchRoutes = async (planId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/travelRoutes/plans/${planId}`);
      setRoutes(response.data);
      response.data.forEach(route => {
        route.poiArrangement && route.poiArrangement.forEach(poi => {
          fetchPoiName(poi.poiId);
        });
      });
    } catch (error) {
      message.error('Failed to fetch routes for the plan.');
      console.error(error);
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

  const handleCreateRouteClick = () => {
    setModalStep(1);
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleViewMapModalCancel = () => {
    setIsViewMapModalVisible(false);
  };

  const handleViewPOIModalCancel = () => {
    setIsViewPOIModalVisible(false);
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
    } else if (modalStep === 6) {
      setPoiSchedules(schedules);
      setModalStep(7);
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
    }
  };

  const handleBackStep = () => {
    setModalStep(modalStep - 1);
  };

  const handleCreateRoute = async () => {
    try {
      const newRoute = {
        routeName,
        startDate,
        endDate,
        selectedPlaces,
        plan,
        priority,
        poiSchedules,
        customerId
      };
      await axios.post('http://localhost:8080/api/travelRoutes/inside', newRoute);
      message.success('Route created successfully');
      setIsModalVisible(false);
      fetchRoutes(plan.planId);
    } catch (error) {
      message.error('Failed to create route');
    }
  };

  const toggleView = () => {
    setShowDetails(false);
  };

  const toggleExpand = (routeId) => {
    setExpandedRouteIds((prevExpandedRouteIds) => {
      if (prevExpandedRouteIds.includes(routeId)) {
        return prevExpandedRouteIds.filter((id) => id !== routeId);
      } else {
        return [...prevExpandedRouteIds, routeId];
      }
    });
  };

  const deleteRoute = async (routeId) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/travelRoutes/routes/${routeId}`);
      message.success(response.data);
      fetchRoutes(plan.planId);
    } catch (error) {
      message.error('Failed to delete the route.');
      console.error(error);
    }
  };

  const changePriority = async (routeId, newPriority) => {
    if (newPriority === "none") {
      try {
        await axios.patch(`http://localhost:8080/api/travelRoutes/routes/${routeId}`, { newPriority: newPriority });
        message.success(`Priority changed to ${newPriority}`);
        fetchRoutes(plan.planId);
      } catch (error) {
        message.error('Failed to change the priority.');
        console.error(error);
      }
      return;
    }

    const existingRoute = routes.find(route => route.priority === newPriority);
    if (existingRoute) {
      const confirmReplace = window.confirm(`There is already a route with ${newPriority} priority. Do you want to replace it?`);
      if (confirmReplace) {
        try {
          await axios.patch(`http://localhost:8080/api/travelRoutes/routes/${routeId}/${existingRoute.routeId}`, { newPriority: newPriority });
          message.success(`Priority changed to ${newPriority}`);
          fetchRoutes(plan.planId);
        } catch (error) {
          message.error('Failed to change the priority.');
          console.error(error);
        }
      }
    } else {
      try {
        await axios.patch(`http://localhost:8080/api/travelRoutes/routes/${routeId}`, { newPriority: newPriority });
        message.success(`Priority changed to ${newPriority}`);
        fetchRoutes(plan.planId);
      } catch (error) {
        message.error('Failed to change the priority.');
        console.error(error);
      }
    }
  };

  const viewRouteOnMap = (route) => {
    setSelectedRoute(route);
    setIsViewMapModalVisible(true);
  };

  const viewPOIOnMap = (poi) => {
    setSelectedPOI(poi);
    setIsViewPOIModalVisible(true);
  };

  const renderPOIDetails = (poiArrangement) => {
    if (!Array.isArray(poiArrangement)) {
      return <p>No POI arrangements available.</p>;
    }
    return poiArrangement.map((poi, index) => (
      <div key={index} className="poi-detail">
        <p>
          <strong
            style={{ cursor: 'pointer', color: '#1890ff' }}
            onClick={() => viewPOIOnMap(poi)}
          >
            {poiNames[poi.poiId] || 'Loading...'}
          </strong>
        </p>
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
            <p>Duration: {moment(route.startDate).format('YYYY-MM-DD')} to {moment(route.endDate).format('YYYY-MM-DD')}</p>
          </div>
          <div>
            <Button type="default" onClick={() => toggleExpand(route.routeId)}>
              {expandedRouteIds.includes(route.routeId) ? 'Collapse' : 'Expand'}
            </Button>
            <Tooltip title="delete">
              <Button danger icon={<DeleteOutlined />} onClick={() => deleteRoute(route.routeId)} style={{ marginLeft: '10px' }} />
            </Tooltip>
            <Select
              defaultValue={route.priority || "none"}
              style={{ width: 120, marginLeft: '10px' }}
              onChange={(value) => changePriority(route.routeId, value)}
            >
              <Option value="none">None</Option>
              <Option value="first">First</Option>
              <Option value="second">Second</Option>
            </Select>
            <Button
              type="default"
              onClick={() => viewRouteOnMap(route)}
              style={{ marginLeft: '10px' }}
            >
              View on Map
            </Button>
          </div>
        </div>
        {expandedRouteIds.includes(route.routeId) && (
          <Collapse className="route-details" activeKey="1">
            <Panel header="Route Details" key="1">
              <div>{renderPOIDetails(route.poiArrangement)}</div>
            </Panel>
          </Collapse>
        )}
      </Card>
    </List.Item>
  );

  const renderPrioritySection = (priorityTitle, routes) => (
    <div className="priority-section">
      <h3>{priorityTitle}</h3>
      {routes.length === 0 ? (
        <Empty description={`No routes with ${priorityTitle.toLowerCase()} priority.`} className="no-route-message" />
      ) : (
        <List
          className="route-list"
          dataSource={routes}
          renderItem={renderItem}
          itemLayout="vertical"
          bordered
        />
      )}
    </div>
  );

  const firstPriorityRoutes = routes.filter(route => route.priority === "first");
  const secondPriorityRoutes = routes.filter(route => route.priority === "second");
  const noPriorityRoutes = routes.filter(route => route.priority === "none" || !route.priority);

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

      {renderPrioritySection("FIRST PRIORITY", firstPriorityRoutes)}
      {renderPrioritySection("SECOND PRIORITY", secondPriorityRoutes)}
      {renderPrioritySection("NO PRIORITY", noPriorityRoutes)}

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
            : modalStep === 6
            ? "Schedule POIs"
            : "Confirmation"
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
        ) : modalStep === 6 ? (
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
        ) : (
          <CreateNewRouteStep7 
            routeName={routeName} 
            startDate={startDate} 
            endDate={endDate} 
            selectedPlaces={selectedPlaces} 
            isOrdered={isOrdered} 
            selectedPlan={plan} 
            priority={priority} 
            poiSchedules={poiSchedules} 
            onBack={handleBackStep} 
            onCreate={handleCreateRoute} 
            onCancel={handleModalCancel} 
          />
        )}
      </Modal>

      <ViewOnMapRoute
        route={selectedRoute}
        isVisible={isViewMapModalVisible}
        onCancel={handleViewMapModalCancel}
      />

      <ViewOnMapPOI
        poi={selectedPOI}
        isVisible={isViewPOIModalVisible}
        onCancel={handleViewPOIModalCancel}
      />
    </div>
  );
};

export default TravelPlanDetails;
