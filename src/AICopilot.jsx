import React, { useState } from 'react';

const PROMPTS = [
    {
        label: 'Run Public Asset Heat Audit',
        icon: '🏛️',
        result: {
            title: 'Phoenix City Hall — Heat Audit Report',
            temp_reduction: '−3.2°C / −5.8°F',
            risk_mitigation_score: 74,
            roi: '$142,000 / yr savings',
            carbon_offset: '28.4 t CO₂e / yr',
            recommendation: 'Retrofit rooftop with cool-white membrane (SRI ≥ 82). Install automated shading on south façade. Priority: HIGH.',
        },
    },
    {
        label: 'Simulate Cool-Roof Intervention (−2.5°C Target)',
        icon: '🏠',
        result: {
            title: 'Cool-Roof Thermal Simulation',
            temp_reduction: '−2.6°C / −4.7°F',
            risk_mitigation_score: 61,
            roi: '$89,500 / yr energy savings',
            carbon_offset: '19.1 t CO₂e / yr',
            recommendation: 'A high-albedo coating achieves target. Payback period: 3.2 years. Include vegetated perimeter for +0.4°C bonus reduction.',
        },
    },
    {
        label: 'Calculate Cooling Cost & PUE Optimization',
        icon: '⚡',
        result: {
            title: 'Data Center Cooling Cost Analysis',
            temp_reduction: '−1.8°C ambient / −3.2°F',
            risk_mitigation_score: 83,
            roi: '$267,000 / yr PUE improvement',
            carbon_offset: '54.2 t CO₂e / yr',
            recommendation: 'Shift workloads 06:00–10:00 local (coolest window). Enable free-air economisation when ambient < 18°C. PUE target: 1.15 achievable.',
        },
    },
];

const AICopilot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeResult, setActiveResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(false);

    const runPrompt = async (prompt) => {
        setLoading(true);
        setActiveResult(null);
        setApiError(false);
        
        try {
            const response = await fetch('https://api.fortyguard.com/v1/heat-intelligence', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.VITE_FORTYGUARD_API_KEY}`
                },
                body: JSON.stringify({ query: prompt.query })
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            // const data = await response.json();
            setActiveResult(prompt.result); // Use mock result if API worked (it won't in this sandbox)
        } catch (error) {
            console.error("FortyGuard AI Copilot Failed:", error.message);
            setApiError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Floating trigger button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'fixed', bottom: '80px', right: '20px', zIndex: 9000,
                    background: 'linear-gradient(135deg, #ff6d3a 0%, #f93e3e 100%)',
                    border: 'none', borderRadius: '50%', width: '52px', height: '52px',
                    cursor: 'pointer', boxShadow: '0 4px 20px rgba(249,62,62,0.5)',
                    fontSize: '1.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'transform 0.2s',
                }}
                title="FortyGuard AI Copilot"
            >
                🤖
            </button>

            {/* Copilot Drawer */}
            {isOpen && (
                <div style={{
                    position: 'fixed', bottom: '145px', right: '20px', zIndex: 9000,
                    width: '380px', maxHeight: '78vh',
                    background: 'rgba(16, 19, 24, 0.97)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(249, 62, 62, 0.35)',
                    borderRadius: '16px',
                    boxShadow: '0 16px 60px rgba(0,0,0,0.7)',
                    display: 'flex', flexDirection: 'column',
                    overflow: 'hidden',
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)',
                        background: 'linear-gradient(90deg, rgba(249,62,62,0.12) 0%, transparent 100%)',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontSize: '0.65rem', color: '#f93e3e', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 700 }}>
                                    FortyGuard Temperature AI
                                </div>
                                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f0f2f5', marginTop: '2px' }}>
                                    AI Copilot Agent
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#2bd4c6', animation: 'pulse 2s infinite' }}></div>
                                <span style={{ fontSize: '0.7rem', color: '#2bd4c6' }}>Online</span>
                                <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#a3abbb', cursor: 'pointer', fontSize: '1.1rem', marginLeft: '8px' }}>✕</button>
                            </div>
                        </div>
                        <p style={{ margin: '0.5rem 0 0', fontSize: '0.75rem', color: '#8b92a5' }}>
                            Hyperlocal thermal intelligence. Select an action to generate a structured analysis report.
                        </p>
                    </div>

                    {/* Prompt Chips */}
                    <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ fontSize: '0.65rem', color: '#8b92a5', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.6rem' }}>
                            Action Prompts
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {PROMPTS.map((p) => (
                                <button key={p.label} onClick={() => runPrompt(p)} style={{
                                    background: loading ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px', padding: '0.65rem 1rem',
                                    color: '#f0f2f5', cursor: 'pointer', textAlign: 'left',
                                    fontSize: '0.82rem', fontWeight: 600,
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    transition: 'all 0.15s',
                                }}>
                                    <span>{p.icon}</span> {p.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Result Output */}
                    <div style={{ padding: '1rem 1.25rem', overflowY: 'auto', flex: 1 }}>
                        {loading && (
                            <div style={{ textAlign: 'center', padding: '1rem', color: '#8b92a5', fontSize: '0.85rem' }}>
                                <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>⚙️</div>
                                Running FortyGuard AI analysis…
                            </div>
                        )}
                        {!loading && apiError && (
                            <div style={{ textAlign: 'center', padding: '1rem', color: '#f93e3e', fontSize: '0.85rem' }}>
                                <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>⚠️</div>
                                <div>FortyGuard API Connection Failed.</div>
                                <div style={{ fontSize: '0.75rem', marginTop: '4px', color: '#ffb3b3' }}>Live AI analysis unavailable.</div>
                            </div>
                        )}
                        {!loading && !apiError && !activeResult && (
                            <div style={{ textAlign: 'center', padding: '1rem', color: '#8b92a5', fontSize: '0.8rem' }}>
                                Select an action prompt above to generate an AI analysis report.
                            </div>
                        )}
                        {!loading && activeResult && (
                            <div>
                                <div style={{ fontSize: '0.7rem', color: '#2bd4c6', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
                                    Analysis Report
                                </div>
                                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f0f2f5', marginBottom: '1rem' }}>
                                    {activeResult.title}
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '1rem' }}>
                                    {[
                                        { label: 'Temp Reduction', val: activeResult.temp_reduction, color: '#2bd4c6' },
                                        { label: 'Risk Score', val: `${activeResult.risk_mitigation_score}/100`, color: '#10b981' },
                                        { label: 'Est. ROI', val: activeResult.roi, color: '#ffd700' },
                                        { label: 'Carbon Offset', val: activeResult.carbon_offset, color: '#8b5cf6' },
                                    ].map(m => (
                                        <div key={m.label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '0.65rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                                            <div style={{ fontSize: '0.65rem', color: '#8b92a5', marginBottom: '4px' }}>{m.label}</div>
                                            <div style={{ fontWeight: 700, color: m.color, fontSize: '0.9rem' }}>{m.val}</div>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '8px', padding: '0.75rem' }}>
                                    <div style={{ fontSize: '0.65rem', color: '#3b82f6', textTransform: 'uppercase', marginBottom: '4px' }}>AI Recommendation</div>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#a3abbb', lineHeight: '1.5' }}>{activeResult.recommendation}</p>
                                </div>


                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default AICopilot;
