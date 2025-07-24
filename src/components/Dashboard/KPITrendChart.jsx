import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

function KPITrendChart({ kpis }) {
  // If no KPIs provided, show placeholder data
  if (!kpis || kpis.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        No KPI data available
      </div>
    );
  }

  // Generate chart data for multiple KPIs
  const chartData = kpis[0].data.map((item, index) => {
    const dataPoint = { month: item.month };
    
    // Add each KPI as a line in the chart
    kpis.forEach(kpi => {
      // Normalize value to percentage of target for better comparison
      const kpiData = kpi.data[index];
      if (kpiData) {
        const normalizedValue = (kpiData.actual / kpiData.target) * 100;
        dataPoint[kpi.name] = Math.round(normalizedValue);
      }
    });
    
    return dataPoint;
  });

  // Generate unique colors for each KPI
  const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'];

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(value) => `${value}%`} />
          <Tooltip formatter={(value) => [`${value}%`, 'Performance']} />
          <Legend />
          {kpis.map((kpi, index) => (
            <Area
              key={kpi.id}
              type="monotone"
              dataKey={kpi.name}
              stroke={colors[index % colors.length]}
              fill={colors[index % colors.length]}
              fillOpacity={0.2}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default KPITrendChart;