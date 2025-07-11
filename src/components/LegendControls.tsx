import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface LegendControlsProps {
  selectedMetrics: Record<string, boolean>;
  toggleMetric: (metric: string) => void;
  metricColors: Record<string, string>;
}

const LegendControls: React.FC<LegendControlsProps> = ({ selectedMetrics, toggleMetric, metricColors }) => (
  <div className="flex flex-wrap p-4">
    {Object.keys(metricColors).map(metric => (
      <button
        key={metric}
        onClick={() => toggleMetric(metric)}
        className="flex items-center m-2 space-x-1 focus:outline-none"
      >
        {selectedMetrics[metric]
          ? <Eye color={metricColors[metric]} />
          : <EyeOff color={metricColors[metric]} />}
        <span className="text-sm">{metric}</span>
      </button>
    ))}
  </div>
);

export default LegendControls;
