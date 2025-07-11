import React from 'react';
import { InterestData } from '../types';

interface SummaryCardsProps {
  data: {
    monthly: InterestData[];
    quarterly: InterestData[];
  };
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ data }) => {
  const lastMonthly = data.monthly[data.monthly.length - 1];
  const lastQuarterly = data.quarterly[data.quarterly.length - 1];

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white p-4 shadow rounded">
        <h4 className="font-medium">Ostatnia mediana (miesięcznie)</h4>
        <p className="text-2xl">{lastMonthly.Median}%</p>
        <p className="text-sm">Respondenci: {lastMonthly.respondents}</p>
      </div>
      <div className="bg-white p-4 shadow rounded">
        <h4 className="font-medium">Ostatnia mediana (kwartalnie)</h4>
        <p className="text-2xl">{lastQuarterly.Median}%</p>
        <p className="text-sm">Respondenci: {lastQuarterly.respondents}</p>
      </div>
    </div>
  );
};

export default SummaryCards;
