import React from 'react';

const MenuBar = ({ onNavigate, showAddSatelliteForm, toggleAddSatelliteForm }) => {
  return (
    <div style={styles.menuBar}>
      <div style={styles.buttonsContainer}>
        <button style={styles.menuButton} onClick={() => onNavigate("track")}>
          Track Satellites
        </button>
        <button
          style={styles.menuButton}
          onClick={() => {
            toggleAddSatelliteForm(); // Toggle the form visibility
            onNavigate("add"); // Switch view to add satellite
          }}
        >
          {showAddSatelliteForm ? 'Hide Add Satellite Form' : 'Add Satellite'}
        </button>
      </div>

      {/* Legend at Top-Right */}
      <div style={styles.legend}>
        <span style={{ ...styles.legendItem, color: "red" }}>● Debris</span>
       {/* <span style={{ ...styles.legendItem, color: "orange" }}>● New</span>  */}
        <span style={{ ...styles.legendItem, color: "palegreen" }}>● Satellite</span>
      </div>
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
    justifyContent: 'space-between', // Space between buttons and legend
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: '10px',
    zIndex: 999, // Ensure it is above other elements
  },
  buttonsContainer: {
    display: 'flex',
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
  legend: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px', // Spacing between legend items
    marginRight: '10px', // Adjust margin for spacing from the edge
  },
  legendItem: {
    fontSize: '14px',
    fontWeight: 'bold',
  },
};

export default MenuBar;
