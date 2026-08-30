import React from 'react';
import './MapLayerControls.css';

export function MapLayerControls({ activeLayer, setActiveLayer }) {
  const layers = [
    { id: 'temperature', label: 'Thermal Surface' },
    { id: 'urban-heat', label: 'Air Quality' },
    { id: 'satellite', label: 'Solar Irradiance' },
  ];

  return (
    <div className="map-layer-controls">
      {layers.map((layer) => (
        <button
          key={layer.id}
          onClick={() => setActiveLayer(layer.id)}
          className={`mlc-btn ${activeLayer === layer.id ? 'active' : ''}`}
        >
          {layer.label}
        </button>
      ))}
    </div>
  );
}
