import React from "react";
import MapContainer from "./MapContainer";

import "./App.css";

function App() {
  return (
    <div className='App'>
      <h1>Google Heatmaps And Clusterer Marker Example</h1>
      <div className='maps'>
        <MapContainer />
      </div>
    </div>
  );
}

export default App;
