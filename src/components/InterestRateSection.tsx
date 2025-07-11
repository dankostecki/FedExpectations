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
import { InterestData } from '../types';

interface InterestRateSectionProps {
  monthly: InterestData[];
  quarterly: InterestData[];
}

const InterestRateSection: React.FC<InterestRateSectionProps> = ({ monthly, quarterly }) => (
  <div className="p-4">
    <h2 className="text-lg font-semibold mb-4">Prognozy stóp procentowych</h2>
    <div className="grid md:grid-cols-2 gap-4">
      <div className="bg-white p-4 shadow rounded">
        <h3 className="font-medium mb-2">Miesięcznie</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={monthly}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="Median" stroke="#3B82F6" dot />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white p-4 shadow rounded">
        <h3 className="font-medium mb-2">Kwartalnie</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={quarterly}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="Median" stroke="#10B981" dot />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

export default InterestRateSection;
