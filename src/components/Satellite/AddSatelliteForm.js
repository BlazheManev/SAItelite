// AddSatelliteForm.js
import React, { useState } from "react";
import * as satellite from "satellite.js";

const AddSatelliteForm = ({ onAddSatellite }) => {
  const [satelliteName, setSatelliteName] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!satelliteName || !line1 || !line2) {
      alert("Please fill in all fields!");
      return;
    }

    try {
      // Parse TLE lines into a satellite record (satrec)
      const satrec = satellite.twoline2satrec(line1, line2);

      // Create the new satellite object
      const newSatellite = {
        name: satelliteName,
        satrec: satrec, // Save the satrec to use in propagation
        isNew: true, // Mark it as a new satellite (static)
      };

      onAddSatellite(newSatellite);

      // Clear the form
      setSatelliteName("");
      setLine1("");
      setLine2("");
    } catch (error) {
      console.error("Error parsing TLE:", error);
      alert("Invalid TLE data!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.6)", // Semi-transparent black background
        padding: "20px",
        borderRadius: "10px",
        color: "white", // Text color white for visibility
        maxWidth: "300px",
        margin: "10px",
        zIndex: 10,
      }}
    >
      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
          Satellite Name:
        </label>
        <input
          type="text"
          value={satelliteName}
          onChange={(e) => setSatelliteName(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            backgroundColor: "#333",
            color: "white",
          }}
        />
      </div>
      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
          Line 1 (TLE):
        </label>
        <textarea
          value={line1}
          onChange={(e) => setLine1(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            backgroundColor: "#333",
            color: "white",
            minHeight: "60px",
          }}
        />
      </div>
      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
          Line 2 (TLE):
        </label>
        <textarea
          value={line2}
          onChange={(e) => setLine2(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            backgroundColor: "#333",
            color: "white",
            minHeight: "60px",
          }}
        />
      </div>
      <button
        type="submit"
        style={{
          padding: "10px 20px",
          backgroundColor: "#4CAF50", // Green background
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Add Satellite
      </button>
    </form>
  );
};

export default AddSatelliteForm;
