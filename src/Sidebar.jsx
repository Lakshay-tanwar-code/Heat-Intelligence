import React from 'react';
import './Sidebar.css';

const Sidebar = ({ activeProduct, setActiveProduct }) => {
  return (
    <aside className="sidebar-container">
      <div className="sidebar-logo">
        <div className="logo-icon">
          <svg width="24" height="24" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffea00" />
                <stop offset="50%" stopColor="#ff6d3a" />
                <stop offset="100%" stopColor="#ff4238" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            {/* Outer dynamic hexagonal shield */}
            <polygon points="50,5 90,27 90,73 50,95 10,73 10,27" fill="none" stroke="url(#glowGrad)" strokeWidth="8" filter="url(#glow)" />
            {/* Inner burning core */}
            <polygon points="50,22 75,36 75,64 50,78 25,64 25,36" fill="url(#glowGrad)" />
            {/* Center data node */}
            <circle cx="50" cy="50" r="8" fill="#14161b" />
          </svg>
        </div>
        <div className="logo-text">
          <h2>Heat Intelligence</h2>
          <p>FortyGuard Cloud</p>
        </div>
      </div>

      {/* Platform */}
      <div className="sidebar-section">
        <div className="sidebar-section-title">Platform</div>
        <ul className="sidebar-menu">
          <li
            className={`sidebar-menu-item ${activeProduct === 'Overview' ? 'active' : ''}`}
            onClick={() => setActiveProduct('Overview')}
          >
            <span className="icon">✦</span>
            <span>Overview</span>
          </li>
        </ul>
      </div>


      {/* Commercial Suite */}
      <div className="sidebar-section">
        <div className="sidebar-section-title">Commercial Suite</div>
        <ul className="sidebar-menu">
          <li
            className={`sidebar-menu-item ${activeProduct === 'ThermalGrid' ? 'active' : ''}`}
            onClick={() => setActiveProduct('ThermalGrid')}
          >
            <span className="icon" style={{ color: '#ffd700' }}>⚡</span>
            <div>
              <span className="title">ThermalGrid</span>
              <span className="subtitle">Data Centers</span>
            </div>
          </li>
          <li
            className={`sidebar-menu-item ${activeProduct === 'GridPeak' ? 'active' : ''}`}
            onClick={() => setActiveProduct('GridPeak')}
          >
            <span className="icon">🔌</span>
            <div>
              <span className="title">GridPeak</span>
              <span className="subtitle">Utilities</span>
            </div>
          </li>
          <li
            className={`sidebar-menu-item ${activeProduct === 'ColdRoute' ? 'active' : ''}`}
            onClick={() => setActiveProduct('ColdRoute')}
          >
            <span className="icon">🚚</span>
            <div>
              <span className="title">ColdRoute</span>
              <span className="subtitle">Logistics</span>
            </div>
          </li>
          <li
            className={`sidebar-menu-item ${activeProduct === 'ThermalScore' ? 'active' : ''}`}
            onClick={() => setActiveProduct('ThermalScore')}
          >
            <span className="icon" style={{ color: '#ffcc80' }}>🏷️</span>
            <div>
              <span className="title">ThermalScore</span>
              <span className="subtitle">Insurance</span>
            </div>
          </li>
          <li
            className={`sidebar-menu-item ${activeProduct === 'CoolScope' ? 'active' : ''}`}
            onClick={() => setActiveProduct('CoolScope')}
          >
            <span className="icon">🌳</span>
            <div>
              <span className="title">CoolScope</span>
              <span className="subtitle">Cities & ESG</span>
            </div>
          </li>
          <li
            className={`sidebar-menu-item ${activeProduct === 'CarbonLens' ? 'active' : ''}`}
            onClick={() => setActiveProduct('CarbonLens')}
          >
            <span className="icon">🫁</span>
            <div>
              <span className="title">CarbonLens</span>
              <span className="subtitle">ESG / Air quality</span>
            </div>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
