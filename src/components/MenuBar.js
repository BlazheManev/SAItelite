import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation

const MenuBar = ({ showAddSatelliteForm, toggleAddSatelliteForm }) => {
  return (
    <div style={styles.menuBar}>
      <div style={styles.buttonsContainer}>
        {/* Links replace manual navigation */}
        <Link to="/track" style={{ textDecoration: 'none' }}>
          <button style={styles.menuButton}>Track Satellites</button>
        </Link>
        <button
          style={styles.menuButton}
          onClick={toggleAddSatelliteForm}
        >
          {showAddSatelliteForm ? 'Hide Add Satellite Form' : 'Add Satellite'}
        </button>
      </div>

      {/* Legend */}
      <div style={styles.legend}>
        <span style={{ ...styles.legendItem, color: 'red' }}>● Debris</span>
        <span style={{ ...styles.legendItem, color: 'palegreen' }}>● Satellite</span>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: '10px',
    zIndex: 999,
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
    gap: '10px',
    marginRight: '10px',
  },
  legendItem: {
    fontSize: '14px',
    fontWeight: 'bold',
  },
};

export default MenuBar;
