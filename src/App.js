import React, { useState } from 'react';
import MenuBar from './components/MenuBar';  // Import MenuBar
import Satellites from './components/Satellite/SatellitesComponent';  // Import Satellites Component

function App() {
  const [currentView, setCurrentView] = useState("track"); // Default to "track" view
  const [showAddSatelliteForm, setShowAddSatelliteForm] = useState(false); // Track visibility of the form
  const [activeSatellites, setActiveSatellites] = useState([]); // Track active satellites

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  const toggleAddSatelliteForm = () => {
    setShowAddSatelliteForm(!showAddSatelliteForm); // Toggle visibility
  };

  const handleSatelliteUsed = (satellites) => {
    setActiveSatellites(satellites); // Set active satellites in the state
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <MenuBar 
        onNavigate={handleNavigate} 
        showAddSatelliteForm={showAddSatelliteForm} 
        toggleAddSatelliteForm={toggleAddSatelliteForm} 
        activeSatellites={activeSatellites} 
      />

      {currentView === "track" && <Satellites showAddSatelliteForm={showAddSatelliteForm} toggleAddSatelliteForm={toggleAddSatelliteForm} onSatelliteUsed={handleSatelliteUsed} />}
      {currentView === "add" && <Satellites showAddSatelliteForm={showAddSatelliteForm} toggleAddSatelliteForm={toggleAddSatelliteForm} onSatelliteUsed={handleSatelliteUsed} />}
    </div>
  );
}

export default App;
