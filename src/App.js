import React, { useState } from 'react';
import Login from './components/login/Login';
import Register from './components/login/Register';
import Home from './components/home/Home';
import POIMap from './components/POIMap';
import Map from './components/Map';

function App() {
  const [currentPage, setCurrentPage] = useState('login');

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <Login onSuccess={() => setCurrentPage('home')} onRegister={() => setCurrentPage('register')} />;
      case 'register':
        return <Register onSuccess={() => setCurrentPage('login')} />;
      case 'home':
        return <Home />;
      default:
        return <Login onSuccess={() => setCurrentPage('home')} onRegister={() => setCurrentPage('register')} />;
    }
  };

  return (
    <div className="App">
      {renderPage()}
    </div>
  );
}

export default App;