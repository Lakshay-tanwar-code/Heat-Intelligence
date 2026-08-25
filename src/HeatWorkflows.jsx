import React, { useState, useRef, useEffect } from 'react';
import './RouteDashboard.css';

const TRIGGERS = [
    { id: 'temp', icon: '🌡️', label: 'Heat > 40°C', desc: 'FortyGuard API: Temperature exceeds critical threshold' },
    { id: 'risk', icon: '⚠️', label: 'Risk == Extreme', desc: 'FortyGuard API: Risk level classified as Extreme' },
    { id: 'persist', icon: '♾️', label: 'Persistence > 0.8', desc: 'FortyGuard API: Heat persistence factor exceeds threshold' },
    { id: 'exceed', icon: '🔥', label: 'Exceedance > 6hrs', desc: 'FortyGuard API: Daily exceedance hours exceeded' },
];

const CONDITIONS = [
    { id: 'phoenix', icon: '📍', label: 'Location = Phoenix Hub', desc: 'Asset location matches Phoenix Metro Zone' },
    { id: 'datacenter', icon: '🖥️', label: 'Asset = Data Center', desc: 'Target asset is a Tier-3 data center facility' },
    { id: 'construction', icon: '🏗️', label: 'Asset = Construction Site A', desc: 'Active construction with outdoor workers present' },
    { id: 'fleet', icon: '🚚', label: 'Fleet = Active Routes', desc: 'Cold-chain logistics vehicles are currently dispatched' },
];

const ACTIONS = [
    { id: 'hvac', icon: '❄️', label: 'Trigger HVAC Pre-Cooling', desc: 'POST to HVAC controller API — set setpoint to 18°C', color: '#3b82f6' },
    { id: 'slack', icon: '💬', label: 'Send Slack Alert', desc: 'POST to Slack webhook — notify Fleet Managers channel', color: '#10b981' },
    { id: 'sms', icon: '📱', label: 'SMS Site Manager', desc: 'POST to Twilio — halt work order + safety protocol', color: '#ffd700' },
    { id: 'webhook', icon: '🔗', label: 'Trigger Custom Webhook', desc: 'POST /enterprise/webhook — route data to internal ERP', color: '#8b5cf6' },
    { id: 'api', icon: '⚡', label: 'Dispatch Grid Reserve', desc: 'POST to Grid API — pre-activate demand response reserve', color: '#f93e3e' },
];

const NODE_COLORS = {
    trigger: { bg: 'rgba(249,62,62,0.12)', border: 'rgba(249,62,62,0.4)', accent: '#f93e3e', label: 'TRIGGER' },
    condition: { bg: 'rgba(255,215,0,0.1)', border: 'rgba(255,215,0,0.35)', accent: '#ffd700', label: 'CONDITION' },
    action: { bg: 'rgba(43,212,198,0.1)', border: 'rgba(43,212,198,0.35)', accent: '#2bd4c6', label: 'ACTION' },
};

const NodeCard = ({ type, item, onRemove }) => {
    const c = NODE_COLORS[type];
    return (
        <div style={{
            background: c.bg, border: `2px solid ${c.border}`,
            borderRadius: '12px', padding: '1rem', position: 'relative',
            minWidth: '200px', maxWidth: '220px',
            boxShadow: `0 0 20px ${c.border}`,
        }}>
            <div style={{ fontSize: '0.58rem', color: c.accent, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '6px' }}>
                {c.label}
            </div>
            <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>{item.icon}</div>
            <div style={{ fontWeight: 700, color: '#f0f2f5', fontSize: '0.85rem', marginBottom: '4px', lineHeight: 1.2 }}>{item.label}</div>
            <div style={{ fontSize: '0.7rem', color: '#8b92a5', lineHeight: 1.4 }}>{item.desc}</div>
            <button onClick={onRemove} style={{
                position: 'absolute', top: '8px', right: '8px',
                background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%',
                width: '20px', height: '20px', cursor: 'pointer', color: '#a3abbb', fontSize: '0.7rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>✕</button>
        </div>
    );
};

const ConnectionLine = ({ color = '#2bd4c6' }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, padding: '0 4px' }}>
        <div style={{ width: '2px', height: '30px', background: `linear-gradient(to bottom, ${color}88, ${color})`, position: 'relative' }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '6px', height: '6px', borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}` }}></div>
        </div>
        <div style={{ color, fontSize: '1rem', lineHeight: 1 }}>▼</div>
    </div>
);

const HeatWorkflows = () => {
    const [trigger, setTrigger] = useState(null);
    const [condition, setCondition] = useState(null);
    const [action, setAction] = useState(null);
    const [deploying, setDeploying] = useState(false);
    const [deployed, setDeployed] = useState(false);
    const [draggingId, setDraggingId] = useState(null);
    const [liveResponse, setLiveResponse] = useState(null);
    const [activeToast, setActiveToast] = useState(null);

    const handleDragStart = (e, id) => {
        e.dataTransfer.setData('nodeId', id);
        setDraggingId(id);
    };
    const handleDragEnd = () => setDraggingId(null);

    const makeDrop = (collection, setter) => ({
        onDrop: (e) => {
            e.preventDefault();
            const id = e.dataTransfer.getData('nodeId');
            const found = collection.find(x => x.id === id);
            if (found) { setter(found); setDeployed(false); }
        },
        onDragOver: (e) => e.preventDefault(),
    });

    const deployFlow = async () => {
        if (!trigger || !condition || !action) return;
        setDeploying(true);
        setLiveResponse(null);

        const payload = {
            trigger: { type: "FortyGuardAPI", condition: trigger.label },
            filter: { location: condition.label },
            action: { type: `${action.icon} ${action.label}`, endpoint: "POST /enterprise/webhook" },
            auth: { fortyguard_key: "06ec39d162e2a3fc5bc6291986c41b84" },
            status: "active",
            credits_used: 1,
            timestamp: new Date().toISOString()
        };

        try {
            const res = await fetch('https://httpbin.org/post', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();

            // httpbin returns the JSON body inside `data.data` (as string) or `data.json` (as object)
            // It also returns latency/headers.
            setLiveResponse({
                status: res.status,
                headers_echo: data.headers,
                payload_echo: data.json,
                url: data.url
            });
        } catch (e) {
            console.error(e);
        }

        setDeploying(false);
        setDeployed(true);

        // Execute the visual task in the app after 3.5 seconds
        setTimeout(() => {
            setActiveToast({
                actionType: action.id,
                title: action.label,
                message: `Condition met: ${trigger.label} at ${condition.label}`
            });
            // Auto hide after 8s
            setTimeout(() => setActiveToast(null), 8000);
        }, 3500);
    };

    const isReady = trigger && condition && action;

    const renderToast = () => {
        if (!activeToast) return null;
        return (
            <div style={{
                position: 'fixed', top: '24px', right: '24px', zIndex: 9999,
                background: 'rgba(10, 12, 16, 0.95)', backdropFilter: 'blur(12px)',
                border: '1px solid rgba(43,212,198,0.4)', borderRadius: '12px',
                padding: '1.2rem 1.5rem', width: '340px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(43,212,198,0.2)',
                animation: 'slideInRight 0.4s ease-out forwards',
                display: 'flex', gap: '16px'
            }}>
                <div style={{ fontSize: '2rem' }}>
                    {activeToast.actionType === 'slack' ? '💬' : activeToast.actionType === 'hvac' ? '❄️' : activeToast.actionType === 'sms' ? '📱' : '⚡'}
                </div>
                <div>
                    <div style={{ fontSize: '0.65rem', color: '#2bd4c6', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px', fontWeight: 800 }}>
                        Automation Triggered!
                    </div>
                    <div style={{ fontSize: '1rem', color: '#fff', fontWeight: 700, marginBottom: '6px' }}>
                        {activeToast.title}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#a3abbb', lineHeight: 1.4 }}>
                        {activeToast.message}
                    </div>
                </div>
                <button onClick={() => setActiveToast(null)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', color: '#8b92a5', cursor: 'pointer' }}>✕</button>
                <style>{`
                    @keyframes slideInRight {
                        from { transform: translateX(120%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                `}</style>
            </div>
        );
    };

    return (
        <div className="dashboard-wrapper">
            {renderToast()}
            <div className="dashboard-header" style={{ marginBottom: '1.5rem' }}>
                <div className="title-section">
                    <h1>
                        ⚡ Automated Heat Workflows
                        <span className="tag" style={{ marginLeft: '12px' }}>No-Code API Trigger Builder</span>
                    </h1>
                    <p>Design autonomous FortyGuard-powered automation flows — inspired by Tomorrow.io Gale. Drag nodes to build smart rules that route live heat data into real enterprise actions.</p>
                </div>
                <div className="header-status">
                    <div className="dot" style={{ background: '#2bd4c6' }}></div> FortyGuard API Engine Active
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1.5rem' }}>

                {/* Left Palette */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Triggers */}
                    <div className="panel-card" style={{ padding: '1rem' }}>
                        <div style={{ fontSize: '0.62rem', color: '#f93e3e', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
                            🌡️ Triggers
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {TRIGGERS.map(t => (
                                <div key={t.id} draggable onDragStart={(e) => handleDragStart(e, t.id)} onDragEnd={handleDragEnd}
                                    style={{
                                        background: draggingId === t.id ? 'rgba(249,62,62,0.15)' : 'rgba(249,62,62,0.07)',
                                        border: '1px solid rgba(249,62,62,0.25)', borderRadius: '8px',
                                        padding: '7px 10px', cursor: 'grab', display: 'flex', alignItems: 'center', gap: '8px',
                                        opacity: trigger?.id === t.id ? 0.4 : 1, transition: 'all 0.15s', userSelect: 'none',
                                    }}>
                                    <span>{t.icon}</span>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#f0f2f5' }}>{t.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Conditions */}
                    <div className="panel-card" style={{ padding: '1rem' }}>
                        <div style={{ fontSize: '0.62rem', color: '#ffd700', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
                            🎯 Conditions
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {CONDITIONS.map(c => (
                                <div key={c.id} draggable onDragStart={(e) => handleDragStart(e, c.id)} onDragEnd={handleDragEnd}
                                    style={{
                                        background: draggingId === c.id ? 'rgba(255,215,0,0.15)' : 'rgba(255,215,0,0.07)',
                                        border: '1px solid rgba(255,215,0,0.25)', borderRadius: '8px',
                                        padding: '7px 10px', cursor: 'grab', display: 'flex', alignItems: 'center', gap: '8px',
                                        opacity: condition?.id === c.id ? 0.4 : 1, transition: 'all 0.15s', userSelect: 'none',
                                    }}>
                                    <span>{c.icon}</span>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#f0f2f5' }}>{c.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="panel-card" style={{ padding: '1rem' }}>
                        <div style={{ fontSize: '0.62rem', color: '#2bd4c6', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
                            🎬 Actions
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {ACTIONS.map(a => (
                                <div key={a.id} draggable onDragStart={(e) => handleDragStart(e, a.id)} onDragEnd={handleDragEnd}
                                    style={{
                                        background: draggingId === a.id ? 'rgba(43,212,198,0.15)' : 'rgba(43,212,198,0.07)',
                                        border: '1px solid rgba(43,212,198,0.25)', borderRadius: '8px',
                                        padding: '7px 10px', cursor: 'grab', display: 'flex', alignItems: 'center', gap: '8px',
                                        opacity: action?.id === a.id ? 0.4 : 1, transition: 'all 0.15s', userSelect: 'none',
                                    }}>
                                    <span>{a.icon}</span>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#f0f2f5' }}>{a.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Builder Canvas */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {/* Canvas */}
                    <div className="panel-card" style={{
                        padding: '2rem', minHeight: '440px',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start',
                        background: 'radial-gradient(ellipse at center, rgba(43,212,198,0.03) 0%, transparent 70%)',
                    }}>
                        <div style={{ fontSize: '0.62rem', color: '#8b92a5', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '1.5rem', fontWeight: 700 }}>
                            ⚡ Automation Flow Canvas — Drag nodes here to connect
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
                            {/* Trigger Drop Zone */}
                            <div {...makeDrop(TRIGGERS, setTrigger)} style={{
                                minWidth: '220px',
                                border: trigger ? 'none' : '2px dashed rgba(249,62,62,0.4)',
                                borderRadius: '12px', padding: trigger ? 0 : '1.5rem',
                                background: trigger ? 'transparent' : 'rgba(249,62,62,0.05)',
                                textAlign: 'center', color: '#f93e3e', fontSize: '0.8rem',
                                transition: 'all 0.2s',
                            }}>
                                {trigger
                                    ? <NodeCard type="trigger" item={trigger} onRemove={() => { setTrigger(null); setDeployed(false); }} />
                                    : <span>Drop TRIGGER here<br /><span style={{ fontSize: '0.7rem', color: '#8b92a5' }}>🌡️ FortyGuard API condition</span></span>
                                }
                            </div>

                            {trigger && <ConnectionLine color="#f93e3e" />}

                            {/* Condition Drop Zone */}
                            <div {...makeDrop(CONDITIONS, setCondition)} style={{
                                minWidth: '220px',
                                border: condition ? 'none' : `2px dashed rgba(255,215,0,${trigger ? '0.5' : '0.2'})`,
                                borderRadius: '12px', padding: condition ? 0 : '1.5rem',
                                background: condition ? 'transparent' : 'rgba(255,215,0,0.04)',
                                textAlign: 'center', color: trigger ? '#ffd700' : '#8b92a5', fontSize: '0.8rem',
                                opacity: trigger ? 1 : 0.4, transition: 'all 0.2s', pointerEvents: trigger ? 'auto' : 'none',
                            }}>
                                {condition
                                    ? <NodeCard type="condition" item={condition} onRemove={() => { setCondition(null); setDeployed(false); }} />
                                    : <span>Drop CONDITION here<br /><span style={{ fontSize: '0.7rem', color: '#8b92a5' }}>📍 Location / asset filter</span></span>
                                }
                            </div>

                            {condition && <ConnectionLine color="#ffd700" />}

                            {/* Action Drop Zone */}
                            <div {...makeDrop(ACTIONS, setAction)} style={{
                                minWidth: '220px',
                                border: action ? 'none' : `2px dashed rgba(43,212,198,${condition ? '0.5' : '0.2'})`,
                                borderRadius: '12px', padding: action ? 0 : '1.5rem',
                                background: action ? 'transparent' : 'rgba(43,212,198,0.04)',
                                textAlign: 'center', color: condition ? '#2bd4c6' : '#8b92a5', fontSize: '0.8rem',
                                opacity: condition ? 1 : 0.4, transition: 'all 0.2s', pointerEvents: condition ? 'auto' : 'none',
                            }}>
                                {action
                                    ? <NodeCard type="action" item={action} onRemove={() => { setAction(null); setDeployed(false); }} />
                                    : <span>Drop ACTION here<br /><span style={{ fontSize: '0.7rem', color: '#8b92a5' }}>🎬 Enterprise integration</span></span>
                                }
                            </div>
                        </div>

                        {/* Deploy button */}
                        <div style={{ marginTop: '2rem' }}>
                            <button onClick={deployFlow} disabled={!isReady || deploying}
                                style={{
                                    background: isReady ? 'linear-gradient(135deg, #2bd4c6 0%, #3b82f6 100%)' : 'rgba(255,255,255,0.05)',
                                    border: 'none', borderRadius: '10px', padding: '0.85rem 2.5rem',
                                    color: isReady ? '#000' : '#8b92a5', fontWeight: 800, fontSize: '0.95rem',
                                    cursor: isReady && !deploying ? 'pointer' : 'not-allowed',
                                    boxShadow: isReady ? '0 4px 20px rgba(43,212,198,0.4)' : 'none',
                                    transition: 'all 0.2s',
                                }}>
                                {deploying ? '⚙️ Deploying…' : deployed ? '✅ Deployed!' : '🚀 Deploy Automation'}
                            </button>
                            {!isReady && <div style={{ fontSize: '0.7rem', color: '#8b92a5', textAlign: 'center', marginTop: '8px' }}>Add all 3 nodes to enable deployment</div>}
                        </div>
                    </div>

                    {/* Deployed success payload */}
                    {deployed && trigger && condition && action && (
                        <div className="panel-card" style={{ padding: '1.25rem', borderColor: 'rgba(43,212,198,0.3)', background: 'rgba(43,212,198,0.05)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2bd4c6', boxShadow: '0 0 10px #2bd4c6' }}></div>
                                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2bd4c6' }}>Automation Deployed — Live HTTP Execution</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.62rem', color: '#8b92a5', marginBottom: '4px', textTransform: 'uppercase' }}>POST /v1/workflow/deploy</div>
                                    <pre style={{ margin: 0, fontSize: '0.68rem', color: '#4ade80', background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '6px', lineHeight: 1.6 }}>
                                        {`{
  "trigger": {
    "type": "FortyGuardAPI",
    "condition": "${trigger.label}"
  },
  "filter": {
    "location": "${condition.label}"
  },
  "action": {
    "type": "${action.icon} ${action.label}",
    "endpoint": "POST /enterprise/webhook"
  },
  "auth": {
    "fortyguard_key": "06ec39d162e2a3fc5bc6291986c41b84"
  },
  "status": "active",
  "credits_used": 1
}`}
                                    </pre>
                                </div>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                        <div style={{ fontSize: '0.62rem', color: '#8b92a5', textTransform: 'uppercase' }}>
                                            Live Echo Response — {liveResponse?.status || 200} OK
                                        </div>
                                        <a href="https://httpbin.org" target="_blank" rel="noreferrer" style={{ fontSize: '0.6rem', color: '#8b92a5', textDecoration: 'underline' }}>Powered by HTTPBin</a>
                                    </div>
                                    <pre style={{ margin: 0, fontSize: '0.68rem', color: '#93c5fd', background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '6px', lineHeight: 1.6, overflowX: 'auto', maxHeight: '200px' }}>
                                        {liveResponse ? JSON.stringify(liveResponse, null, 2) : 'Awaiting network...'}
                                    </pre>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '0.75rem', color: '#8b92a5' }}>
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2bd4c6', boxShadow: '0 0 8px #2bd4c6' }}></div>
                                Automation running — monitoring FortyGuard stream for trigger condition: <strong style={{ color: '#f93e3e' }}>{trigger.label}</strong>
                                &nbsp;at&nbsp; <strong style={{ color: '#ffd700' }}>{condition.label}</strong>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HeatWorkflows;
