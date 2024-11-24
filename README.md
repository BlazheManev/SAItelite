# Autonomous Satellite Management Solution

This repository contains the source code and documentation for our cutting-edge *Autonomous Satellite Management Solution*.
A next-generation solution for managing satellites autonomously, ensuring safety, efficiency, and reduced reliance on ground operations through state-of-the-art features.

## Core Functionalities

- **Self-Driving Satellites**  
  Satellites autonomously avoid space debris and relocate as needed to ensure safe and efficient operations.

- **Collision Avoidance**  
  Real-time data is leveraged to prevent satellite collisions, significantly enhancing space safety.

- **Automatic Launch Coordination**  
  Streamlines satellite deployment with minimal ground-based intervention, making the process efficient and reliable.

- **Generating New Safe TLE (Two-Line Elements)**  
  Automatically generates updated TLEs for satellites, ensuring compatibility with adjusted orbital paths for safe operations.

- **Visualizing and Adding New Safe TLEs**  
  Provides tools to visualize new TLE data and integrate it seamlessly into the system.

- **Simulating TLE Adjustments**  
  Simulates orbital changes based on TLE data, enabling precise planning and safety measures.

- **Time Adjustment for TLE Simulation**  
  Adjusts time parameters in simulations for accurate predictions of satellite behavior and collisions.

---

## Technology Used
- **Frontend**: React.js
- Integration with *real-time TLE (Two-Line Element)* data for satellite position tracking.
- *SGP-4 orbital trajectory calculation* for accurate orbital predictions.
- Proprietary algorithms designed for *route optimization* and ensuring safe travel paths for satellites.
- Utilized [`react-globe.gl`](https://github.com/vasturiano/react-globe.gl) to create an interactive 3D globe visualization with customizable markers, labels, and animations for geographic data representation.

## How to Use

1. **Live Application**  
   The application is already live and accessible at:  
   [Satellite Management System](https://saitellite-frontend.onrender.com/)

2. **Setup the Environment**  
   - Clone the repository:
     ```bash
     git clone [<repository_url>](https://github.com/BlazheManev/SAItellite-frontend.git)
     cd SAItellite-frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```

3. **Run the Application**  
   - Start the development server:
     ```bash
     npm start
     ```
   - For production builds:
     ```bash
     npm run build
     ```
