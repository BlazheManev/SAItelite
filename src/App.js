// src/App.js
import React, { useState } from 'react';
import MenuBar from './components/MenuBar';  // Import MenuBar
import Satellites from './components/Satellite/SatellitesComponenet';  // Import Satellites Component

function App() {
  const [currentView, setCurrentView] = useState("track"); // Default to "track" view

  // Function to handle navigation and update the view
  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <MenuBar onNavigate={handleNavigate} /> {/* Render the MenuBar with the navigation handler */}

      {/* Conditionally render the component based on the currentView state */}
      {currentView === "track" && <Satellites />}
    </div>
  );
}

export default App;
