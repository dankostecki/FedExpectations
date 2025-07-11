import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line
} from 'recharts';
import { RawDataPoint } from '../types';

interface MainChartProps {
  rawData: RawDataPoint[];
  selectedMetrics: Record<string, boolean>;
  metricColors: Record<string, string>;
}

const MainChart: React.FC<MainChartProps> = ({ rawData, selectedMetrics, metricColors }) => (
  <div className="w-full h-64 p-4 bg-white shadow rounded">
    <ResponsiveContainer>
      <LineChart data={rawData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="quarter" />
        <YAxis />
        <Tooltip />
        {Object.keys(selectedMetrics).map(metric => (
          selectedMetrics[metric] && (
            <Line
              key={metric}
              type="monotone"
              dataKey={metric}
              stroke={metricColors[metric]}
              dot={false}
            />
          )
        ))}
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default MainChart;
