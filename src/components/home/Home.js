import React, { useState, useEffect } from 'react';
import './Home.css';
import { FaRoute, FaPlane, FaHeart, FaCompass, FaMapMarkerAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import TravelPlan from '../travelplan/TravelPlan';
import POIMap from '../POIMap';
import CreateTravelPlan from '../travelplan/CreateTravelPlan';
import MyFavoritePOI from '../MyFavoritePOI.js';
import MyTravelRoute from '../MyTravelRoute.js';
import CommunityPage from '../CommunityPage.js';

function Home() {
  const userId = localStorage.getItem('customerId');
  const [isExpanded, setIsExpanded] = useState(true);
  const [currentComponent, setCurrentComponent] = useState('home');
  const [selectedItem, setSelectedItem] = useState(null);
  
  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const handleListItemClick = (component) => {
    setCurrentComponent(component);
    setSelectedItem(component);
  };

  const navigateToTravelPlan = () => {
    setCurrentComponent('travelPlan');
    setSelectedItem('travelPlan');
  };

  return (
    <div className={`home-container ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <nav className="sidebar">
        <div className="sidebar-header">
          <h1 className="easy-travel" onClick={() => handleListItemClick('home')}>{isExpanded ? 'EasyTravel' : 'ET'}</h1>
          <button className="toggle-button" onClick={toggleSidebar}>
            {isExpanded ? <FaChevronLeft /> : <FaChevronRight />}
          </button>
        </div>
        <ul className="nav-list">
          <li className={`nav-item ${selectedItem === 'route' ? 'selected' : ''}`} onClick={() => handleListItemClick('route')}>
            <FaRoute className="nav-icon" /> {isExpanded && 'My Travel Route'}
          </li>
          <li className={`nav-item ${selectedItem === 'travelPlan' ? 'selected' : ''}`} onClick={() => handleListItemClick('travelPlan')}>
            <FaPlane className="nav-icon" /> {isExpanded && 'My Travel Plan'}
          </li>
          <li className={`nav-item ${selectedItem === 'interests' ? 'selected' : ''}`} onClick={() => handleListItemClick('interests')}>
            <FaCompass className="nav-icon" /> {isExpanded && 'Hunt for Interests'}
          </li>
          <li className={`nav-item ${selectedItem === 'community' ? 'selected' : ''}`} onClick={() => handleListItemClick('community')}>
            <FaMapMarkerAlt className="nav-icon" /> {isExpanded && 'Travel Community'}
          </li>
          <li className={`nav-item ${selectedItem === 'favorites' ? 'selected' : ''}`} onClick={() => handleListItemClick('favorites')}>
            <FaHeart className="nav-icon" /> {isExpanded && 'My Favorite POI'}
          </li>
        </ul>
      </nav>
      <main className="content">
        {currentComponent === 'home' ? (
          <>
            <h1>Welcome to EasyTravel</h1>
            <p>Select an option from the sidebar to get started.</p>
          </>
        ) : currentComponent === 'travelPlan' ? (
          <TravelPlan userId={userId} />
        ) : currentComponent === 'interests' ? (
          <POIMap userId={userId} />
        ) : currentComponent === 'favorites' ? (
          <MyFavoritePOI userId={userId} />
        ) : currentComponent === 'route' ? (
          <MyTravelRoute userId={userId} />
        ) : currentComponent === 'community' ? (
          <CommunityPage  />
        ) : (
          <h1>Coming soon...</h1>
        )}
      </main>
    </div>
  );
}

export default Home;
