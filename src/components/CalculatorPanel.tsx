import React from 'react';
import { RawDataPoint } from '../types';

interface CalculatorPanelProps {
  quarters: string[];
  rawData: RawDataPoint[];
  selectedMetrics: Record<string, boolean>;
  fromQuarter: string;
  toQuarter: string;
  setFromQuarter: (q: string) => void;
  setToQuarter: (q: string) => void;
  metricColors: Record<string, string>;
}

const CalculatorPanel: React.FC<CalculatorPanelProps> = ({
  quarters,
  rawData,
  selectedMetrics,
  fromQuarter,
  toQuarter,
  setFromQuarter,
  setToQuarter,
  metricColors
}) => {
  const fromData = rawData.find(d => d.quarter === fromQuarter);
  const toData = rawData.find(d => d.quarter === toQuarter);

  const calculations = fromData && toData
    ? Object.keys(selectedMetrics)
        .filter(m => selectedMetrics[m])
        .map(metric => ({
          metric,
          from: (fromData[metric] as number) || 0,
          to: (toData[metric] as number) || 0,
          diff: (((toData[metric] as number) || 0) - ((fromData[metric] as number) || 0)).toFixed(2)
        }))
    : [];

  return (
    <div className="p-4 bg-white shadow rounded m-4">
      <div className="flex space-x-4">
        <select
          value={fromQuarter}
          onChange={e => setFromQuarter(e.target.value)}
          className="p-2 border rounded"
        >
          {quarters.map(q => <option key={q} value={q}>{q}</option>)}
        </select>
        <select
          value={toQuarter}
          onChange={e => setToQuarter(e.target.value)}
          className="p-2 border rounded"
        >
          {quarters.map(q => <option key={q} value={q}>{q}</option>)}
        </select>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {calculations.map(c => (
          <div
            key={c.metric}
            className="p-2 border-l-4"
            style={{ borderColor: metricColors[c.metric] }}
          >
            <h4 className="font-medium">{c.metric}</h4>
            <p>{c.from} → {c.to} (<strong>{c.diff}</strong>)</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalculatorPanel;
