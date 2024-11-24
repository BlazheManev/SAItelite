import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MenuBar from './components/MenuBar'; // Import MenuBar
import Satellites from './components/Satellite/SatellitesComponent'; // Import Satellites Component
import AllSatellites from './components/Satellite/AllSatellites'; // Import the AllSatellites component

function App() {
  const [showAddSatelliteForm, setShowAddSatelliteForm] = useState(false); // Track visibility of the form
  const [activeSatellites, setActiveSatellites] = useState([]); // Track active satellites

  const toggleAddSatelliteForm = () => {
    setShowAddSatelliteForm(!showAddSatelliteForm); // Toggle visibility
  };

  const handleSatelliteUsed = (satellites) => {
    setActiveSatellites(satellites); // Set active satellites in the state
  };

  return (
    <Router>
      <div style={{ width: '100%', height: '100%' }}>
        {/* MenuBar remains constant across all routes */}
        <MenuBar
          showAddSatelliteForm={showAddSatelliteForm}
          toggleAddSatelliteForm={toggleAddSatelliteForm}
        />

        {/* Define routes */}
        <Routes>
          {/* Default route redirects to /track */}
          <Route path="/" element={<Navigate to="/track" replace />} />

          {/* Track Satellites Route */}
          <Route
            path="/track"
            element={
              <Satellites
                showAddSatelliteForm={showAddSatelliteForm}
                toggleAddSatelliteForm={toggleAddSatelliteForm}
                onSatelliteUsed={handleSatelliteUsed}
              />
            }
          />

          {/* All Satellites Route */}
          <Route
  path="/all-satellites"
  element={<AllSatellites />}
/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
