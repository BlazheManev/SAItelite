import { useEffect } from "react";
import axios from "axios";
import * as satellite from "satellite.js";

const SatelliteDataProvider = ({ onDataUpdate, fetchAllSatellites }) => {
  const tleCategories = [
    "weather.txt",
    "gps-ops.txt",
    "amateur.txt",
    // Add more categories as needed
  ];
  const DEBRIS_URLs = [
    `https://celestrak.org/NORAD/elements/gp.php?GROUP=cosmos-2251-debris&FORMAT=tle`,
    `https://celestrak.org/NORAD/elements/gp.php?GROUP=cosmos-1408-debris&FORMAT=tle`,
    `https://celestrak.org/NORAD/elements/gp.php?GROUP=iridium-33-debris&FORMAT=tle`,
  `https://celestrak.org/NORAD/elements/gp.php?GROUP=fengyun-1c-debris&FORMAT=tle`
  ];
  useEffect(() => {
    // Function to fetch satellite data
    const fetchSatelliteData = async () => {
      // Clear previous satellite data before fetching new data
      const allSatellites = [];

      try {
        // If fetching all satellites, get data from CelesTrak's active satellite list
        if (fetchAllSatellites) {
          const response = await axios.get(`https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=tle`);
          const tleArray = response.data.trim().split("\n");

          // Process the TLE data
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

          for (const url of DEBRIS_URLs) {
            const response = await axios.get(url);
            const tleArray = response.data.trim().split("\n");
    
            // Process the TLE data
            for (let i = 0; i < tleArray.length; i += 3) {
              const name = tleArray[i].trim();
              const tle1 = tleArray[i + 1].trim();
              const tle2 = tleArray[i + 2].trim();
    
              const satrec = satellite.twoline2satrec(tle1, tle2);
    
              allSatellites.push({
                name,
                satrec,
                isDebris: true // Marking debris satellites
              });
            }
          }
        } else {
          // If not fetching all satellites, loop through each category and fetch TLE data
          for (const category of tleCategories) {
            const response = await axios.get(`https://celestrak.com/NORAD/elements/${category}`);
            const tleArray = response.data.trim().split("\n");

            // Process the TLE data
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
        }

      onDataUpdate(allSatellites);
      } catch (error) {
        console.error("Error fetching satellite data:", error);
      }
    };

    // Call the function to fetch satellite data
    fetchSatelliteData();

    // Cleanup function to clear data when fetchAllSatellites changes
    return () => {
      onDataUpdate([]); // Clear data when component unmounts or when fetchAllSatellites changes
    };

  }, [fetchAllSatellites, onDataUpdate]); // Re-run the effect when fetchAllSatellites changes

  return null;
};

export default SatelliteDataProvider;
