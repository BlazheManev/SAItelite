import React, { useState } from 'react';
import MenuBar from './components/MenuBar';  // Import MenuBar
import Satellites from './components/Satellite/SatellitesComponents';  // Import Satellites Component

function App() {
  const [currentView, setCurrentView] = useState("track"); // Default to "track" view
  const [showAddSatelliteForm, setShowAddSatelliteForm] = useState(false); // Track visibility of the form

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  const toggleAddSatelliteForm = () => {
    setShowAddSatelliteForm(!showAddSatelliteForm); // Toggle visibility
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <MenuBar 
        onNavigate={handleNavigate} 
        showAddSatelliteForm={showAddSatelliteForm} 
        toggleAddSatelliteForm={toggleAddSatelliteForm} 
      />

      {currentView === "track" && <Satellites showAddSatelliteForm={showAddSatelliteForm} toggleAddSatelliteForm={toggleAddSatelliteForm} />}
      {currentView === "add" && <Satellites showAddSatelliteForm={showAddSatelliteForm} toggleAddSatelliteForm={toggleAddSatelliteForm} />}
    </div>
  );
}

export default App;
