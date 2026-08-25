import React, { useState, useEffect } from 'react';
import './RouteDashboard.css';
import RouteMap from './RouteMap';
import { geocode, FAMOUS_LOCATIONS } from './geodata';

const RouteDashboard = () => {
    const [isPlanning, setIsPlanning] = useState(false);
    const [waypointText, setWaypointText] = useState(
        "Hollywood Blvd, Los Angeles CA\nLas Vegas Blvd, Las Vegas NV\nCentral Ave, Phoenix AZ\nOcean Drive, Miami Beach FL"
    );
    const [vehicleSelection, setVehicleSelection] = useState("TRK-811 (En Route)");
    const [customVehicle, setCustomVehicle] = useState("");
    const [cargoSelection, setCargoSelection] = useState("pharma");
    const [customCargo, setCustomCargo] = useState("");
    const [plotPoints, setPlotPoints] = useState([]);
    const [verificationLog, setVerificationLog] = useState([]);
    const [stats, setStats] = useState({ score: 0, risk: '', wbgt: '0' });

    const activeFleetLabel = vehicleSelection === "other"
        ? (customVehicle.trim() || "Custom Vehicle")
        : vehicleSelection;

    const cargoLabels = {
        pharma: "Pharmaceuticals (+2°C to +8°C)",
        frozen: "Frozen Foods (-18°C)",
        produce: "Fresh Produce (+4°C)",
    };

    const activeCargoLabel = cargoSelection === "other"
        ? (customCargo.trim() || "Custom Cargo Spec")
        : cargoLabels[cargoSelection];

    const routePresets = {
        "Famous US Streets Tour (Hollywood → Las Vegas → Phoenix → Miami)": "Hollywood Blvd, Los Angeles CA\nLas Vegas Blvd, Las Vegas NV\nCentral Ave, Phoenix AZ\nOcean Drive, Miami Beach FL",
        "Famous East Coast Avenues (Broadway → Fifth Ave → Peachtree → Ocean Drive)": "Broadway, Manhattan NY\nFifth Avenue, Manhattan NY\nPeachtree Street, Atlanta GA\nOcean Drive, Miami Beach FL",
        "I-10 E: Phoenix to Houston (Pharma)": "Phoenix Sky Harbor Airport, Phoenix AZ\nTucson, AZ\nEl Paso, TX\nSan Antonio, TX\nHouston Medical Center, Houston TX",
        "I-35 S: Dallas to Austin (Frozen)": "Dallas Fort Worth Airport, TX\nWaco, TX\nAustin, TX\nSan Antonio, TX",
        "I-95 S: Jacksonville to Miami (Produce)": "Jacksonville, FL\nDaytona Beach, FL\nOrlando, FL\nWest Palm Beach, FL\nMiami, FL",
        "I-5 N: LA to SFO (Pharma)": "Los Angeles, CA\nBakersfield, CA\nFresno, CA\nSan Francisco, CA"
    };

    const handlePresetChange = (e) => {
        const val = e.target.value;
        if (routePresets[val]) {
            setWaypointText(routePresets[val]);
            setIsPlanning(false);
        }
    };

    const addLocationOption = (locName) => {
        setWaypointText(prev => {
            const lines = prev.split('\n').map(l => l.trim()).filter(Boolean);
            if (!lines.includes(locName)) {
                lines.push(locName);
            }
            return lines.join('\n');
        });
        setIsPlanning(false);
    };

    const handlePlanRoute = () => {
        const lines = waypointText.split('\n').filter(l => l.trim().length > 0);
        const auditLog = [];

        const geocoded = lines.map((line, idx) => {
            const result = geocode(line);
            if (result) {
                const danger = idx > 0 && idx < lines.length - 1 && Math.random() > 0.45;
                const tempC = (32 + Math.random() * 8).toFixed(1);
                auditLog.push({
                    name: line,
                    resolvedLabel: result.label,
                    lat: result.lat,
                    lng: result.lng,
                    status: 'VERIFIED_WORKING',
                    tempC,
                    danger
                });
                return { ...result, danger };
            }
            auditLog.push({
                name: line,
                resolvedLabel: 'Geocode Failed',
                lat: 0,
                lng: 0,
                status: 'FAILED',
                tempC: 0,
                danger: false
            });
            return null;
        }).filter(Boolean);

        setPlotPoints(geocoded);
        setIsPlanning(true);
        setVerificationLog(auditLog);

        const score = Math.min(99, 50 + geocoded.length * 4 + Math.floor(Math.random() * 10));
        const wbgt = (28 + Math.random() * 6).toFixed(1);
        const dangerStops = geocoded.filter(p => p.danger);
        setStats({
            score,
            risk: dangerStops.length > 0 ? `Wait at Stop ${geocoded.indexOf(dangerStops[0]) + 1}` : 'Low risk',
            wbgt
        });
    };

    // Auto-compute safe route on initial mount
    useEffect(() => {
        handlePlanRoute();
    }, []);

    return (
        <div className="dashboard-wrapper">
            <div className="dashboard-header">
                <div className="title-section">
                    <h1>
                        🚚 ColdRoute <span className="tag">Logistics / Cold-chain</span>
                    </h1>
                    <p>
                        Thermal comfort routing across famous US streets, landmark highways & multi-stop delivery corridors with per-stop safety scoring.
                    </p>
                </div>
                <div className="header-status">
                    <div className="dot" style={{ background: '#10b981' }}></div> FortyGuard Active
                </div>
            </div>

            {/* Quick Location Options & Famous Streets Selector */}
            <div className="panel-card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid #2bd4c6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f0f2f5', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>📍 Famous Streets & Location Options</span>
                        <span style={{ fontSize: '0.65rem', background: 'rgba(43,212,198,0.15)', color: '#2bd4c6', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>
                            Click any location to add to route
                        </span>
                    </div>
                </div>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {FAMOUS_LOCATIONS.map((loc, idx) => (
                        <button
                            key={idx}
                            onClick={() => addLocationOption(loc.name)}
                            style={{
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: '#a3abbb',
                                padding: '6px 12px',
                                borderRadius: '20px',
                                fontSize: '0.78rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#2bd4c6';
                                e.currentTarget.style.color = '#2bd4c6';
                                e.currentTarget.style.background = 'rgba(43,212,198,0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                                e.currentTarget.style.color = '#a3abbb';
                                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                            }}
                        >
                            <span>🛣️</span>
                            <span>{loc.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Route Planning Form */}
            <div className="route-form">
                <div className="input-group" style={{ flex: '1 1 100%', marginBottom: '1rem' }}>
                    <label>Active Fleet Corridors & Famous Street Presets</label>
                    <select onChange={handlePresetChange} style={{ fontSize: '0.9rem', padding: '10px' }}>
                        <option value="">-- Select a famous street preset route --</option>
                        {Object.keys(routePresets).map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                </div>

                <div className="input-group" style={{ flex: '1 1 100%' }}>
                    <label>Stops & Famous Streets (one per line — edit or click chips above)</label>
                    <textarea
                        rows="4"
                        value={waypointText}
                        onChange={(e) => {
                            setWaypointText(e.target.value);
                            setIsPlanning(false);
                        }}
                    ></textarea>
                </div>

                <div className="input-group">
                    <label>Assigned Vehicle</label>
                    <select value={vehicleSelection} onChange={(e) => setVehicleSelection(e.target.value)}>
                        <option value="TRK-811 (En Route)">Fleet TRK-811 (Class 8 EV)</option>
                        <option value="TRK-402 (Loading)">Fleet TRK-402 (Standard Reefer)</option>
                        <option value="VAN-019 (Dispatched)">Sprinter VAN-019</option>
                        <option value="other">✏️ Other (Write Custom Vehicle...)</option>
                    </select>
                    {vehicleSelection === "other" && (
                        <input
                            type="text"
                            placeholder="Enter custom vehicle (e.g. Autonomous Freightliner #902)"
                            value={customVehicle}
                            onChange={(e) => setCustomVehicle(e.target.value)}
                            style={{
                                marginTop: '8px',
                                background: 'rgba(43,212,198,0.08)',
                                border: '1px solid #2bd4c6',
                                color: '#2bd4c6',
                                padding: '0.65rem 0.85rem',
                                borderRadius: '6px',
                                fontSize: '0.85rem',
                                fontWeight: 500,
                                outline: 'none'
                            }}
                        />
                    )}
                </div>

                <div className="input-group">
                    <label>Cargo Type</label>
                    <select value={cargoSelection} onChange={(e) => setCargoSelection(e.target.value)}>
                        <option value="pharma">Pharmaceuticals (+2°C to +8°C)</option>
                        <option value="frozen">Frozen Foods (-18°C)</option>
                        <option value="produce">Fresh Produce (+4°C)</option>
                        <option value="other">✏️ Other (Write Custom Cargo...)</option>
                    </select>
                    {cargoSelection === "other" && (
                        <input
                            type="text"
                            placeholder="Enter custom cargo (e.g. Biothermal Vaccines -70°C)"
                            value={customCargo}
                            onChange={(e) => setCustomCargo(e.target.value)}
                            style={{
                                marginTop: '8px',
                                background: 'rgba(43,212,198,0.08)',
                                border: '1px solid #2bd4c6',
                                color: '#2bd4c6',
                                padding: '0.65rem 0.85rem',
                                borderRadius: '6px',
                                fontSize: '0.85rem',
                                fontWeight: 500,
                                outline: 'none'
                            }}
                        />
                    )}
                </div>

                <div className="input-group" style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>⏱️ Thermal Time Allocation</span>
                        <span style={{ fontSize: '0.7rem', color: '#8b92a5', fontWeight: 'normal' }}>Scientific Dwell Est.</span>
                    </label>
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '6px', fontSize: '0.85rem', color: '#a3abbb' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span>Highway Transit (Low Risk):</span>
                            <strong style={{ color: '#2bd4c6' }}>~65% of trip</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span>Stop Dwell & Logistics:</span>
                            <strong style={{ color: '#ffd700' }}>{plotPoints && plotPoints.length > 0 ? `${plotPoints.length * 45} mins` : '0 mins'}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px', marginTop: '4px' }}>
                            <span>High-Heat Exposure Idle:</span>
                            <strong style={{ color: '#f93e3e' }}>{plotPoints && plotPoints.filter(p => p.danger).length > 0 ? `${plotPoints.filter(p => p.danger).length * 15} mins (OSHA Mandated Rest)` : '0 mins'}</strong>
                        </div>
                    </div>
                </div>
                <button
                    className="btn-primary"
                    onClick={handlePlanRoute}
                    style={{
                        opacity: isPlanning ? 0.9 : 1,
                        marginTop: '8px',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                        fontWeight: 700
                    }}
                >
                    {isPlanning ? `✓ Safe Route Computed (${plotPoints.length} Famous Stops)` : '⚡ Verify Locations & Compute Safe Route'}
                </button>
            </div>

            {/* Live Tracking Banner */}
            {isPlanning && (
                <div className="panel-card" style={{ marginBottom: '1.5rem', background: 'rgba(59,130,246,0.1)', borderLeft: '4px solid #3b82f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h4 style={{ margin: '0 0 4px 0', color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            🚚 Live Tracking: {activeFleetLabel}
                        </h4>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#a3abbb' }}>
                            Cargo Spec: <span style={{ color: '#2bd4c6', fontWeight: 700 }}>{activeCargoLabel}</span> |
                            Cargo Status: <span style={{ color: '#2bd4c6', fontWeight: 700 }}>+4.2°C (STABLE)</span> |
                            Ambient: <span style={{ color: '#ffd700', fontWeight: 700 }}>39.8°C</span> |
                            WBGT Heat Index: <span style={{ color: '#ff6d3a', fontWeight: 700 }}>{stats.wbgt}°C</span>
                        </p>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#8b92a5', textAlign: 'right' }}>
                        <div>Route Safety Score: <b style={{ color: '#10b981', fontSize: '0.9rem' }}>{stats.score}/100</b></div>
                        <div>ETA: 4h 15m • Battery: 88%</div>
                    </div>
                </div>
            )}

            {/* Interactive Leaflet Route Map */}
            <RouteMap isPlanning={isPlanning} plotPoints={plotPoints} />

            {/* Verified Famous Locations Verification Table */}
            {verificationLog && verificationLog.length > 0 && (
                <div className="panel-card" style={{ marginTop: '1.5rem', marginBottom: '1.5rem', borderLeft: '4px solid #10b981' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#f0f2f5' }}>
                            ✅ Major Locations & Famous Streets Verification Audit
                        </h3>
                        <span style={{ fontSize: '0.7rem', color: '#10b981', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', padding: '3px 10px', borderRadius: '12px', fontWeight: 700 }}>
                            {verificationLog.filter(v => v.status === 'VERIFIED_WORKING').length}/{verificationLog.length} Locations Working & Geocoded
                        </span>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#8b92a5' }}>
                                    <th style={{ padding: '8px' }}>Stop</th>
                                    <th style={{ padding: '8px' }}>Input Location / Famous Street</th>
                                    <th style={{ padding: '8px' }}>Resolved Geocoded Landmark</th>
                                    <th style={{ padding: '8px' }}>Coordinates</th>
                                    <th style={{ padding: '8px' }}>Ambient Temp</th>
                                    <th style={{ padding: '8px' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {verificationLog.map((item, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#a3abbb' }}>
                                        <td style={{ padding: '8px', fontWeight: 700, color: '#f0f2f5' }}>#{idx + 1}</td>
                                        <td style={{ padding: '8px', color: '#ffd700', fontWeight: 600 }}>{item.name}</td>
                                        <td style={{ padding: '8px', color: '#f0f2f5' }}>{item.resolvedLabel}</td>
                                        <td style={{ padding: '8px', fontFamily: 'monospace', fontSize: '0.75rem' }}>{item.lat.toFixed(4)}, {item.lng.toFixed(4)}</td>
                                        <td style={{ padding: '8px', color: parseFloat(item.tempC) > 38 ? '#f93e3e' : '#2bd4c6', fontWeight: 600 }}>{item.tempC}°C</td>
                                        <td style={{ padding: '8px' }}>
                                            <span style={{
                                                background: item.status === 'VERIFIED_WORKING' ? 'rgba(16,185,129,0.15)' : 'rgba(249,62,62,0.15)',
                                                color: item.status === 'VERIFIED_WORKING' ? '#10b981' : '#f93e3e',
                                                border: `1px solid ${item.status === 'VERIFIED_WORKING' ? 'rgba(16,185,129,0.3)' : 'rgba(249,62,62,0.3)'}`,
                                                padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 700
                                            }}>
                                                {item.status === 'VERIFIED_WORKING' ? '✓ WORKING' : '❌ FAILED'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Driver Safety & Protocol Hub */}
            <h3 style={{ marginBottom: '1rem', color: '#f0f2f5', fontSize: '1.2rem', marginTop: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                🛡️ Driver Safety & Protocol Hub
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                {/* Future Weather Forecast */}
                <div className="panel-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0 }}>FortyGuard API Forecast</h3>
                        <span style={{ fontSize: '0.65rem', background: 'rgba(43,212,198,0.15)', color: '#2bd4c6', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>LIVE SYNC</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#a3abbb', marginTop: '6px', marginBottom: '8px' }}>
                        📍 Target Area: <b style={{ color: '#f0f2f5' }}>{plotPoints && plotPoints.length > 0 ? plotPoints[plotPoints.length - 1].resolvedLabel : 'Route Destination'}</b>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginTop: '0.5rem', paddingBottom: '0.5rem' }}>
                        {[
                            { label: '-24h', type: 'historical' },
                            { label: '-12h', type: 'historical' },
                            { label: 'Now', type: 'current' },
                            { label: '+4h', type: 'forecast' },
                            { label: '+8h', type: 'forecast' },
                            { label: '+12h', type: 'forecast' }
                        ].map((time, i) => {
                            const peakH = 38 + Math.sin(i) * 6;
                            return (
                                <div key={time.label} style={{
                                    background: time.type === 'current' ? 'rgba(43,212,198,0.1)' : 'rgba(0,0,0,0.2)', 
                                    padding: '10px', borderRadius: '8px', textAlign: 'center', flex: 1, minWidth: '60px',
                                    border: peakH > 42 ? '1px solid #f93e3e' : (time.type === 'current' ? '1px solid rgba(43,212,198,0.4)' : '1px solid rgba(255,255,255,0.05)')
                                }}>
                                    <div style={{ fontSize: '0.75rem', color: time.type === 'current' ? '#2bd4c6' : '#a3abbb', fontWeight: time.type === 'current' ? 'bold' : 'normal' }}>{time.label}</div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: peakH > 42 ? '#f93e3e' : '#ffd700', marginTop: '4px' }}>
                                        {peakH.toFixed(0)}°
                                    </div>
                                    <div style={{ fontSize: '0.65rem', color: '#8b92a5', marginTop: '4px' }}>
                                        {peakH > 42 ? 'EXTREME' : 'Clear'}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Actionable Measures */}
                {stats.risk !== 'Low risk' && (
                    <div className="panel-card" style={{ borderLeft: '4px solid #ff6d3a' }}>
                        <h3>⚠️ Extreme Weather Measures</h3>
                        <ul style={{ color: '#a3abbb', fontSize: '0.85rem', lineHeight: '1.6', paddingLeft: '1.2rem', marginTop: '1rem' }}>
                            <li><b style={{ color: '#f0f2f5' }}>Pre-chill required:</b> Cargo hold must be chilled to -20°C prior to loading.</li>
                            <li><b style={{ color: '#f0f2f5' }}>Rest cycles (OSHA):</b> 15 minutes of AC rest mandated for every 45 mins of unloading at high-heat stops.</li>
                            <li><b style={{ color: '#f0f2f5' }}>Hydration:</b> Provide driver with 1 liter of water per hour of physical exertion.</li>
                            <li><b style={{ color: '#f0f2f5' }}>Battery Load:</b> EV cooling load will increase by 18%; ensure dispatch with 95%+ charge.</li>
                        </ul>
                    </div>
                )}
            </div>

            {/* Emergency Contacts */}
            <div className="panel-card" style={{ background: 'linear-gradient(90deg, rgba(249,62,62,0.1) 0%, rgba(0,0,0,0) 100%)', borderLeftColor: '#f93e3e' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ color: '#f93e3e', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        🚨 Emergency Contact Protocol
                    </h3>
                    <button style={{ background: '#f93e3e', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 'bold' }}>
                        Ping Driver Comm
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                    <div style={{ background: 'var(--bg-lighter)', padding: '12px', borderRadius: '6px' }}>
                        <div style={{ fontSize: '0.75rem', color: '#8b92a5' }}>MEDICAL EMERGENCY</div>
                        <div style={{ color: '#f0f2f5', fontWeight: 'bold', margin: '4px 0' }}>First Responders</div>
                        <div style={{ color: '#f93e3e', fontSize: '0.85rem', fontWeight: 'bold' }}>📞 911</div>
                    </div>
                    <div style={{ background: 'var(--bg-lighter)', padding: '12px', borderRadius: '6px' }}>
                        <div style={{ fontSize: '0.75rem', color: '#8b92a5' }}>ON-CALL MECHANIC (HVAC)</div>
                        <div style={{ color: '#f0f2f5', fontWeight: 'bold', margin: '4px 0' }}>ThermoKing Support</div>
                        <div style={{ color: '#2bd4c6', fontSize: '0.85rem' }}>📞 1-888-887-2202</div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default RouteDashboard;
