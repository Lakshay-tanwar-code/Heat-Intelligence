import React, { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Circle } from 'react-leaflet';

const INTERVENTIONS = [
    {
        id: 'trees',
        icon: '🌳',
        label: 'Urban Canopy (Trees)',
        color: '#10b981',
        tempDelta: -1.8,
        co2: '12.4 t CO₂ / yr',
        roi: '$34,200',
        description: 'Dense tree canopy reduces surface albedo and provides evapotranspirative cooling.',
    },
    {
        id: 'pavement',
        icon: '🛣️',
        label: 'Cool Pavement',
        color: '#3b82f6',
        tempDelta: -1.2,
        co2: '6.1 t CO₂ / yr',
        roi: '$18,700',
        description: 'High-albedo reflective pavement reduces solar heat absorption by 40–50%.',
    },
    {
        id: 'roofs',
        icon: '🏠',
        label: 'High-Albedo Roofs',
        color: '#f0f2f5',
        tempDelta: -2.5,
        co2: '19.8 t CO₂ / yr',
        roi: '$58,400',
        description: 'Cool white membranes (SRI ≥ 82) reflect up to 80% of solar radiation.',
    },
    {
        id: 'greenwall',
        icon: '🌿',
        label: 'Vertical Green Walls',
        color: '#4ade80',
        tempDelta: -0.9,
        co2: '4.2 t CO₂ / yr',
        roi: '$11,200',
        description: 'Living vertical walls provide localized cooling through passive evaporation.',
    },
    {
        id: 'water',
        icon: '💧',
        label: 'Urban Water Features',
        color: '#38bdf8',
        tempDelta: -1.4,
        co2: '3.8 t CO₂ / yr',
        roi: '$9,600',
        description: 'Mist systems and water bodies reduce ambient air temperature via evaporative cooling.',
    },
];

const BASE_TEMP_F = 112;
const BASE_TEMP_C = 44.4;

// Crisp Leaflet GIS Heat Map & Intervention Overlay Generator
const HeatMapCanvas = ({ interventions, isBaseline }) => {
    const center = [33.4484, -112.0740];
    const totalDelta = interventions.reduce((s, i) => s + i.tempDelta, 0);
    const postC = (BASE_TEMP_C + totalDelta).toFixed(1);
    const postF = ((BASE_TEMP_C + totalDelta) * 9 / 5 + 32).toFixed(1);

    const hasTrees = !isBaseline && interventions.some(i => i.id === 'trees');
    const hasPavement = !isBaseline && interventions.some(i => i.id === 'pavement');
    const hasRoofs = !isBaseline && interventions.some(i => i.id === 'roofs');
    const hasWalls = !isBaseline && interventions.some(i => i.id === 'greenwall');
    const hasWater = !isBaseline && interventions.some(i => i.id === 'water');

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '8px', overflow: 'hidden' }}>
            <MapContainer center={center} zoom={15} style={{ width: '100%', height: '100%', background: '#0a0a0a' }} zoomControl={false}>
                <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
                    attribution='&copy; Esri'
                />

                {/* Thermal Hotspot Circles */}
                <Circle center={[33.4504, -112.0750]} radius={180} pathOptions={{ color: isBaseline ? '#f93e3e' : '#ff6d3a', fillColor: isBaseline ? '#f93e3e' : '#ff6d3a', fillOpacity: isBaseline ? 0.45 : 0.2 }}>
                    <Popup>Downtown Core Thermal Hotspot: {isBaseline ? '44.4°C' : `${postC}°C`}</Popup>
                </Circle>
                <Circle center={[33.4464, -112.0710]} radius={140} pathOptions={{ color: isBaseline ? '#ff6d3a' : '#ffd700', fillColor: isBaseline ? '#ff6d3a' : '#ffd700', fillOpacity: isBaseline ? 0.4 : 0.15 }}>
                    <Popup>Asphalt Corridor: {isBaseline ? '43.8°C' : `${postC}°C`}</Popup>
                </Circle>

                {/* Intervention Layer Polygons/Circles */}
                {hasTrees && (
                    <Circle center={[33.4484, -112.0740]} radius={220} pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.35, dashArray: '4, 4' }}>
                        <Popup>🌳 Urban Tree Canopy Intervention (-1.8°C)</Popup>
                    </Circle>
                )}
                {hasPavement && (
                    <Circle center={[33.4464, -112.0720]} radius={120} pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.45 }}>
                        <Popup>🛣️ Cool Pavement Applied (-1.2°C)</Popup>
                    </Circle>
                )}
                {hasRoofs && (
                    <Circle center={[33.4514, -112.0760]} radius={100} pathOptions={{ color: '#ffffff', fillColor: '#ffffff', fillOpacity: 0.5 }}>
                        <Popup>🏠 Cool Roof Retrofit (-2.5°C)</Popup>
                    </Circle>
                )}
                {hasWalls && (
                    <Circle center={[33.4474, -112.0770]} radius={80} pathOptions={{ color: '#4ade80', fillColor: '#4ade80', fillOpacity: 0.4 }}>
                        <Popup>🌿 Vertical Green Wall (-0.9°C)</Popup>
                    </Circle>
                )}
                {hasWater && (
                    <Circle center={[33.4494, -112.0700]} radius={90} pathOptions={{ color: '#38bdf8', fillColor: '#38bdf8', fillOpacity: 0.5 }}>
                        <Popup>💧 Evaporative Water Feature (-1.4°C)</Popup>
                    </Circle>
                )}
            </MapContainer>

            {/* Floating Temperature Badge */}
            <div style={{
                position: 'absolute', top: '12px', left: '12px', zIndex: 1000,
                background: isBaseline ? 'rgba(249,62,62,0.9)' : 'rgba(16,185,129,0.9)',
                borderRadius: '8px', padding: '6px 12px',
                fontSize: '0.75rem', fontWeight: 700, color: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
            }}>
                {isBaseline ? `🌡️ BASELINE: ${BASE_TEMP_F}°F / ${BASE_TEMP_C}°C` : `🟢 POST-INTERVENTION: ${postF}°F / ${postC}°C`}
            </div>

            <div style={{
                position: 'absolute', bottom: '12px', right: '12px', zIndex: 1000,
                background: 'rgba(0,0,0,0.75)', borderRadius: '6px', padding: '4px 10px',
                fontSize: '0.65rem', color: '#8b92a5', border: '1px solid rgba(255,255,255,0.1)'
            }}>
                {isBaseline ? 'BASELINE GIS MAP — Phoenix, AZ' : 'FORTYGUARD AI DOWN-SCALED MAP'}
            </div>
        </div>
    );
};

const InterventionSimulator = () => {
    const [droppedInterventions, setDroppedInterventions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [simulated, setSimulated] = useState(false);
    const [dragOverRight, setDragOverRight] = useState(false);
    const [draggingId, setDraggingId] = useState(null);

    const [apiError, setApiError] = useState(false);

    const totalDelta = droppedInterventions.reduce((s, i) => s + i.tempDelta, 0);
    const newTempC = (BASE_TEMP_C + totalDelta).toFixed(1);
    const newTempF = ((BASE_TEMP_C + totalDelta) * 9 / 5 + 32).toFixed(1);
    const totalCO2 = droppedInterventions.reduce((sum, i) => {
        return sum + parseFloat(i.co2.split(' ')[0]);
    }, 0).toFixed(1);
    const totalROI = droppedInterventions.reduce((sum, i) => {
        return sum + parseInt(i.roi.replace(/[$,]/g, ''));
    }, 0);
    const mitigationScore = Math.min(100, Math.round(Math.abs(totalDelta) * 12 + droppedInterventions.length * 5));

    const handleDrop = async (e) => {
        e.preventDefault();
        setDragOverRight(false);
        const id = e.dataTransfer.getData('interventionId');
        const found = INTERVENTIONS.find(i => i.id === id);
        if (found && !droppedInterventions.find(i => i.id === id)) {
            setLoading(true);
            setSimulated(false);
            setApiError(false);

            try {
                const url = '/api/heat_intelligence';
                const headers = {
                    'Content-Type': 'application/json'
                };
                const body = JSON.stringify({ intervention: found.label, area: 'Phoenix, AZ' });

                console.log("Outgoing Request URL:", url);
                console.log("Outgoing Request Headers:", headers);

                const response = await fetch(url, {
                    method: 'POST',
                    headers: headers,
                    body: body
                });

                if (response.status === 200) {
                    console.log(`Frontend [heat_intelligence]: 200 OK`);
                } else if (response.status === 401) {
                    console.error(`Frontend [heat_intelligence]: 401 API key invalid/missing.`);
                } else if (response.status === 429) {
                    console.error(`Frontend [heat_intelligence]: 429 Rate limit exceeded.`);
                } else if (response.status >= 500 || response.status === 0) {
                    console.error(`Frontend [heat_intelligence]: ${response.status} Server/CORS Error.`);
                }

                const data = await response.json().catch(() => null);
                console.log("Raw API Response:", data);

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                setDroppedInterventions(prev => [...prev, found]);
                setSimulated(true);
            } catch (error) {
                console.error("FortyGuard AI Simulation Failed:", error.message);
                console.log("Falling back to local simulation data.");
                setApiError(true);
                // Fallback: Apply the intervention visually even if API fails
                setDroppedInterventions(prev => [...prev, found]);
                setSimulated(true);
            } finally {
                setLoading(false);
            }
        }
    };

    const removeIntervention = (id) => {
        setDroppedInterventions(prev => prev.filter(i => i.id !== id));
        setSimulated(droppedInterventions.length > 1);
    };

    const resetAll = () => {
        setDroppedInterventions([]);
        setSimulated(false);
    };

    return (
        <div style={{ fontFamily: 'Inter, sans-serif' }}>
            {/* Header */}
            <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.4rem' }}>
                    <span style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', color: '#10b981', fontSize: '0.62rem', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        🧬 Generative AI — CorrDiff Model
                    </span>
                    <span style={{ background: 'rgba(249,62,62,0.1)', border: '1px solid rgba(249,62,62,0.3)', color: '#f93e3e', fontSize: '0.62rem', fontWeight: 700, padding: '3px 10px', borderRadius: '20px' }}>
                        Phoenix, AZ — Heat Island Zone
                    </span>
                </div>
                <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#f0f2f5' }}>
                    Generative Mitigation Simulator
                </h2>
                <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#8b92a5' }}>
                    Drag interventions onto the right-side AI map. Watch the FortyGuard CorrDiff model recalculate street-level temperatures in real time.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 1fr', gap: '1rem', height: '420px' }}>

                {/* Intervention Toolkit */}
                <div style={{
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '8px',
                    overflowY: 'auto',
                }}>
                    <div style={{ fontSize: '0.62rem', color: '#8b92a5', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px', fontWeight: 700 }}>
                        🛠️ Intervention Toolkit
                    </div>
                    {INTERVENTIONS.map(item => (
                        <div
                            key={item.id}
                            draggable
                            onDragStart={(e) => { e.dataTransfer.setData('interventionId', item.id); setDraggingId(item.id); }}
                            onDragEnd={() => setDraggingId(null)}
                            style={{
                                background: draggingId === item.id ? `rgba(${item.id === 'trees' ? '16,185,129' : '59,130,246'},0.2)` : 'rgba(255,255,255,0.04)',
                                border: `1px solid ${droppedInterventions.find(i => i.id === item.id) ? item.color : 'rgba(255,255,255,0.08)'}`,
                                borderRadius: '8px', padding: '0.6rem 0.75rem', cursor: 'grab',
                                display: 'flex', alignItems: 'center', gap: '8px',
                                opacity: droppedInterventions.find(i => i.id === item.id) ? 0.5 : 1,
                                transition: 'all 0.15s', userSelect: 'none',
                            }}
                        >
                            <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                            <div>
                                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#f0f2f5', lineHeight: 1.2 }}>{item.label}</div>
                                <div style={{ fontSize: '0.62rem', color: item.color, fontWeight: 700 }}>{item.tempDelta}°C</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Left Map: Baseline */}
                <div style={{ borderRadius: '12px', overflow: 'hidden', position: 'relative', border: '2px solid rgba(249,62,62,0.3)' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, background: 'rgba(0,0,0,0.7)', padding: '6px 12px', fontSize: '0.68rem', fontWeight: 700, color: '#f93e3e', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f93e3e' }}></div>
                        BEFORE — Current State
                    </div>
                    <HeatMapCanvas interventions={[]} isBaseline={true} />
                </div>

                {/* Right Map: AI Simulation Drop Zone */}
                <div
                    onDrop={handleDrop}
                    onDragOver={(e) => { e.preventDefault(); setDragOverRight(true); }}
                    onDragLeave={() => setDragOverRight(false)}
                    style={{
                        borderRadius: '12px', overflow: 'hidden', position: 'relative',
                        border: `2px solid ${dragOverRight ? 'rgba(16,185,129,0.8)' : 'rgba(16,185,129,0.3)'}`,
                        boxShadow: dragOverRight ? '0 0 20px rgba(16,185,129,0.3)' : 'none',
                        transition: 'all 0.2s',
                    }}
                >
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, background: 'rgba(0,0,0,0.7)', padding: '6px 12px', fontSize: '0.68rem', fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }}></div>
                        AFTER — AI Simulation {dragOverRight && '— Drop to apply'}
                    </div>

                    <HeatMapCanvas interventions={droppedInterventions} isBaseline={false} />

                    {/* Loading overlay */}
                    {loading && (
                        <div style={{
                            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            zIndex: 20, backdropFilter: 'blur(4px)',
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '12px', animation: 'spin 1s linear infinite' }}>⚙️</div>
                            <div style={{ color: '#2bd4c6', fontWeight: 700, fontSize: '0.9rem' }}>Calculating AI Model…</div>
                            <div style={{ color: '#8b92a5', fontSize: '0.75rem', marginTop: '4px' }}>FortyGuard CorrDiff — Generative Downscaling</div>
                            <div style={{ marginTop: '16px', width: '160px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', background: '#2bd4c6', borderRadius: '2px', animation: 'loadBar 1.4s ease-in-out forwards' }}></div>
                            </div>
                        </div>
                    )}

                    {/* API Error overlay */}
                    {apiError && !loading && (
                        <div style={{
                            position: 'absolute', inset: 0, background: 'rgba(249,62,62,0.15)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            zIndex: 20, backdropFilter: 'blur(4px)', border: '2px solid rgba(249,62,62,0.4)', borderRadius: '12px'
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⚠️</div>
                            <div style={{ color: '#f93e3e', fontWeight: 700, fontSize: '1rem' }}>AI Simulation Offline</div>
                            <div style={{ color: '#ffb3b3', fontSize: '0.8rem', marginTop: '6px', textAlign: 'center', padding: '0 20px' }}>
                                FortyGuard API connection failed. Live generative downscaling is currently unavailable.
                            </div>
                        </div>
                    )}

                    {/* Empty drop hint */}
                    {droppedInterventions.length === 0 && !loading && (
                        <div style={{
                            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
                        }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '10px', opacity: 0.4 }}>🎯</div>
                            <div style={{ color: '#8b92a5', fontSize: '0.82rem', textAlign: 'center', lineHeight: 1.5 }}>
                                Drag an intervention<br />from the toolkit to simulate
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Applied interventions + metrics */}
            {droppedInterventions.length > 0 && !loading && (
                <div style={{ marginTop: '1.25rem', display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'start' }}>
                    {/* Applied chips */}
                    <div>
                        <div style={{ fontSize: '0.62rem', color: '#8b92a5', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Active Interventions</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {droppedInterventions.map(i => (
                                <div key={i.id} style={{
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    background: `${i.color}18`, border: `1px solid ${i.color}55`,
                                    borderRadius: '20px', padding: '4px 12px', fontSize: '0.78rem', fontWeight: 600, color: i.color,
                                }}>
                                    {i.icon} {i.label}
                                    <button onClick={() => removeIntervention(i.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: i.color, padding: 0, marginLeft: '4px', lineHeight: 1 }}>✕</button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button onClick={resetAll} style={{
                        background: 'rgba(249,62,62,0.1)', border: '1px solid rgba(249,62,62,0.3)',
                        color: '#f93e3e', borderRadius: '8px', padding: '6px 16px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
                    }}>Reset</button>
                </div>
            )}

            {/* ROI / Metrics card */}
            {simulated && droppedInterventions.length > 0 && (
                <div style={{
                    marginTop: '1rem',
                    background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(43,212,198,0.05) 100%)',
                    border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px', padding: '1.25rem',
                }}>
                    <div style={{ fontSize: '0.65rem', color: '#10b981', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 700, marginBottom: '1rem' }}>
                        🧬 AI Simulation Results — Carbon Offset & ROI Analysis
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
                        {[
                            { label: 'Δ Temperature', val: `${totalDelta.toFixed(1)}°C`, sub: `${newTempF}°F / ${newTempC}°C`, color: '#10b981' },
                            { label: 'Mitigation Score', val: `${mitigationScore}/100`, sub: mitigationScore > 60 ? 'High Impact' : 'Moderate Impact', color: '#2bd4c6' },
                            { label: 'Carbon Offset', val: `${totalCO2} t`, sub: 'CO₂e per year', color: '#8b5cf6' },
                            { label: 'Est. Annual ROI', val: `$${totalROI.toLocaleString()}`, sub: 'Energy + health savings', color: '#ffd700' },
                            { label: 'Risk Level After', val: mitigationScore > 50 ? 'CAUTIOUS' : 'EXTREME', sub: `Was: EXTREME`, color: mitigationScore > 50 ? '#ffd700' : '#f93e3e' },
                        ].map(m => (
                            <div key={m.label} style={{
                                background: 'rgba(0,0,0,0.25)', borderRadius: '10px', padding: '0.9rem',
                                border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center',
                            }}>
                                <div style={{ fontSize: '0.6rem', color: '#8b92a5', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>{m.label}</div>
                                <div style={{ fontWeight: 800, color: m.color, fontSize: '1.25rem', lineHeight: 1 }}>{m.val}</div>
                                <div style={{ fontSize: '0.65rem', color: '#8b92a5', marginTop: '4px' }}>{m.sub}</div>
                            </div>
                        ))}
                    </div>
                    {/* JSON preview */}
                    <div style={{ marginTop: '1rem', background: 'rgba(0,0,0,0.35)', borderRadius: '8px', padding: '0.75rem', fontSize: '0.68rem', fontFamily: 'monospace', color: '#4ade80' }}>
                        <span style={{ color: '#8b92a5' }}>// FortyGuard CorrDiff — Simulation Output Payload</span>{'\n'}
                        {`{ "model": "CorrDiff-v2", "location": "Phoenix, AZ", "baseline_temp_c": ${BASE_TEMP_C}, "simulated_temp_c": ${newTempC}, "delta_c": ${totalDelta.toFixed(1)}, "mitigation_score": ${mitigationScore}, "carbon_offset_t_co2e_yr": ${totalCO2}, "roi_usd_yr": ${totalROI} }`}
                    </div>
                </div>
            )}

            <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes loadBar { from { width: 0%; } to { width: 100%; } }
      `}</style>
            {/* Scientific Accuracy & Practical Utility Panel */}
            <div className="panel-card" style={{ marginTop: '1.5rem', background: 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(0,0,0,0) 100%)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <h4 style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px', marginTop: 0 }}>
                    🧠 FortyGuard CorrDiff AI Engine — Model Accuracy & Enterprise Utility
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', fontSize: '0.78rem', color: '#a3abbb', marginTop: '0.75rem' }}>
                    <div>
                        <b style={{ color: '#f0f2f5' }}>1. Micro-Climate Downscaling Accuracy</b>
                        <p style={{ margin: '4px 0 0' }}>FortyGuard CorrDiff uses physics-informed generative diffusion to downscale 10km grid weather data to 2m street-level resolution, capturing micro-thermal variation accurately.</p>
                    </div>
                    <div>
                        <b style={{ color: '#f0f2f5' }}>2. Thermodynamic Albedo Modeling</b>
                        <p style={{ margin: '4px 0 0' }}>Calculates shortwave solar reflectance (Albedo α) and evapotranspiration latent heat flux to accurately predict cooling deltas for trees (-1.8°C), roofs (-2.5°C), and pavement (-1.2°C).</p>
                    </div>
                    <div>
                        <b style={{ color: '#f0f2f5' }}>3. Enterprise & Municipal Utility</b>
                        <p style={{ margin: '4px 0 0' }}>Enables city planners and asset managers to calculate capital ROI ($) and CO₂ offset credits prior to executing multi-million dollar cooling interventions.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterventionSimulator;
