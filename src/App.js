// src/App.js

import React from 'react';
import Earth from './components/Earth/Earth';  // Import Earth Component

function App() {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      {/* Earth Component will take full screen */}
      <Earth />
    </div>
  );
}

export default App;
