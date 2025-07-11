import React from 'react';
import { RawDataPoint } from '../types';

interface DataTableProps {
  rawData: RawDataPoint[];
  selectedMetrics: Record<string, boolean>;
}

const DataTable: React.FC<DataTableProps> = ({ rawData, selectedMetrics }) => {
  const metrics = Object.keys(selectedMetrics).filter(m => selectedMetrics[m]);

  return (
    <div className="p-4 overflow-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Kwartał</th>
            {metrics.map(metric => (
              <th key={metric} className="px-4 py-2 text-left">{metric}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rawData.map(row => (
            <tr key={row.quarter} className="border-t">
              <td className="px-4 py-2">{row.quarter}</td>
              {metrics.map(metric => (
                <td key={metric} className="px-4 py-2 text-right">
                  {row[metric] != null ? row[metric] : '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
