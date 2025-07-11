import React, { useState } from 'react';
import data from '../data/data.json';
import LegendControls from './LegendControls';
import MainChart from './MainChart';
import CalculatorPanel from './CalculatorPanel';
import InterestRateSection from './InterestRateSection';
import SummaryCards from './SummaryCards';
import DataTable from './DataTable';

const Dashboard: React.FC = () => {
  const {
    quarters,
    interestRateMonthlyData,
    interestRateQuarterlyData,
    rawData,
    metricColors
  } = data;

  const initialSelection = Object.keys(metricColors).reduce((acc, key) => ({
    ...acc,
    [key]: true
  }), {} as Record<string, boolean>);

  const [selectedMetrics, setSelectedMetrics] = useState(initialSelection);
  const [fromQuarter, setFromQuarter] = useState(quarters[0]);
  const [toQuarter, setToQuarter] = useState(quarters[quarters.length - 1]);

  const toggleMetric = (m: string) => {
    setSelectedMetrics(prev => ({ ...prev, [m]: !prev[m] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header, MainChart, CalculatorPanel, InterestRateSection, SummaryCards, DataTable */}
      <LegendControls
        selectedMetrics={selectedMetrics}
        toggleMetric={toggleMetric}
        metricColors={metricColors}
      />
      <MainChart
        rawData={rawData}
        selectedMetrics={selectedMetrics}
        metricColors={metricColors}
      />
      <CalculatorPanel
        quarters={quarters}
        rawData={rawData}
        selectedMetrics={selectedMetrics}
        fromQuarter={fromQuarter}
        toQuarter={toQuarter}
        setFromQuarter={setFromQuarter}
        setToQuarter={setToQuarter}
        metricColors={metricColors}
      />
      <InterestRateSection
        monthly={interestRateMonthlyData}
        quarterly={interestRateQuarterlyData}
      />
      <SummaryCards data={{ monthly: interestRateMonthlyData, quarterly: interestRateQuarterlyData }} />
      <DataTable rawData={rawData} selectedMetrics={selectedMetrics} />
    </div>
  );
};

export default Dashboard;
