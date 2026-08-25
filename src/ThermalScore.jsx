import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import './RouteDashboard.css';

const ChangeMapView = ({ center, zoom }) => {
    const map = useMap();
    map.setView(center, zoom);
    return null;
};

const presetPortfolios = {
    "Phoenix Metro Residential": [
        { address: "2901 N Central Ave, Phoenix", type: "Multi-family", sqft: 245000, yearBuilt: 2004, value: 18500000, lat: 33.479, lng: -112.074 },
        { address: "4502 E Indian School Rd, Phoenix", type: "Condo Complex", sqft: 182000, yearBuilt: 2012, value: 14200000, lat: 33.495, lng: -111.983 },
        { address: "1300 N 12th St, Phoenix", type: "Apartment Tower", sqft: 310000, yearBuilt: 1998, value: 22100000, lat: 33.463, lng: -112.056 },
        { address: "5620 W Thunderbird Rd, Glendale", type: "Townhomes", sqft: 95000, yearBuilt: 2016, value: 7800000, lat: 33.611, lng: -112.181 },
        { address: "7340 E McDowell Rd, Scottsdale", type: "SFH Portfolio", sqft: 420000, yearBuilt: 2008, value: 35600000, lat: 33.466, lng: -111.921 },
    ],
    "Texas Commercial Portfolio": [
        { address: "500 Commerce St, Dallas", type: "Office Tower", sqft: 680000, yearBuilt: 2001, value: 95000000, lat: 32.778, lng: -96.804 },
        { address: "1200 McKinney St, Houston", type: "Class A Office", sqft: 520000, yearBuilt: 2010, value: 78000000, lat: 29.756, lng: -95.363 },
        { address: "600 Congress Ave, Austin", type: "Mixed Use", sqft: 340000, yearBuilt: 2018, value: 52000000, lat: 30.268, lng: -97.743 },
        { address: "300 Main Plaza, San Antonio", type: "Retail Complex", sqft: 180000, yearBuilt: 2005, value: 28000000, lat: 29.424, lng: -98.493 },
    ],
    "National Industrial": [
        { address: "Amazon PHX6, Phoenix", type: "Warehouse", sqft: 820000, yearBuilt: 2020, value: 65000000, lat: 33.435, lng: -112.133 },
        { address: "FedEx World Hub, Memphis", type: "Logistics Hub", sqft: 1200000, yearBuilt: 2015, value: 120000000, lat: 35.045, lng: -89.977 },
        { address: "UPS Worldport, Louisville", type: "Air Hub", sqft: 2600000, yearBuilt: 2012, value: 280000000, lat: 38.174, lng: -85.733 },
        { address: "Port of Long Beach, CA", type: "Port Facility", sqft: 950000, yearBuilt: 1998, value: 150000000, lat: 33.754, lng: -118.216 },
    ],
    "Custom (Enter manually)": []
};

const ThermalScore = () => {
    const [portfolioKey, setPortfolioKey] = useState("Phoenix Metro Residential");
    const [properties, setProperties] = useState(presetPortfolios["Phoenix Metro Residential"]);
    const [thresholdTemp, setThresholdTemp] = useState(42);
    const [consecutiveDays, setConsecutiveDays] = useState(3);
    const [coverageLevel, setCoverageLevel] = useState("standard");
    const [simulatedPeak, setSimulatedPeak] = useState(44);
    const [analysisRun, setAnalysisRun] = useState(false);
    const [customText, setCustomText] = useState("");

    // Manual entry fields
    const [newAddr, setNewAddr] = useState("");
    const [newType, setNewType] = useState("Multi-family");
    const [newSqft, setNewSqft] = useState("");
    const [newValue, setNewValue] = useState("");

    useEffect(() => {
        if (portfolioKey !== "Custom (Enter manually)") {
            setProperties(presetPortfolios[portfolioKey]);
        }
        setAnalysisRun(false);
    }, [portfolioKey]);

    // Computed analytics
    const totalValue = properties.reduce((s, p) => s + p.value, 0);
    const totalSqft = properties.reduce((s, p) => s + p.sqft, 0);
    const exceedance = Math.max(0, simulatedPeak - thresholdTemp);
    const daysOverThreshold = exceedance > 0 ? Math.min(14, consecutiveDays + Math.floor(exceedance * 0.8)) : 0;
    const triggerMet = daysOverThreshold >= consecutiveDays;

    const damageMultiplier = triggerMet ? 1 + (exceedance * 0.02) : 1;
    const premiumEstimate = (totalValue * 0.0018 * damageMultiplier).toFixed(0);
    const payoutEstimate = triggerMet ? (totalValue * 0.005 * exceedance / 10).toFixed(0) : 0;

    const avgAge = properties.length > 0 ? (new Date().getFullYear() - properties.reduce((s, p) => s + p.yearBuilt, 0) / properties.length).toFixed(0) : 0;
    const depreciationRisk = simulatedPeak > 45 ? 'High' : simulatedPeak > 40 ? 'Moderate' : 'Low';
    const depreciationColor = simulatedPeak > 45 ? '#f93e3e' : simulatedPeak > 40 ? '#ffd700' : '#2bd4c6';

    // Street-level heat index and parametric trigger determination
    const distribution = properties.map(p => {
        const baseScore = 50 + (new Date().getFullYear() - p.yearBuilt) * 0.5 + (simulatedPeak - 35) * 3;
        const score = Math.min(100, Math.max(10, Math.floor(baseScore)));
        const streetTemp = Number((simulatedPeak + (score - 50) * 0.08).toFixed(1));

        let triggerTier = 'Clear';
        let tierColor = '#2bd4c6';

        if (streetTemp >= thresholdTemp + 5 && daysOverThreshold >= consecutiveDays + 2) {
            triggerTier = '💀 Tier 3 (Catastrophic)';
            tierColor = '#f93e3e';
        } else if (streetTemp >= thresholdTemp && daysOverThreshold >= consecutiveDays) {
            triggerTier = '🔥 Tier 2 (Payout)';
            tierColor = '#ff6d3a';
        } else if (streetTemp >= thresholdTemp && daysOverThreshold >= 1) {
            triggerTier = '⚡ Tier 1 (Advisory)';
            tierColor = '#ffd700';
        }

        return { ...p, score, streetTemp, triggerTier, tierColor };
    });

    const tier1Count = distribution.filter(d => d.triggerTier.includes('Tier 1')).length;
    const tier2Count = distribution.filter(d => d.triggerTier.includes('Tier 2')).length;
    const tier3Count = distribution.filter(d => d.triggerTier.includes('Tier 3')).length;

    const handleAddProperty = async () => {
        if (newAddr.trim()) {
            let lat = 33.45; // Default fallback
            let lng = -112.07;
            try {
                // Fetch coordinates using OpenStreetMap Nominatim
                const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(newAddr)}`);
                const data = await res.json();
                if (data && data.length > 0) {
                    lat = parseFloat(data[0].lat);
                    lng = parseFloat(data[0].lon);
                }
            } catch (e) {
                console.error("Geocoding failed:", e);
            }

            setProperties(prev => [...prev, {
                address: newAddr,
                type: newType,
                sqft: parseInt(newSqft) || 100000,
                yearBuilt: 2015,
                value: parseInt(newValue) || 5000000,
                lat,
                lng
            }]);
            setNewAddr(""); setNewSqft(""); setNewValue("");
        }
    };

    const handleRemoveProperty = (idx) => {
        setProperties(prev => prev.filter((_, i) => i !== idx));
    };

    console.log("ThermalScore Metrics Data:", {
        triggerMet,
        daysOverThreshold,
        thresholdTemp,
        premiumEstimate,
        coverageLevel,
        payoutEstimate,
        depreciationRisk,
        simulatedPeak,
        totalValue
    });

    return (
        <div className="dashboard-wrapper">
            <div className="dashboard-header">
                <div className="title-section">
                    <h1>🏠 ThermalScore <span className="tag">Insurance / Real-estate</span></h1>
                    <p>Property-level parametric heat insurance — upload your portfolio, configure triggers, and simulate heat-wave payout scenarios.</p>
                </div>
                <div className="header-status">
                    <div className="dot" style={{ background: '#ffd700' }}></div> FortyGuard API
                </div>
            </div>

            {/* STEP 1: Upload / Select Portfolio */}
            <div className="panel-card" style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3>📁 Step 1 — Select or Upload Property Portfolio</h3>
                    <span style={{ fontSize: '0.75rem', color: '#8b92a5' }}>{properties.length} properties | ${(totalValue / 1e6).toFixed(1)}M total</span>
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    <div className="input-group" style={{ flex: '1 1 220px' }}>
                        <label>Portfolio Preset</label>
                        <select value={portfolioKey} onChange={e => setPortfolioKey(e.target.value)}>
                            {Object.keys(presetPortfolios).map(k => <option key={k} value={k}>{k}</option>)}
                        </select>
                    </div>
                    <div className="input-group" style={{ flex: '1 1 280px' }}>
                        <label>Or paste CSV data (address, type, sqft, value)</label>
                        <textarea
                            rows="2"
                            placeholder="e.g. 123 Main St Phoenix, Multi-family, 200000, 15000000"
                            value={customText}
                            onChange={e => setCustomText(e.target.value)}
                            style={{ fontSize: '0.8rem' }}
                        ></textarea>
                    </div>
                    <button
                        className="btn-primary"
                        style={{ alignSelf: 'flex-end', fontSize: '0.8rem' }}
                        onClick={() => {
                            if (customText.trim()) {
                                const lines = customText.split('\n').filter(l => l.trim());
                                const parsed = lines.map(l => {
                                    const parts = l.split(',').map(p => p.trim());
                                    return {
                                        address: parts[0] || 'Unknown',
                                        type: parts[1] || 'Other',
                                        sqft: parseInt(parts[2]) || 100000,
                                        yearBuilt: 2015,
                                        value: parseInt(parts[3]) || 5000000
                                    };
                                });
                                setProperties(prev => [...prev, ...parsed]);
                                setCustomText("");
                                setPortfolioKey("Custom (Enter manually)");
                            }
                        }}
                    >Import CSV</button>
                </div>

                {/* Manual Add */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <div className="input-group" style={{ flex: '2 1 180px' }}>
                        <label>Address</label>
                        <input type="text" placeholder="e.g. 500 Commerce St, Dallas" value={newAddr} onChange={e => setNewAddr(e.target.value)} />
                    </div>
                    <div className="input-group" style={{ flex: '1 1 120px' }}>
                        <label>Type</label>
                        <select value={newType} onChange={e => setNewType(e.target.value)}>
                            <option>Multi-family</option><option>Condo Complex</option><option>Office Tower</option>
                            <option>Warehouse</option><option>Retail</option><option>SFH Portfolio</option><option>Mixed Use</option>
                        </select>
                    </div>
                    <div className="input-group" style={{ flex: '1 1 100px' }}>
                        <label>Sq. Ft</label>
                        <input type="number" placeholder="200000" value={newSqft} onChange={e => setNewSqft(e.target.value)} />
                    </div>
                    <div className="input-group" style={{ flex: '1 1 110px' }}>
                        <label>Insured Value ($)</label>
                        <input type="number" placeholder="15000000" value={newValue} onChange={e => setNewValue(e.target.value)} />
                    </div>
                    <button className="btn-primary" style={{ fontSize: '0.8rem' }} onClick={handleAddProperty}>+ Add</button>
                </div>

                {/* Property Table and Map */}
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', height: '280px' }}>
                    {properties.length > 0 && (
                        <div style={{ flex: 1, overflowY: 'auto' }}>
                            <table style={{ width: '100%', fontSize: '0.78rem', color: '#f0f2f5', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <th style={{ textAlign: 'left', padding: '0.4rem', color: '#8b92a5', fontWeight: 500 }}>Address</th>
                                        <th style={{ textAlign: 'left', padding: '0.4rem', color: '#8b92a5', fontWeight: 500 }}>Type</th>
                                        <th style={{ textAlign: 'right', padding: '0.4rem', color: '#8b92a5', fontWeight: 500 }}>Sq.Ft</th>
                                        <th style={{ textAlign: 'right', padding: '0.4rem', color: '#8b92a5', fontWeight: 500 }}>Value</th>
                                        <th style={{ textAlign: 'center', padding: '0.4rem', color: '#8b92a5', fontWeight: 500 }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {properties.map((p, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                            <td style={{ padding: '0.4rem' }}>{p.address}</td>
                                            <td style={{ padding: '0.4rem', color: '#a3abbb' }}>{p.type}</td>
                                            <td style={{ padding: '0.4rem', textAlign: 'right' }}>{(p.sqft).toLocaleString()}</td>
                                            <td style={{ padding: '0.4rem', textAlign: 'right', color: '#2bd4c6' }}>${(p.value / 1e6).toFixed(1)}M</td>
                                            <td style={{ padding: '0.4rem', textAlign: 'center' }}>
                                                <button onClick={() => handleRemoveProperty(i)} style={{ background: 'none', border: 'none', color: '#f93e3e', cursor: 'pointer', fontSize: '0.9rem' }}>✕</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    <div style={{ flex: 1, borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                        {properties.length > 0 ? (
                            <MapContainer center={[properties[0].lat || 33.45, properties[0].lng || -112.07]} zoom={4} style={{ height: '100%', width: '100%', background: '#0a0a0a' }}>
                                <TileLayer
                                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                    attribution='&copy; CARTO'
                                />
                                <ChangeMapView center={[properties[properties.length-1].lat || 33.45, properties[properties.length-1].lng || -112.07]} zoom={properties.length === 1 ? 12 : (portfolioKey === 'National Industrial' ? 4 : 9)} />
                                {distribution.map((p, i) => {
                                    return (
                                        <CircleMarker key={i} center={[p.lat || 33.45, p.lng || -112.07]} radius={10} pathOptions={{ color: p.tierColor, fillColor: p.tierColor, fillOpacity: 0.6 }}>
                                            <Popup>
                                                <b>{p.address}</b><br/>
                                                Street Temp: <b>{p.streetTemp}°C</b><br/>
                                                Heat Score: {p.score}/100<br/>
                                                Trigger: <span style={{ color: p.tierColor, fontWeight: 'bold' }}>{p.triggerTier}</span><br/>
                                                Value: ${(p.value / 1e6).toFixed(1)}M
                                            </Popup>
                                        </CircleMarker>
                                    )
                                })}
                            </MapContainer>
                        ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b92a5', fontSize: '0.8rem' }}>
                                No properties to map.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* STEP 2: Configure Thresholds */}
            <div className="panel-card" style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h3>⚙️ Step 2 — Configure Parametric Trigger Thresholds</h3>
                        <p style={{ fontSize: '0.8rem', color: '#8b92a5', margin: '0.5rem 0 1.5rem' }}>
                            Set the temperature threshold and consecutive-day requirement. When FortyGuard detects conditions exceeding these limits, the policy pays out automatically — no adjuster needed.
                        </p>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.7rem', color: '#a3abbb', width: '280px' }}>
                        <div style={{ color: '#f0f2f5', fontWeight: 'bold', marginBottom: '4px' }}>Pricing & Valuation Engine</div>
                        Property values default to estimated commercial replacement costs. Base premium is calculated at an industry-standard <b style={{color: '#2bd4c6'}}>0.18%</b> of total insured value, scaled by the chosen tier and historical heat risk modifier.
                    </div>
                </div>

                <div className="coolscope-inputs" style={{ marginBottom: '1.5rem' }}>
                    <div className="slider-group">
                        <label>
                            <span>🌡️ Temperature Trigger Threshold</span>
                            <span>{thresholdTemp}°C ({(thresholdTemp * 9 / 5 + 32).toFixed(0)}°F)</span>
                        </label>
                        <input type="range" min="35" max="50" value={thresholdTemp} onChange={e => setThresholdTemp(Number(e.target.value))} />
                    </div>
                    <div className="slider-group">
                        <label>
                            <span>📅 Consecutive Days Required</span>
                            <span>{consecutiveDays} days</span>
                        </label>
                        <input type="range" min="1" max="7" value={consecutiveDays} onChange={e => setConsecutiveDays(Number(e.target.value))} />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <div className="input-group" style={{ flex: 1 }}>
                            <label>Coverage Level</label>
                            <select value={coverageLevel} onChange={e => setCoverageLevel(e.target.value)}>
                                <option value="basic">Basic (HVAC failure only)</option>
                                <option value="standard">Standard (HVAC + structural)</option>
                                <option value="premium">Premium (Full replacement cost)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div style={{ background: 'linear-gradient(135deg, rgba(43,212,198,0.06) 0%, rgba(0,0,0,0) 100%)', border: '1px solid rgba(43,212,198,0.2)', padding: '0.8rem 1rem', borderRadius: '8px', marginTop: '1rem', fontSize: '0.75rem', color: '#a3abbb' }}>
                    <b style={{ color: '#2bd4c6', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        💡 Why is the Policyholder Authorized to Customize These Triggers?
                    </b>
                    Parametric insurance operates as an objective smart contract. Different assets (e.g. Phoenix warehouses vs. Seattle offices) have unique thermal vulnerabilities. Setting a lower temperature or shorter duration increases payout probability but raises annual premiums, whereas higher thresholds provide low-cost catastrophic protection. Granting trigger authority enables tailored risk transfer without claims adjusters.
                </div>
            </div>

            {/* STEP 3: Simulate */}
            <div className="panel-card" style={{ marginBottom: '1.5rem' }}>
                <h3>🔬 Step 3 — Simulate Heat-Wave Scenario</h3>
                <p style={{ fontSize: '0.8rem', color: '#8b92a5', marginBottom: '1rem' }}>
                    Drag the simulated peak temperature to see how your portfolio responds. This determines if your parametric triggers fire and calculates estimated payout.
                </p>
                <div className="slider-group">
                    <label>
                        <span>☀️ Simulated Peak Temperature</span>
                        <span style={{ color: simulatedPeak > 45 ? '#f93e3e' : simulatedPeak > 40 ? '#ffd700' : '#2bd4c6' }}>
                            {simulatedPeak}°C ({(simulatedPeak * 9 / 5 + 32).toFixed(0)}°F)
                        </span>
                    </label>
                    <input type="range" min="30" max="55" value={simulatedPeak} onChange={e => setSimulatedPeak(Number(e.target.value))} />
                </div>
                <button
                    className="btn-primary"
                    style={{ marginTop: '1rem' }}
                    onClick={() => setAnalysisRun(true)}
                >
                    {analysisRun ? `Analysis Complete ✓ — ${properties.length} properties scored` : 'Run Thermal Analysis'}
                </button>
            </div>

            {/* Results */}
            <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                <div className="panel-card metric-card">
                    <div className="label">Trigger Status</div>
                    <div className="value" style={{ color: triggerMet ? '#f93e3e' : '#2bd4c6' }}>
                        {triggerMet ? 'TRIGGERED' : 'Safe'}
                    </div>
                    <div className="sub-value">{daysOverThreshold} days over {thresholdTemp}°C</div>
                </div>
                <div className="panel-card metric-card">
                    <div className="label">Annual Premium</div>
                    <div className="value" style={{ color: '#ffd700' }}>
                        ${Number(premiumEstimate).toLocaleString()}
                    </div>
                    <div className="sub-value">{coverageLevel} coverage</div>
                </div>
                <div className="panel-card metric-card">
                    <div className="label">Est. Payout</div>
                    <div className="value" style={{ color: triggerMet ? '#ff6d3a' : '#2bd4c6' }}>
                        {triggerMet ? `$${Number(payoutEstimate).toLocaleString()}` : '$0'}
                    </div>
                    <div className="sub-value">{triggerMet ? 'Auto-settlement' : 'No trigger'}</div>
                </div>
                <div className="panel-card metric-card">
                    <div className="label">Depreciation Risk</div>
                    <div className="value" style={{ color: depreciationColor }}>{depreciationRisk}</div>
                    <div className="sub-value">Avg portfolio age: {avgAge}yr</div>
                </div>
            </div>

            {/* Property-Level Scoring */}
            <div className="coolscope-grid-2" style={{ marginTop: '1.5rem' }}>
                <div className="panel-card">
                    <h3>Parametric Settlement Triggers</h3>
                    <p style={{ fontSize: '0.8rem', color: '#8b92a5', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
                        Triggered automatically when localized street-level temperatures exceed the contractual threshold for {consecutiveDays}+ consecutive days.
                    </p>

                    <table style={{ width: '100%', fontSize: '0.85rem', color: '#f0f2f5', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ textAlign: 'left', padding: '0.5rem', color: '#8b92a5' }}>Trigger Tier</th>
                                <th style={{ textAlign: 'left', padding: '0.5rem', color: '#8b92a5' }}>Condition</th>
                                <th style={{ textAlign: 'center', padding: '0.5rem', color: '#8b92a5' }}>Streets</th>
                                <th style={{ textAlign: 'center', padding: '0.5rem', color: '#8b92a5' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '0.5rem' }}>⚡ Tier 1 — Advisory</td>
                                <td style={{ padding: '0.5rem', color: '#a3abbb' }}>≥ {thresholdTemp}°C for 1+ day</td>
                                <td style={{ padding: '0.5rem', textAlign: 'center', fontWeight: 'bold', color: '#ffd700' }}>{tier1Count}</td>
                                <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                                    <span style={{ color: tier1Count > 0 ? '#ffd700' : '#2bd4c6', fontWeight: 600 }}>
                                        {tier1Count > 0 ? 'ACTIVE' : 'Clear'}
                                    </span>
                                </td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '0.5rem' }}>🔥 Tier 2 — Payout</td>
                                <td style={{ padding: '0.5rem', color: '#a3abbb' }}>≥ {thresholdTemp}°C for {consecutiveDays}+ days</td>
                                <td style={{ padding: '0.5rem', textAlign: 'center', fontWeight: 'bold', color: '#ff6d3a' }}>{tier2Count}</td>
                                <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                                    <span style={{ color: tier2Count > 0 ? '#f93e3e' : '#2bd4c6', fontWeight: 600 }}>
                                        {tier2Count > 0 ? 'TRIGGERED' : 'Clear'}
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td style={{ padding: '0.5rem' }}>💀 Tier 3 — Catastrophic</td>
                                <td style={{ padding: '0.5rem', color: '#a3abbb' }}>≥ {thresholdTemp + 5}°C for {consecutiveDays + 2}+ days</td>
                                <td style={{ padding: '0.5rem', textAlign: 'center', fontWeight: 'bold', color: '#f93e3e' }}>{tier3Count}</td>
                                <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                                    <span style={{ color: tier3Count > 0 ? '#f93e3e' : '#2bd4c6', fontWeight: 600 }}>
                                        {tier3Count > 0 ? 'TRIGGERED' : 'Clear'}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="panel-card">
                    <h3>Street-Level Parametric Trigger Status</h3>
                    <p style={{ fontSize: '0.8rem', color: '#8b92a5', marginBottom: '1.2rem' }}>
                        FortyGuard hyper-local street temperatures mapped against Tier 1, Tier 2, and Tier 3 parametric triggers.
                    </p>
                    {distribution.map((p, i) => {
                        return (
                            <div key={i} style={{ marginBottom: '0.75rem', background: 'rgba(0,0,0,0.2)', padding: '0.6rem 0.75rem', borderRadius: '6px', border: `1px solid ${p.tierColor}33` }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem' }}>
                                    <span style={{ color: '#f0f2f5', fontWeight: 600 }}>{p.address}</span>
                                    <span style={{ color: p.tierColor, fontWeight: 700, fontSize: '0.75rem', background: `${p.tierColor}18`, padding: '2px 8px', borderRadius: '4px', border: `1px solid ${p.tierColor}44` }}>
                                        {p.triggerTier}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#8b92a5', marginTop: '4px' }}>
                                    <span>Street Temp: <b style={{ color: '#ffd700' }}>{p.streetTemp}°C</b></span>
                                    <span>Heat Exposure: <b style={{ color: p.tierColor }}>{p.score}/100</b></span>
                                </div>
                                <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', marginTop: '4px' }}>
                                    <div style={{
                                        width: `${p.score}%`, height: '100%', borderRadius: '2px',
                                        background: p.tierColor, transition: 'width 0.4s ease'
                                    }}></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ThermalScore;
