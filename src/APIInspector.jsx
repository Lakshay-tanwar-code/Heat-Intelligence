import React, { useState, useEffect } from 'react';

const BASE_PAYLOAD = {
    location: 'Phoenix, AZ',
    coordinates: { lat: 33.4484, lng: -112.0740 },
    temperature_f: 112.0,
    temperature_c: 44.4,
    risk_level: 'extreme',
    layer: 'snapshot',
    resolution: '10mi²',
    measured_at: '2m above ground',
    analysis: {
        heat_island_intensity: '+3.8°C',
        exceedance_hours_today: 8.5,
        persistence_factor: 0.84,
    },
    credits_remaining: 999999,
};

const APIInspector = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [latency, setLatency] = useState(42);
    const [tick, setTick] = useState(0);
    const [timestamp, setTimestamp] = useState(new Date().toISOString());

    useEffect(() => {
        const interval = setInterval(() => {
            setLatency(Math.floor(38 + Math.random() * 18));
            setTimestamp(new Date().toISOString());
            setTick(t => t + 1);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const payload = { ...BASE_PAYLOAD, requested_at: timestamp, latency_ms: latency };

    return (
        <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 8000,
            background: 'rgba(10, 12, 16, 0.98)',
            backdropFilter: 'blur(16px)',
            borderTop: '1px solid rgba(43, 212, 198, 0.25)',
            transition: 'height 0.3s ease',
            height: isOpen ? '320px' : '40px',
            overflow: 'hidden',
            fontFamily: 'monospace',
        }}>
            {/* Collapsed bar */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    height: '40px', display: 'flex', alignItems: 'center',
                    padding: '0 1.5rem', cursor: 'pointer', gap: '12px',
                    userSelect: 'none',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                        width: '7px', height: '7px', borderRadius: '50%', background: '#2bd4c6',
                        boxShadow: '0 0 8px #2bd4c6',
                        animation: 'pulse 1.5s infinite',
                    }}></div>
                    <span style={{ color: '#2bd4c6', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.5px' }}>
                        Data Stream: Synced
                    </span>
                </div>
                <span style={{ color: '#8b92a5', fontSize: '0.72rem' }}>|</span>
                <span style={{ color: '#a3abbb', fontSize: '0.72rem' }}>
                    <span style={{ color: '#10b981' }}>POST</span> /v1/heat-intelligence
                </span>
                <span style={{ color: '#8b92a5', fontSize: '0.72rem' }}>|</span>
                <span style={{ color: '#ffd700', fontSize: '0.72rem' }}>Latency: {latency}ms</span>
                <span style={{ color: '#8b92a5', fontSize: '0.72rem' }}>|</span>
                <span style={{ color: '#a3abbb', fontSize: '0.72rem' }}>Credits remaining: 999,999</span>
                <span style={{ color: '#8b92a5', fontSize: '0.72rem', marginLeft: 'auto' }}>
                    {isOpen ? '▼ Collapse' : '▲ Expand'} FortyGuard API Inspector
                </span>
            </div>

            {/* Expanded content */}
            <div style={{ display: 'flex', height: '280px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>

                {/* Left: Request */}
                <div style={{ flex: 1, padding: '1rem 1.5rem', overflowY: 'auto', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
                        <span style={{ background: '#10b981', color: '#000', fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>POST</span>
                        <span style={{ color: '#2bd4c6', fontSize: '0.75rem' }}>https://api.fortyguard.com/v1/heat-intelligence</span>
                    </div>
                    <div style={{ fontSize: '0.65rem', color: '#8b92a5', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Request Payload</div>
                    <pre style={{ margin: 0, fontSize: '0.68rem', color: '#4ade80', lineHeight: '1.6' }}>
                        {`POST /v1/heat-intelligence HTTP/1.1
Host: api.fortyguard.com
Authorization: Bearer 06ec39d162e2a3fc5bc6291986c41b84
Content-Type: application/json

{
  "location": "Phoenix, AZ",
  "lat": 33.4484,
  "lng": -112.0740,
  "layer": "snapshot",
  "resolution": "10mi²",
  "height": "2m",
  "timestamp": "${timestamp}"
}`}
                    </pre>
                </div>

                {/* Right: Response */}
                <div style={{ flex: 1.2, padding: '1rem 1.5rem', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
                        <span style={{ background: '#2bd4c6', color: '#000', fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>200 OK</span>
                        <span style={{ color: '#8b92a5', fontSize: '0.7rem' }}>{latency}ms</span>
                        <span style={{ color: '#8b92a5', fontSize: '0.7rem', marginLeft: 'auto' }}>Tick #{tick} — auto-refreshing</span>
                    </div>
                    <div style={{ fontSize: '0.65rem', color: '#8b92a5', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Response</div>
                    <pre style={{ margin: 0, fontSize: '0.68rem', color: '#93c5fd', lineHeight: '1.6' }}>
                        {JSON.stringify(payload, null, 2)}
                    </pre>
                </div>

                {/* Right gutter: status badges */}
                <div style={{ width: '180px', padding: '1rem', borderLeft: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                        { label: 'Status', val: '200 OK', color: '#2bd4c6' },
                        { label: 'Latency', val: `${latency}ms`, color: '#ffd700' },
                        { label: 'Risk Level', val: 'EXTREME', color: '#f93e3e' },
                        { label: 'Temp (°F)', val: '112.0°F', color: '#ff6d3a' },
                        { label: 'Credits', val: '999,999', color: '#10b981' },
                        { label: 'Stream', val: 'ACTIVE', color: '#2bd4c6' },
                    ].map(m => (
                        <div key={m.label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '6px', padding: '6px 10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ fontSize: '0.58rem', color: '#8b92a5', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{m.label}</div>
                            <div style={{ fontWeight: 700, color: m.color, fontSize: '0.8rem' }}>{m.val}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default APIInspector;
