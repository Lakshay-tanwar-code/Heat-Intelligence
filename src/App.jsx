import React, { useState } from 'react';
import Sidebar from './Sidebar';
import RouteDashboard from './RouteDashboard';
import ThermalGrid from './ThermalGrid';
import GridPeak from './GridPeak';
import ThermalScore from './ThermalScore';
import CoolScope from './CoolScope';
import CarbonLens from './CarbonLens';
import Overview from './Overview';
import AICopilot from './AICopilot';
import APIInspector from './APIInspector';
import './index.css';

function App() {
  const [activeProduct, setActiveProduct] = useState('Overview');

  const renderContent = () => {
    switch (activeProduct) {
      case 'Overview': return <Overview setActiveProduct={setActiveProduct} />;
      case 'ThermalGrid': return <ThermalGrid />;
      case 'GridPeak': return <GridPeak />;
      case 'ColdRoute': return <RouteDashboard />;
      case 'ThermalScore': return <ThermalScore />;
      case 'CoolScope': return <CoolScope />;
      case 'CarbonLens': return <CarbonLens />;
      default: return <RouteDashboard />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar activeProduct={activeProduct} setActiveProduct={setActiveProduct} />
      <main className="main-content" style={{ paddingBottom: '60px' }}>
        {renderContent()}
      </main>
      {/* Global persistent overlays */}
      <AICopilot />
      <APIInspector />
    </div>
  );
}

export default App;
