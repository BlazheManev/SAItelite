import React, { useState } from 'react';
import * as satellite from 'satellite.js';

const AddSatelliteForm = ({ onAddSatellite }) => {
  const [satelliteName, setSatelliteName] = useState('');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!satelliteName || !line1 || !line2) {
      alert('Please fill in all fields!');
      return;
    }

    // Parse TLE lines into a satellite record (satrec)
    try {
      const satrec = satellite.twoline2satrec(line1, line2);
      
      // Create the new satellite object with 'isNew' flag
      const newSatellite = {
        name: satelliteName,
        satrec: satrec, // Save the satrec to use in propagation
        isNew: true, // Mark it as a new satellite
      };

      // Call the onAddSatellite function to add the new satellite
      onAddSatellite(newSatellite);

      // Clear the form
      setSatelliteName('');
      setLine1('');
      setLine2('');
    } catch (error) {
      console.error('Error parsing TLE:', error);
      alert('Invalid TLE data!');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '10px' }}>
      <div>
        <label>Satellite Name:</label>
        <input
          type="text"
          value={satelliteName}
          onChange={(e) => setSatelliteName(e.target.value)}
          required
          style={{ width: '100%' }}
        />
      </div>
      <div>
        <label>Line 1 (TLE):</label>
        <textarea
          value={line1}
          onChange={(e) => setLine1(e.target.value)}
          required
          style={{ width: '100%', height: '60px' }}
        />
      </div>
      <div>
        <label>Line 2 (TLE):</label>
        <textarea
          value={line2}
          onChange={(e) => setLine2(e.target.value)}
          required
          style={{ width: '100%', height: '60px' }}
        />
      </div>
      <button type="submit" style={{ marginTop: '10px' }}>Add Satellite</button>
    </form>
  );
};

export default AddSatelliteForm;
