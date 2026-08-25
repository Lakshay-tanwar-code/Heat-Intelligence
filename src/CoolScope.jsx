import React, { useState, useEffect } from 'react';
import './RouteDashboard.css';
import './CoolScope.css';
import InterventionSimulator from './InterventionSimulator';

const locations = [
    { name: 'Downtown Phoenix, AZ', id: 'phx', basePaved: 96, baseTemp: 36.92, other: 4 },
    { name: 'Downtown LA, CA', id: 'la', basePaved: 88, baseTemp: 32.14, other: 12 },
    { name: 'Las Vegas, NV', id: 'lv', basePaved: 98, baseTemp: 39.50, other: 2 },
    { name: 'San Antonio, TX', id: 'sa', basePaved: 70, baseTemp: 34.20, other: 30 }
];

const CoolScope = () => {
    const [activeLoc, setActiveLoc] = useState(locations[0]);
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('slider');

    // Sliders
    const [treeCanopy, setTreeCanopy] = useState(20);
    const [coolRoofs, setCoolRoofs] = useState(50);
    const [coolPavement, setCoolPavement] = useState(40);

    // Computed values
    const [projected, setProjected] = useState(0);
    const [currentPaved, setCurrentPaved] = useState(activeLoc.basePaved);

    // Dynamic Pie Chart Breakdown
    const [builtPct, setBuiltPct] = useState(74.7);
    const [pavedPct, setPavedPct] = useState(21.4);
    const [otherPct, setOtherPct] = useState(3.9);

    // Instantly re-calculate when sliders or location change
    useEffect(() => {
        // Math logic to simulate cooling from interventions
        // Trees give max 1.5C cooling at 100%
        // Roofs give max 0.8C cooling at 100%
        // Pavement gives max 1.2C cooling at 100%
        const cooling = (treeCanopy * 0.015) + (coolRoofs * 0.008) + (coolPavement * 0.012);
        setProjected(parseFloat(cooling.toFixed(2)));

        // Calculate impervious surface reduction (trees reduce impervious overhead)
        const newPaved = Math.max(10, activeLoc.basePaved - (treeCanopy * 0.3) - (coolPavement * 0.1));
        setCurrentPaved(newPaved.toFixed(1));

        // Update pie chart composition
        // Increased trees = more "other" (greenery)
        const newOther = Math.min(100, activeLoc.other + (treeCanopy * 0.4));
        const rem = 100 - newOther;
        const newBuilt = rem * 0.7; // assuming 70% of built environment remains built
        const newPavedPie = rem * 0.3; // remaining paved

        setOtherPct(newOther.toFixed(1));
        setBuiltPct(newBuilt.toFixed(1));
        setPavedPct(newPavedPie.toFixed(1));

    }, [treeCanopy, coolRoofs, coolPavement, activeLoc]);

    const handlePillClick = (loc) => {
        setActiveLoc(loc);
        setSearch('');
        setTreeCanopy(20); setCoolRoofs(50); setCoolPavement(40);
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        if (e.target.value.length > 5) {
            setActiveLoc({
                name: e.target.value,
                id: 'custom',
                basePaved: 85,
                baseTemp: 33.00,
                other: 15
            });
            setTreeCanopy(0); setCoolRoofs(0); setCoolPavement(0);
        }
    };

    // Dynamic conic gradient for the pie chart
    const pieStyle = {
        background: `conic-gradient(
      #8b5cf6 0% ${builtPct}%, 
      #f97316 ${builtPct}% ${parseFloat(builtPct) + parseFloat(pavedPct)}%, 
      #3b82f6 ${parseFloat(builtPct) + parseFloat(pavedPct)}% 100%
    )`
    };

    return (
        <div className="dashboard-wrapper">
            <div className="dashboard-header">
                <div className="title-section">
                    <h1>
                        🌳 CoolScope <span className="tag">Cities / Real estate</span>
                    </h1>
                    <p>
                        Diagnose the urban heat island → simulate cooling interventions → quantify the ROI
                    </p>
                </div>
                <div className="header-status">
                    <div className="dot" style={{ background: '#f04343' }}></div> FortyGuard
                </div>
            </div>

            {/* ─ Tab Switcher ─ */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0' }}>
                {[
                    { id: 'slider', label: '📊 Slider Analysis', },
                    { id: 'simulator', label: '🧬 Generative Mitigation Simulator', accent: true },
                ].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                        padding: '0.6rem 1.25rem',
                        background: activeTab === tab.id
                            ? (tab.accent ? 'linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(43,212,198,0.1) 100%)' : 'rgba(255,255,255,0.06)')
                            : 'transparent',
                        border: 'none',
                        borderBottom: activeTab === tab.id
                            ? `2px solid ${tab.accent ? '#10b981' : '#2bd4c6'}`
                            : '2px solid transparent',
                        color: activeTab === tab.id ? (tab.accent ? '#10b981' : '#2bd4c6') : '#8b92a5',
                        fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', borderRadius: '8px 8px 0 0',
                        transition: 'all 0.15s',
                    }}>{tab.label}</button>
                ))}
            </div>

            {activeTab === 'simulator' && <InterventionSimulator />}

            {activeTab === 'slider' && (
                <>
                    <div className="coolscope-inputs">
                        <div className="coolscope-toolbar">
                            <div style={{ flex: 1 }}>
                                <label style={{ fontSize: '0.75rem', color: '#7a8291', display: 'block', marginBottom: '0.5rem' }}>Location Context</label>
                                <div className="location-pills">
                                    {locations.map(loc => (
                                        <button
                                            key={loc.id}
                                            className={`pill ${activeLoc.id === loc.id ? 'active' : ''}`}
                                            onClick={() => handlePillClick(loc)}
                                        >
                                            {loc.name} {activeLoc.id === loc.id && `(${currentPaved}% paved)`}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="coolscope-search">
                                <div className="input-group" style={{ minWidth: '200px' }}>
                                    <label>Or search specific address</label>
                                    <input type="text" placeholder="e.g. Times Square..." value={search} onChange={handleSearchChange} style={{ padding: '0.5rem' }} />
                                </div>
                                <div className="input-group" style={{ minWidth: '120px' }}>
                                    <label>Date</label>
                                    <input type="date" defaultValue="2026-06-15" style={{ padding: '0.5rem' }} />
                                </div>
                            </div>
                        </div>

                        <div className="sliders-row">
                            <div className="slider-group">
                                <label><span>🌳 Add tree canopy</span> <span>{treeCanopy}%</span></label>
                                <input type="range" min="0" max="100" value={treeCanopy} onChange={e => setTreeCanopy(e.target.value)} />
                            </div>
                            <div className="slider-group">
                                <label><span>🏢 Cool / reflective roofs</span> <span>{coolRoofs}%</span></label>
                                <input type="range" min="0" max="100" value={coolRoofs} onChange={e => setCoolRoofs(e.target.value)} />
                            </div>
                            <div className="slider-group">
                                <label><span>🛣️ Cool / permeable pavement</span> <span>{coolPavement}%</span></label>
                                <input type="range" min="0" max="100" value={coolPavement} onChange={e => setCoolPavement(e.target.value)} />
                            </div>
                        </div>
                    </div>

                    <div className="info-banner-green">
                        <div className="info-banner-left">
                            <div style={{ fontSize: '1.5rem' }}>🛰️</div>
                            <div>
                                <h3 style={{ color: '#f0f2f5', fontWeight: 600 }}>Baseline temperature: {activeLoc.name}</h3>
                                <p style={{ color: '#a3abbb', fontSize: '0.85rem' }}>
                                    FortyGuard heatmap measures <b>{activeLoc.baseTemp}°C</b> at this block; land cover from FortyGuard satellite (2026).
                                </p>
                            </div>
                        </div>
                        <div className="badge" style={{ color: '#4caf50', background: 'rgba(76, 175, 80, 0.1)' }}>Live AI Calc</div>
                    </div>

                    <div className="metrics-grid">
                        <div className="panel-card metric-card">
                            <div className="label">BASELINE TEMP</div>
                            <div className="value orange">{activeLoc.baseTemp.toFixed(2)}°C</div>
                            <div className="sub-value">Current Environment</div>
                        </div>
                        <div className="panel-card metric-card">
                            <div className="label">IMPERVIOUS SURFACE</div>
                            <div className="value orange">{currentPaved}%</div>
                            <div className="sub-value">After interventions</div>
                        </div>
                        <div className="panel-card metric-card">
                            <div className="label">PROJECTED COOLING</div>
                            <div className="value teal">
                                {projected === 0 ? '0.00°C' : `-${projected}°C`}
                            </div>
                            <div className="sub-value">from intervention mix</div>
                        </div>
                        <div className="panel-card metric-card">
                            <div className="label">NEW TEMPERATURE</div>
                            <div className="value teal">
                                {(activeLoc.baseTemp - projected).toFixed(2)}°C
                            </div>
                            <div className="sub-value">after intervention</div>
                        </div>
                    </div>

                    <div className="coolscope-grid-2">
                        <div className="panel-card">
                            <h3 style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>Satellite segmentation <span className="tag" style={{ background: '#2bd4c6', color: '#111', padding: '0.1rem 0.3rem', borderRadius: '4px', fontSize: '0.6rem' }}>2026</span></h3>
                            <p style={{ fontSize: '0.8rem', color: '#8b92a5', marginBottom: '1.5rem' }}>What the surface is actually made of.</p>

                            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                {/* Opacity changes based on tree canopy to simulate visual effect */}
                                <div className="segmentation-img" style={{ filter: `hue-rotate(${treeCanopy}deg) brightness(${1 - (treeCanopy * 0.002)})` }}></div>
                                <ul className="legend-list">
                                    <li><span><span className="box" style={{ background: '#b0a6a4' }}></span>Building</span> <span>{builtPct}%</span></li>
                                    <li><span><span className="box" style={{ background: '#4a4b4d' }}></span>Paved/Road</span> <span>{pavedPct}%</span></li>
                                    <li><span><span className="box" style={{ background: '#d4e05b' }}></span>Greenery/Other</span> <span>{otherPct}%</span></li>
                                </ul>
                            </div>
                        </div>

                        <div className="panel-card">
                            <h3 style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>Land-cover composition</h3>
                            <p style={{ fontSize: '0.8rem', color: '#8b92a5', marginBottom: '1.5rem' }}>
                                <b>{currentPaved > 80 ? 'Severe heat-island' : currentPaved > 50 ? 'Moderate heat-island' : 'Healthy Environment'}</b>
                            </p>
                            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', justifyContent: 'center', height: '120px' }}>
                                <div className="pie-chart" style={pieStyle}>
                                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10, fontSize: '0.75rem', fontWeight: 'bold', color: '#f0f2f5', textAlign: 'center' }}>built<br />{builtPct}%</div>
                                    <div style={{ position: 'absolute', top: '-10px', right: '-15px', fontSize: '0.65rem', color: '#a3abbb' }}>other {otherPct}%</div>
                                    <div style={{ position: 'absolute', bottom: '10px', left: '-20px', fontSize: '0.65rem', color: '#a3abbb' }}>paved {pavedPct}%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default CoolScope;
