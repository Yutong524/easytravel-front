import React, { useEffect, useState } from 'react';
import { List, Card, Button, Collapse, Empty, message, Select } from 'antd';
import axios from 'axios';
import './CommunityPage.css';
import moment from 'moment';
import { SearchOutlined } from '@ant-design/icons';
import ViewOnMapPOI from './ViewOnMapPOI';
import ViewOnMapRoute from './ViewOnMapRoute';

const { Option } = Select;
const { Panel } = Collapse;

function CommunityPage() {
    const customerId = localStorage.getItem("customer");
    const [pois, setPois] = useState([]);
    const [selectedPois, setSelectedPois] = useState([]);
    const [duration, setDuration] = useState(1);
    const [routes, setRoutes] = useState([]);
    const [favoriteRoutes, setFavoriteRoutes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [expandedRouteIds, setExpandedRouteIds] = useState([]);
    const [poiNames, setPoiNames] = useState({});
    const [planNames, setPlanNames] = useState({});
    const [showFavorites, setShowFavorites] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [selectedPOI, setSelectedPOI] = useState(null);
    const [isViewMapModalVisible, setIsViewMapModalVisible] = useState(false);
    const [isViewPOIModalVisible, setIsViewPOIModalVisible] = useState(false);

    useEffect(() => {
        fetchPois();
        fetchFavoriteRoutes();
    }, []);

    const fetchPois = () => {
        axios.get('http://localhost:8080/api/pois/')
            .then(response => {
                setPois(response.data);
            })
            .catch(error => {
                message.error('Failed to fetch POIs.');
                console.error(error);
            });
    };

    const fetchFavoriteRoutes = () => {
        axios.get(`http://localhost:8080/api/travelRoutes/favorite/${customerId}`)
            .then(response => {
                const favoriteRouteIds = response.data;
                const favoriteRoutePromises = favoriteRouteIds.map(routeId =>
                    axios.get(`http://localhost:8080/api/travelRoutes/routes/id/${routeId}`)
                );
                Promise.all(favoriteRoutePromises)
                    .then(responses => {
                        const favoriteRoutes = responses.map(response => response.data);
                        setFavoriteRoutes(favoriteRoutes);
                    })
                    .catch(error => {
                        message.error('Failed to fetch favorite routes.');
                        console.error(error);
                    });
            })
            .catch(error => {
                message.error('Failed to fetch favorite routes.');
                console.error(error);
            });
    };

    const fetchPoiName = async (poiId) => {
        if (!poiNames[poiId]) {
            try {
                const response = await axios.get(`http://localhost:8080/api/pois/${poiId}`);
                setPoiNames(prevState => ({ ...prevState, [poiId]: response.data.name }));
            } catch (error) {
                console.error(`Failed to fetch POI name for poiId: ${poiId}`, error);
                setPoiNames(prevState => ({ ...prevState, [poiId]: 'Failed to fetch POI name' }));
            }
        }
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

    const handleSearch = () => {
        if (selectedPois.length === 0) {
            message.warning('Please select at least one POI.');
            return;
        }
        setLoading(true);
        const poiIds = selectedPois.join(',');
        const requestBody = `${duration};${poiIds}`;
        axios.post('http://localhost:8080/api/travelRoutes/search', requestBody, {
            headers: {
                'Content-Type': 'text/plain',
            }
        })
        .then(response => {
            setRoutes(response.data);
            response.data.forEach(route => {
                fetchPlanName(route.planId);
                route.poiArrangement && route.poiArrangement.forEach(poi => {
                    fetchPoiName(poi.poiId);
                });
            });
        })
        .catch(error => {
            message.error('Failed to search travel routes.');
            console.error(error);
        })
        .finally(() => {
            setLoading(false);
        });
    };

    const calculateDuration = (startDate, endDate) => {
        const start = moment(startDate, 'YYYY-MM-DD');
        const end = moment(endDate, 'YYYY-MM-DD');
        const duration = moment.duration(end.diff(start));
        return `${duration.days()} days`;
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

    const toggleFavorite = (routeId) => {
        axios.patch(`http://localhost:8080/api/travelRoutes/favorite/${customerId}/${routeId}`)
            .then(() => {
                fetchFavoriteRoutes();
                message.success('Successfully updated favorite routes.');
            })
            .catch(error => {
                message.error('Failed to update favorite routes.');
                console.error(error);
            });
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

    const renderRouteItem = (route) => (
        <List.Item className="route-item">
            <Card bordered={true} style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <h4>{route.name}</h4>
                        <p>{planNames[route.planId] || 'Loading...'}</p>
                        <p>Duration: {calculateDuration(route.startDate, route.endDate)}</p>
                    </div>
                    <div>
                        <Button type="default" onClick={() => toggleExpand(route.routeId)}>
                            {expandedRouteIds.includes(route.routeId) ? 'Collapse' : 'Expand'}
                        </Button>
                        <Button 
                            type={favoriteRoutes.some(favRoute => favRoute.routeId === route.routeId) ? 'danger' : 'primary'} 
                            onClick={() => toggleFavorite(route.routeId)}
                            style={{ marginLeft: '10px' }}
                        >
                            {favoriteRoutes.some(favRoute => favRoute.routeId === route.routeId) ? 'Remove from Favorites' : 'Add to Favorites'}
                        </Button>
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

    const toggleShowFavorites = () => {
        setShowFavorites(!showFavorites);
    };

    return (
        <div className="community-page-container">
            <div className="search-container">
                <Select
                    mode="multiple"
                    style={{ width: '60%' }}
                    placeholder="Select POIs"
                    onChange={value => setSelectedPois(value)}
                    optionLabelProp="label"
                >
                    {pois.map(poi => (
                        <Option key={poi.poiId} value={poi.poiId} label={poi.name}>
                            {poi.name}
                        </Option>
                    ))}
                </Select>
                <Select
                    defaultValue={1}
                    style={{ width: '20%', marginLeft: '10px' }}
                    onChange={value => setDuration(value)}
                >
                    {Array.from({ length: 15 }, (_, i) => i + 1).map(day => (
                        <Option key={day} value={day}>{day} days</Option>
                    ))}
                </Select>
                <Button
                    type="primary"
                    icon={<SearchOutlined />}
                    onClick={handleSearch}
                    loading={loading}
                    style={{ marginLeft: '10px' }}
                >
                    Search
                </Button>
                <Button
                    type="default"
                    onClick={toggleShowFavorites}
                    style={{ marginLeft: '10px' }}
                >
                    {showFavorites ? 'Back to Search' : 'Display Favorite Routes'}
                </Button>
            </div>
            <div className="routes-list-container">
                {showFavorites ? (
                    favoriteRoutes.length > 0 ? (
                        <List
                            className="routes-list"
                            dataSource={favoriteRoutes}
                            renderItem={renderRouteItem}
                            itemLayout="vertical"
                            bordered
                        />
                    ) : (
                        <Empty description="No favorite routes found!" className="no-routes-message" />
                    )
                ) : (
                    routes.length > 0 ? (
                        <List
                            className="routes-list"
                            dataSource={routes}
                            renderItem={renderRouteItem}
                            itemLayout="vertical"
                            bordered
                        />
                    ) : (
                        <Empty description="No routes found!" className="no-routes-message" />
                    )
                )}
            </div>

            <ViewOnMapRoute
                route={selectedRoute}
                isVisible={isViewMapModalVisible}
                onCancel={() => setIsViewMapModalVisible(false)}
            />

            <ViewOnMapPOI
                poi={selectedPOI}
                isVisible={isViewPOIModalVisible}
                onCancel={() => setIsViewPOIModalVisible(false)}
            />
        </div>
    );
}

export default CommunityPage;
