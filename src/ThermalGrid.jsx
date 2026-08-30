import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, SVGOverlay, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import { MapLayerControls } from './MapLayerControls';
import './RouteDashboard.css';

// Custom CSS for the advanced weather map overlay
const advancedMapStyles = `
.weather-map-wrapper {
  position: relative;
  height: 600px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.1);
}
.map-sidebar {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1000;
  background: rgba(20, 22, 27, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  width: 220px;
  padding: 1rem;
  color: #f0f2f5;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
}
.layer-section-title {
  font-size: 0.7rem;
  font-weight: 700;
  color: #8b92a5;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 1rem 0 0.5rem 0;
}
.layer-btn {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  width: 100%;
  padding: 0.6rem 0.8rem;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: #a3abbb;
  cursor: pointer;
  text-align: left;
  font-size: 0.85rem;
  transition: all 0.2s;
}
.layer-btn:hover { background: rgba(255,255,255,0.05); color: #f0f2f5; }
.layer-btn.active { background: rgba(59, 130, 246, 0.15); color: #3b82f6; font-weight: 600; }
.forecast-card {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1000;
  background: rgba(25, 27, 33, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  width: 280px;
  padding: 1.25rem;
  box-shadow: 0 12px 40px rgba(0,0,0,0.5);
  color: #fff;
}
.forecast-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  font-size: 0.85rem;
}
.forecast-row:last-child { border-bottom: none; padding-bottom: 0; }
.temp-bar-container {
  width: 60px;
  height: 4px;
  background: rgba(255,255,255,0.1);
  border-radius: 2px;
  margin: 0 8px;
  position: relative;
}
.temp-bar-fill {
  position: absolute;
  height: 100%;
  border-radius: 2px;
  background: linear-gradient(90deg, #ffd700, #ff6d3a);
}
.radar-pulse {
  position: relative;
  width: 14px;
  height: 14px;
  background: #f93e3e;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
}
.radar-pulse::after {
  content: '';
  position: absolute;
  top: -6px;
  left: -6px;
  right: -6px;
  bottom: -6px;
  border-radius: 50%;
  border: 2px solid #f93e3e;
  animation: radarPing 1.5s ease-out infinite;
}
@keyframes radarPing {
  0% { transform: scale(0.8); opacity: 1; }
  100% { transform: scale(2.5); opacity: 0; }
}
`;

// Helper icon
const markerIcon = L.divIcon({
    className: 'custom-pin',
    html: `<div class="radar-pulse"></div>`,
    iconSize: [14, 14], iconAnchor: [7, 7]
});

const truckIcon = L.divIcon({
    className: 'custom-pin',
    html: `<div style="background:#2bd4c6;width:24px;height:24px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 12px rgba(43,212,198,0.8);display:flex;align-items:center;justify-content:center;font-size:12px;">🚚</div>`,
    iconSize: [24, 24], iconAnchor: [12, 12]
});

const LocateMeControl = () => {
    const map = useMap();
    const handleLocate = () => {
        map.locate({ setView: true, maxZoom: 12 });
        map.once('locationfound', (e) => {
            L.circleMarker(e.latlng, { radius: 8, color: '#2bd4c6', fillColor: '#2bd4c6', fillOpacity: 0.5 }).addTo(map)
                .bindPopup('You are here.').openPopup();
        });
        map.once('locationerror', (e) => {
            alert('Could not detect your exact location. Ensure location services are allowed.');
        });
    };
    return (
        <button onClick={handleLocate} style={{
            position: 'absolute', bottom: 30, right: 20, zIndex: 1000,
            background: '#2bd4c6', color: '#000', border: 'none', borderRadius: '50%',
            width: '44px', height: '44px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(43,212,198,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem'
        }} title="Find My Location">
            📍
        </button>
    );
};

const ThermalGrid = () => {
    const [activeLayer, setActiveLayer] = useState('temperature');

    const trackableEntities = [
        { type: 'city', name: 'Phoenix, AZ', lat: 33.4484, lng: -112.0740, tempDelta: 12 },
        { type: 'city', name: 'Dallas, TX', lat: 32.7767, lng: -96.7970, tempDelta: 8 },
        { type: 'city', name: 'Miami, FL', lat: 25.7617, lng: -80.1918, tempDelta: 4 },
        { type: 'city', name: 'Chicago, IL', lat: 41.8781, lng: -87.6298, tempDelta: -5 },
        { type: 'vehicle', name: 'Fleet TRK-402 (I-10 E)', lat: 33.6213, lng: -111.4590, tempDelta: 14 },
        { type: 'vehicle', name: 'Fleet TRK-811 (I-35 S)', lat: 31.8413, lng: -97.3590, tempDelta: 9 }
    ];

    const [activeTarget, setActiveTarget] = useState(trackableEntities[0]);
    const [targetSelection, setTargetSelection] = useState(trackableEntities[0].name);
    const [customTargetName, setCustomTargetName] = useState("");

    // Handle map center update when target changes
    const [mapCenter, setMapCenter] = useState([trackableEntities[0].lat, trackableEntities[0].lng]);
    const [mapKey, setMapKey] = useState(0);

    // Draggable & Minimizable state
    const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
    const [isForecastMinimized, setIsForecastMinimized] = useState(false);
    const [forecastPos, setForecastPos] = useState({ x: window.innerWidth - 340, y: 20 });
    const [isDraggingForecast, setIsDraggingForecast] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [playbackTime, setPlaybackTime] = useState(0);

    const [forecastData, setForecastData] = useState(null);

    const [heatmapGeoJSON, setHeatmapGeoJSON] = useState(null);
    const [isPollingHeatmap, setIsPollingHeatmap] = useState(false);
    const [heatmapStatus, setHeatmapStatus] = useState('');

    const handleFetchErrorLog = (res, context) => {
        if (res.status === 200) {
            console.log(`Frontend [${context}]: 200 OK`);
        } else if (res.status === 401) {
            console.error(`Frontend [${context}]: 401 API key invalid/missing.`);
        } else if (res.status === 429) {
            console.error(`Frontend [${context}]: 429 Rate limit exceeded.`);
        } else if (res.status >= 500 || res.status === 0) {
            console.error(`Frontend [${context}]: ${res.status} Server/CORS Error.`);
        }
    };

    const generateHeatmapAPI = async () => {
        setIsPollingHeatmap(true);
        setHeatmapStatus('Initializing...');
        try {
            // Generate bounding box polygon around target
            const r = 0.04;
            const polygon_aoi = {
                "type": "Polygon",
                "coordinates": [[
                    [activeTarget.lng - r, activeTarget.lat - r],
                    [activeTarget.lng + r, activeTarget.lat - r],
                    [activeTarget.lng + r, activeTarget.lat + r],
                    [activeTarget.lng - r, activeTarget.lat + r],
                    [activeTarget.lng - r, activeTarget.lat - r]
                ]]
            };

            const res = await fetch('/api/heatmap', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    polygon_aoi,
                    date: new Date().toISOString().split('T')[0],
                    granularity: '80m'
                })
            });
            handleFetchErrorLog(res, 'heatmap init');
            
            const data = await res.json();
            if (!data.activity_id) throw new Error("No activity ID returned");

            setHeatmapStatus('Polling API...');
            
            const poll = async () => {
                try {
                    const statusRes = await fetch(`/api/heatmap_status?activity_id=${data.activity_id}`);
                    handleFetchErrorLog(statusRes, 'heatmap status');
                    const statusData = await statusRes.json();
                    
                    if (statusData.status === 'Completed' && statusData.map_data) {
                        setHeatmapGeoJSON(statusData.map_data);
                        setIsPollingHeatmap(false);
                        setHeatmapStatus('');
                    } else if (statusData.status === 'failed' || statusData.status === 'Failed') {
                        throw new Error("Heatmap generation failed on server.");
                    } else if (statusData.status === 'Processing') {
                        setHeatmapStatus(`Status: Processing...`);
                        setTimeout(poll, 3000);
                    } else {
                        setHeatmapStatus(`Status: ${statusData.status}...`);
                        setTimeout(poll, 3000);
                    }
                } catch (pollErr) {
                    console.error(pollErr);
                    setIsPollingHeatmap(false);
                    setHeatmapStatus('Failed');
                }
            };
            poll();
        } catch (error) {
            console.error("Heatmap Generation Failed:", error);
            setIsPollingHeatmap(false);
            setHeatmapStatus('Failed');
        }
    };

    const clearHeatmap = () => {
        setHeatmapGeoJSON(null);
        setHeatmapStatus('');
        setIsPollingHeatmap(false);
    };

    const styleHeatmap = (feature) => {
        const t = feature.properties.tcm;
        const normalized = Math.max(0, Math.min(1, (t - 25) / 25)); // Map 25C - 50C
        const hue = (1 - normalized) * 240; 
        return {
            fillColor: `hsl(${hue}, 100%, 50%)`,
            fillOpacity: 0.65,
            weight: 0.5,
            color: 'rgba(255,255,255,0.2)'
        };
    };

    useEffect(() => {
        const fetchForecast = async () => {
            try {
                const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${activeTarget.lat}&longitude=${activeTarget.lng}&daily=temperature_2m_max,temperature_2m_min&past_days=7&forecast_days=2&timezone=auto`);
                const data = await res.json();
                if (data && data.daily) {
                    setForecastData(data.daily);
                }
            } catch (err) {
                console.error("Failed to fetch accurate forecast:", err);
            }
        };
        fetchForecast();
    }, [activeTarget]);

    useEffect(() => {
        let interval;
        if (isPlaying) {
            interval = setInterval(() => {
                setPlaybackTime(prev => {
                    if (prev >= 100) return 0;
                    return prev + (0.5 * playbackSpeed);
                });
            }, 50);
        }
        return () => clearInterval(interval);
    }, [isPlaying, playbackSpeed]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (isDraggingForecast) {
                setForecastPos({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y });
            }
        };
        const handleMouseUp = () => setIsDraggingForecast(false);
        if (isDraggingForecast) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDraggingForecast, dragOffset]);

    const handleMouseDown = (e) => {
        setIsDraggingForecast(true);
        setDragOffset({ x: e.clientX - forecastPos.x, y: e.clientY - forecastPos.y });
    };

    useEffect(() => {
        setMapCenter([activeTarget.lat, activeTarget.lng]);
        setMapKey(prev => prev + 1); // Forcing remount to jump map smoothly (or use map ref)
    }, [activeTarget]);

    // Map tile layers from open sources
    const tileLayers = {
        satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
    };



    const layerThresholds = {
        temperature: { val: (44.4 + activeTarget.tempDelta * 0.5).toFixed(1), unit: '°C', safe: '< 32°C', cautious: '32–40°C', danger: 'Risk Level: Extreme' },
        precipitation: { val: Math.max(0, (12 + activeTarget.tempDelta * 1.5)).toFixed(1), unit: 'mm/h', safe: '< 10mm', cautious: '10–30mm', danger: '> 30mm Flood' },
        wind: { val: Math.max(10, (48 + activeTarget.tempDelta * 2)).toFixed(0), unit: 'km/h', safe: '< 20km/h', cautious: '20–64km/h', danger: '> 64km/h Gale' },
        pressure: { val: (1002 - activeTarget.tempDelta).toFixed(0), unit: 'hPa', safe: '1010–1025', cautious: '< 1010', danger: '< 980 Storm' },
        satellite: { val: 'HD', unit: 'Optic', safe: 'Nominal', cautious: 'Obscured', danger: 'Severe' },
        exceedance: { val: '8.5', unit: 'hrs', safe: '< 2 hrs', cautious: '2–6 hrs', danger: '> 6 hrs Critical' },
        persistence: { val: '0.84', unit: 'factor', safe: '< 0.5', cautious: '0.5–0.75', danger: '> 0.75 Extreme Inertia' },
        'urban-heat': { val: (48.2 + activeTarget.tempDelta * 0.5).toFixed(1), unit: '°C (Surface)', safe: '< 35°C', cautious: '35–45°C', danger: '> 45°C Extreme UHI' },
        'flash-flood': { val: Math.max(0, (45 + activeTarget.tempDelta * 2)).toFixed(1), unit: 'mm/h', safe: '< 15mm', cautious: '15–40mm', danger: '> 40mm Severe Flood' }
    };

    // Generate accurate 7-day past + 12h future forecast using API
    const getForecast = () => {
        if (!forecastData || !forecastData.time) {
            return <div style={{color: '#a3abbb', fontSize: '0.8rem', textAlign: 'center', padding: '2rem 0'}}>Fetching highly accurate area telemetry...</div>;
        }

        return forecastData.time.map((dateStr, i) => {
            // Because Open-Meteo returns yyyy-mm-dd strings, parse it locally
            const date = new Date(dateStr + "T00:00:00");
            const today = new Date();
            const isToday = today.toDateString() === date.toDateString();
            
            let dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            if (isToday) dayName = 'Today';
            if (date > today && !isToday) dayName = 'Tmw';
            
            const minT = Math.round(forecastData.temperature_2m_min[i]);
            const maxT = Math.round(forecastData.temperature_2m_max[i]);
            
            const barWidth = Math.max(5, ((maxT - minT) / 20) * 100);
            const barLeft = Math.max(0, ((minT - (-10)) / 60) * 100); // Scale -10C to 50C

            let icon = '☀️';
            if (maxT > 40) icon = '🔥';
            else if (maxT > 30) icon = '🌤️';
            else if (maxT < 10) icon = '❄️';

            return (
                <div className="forecast-row" key={dateStr}>
                    <div style={{ width: '40px', color: isToday ? '#2bd4c6' : '#fff', fontWeight: isToday ? 'bold' : 'normal' }}>{dayName}</div>
                    <div style={{ fontSize: '1.2rem' }}>{icon}</div>
                    <div style={{ color: '#a3abbb' }}>{minT}°</div>
                    <div className="temp-bar-container">
                        <div className="temp-bar-fill" style={{ left: `${barLeft}%`, width: `${barWidth}%`, background: isToday ? 'linear-gradient(90deg, #2bd4c6, #ff6d3a)' : 'linear-gradient(90deg, #ffd700, #ff6d3a)' }}></div>
                    </div>
                    <div style={{ fontWeight: 600 }}>{maxT}°</div>
                </div>
            );
        });
    };

    return (
        <div className="dashboard-wrapper">
            <style>{advancedMapStyles}</style>

            <div className="dashboard-header" style={{ marginBottom: '1.5rem' }}>
                <div className="title-section">
                    <h1>🌍 ThermalGrid HD <span className="tag">Live Weather Overlay</span></h1>
                    <p>High-definition continuous meteorological tracking, dynamic data layers (Humidity, Wind, Temp), and localized multi-day impact forecasting.</p>
                </div>
                <div className="header-status">
                    <div className="dot" style={{ background: '#2bd4c6' }}></div> FortyGuard Active
                </div>
            </div>

            <div className="weather-map-wrapper">
                <MapLayerControls activeLayer={activeLayer} setActiveLayer={setActiveLayer} />
                <MapContainer key={mapKey} center={mapCenter} zoom={6} style={{ height: '100%', width: '100%', background: '#101318' }} zoomControl={false}>

                    {/* Base terrain map (dark mode) */}
                    <TileLayer
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
                        attribution='&copy; Esri'
                    />

                    {/* Weather Data Overlay (Geographically Bound to Map) */}
                    {activeLayer !== 'satellite' && (
                        <SVGOverlay bounds={[
                            [activeTarget.lat - 12, activeTarget.lng - 16],
                            [activeTarget.lat + 12, activeTarget.lng + 16]
                        ]}>
                            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ opacity: 0.85, mixBlendMode: 'screen' }}>
                                <defs>
                                    {/* Procedural Noise Filters for Realistic Weather */}
                                    <filter id="weather-noise" x="-50%" y="-50%" width="200%" height="200%">
                                        <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" result="noise" />
                                        <feOffset dx={Math.sin(playbackTime / 20) * 30} dy={Math.cos(playbackTime / 20) * 30} in="noise" result="movedNoise" />
                                        <feDisplacementMap in="SourceGraphic" in2="movedNoise" scale="40" xChannelSelector="R" yChannelSelector="G" />
                                    </filter>
                                    
                                    <filter id="wind-noise" x="-50%" y="-50%" width="200%" height="200%">
                                        <feTurbulence type="fractalNoise" baseFrequency="0.03 0.005" numOctaves="2" result="noise" />
                                        <feOffset dx={-(playbackTime * 3) % 150} dy={-(playbackTime * 3) % 150} in="noise" result="movedNoise" />
                                        <feDisplacementMap in="SourceGraphic" in2="movedNoise" scale="70" xChannelSelector="R" yChannelSelector="G" />
                                    </filter>

                                    <radialGradient id="grad-temperature" cx="50%" cy="50%" r="45%">
                                        <stop offset="0%" stopColor={`rgba(249, 62, 62, ${0.55 + Math.sin(playbackTime / 5) * 0.2})`} />
                                        <stop offset="40%" stopColor="rgba(255, 109, 58, 0.5)" />
                                        <stop offset="100%" stopColor="transparent" />
                                    </radialGradient>
                                    
                                    <radialGradient id="grad-precipitation" cx="50%" cy="50%" r="45%">
                                        <stop offset="0%" stopColor={`rgba(43, 212, 198, ${0.55 + Math.sin(playbackTime / 5) * 0.2})`} />
                                        <stop offset="50%" stopColor="rgba(59, 130, 246, 0.5)" />
                                        <stop offset="100%" stopColor="transparent" />
                                    </radialGradient>
                                    
                                    <linearGradient id="grad-wind" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="rgba(59, 130, 246, 0.15)" />
                                        <stop offset="50%" stopColor={`rgba(200, 200, 255, ${(0.55 + Math.sin(playbackTime / 5) * 0.2) * 0.6})`} />
                                        <stop offset="100%" stopColor="rgba(59, 130, 246, 0.1)" />
                                    </linearGradient>
                                    
                                    <radialGradient id="grad-pressure" cx="50%" cy="50%" r="55%">
                                        <stop offset="0%" stopColor={`rgba(153, 50, 204, ${Math.max(0, (0.55 + Math.sin(playbackTime / 5) * 0.2) - 0.1)})`} />
                                        <stop offset="100%" stopColor="transparent" />
                                    </radialGradient>
                                    
                                    <radialGradient id="grad-exceedance" cx="50%" cy="50%" r="40%">
                                        <stop offset="0%" stopColor={`rgba(255,50,0,${0.65 + Math.sin(playbackTime / 5) * 0.2})`} />
                                        <stop offset="45%" stopColor="rgba(255,120,0,0.5)" />
                                        <stop offset="100%" stopColor="transparent" />
                                    </radialGradient>
                                    
                                    <radialGradient id="grad-persistence" cx="50%" cy="50%" r="45%">
                                        <stop offset="0%" stopColor={`rgba(180,0,80,${0.65 + Math.sin(playbackTime / 5) * 0.2})`} />
                                        <stop offset="50%" stopColor="rgba(120,0,100,0.5)" />
                                        <stop offset="100%" stopColor="transparent" />
                                    </radialGradient>
                                    
                                    <radialGradient id="grad-urban-heat" cx="50%" cy="50%" r="20%">
                                        <stop offset="0%" stopColor={`rgba(255, 30, 0, ${(0.55 + Math.sin(playbackTime / 5) * 0.2) + 0.3})`} />
                                        <stop offset="50%" stopColor="rgba(255, 120, 0, 0.6)" />
                                        <stop offset="100%" stopColor="transparent" />
                                    </radialGradient>
                                    
                                    <radialGradient id="grad-flash-flood" cx="50%" cy="50%" r="25%">
                                        <stop offset="0%" stopColor={`rgba(0, 255, 255, ${(0.55 + Math.sin(playbackTime / 5) * 0.2) + 0.2})`} />
                                        <stop offset="40%" stopColor="rgba(0, 100, 255, 0.7)" />
                                        <stop offset="100%" stopColor="transparent" />
                                    </radialGradient>
                                </defs>
                                <rect 
                                    x="-20" y="-20" width="140" height="140" 
                                    fill={`url(#grad-${activeLayer})`} 
                                    filter={activeLayer === 'wind' ? 'url(#wind-noise)' : 'url(#weather-noise)'}
                                />
                            </svg>
                        </SVGOverlay>
                    )}
                    {activeLayer === 'satellite' && (
                        <>
                            <TileLayer url={tileLayers.satellite} opacity={0.65} />
                            {/* Adds explicitly overlaid clear city labels on top of the satellite imagery */}
                            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}" zIndex={400} />
                        </>
                    )}

                    <Marker
                        position={[activeTarget.lat, activeTarget.lng]}
                        icon={activeTarget.type === 'vehicle' ? truckIcon : markerIcon}
                    />

                    {heatmapGeoJSON && (
                        <GeoJSON data={heatmapGeoJSON} style={styleHeatmap} />
                    )}

                    {/* Let user locate themselves on this massive weather map */}
                    <LocateMeControl />
                </MapContainer>

                {/* Playback Control Widget */}
                <div style={{
                    position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000,
                    background: 'rgba(20, 22, 27, 0.9)', backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px 20px',
                    display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', width: '450px'
                }}>
                    <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        style={{ 
                            background: '#2bd4c6', border: 'none', borderRadius: '50%', minWidth: '40px', height: '40px', 
                            color: '#000', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center',
                            boxShadow: '0 0 15px rgba(43,212,198,0.4)'
                        }}
                    >
                        {isPlaying ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '1px' }}>
                                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '3px' }}>
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                        )}
                    </button>
                    
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#8b92a5', marginBottom: '6px', fontWeight: 600 }}>
                            <span>-7d</span>
                            <span style={{ color: '#2bd4c6', fontSize: '0.8rem' }}>
                                LIVE FORECAST
                            </span>
                            <span>+12h</span>
                        </div>
                        <input 
                            type="range" 
                            min="0" max="100" 
                            value={playbackTime} 
                            onChange={(e) => { setPlaybackTime(Number(e.target.value)); setIsPlaying(false); }}
                            style={{ width: '100%', accentColor: '#2bd4c6', cursor: 'pointer' }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '0.65rem', color: '#8b92a5', textTransform: 'uppercase', textAlign: 'center' }}>Speed</label>
                        <select 
                            value={playbackSpeed}
                            onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                            style={{ 
                                background: 'rgba(0,0,0,0.4)', color: '#2bd4c6', border: '1px solid rgba(43,212,198,0.3)', 
                                borderRadius: '6px', padding: '4px 8px', fontSize: '0.8rem', cursor: 'pointer', outline: 'none', fontWeight: 'bold'
                            }}
                        >
                            <option value={0.5}>0.5x</option>
                            <option value={1}>1x</option>
                            <option value={2}>2x</option>
                            <option value={4}>4x</option>
                            <option value={10}>10x</option>
                        </select>
                    </div>
                </div>

                {/* Left Sidebar: Live Maps Layers */}
                <div className="map-sidebar" style={{ transition: 'all 0.3s ease', width: isSidebarMinimized ? '50px' : '220px', overflow: 'hidden', padding: isSidebarMinimized ? '1rem 0.5rem' : '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: isSidebarMinimized ? 'center' : 'space-between', marginBottom: '1rem' }}>
                        {!isSidebarMinimized && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '1.5rem' }}>🌎</span>
                                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>EARTH</h3>
                            </div>
                        )}
                        <button onClick={() => setIsSidebarMinimized(!isSidebarMinimized)} style={{ background: 'none', border: 'none', color: '#a3abbb', cursor: 'pointer', fontSize: '1.2rem' }}>
                            {isSidebarMinimized ? '»' : '«'}
                        </button>
                    </div>

                    {!isSidebarMinimized && (
                        <>
                            <div className="layer-section-title">Live Maps</div>
                            <button className={`layer-btn ${activeLayer === 'satellite' ? 'active' : ''}`} onClick={() => setActiveLayer('satellite')}>
                                🛰️ Satellite (HD)
                            </button>
                            <div className="layer-section-title">Forecast Overlays</div>
                            <button className={`layer-btn ${activeLayer === 'precipitation' ? 'active' : ''}`} onClick={() => setActiveLayer('precipitation')}>
                                🌧️ Precipitation
                            </button>
                            <button className={`layer-btn ${activeLayer === 'wind' ? 'active' : ''}`} onClick={() => setActiveLayer('wind')}>
                                💨 Wind
                            </button>
                            <button className={`layer-btn ${activeLayer === 'temperature' ? 'active' : ''}`} onClick={() => setActiveLayer('temperature')}>
                                🌡️ Temperature
                            </button>
                            <button className={`layer-btn ${activeLayer === 'pressure' ? 'active' : ''}`} onClick={() => setActiveLayer('pressure')}>
                                🧭 Pressure
                            </button>
                            <div className="layer-section-title" style={{ marginTop: '0.5rem' }}>Heat Analysis Layers</div>
                            <button className={`layer-btn ${activeLayer === 'exceedance' ? 'active' : ''}`} onClick={() => setActiveLayer('exceedance')} style={{ borderLeft: activeLayer === 'exceedance' ? '2px solid #f93e3e' : '2px solid transparent' }}>
                                🔥 Heat Exceedance Layer
                            </button>
                            <button className={`layer-btn ${activeLayer === 'persistence' ? 'active' : ''}`} onClick={() => setActiveLayer('persistence')} style={{ borderLeft: activeLayer === 'persistence' ? '2px solid #8b5cf6' : '2px solid transparent' }}>
                                ♾️ Heat Persistence Layer
                            </button>
                            <div className="layer-section-title" style={{ marginTop: '0.5rem' }}>Extreme Events</div>
                            <button className={`layer-btn ${activeLayer === 'urban-heat' ? 'active' : ''}`} onClick={() => setActiveLayer('urban-heat')} style={{ borderLeft: activeLayer === 'urban-heat' ? '2px solid #f97316' : '2px solid transparent' }}>
                                🏙️ Urban Heat Island
                            </button>
                            <button className={`layer-btn ${activeLayer === 'flash-flood' ? 'active' : ''}`} onClick={() => setActiveLayer('flash-flood')} style={{ borderLeft: activeLayer === 'flash-flood' ? '2px solid #06b6d4' : '2px solid transparent' }}>
                                🌊 Flash Flooding Risk
                            </button>
                            <div className="layer-section-title" style={{ marginTop: '0.5rem' }}>High-Res API Models</div>
                            <button className="layer-btn" onClick={generateHeatmapAPI} disabled={isPollingHeatmap} style={{ borderLeft: '2px solid #10b981' }}>
                                {isPollingHeatmap ? `⏳ ${heatmapStatus}` : '🌡️ Generate Heatmap (API)'}
                            </button>
                            {heatmapGeoJSON && (
                                <button className="layer-btn" onClick={clearHeatmap} style={{ color: '#ef4444' }}>
                                    🗑️ Clear Map
                                </button>
                            )}
                        </>
                    )}
                </div>

                {/* Right Floating Forecast Card */}
                <div className="forecast-card" style={{
                    left: `${forecastPos.x}px`, top: `${forecastPos.y}px`, right: 'auto',
                    cursor: isDraggingForecast ? 'grabbing' : 'default',
                    height: isForecastMinimized ? '54px' : 'auto', overflow: 'hidden', transition: 'height 0.3s ease',
                    boxShadow: isDraggingForecast ? '0 20px 50px rgba(0,0,0,0.8)' : '0 12px 40px rgba(0,0,0,0.5)'
                }}>
                    <div
                        onMouseDown={handleMouseDown}
                        style={{ cursor: isDraggingForecast ? 'grabbing' : 'grab', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', background: 'rgba(255,255,255,0.02)', padding: '0px 10px 10px', margin: '-10px -10px 10px', borderRadius: '10px 10px 0 0' }}
                    >
                        <span style={{ fontSize: '0.6rem', color: '#8b92a5', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '10px' }}>≡ Drag to Move</span>
                        <button onClick={() => setIsForecastMinimized(!isForecastMinimized)} style={{ background: 'none', border: 'none', color: '#f0f2f5', cursor: 'pointer', fontSize: '1.2rem', marginTop: '5px' }}>
                            {isForecastMinimized ? '▽' : '△'}
                        </button>
                    </div>

                    <div style={{ opacity: isForecastMinimized ? 0 : 1, transition: 'opacity 0.2s', visibility: isForecastMinimized ? 'hidden' : 'visible' }}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ fontSize: '0.7rem', color: '#8b92a5', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>Target Selector</label>
                            <select
                                style={{ width: '100%', background: 'rgba(0,0,0,0.3)', color: '#f0f2f5', border: '1px solid rgba(255,255,255,0.2)', padding: '6px', borderRadius: '4px' }}
                                value={targetSelection}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setTargetSelection(val);
                                    if (val !== 'other') {
                                        const found = trackableEntities.find(t => t.name === val);
                                        if (found) setActiveTarget(found);
                                    } else {
                                        setActiveTarget({
                                            type: 'vehicle',
                                            name: customTargetName.trim() || 'Custom Fleet Vehicle',
                                            lat: 33.4484,
                                            lng: -112.0740,
                                            tempDelta: 10
                                        });
                                    }
                                }}
                            >
                                <optgroup label="US Cities / Districts">
                                    {trackableEntities.filter(t => t.type === 'city').map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
                                </optgroup>
                                <optgroup label="Active Fleet Vehicles">
                                    {trackableEntities.filter(t => t.type === 'vehicle').map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
                                </optgroup>
                                <optgroup label="Custom Vehicle / Target">
                                    <option value="other">✏️ Other (Write Custom Vehicle...)</option>
                                </optgroup>
                            </select>

                            {targetSelection === 'other' && (
                                <input
                                    type="text"
                                    placeholder="Enter custom vehicle (e.g. Autonomous Reefer #77)"
                                    value={customTargetName}
                                    onChange={(e) => {
                                        const nameVal = e.target.value;
                                        setCustomTargetName(nameVal);
                                        setActiveTarget({
                                            type: 'vehicle',
                                            name: nameVal.trim() || 'Custom Fleet Vehicle',
                                            lat: 33.4484,
                                            lng: -112.0740,
                                            tempDelta: 10
                                        });
                                    }}
                                    style={{
                                        marginTop: '8px',
                                        width: '100%',
                                        background: 'rgba(43,212,198,0.08)',
                                        border: '1px solid #2bd4c6',
                                        color: '#2bd4c6',
                                        padding: '6px 10px',
                                        borderRadius: '4px',
                                        fontSize: '0.8rem',
                                        outline: 'none'
                                    }}
                                />
                            )}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ color: '#2bd4c6' }}>{activeTarget.type === 'vehicle' ? '🚚' : '⭐'}</span>
                                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{activeTarget.name}</h3>
                            </div>
                            <span style={{ fontSize: '0.7rem', color: '#8b92a5', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                                {activeTarget.lat.toFixed(2)}, {activeTarget.lng.toFixed(2)}
                            </span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#8b92a5', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                            <span>Daily Forecast</span>
                            <span>Temperature</span>
                        </div>

                        <div className="forecast-wrapper" style={{ maxHeight: '200px', overflowY: 'auto', paddingRight: '5px' }}>
                            {getForecast()}
                        </div>

                        <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '0.75rem', color: '#a3abbb' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <span style={{ color: '#8b92a5' }}>Current reading:</span>
                                <strong style={{ color: '#fff', fontSize: '1.2rem' }}>
                                    {layerThresholds[activeLayer].val} <span style={{ fontSize: '0.8rem', color: '#8b92a5' }}>{layerThresholds[activeLayer].unit}</span>
                                </strong>
                            </div>

                            {/* Dynamic Threat Thresholds */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '6px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: '#2bd4c6' }}>● Safe</span>
                                    <span style={{ fontWeight: 'bold' }}>{layerThresholds[activeLayer].safe}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: '#ffd700' }}>● Cautious</span>
                                    <span style={{ fontWeight: 'bold' }}>{layerThresholds[activeLayer].cautious}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: '#f93e3e' }}>● Critical Threshold</span>
                                    <span style={{ fontWeight: 'bold' }}>{layerThresholds[activeLayer].danger}</span>
                                </div>
                            </div>

                            {activeLayer === 'temperature' && (
                                <div style={{ marginBottom: '4px' }}>
                                    <span style={{ background: '#f93e3e', color: '#fff', fontWeight: 700, fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', display: 'inline-block' }}>Risk Level: Extreme</span>
                                </div>
                            )}
                            <p style={{ margin: 0, lineHeight: '1.4', color: '#a3abbb' }}>
                                {activeLayer === 'temperature' && "Intense heat-dome forming over target. Expected to peak Tuesday in dangerous territory."}
                                {activeLayer === 'precipitation' && "Heavy monsoon trough active. Scattered severe storms predicted; potential for sudden flooding."}
                                {activeLayer === 'satellite' && "High-res optical imagery showing tracking path across the urban infrastructure corridor."}
                                {activeLayer === 'wind' && "Surface vectors indicating strong gale force microbursts accelerating across supply routes."}
                                {activeLayer === 'pressure' && "Deepening low pressure system detected. Barometric drop signifies incoming intense frontal boundary."}
                                {activeLayer === 'exceedance' && "Heat index exceeding historical norms by 15%. Infrastructure cooling systems operating at maximum capacity."}
                                {activeLayer === 'persistence' && "High heat persistence detected. Multi-day thermal saturation poses significant risk to regional power grid stability."}
                                {activeLayer === 'urban-heat' && "High resolution satellite thermal data detects massive Urban Heat Island retention. Surface temperatures vastly exceed ambient air temps."}
                                {activeLayer === 'flash-flood' && "Stalled front combined with impervious urban surfaces causing massive localized flash flooding. Rescue teams on standby."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Weather News / Bulletins */}
            <h3 style={{ marginTop: '2rem', marginBottom: '1rem', color: '#f0f2f5', fontSize: '1.2rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                🔥 Hyperlocal Heat Alerts & Insights
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div 
                    className="panel-card" 
                    style={{ display: 'flex', gap: '1rem', alignItems: 'center', cursor: 'pointer', border: activeLayer === 'flash-flood' ? '1px solid #3b82f6' : '' }}
                    onClick={() => setActiveLayer('flash-flood')}
                >
                    <div style={{ fontSize: '2rem', padding: '0 0.5rem' }}>🌧️</div>
                    <div>
                        <h4 style={{ margin: '0 0 0.4rem 0', color: '#3b82f6', fontSize: '1rem' }}>Extreme Heat Dome Traps Setup</h4>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#a3abbb', lineHeight: '1.4' }}>Stalled front and southern heat dome are trapping heavy localized humidity fueling severe flash flood risks across multiple vulnerable counties. (Click to view on map)</p>
                    </div>
                </div>
                <div 
                    className="panel-card" 
                    style={{ display: 'flex', gap: '1rem', alignItems: 'center', cursor: 'pointer', border: activeLayer === 'urban-heat' ? '1px solid #f93e3e' : '' }}
                    onClick={() => setActiveLayer('urban-heat')}
                >
                    <div style={{ fontSize: '2rem', padding: '0 0.5rem' }}>🏙️</div>
                    <div>
                        <h4 style={{ margin: '0 0 0.4rem 0', color: '#f93e3e', fontSize: '1rem' }}>Urban Heat Island Intensification</h4>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#a3abbb', lineHeight: '1.4' }}>Dense urban zones are retaining 3.8°C above rural baselines overnight. Phoenix corridor shows extreme persistence factor of 0.84 — critical for ESG compliance and infrastructure resilience. (Click to view on map)</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThermalGrid;
