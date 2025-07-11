import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, Calculator, Eye, EyeOff, Download, Calendar } from 'lucide-react';
import data from '../data/data.json';

const FedDashboard = () => {
  const {
    quarters,
    interestRateMonthlyData,
    interestRateQuarterlyData,
    rawData,
    metricColors
  } = data;

  const [selectedMetrics, setSelectedMetrics] = useState({
    'Skarbowe Papiery SOMA': true,
    'MBS SOMA': true,
    'Aktywa Fed (Suma)': true,
    'Rezerwy': true,
    'Waluta w Obiegu': true,
    'Overnight Reverse Repo': true,
    'Konto Skarbu Państwa': true
  });

  const [fromQuarter, setFromQuarter] = useState(quarters[0]);
  const [toQuarter, setToQuarter] = useState(quarters[quarters.length - 1]);

  const toggleMetric = (metric) => {
    setSelectedMetrics(prev => ({
      ...prev,
      [metric]: !prev[metric]
    }));
  };

  const calculateChange = (metric) => {
    const fromData = rawData.find(d => d.quarter === fromQuarter);
    const toData = rawData.find(d => d.quarter === toQuarter);
    
    if (!fromData || !toData || fromData[metric] === null || toData[metric] === null) {
      return { change: null, percentage: null };
    }
    
    const change = toData[metric] - fromData[metric];
    const percentage = ((change / fromData[metric]) * 100);
    
    return { change, percentage };
  };

  const getQuarterlyChanges = () => {
    const changes = [];
    Object.keys(selectedMetrics).forEach(metric => {
      if (selectedMetrics[metric]) {
        const { change, percentage } = calculateChange(metric);
        if (change !== null) {
          changes.push({
            metric,
            change,
            percentage,
            color: metricColors[metric]
          });
        }
      }
    });
    return changes.sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
  };

  const getYAxisDomain = () => {
    const visibleMetrics = Object.keys(selectedMetrics).filter(metric => selectedMetrics[metric]);
    
    if (visibleMetrics.length === 0) return [0, 100];
    
    let min = Infinity;
    let max = -Infinity;
    
    rawData.forEach(dataPoint => {
      visibleMetrics.forEach(metric => {
        const value = dataPoint[metric];
        if (value !== null && value !== undefined) {
          min = Math.min(min, value);
          max = Math.max(max, value);
        }
      });
    });
    
    if (min === Infinity || max === -Infinity) return [0, 100];
    
    // Dodaj margines 5% na górze i dole
    const margin = (max - min) * 0.05;
    return [Math.max(0, min - margin), max + margin];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Fed Expectations Dashboard</h1>
              <p className="text-gray-600 mt-1">Analizy kwartalne oczekiwań Rezerwy Federalnej (mediana)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Chart */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Wszystkie wskaźniki Fed</h2>
            <div className="text-sm text-gray-500">
              Kliknij na legendę aby włączyć/wyłączyć serie
            </div>
          </div>
          
          {/* Legend Controls */}
          <div className="flex flex-wrap gap-3 mb-6">
            {Object.keys(selectedMetrics).map(metric => (
              <button
                key={metric}
                onClick={() => toggleMetric(metric)}
                className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedMetrics[metric]
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}
              >
                {selectedMetrics[metric] ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: metricColors[metric] }}></div>
                {metric}
              </button>
            ))}
          </div>

          <div style={{ width: '100%', height: '500px' }}>
            <ResponsiveContainer>
              <LineChart data={rawData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="quarter" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                  tickFormatter={(value) => `${value}`}
                  domain={getYAxisDomain()}
                />
                <Tooltip 
                  formatter={(value, name) => [value ? `${value.toLocaleString()} mld USD` : 'N/A', name]}
                  labelStyle={{ color: '#374151' }}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                {Object.keys(selectedMetrics).map(metric => 
                  selectedMetrics[metric] && (
                    <Line
                      key={metric}
                      type="monotone"
                      dataKey={metric}
                      stroke={metricColors[metric]}
                      strokeWidth={2}
                      dot={{ fill: metricColors[metric], strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: metricColors[metric], strokeWidth: 2 }}
                      connectNulls={false}
                    />
                  )
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Calculator Panel */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Kalkulator zmian między kwartałami</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kwartał początkowy</label>
              <select
                value={fromQuarter}
                onChange={(e) => setFromQuarter(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {quarters.map(quarter => (
                  <option key={quarter} value={quarter}>{quarter}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kwartał końcowy</label>
              <select
                value={toQuarter}
                onChange={(e) => setToQuarter(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {quarters.map(quarter => (
                  <option key={quarter} value={quarter}>{quarter}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Changes Table */}
          <div className="mt-6">
            <h4 className="text-md font-medium text-gray-900 mb-3">Zmiany w wybranym okresie</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {getQuarterlyChanges().map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm font-medium text-gray-700">{item.metric}</span>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-semibold ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {item.change >= 0 ? '+' : ''}{item.change.toFixed(0)} mld USD
                    </div>
                    <div className={`text-xs ${item.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {item.percentage >= 0 ? '+' : ''}{item.percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interest Rates Section */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Oczekiwania stóp procentowych Fed</h2>
            <p className="text-gray-600">Przewidywania uczestników rynku dotyczące przyszłych stóp procentowych</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Monthly Interest Rates Chart */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Oczekiwania miesięczne</h3>
              <div style={{ width: '100%', height: '400px' }}>
                <ResponsiveContainer>
                  <LineChart data={interestRateMonthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="period" 
                      stroke="#6b7280"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#6b7280"
                      fontSize={12}
                      tickFormatter={(value) => `${Number(value).toFixed(2)}%`}
                      domain={['dataMin - 0.1', 'dataMax + 0.1']}
                    />
                    <Tooltip 
                      formatter={(value, name) => [`${Number(value).toFixed(2)}%`, name]}
                      labelStyle={{ color: '#374151' }}
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="25th Percentile"
                      stroke="#F59E0B"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#F59E0B', strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Median"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 5 }}
                      activeDot={{ r: 7, stroke: '#3B82F6', strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="75th Percentile"
                      stroke="#10B981"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-xs text-gray-500">
                Dane miesięczne • Respondenci: 54 • Mediana oznacza środkową wartość oczekiwań
              </div>
            </div>

            {/* Quarterly Interest Rates Chart */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Oczekiwania kwartalne</h3>
              <div style={{ width: '100%', height: '400px' }}>
                <ResponsiveContainer>
                  <LineChart data={interestRateQuarterlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="period" 
                      stroke="#6b7280"
                      fontSize={11}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis 
                      stroke="#6b7280"
                      fontSize={12}
                      tickFormatter={(value) => `${Number(value).toFixed(2)}%`}
                      domain={['dataMin - 0.1', 'dataMax + 0.1']}
                    />
                    <Tooltip 
                      formatter={(value, name) => [`${Number(value).toFixed(2)}%`, name]}
                      labelStyle={{ color: '#374151' }}
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="25th Percentile"
                      stroke="#F59E0B"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#F59E0B', strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Median"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 5 }}
                      activeDot={{ r: 7, stroke: '#3B82F6', strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="75th Percentile"
                      stroke="#10B981"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-xs text-gray-500">
                Dane kwartalne • Respondenci: 47-54 • Trend spadkowy do 2027, następnie stabilizacja
              </div>
            </div>
          </div>

          {/* Summary Cards for Interest Rates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Obecne oczekiwania</p>
                  <p className="text-2xl font-bold text-blue-900">4.38%</p>
                  <p className="text-sm text-blue-600">Jun-Jul 2025</p>
                </div>
                <TrendingDown className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700">Następne posiedzenie</p>
                  <p className="text-2xl font-bold text-orange-900">4.13%</p>
                  <p className="text-sm text-orange-600">Sep 2025</p>
                  <p className="text-xs text-orange-500">-0.25pp vs obecne</p>
                </div>
                <Calendar className="w-8 h-8 text-orange-600" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Cel długoterminowy</p>
                  <p className="text-2xl font-bold text-green-900">3.13%</p>
                  <p className="text-sm text-green-600">2028-2029</p>
                </div>
                <TrendingDown className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Spadek oczekiwany</p>
                  <p className="text-2xl font-bold text-purple-900">1.25pp</p>
                  <p className="text-sm text-purple-600">od Jun 2025 do 2029</p>
                </div>
                <Calculator className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Szczegółowe dane</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kwartał
                  </th>
                  {Object.keys(selectedMetrics).filter(metric => selectedMetrics[metric]).map(metric => (
                    <th key={metric} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {metric}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rawData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {row.quarter}
                    </td>
                    {Object.keys(selectedMetrics).filter(metric => selectedMetrics[metric]).map(metric => (
                      <td key={metric} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {row[metric] !== null ? `${row[metric].toLocaleString()} mld` : 'N/A'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FedDashboard;
