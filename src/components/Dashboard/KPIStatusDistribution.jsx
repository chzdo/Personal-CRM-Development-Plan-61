import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

function KPIStatusDistribution({ onTrack, belowTarget, aboveTarget }) {
  const data = [
    { name: 'On Track', value: onTrack, color: '#10B981' },
    { name: 'Below Target', value: belowTarget, color: '#EF4444' },
    { name: 'Above Target', value: aboveTarget, color: '#8B5CF6' },
  ];

  const COLORS = ['#10B981', '#EF4444', '#8B5CF6'];

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [`${value} KPIs`, name]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default KPIStatusDistribution;