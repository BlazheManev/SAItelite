import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Import useLocation for checking current route

const MenuBar = ({ showAddSatelliteForm, toggleAddSatelliteForm }) => {
  const location = useLocation();

  // Determine if the current path is '/track'
  const isOnTrackPage = location.pathname === '/track';

  return (
    <div style={styles.menuBar}>
      <div style={styles.buttonsContainer}>
        {/* Links replace manual navigation */}
        <Link to="/track" style={{ textDecoration: 'none' }}>
          <button style={styles.menuButton}>Track Satellites</button>
        </Link>
        <button
          style={{
            ...styles.menuButton,
            cursor: isOnTrackPage ? 'pointer' : 'not-allowed',
            opacity: isOnTrackPage ? 1 : 0.6,
          }}
          onClick={isOnTrackPage ? toggleAddSatelliteForm : null} // Only trigger function if on '/track'
          disabled={!isOnTrackPage} // Disable the button if not on '/track'
        >
          {showAddSatelliteForm ? 'Hide Add Satellite Form' : 'Add Satellite'}
        </button>

        <Link to="/all-satellites" style={{ textDecoration: 'none' }}>
          <button style={styles.menuButton}>New TLE</button>
        </Link>
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
