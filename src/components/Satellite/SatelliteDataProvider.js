import React, { useState, useEffect } from "react";
import axios from "axios";
import * as satellite from "satellite.js";

const SatelliteDataProvider = ({ onDataUpdate }) => {
  const [satData, setSatData] = useState([]);

  const tleCategories = [
    "weather.txt",
    "gps-ops.txt",
    "amateur.txt",
    // Add other categories as needed
  ];

  useEffect(() => {
    const fetchSatelliteData = async () => {
      const allSatellites = [];

      try {
        for (const category of tleCategories) {
          const response = await axios.get(`https://celestrak.com/NORAD/elements/${category}`);
          const tleArray = response.data.trim().split("\n");

          for (let i = 0; i < tleArray.length; i += 3) {
            const name = tleArray[i].trim();
            const tle1 = tleArray[i + 1].trim();
            const tle2 = tleArray[i + 2].trim();

            const satrec = satellite.twoline2satrec(tle1, tle2);

            allSatellites.push({
              name,
              satrec,
            });
          }
        }

        setSatData(allSatellites);
        onDataUpdate(allSatellites); // Notify parent component about the updated data
      } catch (error) {
        console.error("Error fetching satellite data:", error);
      }
    };

    fetchSatelliteData();
  }, [onDataUpdate]);

  return null;
};

export default SatelliteDataProvider;
