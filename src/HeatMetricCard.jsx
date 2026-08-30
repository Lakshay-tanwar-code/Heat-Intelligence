import React from 'react';
import './HeatMetricCard.css';

export function HeatMetricCard({ title, value, unit, status, trend }) {
  const getStatusClass = () => {
    if (status === 'Critical') return 'status-critical';
    if (status === 'Warning') return 'status-warning';
    return 'status-normal';
  };

  return (
    <div className="heat-metric-card">
      <div className="hmc-header">
        <span className="hmc-title">{title}</span>
        <span className={`hmc-badge ${getStatusClass()}`}>
          {status}
        </span>
      </div>
      <div className="hmc-body">
        <span className="hmc-value">{value}</span>
        <span className="hmc-unit">{unit}</span>
      </div>
      <p className="hmc-trend">{trend}</p>
    </div>
  );
}
