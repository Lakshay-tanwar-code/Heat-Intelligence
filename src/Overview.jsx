import React, { useState, useEffect } from 'react';
import './RouteDashboard.css';

const Overview = ({ setActiveProduct }) => {
    const [latency, setLatency] = useState(42);
    const [credits] = useState(999999);

    useEffect(() => {
        const interval = setInterval(() => {
            setLatency(Math.floor(36 + Math.random() * 20));
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="dashboard-wrapper">
            {/* ─── Hero Header ─── */}
            <div style={{ marginBottom: '2.5rem' }}>
                {/* Badge row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{
                            background: 'rgba(249, 62, 62, 0.15)', border: '1px solid rgba(249,62,62,0.4)',
                            color: '#f93e3e', fontSize: '0.65rem', fontWeight: 700, padding: '4px 12px',
                            borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '1.5px',
                        }}>
                            FortyGuard Cloud Platform • Hackathon'26 Prototype
                        </span>
                    </div>
                    {/* Live API Status bar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(43,212,198,0.08)', border: '1px solid rgba(43,212,198,0.25)', borderRadius: '20px', padding: '4px 12px' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2bd4c6', boxShadow: '0 0 8px #2bd4c6' }}></div>
                            <span style={{ fontSize: '0.68rem', color: '#2bd4c6', fontWeight: 600 }}>Status: 200 OK • Async Stream Synced</span>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '4px 12px', fontSize: '0.68rem', color: '#a3abbb', fontWeight: 600 }}>
                            Credits: {credits.toLocaleString()}
                        </div>
                        <div style={{ background: 'rgba(255, 215, 0, 0.08)', border: '1px solid rgba(255,215,0,0.2)', borderRadius: '20px', padding: '4px 12px', fontSize: '0.68rem', color: '#ffd700', fontWeight: 600 }}>
                            Latency: {latency}ms
                        </div>
                    </div>
                </div>

                {/* Main title */}
                <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#f0f2f5', lineHeight: 1.1, margin: '0 0 0.35rem 0' }}>
                    Every weather API gives you the city.<br />
                    <span style={{ color: 'var(--accent-orange)' }}>We give you the asset.</span>
                </h2>
                <p style={{ margin: '0 0 0.5rem', fontSize: '0.95rem', maxWidth: '820px', lineHeight: 1.6, color: '#a3abbb' }}>
                    Hyperlocal street-level temperature intelligence (2m above ground, 10 mi² resolution) fused with real-time urban infrastructure analytics.
                </p>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#8b92a5' }}>
                    Powered by FortyGuard Temperature API • 10mi² Hyperlocal Resolution • 2m Above Ground
                </p>
            </div>

            {/* ─── Product Grid ─── */}
            <div style={{ fontSize: '0.65rem', color: '#8b92a5', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 700, marginBottom: '1rem' }}>
                Commercial Suite
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                {[
                    { key: 'ThermalGrid', icon: '⚡', iconColor: '#ffd700', iconBg: 'rgba(255,215,0,0.15)', sectorColor: '#ffd700', sector: 'DATA CENTERS', desc: 'Hourly PUE & cooling-cost forecast, free-cooling/water modelling, and carbon-aware "follow-the-cold" compute scheduling.' },
                    { key: 'GridPeak', icon: '🔌', iconColor: '#3b82f6', iconBg: 'rgba(59,130,246,0.15)', sectorColor: '#3b82f6', sector: 'UTILITIES / GRID', desc: 'Cooling-driven peak demand, transformer thermal overload risk, real cloud-aware solar generation and the duck-curve net peak.' },
                    { key: 'ColdRoute', icon: '🚚', iconColor: 'var(--accent-orange)', iconBg: 'var(--accent-orange-dim)', sectorColor: 'var(--accent-orange)', sector: 'LOGISTICS / COLD CHAIN', desc: 'Geocoded multi-stop routes with per-stop cargo exposure scoring and OSHA/WBGT worker heat-safety along the real road network.' },
                    { key: 'ThermalScore', icon: '🏷️', iconColor: '#ffcc80', iconBg: 'rgba(255,204,128,0.15)', sectorColor: '#ffcc80', sector: 'INSURANCE / FINANCE', desc: 'A 0-100 "FICO of heat" asset index plus parametric-trigger settlement across a full US property portfolio.' },
                    { key: 'CoolScope', icon: '🌳', iconColor: '#10b981', iconBg: 'rgba(16,185,129,0.15)', sectorColor: '#10b981', sector: 'CITIES & ESG', desc: 'Diagnose the urban heat island from FortyGuard heatmap + satellite, simulate trees/cool-roofs/pavement, and quantify ROI.' },
                    { key: 'CarbonLens', icon: '🫁', iconColor: '#8b5cf6', iconBg: 'rgba(139,92,246,0.15)', sectorColor: '#8b5cf6', sector: 'ESG / AIR QUALITY', desc: 'Heat x air-quality compound-risk and emissions signals — AQI, pollutants & carbon from FortyGuard call.' },
                ].map(prod => (
                    <div key={prod.key}
                        className="panel-card"
                        style={{ borderTop: `3px solid ${prod.sectorColor}`, cursor: 'pointer', transition: 'transform 0.2s', padding: '2rem' }}
                        onClick={() => setActiveProduct(prod.key)}
                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                            <div className="logo-icon" style={{ background: prod.iconBg, color: prod.iconColor, boxShadow: 'none' }}>{prod.icon}</div>
                            <div>
                                <div style={{ fontSize: '0.7rem', color: '#8b92a5', textTransform: 'uppercase', fontWeight: 600 }}>{prod.sector}</div>
                                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f0f2f5' }}>{prod.key}</div>
                            </div>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#a3abbb', marginBottom: '1.5rem', minHeight: '60px' }}>{prod.desc}</p>
                        <div style={{ color: 'var(--accent-teal)', fontSize: '0.9rem', fontWeight: 600 }}>Open product →</div>
                    </div>
                ))}
            </div>

            {/* ─── Addressed Core Use Cases ─── */}
            <div style={{ marginTop: '3rem' }}>
                <div style={{ fontSize: '0.65rem', color: '#8b92a5', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 700, marginBottom: '1rem' }}>
                    🎯 Verified Platform Use Cases
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
                    {[
                        {
                            title: 'Climate-Aware Infrastructure Planning',
                            tag: 'GridPeak & Utilities',
                            desc: 'Use temperature intelligence and environmental parameters to design and maintain roads, bridges, and public utilities that withstand long-term heat stress and reduce maintenance costs.',
                            icon: '🏗️',
                            product: 'GridPeak'
                        },
                        {
                            title: 'Property & Asset Intelligence',
                            tag: 'ThermalScore & CoolScope',
                            desc: 'Generate property-level heat performance reports to assess livability, operational efficiency, and financial risk—supporting ESG appraisals and investment decisions.',
                            icon: '🏢',
                            product: 'ThermalScore'
                        },
                        {
                            title: 'Research & Climate Innovation',
                            tag: 'API Inspector & AI Copilot',
                            desc: 'Provide APIs and data layers for universities, consultants, and innovators building AI models or digital twins focused on urban heat, sustainability, and material resilience.',
                            icon: '🔬',
                            product: 'Overview'
                        },
                        {
                            title: 'Environmental & Health Monitoring',
                            tag: 'CarbonLens & ColdRoute',
                            desc: 'Track apparent temperature, air quality, and humidity to power early warning systems for heat stress, pollution exposure, or extreme weather risk.',
                            icon: '🫁',
                            product: 'CarbonLens'
                        },
                        {
                            title: 'Smart Mobility & Logistics',
                            tag: 'ColdRoute Logistics',
                            desc: 'Integrate thermal comfort-based routing and forecasted heat zones into transportation systems or delivery networks to optimize routes, reduce energy consumption, and improve worker safety.',
                            icon: '🚚',
                            product: 'ColdRoute'
                        },
                        {
                            title: 'Urban Design & Public Space Optimization',
                            tag: 'CoolScope & Simulator',
                            desc: 'Leverage heat data and street-level analytics to model microclimates, improve outdoor comfort, and guide placement of vegetation, shading, or cooling features in city design.',
                            icon: '🌳',
                            product: 'CoolScope'
                        },
                        {
                            title: 'Energy & Climate Systems Planning',
                            tag: 'GridPeak & ThermalGrid',
                            desc: 'Combine irradiance, temperature, and humidity data to forecast energy demand, optimize renewable placement, and support district cooling or energy resilience strategies.',
                            icon: '⚡',
                            product: 'GridPeak'
                        }
                    ].map((uc, i) => (
                        <div key={i} className="panel-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => uc.product !== 'Overview' && setActiveProduct(uc.product)}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                    <span style={{ fontSize: '1.4rem' }}>{uc.icon}</span>
                                    <span style={{ fontSize: '0.62rem', padding: '3px 8px', borderRadius: '12px', background: 'rgba(43,212,198,0.1)', color: '#2bd4c6', border: '1px solid rgba(43,212,198,0.3)', fontWeight: 600 }}>{uc.tag}</span>
                                </div>
                                <h4 style={{ color: '#f0f2f5', margin: '0 0 0.4rem 0', fontSize: '0.95rem', fontWeight: 700 }}>{uc.title}</h4>
                                <p style={{ color: '#a3abbb', fontSize: '0.8rem', lineHeight: 1.5, margin: 0 }}>{uc.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Overview;
