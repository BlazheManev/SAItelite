import React from 'react';

const MenuBar = ({ onNavigate, showAddSatelliteForm, toggleAddSatelliteForm }) => {
  return (
    <div style={styles.menuBar}>
      <button style={styles.menuButton} onClick={() => onNavigate("track")}>
        Track Satellites
      </button>
      <button
        style={styles.menuButton}
        onClick={() => {
          toggleAddSatelliteForm();  // Toggle the form visibility
          onNavigate("add");         // Switch view to add satellite
        }}
      >
        {showAddSatelliteForm ? 'Hide Add Satellite Form' : 'Add Satellite'}
      </button>
    </div>
  );
};

const styles = {
  menuBar: {
    position: 'absolute',
    top: '0', 
    left: '0',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: '10px',
    zIndex: 999, // Ensure it is above other elements
  },
  menuButton: {
    backgroundColor: '#444',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    margin: '0 10px',
    cursor: 'pointer',
    borderRadius: '5px',
  },
};

export default MenuBar;
