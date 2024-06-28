import React, { useEffect, useState } from 'react';
import { List, Card, Button, Collapse, Empty, message } from 'antd';
import axios from 'axios';
import './MyTravelRoute.css';
import moment from 'moment';

const { Panel } = Collapse;

function MyTravelRoute({ userId }) {
  const customerId = localStorage.getItem("customer");
  const [travelRoutes, setTravelRoutes] = useState([]);
  const [expandedRouteIds, setExpandedRouteIds] = useState([]);
  const [planNames, setPlanNames] = useState({});
  const [poiNames, setPoiNames] = useState({});

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

  const renderPOIDetails = (poiArrangment) => {
    if (!Array.isArray(poiArrangment)) {
      return <p>No POI arrangements available.</p>;
    }
    return poiArrangment.map((poi, index) => (
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
    </div>
  );
}

export default MyTravelRoute;





