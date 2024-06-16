import React, { useState } from 'react';
import Login from './components/login/Login';
import Register from './components/login/Register';
import POIMap from './components/POIMap';
import Map from './components/Map'



function App() {
  const [currentPage, setCurrentPage] = useState('login');

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        //TODO: update new page after successful login
        return <Login onSuccess={() => setCurrentPage('login')} onRegister={() => setCurrentPage('register')} />;
      case 'register':
        return <Register onSuccess={() => setCurrentPage('login')} />;
      default:
        return <Login onSuccess={() => setCurrentPage('login')} onRegister={() => setCurrentPage('register')} />;
    }
  };

  return (
    <div className="App">
      {renderPage()}
    </div>
  );
}

export default App;
