import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import './RouteMap.css';

delete L.Icon.Default.prototype._getIconUrl;

const stopIcon = (idx, danger, isDriver = false) => L.divIcon({
    className: 'custom-marker',
    html: `<div style="
    width:${isDriver ? 34 : 28}px;height:${isDriver ? 34 : 28}px;border-radius:50%;
    display:flex;align-items:center;justify-content:center;
    font-weight:bold;font-size:${isDriver ? 16 : 12}px;color:#fff;
    background:${isDriver ? '#3b82f6' : danger ? '#f93e3e' : '#2bd4c6'};
    border:3px solid ${isDriver ? '#93c5fd' : danger ? '#ff9a9a' : '#a0ffe8'};
    box-shadow:0 0 12px ${isDriver ? 'rgba(59,130,246,0.8)' : danger ? 'rgba(249,62,62,0.6)' : 'rgba(43,212,198,0.5)'};
    z-index: ${isDriver ? 1000 : 1};
  ">${isDriver ? '🚚' : idx + 1}</div>`,
    iconSize: [isDriver ? 34 : 28, isDriver ? 34 : 28],
    iconAnchor: [isDriver ? 17 : 14, isDriver ? 17 : 14],
    popupAnchor: [0, -16]
});

// Component to handle recentering via button
const RecenterControl = ({ positions }) => {
    const map = useMap();

    // Also fit bounds initially
    useEffect(() => {
        if (positions && positions.length > 0) {
            const bounds = L.latLngBounds(positions);
            map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
        }
    }, [positions, map]);

    const handleRecenter = () => {
        if (positions && positions.length > 0) {
            const bounds = L.latLngBounds(positions);
            map.flyToBounds(bounds, { padding: [60, 60], duration: 1.5 });
        }
    };

    const handleDriverLocate = () => {
        if (positions && positions.length > 0) {
            map.flyTo(positions[0], 15, { duration: 1.5 });
        }
    };

    const handleMyGeolocation = () => {
        map.locate({ setView: true, maxZoom: 15, duration: 1.5 });
        map.once('locationfound', (e) => {
            L.circleMarker(e.latlng, { radius: 8, color: '#f93e3e', fillColor: '#f93e3e', fillOpacity: 0.5 }).addTo(map)
                .bindPopup('Your Current Location').openPopup();
        });
    };

    return (
        <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button onClick={handleMyGeolocation} style={{
                background: '#101318', color: '#ffd700', border: '1px solid rgba(255,255,255,0.2)',
                padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold',
                boxShadow: '0 4px 6px rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', gap: '6px'
            }}>
                📍 Find My Location
            </button>
            <button onClick={handleRecenter} style={{
                background: 'rgba(15,17,21,0.9)', color: '#f0f2f5', border: '1px solid rgba(255,255,255,0.2)',
                padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold',
                boxShadow: '0 4px 6px rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', gap: '6px'
            }}>
                🛣️ Recenter Route
            </button>
            <button onClick={handleDriverLocate} style={{
                background: '#3b82f6', color: '#fff', border: 'none',
                padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold',
                boxShadow: '0 4px 6px rgba(59,130,246,0.4)', display: 'flex', alignItems: 'center', gap: '6px'
            }}>
                🚚 Locate Driver
            </button>
        </div>
    );
};

const RouteMap = ({ isPlanning, plotPoints }) => {
    const coords = (plotPoints || []).map(p => [p.lat, p.lng]);

    return (
        <div className="route-map-container" style={{ padding: 0, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginTop: '1.5rem' }}>
            <div style={{ height: '420px', position: 'relative' }}>
                <MapContainer
                    center={[33.4852, -111.9077]}
                    zoom={11}
                    scrollWheelZoom={true}
                    zoomControl={true}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        attribution='&copy; <a href="https://www.esri.com/">Esri</a> World Imagery'
                    />

                    {isPlanning && plotPoints && plotPoints.map((pt, idx) => (
                        <Marker key={idx} position={[pt.lat, pt.lng]} icon={stopIcon(idx, pt.danger, false)}>
                            <Popup>
                                <div style={{ minWidth: 180 }}>
                                    <b>Stop {idx + 1}</b><br />
                                    {pt.label}<br />
                                    <span style={{ fontSize: '0.8em', color: pt.danger ? '#f93e3e' : '#2bd4c6' }}>
                                        {pt.danger ? '⚠️ High heat-exposure zone' : '✅ Safe zone'}
                                    </span>
                                </div>
                            </Popup>
                        </Marker>
                    ))}

                    {/* Simulated Driver Marker at Stop 1 */}
                    {isPlanning && coords.length > 0 && (
                        <Marker position={coords[0]} icon={stopIcon(0, false, true)}>
                            <Popup>
                                <b>🚚 Live GPS: TRUCK-842</b><br />Current Temp: 42°C<br />Status: En route
                            </Popup>
                        </Marker>
                    )}

                    {isPlanning && coords.length > 1 && (
                        <Polyline
                            pathOptions={{ color: '#2bd4c6', weight: 4, dashArray: '12, 8', opacity: 0.9 }}
                            positions={coords}
                        />
                    )}

                    {isPlanning && coords.length > 0 && <RecenterControl positions={coords} />}
                </MapContainer>

                {/* Map legend / explainer */}
                <div style={{
                    position: 'absolute', bottom: 12, left: 12, zIndex: 1000,
                    background: 'rgba(15,17,21,0.85)', backdropFilter: 'blur(8px)',
                    borderRadius: 8, padding: '0.6rem 1rem', fontSize: '0.72rem', color: '#a3abbb',
                    border: '1px solid rgba(255,255,255,0.08)', maxWidth: 250
                }}>
                    <div style={{ fontWeight: 600, color: '#f0f2f5', marginBottom: 4 }}>Route Controls</div>
                    <div>🖱️ Scroll to <b>zoom in/out</b></div>
                    <div>↕️ Drag to <b>pan the view</b></div>
                    <div style={{ marginTop: 4, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 4 }}>
                        <span style={{ color: '#2bd4c6' }}>●</span> Safe zone&nbsp;&nbsp;
                        <span style={{ color: '#f93e3e' }}>●</span> High heat
                        <div style={{ color: '#3b82f6', marginTop: 2 }}>🚚 Live Driver Location</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RouteMap;
