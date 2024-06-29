import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login/Login';
import Register from './components/login/Register';
import Home from './components/home/Home';
import POIMap from './components/POIMap';
import CreateNewRouteStep1 from './uc3/page10';
import CreateNewRouteStep2 from './uc3/page11';
import CreateNewRouteStep3 from './uc3/page12';
import MyTravelRoute from './components/MyTravelRoute';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Home />
            ) : (
              <Login onSuccess={() => setIsAuthenticated(true)} onRegister={() => setIsAuthenticated(false)} />
            )
          }
        />
        <Route
          path="/register"
          element={
            <Register onSuccess={() => setIsAuthenticated(false)} />
          }
        />
        <Route
          path="/my-travel-routes"
          element={
            isAuthenticated ? (
              <MyTravelRoute />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/create-step1"
          element={
            isAuthenticated ? (
              <CreateNewRouteStep1 />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/create-step2"
          element={
            isAuthenticated ? (
              <CreateNewRouteStep2 />
            ) : (
              <Navigate to="/" />
            )
          }
        />
         <Route
          path="/create-step3"
          element={
            isAuthenticated ? (
              <CreateNewRouteStep3 />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
